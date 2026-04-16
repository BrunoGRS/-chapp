import { Router } from "express";

import { requireAuth } from "../middleware/auth";

const titulosRouter = Router();

const titulosOverview = {
  clubName: "Associação Chapecoense de Futebol",
  clubSubtitle: "O Furacão do Oeste",
  updatedAt: "2026-04-15T00:40:00.000Z",
  trophies: [
    {
      id: "sul-americana-2016",
      title: "Copa Sul-Americana",
      year: "2016",
      quote: "Meu Furacão, tu és sempre um vencedor.",
      description: "Conquista continental que marcou a história do clube e do futebol sul-americano.",
    },
    {
      id: "serie-b-2020",
      title: "Brasileiro Série B",
      year: "2020",
      quote: "Do Oeste para o topo, com consistência e coragem.",
      description: "Campanha que confirmou a Chapecoense como campeã da Série B e marcou o retorno do clube à elite nacional.",
    },
    {
      id: "catarinense-7-titulos",
      title: "Campeonato Catarinense",
      year: "7 títulos",
      quote: "A nossa força vem da arquibancada.",
      description: "A Chapecoense soma sete conquistas estaduais: 1977, 1996, 2007, 2011, 2016, 2017 e 2020.",
    },
  ],
};

titulosRouter.get("/overview", requireAuth, (_req, res) => {
  return res.json(titulosOverview);
});

export { titulosRouter };
