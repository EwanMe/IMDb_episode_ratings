import { useEffect } from 'react';

const Autocomplete = (props) => {
  useEffect(() => {
    document.addEventListener('click', (e) => {
      const element = document.querySelector('.autocomplete');
      if (element && !element.contains(e.target)) {
        props.exists(false);
      }
    });
  }, []);

  return (
    <div
      className="autocomplete"
      style={{ position: 'relative', zIndex: '2', width: '100%' }}
    >
      <ul
        style={{
          margin: '0',
          padding: '0',
          border: '0 solid silver',
          borderWidth: '0 0 1px 1px',
        }}
      >
        {props.items.map((show) => (
          // TODO: handle error
          <li
            key={show.imdbID}
            onClick={(e) => {
              props.select(show.Title);
              e.currentTarget.parentElement.remove();
            }}
            onMouseEnter={(e) => (e.target.style.borderColor = 'blue')}
            onMouseLeave={(e) => (e.target.style.borderColor = 'silver')}
            style={{
              margin: '0',
              padding: '0.7em',
              listStyle: 'none',
              border: '0 solid silver',
              borderWidth: '1px 1px 0 0',
              backgroundColor: '#fffffc',
              cursor: 'pointer',
            }}
          >
            {show.Title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Autocomplete;
