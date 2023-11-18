const ToggleSwitch = ({ id, label, name, toggle }) => {
  return (
    <div className="switch-wrapper">
      {label && (
        <label className="switch-label" htmlFor={name}>
          {label}
        </label>
      )}
      <label className="switch">
        <input
          type="checkbox"
          className="switch-checkbox"
          id={id}
          name={name}
          onChange={(e) => toggle(e)}
        />
        <span className="switch-slider" />
      </label>
    </div>
  );
};

export default ToggleSwitch;
