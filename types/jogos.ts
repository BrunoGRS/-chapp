export type StandingForm = "up" | "down" | "stable";
export type RecentForm = "W" | "D" | "L";
export type MatchPerspective = "home" | "away";

export type FeaturedMatch = {
  id: string;
  competitionName: string;
  competitionCode?: string | null;
  homeTeam: string;
  homeTeamCrest?: string | null;
  awayTeam: string;
  awayTeamCrest?: string | null;
  homeScore: number;
  awayScore: number;
  status: string;
  matchTime: string;
  venue: string;
};

export type Standing = {
  position: number;
  team: string;
  crest?: string | null;
  points: number;
  games: number;
  goalsAgainst: number;
  goalDifference: number;
  form: StandingForm;
  lastFive: RecentForm[];
};

export type RecentResult = {
  id: string;
  competitionName: string;
  competitionCode?: string | null;
  opponent: string;
  opponentCrest?: string | null;
  perspective: MatchPerspective;
  teamScore: number;
  opponentScore: number;
  result: RecentForm;
  status: string;
  matchTime: string;
  venue: string;
};

export type JogosOverview = {
  competition: string;
  updatedAt: string;
  featuredMatches: FeaturedMatch[];
  recentResults: RecentResult[];
  standings: Standing[];
};
