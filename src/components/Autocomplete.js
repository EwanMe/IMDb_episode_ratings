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
          border: '2px solid silver',
          borderTop: '1px solid silver',
          maxHeight: '70vh',
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
              height: '4.2em',
              margin: '0',
              padding: '0.7em',
              listStyle: 'none',
              border: '1px solid silver',
              marginTop: '-1px',
              marginLeft: '-1px',
              backgroundColor: '#fffffc',
              cursor: 'pointer',
              fontSize: '1.2em',
            }}
          >
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <img
                src={show.Poster}
                style={{ maxWidth: '60px', height: '100%' }}
              />
              <div
                style={{
                  height: '80%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'space-around',
                  marginLeft: '2em',
                }}
              >
                <h4 style={{ margin: '0' }}>{show.Title}</h4>
                <p style={{ margin: '0', fontSize: '0.8em' }}>{show.Year}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Autocomplete;
