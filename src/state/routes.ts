export type Tab = "play" | "practice" | "drums" | "songs";

export const PAGES: { id: Tab; path: string; label: string; title: string }[] = [
  { id: "play", path: "#/play", label: "Play", title: "Play" },
  { id: "practice", path: "#/practice", label: "Practice", title: "Practice" },
  { id: "drums", path: "#/kit", label: "Kit", title: "Kit" },
  { id: "songs", path: "#/library", label: "Library", title: "Library" },
];

export function pathFor(tab: Tab) {
  return PAGES.find((p) => p.id === tab)?.path ?? "#/play";
}

export function tabFromHash(hash = window.location.hash): Tab {
  const raw = (hash || "").replace(/^#\/?/, "").split("?")[0].toLowerCase();
  if (raw === "practice" || raw === "coach") return "practice";
  if (raw === "kit" || raw === "drums") return "drums";
  if (raw === "library" || raw === "songs" || raw === "search") return "songs";
  return "play";
}

export function writeHash(tab: Tab) {
  const next = pathFor(tab);
  if (window.location.hash !== next) {
    window.location.hash = next;
  }
}
