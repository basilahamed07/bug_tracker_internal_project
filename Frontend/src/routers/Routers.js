// // Router.js
// import React from "react";
// import { Routes, Route } from "react-router-dom";

// import NotFound from "../pages/NotFound";

// import SlidingAuth from "../pages/SignIn";
// import AdminPanel from "../pages/AdminPanel";
// import ProjectInfo from "../components/Admin/ProjectInfo";
// import AddProject from "../components/Admin/AddProject";
// import CreateProjectDetails from "../components/Admin/CreateProjectDetails";
// import ProjectTrends from "../components/Admin/ProjectTrends";
// import ManageDefects from "../components/Admin/ManageDefects";
// import ManageBuildStatus from "../components/Admin/ManageBuildStatus";
// import ManageDefectAcceptedRejected from "../components/Admin/ManageDefectAcceptedRejected";
// import ManageTestCaseCreationStatus from "../components/Admin/ManageTestCaseCreation";
// import ManageTestExecutionStatus from "../components/Admin/ManageTestExecutionStatus";
// import ManageTotalDefectStatus from "../components/Admin/ManageTotalDefectStatus";
// import ManagerView from "../components/manager_view/manager_view";
// import ProjectDetails from "../components/manager_view/full_testcase_details";
// import TestersDetails from "../components/manager_view/TestersDetails";
// import AdminProjectTable from "../components/Admin/adminprojecttable";
// import AdminAddProjectWithDetails from "../components/Admin/adminprojectadd";
// import UserManagement from "../components/Admin/usermanagement";
// import RegisterPage from "../components/Admin/RegisterPage";
// import ProtectedRoute from "./ProtectedRoute"; // Import the ProtectedRoute component
// import ViewMatrix from "../components/manager_view/ViewMatrix";
// import GenerateReport from "../components/manager_view/final_report";
// import MetricsForm from "../components/Admin/matrixinput.jsx";

// // src\components\Admin\matrixinput.jsx

// const Routers = () => {
//   return (
//     <Routes>
//       {/* <Route path="/" element={<Navigate to="/signin" />} /> */}
//       <Route path="/" element={<SlidingAuth />} />
//       <Route path="RegisterPage" element={<RegisterPage />} />

//       <Route element={<ProtectedRoute />}> {/* Wrap with ProtectedRoute */}

//         <Route path="/ManagerView" element={<AdminPanel />}>
//           <Route path="manager_view" element={<ManagerView />} />
//           <Route path="full_test_details/:projectNameId" element={<ProjectDetails />} /> {/* Dynamic Route */}
//           <Route path="tester_count/:projectNameId" element={<TestersDetails />} />
//           <Route path="project_metrics/:id" element={<ViewMatrix />} /></Route>

//         <Route path="/TestLead" element={<AdminPanel />}>

//           {/* THIS CAN ACCESS FOR TESTLEAD AND ADMIN */}
//           {/* accessable for test_lead */}


//           <Route path="add-project" element={<AddProject />} />
//           <Route path="create-project-details" element={<CreateProjectDetails />} />
//           <Route path="project-info" element={<ProjectInfo />} />
//           <Route path="project-trends" element={<ProjectTrends />} />
//           <Route path="ManageDefects" element={<ManageDefects />} />
//           <Route path="ManageTestExecutionStatus" element={<ManageTestExecutionStatus />} />
//           <Route path="ManageTotalDefectStatus" element={<ManageTotalDefectStatus />} />
//           <Route path="ManageBuildStatus" element={<ManageBuildStatus />} />
//           <Route path="ManageDefectAcceptedRejected" element={<ManageDefectAcceptedRejected />} />
//           <Route path="view_matrix_input" element={<MetricsForm />} />
//           <Route path="ManageTestCaseCreationStatus" element={<ManageTestCaseCreationStatus />} /></Route>

//         {/* Admin Panel Nested Routes */}
//         <Route path="/AdminPanel" element={<AdminPanel />}>
//           {/* THIS CAN ACCESS FOR TESTLEAD AND ADMIN */}
//           {/* accessable for test_lead */}
//           <Route path="add-project" element={<AddProject />} />
//           <Route path="create-project-details" element={<CreateProjectDetails />} />
//           {/* <Route path="project-report" element={<ProjectReport />} /> */}
//           <Route path="project-info" element={<ProjectInfo />} />
//           <Route path="project-trends" element={<ProjectTrends />} />
//           <Route path="ManageDefects" element={<ManageDefects />} />
//           <Route path="ManageTestExecutionStatus" element={<ManageTestExecutionStatus />} />
//           <Route path="ManageTotalDefectStatus" element={<ManageTotalDefectStatus />} />
//           <Route path="ManageBuildStatus" element={<ManageBuildStatus />} />
//           <Route path="ManageDefectAcceptedRejected" element={<ManageDefectAcceptedRejected />} />
//           <Route path="ManageTestCaseCreationStatus" element={<ManageTestCaseCreationStatus />} />
//           <Route path="view_report" element={<GenerateReport />} />


//           {/* THIS CAN ACCESS FOR TESTLEAD AND ADMIN */}
//           {/* 
//             #ONLY FOR MANAGER
//             <Route path="manager_view" element={<ManagerView />} />
//             <Route path="full_test_details/:projectNameId" element={<ProjectDetails />} />
//             <Route path="tester_count/:projectNameId" element={<TestersDetails />} /> */}

//           {/* for admin */}
//           {/* FOR ADMIN ONLY */}
//           <Route path="viewproject" element={<AdminProjectTable />} />
//           <Route path="adminaddproject" element={<AdminAddProjectWithDetails />} />
//           <Route path="add-user" element={<UserManagement />} />
//           {/* <Route path="viewproject" element={<AdminProjectTable />} /> */}
//         </Route>
//       </Route>

//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// };

// export default Routers;


// BASIL CODE 

// // Router.js
// import React from "react";
// import { Routes, Route } from "react-router-dom";

// import NotFound from "../pages/NotFound";

// import SlidingAuth from "../pages/SignIn";
// import AdminPanel from "../pages/AdminPanel";
// import ProjectInfo from "../components/Admin/ProjectInfo";
// import AddProject from "../components/Admin/AddProject";
// import CreateProjectDetails from "../components/Admin/CreateProjectDetails";
// import ProjectTrends from "../components/Admin/ProjectTrends";
// import ManageDefects from "../components/Admin/ManageDefects";
// import ManageBuildStatus from "../components/Admin/ManageBuildStatus";
// import ManageDefectAcceptedRejected from "../components/Admin/ManageDefectAcceptedRejected";
// import ManageTestCaseCreationStatus from "../components/Admin/ManageTestCaseCreation";
// import ManageTestExecutionStatus from "../components/Admin/ManageTestExecutionStatus";
// import ManageTotalDefectStatus from "../components/Admin/ManageTotalDefectStatus";
// import ManagerView from "../components/manager_view/manager_view";
// import ProjectDetails from "../components/manager_view/full_testcase_details";
// import TestersDetails from "../components/manager_view/TestersDetails";
// import AdminProjectTable from "../components/Admin/adminprojecttable";
// import AdminAddProjectWithDetails from "../components/Admin/adminprojectadd";
// import UserManagement from "../components/Admin/usermanagement";
// import RegisterPage from "../components/Admin/RegisterPage";
// import ProtectedRoute from "./ProtectedRoute"; // Import the ProtectedRoute component
// import ViewMatrix from "../components/manager_view/ViewMatrix";
// import MatrixInput from "../components/Admin/MatrixInput";
// import MatrixView from "../pages/metrix_view";


// const Routers = () => {
//   return (
//     <Routes>
//       {/* <Route path="/" element={<Navigate to="/signin" />} /> */}
//       <Route path="/" element={<SlidingAuth />} />
//       <Route path="RegisterPage" element={<RegisterPage />} />

//       <Route element={<ProtectedRoute />}> {/* Wrap with ProtectedRoute */}

//         <Route path="/ManagerView" element={<AdminPanel />}>
//           <Route path="manager_view" element={<ManagerView />} />
//           <Route path="full_test_details/:projectNameId" element={<ProjectDetails />} /> {/* Dynamic Route */}
//           <Route path="tester_count/:projectNameId" element={<TestersDetails />} />
//           <Route path="project_metrics/:id" element={<ViewMatrix />} /></Route>

//         <Route path="/TestLead" element={<AdminPanel />}>

//           {/* THIS CAN ACCESS FOR TESTLEAD AND ADMIN */}
//           {/* accessable for test_lead */}


//           <Route path="add-project" element={<AddProject />} />
//           <Route path="create-project-details" element={<CreateProjectDetails />} />
//           <Route path="project-info" element={<ProjectInfo />} />
//           <Route path="project-trends" element={<ProjectTrends />} />
//           <Route path="ManageDefects" element={<ManageDefects />} />
//           <Route path="ManageTestExecutionStatus" element={<ManageTestExecutionStatus />} />
//           <Route path="ManageTotalDefectStatus" element={<ManageTotalDefectStatus />} />
//           <Route path="ManageBuildStatus" element={<ManageBuildStatus />} />
//           <Route path="ManageDefectAcceptedRejected" element={<ManageDefectAcceptedRejected />} />
//           <Route path="MatrixInput" element={<MatrixInput />} />
//           <Route path="ManageTestCaseCreationStatus" element={<ManageTestCaseCreationStatus />} /></Route>

//         {/* Admin Panel Nested Routes */}
//         <Route path="/AdminPanel" element={<AdminPanel />}>
//           {/* THIS CAN ACCESS FOR TESTLEAD AND ADMIN */}
//           {/* accessable for test_lead */}
//           <Route path="add-project" element={<AddProject />} />
//           <Route path="create-project-details" element={<CreateProjectDetails />} />
//           {/* <Route path="project-report" element={<ProjectReport />} /> */}
//           <Route path="project-info" element={<ProjectInfo />} />
//           <Route path="project-trends" element={<ProjectTrends />} />
//           <Route path="ManageDefects" element={<ManageDefects />} />
//           <Route path="ManageTestExecutionStatus" element={<ManageTestExecutionStatus />} />
//           <Route path="ManageTotalDefectStatus" element={<ManageTotalDefectStatus />} />
//           <Route path="ManageBuildStatus" element={<ManageBuildStatus />} />
//           <Route path="ManageDefectAcceptedRejected" element={<ManageDefectAcceptedRejected />} />
//           <Route path="MatrixInput" element={<MatrixInput />} />
//           <Route path="ManageTestCaseCreationStatus" element={<ManageTestCaseCreationStatus />} />


//           {/* THIS CAN ACCESS FOR TESTLEAD AND ADMIN */}
//           {/* 
//             #ONLY FOR MANAGER
//             <Route path="manager_view" element={<ManagerView />} />
//             <Route path="full_test_details/:projectNameId" element={<ProjectDetails />} />
//             <Route path="tester_count/:projectNameId" element={<TestersDetails />} /> */}

//           {/* for admin */}
//           {/* FOR ADMIN ONLY */}
//           <Route path="viewproject" element={<AdminProjectTable />} />
//           <Route path="adminaddproject" element={<AdminAddProjectWithDetails />} />
//           <Route path="add-user" element={<UserManagement />} />
//           <Route path="matrix-view" element={<MatrixView />} />
//           {/* <Route path="viewproject" element={<AdminProjectTable />} /> */}
//         </Route>
//       </Route>

//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// };

// export default Routers;




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
          <Route path="ai_insist/:id" element={<Dashboard />} />
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
          {/* 
            #ONLY FOR MANAGER
            <Route path="manager_view" element={<ManagerView />} />
            <Route path="full_test_details/:projectNameId" element={<ProjectDetails />} />
            <Route path="tester_count/:projectNameId" element={<TestersDetails />} /> */}

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
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom'; 
// import './staticpage.css'; // Ensure you include this for consistent styling

// const ScrumDetails = () => {
//     const [scrumDetails, setScrumDetails] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [projectName, setProjectName] = useState('');
//     const navigate = useNavigate();
//     const [error, setError] = useState(null);
//     const project_name_id = sessionStorage.getItem('project_name_id');

//     // Pagination state
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 3; // Number of items per page

//     useEffect(() => {
//         const fetchScrumDetails = async () => {
//             try {
//                 const token = sessionStorage.getItem('access_token');
//                 const response = await axios.get(`https://frt4cnbr-5000.inc1.devtunnels.ms/agile_details/${project_name_id}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     }
//                 });
//                 if (response.status !== 200) {
//                     throw new Error('Failed to fetch data');
//                 }

//                 setScrumDetails(response.data);
//                 setProjectName(response.data[0].project_name);
//                 setIsLoading(false);
//             } catch (error) {
//                 setError(error.message);
//                 setIsLoading(false);
//             }
//         };

//         fetchScrumDetails();
//     }, [project_name_id]);

//     // Logic for pagination
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentScrums = scrumDetails.slice(indexOfFirstItem, indexOfLastItem);

//     const paginate = (pageNumber) => setCurrentPage(pageNumber);

//     if (isLoading) {
//         return <div className="text-center">Loading...</div>;
//     }

//     if (error) {
//         return <div className="text-center text-danger">Error: {error}</div>;
//     }

//     return (
//         <div className="container mt-4">
//             <h2 className="text-center" style={{ color: "#000d6b" }}>
//                 Scrum Details - {projectName} {/* Display the project name here */}
//             </h2>

//             <div className="team-cards-container d-flex justify-content-center mb-4">
//                 {currentScrums.map((scrum, index) => (
//                     <div
//                         key={index}
//                         className="card scrum-card shadow-lg p-3 mb-4"
//                         style={{ width: '18rem', cursor: 'pointer', transition: 'transform 0.3s ease' }}
//                         onClick={() => {
//                             console.log("Scream ID to store:", scrum.id);  // Debugging line
//                             sessionStorage.setItem('screamId', scrum.id);
//                             navigate(`/ManagerView/SprintDetailsTable?team=${scrum.scream_name}`);
//                         }}
//                     >
//                         <div className="card-header text-white" style={{ backgroundColor: '#000d6b' }}>
//                             <h5>{scrum.scream_name}</h5>
//                         </div>

//                         <div className="card-body" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', paddingLeft: '1.5rem' }}>
//                             <h6>{scrum.tester_name}</h6>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             <div className="card">
//                 <div className="card-header" style={{ backgroundColor: '#000d6b', color: 'white' }}>
//                     <h5>Scrum Members</h5>
//                 </div>
//                 <div className="card-body">
//                     <table className="table table-bordered">
//                         <thead className="table-light">
//                             <tr>
//                                 <th>RESOURCE NAME</th>
//                                 <th>JOIN DATE</th>
//                                 <th>PRIOR EXP</th>
//                                 <th>CPT EXP</th>
//                                 <th>TOTAL EXP</th>
//                                 <th>SKILLS</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {currentScrums.map((scrum, index) => (
//                                 <tr key={index}>
//                                     <td>{scrum.tester_name}</td>
//                                     <td>{new Date(scrum.join_date).toLocaleDateString()}</td>
//                                     <td>{scrum.total_experience}</td>
//                                     <td>{scrum.total_experience}</td> {/* Replace with actual CPT Experience if different */}
//                                     <td>{scrum.total_experience}</td> {/* Replace with actual Total Experience if different */}
//                                     <td>
//                                         {scrum.skillset.map((skill, i) => (
//                                             <span key={i} className="badge bg-info text-dark me-1">{skill}</span>
//                                         ))}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* Pagination Controls */}
//             <div className="pagination-container d-flex justify-content-center mt-3">
//                 <button
//                     className="btn btn-primary mx-2"
//                     style={{backgroundColor: '#000d6b' , color: 'white'}}
//                     onClick={() => paginate(currentPage - 1)}
//                     disabled={currentPage === 1}
//                 >
//                     Previous
//                 </button>
//                 <span className="mt-2">Page {currentPage}</span>
//                 <button
//                     className="btn btn-primary mx-2"
//                     onClick={() => paginate(currentPage + 1)}
//                     style={{backgroundColor: '#000d6b' , color: 'white'}}
//                     disabled={currentPage * itemsPerPage >= scrumDetails.length}
//                 >
//                     Next
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default ScrumDetails;
