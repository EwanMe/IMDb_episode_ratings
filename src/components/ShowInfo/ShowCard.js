import { useEffect } from 'react';
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
  useEffect(() => {
    const ratingBox = document.querySelector('.global-rating-box');

    ratingBox.classList.remove('high');
    ratingBox.classList.remove('medium');
    ratingBox.classList.remove('low');

    if (rating > 8) {
      ratingBox.classList.add('high');
    } else if (rating > 6) {
      ratingBox.classList.add('medium');
    } else {
      ratingBox.classList.add('low');
    }
  }, [rating]);

  return (
    <div className="show-card-wrapper">
      <img src={poster} alt={`${title} poster`} className="show-poster" />
      <div className="show-info">
        <div className="show-header">
          <h1 className="show-title">{title}</h1>
          <div className="global-rating-box">{rating}</div>
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
          <Chip text={item.trim()} />
        ))}
      </div>
    </div>
  );
};

export default ShowInfo;
