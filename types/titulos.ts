export type Trophy = {
  id: string;
  title: string;
  year: string;
  quote: string;
  description: string;
};

export type TitulosOverview = {
  clubName: string;
  clubSubtitle: string;
  updatedAt: string;
  trophies: Trophy[];
};
