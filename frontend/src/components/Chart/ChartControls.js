import ToggleSwitch from './ToggleSwitch';

const ChartControls = ({ setComparison, setDynamicChart, setAllEpisodes }) => {
  return (
    <div className="chart-control-wrapper">
      <ToggleSwitch
        label="Compare seasons"
        name="Compare seasons"
        id="compare-switch"
        toggle={(e) => setComparison(e.target.checked)}
      />
      <ToggleSwitch
        label="Dynamic chart"
        name="Dynamic chart"
        id="dynamic-switch"
        toggle={(e) => setDynamicChart(e.target.checked)}
      />
      <ToggleSwitch
        label="All episodes"
        name="All episodes"
        id="all-episodes-switch"
        toggle={() => setAllEpisodes()}
      />
    </div>
  );
};

export default ChartControls;
