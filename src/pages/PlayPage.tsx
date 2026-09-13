import { NowPlaying } from "../components/NowPlaying";
import { CoachBar } from "../components/CoachBar";
import { Transport } from "../components/Transport";

export function PlayPage() {
  return (
    <div className="page page-play">
      <NowPlaying />
      <CoachBar compact />
      <Transport mode="play" />
    </div>
  );
}
