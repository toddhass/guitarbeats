import { DrumPanel } from "../components/DrumPanel";
import { Transport } from "../components/Transport";

export function KitPage() {
  return (
    <div className="page page-kit">
      <div className="page-head kit-head">
        <p className="page-kicker">Floor</p>
        <h1>Kit</h1>
        <p className="page-lead">How the drums sound. Feel lives on Groove.</p>
      </div>
      <DrumPanel />
      <Transport mode="kits" />
    </div>
  );
}
