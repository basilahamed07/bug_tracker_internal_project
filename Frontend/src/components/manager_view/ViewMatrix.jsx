import React, { useState,useEffect  } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement
);

const ViewMatrix = () => {
  const { id } = useParams();
  const [reportType, setReportType] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [metricsData, setMetricsData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentMonth, setCurrentMonth] = useState('');




  
  
    useEffect(() => {


      const getCurrentMonthName = () => {
        const months = [
          'January', 'February', 'March', 'April', 'May', 'June', 
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        const today = new Date();
        const currentMonthIndex = today.getMonth(); // Returns 0 for January, 1 for February, etc.
        
        return months[currentMonthIndex];
      };

      const month = getCurrentMonthName();
      setCurrentMonth(month)

      const fetchData = async () => {
    
        try {
          const accessToken = sessionStorage.getItem('access_token');
          console.log("inside the use effect")
          if (!accessToken) {
            setError("Access token not found. Please log in again.");
            return;
          }
    
          let apiUrl = `http://localhost:5000/view_matrix_month_chart/${id}`;
    
          const response = await axios.post(apiUrl, { month: getCurrentMonthName() }, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            }
          });
    
          setMetricsData(response.data);
        } catch (err) {
          setError("Failed to fetch data. Please try again.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }; 
      fetchData();// Set the current month in state
    }, []);


  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
    setMetricsData({});
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const fetchData = async () => {
    if (!selectedMonth) {
      setError("Please select a month.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const accessToken = sessionStorage.getItem('access_token');
      
      if (!accessToken) {
        setError("Access token not found. Please log in again.");
        return;
      }

      let apiUrl = '';
      if (reportType === 'month') {
        apiUrl = `http://localhost:5000/view_matrix_month_chart/${id}`;
      } else if (reportType === 'week') {
        apiUrl = `http://localhost:5000/view_matrix_week/${id}`;
      }

      const response = await axios.post(apiUrl, { month: selectedMonth }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });

      setMetricsData(response.data);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (monthData) => {
    if (Array.isArray(monthData)) {
      const metrics = Object.keys(monthData[0]).filter(key => 
        !['Week', 'Year', 'month'].includes(key)
      );
  
      const colors = ['#FF5733', '#33B5FF', '#8E44AD', '#2ECC71', '#FFEB3B']; // Example color palette
  
      const datasets = metrics.map((metric, index) => ({
        label: metric,
        data: monthData.map(week => week[metric]),
        borderColor: colors[index % colors.length],  // Cycle through colors if there are more metrics
        tension: 0.1,
        fill: false,
      }));
  
      return {
        labels: monthData.map(week => `Week ${week.Week}`),
        datasets: datasets
      };
    } else {
      const labels = Object.keys(monthData);
      const values = Object.values(monthData);
  
      return {
        labels,
        datasets: [
          {
            label: 'Metrics',
            data: values,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1,
            fill: false,
          }
        ]
      };
    }
  };

  // Combine first and second month's data into a single chart
  const combineMonthsData = () => {
    if (metricsData.first_month && metricsData.second_month) {
      const firstMonthChartData = prepareChartData(metricsData.first_month);
      const secondMonthChartData = prepareChartData(metricsData.second_month);

      // Combine the datasets
      const combinedDatasets = [
        ...firstMonthChartData.datasets.map(dataset => ({
          ...dataset,
          label: `${dataset.label} (${currentMonth})`, // Add 'First Month' tag to dataset labels
          borderColor: '#FF5733', // Set specific color for the first month
        })),
        ...secondMonthChartData.datasets.map(dataset => ({
          ...dataset,
          label: `${dataset.label} (previous month)`, // Add 'Second Month' tag to dataset labels
          borderColor: '#33B5FF', // Set specific color for the second month
        }))
      ];

      return {
        labels: firstMonthChartData.labels, // Use the same x-axis labels (weeks)
        datasets: combinedDatasets
      };
    }
    return {};
  };

  const weeklyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 40,
          padding: 10,
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'monthly Metrics Comparison',
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 15
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 11
          }
        }
      }
    }
  };

  const monthlyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 30,
          padding: 20,
          font: {
            size: 10
          }
        }
      },
      title: {
        display: true,
        text: 'Month Metrics',
        font: {
          size: 15
        },
        padding: {
          top: 5,
          bottom: 8
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 10
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 10
          }
        }
      }
    }
  };

  return (
    <div className="container mx-auto p-4" style={{ maxWidth: '1200px' }}>
      <h2 className="text-2xl font-bold mb-4">View Report</h2>


      <div className="mb-4">
        <br />
        <br />
        <h1>Select Report by month of week</h1>
        <br />
        <br />
        <select 
          className="border p-2 rounded mr-4"
          onChange={handleReportTypeChange} 
          value={reportType}
        >
          <option value="">Select Report Type</option>
          <option value="month">Month-wise</option>
          <option value="week">Week-wise</option>
        </select>

        {reportType && (
          <select 
            className="border p-2 rounded mr-4"
            onChange={handleMonthChange} 
            value={selectedMonth}
          >
            <option value="">Select Month</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        )}

        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          onClick={fetchData} 
          disabled={loading}
        >
          {loading ? 'Loading...' : 'View Chart'}
        </button>
      </div>
      
      

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      <div className="mt-4">
        {metricsData[1] ? (
          // Weekly Chart
          <div className="w-full">
            <div className="border rounded-lg shadow-lg p-4" style={{ height: '400px' }}>
              <Line 
                data={prepareChartData(metricsData[1])} 
                options={weeklyChartOptions}
              />
            </div>
          </div>
        ) : (
          // Monthly Charts
          <div className="mt-4">
            {metricsData.first_month && (
              <div className="w-full">
                <div className="border rounded-lg shadow-lg p-4" style={{ height: '500px' }}>
                  <Line 
                    data={combineMonthsData()} 
                    options={weeklyChartOptions} 
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      
    </div>

    
  );
};

export default ViewMatrix;
