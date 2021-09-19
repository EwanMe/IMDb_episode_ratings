import { useEffect } from 'react';

const Autocomplete = (props) => {
  useEffect(() => {
    document.addEventListener('click', function clickAway(e) {
      const element = document.querySelector('.autocomplete');
      if (element && !element.contains(e.target)) {
        props.exists(false); // Remove autocomplete
        this.removeEventListener('click', clickAway); // Remove self.
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
          border: '1px solid silver',
          maxHeight: '75vh',
          overflowY: 'scroll',
        }}
      >
        {props.items.map((show) => (
          // TODO: handle error
          <li
            key={show.imdbID}
            onClick={(e) => {
              props.select(show.imdbID);
              e.currentTarget.parentElement.remove();
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#eee')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = '#fffffc')
            }
            style={{
              margin: '0',
              padding: '0.7em',
              listStyle: 'none',
              border: '1px solid silver',
              marginTop: '-1px',
              marginLeft: '-1px',
              backgroundColor: '#fffffc',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <img
                src={show.Poster}
                style={{ minWidth: '60px', maxWidth: '60px' }}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  marginLeft: '2em',
                }}
              >
                <h4 style={{ margin: '0' }}>{show.Title}</h4>
                <p style={{ margin: '0' }}>{show.Year}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Autocomplete;
