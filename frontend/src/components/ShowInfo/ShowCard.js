import Chip from './Chip';
import RatingBox from './RatingBox';

const ShowCard = ({
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
      <div className="show-header">
        <h1 className="show-title">{title}</h1>
        <RatingBox rating={rating} />
        <p className="show-year">({year})</p>
      </div>
      <div className="show-body">
        <p className="plot-summary">{plot}</p>
        <div className="show-role-wrapper">
          <p className="show-role">
            <b>Written by:&ensp;</b> {writers}
          </p>
          <p className="show-role">
            <b>Starring:&emsp;&ensp;</b> {actors}
          </p>
        </div>
        <div className="chip-wrapper">
          {genre.split(',').map((item) => (
            <Chip key={item} text={item.trim()} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowCard;
