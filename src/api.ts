import { Feel, feelFromGenre } from "./data/grooves";
import { knownTempo } from "./data/tempos";

export interface AppleHit {
  trackId: number;
  trackName: string;
  artistName: string;
  primaryGenreName?: string;
}

export async function searchAppleMusic(term: string): Promise<AppleHit[]> {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=20`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`search failed (${res.status})`);
  const data = await res.json();
  return (data.results ?? []) as AppleHit[];
}

export function hitToSeed(t: AppleHit) {
  const title =
    (t.trackName || "").replace(/\s*\([^)]*(remaster|live|edit|version|remix)[^)]*\)/gi, "").trim() ||
    t.trackName;
  const known = knownTempo(title, t.artistName || "");
  return {
    id: `it-${t.trackId}`,
    title,
    artist: t.artistName || "Unknown",
    bpm: known ?? 0,
    feel: feelFromGenre(t.primaryGenreName, known ?? 0) as Feel,
    genre: t.primaryGenreName,
  };
}

export async function lookupTempo(title: string, artist: string): Promise<number | null> {
  const known = knownTempo(title, artist);
  if (known) return known;
  try {
    const url = `/api/bpm?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as { bpm?: number | null };
    const bpm = Number(data.bpm);
    return bpm >= 40 && bpm <= 240 ? Math.round(bpm) : null;
  } catch {
    return null;
  }
}
