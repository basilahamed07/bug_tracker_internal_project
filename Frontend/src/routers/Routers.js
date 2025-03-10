// MY CODE 
// Router.js
import React from "react";
import { Routes, Route } from "react-router-dom";

import NotFound from "../pages/NotFound";

import SlidingAuth from "../pages/SignIn";
import AdminPanel from "../pages/AdminPanel"; 
import ProjectInfo from "../components/Admin/ProjectInfo";
import AddProject from "../components/Admin/AddProject";
import CreateProjectDetails from "../components/Admin/CreateProjectDetails";
import ProjectTrends from "../components/Admin/ProjectTrends";
import ManageDefects from "../components/Admin/ManageDefects";
import ManageBuildStatus from "../components/Admin/ManageBuildStatus";
import ManageDefectAcceptedRejected from "../components/Admin/ManageDefectAcceptedRejected";
import ManageTestCaseCreationStatus from "../components/Admin/ManageTestCaseCreation";
import ManageTestExecutionStatus from "../components/Admin/ManageTestExecutionStatus";
import ManageTotalDefectStatus from "../components/Admin/ManageTotalDefectStatus";
import ManagerView from "../components/manager_view/manager_view";
import ProjectDetails from "../components/manager_view/full_testcase_details";
import TestersDetails from "../components/manager_view/TestersDetails";
import AdminProjectTable from "../components/Admin/adminprojecttable";
import AdminAddProjectWithDetails from "../components/Admin/adminprojectadd";
import UserManagement from "../components/Admin/usermanagement";
import RegisterPage from "../components/Admin/RegisterPage";
import ProtectedRoute from "./ProtectedRoute"; // Import the ProtectedRoute component
import ViewMatrix from "../components/manager_view/ViewMatrix";
import MatrixInput from "../components/Admin/MatrixInput";
import MatrixView from "../pages/metrix_view";
import ManageBuzz from "../components/Admin/ManangeBuzz";
import MetricsBuzz from "../components/Admin/MetricsBuzz";
import ScrumBuzz from "../components/Admin/ScrumBuzz";
import Dashboard from "../components/test_comp/dashbord";
import Summary from "../components/Admin/Summary";
import SummaryProjects from "../components/Admin/SummaryProjects";
import CreateSprint from "../components/Admin/CreateSprint";
import ScrumTeamDashboard from "../components/Admin/staticpage";
import SprintStatus from "../components/Admin/SprintStatus";
import ScrumTeamManagement from "../components/Admin/ScrumTeamManagement";
import NonAgile from "../components/Admin/NonAgile";
import Nonagileview from "../components/Admin/Nonagileview";
import ScrumDetails from "../components/Admin/ScrumDetails";
import SprintDetailsTable from "../components/Admin/SprintDetailsTable";
import AdminScrumBuzz from "../components/Admin/AdminScrum";
// import ScrumTeamManagement from "../components/Admin/ScrumTeamManagement";
import ScrumManagerView from "../components/Admin/staticpage";
// import ScrumBuzz from "../components/Admin/ScrumBuzz"


// import NonAgile from "../components/Admin/nonagile"
import TestingType from "../components/Admin/testingtype"
import NonAgileEdit from "../components/Admin/nonagiledataform_edite"
import NonAgileForm from "../components/Admin/nonagiledataform"

const Routers = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<Navigate to="/signin" />} /> */}
      <Route path="/" element={<SlidingAuth />} />
      <Route path="RegisterPage" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}> {/* Wrap with ProtectedRoute */}

        <Route path="/ManagerView" element={<AdminPanel />}> 
          <Route path="manager_view" element={<ManagerView />} />
          <Route path="full_test_details/:projectNameId" element={<ProjectDetails />} /> {/* Dynamic Route */}
          <Route path="tester_count/:projectNameId" element={<TestersDetails />} />
          <Route path="project_metrics/:id" element={<ViewMatrix />} />
          <Route path="ai_insist/:projectId" element={<Dashboard />} />
          <Route path="ScrumTeamDashboard" element={<ScrumTeamDashboard />} />
          <Route path="ScrumDetails" element={<ScrumDetails />} />
          <Route path="SprintStatus" element={<SprintStatus />} />
          <Route path="Nonagileview" element={<Nonagileview />} />
          <Route path="SprintDetailsTable" element={<SprintDetailsTable />} />
          
          <Route path="ScrumManagerView" element={<ScrumManagerView />} />

          <Route path="NonAgile/:id" element={<NonAgile />} />
          
          
          </Route>

        <Route path="/TestLead" element={<AdminPanel />}>

          {/* THIS CAN ACCESS FOR TESTLEAD AND ADMIN */}
          {/* accessable for test_lead */}


          <Route path="add-project" element={<AddProject />} />
          <Route path="create-project-details" element={<CreateProjectDetails />} />
          <Route path="project-info" element={<ProjectInfo />} />
          <Route path="project-trends" element={<ProjectTrends />} />
          <Route path="ManageDefects" element={<ManageDefects />} />
          <Route path="ManageTestExecutionStatus" element={<ManageTestExecutionStatus />} />
          <Route path="ManageTotalDefectStatus" element={<ManageTotalDefectStatus />} />
          <Route path="ManageBuildStatus" element={<ManageBuildStatus />} />
          <Route path="ManageDefectAcceptedRejected" element={<ManageDefectAcceptedRejected />} />
          <Route path="MatrixInput" element={<MatrixInput />} />
          <Route path="ScrumTeamManagement" element={<ScrumTeamManagement />} />
          {/* <Route path="Nonagile" element={<Nonagile />} /> */}
          <Route path="Nonagileview" element={<Nonagileview />} />
          {/* <Route path="ScrumTeamManagement" element={<ScrumTeamManagement />} /> */}

          <Route path="ScrumBuzz" element={<ScrumBuzz />} />


          <Route path="NonAgileForm" element={<NonAgileForm />} />
          <Route path="ManageTestCaseCreationStatus" element={<ManageTestCaseCreationStatus />} /></Route>

        {/* Admin Panel Nested Routes */}
        <Route path="/AdminPanel" element={<AdminPanel />}>
          {/* THIS CAN ACCESS FOR TESTLEAD AND ADMIN */}
          {/* accessable for test_lead */}
          <Route path="add-project" element={<AddProject />} />
          <Route path="create-project-details" element={<CreateProjectDetails />} />
          {/* <Route path="project-report" element={<ProjectReport />} /> */}
          <Route path="project-info" element={<ProjectInfo />} />
          <Route path="project-trends" element={<ProjectTrends />} />
          <Route path="ManageDefects" element={<ManageDefects />} />
          <Route path="ManageBuzz" element={<ManageBuzz />} />
          <Route path="NonAgileForm" element={<NonAgileForm />} />
          <Route path="ScrumTeamManagement" element={<ScrumTeamManagement />} />
          <Route path="ScrumBuzz" element={<ScrumBuzz />} /> 
          <Route path="CreateSprint" element={<CreateSprint />} />
          <Route path="MetricsBuzz" element={<MetricsBuzz />} />
          <Route path="ManageTestExecutionStatus" element={<ManageTestExecutionStatus />} />
          <Route path="ManageTotalDefectStatus" element={<ManageTotalDefectStatus />} />
          <Route path="ManageBuildStatus" element={<ManageBuildStatus />} />
          <Route path="ManageDefectAcceptedRejected" element={<ManageDefectAcceptedRejected />} />
          <Route path="MatrixInput" element={<MatrixInput />} />
          <Route path="ManageTestCaseCreationStatus" element={<ManageTestCaseCreationStatus />} />
          <Route path="ScrumDetails" element={<ScrumDetails />} />
          <Route path="AdminScrumBuzz" element={<AdminScrumBuzz />} />          
          <Route path="Summary" element={<Summary />} />
          <Route path="SummaryProjects" element={<SummaryProjects />} /> 
          <Route path="sampe_test" element={<Dashboard />} />
          <Route path="testingtype" element={<TestingType />} />
          <Route path="NonAgileEdit" element={<NonAgileEdit />} />


          {/* THIS CAN ACCESS FOR TESTLEAD AND ADMIN */}

          {/* for admin */}
          {/* FOR ADMIN ONLY */}
          <Route path="viewproject" element={<AdminProjectTable />} />
          <Route path="adminaddproject" element={<AdminAddProjectWithDetails />} />
          <Route path="add-user" element={<UserManagement />} />
          <Route path="matrix-view" element={<MatrixView />} />
          {/* <Route path="viewproject" element={<AdminProjectTable />} /> */}
        </Route>
      </Route>
      <Route path="sampe_test" element={<Dashboard />} />      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routers;


// import React, { useState, useEffect } from 'react';
// import { Table, Card, Modal, Button } from 'react-bootstrap';
// import FixedChatBot from './Chatbot';

// const ManagerView = () => {
//   const [projects, setProjects] = useState([]);
//   const [testers, setTesters] = useState([]);  // State to hold all testers
//   const [projectName, setProjectName] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [modalContent, setModalContent] = useState('');

//   useEffect(() => {
//     fetchProjects();
//     fetchAllTesters();  // Fetch all testers when the component loads
//   }, []);

//   const fetchProjects = async () => {
//     const token = sessionStorage.getItem('access_token');
//     try {
//       const response = await fetch('https://frt4cnbr-5000.inc1.devtunnels.ms/project-details-manager-view', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         }
//       });

//       const data = await response.json();
//       setProjects(data.project_details);
//       setProjectName(data.project_name);
//       console.log("Fetched Data: ", data);
//     } catch (error) {
//       console.error('Error fetching projects:', error);
//     }
//   };

//   // Fetch all testers from the provided endpoint
//   const fetchAllTesters = async () => {
//     const token = sessionStorage.getItem('access_token');
//     try {
//       const response = await fetch('https://frt4cnbr-5000.inc1.devtunnels.ms/tester-billable', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         }
//       });

//       const data = await response.json();
//       setTesters(data.testers);  // Set the testers data into the state
//       console.log("All Testers: ", data.testers);
//     } catch (error) {
//       console.error('Error fetching testers:', error);
//     }
//   };

//   const getRagClass = (rag) => {
//     switch (rag) {
//       case 'Red':
//         return 'bg-danger text-white';
//       case 'Green':
//         return 'bg-success text-white';
//       case 'Amber':
//         return 'bg-warning text-dark';
//       default:
//         return '';
//     }
//   };

  // const handleModalOpen = (title, content) => {
  //   setModalContent({ title, content });
  //   setShowModal(true);
  // };

//   const renderAutomation = (automation, automationDetails) => {
//     return (
//       <span
//         className="badge bg-info text-white"
//         style={{ cursor: 'pointer' }}
//         onClick={() => handleModalOpen('Automation Details', automation ? automationDetails : 'No automation details available')}
//       >
//         {automation ? 'True' : 'False'}
//       </span>
//     );
//   };

//   const renderAI = (aiUsed, aiDetails) => {
//     return (
//       <span
//         className="badge bg-info text-white"
//         style={{ cursor: 'pointer' }}
//         onClick={() => handleModalOpen('AI Details', aiUsed ? aiDetails : 'No AI details available')}
//       >
//         {aiUsed ? 'True' : 'False'}
//       </span>
//     );
//   };

//   const renderRag = (rag, ragDetails) => {
//     return (
//       <span
//         className={`badge ${getRagClass(rag)}`}
//         style={{ cursor: 'pointer' }}
//         onClick={() => handleModalOpen('RAG Status Details', ragDetails || 'No details available')}
//       >
//         {rag}
//       </span>
//     );
//   };

//   const handle_view_details = (project_name_id, agile) => {
//     sessionStorage.setItem('project_name_id', project_name_id);

//     if (agile) {
//       window.location.href = `/ManagerView/ScrumDetails`;
//     } else {
//       window.location.href = `/ManagerView/Nonagileview`;
//     }
//   };

//   return (
//     <div className="container mt-5">
//       {/* Title at the top */}
//       <Card className="mb-4">
//         <Card.Body>
//           <h2>Manager Dashboard</h2>
//         </Card.Body>
//       </Card>

//       {/* Projects Table Card */}
//       <Card className="mb-4">
//         <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff', borderRadius: '10px 10px 0 0' }}>
//           Manager View
//         </Card.Header>
//         <Card.Body>
//           <div className="table-responsive">
//             <Table striped bordered hover style={{ borderRadius: '15px', overflow: 'hidden' }}>
//               <thead>
//                 <tr>
//                   <th>S.No</th>
//                   <th>Project Name</th>
//                   <th>rag - Delivery</th>
//                   <th>Test Execution Status</th>
//                   <th>Tester Count</th>
//                   <th>Billable</th>
//                   <th>Nonbillable</th>
//                   <th>Billing Type</th>
//                   <th>Automation?</th>
//                   <th>AI Used</th>
//                   <th>Project Metrics</th>
//                   <th>ai Inside</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {projects.map((project, index) => (
//                   <tr key={project.id}>
//                     <td>{index + 1}</td>
//                     <td>{project.project_name}</td>
//                     <td>{renderRag(project.rag, project.rag_details)}</td>
//                     <td>
//                       <a
//                         href="#"
//                         onClick={(e) => {
//                           e.preventDefault();
//                           handle_view_details(project.project_name_id, project.agile);
//                         }}
//                       >
//                         View Details
//                       </a>
//                     </td>
//                     <td>
//                       <a href={`/ManagerView/tester_count/${project.project_name_id}`} rel="noopener noreferrer">
//                         {project.tester_count}
//                       </a>
//                     </td>
//                     <td>{project.billable.length}</td>
//                     <td>{project.nonbillable.length}</td>
//                     <td>{project.billing_type || 'N/A'}</td>
//                     <td>{renderAutomation(project.automation, project.automation)}</td>
//                     <td>{renderAI(project.ai_used, project.ai_used)}</td>
//                     <td>
//                       <a href={`/ManagerView/project_metrics/${project.project_name_id}`} rel="noopener noreferrer">
//                         View Metrics
//                       </a>
//                     </td>
//                     <td>
//                       <a href={`/ManagerView/ai_insist/${project.project_name_id}`} rel="noopener noreferrer">
//                         AI Inside
//                       </a>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* Testers Table */}
//       <Card className="mb-4">
//         <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff', borderRadius: '10px 10px 0 0' }}>
//           Testers List
//         </Card.Header>
//         <Card.Body>
//           <div className="table-responsive">
//             <Table striped bordered hover>
//               <thead>
//                 <tr>
//                   <th>S.No</th>
//                   <th>Tester Id</th>
//                   <th>Tester Name</th>
//                   <th>Lead ID</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {testers && testers.map((tester, index) => (
//                   <tr key={tester.id}>
//                     <td>{index + 1}</td>
//                     <td>{tester.id}</td>
//                     <td>{tester.tester_name}</td>
//                     <td>{tester.user_id}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* Modal for detailed view */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>{modalContent.title}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>{modalContent.content}</Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <FixedChatBot />
//     </div>
//   );
// };

// export default ManagerView;


// import React, { useState, useEffect } from 'react';
// import { Table, Card, Modal, Button } from 'react-bootstrap';
// import FixedChatBot from './Chatbot';

// const ManagerView = () => {
//   const [projects, setProjects] = useState([]);
//   const [testers, setTesters] = useState([]);  // State to hold all testers
//   const [projectName, setProjectName] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [modalContent, setModalContent] = useState({ title: '', content: '' });
  
//   // Fetch project data
//   useEffect(() => {
//     fetchProjects();
//     fetchAllTesters();  // Fetch all testers when the component loads
//   }, []);
  
//   // Fetch project details for the manager view
//   const fetchProjects = async () => {
//     const token = sessionStorage.getItem('access_token');
//     try {
//       const response = await fetch('https://frt4cnbr-5000.inc1.devtunnels.ms/project-details-manager-view', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         }
//       });

//       const data = await response.json();
//       setProjects(data.project_details);
//       setProjectName(data.project_name);
//       console.log("Fetched Data: ", data);
//     } catch (error) {
//       console.error('Error fetching projects:', error);
//     }
//   };

//   // Fetch all tester details from the provided API
//   const fetchAllTesters = async () => {
//     const token = sessionStorage.getItem('access_token');
//     try {
//       const response = await fetch('http://localhost:5000/tester_full_details', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         }
//       });

//       const data = await response.json();
//       console.log("All Testers Data: ", data);
//       const testerDetails = data.tester_details;
//       const formattedTesters = Object.values(testerDetails).map(tester => ({
//         ...tester,
//         projects: tester.projects
//       }));
//       setTesters(formattedTesters);
//       console.log("Testers Data: ", formattedTesters);
//     } catch (error) {
//       console.error('Error fetching testers:', error);
//     }
//   };

//   // Render the RAG status with the appropriate class
//   const getRagClass = (rag) => {
//     switch (rag) {
//       case 'Red':
//         return 'bg-danger text-white';
//       case 'Green':
//         return 'bg-success text-white';
//       case 'Amber':
//         return 'bg-warning text-dark';
//       default:
//         return '';
//     }
//   };

//   // Handle modal opening with specific tester details
//   const handleModalOpen = (testerName) => {
//     // Access the tester details using the testerName
//     const tester = testers.find(tester => tester.tester_name === testerName);

//     if (!tester) {
//       console.error('Tester details not found');
//       return;
//     }

//     const { tester_name, Tester_id, projects } = tester;
  
//     // Safe check for projects
//     const projectList = projects || [];
  
//     // Modal content
//     const content = (
//       <div>
//         <h5>Tester Details</h5>
//         <p><strong>Tester Name:</strong> {tester_name}</p>
//         <p><strong>Tester ID:</strong> {Tester_id}</p>
  
//         {/* Show project details only if there are projects */}
//         {projectList.length > 0 ? (
//           <Table striped bordered hover>
//             <thead>
//               <tr>
//                 <th>Project Name</th>
//                 <th>Billable/Non-Billable</th>
//               </tr>
//             </thead>
//             <tbody>
//               {projectList.map((project, index) => (
//                 <tr key={index}>
//                   <td>{project.project_name}</td>
//                   <td>{project["Billable/Non billable"]}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         ) : (
//           <p>No project details available.</p> // If no projects are found, show a message
//         )}
//       </div>
//     );
  
//     setModalContent({ title: `Details for ${tester_name}`, content });
//     setShowModal(true);
//   };
  
//   const renderAutomation = (automation, automationDetails) => {
//     return (
//       <span
//         className="badge bg-info text-white"
//         style={{ cursor: 'pointer' }}
//         onClick={() => handleModalOpen('Automation Details', automation ? automationDetails : 'No automation details available')}
//       >
//         {automation ? 'True' : 'False'}
//       </span>
//     );
//   };

//   const renderAI = (aiUsed, aiDetails) => {
//     return (
//       <span
//         className="badge bg-info text-white"
//         style={{ cursor: 'pointer' }}
//         onClick={() => handleModalOpen('AI Details', aiUsed ? aiDetails : 'No AI details available')}
//       >
//         {aiUsed ? 'True' : 'False'}
//       </span>
//     );
//   };

  // const renderRag = (rag, ragDetails) => {
  //   return (
  //     <span
  //       className={`badge ${getRagClass(rag)}`}
  //       style={{ cursor: 'pointer' }}
  //       onClick={() => handleModalOpen('RAG Status Details', ragDetails || 'No details available')}
  //     >
  //       {rag}
  //     </span>
  //   );
  // };

//   const handle_view_details = (project_name_id, agile) => {
//     sessionStorage.setItem('project_name_id', project_name_id);

//     if (agile) {
//       window.location.href = `/ManagerView/ScrumDetails`;
//     } else {
//       window.location.href = `/ManagerView/Nonagileview`;
//     }
//   };

//   return (
//     <div className="container mt-5">
//       {/* Title at the top */}
//       <Card className="mb-4">
//         <Card.Body>
//           <h2>Manager Dashboard</h2>
//         </Card.Body>
//       </Card>

//       {/* Projects Table Card */}
//       <Card className="mb-4">
//         <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff', borderRadius: '10px 10px 0 0' }}>
//           Manager View
//         </Card.Header>
//         <Card.Body>
//           <div className="table-responsive">
//             <Table striped bordered hover style={{ borderRadius: '15px', overflow: 'hidden' }}>
//               <thead>
//                 <tr>
//                   <th>S.No</th>
//                   <th>Project Name</th>
//                   <th>rag - Delivery</th>
//                   <th>Test Execution Status</th>
//                   <th>Tester Count</th>
//                   <th>Billable</th>
//                   <th>Nonbillable</th>
//                   <th>Billing Type</th>
//                   <th>Automation?</th>
//                   <th>AI Used</th>
//                   <th>Project Metrics</th>
//                   <th>ai Inside</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {projects.map((project, index) => (
//                   <tr key={project.id}>
//                     <td>{index + 1}</td>
//                     <td>{project.project_name}</td>
//                     <td>{renderRag(project.rag, project.rag_details)}</td>
//                     <td>
//                       <a
//                         href="#"
//                         onClick={(e) => {
//                           e.preventDefault();
//                           handle_view_details(project.project_name_id, project.agile);
//                         }}
//                       >
//                         View Details
//                       </a>
//                     </td>
//                     <td>
//                       <a href={`/ManagerView/tester_count/${project.project_name_id}`} rel="noopener noreferrer">
//                         {project.tester_count}
//                       </a>
//                     </td>
//                     <td>{project.billable.length}</td>
//                     <td>{project.nonbillable.length}</td>
//                     <td>{project.billing_type || 'N/A'}</td>
//                     <td>{renderAutomation(project.automation, project.automation)}</td>
//                     <td>{renderAI(project.ai_used, project.ai_used)}</td>
//                     <td>
//                       <a href={`/ManagerView/project_metrics/${project.project_name_id}`} rel="noopener noreferrer">
//                         View Metrics
//                       </a>
//                     </td>
//                     <td>
//                       <a href={`/ManagerView/ai_insist/${project.project_name_id}`} rel="noopener noreferrer">
//                         AI Inside
//                       </a>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* Modal for detailed view */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>{modalContent.title}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>{modalContent.content}</Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <FixedChatBot />
//     </div>
//   );
// };

// export default ManagerView;




//     {/* <Card className="mb-4">
//         <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff', borderRadius: '10px 10px 0 0' }}>
//           Testers List
//         </Card.Header>
//         <Card.Body>
//           <div className="table-responsive">
//             <Table striped bordered hover>
//               <thead>
//                 <tr>
//                   <th>S.No</th>
//                   <th>Tester Name</th>
//                   <th>Tester Id</th>
//                   <th>Project Name</th>
//                   <th>Billable/Non-Billable</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {testers.map((tester, index) => (
//                   <tr key={tester.Tester_id}>
//                     <td>{index + 1}</td>
//                     <td>
//                       <a
//                         href="#"
//                         onClick={() => handleModalOpen(tester.tester_name)}
//                       >
//                         {tester.tester_name}
//                       </a>
//                     </td>
//                     <td>{tester.Tester_id}</td>
//                     <td>{tester.projects[0]?.project_name || 'N/A'}</td> 
//                     <td>{tester.projects[0]?.["Billable/Non billable"] || 'N/A'}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//         </Card.Body>
//       </Card> */}