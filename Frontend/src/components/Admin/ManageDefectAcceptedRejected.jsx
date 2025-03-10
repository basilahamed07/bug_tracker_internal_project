// MY CODE 

import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Button, Table, Form, Card, Row, Col, Modal } from 'react-bootstrap';
import axios from 'axios';

import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import { getUserRoleFromToken } from '../../utils/tokenUtils'; // Import getUserRoleFromToken
 

const ManageDefectAcceptedRejected = () => {
  const [defectStatuses, setDefectStatuses] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    total_defects: '',
    dev_team_accepted: '',
    dev_team_rejected: '',
    project_name_id: ''
  });
  const [projects, setProjects] = useState([]);
  const [defects, setDefects] = useState([]);  // Store defects for a project
  const [errors, setErrors] = useState({});
  const [editingStatus, setEditingStatus] = useState(null);
  const [user_role, setUserRole] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [showFormModal, setShowFormModal] = useState(false); // State for form modal
  const [showDefectsModal, setShowDefectsModal] = useState(false); // State for defects modal


  const navigate = useNavigate(); // Initialize useNavigate for navigation



  const [projectName, setProjectName] = useState(''); // Store project name from sessionStorage    


  useEffect(() => {
    const projectId = sessionStorage.getItem('project_name_id');
    if (projectId) {
      fetchDefectStatuses(projectId);
    }
    fetchUserProjects();

    // Check if there's data in localStorage for manageDefect
    const storedData = localStorage.getItem('ManageDefectAcceptedRejected');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setFormData(parsedData);
    }

    // Retrieve the selected project name from sessionStorage
    const projectNameFromSession = sessionStorage.getItem('selectedProject');

    const projectIdFromSession = sessionStorage.getItem('project_id');
    
     if (projectNameFromSession) {
      setProjectName(projectNameFromSession); // Set the project name from session
      setFormData(prevState => ({
        ...prevState,
        project_name_id: projectNameFromSession, // Set project_name_id based on sessionStorage data
      }));
    }

    const selectedDate = sessionStorage.getItem('date');
    if(selectedDate){
      setFormData(prevState => ({
        ...prevState,
        date: selectedDate,
      }));
    }
  }, []);

  const fetchDefectStatuses = async (projectId) => {
    if (!projectId) {
      console.error('Project ID is undefined');
      return;
    }
    
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get(`https://frt4cnbr-5000.inc1.devtunnels.ms/defect_accepted_rejected/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setDefectStatuses(response.data);
    } catch (error) {
      console.error('Error fetching defect accepted/rejected statuses:', error);
    }
  };

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


      setUserRole(response.data.user_role);


      console.log("dfghjkl", response) // Store the user's projects
    } catch (error) {
      console.error('Error fetching user projects:', error);
    }
  };

  const fetchDefectsForProject = async (projectId) => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get(`https://frt4cnbr-5000.inc1.devtunnels.ms/defect_accepted_rejected/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setDefects(response.data);
      console.log("WERTYUIO", response) // Store the defects for the selected project
      setShowDefectsModal(true); // Show the defects modal
    } catch (error) {
      console.error('Error fetching defects for project:', error);
    }
  };

  const validateForm = () => {
    const requiredFields = [
      // 'date',
      // 'total_defects',
      'dev_team_accepted',
      'dev_team_rejected',
      // 'project_name_id'
    ];
    const newErrors = {};

    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    if (formData.date > today) {
      newErrors.date = 'Date cannot be in the future.';
    }

    requiredFields.forEach(field => {
      if (!formData[field] && field !== 'date') {
        newErrors[field] = `${field} is required.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    if(name === 'date'){
      sessionStorage.setItem('date', value);
    }
    const newFormData = {
      ...formData,
      [name]: value
    };

    if (name === 'dev_team_accepted' || name === 'dev_team_rejected') {
      // Calculate total only if both values exist and are not empty
      const accepted = parseInt(newFormData.dev_team_accepted) || 0;
      const rejected = parseInt(newFormData.dev_team_rejected) || 0;
      newFormData.total_defects = accepted + rejected || '';
    }

    setFormData(newFormData);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const token = sessionStorage.getItem('access_token');
    const method = editingStatus ? 'PUT' : 'POST';
    const url = editingStatus
      ? `https://frt4cnbr-5000.inc1.devtunnels.ms/defect_accepted_rejected/${editingStatus.id}`
      : 'https://frt4cnbr-5000.inc1.devtunnels.ms/defect_accepted_rejected';

    try {
      const response = await axios({
        method,
        url,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: formData
      });
      if (response.status === 200 || response.status === 201) {
        alert(editingStatus ? 'Status updated successfully!' : 'Status added successfully!');
        setEditingStatus(null);
        setFormData({
          date: '',
          total_defects: '',
          dev_team_accepted: '',
          dev_team_rejected: '',
          project_name_id: ''
        });
        fetchDefectStatuses();
      } else {
        alert('Failed to save status.');
      }
    } catch (error) {
      console.error('Error saving status:', error);
    }
  };

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this status?')) {
      const token = sessionStorage.getItem('access_token');
      try {
        const response = await axios.delete(`https://frt4cnbr-5000.inc1.devtunnels.ms/defect_accepted_rejected/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          alert('Status deleted successfully!');
          fetchDefectStatuses();
        } else {
          alert('Failed to delete status.');
        }
      } catch (error) {
        console.error('Error deleting status:', error);
      }
    }
  };

  const handleEditClick = status => {

    setShowModal(false);
    setShowDefectsModal(false);
    setShowFormModal(false);


    setEditingStatus(status);
    setFormData({
      ...status,
      date: formatDate(status.date)
    });
    setShowFormModal(true);
  };

  const handleViewProjectsClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
  };

  const handleCloseDefectsModal = () => {
    setShowDefectsModal(false);
  };

  const today = new Date().toISOString().split('T')[0];


  // Function to format date in DD-MM-YYYY format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are zero-indexed
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleNext = () => {
    const isValid = validateForm();
    if (!isValid) {
      alert('Please fill all the fields before proceeding.');
      return;
    }

    // Store the form data in localStorage
    localStorage.setItem('ManageDefectAcceptedRejected', JSON.stringify(formData));

    // Get user role and navigate accordingly
    const currentRole = getUserRoleFromToken();
    console.log('Current user role:', currentRole); // Debug log

    if (currentRole === 'admin') {
      navigate('/AdminPanel/ManageTestCaseCreationStatus');
    } else {
      navigate('/TestLead/ManageTestCaseCreationStatus');
    }
  };

  const handlePrevious = () => {
    const savedData = JSON.parse(localStorage.getItem('ManageBuildStatus'));
    if (savedData) {
      setFormData(savedData);
    }

    // Get user role and navigate accordingly
    const currentRole = getUserRoleFromToken();
    console.log('Current user role for previous:', currentRole); // Debug log

    if (currentRole === 'admin') {
      navigate('/AdminPanel/ManageBuildStatus');
    } else {
      navigate('/TestLead/ManageBuildStatus');
    }
  };

  // validation 

  const validateField = (name, value) => {
    let error = '';
    if (!value) {
      error = `${name} is required.`;
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prevErrors => ({
      ...prevErrors, 
      [name]: error
    }));
  };



  return (
    <div className="container mt-5">
      <Card>
        <Card.Header
          as="h5"
          style={{
            backgroundColor: '#000d6b',
            color: '#ffffff',
            borderRadius: '10px 10px 0 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          Manage Defect Accepted/Rejected Statuses
          <Button
            variant="outline-light"
            style={{ marginLeft: 'auto', backgroundColor: 'transparent', borderColor: '#ffffff' }}
            onClick={handleViewProjectsClick}
          >
            View Projects
          </Button>
        </Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.date}
                    max={today}
                    disabled={editingStatus}
                    placeholder="Select date"
                  />
                  <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Total Defects</Form.Label>
                  <Form.Control
                    type="number"
                    name="total_defects"
                    value={formData.total_defects}
                    style={{ backgroundColor: '#e9ecef' }}
                    readOnly
                    isInvalid={!!errors.total_defects}
                    placeholder="Auto-calculated from accepted and rejected defects"
                  />
                  <Form.Control.Feedback type="invalid">{errors.total_defects}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Dev Team Accepted</Form.Label>
                  <Form.Control
                    type="number"
                    name="dev_team_accepted"
                    value={formData.dev_team_accepted}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.dev_team_accepted}
                    placeholder="Enter number of accepted defects"
                    min="0"
                  />
                  <Form.Control.Feedback type="invalid">{errors.dev_team_accepted}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Dev Team Rejected</Form.Label>
                  <Form.Control
                    type="number"
                    name="dev_team_rejected"
                    value={formData.dev_team_rejected}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.dev_team_rejected}
                    placeholder="Enter number of rejected defects"
                    min="0"
                  />
                  <Form.Control.Feedback type="invalid">{errors.dev_team_rejected}</Form.Control.Feedback>
                </Form.Group>


                <Form.Group controlId="project_name_id">
                  <Form.Label>Project Name:</Form.Label>
                  {/* Auto-select project name from sessionStorage and disable it */}
                  <Form.Control
                    type="text"
                    value={sessionStorage.getItem('selectedProject') || projectName} // Retrieve from sessionStorage if available
                    readOnly // Make the input read-only
                    placeholder="Project name will be displayed here"
                  />
                </Form.Group>

              </Col>
            </Row>
            <br />
            <Button
              variant="primary"
              onClick={handlePrevious}
              style={{ backgroundColor: '#000d6b', borderColor: '#000d6b' }}
            >
              Go to Previous
            </Button>

            <Button
              variant="primary"
              onClick={handleNext}
              style={{
                backgroundColor: '#000d6b',
                borderColor: '#000d6b',
                float: 'right', // Align to the right
              }}
            >
              {editingStatus ? 'Update Status' : 'Proceed Next'}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Modal for displaying the projects table */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>User Projects</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Project ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id}>
                  <td>{project.project_name}</td>
                  <td>{project.id}</td>
                  <td>
                    <Button
                      variant="secondary"
                      onClick={() => fetchDefectsForProject(project.id)}
                    >
                      View Defect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Back</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for displaying defects for the selected project */}
      <Modal show={showDefectsModal} onHide={handleCloseDefectsModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Defects for Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Defect ID</th>
                <th>Status</th>
                <th>Description</th>
                {user_role === 'admin' && <th>Action</th>}

              </tr>
            </thead>
            <tbody>
              {defects.map(defect => (
                <tr key={defect.id}>
                  <td>{defect.id}</td>
                  <td>{defect.dev_team_accepted}</td>
                  <td>{defect.dev_team_rejected}</td>
                  {user_role === 'admin' && (
                    <td>
                      <Button
                        variant="outline-warning"
                        onClick={() => handleEditClick(defect)}
                        size="sm" // Smaller button size
                      >
                        ✏️
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={() => handleDelete(defect.id)}
                        size="sm" // Smaller button size
                        style={{ marginLeft: '10px' }}
                      >
                        🗑️
                      </Button>
                    </td>
                  )}

                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDefectsModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageDefectAcceptedRejected;





