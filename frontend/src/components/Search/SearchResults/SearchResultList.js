export default function SearchResultList({ items, select }) {
  return (
    <div className="search-result-wrapper">
      <ul className="search-result-list">
        {items?.map((show) => (
          // TODO: handle error
          <li
            key={show.tconst}
            className="search-result-item"
            onClick={(e) => {
              e.preventDefault();
              select(show.tconst);
            }}
            onMouseEnter={(e) => e.currentTarget.classList.add('hover')}
            onMouseLeave={(e) => e.currentTarget.classList.remove('hover')}
          >
            <div className="search-result-item-wrapper">
              <img
                src={show.poster}
                alt={`${show.primaryTitle} poster`}
                className="search-result-poster"
              />

              <div className="search-result-info">
                <h4 className="search-result-title">{show.primaryTitle}</h4>
                <p className="search-result-year">
                  {show.startYear}-{show.endYear}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
