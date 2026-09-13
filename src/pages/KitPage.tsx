import { DrumPanel } from "../components/DrumPanel";
import { GroovePanel } from "../components/GroovePanel";
import { Transport } from "../components/Transport";

export function KitPage() {
  return (
    <div className="page page-kit">
      <DrumPanel />
      <GroovePanel />
      <Transport mode="kits" />
    </div>
  );
}
