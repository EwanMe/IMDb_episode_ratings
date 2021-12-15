import ToggleSwitch from './ToggleSwitch';

const ChartControls = ({ setComparison, setDynamicChart }) => {
  return (
    <div className="chart-control-wrapper">
      <ToggleSwitch
        label="Compare seasons"
        name="Compare seasons"
        toggle={(e) => setComparison(e.target.checked)}
      />
      <ToggleSwitch
        label="Dynamic chart"
        name="Dynamic chart"
        toggle={(e) => setDynamicChart(e.target.checked)}
      />
    </div>
  );
};

export default ChartControls;
