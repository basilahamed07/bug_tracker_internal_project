import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal } from 'react-bootstrap';
import AddProject from './AddProject'; // Import the ProjectForm component

// SVG Imports
import addproject from "../panel/assets/addprojectwhite.svg";

const ProjectTable = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Fetch project data from the API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://h25ggll0-5000.inc1.devtunnels.ms/project-details', {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
          }
        });
        const data = await response.json();
        setProjects(data.project_details);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  // Handle adding or editing the project
  const handleProjectSubmit = (updatedProject) => {
    if (isEditMode) {
      // Update the project (you may want to send this to the API)
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project.id === selectedProject.id ? { ...project, ...updatedProject } : project
        )
      );
    } else {
      // Add the new project (you may want to send this to the API)
      setProjects([...projects, updatedProject]);
    }

    // Close the modal after saving
    setShowModal(false);
    setSelectedProject(null);
    setIsEditMode(false);
  };

  // Open the modal to add a new project
  const handleAddProject = () => {
    setShowForm(true);
    setSelectedProject(null); // No project selected for adding
    setIsEditMode(false); // Set to Add mode
    setShowModal(true);
  };

  // Open the modal to edit an existing project
  const handleEditProject = (project) => {
    setSelectedProject(project); // Set the selected project to edit
    setIsEditMode(true); // Set to Edit mode
    setShowModal(true);
  };

  // Close the modal
  const handleCancel = () => {
    setShowModal(false);
    setSelectedProject(null);
    setIsEditMode(false);
  };

  return (
    <>
      {/* Add New Project Button */}
      <Button
  variant="primary"
  onClick={handleAddProject}
  style={{
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#000d6b',
    borderColor: '#000d6b',
    marginBottom: '20px',
    display: 'flex',         // Aligns the icon and text horizontally
    alignItems: 'center',    // Centers the icon and text vertically
  }}
>
  <img
    src={addproject}
    alt="Add a new project"  // More descriptive alt text for accessibility
    style={{ width: '20px', height: '20px', marginRight: '8px' }}  // Adds space between the icon and text
  />
  Add New or Update
</Button>


      {/* Project Table */}
      <Card className="mt-3">
        <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff', borderRadius: '10px 10px 0 0' }}>
          Project Details
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover style={{ borderRadius: '15px', overflow: 'hidden' }}>
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>rag - Delivery</th>
                  <th>Tester Count</th>
                  <th>Billable</th>
                  <th>Nonbillable</th>
                  <th>Billing Type</th>
                  <th>Automation</th>
                  <th>AI</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.project_name}</td>
                    <td>{project.rag}</td>
                    <td>{project.tester_count}</td>
                    <td>{project.billable.length}</td> {/* Show length of billable array */}
                    <td>{project.nonbillable.length}</td> {/* Show length of nonbillable array */}
                    <td>{project.billing_type}</td>
                    <td>{project.automation.length ? project.automation : "No Details" }</td> {/* Display true or false */}
                    <td>{project.ai_used.length ? project.ai_used : "No Details" }</td> {/* Display true or false */}
                    {/* <td>
                      <Button variant="warning" onClick={() => handleEditProject(project)}>
                        Edit
                      </Button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Project Form Modal (Add/Edit) */}
      <Modal show={showModal} onHide={handleCancel} size="lg">
        <Modal.Header closeButton>
          {/* <Modal.Title>{isEditMode ? 'Edit Project' : 'Add New Project'}</Modal.Title> */}
          <Modal.Title> <b>Add New Project or Update the Existing Project Details</b></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddProject
            project={selectedProject}
            onSubmit={handleProjectSubmit}
            onCancel={handleCancel}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProjectTable;
