import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ href: "/index.html", reloadDocument: true });
  },
  head: () => ({
    meta: [
      {
        title:
          "Studley AI – A Ferramenta de Estudo com IA #1 | Mande nas Provas",
      },
      {
        name: "description",
        content:
          "Studley AI: resolva questões, crie flashcards, corrija redações e estude com tutor de IA para mandar bem nas provas.",
      },
      {
        property: "og:title",
        content: "Studley AI – Ferramenta de Estudo com IA",
      },
      {
        property: "og:description",
        content:
          "Resolva questões, crie flashcards e estude com um tutor de IA. Mande nas provas com o Studley AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});
