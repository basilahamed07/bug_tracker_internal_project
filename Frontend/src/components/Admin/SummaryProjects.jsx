import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory

const ManageBuzz = () => {
  const [selectedProject, setSelectedProject] = useState('');
  const [projects, setProjects] = useState([]); // Store projects here
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [defects, setDefects] = useState([]);
  //inside modal
  const [projectName, setProjectName] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    fetchUserProjects(); // Fetch projects for the logged-in user
  }, [projects]);

  // Fetch defects for the selected project
  const fetchDefects = async (project_name_id) => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get(`https://frt4cnbr-5000.inc1.devtunnels.ms/new_defects/${project_name_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setDefects(response.data);
    } catch (error) {
      console.error('Error fetching defects:', error);
    }
  };

  const fetchUserProjects = async () => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await fetch('https://frt4cnbr-5000.inc1.devtunnels.ms/project-details-manager-view', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      setProjects(data.project_details);
      setProjectName(data.project_name);
      console.log(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleProjectStatusUpdate = (projectId) => {
    if (!projectId) {
      alert('Please select a project');
      return;
    }

    // Store the selected project's ID in sessionStorage with key 'Summary_id'
    sessionStorage.setItem('Summary_id', projectId); 

    // Log to check sessionStorage
    console.log('Selected project ID stored in sessionStorage with key Summary_id:', projectId);

    // // Navigate to /AdminPanel/Summary
    // navigate('/AdminPanel/Summary');
    
    
    // Reload the page to trigger a refresh of the component
        window.location.reload(); // This will reload the current page
  };

  return (
    <div style={{ width: '100%' }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {projects.length === 0 ? (
            <p>No projects available.</p>
          ) : (
            <Card>
              <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff' }}>
                All Projects
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Project Name</Form.Label>
                    <Form.Control
                      as="select"
                      name="project_name_id"
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      isInvalid={!!errors.project_name_id}
                    >
                      <option value="">Select Project</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>  {/* Use project.id instead of project.project_name_id */}
                          {project.project_name}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">{errors.project_name_id}</Form.Control.Feedback>
                  </Form.Group>

                  <br />

                  <Button
                    variant="primary"
                    onClick={() => handleProjectStatusUpdate(selectedProject)}  // Pass the selected project id
                    style={{
                      fontWeight: 'bold',
                      color: '#ffffff',
                      backgroundColor: '#000d6b',
                      borderColor: '#000d6b',
                    }}
                  >
                    Proceed to Overview
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageBuzz;
