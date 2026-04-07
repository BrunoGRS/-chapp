export type StandingForm = "up" | "down" | "stable";

export type FeaturedMatch = {
  id: string;
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
  points: number;
  games: number;
  form: StandingForm;
};

export type JogosOverview = {
  competition: string;
  updatedAt: string;
  featuredMatches: FeaturedMatch[];
  standings: Standing[];
};
