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
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

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
  TimeSeriesScale,
  Legend
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
        label: "Ave Temp (°C)",
        data: airTemperatureData,
        borderColor: "rgba(245, 126, 66)",
        backgroundColor: "rgba(245, 126, 66)",
        borderWidth: 2,
        tension: 0.3,
        pointStyle: false,
      },
      {
        label: "Soil Temp (°C)",
        data: soilTemperatureData,
        borderColor: "black",
        backgroundColor: "black",
        borderWidth: 2,
        tension: 0.3,
        borderDash: [10, 5],
        pointStyle: false,
      },
      {
        label: "Humidity (%)",
        data: relativeHumidityData,
        borderColor: "blue",
        backgroundColor: "blue",
        borderWidth: 2,
        tension: 0.3,
        pointStyle: false,
      },
    ],
  };

  const dewPointTemperatureDataset = {
    label: "Dewpoint (°C)",
    data: dewPointTemperatureData,
    backgroundColor: "rgba(8, 189, 49)",
    type: "bar",
    barThickness: "flex",
  };

  data.datasets.push(dewPointTemperatureDataset);

  const maxTemperature = Math.max(
    Math.max(...airTemperatureData),
    Math.max(...soilTemperatureData),
    Math.max(...dewPointTemperatureData)
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        type: "timeseries",
        stepSize: 2,
        grid: {
          display: false,
        },
        time: {
          displayFormats: {
            hour: "D MMM",
          },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Temperature (°C)",
        },
        suggestedMin: 0,
        suggestedMax: maxTemperature,
        position: "left",
        id: "temperature",
        ticks: {
          stepSize: 10,
        },
      },
      y1: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Humidity (%)",
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
          generateLabels: function (chart) {
            return chart.data.datasets.map(function (dataset, index) {
              return {
                text: dataset.label,
                fillStyle: dataset.backgroundColor || "rgba(0,0,0,0)",
                strokeStyle: dataset.borderColor || "rgba(0,0,0,0)",
                lineWidth: dataset.borderWidth || 1,
                borderDash: dataset.borderDash || [],
                pointStyle: "line",
                index: index,
              };
            });
          },
        },
      },
      title: {
        display: true,
        text: "Temperatures & Humidity",
        font: {
          size: 16,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 10,
        },
        position: "top",
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
