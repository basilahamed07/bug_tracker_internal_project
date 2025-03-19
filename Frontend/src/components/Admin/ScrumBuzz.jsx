import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ScrumBuzz = () => {
  const [selectedProject, setSelectedProject] = useState('');
  const [projects, setProjects] = useState([]);
  const [scrums, setScrums] = useState([]); // Scrum details for selected project
  const [selectedScrum, setSelectedScrum] = useState(''); // Scrum selected by user
  const [showScrumModal, setShowScrumModal] = useState(false); // Modal to show scrum selection
  const [showPIModal, setShowPIModal] = useState(false);
  const [newPIName, setNewPIName] = useState('');
  const [existingPIs, setExistingPIs] = useState([]);
  const [showCreatePIForm, setShowCreatePIForm] = useState(false);
  const [selectedPI, setSelectedPI] = useState(''); // Add this line for PI selection state

  const navigate = useNavigate();

  // Fetch user projects on mount
  useEffect(() => {
    fetchUserProjects();
  }, []);

  // Fetch user projects from the API
  const fetchUserProjects = async () => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get('https://frt4cnbr-5000.inc1.devtunnels.ms/get-user-projects', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Error fetching user projects:', error);
    }
  };

  // Fetch scrum details for the selected project
  const fetchScrums = async (projectId) => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get(`https://frt4cnbr-5000.inc1.devtunnels.ms/agile_details/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setScrums(response.data); // Set the scrum details for the selected project
    } catch (error) {
      console.error('Error fetching scrum details:', error);
    }
  };

  // Add new function to fetch PIs
  const fetchExistingPIs = async (scrumId) => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get(`https://frt4cnbr-5000.inc1.devtunnels.ms/get_pl_name/${scrumId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setExistingPIs(response.data);
    } catch (error) {
      console.error('Error fetching PIs:', error);
    }
  };

  // Handle when the user selects a project
  const handleProjectStatusUpdate = () => {
    if (!selectedProject) {
      alert('Please select a project to update.');
      return;
    }
    
    // Fetch scrum details for the selected project
    fetchScrums(selectedProject);
    setShowScrumModal(true); // Show the scrum selection modal
  };

  // Modified handleScrumSelection to directly show PI input modal
  const handleScrumSelection = () => {
    if (selectedScrum === '') {
      alert('Please select a scrum or add a new scrum.');
      return;
    }

    if (selectedScrum === 'add_new_scrum') {
      sessionStorage.setItem('projectId', selectedProject);
      const selectedProjectData = projects.find((project) => project.id === parseInt(selectedProject));
      if (selectedProjectData) {
        sessionStorage.setItem('projectName', selectedProjectData.project_name);
      }
      navigate('/AdminPanel/ScrumTeamManagement');
    } else {
      sessionStorage.setItem('projectId', selectedProject);
      sessionStorage.setItem('scrumId', selectedScrum);
      const selectedScrumData = scrums.find((scrum) => scrum.id === parseInt(selectedScrum));
      if (selectedScrumData) {
        sessionStorage.setItem('scrumDetails', JSON.stringify(selectedScrumData));
      }
      fetchExistingPIs(selectedScrum); // Fetch PIs before showing the modal
      setShowScrumModal(false);
      setShowPIModal(true);
    }
  };

  // Simplified handlePISubmit function
  const handlePISubmit = () => {
    if (!newPIName.trim() && !selectedPI) {
      alert('Please either select an existing PI or enter a new PI name');
      return;
    }

    // Store the selected or new PI name in session storage
    const piNameToStore = selectedPI || newPIName.trim();
    sessionStorage.setItem('piName', piNameToStore);
    setShowPIModal(false);
    navigate('/AdminPanel/CreateSprint');
  };

  return (
    <div style={{ width: '45%' }}>
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
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.project_name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Button
                variant="primary"
                onClick={handleProjectStatusUpdate}
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

      {/* Scrum Selection Modal */}
      <Modal show={showScrumModal} onHide={() => setShowScrumModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Scrum</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select Scrum</Form.Label>
              <Form.Control
                as="select"
                value={selectedScrum}
                onChange={(e) => setSelectedScrum(e.target.value)}
              >
                <option value="">Select Scrum</option>
                {scrums.map((scrum) => (
                  <option key={scrum.id} value={scrum.id}>
                    {scrum.scream_name}
                  </option>
                ))}
                {/* Always show Add New Scrum option */}
                <option value="add_new_scrum" style={{ fontWeight: 'bold', color: '#000d6b' }}>
                  Add New Scrum
                </option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowScrumModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={handleScrumSelection}
            style={{
              backgroundColor: '#000d6b',
              borderColor: '#000d6b'
            }}
          >
            {selectedScrum === 'add_new_scrum' ? 'Add New Scrum' : 'Proceed to Create Sprint'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modified PI Modal */}
      <Modal show={showPIModal} onHide={() => setShowPIModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Program Increment (PI) Selection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {existingPIs.length > 0 && (
              <Form.Group className="mb-3">
                <Form.Label>Select Existing PI</Form.Label>
                <Form.Select
                  value={selectedPI}
                  onChange={(e) => {
                    setSelectedPI(e.target.value);
                    setShowCreatePIForm(false);
                  }}
                >
                  <option value="">Select PI</option>
                  {existingPIs.map((pi, index) => (
                    <option key={index} value={pi}>
                      {pi}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            <div className="text-center my-3">
              <span
                onClick={() => {
                  setShowCreatePIForm(true);
                  setSelectedPI('');
                }}
                style={{
                  color: '#000d6b',
                  cursor: 'pointer',
                  padding: '6px 12px',
                  display: 'inline-block'
                }}
              >
                Create New PI
              </span>
            </div>

            {showCreatePIForm && (
              <Form.Group className="mb-3">
                <Form.Label>New PI Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter new PI name"
                  value={newPIName}
                  onChange={(e) => setNewPIName(e.target.value)}
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPIModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={handlePISubmit}
            style={{
              backgroundColor: '#000d6b',
              borderColor: '#000d6b'
            }}
          >
            Proceed
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ScrumBuzz;
