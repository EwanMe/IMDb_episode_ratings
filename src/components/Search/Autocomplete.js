import { useEffect } from 'react';

const Autocomplete = (props) => {
  useEffect(() => {
    document.addEventListener('click', function clickAway(e) {
      const element = document.querySelector('.autocomplete-wrapper');
      if (element && !element.contains(e.target)) {
        props.exists(false); // Remove autocomplete
        this.removeEventListener('click', clickAway); // Remove self.
      }
    });
  }, []);

  return (
    <div className="autocomplete-wrapper">
      <ul className="autocomplete-list">
        {props.items.map((show) => (
          // TODO: handle error
          <li
            key={show.imdbID}
            className="autocomplete-item"
            onClick={(e) => {
              props.select(show.imdbID);
              e.currentTarget.parentElement.remove();
            }}
            onMouseEnter={(e) => e.currentTarget.classList.add('hover')}
            onMouseLeave={(e) => e.currentTarget.classList.remove('hover')}
          >
            <div className="autocomplete-item-wrapper">
              <img src={show.Poster} className="autocomplete-poster" />
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
