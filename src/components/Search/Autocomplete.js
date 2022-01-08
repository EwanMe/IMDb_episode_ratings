import { useEffect } from 'react';

const Autocomplete = ({ items, exists, select }) => {
  useEffect(() => {
    document.addEventListener('click', function clickAway(e) {
      const element = document.querySelector('.autocomplete-wrapper');
      if (element && !element.contains(e.target)) {
        exists(false); // Remove autocomplete
        this.removeEventListener('click', clickAway); // Remove self.
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="autocomplete-wrapper">
      <ul className="autocomplete-list">
        {items.map((show) => (
          // TODO: handle error
          <li
            key={show.imdbID}
            className="autocomplete-item"
            onClick={(e) => {
              select(show.imdbID);
              e.currentTarget.parentElement.remove();
            }}
            onMouseEnter={(e) => e.currentTarget.classList.add('hover')}
            onMouseLeave={(e) => e.currentTarget.classList.remove('hover')}
          >
            <div className="autocomplete-item-wrapper">
              <img
                src={show.Poster}
                alt={`${show.Title} poster`}
                className="autocomplete-poster"
              />
              <div className="autocomplete-info">
                <h4 className="autocomplete-title">{show.Title}</h4>
                <p className="autocomplete-year">{show.Year}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Autocomplete;
