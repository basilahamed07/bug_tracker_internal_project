import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Button, Table, Form, Card, Row, Col, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory

const ManageBuildStatus = () => {
  const [buildStatuses, setBuildStatuses] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    total_build_received: '',
    builds_accepted: '',
    builds_rejected: '',
    project_name_id: ''
  });
  const [projects, setProjects] = useState([]);
  const [defects, setDefects] = useState([]); // State for defects
  const [errors, setErrors] = useState({});
  const [editingStatus, setEditingStatus] = useState(null);
  const [showModal, setShowModal] = useState(false); // Modal visibility state for table
  const [showDefectModal, setShowDefectModal] = useState(false); // Modal for defect details
  const [selectedProjectId, setSelectedProjectId] = useState(null); // Store selected project ID
  const [showFormModal, setShowFormModal] = useState(false); // Modal for add/edit form
  const [user_role, setUserRole] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const [projectName, setProjectName] = useState(''); // Store project name from sessionStorage    

  useEffect(() => {
    // Get project ID from session storage
    const projectId = sessionStorage.getItem('project_id');
    fetchBuildStatuses(projectId);
    fetchUserProjects();

    // Check if there's data in localStorage for manageDefect
    const storedData = localStorage.getItem('ManageBuildStatus');
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
    if (selectedDate) {
      setFormData(prevState => ({
        ...prevState,
        date: selectedDate,
      }));
    }
  }, []);

  const fetchBuildStatuses = async (projectId) => {
    if (!projectId) {
      console.log('No project ID available');
      return;
    }

    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get(`https://frt4cnbr-5000.inc1.devtunnels.ms/build_status/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setBuildStatuses(response.data);
      console.log("Build statuses response:", response);
    } catch (error) {
      console.error('Error fetching build statuses:', error);
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
      setUserRole(response.data.user_role)
    } catch (error) {
      console.error('Error fetching user projects:', error);
    }
  };

  const validateForm = () => {
    const requiredFields = [
      // 'date',
      // 'total_build_received',
      'builds_accepted',
      'builds_rejected',
      // 'project_name_id'
    ];
    const newErrors = {};
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field} is required.`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    if(name === 'date'){
      sessionStorage.setItem('date', value); // Store the selected date in sessionStorage
    }

    if (name === 'builds_accepted' || name === 'builds_rejected') {
      // Automatically calculate total_build_received
      setFormData(prevData => {
        const newValue = name === 'builds_accepted'
          ? parseInt(value || 0) + (parseInt(prevData.builds_rejected) || 0)
          : parseInt(prevData.builds_accepted || 0) + parseInt(value || 0);
        return {
          ...prevData,
          [name]: value,
          total_build_received: newValue
        };
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const token = sessionStorage.getItem('access_token');
    const method = editingStatus ? 'PUT' : 'POST';
    const url = editingStatus
      ? `https://frt4cnbr-5000.inc1.devtunnels.ms/build_status/${editingStatus.id}`
      : 'https://frt4cnbr-5000.inc1.devtunnels.ms/build_status';

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
          total_build_received: '',
          builds_accepted: '',
          builds_rejected: '',
          project_name_id: ''
        });
        setShowFormModal(false); // Close the form modal after submission
        fetchBuildStatuses();
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
        const response = await axios.delete(`https://frt4cnbr-5000.inc1.devtunnels.ms/build_status/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          alert('Status deleted successfully!');
          fetchBuildStatuses();
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
    setShowDefectModal(false);
    setEditingStatus(status);
    setFormData({
      date: new Date(status.date).toISOString().substring(0, 10), // Convert date to yyyy-mm-dd format
      total_build_received: status.total_build_received,
      builds_accepted: status.builds_accepted,
      builds_rejected: status.builds_rejected,
      project_name_id: status.project_name_id
    });
    // setShowFormModal(true); // Open the form modal for editing
  };

  const handleViewClick = async () => {
    // Fetch user projects when the "View" button is clicked
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get('https://frt4cnbr-5000.inc1.devtunnels.ms/get-user-projects', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setProjects(response.data.projects); // Set the projects state with the fetched data
      setShowModal(true); // Show the modal
    } catch (error) {
      console.error('Error fetching user projects:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
  };

  const handleViewDefects = async (projectId) => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get(`https://frt4cnbr-5000.inc1.devtunnels.ms/build_status/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setDefects(response.data);
      console.log("sdfghjkl", response) // Set defects data in state
      setSelectedProjectId(projectId); // Set selected project ID
      setShowDefectModal(true); // Show defect modal
    } catch (error) {
      console.error('Error fetching defects:', error);
    }
  };

  const today = new Date().toISOString().split('T')[0]; // Current date in yyyy-mm-dd format

  const handleNext = () => {
    // Check if all required fields are filled
    // const isValid = Object.values(formData).every(field => field !== '');
    const isValid = validateForm()
    if (!isValid) {
      alert('Please fill all the fields before proceeding.');
      return;
    }

    // Store the form data in localStorage
    localStorage.setItem('ManageBuildStatus', JSON.stringify(formData));

    // Navigate to the next component
    navigate('/AdminPanel/ManageDefectAcceptedRejected');
  };

  // This function will be triggered when the "Go to Previous" button is clicked
  const handlePrevious = () => {
    // Fetch the form data from localStorage
    const savedData = JSON.parse(localStorage.getItem('ManageTotalDefectStatuses'));

    if (savedData) {
      setFormData(savedData); // Restore the form data from localStorage
    } else {
      console.log('No data found in localStorage.');
    }

    // Navigate to the previous page (can be a specific path or use -1 for going back to the last visited page)
    // navigate('AdminPanel/ManageDefects'); // This will go back to the previous page
    navigate(-1); // This will go back to the previous page
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
          Manage Build Statuses
          <Button
            variant="outline-light"
            style={{ marginLeft: 'auto', backgroundColor: 'transparent', borderColor: '#ffffff' }}
            onClick={handleViewClick} // Button now fetches user projects
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
                    max={today}
                    isInvalid={!!errors.date}
                    disabled={editingStatus}
                    placeholder="Select date"
                  />
                  <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Total Builds Received</Form.Label>
                  <Form.Control
                    type="number"
                    name="total_build_received"
                    value={formData.total_build_received}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.total_build_received}
                    readOnly
                    placeholder="Auto-calculated from accepted and rejected builds"
                    style={{ backgroundColor: '#e9ecef' }}
                  />
                  <Form.Control.Feedback type="invalid">{errors.total_build_received}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Builds Accepted</Form.Label>
                  <Form.Control
                    type="number"
                    name="builds_accepted"
                    value={formData.builds_accepted}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.builds_accepted}
                    placeholder="Enter number of accepted builds"
                    min="0"
                  />
                  <Form.Control.Feedback type="invalid">{errors.builds_accepted}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Builds Rejected</Form.Label>
                  <Form.Control
                    type="number"
                    name="builds_rejected"
                    value={formData.builds_rejected}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.builds_rejected}
                    placeholder="Enter number of rejected builds"
                    min="0"
                  />
                  <Form.Control.Feedback type="invalid">{errors.builds_rejected}</Form.Control.Feedback>
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

      {/* Modal for displaying the user projects */}
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
                <th>View Defects</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id}>
                  <td>{project.project_name}</td>
                  <td>{project.id}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      onClick={() => handleViewDefects(project.id)}
                    >
                      View Defects
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      {/* Modal for displaying defects */}
      <Modal show={showDefectModal} onHide={() => setShowDefectModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Defects for Project ID: {selectedProjectId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Defect ID</th>
                <th>Builds Rejected</th>
                <th>Build Accepted</th>
                {user_role === 'admin' && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {defects.length > 0 ? (
                defects.map(defect => (
                  <tr key={defect.id}>
                    <td>{defect.id}</td>
                    <td>{defect.builds_rejected}</td>
                    <td>{defect.builds_accepted}</td>
                    {user_role === 'admin' && (  // Conditionally render the Actions column for admin
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
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center">
                    No defects found for this project.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      {/* Modal for form */}
      <Modal show={showFormModal} onHide={handleCloseFormModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingStatus ? 'Edit Status' : 'Add Status'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* The form will be rendered above */}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageBuildStatus;