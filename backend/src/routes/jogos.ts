import { Router } from "express";

import { requireAuth } from "../middleware/auth";

const jogosRouter = Router();

const jogosOverview = {
  competition: "Serie B",
  updatedAt: "2026-03-19T00:20:00.000Z",
  featuredMatches: [
    {
      id: "match-1",
      homeTeam: "Chapecoense",
      awayTeam: "Avaí",
      homeScore: 2,
      awayScore: 1,
      status: "Encerrado",
      matchTime: "Hoje, 19:00",
      venue: "Arena Conda",
    },
    {
      id: "match-2",
      homeTeam: "Criciúma",
      awayTeam: "Chapecoense",
      homeScore: 0,
      awayScore: 0,
      status: "Próximo jogo",
      matchTime: "Dom, 16:30",
      venue: "Heriberto Hulse",
    },
  ],
  standings: [
    { position: 1, team: "Goiás", points: 10, games: 4, form: "up" },
    { position: 2, team: "Cuiabá", points: 9, games: 4, form: "up" },
    { position: 3, team: "Athletico-PR", points: 8, games: 4, form: "stable" },
    { position: 4, team: "Coritiba", points: 7, games: 4, form: "up" },
    { position: 5, team: "Novorizontino", points: 7, games: 4, form: "down" },
    { position: 6, team: "Chapecoense", points: 7, games: 4, form: "up" },
    { position: 7, team: "Avaí", points: 6, games: 4, form: "stable" },
    { position: 8, team: "Vila Nova", points: 6, games: 4, form: "down" },
    { position: 9, team: "Operário", points: 5, games: 4, form: "up" },
    { position: 10, team: "Paysandu", points: 4, games: 4, form: "down" },
  ],
};

jogosRouter.get("/overview", requireAuth, (_req, res) => {
  return res.json(jogosOverview);
});

export { jogosRouter };
