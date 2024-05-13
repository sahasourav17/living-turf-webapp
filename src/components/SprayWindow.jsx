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

const SprayWindowChart = ({ sprayWindowData }) => {
  const groupedData = sprayWindowData.reduce((acc, cur) => {
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
  const windSpeedData = filteredData.map((data) => data.windSpeed);
  const deltaTData = filteredData.map((data) => data.deltaT);

  const data = {
    // labels: uniqueLabels,
    labels: labels,
    datasets: [
      {
        label: "wind speed",
        data: windSpeedData,
        borderColor: "rgba(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132)",
        yAxisID: "windSpeed",
        borderWidth: 2,
        tension: 0.3,
        pointStyle: false,
      },
      {
        label: "delta T",
        data: deltaTData,
        type: "bar",
        yAxisID: "deltaT",
        backgroundColor: `rgba(54, 162, 235, 0.7)`,
        borderWidth: 1,
        categoryPercentage: 1.0,
        barPercentage: 0.5,
        order: 0,
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
          text: "Wind Speed (Km/hr)",
        },
        position: "right",
        id: "windSpeed",
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
      y1: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Delta T",
        },
        position: "left",
        id: "deltaT",
        ticks: {
          display: false,
        },
        grid: {
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

export default SprayWindowChart;
