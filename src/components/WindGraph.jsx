// WindGraph.js
import React from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart } from "chart.js";

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
    let prevHour = -2;
    for (const data of dayData) {
      const hour = new Date(data.dateTime).getHours();
      if (hour - prevHour >= 2) {
        filteredDayData.push(data);
        prevHour = hour;
      }
    }
    return filteredDayData;
  });

  //   console.log(filteredData);
  // const filteredData = [...windData];

  const labels = filteredData.map((data) => {
    const [year, month, day] = data.date.split("-");
    return `${parseInt(day)} ${new Date(
      parseInt(year),
      parseInt(month) - 1
    ).toLocaleString("en", { month: "short" })}`;
  });
  // const labels = filteredData.map((data) => data.date);
  const windSpeedData = filteredData.map((data) => data.windSpeed);
  const gustsData = filteredData.map((data) => data.gusts);
  const windDirectionData = filteredData.map((data) => data.windDirection);

  const timePeriods = windData.map((data) => {
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
  // console.log(timePeriods);

  //   const arrowPlugin = {
  //     id: "arrows",
  //     afterDraw: (chart) => {
  //       const ctx = chart.ctx;

  //       chart.data.datasets.forEach((dataset, index) => {
  //         const meta = chart.getDatasetMeta(index);
  //         const yOffset = (chart.chartArea.top + chart.chartArea.bottom) / 2;
  //         if (!meta.hidden) {
  //           meta.data.forEach((element, index) => {
  //             const windDirection = windDirectionData[index];
  //             const x = element.x;
  //             const y = yOffset + 0.5;

  //             const radius = element.options.radius || 6;
  //             const arrowSize = 6;

  //             let angle;
  //             switch (windDirection) {
  //               case "N":
  //                 angle = 0;
  //                 break;
  //               case "NE":
  //                 angle = Math.PI / 4;
  //                 break;
  //               case "E":
  //                 angle = Math.PI / 2;
  //                 break;
  //               case "SE":
  //                 angle = (3 * Math.PI) / 4;
  //                 break;
  //               case "S":
  //                 angle = Math.PI;
  //                 break;
  //               case "SW":
  //                 angle = (5 * Math.PI) / 4;
  //                 break;
  //               case "W":
  //                 angle = (3 * Math.PI) / 2;
  //                 break;
  //               case "NW":
  //                 angle = (7 * Math.PI) / 4;
  //                 break;
  //               default:
  //                 angle = 0;
  //             }

  //             if (windDirection) {
  //               ctx.save();
  //               ctx.translate(x, y);
  //               ctx.rotate(angle);
  //               //   ctx.beginPath();
  //               //   ctx.moveTo(-radius / 2, -radius);
  //               //   ctx.lineTo(radius / 2, -radius);
  //               //   ctx.lineTo(0, 0);
  //               //   ctx.closePath();

  //               ctx.beginPath();
  //               ctx.moveTo(0, -radius);
  //               ctx.lineTo(-arrowSize / 2, -radius + arrowSize);
  //               ctx.lineTo(arrowSize / 2, -radius + arrowSize);
  //               ctx.closePath();
  //               ctx.fillStyle = dataset.color;
  //               ctx.fill();
  //               ctx.fillStyle = dataset.color;
  //               ctx.fill();

  //               ctx.restore();
  //             }
  //           });
  //         }
  //       });
  //     },
  //   };

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
      {
        label: "times of the day",
        type: "bar",
        data: [1, 1, 1, 1, 1],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 0.6)",
        borderWidth: 1,
        yAxisID: "speed",
      },
    ],
  };

  const options = {
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      // x: {
      //   type: "time",
      //   parsing: false,
      //   labels: labels,
      //   title: {
      //     display: true,
      //     text: "Date",
      //   },
      // },
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
      {/* <Bar data={barwindData} options={options} /> */}
    </>
  );
};

export default WindGraph;
