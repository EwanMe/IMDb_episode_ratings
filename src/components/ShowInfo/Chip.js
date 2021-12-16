const Chip = ({ text }) => {
  return (
    <div
      style={{
        display: 'inline-block',
        marginRight: '0.5em',
        padding: '0.1em 0.7em',
        border: '2px solid #170055',
        borderRadius: '20px',
        textAlign: 'center',
        fontSize: '0.9em',
      }}
    >
      {text}
    </div>
  );
};

export default Chip;
