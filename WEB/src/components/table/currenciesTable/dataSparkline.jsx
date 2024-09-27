import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

// This component is used to display a sparkline chart
const DataSparkline = ({ data, updateTime, width, height }) => {
  const canvasRef = useRef(null); // Ref to the canvas element
  const chartInstanceRef = useRef(null); // To keep track of the chart instance

  // Create the chart when the component mounts
  useEffect(() => {
    const canvas = canvasRef.current; // Get the canvas element

    if (canvas && data) {
      // If there's an existing chart instance, destroy it before creating a new one
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Get the canvas context
      const ctx = canvas.getContext("2d");
      const sparklineData = Object.values(data).map((price) =>
        parseFloat(price),
      );

      // Create a new chart instance and assign it to the ref
      var gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
      gradient.addColorStop(0, "rgba(75, 192, 192, 0.5)"); // Start color
      gradient.addColorStop(1, "rgba(75, 192, 192, 0)"); // End color, fully transparent

      // Create the chart
      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: Array.from({ length: data.length }, (_, i) => i + 1),
          datasets: [
            {
              data: sparklineData, // Example data
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
              fill: true,
              backgroundColor: gradient, // Use the gradient as the background color
              pointRadius: 0,
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: updateTime === undefined ? false : true, // Enable tooltips
              mode: "index",
              intersect: false,
              backgroundColor: "rgba(0, 0, 0, 0.8)", // Background color of the tooltip
              titleFontColor: "rgba(255, 255, 255, 0.8)", // Title color
              bodyFontColor: "rgba(255, 255, 255, 0.8)", // Body text color
              borderColor: "rgba(0, 0, 0, 0.8)", // Border color
              borderWidth: 1, // Border width
              cornerRadius: 5, // Removes rounded corners for a square look
              displayColors: false, // Prevents displaying the color box next to the tooltip text
              callbacks: {
                title: function (context) {
                  // Ensure sevenDayAgo is a Date object, either initialized to updateTime if it's a valid Date, or a new Date if not
                  let sevenDayAgo = new Date(updateTime);
                  if (!(sevenDayAgo instanceof Date && !isNaN(sevenDayAgo))) {
                    sevenDayAgo = new Date(); // Fallback to current date if updateTime is not a valid date
                  }

                  // Move 7 days back
                  sevenDayAgo.setDate(sevenDayAgo.getDate() - 7);

                  // Add context.parsed.x hours to sevenDayAgo
                  sevenDayAgo.setHours(
                    sevenDayAgo.getHours() + context[0].parsed.x,
                  );

                  // Format the date to DD/MM HH:MM
                  const date = sevenDayAgo.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false, // Ensure 24-hour format is used
                  });

                  return date;
                },
                label: function (context) {
                  // Customizes the label shown in the tooltip
                  let label = context.dataset.label || "";

                  if (label) {
                    label += ": ";
                  }
                  if (context.parsed.y !== null) {
                    label += context.parsed.y.toFixed(5);
                  }
                  return "≈ $" + label;
                },
              },
            },
          },
          scales: {
            x: {
              display: false,
            },
            y: {
              display: false,
              beginAtZero: true,
            },
          },
          elements: {
            line: {
              borderWidth: 1,
            },
            point: {
              radius: 0,
            },
          },
          hover: {
            mode: "index", // Highlights the nearest item (point/line) on hover
          },
          maintainAspectRatio: false,
        },
      });
    }

    // Cleanup function to destroy the chart instance when the component unmounts
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data]); // Depend on data prop

  return (
    <div className="flex justify-center w-full">
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};

export default DataSparkline;
