import Chip from './Chip';
import RatingBox from './RatingBox';

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
    <div className="show-card-wrapper">
      <img src={poster} alt={`${title} poster`} className="show-poster" />
      <div className="show-info">
        <div className="show-header">
          <h1 className="show-title">{title}</h1>
          <RatingBox rating={rating} />
        </div>
        <p className="show-year">({year})</p>
        <p className="plot-summary">{plot}</p>
        <div className="show-roles-wrapper">
          <p className="show-roles">
            <b>Written by:&ensp;</b> {writers}
          </p>
          <p className="show-roles">
            <b>Starring:&emsp;&ensp;</b> {actors}
          </p>
        </div>
        {genre.split(',').map((item) => (
          <Chip key={item} text={item.trim()} />
        ))}
      </div>
    </div>
  );
};

export default ShowInfo;
