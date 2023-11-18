export default function NoResults({ failedQuery }) {
  return (
    <div className="no-results-wrapper">
      <h2 className="no-results-message">
        No results found for: "{failedQuery}" &#x1F914;
      </h2>
    </div>
  );
}
