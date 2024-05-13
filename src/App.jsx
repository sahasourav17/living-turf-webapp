// import "./App.css";
import { useEffect, useState } from "react";
import SprayWindowChart from "./components/SprayWindow";
import TemperatureChart from "./components/Temperature";
import WindGraph from "./components/WindGraph";

import {
  check,
  sprayWindowData,
  temperatureData,
  windGraph,
} from "./utils/data";

function App() {
  const [windData, setWindData] = useState(null);

  const getObjectFromUrlQuery = () => {
    const queryParam = Object.fromEntries(
      new URLSearchParams(window.location.search)
    );
    const filteredParams = {};

    const paramsToCheck = ["platform"];

    paramsToCheck.forEach((param) => {
      if (queryParam[param] && queryParam[param] !== "null") {
        filteredParams[param] = queryParam[param];
      }
    });

    return filteredParams;
  };
  useEffect(() => {
    const queryParam = getObjectFromUrlQuery();
    if (queryParam.platform === "ios") {
      if (window.myVariable) {
        setWindData([...window.myVariable]);
      }
    }
  }, [window.myVariable]);

  return (
    <>
      <div style={{ width: "100vw", height: "100vh" }}>
        {/* <TemperatureChart chartData={temperatureData} /> */}
        {windData && windData.length && <WindGraph windData={windData} />}
        {/* <SprayWindowChart sprayWindowData={sprayWindowData} /> */}
      </div>
    </>
  );
}

export default App;
