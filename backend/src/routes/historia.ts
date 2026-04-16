import { Router } from "express";

import { requireAuth } from "../middleware/auth";

const historiaRouter = Router();

const historiaOverview = {
  clubName: "Associação Chapecoense de Futebol",
  foundedAt: "10 de maio de 1973",
  city: "Chapecó - SC",
  updatedAt: "2026-04-15T01:10:00.000Z",
  footerQuote: "Que a nossa história jamais seja esquecida.",
  timeline: [
    {
      year: "1973",
      title: "Fundação",
      description: "A Chapecoense nasce da união de clubes da cidade e inicia sua trajetória no futebol catarinense.",
    },
    {
      year: "2009",
      title: "Ascensão nacional",
      description: "A Chapecoense inicia a retomada nacional com acessos que recolocam o clube no cenário brasileiro e aceleram seu crescimento esportivo.",
    },
    {
      year: "2013",
      title: "Acesso à Série A",
      description: "A campanha da Série B de 2013 garante o acesso inédito da Chapecoense à elite do futebol brasileiro.",
    },
    {
      year: "2016",
      title: "Título continental",
      description: "A conquista da Copa Sul-Americana marca a página mais simbólica da história alviverde e projeta o clube internacionalmente.",
    },
    {
      year: "2017",
      title: "Reconstrução e novo estadual",
      description: "O clube recomeça com coragem, homenagens e o título catarinense, símbolo de superação coletiva.",
    },
    {
      year: "2020",
      title: "Campeã da Série B",
      description: "A Chapecoense conquista o título da Série B e confirma o retorno à Série A com uma campanha de regularidade e força competitiva.",
    },
  ],
  achievements: [
    { label: "Campeonato Catarinense", value: "7x" },
    { label: "Copa Sul-Americana", value: "1x" },
    { label: "Brasileiro Série B", value: "1x" },
    { label: "Acesso à Série A", value: "2013" },
  ],
};

historiaRouter.get("/overview", requireAuth, (_req, res) => {
  return res.json(historiaOverview);
});

export { historiaRouter };
