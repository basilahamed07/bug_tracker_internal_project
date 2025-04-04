import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory

const Testingtype = () => {
  const [selectedProject, setSelectedProject] = useState('');
  const [projects, setProjects] = useState([]); // Store projects here
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [defects, setDefects] = useState([]);
  const [username, setUserRole] = useState(null);  // To store user role (username)

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    // Fetch username from sessionStorage and set it
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      setUserRole(storedUsername);  // Store the username in the state
    }
    fetchUserProjects(); // Fetch projects for the logged-in user
  }, []);  // Empty dependency array ensures this runs only once on mount

  // Fetch defects for the selected project
  const fetchDefects = async (project_name_id) => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get(`https://h25ggll0-5000.inc1.devtunnels.ms/new_defects/${project_name_id}`, {
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
      const response = await axios.get('https://h25ggll0-5000.inc1.devtunnels.ms/get-user-projects', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Error fetching user projects:', error);
    }
  };

  const handleProjectStatusUpdate = (projectId) => {
    if (!projectId) {
      alert('Please select a project to update.');
      return;
    }

    // Store selected project ID in sessionStorage
    sessionStorage.setItem('projectId', projectId); // Store project ID instead of project name

    // Optionally, log to check sessionStorage
    console.log('Selected project ID stored in sessionStorage:', projectId);

    // Check if the user is admin or test lead, then navigate accordingly
    if (username === 'admin') {
      navigate('/AdminPanel/NonAgileEdit');  // Navigate to Admin Panel
    } else {
      navigate('/Testlead/NonAgileForm');  // Navigate to Test Lead Panel
    } 
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
                      onChange={(e) => setSelectedProject(e.target.value)} // Store project ID as value
                      isInvalid={!!errors.project_name_id}
                    >
                      <option value="">Select Project</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}> {/* Store project ID */}
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

export default Testingtype;
