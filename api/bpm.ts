function slug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function parseBpm(html: string): number | null {
  const labeled = html.match(/Tempo \(BPM\)[\s\S]{0,240}?>\s*(\d{2,3})\s*</i);
  if (labeled) {
    const n = Number(labeled[1]);
    if (n >= 40 && n <= 240) return n;
  }
  const tagged = html.match(/>(\d{2,3})<\s*<span[^>]*>\s*BPM/i);
  if (tagged) {
    const n = Number(tagged[1]);
    if (n >= 40 && n <= 240) return n;
  }
  return null;
}

export default async function handler(
  req: { query?: Record<string, string | string[]> },
  res: {
    setHeader: (k: string, v: string) => void;
    status: (n: number) => { json: (b: unknown) => void };
  }
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=604800");
  const title = String(req.query?.title || "").trim();
  const artist = String(req.query?.artist || "").trim();
  if (!title) {
    res.status(400).json({ bpm: null });
    return;
  }
  const url = `https://songbpm.com/@${slug(artist || "unknown")}/${slug(title)}`;
  try {
    const r = await fetch(url, {
      headers: { "user-agent": "GuitarBeats/1.0 (practice app)" },
      redirect: "follow",
    });
    if (!r.ok) {
      res.status(200).json({ bpm: null });
      return;
    }
    const html = await r.text();
    res.status(200).json({ bpm: parseBpm(html) });
  } catch {
    res.status(200).json({ bpm: null });
  }
}
