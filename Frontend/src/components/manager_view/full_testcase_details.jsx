// import React, { useState, useEffect } from 'react';
// import { Table, Card, Row, Col, Button } from 'react-bootstrap'; // Import Bootstrap components
// import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate
// import axios from 'axios'; // Import Axios

// const ProjectDetails = () => {
//   const { projectNameId } = useParams(); // Get project ID from URL
//   const navigate = useNavigate(); // For navigating back to the previous page

//   const [projectName, setProjectName] = useState(''); // Project Name state
//   const [projectData, setProjectData] = useState();
//   const [error, setError] = useState(''); // Error state
//   const [loading, setLoading] = useState(false); // Loading state

//   useEffect(() => {
//     // Validate projectNameId and fetch project data
//     if (projectNameId && !isNaN(projectNameId)) {
//       fetchProjectDetails();
//     } else {
//       setError('Invalid project ID in the URL.');
//     }
//   }, [projectNameId]);

//   const fetchProjectDetails = async () => {
//     const token = sessionStorage.getItem('access_token'); // Get the access token from session storage
//     setLoading(true);
//     try {
//       const url = `https://frt4cnbr-5000.inc1.devtunnels.ms/full_test_details/${projectNameId}`;
//       console.log('Requesting data from URL:', url);

//       const response = await axios.get(url, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.status === 200) {
//         // console.log("hello")
//         // console.log(response.data)
//         setProjectName(response.data.project_name || 'Project Name');
//         setProjectData(response.data );
//         console.log("FormData response : ", response.data)
//       } else {
//         throw new Error('Failed to fetch project details.');
//       }
//     } catch (error) {
//       if (error.response) {
//         setError(`Error fetching project details: ${error.response.status} - ${error.response.statusText}`);
//       } else {
//         setError(`Error fetching project details: ${error.message}`);
//       }
//       console.error('Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const renderTable = (data, title, columns, columnMapping) => {
//     console.log("hello")
//     console.log(data)
//     if (!data || data.length === 0) {
//       return (
//         <Card className="mb-4">
//           <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff', borderRadius: '10px 10px 0 0' }}>
//             {title}
//           </Card.Header>
//           <Card.Body>
//             <Table striped bordered hover style={{ borderRadius: '15px', overflow: 'hidden' }}>
//               <thead>
//                 <tr>
//                   {columns.map((col, index) => (
//                     <th key={index}>{col}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td colSpan={columns.length} className="text-center">No data available</td>
//                 </tr>
//               </tbody>
//             </Table>
//           </Card.Body>
//         </Card>
//       );
//     }

//     return (
//       <Card className="mb-4">
//         <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff', borderRadius: '10px 10px 0 0' }}>
//           {title}
//         </Card.Header>
//         <Card.Body>
//           <Table striped bordered hover style={{ borderRadius: '15px', overflow: 'hidden' }}>
//             <thead>
//               <tr>
//                 {columns.map((col, index) => (
//                   <th key={index}>{col}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((item, index) => (
//                 <tr key={item.id || index}>
//                   {columns.map((col, colIndex) => {
//                     const colKey = columnMapping[col] || col.toLowerCase().replace(/\s+/g, '_');
//                     return (
//                       <td key={colIndex}>
//                         {colKey === 'date' && item[colKey] ? formatDate(item[colKey]) : item[colKey] || '-'}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Card.Body>
//       </Card>
//     );
//   };

//   return (
//     <div className="container mt-5">
//       {/* Go Back Button */}
//       <Row className="mt-4">
//         <Col xs={12} className="d-flex justify-content-start">
//           <Button variant="primary" onClick={() => navigate(-1)}>
//             Go Back
//           </Button>
//         </Col>
//       </Row>

//       {/* Project Name */}
//       <Row className="mb-4">
//         <Col xs={12}>
//           <h2>{projectName ? projectName : 'Loading Project...'}</h2>
//         </Col>
//       </Row>

//       {/* Error Message */}
//       {error && <div className="alert alert-danger">{error}</div>}

//       {/* Loading Spinner */}
//       {loading && <div className="alert alert-info">Loading...</div>}

//       {/* Render tables for project data with appropriate column mappings */}
//       {projectData && renderTable(
//         projectData.BuildStatus,
//         'Build Status',
//         ['Month', 'Builds Accepted', 'Builds Rejected', 'Total Build Received', 'Date'],
//         { 'Builds Accepted': 'builds_accepted', 'Builds Rejected': 'builds_rejected', 'Total Build Received': 'total_build_received', 'Date': 'date' }
//       )}   


//       {projectData && renderTable(
//         projectData.DefectAcceptedRejected,
//         'Defect Accepted/Rejected',
//         ['Month', 'Dev Team Accepted', 'Dev Team Rejected', 'Total Defects', 'Date'],
//         { 'Dev Team Accepted': 'dev_team_accepted', 'Dev Team Rejected': 'dev_team_rejected', 'Total Defects': 'total_defects', 'Date': 'date' }
//       )}

//       {projectData && renderTable(
//         projectData.New_defects,
//         'New Defects',
//         ['Month', 'Defect Reopened', 'Functional Defect', 'Regression Defect', 'UAT Defect', 'Date'],
//         { 'Defect Reopened': 'defect_reopened', 'Functional Defect': 'functional_defect', 'Regression Defect': 'regression_defect', 'UAT Defect': 'uat_defect', 'Date': 'date' }
//       )}

//       {projectData && renderTable(
//         projectData.TestCaseCreationStatus,
//         'Test Case Creation Status',
//         ['Month', 'Test Case Approved', 'Test Case Rejected', 'Total Test Cases Created', 'Date'],
//         { 'Test Case Approved': 'test_case_approved', 'Test Case Rejected': 'test_case_rejected', 'Total Test Cases Created': 'total_test_case_created', 'Date': 'date' }
//       )}

//       {projectData && renderTable(
//         projectData.Test_execution_status,
//         'Test Execution Status',
//         ['Month', 'Blocked', 'Fail Count', 'Pass Count', 'No Run', 'Total Execution', 'Date'],
//         { 'Blocked': 'blocked', 'Fail Count': 'fail_count', 'Pass Count': 'pass_count', 'No Run': 'no_run', 'Total Execution': 'total_execution', 'Date': 'date' }
//       )}

//       {projectData && renderTable(
//         projectData.Total_Defect_Status,
//         'Total Defect Status',
//         ['Month', 'Critical', 'High', 'Medium', 'Low', 'Open Defects', 'Defects Closed', 'Total Defect', 'Date'],
//         { 'Critical': 'critical', 'High': 'high', 'Medium': 'medium', 'Low': 'low', 'Open Defects': 'open_defect', 'Defects Closed': 'defect_closed', 'Total Defect': 'total_defect', 'Date': 'date' }
//       )}  


//     </div>
//   );
// };

// export default ProjectDetails;





import React, { useState, useEffect } from 'react';
import { Table, Card, Row, Col, Button } from 'react-bootstrap'; // Import Bootstrap components
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios'; // Import Axios

const ProjectDetails = () => {
  const navigate = useNavigate(); // For navigating back to the previous page

  const [projectName, setProjectName] = useState(''); // Project Name state
  const [projectData, setProjectData] = useState();
  const [error, setError] = useState(''); // Error state
  const [loading, setLoading] = useState(false); // Loading state

  const projectNameId = sessionStorage.getItem('project_name_id'); // Get the project ID from session storage

  useEffect(() => {
    if (projectNameId && !isNaN(projectNameId)) {
      fetchProjectDetails();
    } else {
      setError('Invalid project ID in sessionStorage.');
    }
  }, [projectNameId]);

  const fetchProjectDetails = async () => {
    const token = sessionStorage.getItem('access_token'); // Get the access token from session storage
    setLoading(true);
    try {
      const url = `https://frt4cnbr-5000.inc1.devtunnels.ms/full_test_details/${projectNameId}`;
      console.log('Requesting data from URL:', url);

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setProjectName(response.data.project_name || 'Project Name');
        setProjectData(response.data);
        console.log("FormData response : ", response.data);
      } else {
        throw new Error('Failed to fetch project details.');
      }
    } catch (error) {
      if (error.response) {
        setError(`Error fetching project details: ${error.response.status} - ${error.response.statusText}`);
      } else {
        setError(`Error fetching project details: ${error.message}`);
      }
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const renderTable = (data, title, columns, columnMapping) => {
    if (!data || data.length === 0) {
      return (
        <Card className="mb-4">
          <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff', borderRadius: '10px 10px 0 0' }}>
            {title}
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover style={{ borderRadius: '15px', overflow: 'hidden' }}>
              <thead>
                <tr>
                  {columns.map((col, index) => (
                    <th key={index}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={columns.length} className="text-center">No data available</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      );
    }

    return (
      <Card className="mb-4">
        <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff', borderRadius: '10px 10px 0 0' }}>
          {title}
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover style={{ borderRadius: '15px', overflow: 'hidden' }}>
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id || index}>
                  {columns.map((col, colIndex) => {
                    const colKey = columnMapping[col] || col.toLowerCase().replace(/\s+/g, '_');
                    return (
                      <td key={colIndex}>
                        {colKey === 'date' && item[colKey] ? formatDate(item[colKey]) : item[colKey] || '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div className="container mt-5">
      {/* Go Back Button */}
      <Row className="mt-4">
        <Col xs={12} className="d-flex justify-content-start">
          <Button variant="primary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Col>
      </Row>

      {/* Project Name */}
      <Row className="mb-4">
        <Col xs={12}>
          <h2>{projectName ? projectName : 'Loading Project...'}</h2>
        </Col>
      </Row>

      {/* Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Loading Spinner */}
      {loading && <div className="alert alert-info">Loading...</div>}

      {/* Render tables for project data with appropriate column mappings */}
      {projectData && renderTable(
        projectData.BuildStatus,
        'Build Status',
        ['Month', 'Builds Accepted', 'Builds Rejected', 'Total Build Received', 'Date'],
        { 'Builds Accepted': 'builds_accepted', 'Builds Rejected': 'builds_rejected', 'Total Build Received': 'total_build_received', 'Date': 'date' }
      )}   

      {projectData && renderTable(
        projectData.DefectAcceptedRejected,
        'Defect Accepted/Rejected',
        ['Month', 'Dev Team Accepted', 'Dev Team Rejected', 'Total Defects', 'Date'],
        { 'Dev Team Accepted': 'dev_team_accepted', 'Dev Team Rejected': 'dev_team_rejected', 'Total Defects': 'total_defects', 'Date': 'date' }
      )}

      {projectData && renderTable(
        projectData.New_defects,
        'New Defects',
        ['Month', 'Defect Reopened', 'Functional Defect', 'Regression Defect', 'UAT Defect', 'Date'],
        { 'Defect Reopened': 'defect_reopened', 'Functional Defect': 'functional_defect', 'Regression Defect': 'regression_defect', 'UAT Defect': 'uat_defect', 'Date': 'date' }
      )}

      {projectData && renderTable(
        projectData.TestCaseCreationStatus,
        'Test Case Creation Status',
        ['Month', 'Test Case Approved', 'Test Case Rejected', 'Total Test Cases Created', 'Date'],
        { 'Test Case Approved': 'test_case_approved', 'Test Case Rejected': 'test_case_rejected', 'Total Test Cases Created': 'total_test_case_created', 'Date': 'date' }
      )}

      {projectData && renderTable(
        projectData.Test_execution_status,
        'Test Execution Status',
        ['Month', 'Blocked', 'Fail Count', 'Pass Count', 'No Run', 'Total Execution', 'Date'],
        { 'Blocked': 'blocked', 'Fail Count': 'fail_count', 'Pass Count': 'pass_count', 'No Run': 'no_run', 'Total Execution': 'total_execution', 'Date': 'date' }
      )}

      {projectData && renderTable(
        projectData.Total_Defect_Status,
        'Total Defect Status',
        ['Month', 'Critical', 'High', 'Medium', 'Low', 'Open Defects', 'Defects Closed', 'Total Defect', 'Date'],
        { 'Critical': 'critical', 'High': 'high', 'Medium': 'medium', 'Low': 'low', 'Open Defects': 'open_defect', 'Defects Closed': 'defect_closed', 'Total Defect': 'total_defect', 'Date': 'date' }
      )}
    </div>
  );
};

export default ProjectDetails;
