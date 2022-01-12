const RatingBox = ({ rating }) => {
  const colorClass = rating > 8 ? 'high' : rating > 6 ? 'medium' : 'low';

  return <div className={`global-rating-box ${colorClass}`}>{rating}</div>;
};

export default RatingBox;
