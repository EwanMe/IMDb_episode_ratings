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
    <div className="showinfo-wrapper">
      <img src={poster} alt={`${title} poster`} className="showinfo-poster" />
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
            className="global-rating-box"
            style={{
              backgroundColor:
                rating > 8 ? '#04724D' : rating > 6 ? '#EB9C0A' : '#BC2C1A',
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
          <b>Written by:&ensp;</b> {writers}
        </p>
        <p
          style={{
            margin: '0',
            fontSize: '0.7em',
          }}
        >
          <b>Starring:&emsp;&ensp;</b> {actors}
        </p>
      </div>
    </div>
  );
};

export default ShowInfo;
