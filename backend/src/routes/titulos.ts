import { Router } from "express";

import { requireAuth } from "../middleware/auth";

const titulosRouter = Router();

const titulosOverview = {
  clubName: "Associacao Chapecoense de Futebol",
  clubSubtitle: "O Furacao do Oeste",
  updatedAt: "2026-03-19T00:40:00.000Z",
  trophies: [
    {
      id: "sul-americana-2016",
      title: "Copa Sul-Americana",
      year: "2016",
      quote: "Meu Furacao, tu es sempre um vencedor.",
      description: "Conquista continental que marcou a historia do clube e do futebol sul-americano.",
    },
    {
      id: "catarinense-2020",
      title: "Campeonato Catarinense",
      year: "2020",
      quote: "A nossa forca vem da arquibancada.",
      description: "Titulo estadual em campanha de retomada e afirmacao da Chape em Santa Catarina.",
    },
    {
      id: "serie-b-2013",
      title: "Brasileiro Serie B",
      year: "2013",
      quote: "Do Oeste para o Brasil, com garra e coracao.",
      description: "Acesso nacional que consolidou o crescimento esportivo do clube.",
    },
  ],
};

titulosRouter.get("/overview", requireAuth, (_req, res) => {
  return res.json(titulosOverview);
});

export { titulosRouter };
