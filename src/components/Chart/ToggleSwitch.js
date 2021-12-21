const ToggleSwitch = ({ label, name, toggle }) => {
  return (
    <div className="switch-wrapper">
      {label && (
        <label className="switch-label" htmlFor={name}>
          {label}
        </label>
      )}
      <label class="switch">
        <input
          type="checkbox"
          class="switch-checkbox"
          name={name}
          onChange={(e) => toggle(e)}
        />
        <span class="switch-slider" />
      </label>
    </div>
  );
};

export default ToggleSwitch;
