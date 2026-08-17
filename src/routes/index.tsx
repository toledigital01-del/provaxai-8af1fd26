import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ href: "/index.html", reloadDocument: true });
  },
  head: () => ({
    meta: [
      { title: "Prova X — Plataforma Inteligente de Preparação para a PRF" },
      {
        name: "description",
        content:
          "Estude para a PRF com edital organizado, Athena IA, questões no padrão Cebraspe, revisão inteligente, cronograma e acompanhamento de desempenho.",
      },
      {
        property: "og:title",
        content: "Prova X — Plataforma Inteligente de Preparação para a PRF",
      },
      {
        property: "og:description",
        content:
          "Seu edital. Seu plano. Sua evolução. Aula, Athena IA, questões Cebraspe, revisão e cronograma em um só ambiente.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});
