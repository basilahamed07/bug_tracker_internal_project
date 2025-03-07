import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import { useTable } from "react-table";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import "./Dashboard.css";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [lineChartData, setLineChartData] = useState({});
  const [pieChartData, setPieChartData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");  // State to track the active tab

  useEffect(() => {
    // Fetch data from backend
    axios.get("http://localhost:5000/ai_insight")
      .then(response => {
        const { summaryData, lineData, pieData, tableData } = response.data;
        setSummary(summaryData);
        setLineChartData(lineData);
        setPieChartData(pieData);
        setTableData(tableData);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const columns = React.useMemo(
    () => [
      { Header: "Project Name", accessor: "project_name" },
      { Header: "RAG Status", accessor: "rag_details" },
      { Header: "Task ID", accessor: "task_id" },
      { Header: "Status", accessor: "status" },
      { Header: "Manager", accessor: "manager" },
      { Header: "Deadline", accessor: "deadline" },
      { Header: "Priority", accessor: "priority" },
      { Header: "Department", accessor: "department" },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: tableData });

  // Components for different tabs
  // const AIInsideComponent = () => (
  //   // <div className="ai-inside-content">
  //   //   <h3>AI Inside</h3>
  //   //   <p>Some details related to AI inside feature...</p>
  //   // </div>
  // );

  const OverviewComponent = () => (
    <div className="overview-content">
      <h3>Project Overview</h3>
      <p>{summary}</p>
    </div>
  );

  const PerformanceComponent = () => (
    <div className="performance-content">
      <h3>Performance Metrics</h3>
      <p>Here are some performance metrics...</p>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Tab Buttons */}
      <div className="tab-buttons">
        {/* <button onClick={() => setActiveTab("aiInside")}>AI Inside</button> */}
        <button onClick={() => setActiveTab("overview")}>Overview</button>
        {/* <button onClick={() => setActiveTab("performance")}>Performance</button> */}
      </div>

      {/* Content based on the active tab */}
      <div className="tab-content">
        {/* {activeTab === "aiInside" && <AIInsideComponent />} */}
        {activeTab === "overview" && <OverviewComponent />}
        {activeTab === "performance" && <PerformanceComponent />}
      </div>

      {/* Conditional Rendering for Charts and Data Table */}
      {activeTab === "overview" && (
        <div>
          {/* Charts Section */}
          <div className="charts-container">
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
                          text: 'Monthly Collection Comparison',
                          font: { size: 18 },
                        },
                      },
                      scales: {
                        x: {
                          beginAtZero: true,
                          grid: { color: '#e0e0e0' },
                          ticks: { color: '#333' },
                        },
                        y: {
                          grid: { color: '#e0e0e0' },
                          ticks: { color: '#333' },
                        },
                      },
                    }} 
                  />
                </div>
              ) : (
                <p>Loading Line Chart...</p>
              )}
            </div>

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
                          text: 'Project Breakdown',
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

          {/* Data Table */}
          <div className="table-container">
            <h3>Project Data</h3>
            <table {...getTableProps()} border="1">
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map(cell => {
                        return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
