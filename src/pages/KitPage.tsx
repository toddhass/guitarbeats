import { DrumPanel } from "../components/DrumPanel";
import { GroovePanel } from "../components/GroovePanel";
import { Transport } from "../components/Transport";

export function KitPage() {
  return (
    <div className="page page-kit">
      <div className="page-head kit-head">
        <p className="page-kicker">Floor</p>
        <h1>Kit</h1>
        <p className="page-lead">Sound and click. Song form lives on Stage.</p>
      </div>
      <DrumPanel />
      <GroovePanel />
      <Transport mode="kits" />
    </div>
  );
}
