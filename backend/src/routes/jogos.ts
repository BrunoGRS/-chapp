import { Router } from "express";

import { env } from "../config/env";
import { FootballDataError, fetchFootballData } from "../lib/football-data";
import { requireAuth } from "../middleware/auth";

const jogosRouter = Router();

type JsonRecord = Record<string, unknown>;
type StandingForm = "up" | "down" | "stable";
type RecentForm = "W" | "D" | "L";
type MatchPerspective = "home" | "away";
type TeamRecentForms = Record<string, RecentForm[]>;

type FeaturedMatch = {
  id: string;
  homeTeam: string;
  homeTeamCrest: string | null;
  awayTeam: string;
  awayTeamCrest: string | null;
  homeScore: number;
  awayScore: number;
  status: string;
  matchTime: string;
  venue: string;
  sortKey: number;
};

type RecentResult = {
  id: string;
  opponent: string;
  opponentCrest: string | null;
  perspective: MatchPerspective;
  teamScore: number;
  opponentScore: number;
  result: RecentForm;
  status: string;
  matchTime: string;
  venue: string;
  sortKey: number;
};

type JogosOverviewResponse = {
  competition: string;
  updatedAt: string;
  featuredMatches: Omit<FeaturedMatch, "sortKey">[];
  recentResults: Omit<RecentResult, "sortKey">[];
  standings: {
    position: number;
    team: string;
    crest: string | null;
    points: number;
    games: number;
    goalsAgainst: number;
    goalDifference: number;
    form: StandingForm;
    lastFive: RecentForm[];
  }[];
};

type MatchesCacheValue = {
  competition: string;
  featuredMatches: Omit<FeaturedMatch, "sortKey">[];
  recentResults: Omit<RecentResult, "sortKey">[];
  teamRecentForms: TeamRecentForms;
  updatedAt: string;
};

type CachedStanding = JogosOverviewResponse["standings"][number] & {
  teamKey: string | null;
};

type StandingsCacheValue = {
  competition: string;
  standings: CachedStanding[];
  updatedAt: string;
};

const MATCHES_CACHE_TTL_MS = 60 * 60 * 1000;
const STANDINGS_CACHE_TTL_MS = 12 * 60 * 60 * 1000;

let matchesCache: {
  data: MatchesCacheValue;
  expiresAt: number;
} | null = null;

let standingsCache: {
  data: StandingsCacheValue;
  expiresAt: number;
} | null = null;

function toRecord(value: unknown): JsonRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as JsonRecord;
}

function toArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function toStringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function toNumberValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  return null;
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}

function getTeamAliases(teamName: string): string[] {
  const aliases = [teamName];
  const normalized = normalizeText(teamName);

  if (normalized === "chapecoense") {
    aliases.push("chapecoense af", "associacao chapecoense de futebol");
  }

  return aliases.map(normalizeText);
}

function isTargetTeam(name: string, aliases: string[]): boolean {
  const normalized = normalizeText(name);
  return aliases.some((alias) => normalized === alias || normalized.includes(alias) || alias.includes(normalized));
}

function getTeamKey(team: JsonRecord | null): string | null {
  const teamId = toNumberValue(team?.id);

  if (teamId !== null) {
    return `id:${teamId}`;
  }

  const teamName = toStringValue(team?.name) ?? toStringValue(team?.shortName);

  if (!teamName) {
    return null;
  }

  return `name:${normalizeText(teamName)}`;
}

function filterTargetMatches(matches: JsonRecord[], aliases: string[]) {
  return matches.filter((match) => {
    const homeTeam = toRecord(match.homeTeam);
    const awayTeam = toRecord(match.awayTeam);
    const homeName = toStringValue(homeTeam?.name) ?? "";
    const awayName = toStringValue(awayTeam?.name) ?? "";

    return isTargetTeam(homeName, aliases) || isTargetTeam(awayName, aliases);
  });
}

function formatMatchTime(date: Date | null): string {
  if (!date) {
    return "Data indisponível";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

function getMatchStatus(status: string | null): string {
  switch (status) {
    case "IN_PLAY":
    case "PAUSED":
      return "Ao vivo";
    case "FINISHED":
      return "Encerrado";
    case "SCHEDULED":
    case "TIMED":
      return "Próximo jogo";
    case "POSTPONED":
      return "Adiado";
    case "CANCELLED":
      return "Cancelado";
    default:
      return status ?? "Agendado";
  }
}

function parseFormTrend(form: unknown): StandingForm {
  if (typeof form !== "string" || !form.trim()) {
    return "stable";
  }

  const tokens = form.split(/[,\s]+/).filter(Boolean);
  const lastToken = tokens.at(-1)?.toUpperCase();

  if (lastToken === "W") {
    return "up";
  }

  if (lastToken === "L") {
    return "down";
  }

  return "stable";
}

function parseRecentForm(form: unknown): RecentForm[] {
  if (typeof form !== "string" || !form.trim()) {
    return [];
  }

  return form
    .split(/[,\s]+/)
    .map((token) => token.trim().toUpperCase())
    .filter((token): token is RecentForm => token === "W" || token === "D" || token === "L")
    .slice(-5);
}

function getStandingFormFromRecent(lastFive: RecentForm[], fallback: StandingForm): StandingForm {
  const latest = lastFive.at(-1);

  if (latest === "W") {
    return "up";
  }

  if (latest === "L") {
    return "down";
  }

  if (latest === "D") {
    return "stable";
  }

  return fallback;
}

function toFeaturedMatch(match: JsonRecord): FeaturedMatch {
  const homeTeam = toRecord(match.homeTeam);
  const awayTeam = toRecord(match.awayTeam);
  const score = toRecord(match.score);
  const fullTime = toRecord(score?.fullTime);
  const utcDate = toStringValue(match.utcDate);
  const parsedDate = utcDate ? new Date(utcDate) : null;
  const id = toNumberValue(match.id) ?? `${toStringValue(homeTeam?.name) ?? "home"}-${toStringValue(awayTeam?.name) ?? "away"}-${utcDate ?? "sem-data"}`;

  return {
    id: String(id),
    homeTeam: toStringValue(homeTeam?.shortName) ?? toStringValue(homeTeam?.name) ?? "Mandante",
    homeTeamCrest: toStringValue(homeTeam?.crest),
    awayTeam: toStringValue(awayTeam?.shortName) ?? toStringValue(awayTeam?.name) ?? "Visitante",
    awayTeamCrest: toStringValue(awayTeam?.crest),
    homeScore: toNumberValue(fullTime?.home) ?? 0,
    awayScore: toNumberValue(fullTime?.away) ?? 0,
    status: getMatchStatus(toStringValue(match.status)),
    matchTime: formatMatchTime(parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : null),
    venue: toStringValue(match.venue) ?? "Local indisponível",
    sortKey: parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate.getTime() : 0,
  };
}

function getPerspective(match: JsonRecord, aliases: string[]): MatchPerspective | null {
  const homeTeam = toRecord(match.homeTeam);
  const awayTeam = toRecord(match.awayTeam);
  const homeName = toStringValue(homeTeam?.name) ?? "";
  const awayName = toStringValue(awayTeam?.name) ?? "";

  if (isTargetTeam(homeName, aliases)) {
    return "home";
  }

  if (isTargetTeam(awayName, aliases)) {
    return "away";
  }

  return null;
}

function getResultFromScore(teamScore: number, opponentScore: number): RecentForm {
  if (teamScore > opponentScore) {
    return "W";
  }

  if (teamScore < opponentScore) {
    return "L";
  }

  return "D";
}

function toRecentResult(match: JsonRecord, aliases: string[]): RecentResult | null {
  const perspective = getPerspective(match, aliases);

  if (!perspective) {
    return null;
  }

  const homeTeam = toRecord(match.homeTeam);
  const awayTeam = toRecord(match.awayTeam);
  const score = toRecord(match.score);
  const fullTime = toRecord(score?.fullTime);
  const utcDate = toStringValue(match.utcDate);
  const parsedDate = utcDate ? new Date(utcDate) : null;
  const homeScore = toNumberValue(fullTime?.home) ?? 0;
  const awayScore = toNumberValue(fullTime?.away) ?? 0;
  const id =
    toNumberValue(match.id) ??
    `${toStringValue(homeTeam?.name) ?? "home"}-${toStringValue(awayTeam?.name) ?? "away"}-${utcDate ?? "sem-data"}`;

  const opponentTeam = perspective === "home" ? awayTeam : homeTeam;
  const teamScore = perspective === "home" ? homeScore : awayScore;
  const opponentScore = perspective === "home" ? awayScore : homeScore;

  return {
    id: String(id),
    opponent: toStringValue(opponentTeam?.shortName) ?? toStringValue(opponentTeam?.name) ?? "Adversário",
    opponentCrest: toStringValue(opponentTeam?.crest),
    perspective,
    teamScore,
    opponentScore,
    result: getResultFromScore(teamScore, opponentScore),
    status: getMatchStatus(toStringValue(match.status)),
    matchTime: formatMatchTime(parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : null),
    venue: toStringValue(match.venue) ?? "Local indisponível",
    sortKey: parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate.getTime() : 0,
  };
}

function buildFeaturedMatches(matches: JsonRecord[]) {
  const mappedMatches = matches.map(toFeaturedMatch);
  const now = Date.now();

  const liveMatch = mappedMatches
    .filter((match) => match.status === "Ao vivo")
    .sort((a, b) => a.sortKey - b.sortKey)
    .at(0);
  const previousMatch = mappedMatches
    .filter((match) => match.sortKey <= now && match.status !== "Ao vivo")
    .sort((a, b) => b.sortKey - a.sortKey)
    .at(0);
  const nextMatches = mappedMatches
    .filter((match) => match.sortKey > now)
    .sort((a, b) => a.sortKey - b.sortKey)
    .slice(0, 2);

  const uniqueMatches = new Map<string, Omit<FeaturedMatch, "sortKey">>();

  for (const match of [liveMatch, previousMatch, ...nextMatches]) {
    if (!match) {
      continue;
    }

    const { sortKey: _sortKey, ...safeMatch } = match;
    if (!uniqueMatches.has(safeMatch.id)) {
      uniqueMatches.set(safeMatch.id, safeMatch);
    }
  }

  return [...uniqueMatches.values()];
}

function buildRecentResults(matches: JsonRecord[], aliases: string[]) {
  return matches
    .filter((match) => {
      const status = toStringValue(match.status)?.toUpperCase();
      return status === "FINISHED";
    })
    .map((match) => toRecentResult(match, aliases))
    .filter((result): result is RecentResult => result !== null)
    .sort((a, b) => b.sortKey - a.sortKey)
    .slice(0, 5)
    .map(({ sortKey: _sortKey, ...safeResult }) => safeResult);
}

function buildTeamRecentForms(matches: JsonRecord[]): TeamRecentForms {
  const formsByTeam = new Map<string, { sortKey: number; result: RecentForm }[]>();

  for (const match of matches) {
    const status = toStringValue(match.status)?.toUpperCase();

    if (status !== "FINISHED") {
      continue;
    }

    const homeTeam = toRecord(match.homeTeam);
    const awayTeam = toRecord(match.awayTeam);
    const homeKey = getTeamKey(homeTeam);
    const awayKey = getTeamKey(awayTeam);
    const score = toRecord(match.score);
    const fullTime = toRecord(score?.fullTime);
    const homeScore = toNumberValue(fullTime?.home);
    const awayScore = toNumberValue(fullTime?.away);
    const utcDate = toStringValue(match.utcDate);
    const sortKey = utcDate ? new Date(utcDate).getTime() : 0;

    if (!homeKey || !awayKey || homeScore === null || awayScore === null) {
      continue;
    }

    const homeResult = getResultFromScore(homeScore, awayScore);
    const awayResult = getResultFromScore(awayScore, homeScore);

    formsByTeam.set(homeKey, [...(formsByTeam.get(homeKey) ?? []), { sortKey, result: homeResult }]);
    formsByTeam.set(awayKey, [...(formsByTeam.get(awayKey) ?? []), { sortKey, result: awayResult }]);
  }

  return Object.fromEntries(
    [...formsByTeam.entries()].map(([teamKey, values]) => [
      teamKey,
      values
        .sort((a, b) => b.sortKey - a.sortKey)
        .slice(0, 5)
        .reverse()
        .map((entry) => entry.result),
    ])
  );
}

function buildStandings(payload: unknown) {
  const record = toRecord(payload);
  const standings = toArray(record?.standings)
    .map((entry) => toRecord(entry))
    .filter((entry): entry is JsonRecord => entry !== null);

  const totalStanding =
    standings.find((entry) => toStringValue(entry.type)?.toUpperCase() === "TOTAL") ?? standings.at(0) ?? null;

  const table = toArray(totalStanding?.table)
    .map((entry) => toRecord(entry))
    .filter((entry): entry is JsonRecord => entry !== null);

  return table.map((entry) => {
    const team = toRecord(entry.team);
    const fallbackLastFive = parseRecentForm(entry.form);

    return {
      teamKey: getTeamKey(team),
      position: toNumberValue(entry.position) ?? 0,
      team: toStringValue(team?.shortName) ?? toStringValue(team?.name) ?? "Time indefinido",
      crest: toStringValue(team?.crest),
      points: toNumberValue(entry.points) ?? 0,
      games: toNumberValue(entry.playedGames) ?? 0,
      goalsAgainst: toNumberValue(entry.goalsAgainst) ?? 0,
      goalDifference: toNumberValue(entry.goalDifference) ?? 0,
      form: parseFormTrend(entry.form),
      lastFive: fallbackLastFive,
    };
  });
}

function resolveStandings(standings: CachedStanding[], teamRecentForms: TeamRecentForms) {
  return standings.map(({ teamKey, lastFive, form, ...entry }) => {
    const resolvedLastFive = teamKey ? teamRecentForms[teamKey] ?? lastFive : lastFive;

    return {
      ...entry,
      form: getStandingFormFromRecent(resolvedLastFive, form),
      lastFive: resolvedLastFive,
    };
  });
}

function buildMatchesPath() {
  const now = new Date();
  const dateFrom = new Date(now);
  const dateTo = new Date(now);

  dateFrom.setDate(dateFrom.getDate() - 180);
  dateTo.setDate(dateTo.getDate() + 180);

  const from = dateFrom.toISOString().slice(0, 10);
  const to = dateTo.toISOString().slice(0, 10);

  return `/competitions/${env.footballDataCompetitionCode}/matches?dateFrom=${from}&dateTo=${to}`;
}

async function loadMatchesData(): Promise<MatchesCacheValue> {
  const matchesPayload = await fetchFootballData(buildMatchesPath());
  const matchesRecord = toRecord(matchesPayload);
  const matches = toArray(matchesRecord?.matches)
    .map((entry) => toRecord(entry))
    .filter((entry): entry is JsonRecord => entry !== null);
  const competitionRecord = toRecord(matchesRecord?.competition);
  const aliases = getTeamAliases(env.footballDataTeamName);
  const filteredMatches = filterTargetMatches(matches, aliases);

  return {
    competition: toStringValue(competitionRecord?.name) ?? "Campeonato Brasileiro Série A",
    featuredMatches: buildFeaturedMatches(filteredMatches),
    recentResults: buildRecentResults(filteredMatches, aliases),
    teamRecentForms: buildTeamRecentForms(matches),
    updatedAt: new Date().toISOString(),
  };
}

async function loadStandingsData(): Promise<StandingsCacheValue> {
  const standingsPayload = await fetchFootballData(`/competitions/${env.footballDataCompetitionCode}/standings`);
  const competitionRecord = toRecord(standingsPayload);

  return {
    competition: toStringValue(competitionRecord?.name) ?? "Campeonato Brasileiro Série A",
    standings: buildStandings(standingsPayload),
    updatedAt: new Date().toISOString(),
  };
}

jogosRouter.get("/overview", requireAuth, async (_req, res) => {
  const now = Date.now();
  const matchesCacheValid = matchesCache && matchesCache.expiresAt > now;
  const standingsCacheValid = standingsCache && standingsCache.expiresAt > now;

  if (matchesCacheValid && standingsCacheValid && matchesCache && standingsCache) {
    const cachedMatches = matchesCache.data;
    const cachedStandings = standingsCache.data;

    return res.json({
      competition: cachedMatches.competition || cachedStandings.competition,
      updatedAt:
        new Date(cachedMatches.updatedAt) > new Date(cachedStandings.updatedAt)
          ? cachedMatches.updatedAt
          : cachedStandings.updatedAt,
      featuredMatches: cachedMatches.featuredMatches,
      recentResults: cachedMatches.recentResults,
      standings: resolveStandings(cachedStandings.standings, cachedMatches.teamRecentForms),
    });
  }

  try {
    let matchesData = matchesCache?.data ?? null;
    let standingsData = standingsCache?.data ?? null;

    if (!matchesCacheValid) {
      try {
        matchesData = await loadMatchesData();
        matchesCache = {
          data: matchesData,
          expiresAt: now + MATCHES_CACHE_TTL_MS,
        };
      } catch (error) {
        if (!(error instanceof FootballDataError && error.status === 429 && matchesCache?.data)) {
          throw error;
        }
      }
    }

    if (!standingsCacheValid) {
      try {
        standingsData = await loadStandingsData();
        standingsCache = {
          data: standingsData,
          expiresAt: now + STANDINGS_CACHE_TTL_MS,
        };
      } catch (error) {
        if (!(error instanceof FootballDataError && error.status === 429 && standingsCache?.data)) {
          throw error;
        }
      }
    }

    if (!matchesData && matchesCache?.data) {
      matchesData = matchesCache.data;
    }

    if (!standingsData && standingsCache?.data) {
      standingsData = standingsCache.data;
    }

    if (!matchesData || !standingsData) {
      throw new Error("Nao foi possivel carregar os dados de jogos e tabela no momento.");
    }

    return res.json({
      competition: matchesData.competition || standingsData.competition,
      updatedAt:
        new Date(matchesData.updatedAt) > new Date(standingsData.updatedAt)
          ? matchesData.updatedAt
          : standingsData.updatedAt,
      featuredMatches: matchesData.featuredMatches,
      recentResults: matchesData.recentResults,
      standings: resolveStandings(standingsData.standings, matchesData.teamRecentForms),
    });
  } catch (error) {
    const cachedMatches = matchesCache?.data ?? null;
    const cachedStandings = standingsCache?.data ?? null;

    if (cachedMatches && cachedStandings) {
      return res.json({
        competition: cachedMatches.competition || cachedStandings.competition,
        updatedAt:
          new Date(cachedMatches.updatedAt) > new Date(cachedStandings.updatedAt)
            ? cachedMatches.updatedAt
            : cachedStandings.updatedAt,
        featuredMatches: cachedMatches.featuredMatches,
        recentResults: cachedMatches.recentResults,
        standings: resolveStandings(cachedStandings.standings, cachedMatches.teamRecentForms),
      });
    }

    const message = error instanceof Error ? error.message : "Falha ao carregar jogos";
    return res.status(502).json({ message });
  }
});

export { jogosRouter };
