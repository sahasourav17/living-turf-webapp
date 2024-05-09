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
  TimeScale
);
const TemperatureChart = ({ chartData }) => {
  const labels = chartData.map((data) => data.date);
  const airTemperatureData = chartData.map((data) => data.airTemperature);
  const soilTemperatureData = chartData.map((data) => data.soilTemperature);
  const dewPointTemperatureData = chartData.map(
    (data) => data.dewPointTemperature
  );
  const relativeHumidityData = chartData.map((data) => data.relativeHumidity);

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

  console.log(timePeriods);

  const data = {
    // labels: uniqueLabels,
    labels: labels,
    datasets: [
      {
        label: "Air Temperature",
        data: airTemperatureData,
        borderColor: "rgba(255, 99, 132, 0.6)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        yAxisID: "temperature",
        borderWidth: 1.5,
        // pointStyle: false,
      },
      {
        label: "Soil Temperature",
        data: soilTemperatureData,
        borderColor: "rgba(54, 162, 235, 0.6)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        yAxisID: "temperature",
        borderWidth: 1.5,
        pointStyle: false,
      },
      {
        label: "Dew Point Temperature",
        data: dewPointTemperatureData,
        borderColor: "rgba(255, 206, 86, 0.6)",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        yAxisID: "temperature",
        borderWidth: 1.5,
        pointStyle: false,
      },
      {
        label: "Relative Humidity",
        data: relativeHumidityData,
        borderColor: "rgba(75, 192, 192, 0.6)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        yAxisID: "humidity",
        borderWidth: 1.5,
        pointStyle: false,
      },
      {
        label: "Time Periods",
        data: timePeriods,
        type: "bar",
        yAxisID: "time",
        borderWidth: 1,
        categoryPercentage: 1.0,
        barPercentage: 0.8,
        order: 0,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        // type: "time",
        // time: {
        //   tooltipFormat: "ll",
        //   unit: "day",
        // },
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
  };

  return (
    <>
      <Line data={data} options={options} />
    </>
  );
};

export default TemperatureChart;
