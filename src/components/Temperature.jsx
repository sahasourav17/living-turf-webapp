import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  LineController,
  Title,
  Tooltip,
  TimeScale,
  TimeSeriesScale,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  TimeScale,
  TimeSeriesScale
);
import "chartjs-adapter-moment";

const TemperatureChart = ({ chartData }) => {
  const groupedData = chartData.reduce((acc, cur) => {
    const date = cur.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(cur);
    return acc;
  }, {});

  const filteredData = Object.values(groupedData).flatMap((dayData) => {
    const filteredDayData = [];
    let prevHour = -2;
    for (const data of dayData) {
      const hour = new Date(data.dateTime).getHours();
      if (hour - prevHour >= 6) {
        filteredDayData.push(data);
        prevHour = hour;
      }
    }
    return filteredDayData;
  });

  const labels = filteredData.map((data) => data.timeStamp);
  const airTemperatureData = filteredData.map((data) => data.airTemperature);
  const soilTemperatureData = filteredData.map((data) => data.soilTemperature);
  const dewPointTemperatureData = filteredData.map(
    (data) => data.dewPointTemperature
  );
  const relativeHumidityData = filteredData.map(
    (data) => data.relativeHumidity
  );

  const timePeriods = chartData.map((data) => {
    const hour = new Date(data.dateTime).getHours();
    if (hour >= 0 && hour < 6) {
      return "Night";
    } else if (hour >= 6 && hour < 12) {
      return "Morning";
    } else if (hour >= 12 && hour < 18) {
      return "Afternoon";
    } else {
      return "Evening";
    }
  });

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Air Temperature",
        data: airTemperatureData,
        borderColor: "rgba(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132)",
        yAxisID: "temperature",
        borderWidth: 1,
        tension: 0.3,
        // pointStyle: false,
      },
      {
        label: "Soil Temperature",
        data: soilTemperatureData,
        borderColor: "rgba(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235)",
        yAxisID: "temperature",
        borderWidth: 1,
        tension: 0.3,
        // pointStyle: false,
      },
      {
        label: "Dew Point Temperature",
        data: dewPointTemperatureData,
        borderColor: "rgba(255, 206, 86)",
        backgroundColor: "rgba(255, 206, 86)",
        yAxisID: "temperature",
        borderWidth: 1,
        tension: 0.3,
        // pointStyle: false,
      },
      {
        label: "Relative Humidity",
        data: relativeHumidityData,
        borderColor: "rgba(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192)",
        yAxisID: "humidity",
        borderWidth: 1,
        tension: 0.3,
        // pointStyle: false,
      },
    ],
  };

  const options = {
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        type: "timeseries",
        stepSize: 2,
        time: {
          displayFormats: {
            hour: "D MMM HH:mm",
          },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Temperature (°C)",
        },
        position: "left",
        id: "temperature",

        ticks: {
          display: false,
        },
      },
      y1: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Relative Humidity (%)",
        },
        position: "right",
        id: "humidity",
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
      y2: {
        display: true,
        // position: "right",
        id: "time",
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          boxWidth: 20,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <>
      <Line data={data} options={options} />
    </>
  );
};

export default TemperatureChart;
