export default async function handler(
  req: { query?: Record<string, string | string[]> },
  res: {
    setHeader: (k: string, v: string) => void;
    status: (n: number) => { json: (b: unknown) => void };
  }
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=3600");
  const term = String(req.query?.term || "").trim();
  if (term.length < 2) {
    res.status(200).json({ results: [] });
    return;
  }
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=20`;
  try {
    const r = await fetch(url, {
      headers: { "user-agent": "GuitarBeats/1.0 (practice app)" },
    });
    if (!r.ok) {
      res.status(200).json({ results: [] });
      return;
    }
    const data = await r.json();
    res.status(200).json({ results: data.results ?? [] });
  } catch {
    res.status(200).json({ results: [] });
  }
}
