import { Library } from "../components/Library";

export function LibraryPage() {
  return (
    <div className="page page-library">
      <div className="page-head catalog-head">
        <p className="page-kicker">Catalog</p>
        <h1>Library</h1>
        <p className="page-lead">Search a song. Tap it to jump to Stage.</p>
      </div>
      <Library />
    </div>
  );
}
