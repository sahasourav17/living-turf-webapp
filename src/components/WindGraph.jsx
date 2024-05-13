// WindGraph.js
import React from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart, TimeScale, TimeSeriesScale } from "chart.js";
import "chartjs-adapter-moment";

// Chart.register(TimeScale);
const WindGraph = ({ windData }) => {
  const groupedData = windData.reduce((acc, cur) => {
    const date = cur.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(cur);
    return acc;
  }, {});

  const filteredData = Object.values(groupedData).flatMap((dayData) => {
    const filteredDayData = [];
    let prevHour = -6;
    for (const data of dayData) {
      const hour = new Date(data.dateTime).getHours();
      if (hour - prevHour >= 6) {
        filteredDayData.push(data);
        prevHour = hour;
      }
    }
    return filteredDayData;
  });

  //   console.log(filteredData);
  // const filteredData = [...windData];

  // const labels = filteredData.map((data) => {
  //   const [year, month, day] = data.date.split("-");
  //   return `${parseInt(day)} ${new Date(
  //     parseInt(year),
  //     parseInt(month) - 1
  //   ).toLocaleString("en", { month: "short" })}`;
  // });

  const labels = filteredData.map((data) => data.dateTime);
  const windSpeedData = filteredData.map((data) => data.windSpeed);
  const gustsData = filteredData.map((data) => data.gusts);
  const windDirectionData = filteredData.map((data) => data.windDirection);

  // const mergedData = [];
  // let currentPeriod = timePeriods[0];
  // let count = 1;

  // for (let i = 1; i < timePeriods.length; i++) {
  //   if (timePeriods[i] === currentPeriod) {
  //     count++;
  //   } else {
  //     mergedData.push(count);
  //     currentPeriod = timePeriods[i];
  //     count = 1;
  //   }
  // }

  // mergedData.push(count);

  const arrowPlugin = {
    id: "arrows",
    afterDraw: (chart) => {
      const ctx = chart.ctx;
      const meta = chart.getDatasetMeta(0); // Assuming arrows are for the first dataset

      if (!meta.hidden) {
        const yOffset = (chart.chartArea.top + chart.chartArea.bottom) / 2; // Calculate middle point of y-axis

        meta.data.forEach((element, index) => {
          const windDirection = windDirectionData[index];
          const x = element.x;
          const y = yOffset; // Align arrows at the middle of the graph

          const arrowSize = 6; // Size of arrowhead
          const radius = element.options.radius || 5;

          let angle;
          switch (windDirection) {
            case "N":
              angle = 0;
              break;
            case "NE":
              angle = Math.PI / 4;
              break;
            case "E":
              angle = Math.PI / 2;
              break;
            case "SE":
              angle = (3 * Math.PI) / 4;
              break;
            case "S":
              angle = Math.PI;
              break;
            case "SW":
              angle = (5 * Math.PI) / 4;
              break;
            case "W":
              angle = (3 * Math.PI) / 2;
              break;
            case "NW":
              angle = (7 * Math.PI) / 4;
              break;
            default:
              angle = 0;
          }

          if (windDirection) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);

            // Draw arrow line
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -radius);
            // ctx.strokeStyle = dataset.color;
            ctx.stroke();

            // Draw arrowhead
            ctx.beginPath();
            ctx.moveTo(0, -radius);
            ctx.lineTo(-arrowSize / 2, -radius + arrowSize);
            ctx.lineTo(arrowSize / 2, -radius + arrowSize);
            ctx.closePath();
            // ctx.fillStyle = dataset.color;
            ctx.fill();

            ctx.restore();
          }
        });
      }
    },
  };

  Chart.register(arrowPlugin);
  Chart.register(TimeScale, TimeSeriesScale);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Wind Speed",
        data: windSpeedData,
        borderColor: "green",
        backgroundColor: "green",
        yAxisID: "speed",
        borderWidth: 1,
        pointRadius: 2,
        pointHoverRadius: 2,
        tension: 0.4,
      },
      {
        label: "Gusts",
        data: gustsData,
        borderColor: "lightgreen",
        backgroundColor: "lightgreen",
        yAxisID: "speed",
        borderWidth: 1.5,
        pointStyle: "rect",
        pointRadius: 2,
        pointHoverRadius: 2,
        tension: 0.4,
      },
      // {
      //   label: "times of the day",
      //   type: "bar",
      //   data: mergedData,
      //   backgroundColor: "rgba(255, 99, 132, 0.2)",
      //   borderColor: "rgba(255, 99, 132, 0.6)",
      //   borderWidth: 1,
      //   yAxisID: "speed",
      // },
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
          text: "Wind Speed (m/s)",
        },
        ticks: {
          display: false, // Hide x-axis ticks
        },
        position: "right",
        id: "speed",
      },
      y1: {
        beginAtZero: true,
        title: {
          display: true,
          text: "wind direction",
        },
        ticks: {
          display: false, // Hide x-axis ticks
        },
        position: "left",
        id: "direction",
      },
    },
  };

  return (
    <>
      <Line data={data} options={options} />
    </>
  );
};

export default WindGraph;
