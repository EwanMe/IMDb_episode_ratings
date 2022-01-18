const RatingBox = ({ rating }) => {
  let ratingNum = parseFloat(rating);
  let colorClass = 'nan';

  if (!Number.isNaN(ratingNum)) {
    if (rating > 8) {
      colorClass = 'high';
    } else if (rating > 6) {
      colorClass = 'medium';
    } else {
      colorClass = 'low';
    }
  }

  return <div className={`global-rating-box ${colorClass}`}>{rating}</div>;
};

export default RatingBox;
