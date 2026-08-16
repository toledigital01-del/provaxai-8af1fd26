import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ href: "/index.html", reloadDocument: true });
  },
  head: () => ({
    meta: [
      {
        title:
          "Prova X — Curso PRF com IA: edital completo, questões e revisão",
      },
      {
        name: "description",
        content:
          "Estude para a Polícia Rodoviária Federal com a Athena IA: 15 disciplinas, 303 tópicos do edital, questões no padrão Cebraspe, revisão inteligente e cronograma adaptativo.",
      },
      {
        property: "og:title",
        content: "Prova X — Curso PRF com IA: edital completo, questões e revisão",
      },
      {
        property: "og:description",
        content:
          "Estude para a PRF com a Athena IA: edital completo, questões no padrão Cebraspe e revisão inteligente.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});
