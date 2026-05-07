import { Href } from "expo-router";

export type ReadoraRoute =
  | "chat"
  | "bookDetail"
  | "explanation"
  | "flashcards"
  | "home"
  | "library"
  | "notes"
  | "quiz"
  | "reader"
  | "scan"
  | "settings"
  | "summary";

const routes: Record<ReadoraRoute, Href> = {
  bookDetail: "/book-detail",
  chat: "/chat",
  explanation: "/explanation",
  flashcards: "/flashcards",
  home: "/(tabs)",
  library: "/(tabs)/library",
  notes: "/(tabs)/notes",
  quiz: "/quiz",
  reader: "/reader",
  scan: "/scan",
  settings: "/settings",
  summary: "/summary",
};

export function routeFor(route: string): Href {
  return routes[route as ReadoraRoute] ?? routes.home;
}
