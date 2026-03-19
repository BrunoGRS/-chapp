import { Router } from "express";

import { requireAuth } from "../middleware/auth";

const historiaRouter = Router();

const historiaOverview = {
  clubName: "Associacao Chapecoense de Futebol",
  foundedAt: "10 de maio de 1973",
  city: "Chapeco - SC",
  updatedAt: "2026-03-19T01:10:00.000Z",
  footerQuote: "Que a nossa historia jamais seja esquecida.",
  timeline: [
    {
      year: "1973",
      title: "Fundacao",
      description: "A Chapecoense nasce da uniao de clubes da cidade e inicia sua trajetoria no futebol catarinense.",
    },
    {
      year: "2009",
      title: "Acesso a Serie A",
      description: "A campanha de crescimento recoloca o clube no mapa nacional e projeta a Chape para a elite.",
    },
    {
      year: "2016",
      title: "Final da Sul-Americana",
      description: "A caminhada continental marca uma das paginas mais importantes da historia alviverde.",
    },
    {
      year: "2017",
      title: "Reconstrucao e Titulo",
      description: "O clube recomeca com coragem, homenagens e conquistas que simbolizam superacao coletiva.",
    },
  ],
  achievements: [
    { label: "Campeonato Catarinense", value: "8x" },
    { label: "Copa Sul-Americana", value: "1x" },
    { label: "Brasileiro 2013", value: "1x" },
    { label: "Brasileiro Serie B", value: "1x" },
  ],
};

historiaRouter.get("/overview", requireAuth, (_req, res) => {
  return res.json(historiaOverview);
});

export { historiaRouter };
