import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getUserRoleFromToken } from '../../utils/tokenUtils';
import BackButton from '../common/BackButton';

const ManageBuzz = () => {
  const [selectedProject, setSelectedProject] = useState('');
  const [projects, setProjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [defects, setDefects] = useState([]);
  const [user_role, setUserRole] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchUserProjects();
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded.sub === '1' || decoded.type === 'access' ? 'admin' : 'testlead';
        console.log('Initial role:', role);
        setUserRole(role);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

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

    sessionStorage.setItem('selectedProject', projectId);
    const currentRole = getUserRoleFromToken();
    console.log('Current role for navigation:', currentRole);

    if (currentRole === 'admin') {
      navigate('/AdminPanel/ManageDefects');
    } else {
      navigate('/TestLead/ManageDefects');
    }
  };

  return (
    <div style={{ width: '45%' }}>
      <BackButton />

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

                  <div className="d-flex justify-content-between">
                    <Button
                      variant="primary"
                      onClick={() => handleProjectStatusUpdate(selectedProject)}
                      style={{
                        fontWeight: 'bold',
                        color: '#ffffff',
                        backgroundColor: '#000d6b',
                        borderColor: '#000d6b',
                      }}
                    >
                      Proceed to update the Status
                    </Button>
                  </div>
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