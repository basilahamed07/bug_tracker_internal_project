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
  const [user_role, setUserRole] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    fetchUserProjects(); // Fetch projects for the logged-in user
    // You can add any necessary effect here, such as resetting the selected project
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
    
      // Fetch projects for the logged-in user 
      const fetchUserProjects = async () => {
        const token = sessionStorage.getItem('access_token');
        try {
          const response = await axios.get('https://frt4cnbr-5000.inc1.devtunnels.ms/get-user-projects', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          setProjects(response.data.projects);
          // console.log("SDFGHJKHGFDS : " , response.data.user_role)
          setUserRole(response.data.user_role)
          // console.log("projects details : ", response)  // Store the user's projects
        } catch (error) {
          console.error('Error fetching user projects:', error);
        }
      };



  const handleProjectStatusUpdate = (projectId) => {
    if (!projectId) {
      alert('Please select a project to update.');
      return;
    }

    // // Set showCreateDetails to true
    // setShowCreateDetails(true);

    // Store selected project in sessionStorage
    // Assuming projectName is available, use it to store in sessionStorage
    sessionStorage.setItem('projectName', projectId); // Replace projectId with the actual project name if needed

    // Optionally, log to check sessionStorage
    console.log('Selected project stored in sessionStorage:', projectId);

    // Navigate to the next component
    navigate('/AdminPanel/MatrixInput');
    // window.location.reload();
  };

  return (
    <div style={{ width: '45%' }}>
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
                        <option key={project.id} value={project.project_name_id}>
                          {project.project_name}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">{errors.project_name_id}</Form.Control.Feedback>
                  </Form.Group>

                  <br />

                  <Button
                    variant="primary"
                    onClick={() => handleProjectStatusUpdate(selectedProject)} // Pass the selected project name
                    style={{
                      fontWeight: 'bold',
                      color: '#ffffff',
                      backgroundColor: '#000d6b',
                      borderColor: '#000d6b',
                    }}
                  >
                    Proceed to update the Status
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
