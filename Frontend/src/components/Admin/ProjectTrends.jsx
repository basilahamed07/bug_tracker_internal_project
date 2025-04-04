import React, { useState, useEffect } from 'react';
import { FaDownload, FaUpload } from 'react-icons/fa'; // Import FontAwesome icons
import * as XLSX from 'xlsx'; // Import XLSX
import { Link } from 'react-router-dom';
import Defects from "../panel/assets/defects.svg";
import Settings from "../panel/assets/settings.svg";
// import test_execution from "../panel/assets/Test_Execution_Status.svg";
import test_execution from "../panel/assets/Test_ Execution_Status.svg";
import manage_test from "../panel/assets/Total_Defects.svg";
import manage_build from "../panel/assets/manage_build.svg";
import accept_reject from "../panel/assets/accept_reject.svg";
import test_status from "../panel/assets/test_status.svg";
import axios from 'axios'; // Import axios for making API requests
import { jwtDecode } from 'jwt-decode'; // Change this line
import { getUserRoleFromToken } from '../../utils/tokenUtils';

const ProjectTrends = () => {
  const [fileName, setFileName] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    if (token) { 
      try {
        const decoded = jwtDecode(token);
        const roleValue = decoded.sub || decoded.type;
        const role = roleValue === '1' || roleValue === 'access' ? 'admin' : 'testlead';
        console.log('Token decode:', decoded);
        console.log('Role value:', roleValue);
        console.log('Determined role:', role);
        setUserRole(role);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const getRoutesForRole = (role) => {
    console.log('Getting routes for role:', role);
    
    // Note the strict comparison here
    if (role === 'admin') {
      return [
        'AdminPanel/ManageBuzz',
        // 'AdminPanel/MetricsBuzz',
        'AdminPanel/ScrumBuzz',
        'AdminPanel/testingtype',
      ];
    }

    // Default to testlead routes
    return [
      'TestLead/ManageBuzz',
      // 'TestLead/MetricsBuzz',
      'TestLead/ScrumBuzz',
      'TestLead/testingtype',
    ];
  };

  const handleRouteClick = (routeName) => {
    const token = sessionStorage.getItem('access_token');
    const decoded = jwtDecode(token);
    const currentRole = decoded.sub === '1' || decoded.type === 'access' ? 'admin' : 'testlead';
    
    console.group('Route Click Debug Info');
    console.log('Token decode:', decoded);
    console.log('Current role:', currentRole);
    console.log('Route clicked:', routeName);
    console.groupEnd();
  };

  // Get routes based on current role
  const currentRoutes = getRoutesForRole(userRole);

  const svg = [
    Settings,
    manage_test,
    manage_build,
    test_execution,
  ];

  const messages = [
    'Manage Buzz',
    // 'Metrics Buzz',
    'Sprint Buzz',
    'Testing Type'
  ];

  // Function to handle Excel file upload
  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name); // Update file name on state

    // Create a new FormData object to send the file
    const formData = new FormData();
    formData.append('file', file); // Add the file to the FormData object

    // Send the file to the backend
    sendFileToBackend(formData);
  };

  // Function to send the file to the backend
  const sendFileToBackend = async (formData) => {
    try {
      const response = await axios.post('https://h25ggll0-5000.inc1.devtunnels.ms/upload_data', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Make sure to set the content type
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
        },
      });

      console.log("File uploaded successfully:", response.data);
      alert("File uploaded successfully.");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("There was an error uploading the file.");
    }
  };

  const downloadExcel = () => {
    const data = {
      'Manage Defects': [
        ['name', 'Value'],
        ['regression_defect', ''],
        ['functional_defect', ''],
        ['defect_reopened', ''],
        ['uat_defect', ''],
        ['project_name_id', '']
      ],
      'Test Execution Status': [
        ['name', 'Value'],
        ['total_execution', ''],
        ['tc_execution', ''],
        ['pass_count', ''],
        ['fail_count', ''],
        ['no_run', ''],
        ['blocked', ''],
        ['project_name_id', '']
      ],
      'Total Defect Status': [
        ['name', 'Value'],
        ['total_defect', ''],
        ['defect_closed', ''],
        ['open_defect', ''],
        ['critical', ''],
        ['high', ''],
        ['medium', ''],
        ['low', ''],
        ['project_name_id', '']
      ],
      'Build Status': [
        ['name', 'Value'],
        ['total_build_received', ''],
        ['builds_accepted', ''],
        ['builds_rejected', ''],
        ['project_name_id', '']
      ],
      'Defect AcceptedRejected': [
        ['name', 'Value'],
        ['total_defects', ''],
        ['dev_team_accepted', ''],
        ['dev_team_rejected', ''],
        ['project_name_id', '']
      ],
      'Test Case Creation Status': [
        ['name', 'Value'],
        ['total_test_case_created', ''],
        ['test_case_approved', ''],
        ['test_case_rejected', ''],
        ['project_name_id', '']
      ]
    };
  
    const wb = XLSX.utils.book_new();
  
    // Iterate through data object and create a sheet for each category
    for (let sheetName in data) {
      const ws = XLSX.utils.aoa_to_sheet(data[sheetName]);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    }
  
    // Download the Excel file with 6 sheets
    XLSX.writeFile(wb, "Manage_Defects_6_Sheets.xlsx");
  };

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', margin: 0, padding: '20px' }}>
      <h1 style={{ fontSize: '36px', color: '#000d6b', marginBottom: '-40px', fontWeight: 'bold', position: 'relative' }}>Manage input</h1>

      <div style={{ display: 'flex', position: 'absolute', top: '20px', right: '20px', gap: '10px' }}>
        <button onClick={downloadExcel} style={{ padding: '5px 10px', backgroundColor: '#000d6b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '18px' }}>
          <FaDownload />
        </button>

        <label style={{ padding: '5px 10px', backgroundColor: '#fff', color: '#000d6b', border: '1px solid #000d6b', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <FaUpload />
          <input type="file" accept=".xlsx, .xls" onChange={handleUpload} style={{ display: 'none' }} />
        </label>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '40px',
          justifyContent: 'center',
          flexGrow: 1,
        }}
      >
        {currentRoutes.map((route, index) => (
          <Link
            key={index}
            to={`/${route}`}
            onClick={() => handleRouteClick(route)}
            style={{
              textDecoration: 'none',
              width: '300px',
              height: '300px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                textAlign: 'center',
                padding: '20px',
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                boxShadow: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                boxShadow: hoveredIndex === index ? '0 20px 40px rgba(0, 0, 0, 0.35)' : '0 14px 28px rgba(0, 0, 0, 0.25)',
                position: 'relative',
                zIndex: hoveredIndex === index ? 10 : 1,
              }}
            >
              <img
                src={svg[index]}
                alt="Documents"
                style={{
                  width: '2.5cm',
                  height: '2.5cm',
                  color: '#ffffff',
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                }}
              />
              <p style={{ fontSize: '18px', color: 'BLACK' }}>
                {messages[index]}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectTrends;
