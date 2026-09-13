import { PracticePanel } from "../components/PracticePanel";

export function PracticePage() {
  return (
    <div className="page page-practice">
      <div className="page-head workshop-head">
        <p className="page-kicker">Workshop</p>
        <h1>Practice</h1>
        <p className="page-lead">Chords, capo, loop, and speed. Drums stay on Stage and Kit.</p>
      </div>
      <PracticePanel />
    </div>
  );
}
