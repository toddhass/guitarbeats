/** Hand-checked tempos for songs people actually practice. */
const KNOWN: Record<string, number> = {
  "american soldier|toby keith": 82,
  "i love this bar|toby keith": 115,
  "should ve been a cowboy|toby keith": 130,
  "courtesy of the red white and blue|toby keith": 112,
  "as good as i once was|toby keith": 119,
  "beer for my horses|toby keith": 118,
  "wagon wheel|old crow medicine show": 146,
  "wagon wheel|darius rucker": 148,
  "wonderwall|oasis": 87,
  "brown eyed girl|van morrison": 129,
  "take me home country roads|john denver": 82,
  "country roads|john denver": 82,
  "sweet home alabama|lynyrd skynyrd": 98,
  "wild horses|the rolling stones": 76,
  "dont fear the reaper|blue oyster cult": 141,
  "don t fear the reaper|blue oyster cult": 141,
  "friends in low places|garth brooks": 108,
  "the dance|garth brooks": 66,
  "ring of fire|johnny cash": 104,
  "folsom prison blues|johnny cash": 105,
  "hurt|johnny cash": 80,
  "chicken fried|zac brown band": 86,
  "toes|zac brown band": 130,
  "body like a back road|sam hunt": 98,
  "die a happy man|thomas rhett": 83,
  "dirt road anthem|jason aldean": 127,
  "cruise|florida georgia line": 148,
  "tennesee whiskey|chris stapleton": 72,
  "tennessee whiskey|chris stapleton": 72,
  "you should probably leave|chris stapleton": 92,
  "whiskey glasses|morgan wallen": 101,
  "last night|morgan wallen": 110,
  "something in the orange|zach bryan": 86,
  "heading south|zach bryan": 88,
  "thriller|michael jackson": 118,
  "billie jean|michael jackson": 117,
  "beat it|michael jackson": 139,
};

export function normKey(title: string, artist: string) {
  const clean = (s: string) =>
    s
      .toLowerCase()
      .replace(/\([^)]*\)/g, " ")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  return `${clean(title)}|${clean(artist)}`;
}

export function knownTempo(title: string, artist: string): number | null {
  const k = normKey(title, artist);
  if (KNOWN[k]) return KNOWN[k];
  const t = k.split("|")[0];
  for (const [key, bpm] of Object.entries(KNOWN)) {
    if (key.startsWith(t + "|")) return bpm;
  }
  return null;
}
