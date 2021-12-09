import Chip from './Chip';

const ShowInfo = ({
  title,
  poster,
  year,
  rating,
  genre,
  actors,
  writers,
  plot,
}) => {
  return (
    <div
      style={{
        width: '75%',
        height: '200px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '0.5em',
      }}
    >
      <img
        src={poster}
        alt={`${title} poster`}
        style={{ minWidth: '100px', maxWidth: '100px', maxHeight: '90%' }}
      />
      <div style={{ margin: 'auto 5%', width: '75%' }}>
        <div
          style={{
            display: 'flex',
            marginBottom: '10px',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <h1 style={{ margin: '0' }}>{title}</h1>
          <div
            style={{
              height: '3em',
              width: '3em',
              marginLeft: '20px',
              backgroundColor:
                rating > 8 ? '#04724D' : rating > 6 ? '#EB9C0A' : '#BC2C1A',
              color: 'white',
              borderRadius: '10%',
              fontSize: '1em',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {rating}
          </div>
        </div>
        {genre.split(',').map((item) => (
          <Chip text={item.trim()} />
        ))}
        <p style={{ margin: '0', fontStyle: 'italic' }}>({year})</p>
        <p style={{ margin: '0', fontSize: '0.8em' }}>{plot}</p>
        <p
          style={{
            margin: '0',
            fontSize: '0.7em',
          }}
        >
          <b>Written by:</b> {writers}
        </p>
        <p
          style={{
            margin: '0',
            fontSize: '0.7em',
          }}
        >
          <b>Starring:</b> {actors}
        </p>
      </div>
    </div>
  );
};

export default ShowInfo;
