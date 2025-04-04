import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Pie } from "react-chartjs-2"; // Import Pie chart
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams to get dynamic URL params
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import "./Dashboard.css";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [summary, setSummary] = useState(""); // Initialize as an empty string or null
  const [lineChartData, setLineChartData] = useState({});
  const [pieChartData, setPieChartData] = useState({});
  const [activeTab, setActiveTab] = useState("overview");  // State to track the active tab

  const { projectId } = useParams(); // Get the dynamic projectId from the URL

  useEffect(() => {
    if (projectId) {
      // Fetch data from backend using the dynamic projectId from URL
      axios.get(`https://h25ggll0-5000.inc1.devtunnels.ms/ai_insight/${projectId}`)
        .then(response => {
          console.log(response.data); // Check the structure of the response
          const { summary, matrix } = response.data;

          // Ensure proper setting of states
          setSummary(formatSummary(summary));  // Format the summary
          setLineChartData(generateLineChartData(matrix.latest_metrics)); // Generate line chart data
          setPieChartData(generatePieChartData(matrix.latest_metrics));  // Generate pie chart data
        })
        .catch(error => {
          console.error("Error fetching data:", error);
        });
    }
  }, [projectId]); // Trigger effect whenever projectId changes

  // Function to format the summary text
  const formatSummary = (summaryText) => {
    // Bold any text in the format of **name** and remove '\n' or '\n2'
    let formattedSummary = summaryText;

    // Bold pattern: **name**
    formattedSummary = formattedSummary.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    
    // Remove unwanted '\n' and '\n2'
    formattedSummary = formattedSummary.replace(/\\n|\\n2/g, "");

    return formattedSummary;
  };

  // Function to generate line chart data from the latest metrics
  const generateLineChartData = (latestMetrics) => {
    const excludedFields = ["date", "id", "month", "project_name_id", "user_id"];
    const filteredMetrics = Object.entries(latestMetrics)
      .filter(([key]) => !excludedFields.includes(key)) // Remove unwanted fields
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    const metricNames = Object.keys(filteredMetrics);
    const metricValues = Object.values(filteredMetrics);

    return {
      labels: metricNames,
      datasets: [
        {
          label: "Metrics Overview",
          data: metricValues,
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
          tension: 0.1,
        },
      ],
    };
  };

  // Function to generate pie chart data from the latest metrics
  const generatePieChartData = (latestMetrics) => {
    const excludedFields = ["date", "id", "month", "project_name_id", "user_id"];
    const filteredMetrics = Object.entries(latestMetrics)
      .filter(([key]) => !excludedFields.includes(key)) // Remove unwanted fields
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    // Calculate the total sum of the metrics
    const total = Object.values(filteredMetrics).reduce((sum, value) => sum + value, 0);

    // Calculate percentage for each metric
    const metricPercentages = Object.entries(filteredMetrics).map(([key, value]) => ({
      label: key,
      value: (value / total) * 100,  // Calculate the percentage
    }));

    // Prepare Pie chart data
    return {
      labels: metricPercentages.map((item) => item.label),
      datasets: [
        {
          data: metricPercentages.map((item) => item.value),
          backgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#FF9F40", "#4BC0C0",
            "#FFB6C1", "#98C9E3", "#B0E57C", "#7C88A3", "#A76D45"
          ], // Array of colors for the pie chart segments
          hoverOffset: 4, // Hover effect
        },
      ],
    };
  };

  // Overview Component
  const OverviewComponent = () => (
    <div className="overview-content">
      <h3>Project Overview</h3>
      <p dangerouslySetInnerHTML={{ __html: summary }} /> {/* Render the formatted summary as HTML */}
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Tab Buttons */}
      <div className="tab-buttons">
        <button onClick={() => setActiveTab("overview")}>Overview</button>
      </div>

      {/* Content based on the active tab */}
      <div className="tab-content">
        {activeTab === "overview" && <OverviewComponent />}
      </div>

      {/* Conditional Rendering for Charts */}
      {activeTab === "overview" && (
        <div>
          {/* Charts Section */}
          <div className="charts-container">
            {/* Line Chart */}
            <div className="chart">
              <h3>Line Chart</h3>
              {lineChartData && lineChartData.labels && lineChartData.datasets ? (
                <div className="chart-container">
                  <Line
                    data={lineChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        title: {
                          display: true,
                          text: "Metrics Comparison",
                          font: { size: 18 },
                        },
                      },
                      scales: {
                        x: {
                          beginAtZero: true,
                          grid: { color: "#e0e0e0" },
                          ticks: { color: "#333" },
                        },
                        y: {
                          grid: { color: "#e0e0e0" },
                          ticks: { color: "#333" },
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <p>Loading Line Chart...</p>
              )}
            </div>

            {/* Pie Chart */}
            <div className="chart">
              <h3>Pie Chart</h3>
              {pieChartData && pieChartData.labels && pieChartData.datasets ? (
                <div className="chart-container">
                  <Pie
                    data={pieChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        title: {
                          display: true,
                          text: "Metrics Distribution",
                          font: { size: 18 },
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <p>Loading Pie Chart...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
