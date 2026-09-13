import { PracticePanel } from "../components/PracticePanel";

export function PracticePage() {
  return (
    <div className="page page-practice">
      <div className="page-head workshop-head">
        <p className="page-kicker">Workshop</p>
        <h1>Practice</h1>
        <p className="page-lead">Loop, slow, and lock timing. Play stays on Stage.</p>
      </div>
      <PracticePanel />
    </div>
  );
}
