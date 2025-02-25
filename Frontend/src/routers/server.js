const express = require("express");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());

// Sample data for the response
const data = {
    summaryData: `
      SixData is an advanced data visualization and analytics project aimed at helping businesses extract actionable insights from vast datasets. 
      By leveraging powerful tools like charts and tables, SixData presents clear, intuitive visualizations that assist decision-makers in tracking trends, 
      identifying patterns, and understanding complex datasets. The project utilizes modern technologies like React and Express.js for a seamless, responsive 
      experience, offering users detailed analytics in the form of pie charts, line graphs, and tabular data. SixData enables businesses to make informed decisions 
      backed by visualized data, ensuring better operational strategies and growth.
    `,
    lineData: {
      labels: [
        "LeakDefact", "FaultPattern", "AnomalyTest", "LeakCheck", "ValidationStep", "DeviationMeasure", "TestDefect", "TrendAnalysis", "FailurePoint", "CriticalTest"
      ], // Custom names instead of Week 1, Week 2, etc.
      datasets: [
        {
          label: "Collection 1",
          data: [120, 145, 132, 140, 150, 160, 170, 175, 180, 190], // Data for Collection 1
          fill: true,
          borderColor: "rgb(75, 192, 192)", // Line color
          backgroundColor: "rgba(75, 192, 192, 0.2)", // Fill color under the line
          tension: 0.4, // Smooth the curve
        },
        {
          label: "Collection 2",
          data: [90, 110, 115, 120, 125, 135, 145, 150, 155, 165], // Data for Collection 2
          fill: true,
          borderColor: "rgb(255, 99, 132)", // Line color
          backgroundColor: "rgba(255, 99, 132, 0.2)", // Fill color under the line
          tension: 0.4, // Smooth the curve
        }
      ]
    },
    pieData: {
      labels: ["Section 1", "Section 2", "Section 3", "Section 4", "Section 5", "Section 6", "Section 7", "Section 8"],
      datasets: [
        {
          data: [50, 100, 80, 60, 90, 120, 70, 150],
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
          ],
          hoverOffset: 4,
        },
      ],
    },
    tableData: [
      { project_name: "SixData", rag_details: "Completed", task_id: 101, status: "Active", manager: "Alice", deadline: "2025-12-31", priority: "High", department: "Analytics", client: "Company A" },
      { project_name: "SixData", rag_details: "In Progress", task_id: 102, status: "Pending", manager: "Bob", deadline: "2025-11-30", priority: "Medium", department: "Data Science", client: "Company B" },
      { project_name: "SixData", rag_details: "Completed", task_id: 103, status: "Completed", manager: "Charlie", deadline: "2025-10-15", priority: "Low", department: "Operations", client: "Company C" },
      { project_name: "SixData", rag_details: "In Progress", task_id: 104, status: "Active", manager: "David", deadline: "2025-09-20", priority: "High", department: "Business Intelligence", client: "Company D" },
      { project_name: "SixData", rag_details: "On Hold", task_id: 105, status: "On Hold", manager: "Eve", deadline: "2025-08-25", priority: "Low", department: "Development", client: "Company E" },
    ],
  };
  
  // API endpoint
  app.get("/api/data", (req, res) => {
    res.json(data);
  });
  

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
