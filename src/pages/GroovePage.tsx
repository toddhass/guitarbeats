import { GroovePanel } from "../components/GroovePanel";

export function GroovePage() {
  return (
    <div className="page page-groove">
      <div className="page-head groove-head">
        <p className="page-kicker">Pocket</p>
        <h1>Groove</h1>
        <p className="page-lead">Feel and tempo. Kit sound stays on Kit. Form stays on Play.</p>
      </div>
      <GroovePanel />
    </div>
  );
}
