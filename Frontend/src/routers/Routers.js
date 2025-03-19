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
          <Route path="add-project" element={<AddProject />} />
          <Route path="create-project-details" element={<CreateProjectDetails />} />
          <Route path="project-info" element={<ProjectInfo />} />
          <Route path="ManageBuzz" element={<ManageBuzz />} />
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

