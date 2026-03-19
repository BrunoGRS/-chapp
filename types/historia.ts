export type HistoriaTimelineItem = {
  year: string;
  title: string;
  description: string;
};

export type HistoriaAchievement = {
  label: string;
  value: string;
};

export type HistoriaOverview = {
  clubName: string;
  foundedAt: string;
  city: string;
  updatedAt: string;
  footerQuote: string;
  timeline: HistoriaTimelineItem[];
  achievements: HistoriaAchievement[];
};
