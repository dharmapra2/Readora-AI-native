import { Href } from "expo-router";

export type ReadoraRoute =
  | "chat"
  | "flashcards"
  | "home"
  | "library"
  | "notes"
  | "quiz"
  | "reader"
  | "summary";

const routes: Record<ReadoraRoute, Href> = {
  chat: "/(tabs)/ai",
  flashcards: "/flashcards",
  home: "/(tabs)",
  library: "/(tabs)/library",
  notes: "/(tabs)/notes",
  quiz: "/quiz",
  reader: "/reader",
  summary: "/summary",
};

export function routeFor(route: string): Href {
  return routes[route as ReadoraRoute] ?? routes.home;
}
