// import "./App.css";
// import MultipleChart from "./components/MultipleChart";
import TemperatureChart from "./components/Temperature";
import WindGraph from "./components/WindGraph";

import { chartData, windGraph } from "./utils/data";

function App() {
  return (
    <>
      {/* <h5>Chart with Timestamps</h5> */}
      <div style={{ width: "100vw", height: "100vh" }}>
        {/* <TemperatureChart chartData={chartData} /> */}
        <WindGraph windData={windGraph} />
        {/* <MultipleChart windData={windGraph} /> */}
      </div>
    </>
  );
}

export default App;
