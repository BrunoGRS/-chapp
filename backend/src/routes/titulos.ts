import { Router } from "express";

import { requireAuth } from "../middleware/auth";

const titulosRouter = Router();

const titulosOverview = {
  clubName: "Associação Chapecoense de Futebol",
  clubSubtitle: "O Furacão do Oeste",
  updatedAt: "2026-03-19T00:40:00.000Z",
  trophies: [
    {
      id: "sul-americana-2016",
      title: "Copa Sul-Americana",
      year: "2016",
      quote: "Meu Furacão, tu és sempre um vencedor.",
      description: "Conquista continental que marcou a história do clube e do futebol sul-americano.",
    },
    {
      id: "catarinense-2020",
      title: "Campeonato Catarinense",
      year: "2020",
      quote: "A nossa força vem da arquibancada.",
      description: "Título estadual em campanha de retomada e afirmação da Chape em Santa Catarina.",
    },
    {
      id: "serie-b-2013",
      title: "Brasileiro Série B",
      year: "2013",
      quote: "Do Oeste para o Brasil, com garra e coração.",
      description: "Acesso nacional que consolidou o crescimento esportivo do clube.",
    },
  ],
};

titulosRouter.get("/overview", requireAuth, (_req, res) => {
  return res.json(titulosOverview);
});

export { titulosRouter };
