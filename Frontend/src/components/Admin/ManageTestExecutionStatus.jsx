// mY cODE 


import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Button, Table, Form, Card, Row, Col, Modal } from 'react-bootstrap';
import axios from 'axios';

import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import { getUserRoleFromToken } from '../../utils/tokenUtils'; // Import getUserRoleFromToken



const ManageTestExecutionStatus = () => {
  const [testStatuses, setTestStatuses] = useState([]);

  const [formData, setFormData] = useState({
    date: '',
    total_execution: '',
    tc_execution: '',
    pass_count: '',
    fail_count: '',
    no_run: '',
    blocked: '',
    project_name_id: ''
  });
  const [projects, setProjects] = useState([]);
  const [defects, setDefects] = useState([]); // Store defects
  const [errors, setErrors] = useState({});
  const [editingStatus, setEditingStatus] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false); // Project Modal
  const [showDefectsModal, setShowDefectsModal] = useState(false); // Defects Modal
  const [user_role, setUserRole] = useState(false); // Defects Modal


  const navigate = useNavigate(); // Initialize useNavigate for navigation




  const [projectName, setProjectName] = useState(''); // Store project name from sessionStorage  



  useEffect(() => {
    fetchTestStatuses();
    fetchUserProjects();



    // Check if there's data in localStorage for manageDefect
    const storedData = localStorage.getItem('ManageTestExecutionStatus');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setFormData(parsedData); // Fill the form with the stored data
    }



    // Retrieve the selected project name from sessionStorage
    const projectNameFromSession = sessionStorage.getItem('projectName');
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
        date: selectedDate, // Set the date from sessionStorage
      }));
    }

  }, []);

  const fetchTestStatuses = async () => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get('https://frt4cnbr-5000.inc1.devtunnels.ms/test_execution_status', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setTestStatuses(response.data);
    } catch (error) {
      console.error('Error fetching test execution statuses:', error);
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
      console.log("FGHNFDSDFGHJHGFDSDFGHNHGFD : ", response.data.user_role)
      setUserRole(response.data.user_role);

    } catch (error) {
      console.error('Error fetching user projects:', error);
    }
  };

  const fetchDefects = async (projectId) => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get(`https://frt4cnbr-5000.inc1.devtunnels.ms/test_execution_status/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setDefects(response.data);
      setShowDefectsModal(true); // Show defects modal when defects are fetched
      console.log("Fetched defects:", response.data); // Log the defects
    } catch (error) {
      console.error('Error fetching defects:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'date',
      'tc_execution',
      'pass_count',
      'fail_count',
      'no_run',
      'blocked'
    ];

    // Check required fields
    requiredFields.forEach(field => {
      if (!formData[field] && formData[field] !== 0) {
        newErrors[field] = `${field.replace(/_/g, ' ')} is required`;
      }
    });

    // Validate numeric fields are non-negative
    const numericFields = ['tc_execution', 'pass_count', 'fail_count', 'no_run', 'blocked'];
    numericFields.forEach(field => {
      if (formData[field] && (isNaN(formData[field]) || Number(formData[field]) < 0)) {
        newErrors[field] = `${field.replace(/_/g, ' ')} must be a non-negative number`;
      }
    });

    // Validate total execution
    const sum = Number(formData.pass_count || 0) + 
                Number(formData.fail_count || 0) + 
                Number(formData.no_run || 0) + 
                Number(formData.blocked || 0);

    formData.total_execution = sum.toString();

    // Validate date
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.date = 'Date cannot be in the future';
      }
    }

    // Set project_name_id from sessionStorage
    formData.project_name_id = sessionStorage.getItem('projectID');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
  
    // If the date is being changed, store it in sessionStorage
    if (name === 'date') {
      sessionStorage.setItem('date', value); // Store date in sessionStorage
    }
  
    if (['pass_count', 'fail_count', 'no_run', 'blocked'].includes(name)) {
      const sum = (
        Number(updatedFormData.pass_count) +
        Number(updatedFormData.fail_count) +
        Number(updatedFormData.no_run) +
        Number(updatedFormData.blocked)
      ).toString();
  
      updatedFormData.total_execution = sum;
    }
  
    setFormData(updatedFormData);
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    const token = sessionStorage.getItem('access_token');
    const method = editingStatus ? 'PUT' : 'POST';
    const url = editingStatus
      ? `https://frt4cnbr-5000.inc1.devtunnels.ms/test_execution_status/${editingStatus.id}`
      : 'https://frt4cnbr-5000.inc1.devtunnels.ms/test_execution_status';

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
          total_execution: '',
          tc_execution: '',
          pass_count: '',
          fail_count: '',
          no_run: '',
          blocked: '',
          project_name_id: ''
        });
        fetchTestStatuses();
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
        const response = await axios.delete(`https://frt4cnbr-5000.inc1.devtunnels.ms/test_execution_status/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          alert('Status deleted successfully!');
          fetchTestStatuses();
        } else {
          alert('Failed to delete status.');
        }
      } catch (error) {
        console.error('Error deleting status:', error);
      }
    }
  };


  const handleEditClick = status => {
    setShowProjectModal(false);
    setShowDefectsModal(false);
    // setProjectDefects([]); // Reset project defects
    // setSelectedProjectId(null);

    setEditingStatus(status);
    // Pre-fill the form data including the date when editing
    setFormData({
      ...status,
      date: formatDate(status.date) // Make sure to set the correct date format
    });
    // setShowDefectsModal(true); // Open the defects modal when editing
  };

  const handleViewClick = () => {
    setShowProjectModal(true); // Show project modal
    fetchUserProjects();  // Fetch the projects when the modal is opened
  };

  const handleCloseProjectModal = () => {
    setShowProjectModal(false); // Close project modal
  };

  const handleCloseDefectsModal = () => {
    setShowDefectsModal(false); // Close defects modal
  };

  const formatDate = date => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };




  // This function will be triggered when the "Go to Previous" button is clicked
  const handlePrevious = () => {
    // Fetch the form data from localStorage
    const savedData = JSON.parse(localStorage.getItem('manageDefect'));
    // console.log('savedDefectData', savedDefectData);

    if (savedData) {
      setFormData(savedData); // Restore the form data from localStorage
    } else {
      console.log('No Defect-Data found in localStorage.');
    }

    // Navigate to the previous page (can be a specific path or use -1 for going back to the last visited page)
    navigate('/AdminPanel/ManageDefects'); // This will go back to the previous page
    // navigate(-1); // This will go back to the previous page
  };


  const handleNext = () => {
    if (!validateForm()) {
      const missingFields = Object.keys(errors)
        .filter(key => errors[key])
        .map(key => key.replace(/_/g, ' '))
        .join(', ');
      alert(`Please fill in the following required fields: ${missingFields}`);
      return;
    }

    try {
      // Store the form data in localStorage
      const dataToStore = {
        ...formData,
        project_name_id: sessionStorage.getItem('selectedProject')
      };
      localStorage.setItem('ManageTestExecutionStatus', JSON.stringify(dataToStore));

      // Store specific values in sessionStorage
      // sessionStorage.setItem('testExecutionDate', formData.date);
      // sessionStorage.setItem('testExecutionTotalCount', formData.total_execution);

      // Get user role and navigate accordingly
      const currentRole = getUserRoleFromToken();
      console.log('Current user role:', currentRole); // Debug log

      if (currentRole === 'admin') {
        navigate('/AdminPanel/ManageTotalDefectStatus');
      } else {
        navigate('/TestLead/ManageTotalDefectStatus');
      }
    } catch (error) {
      console.error('Error in handleNext:', error);
      alert('There was an error processing the form. Please try again.');
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
          Manage Test Execution Statuses
          <Button
            variant="outline-light"
            style={{ marginLeft: 'auto', backgroundColor: 'transparent', borderColor: '#ffffff' }}
            onClick={handleViewClick}
          >
            View Project
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
                    value={formData.date || ''} // Use an empty string fallback

                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]} // Prevent future dates
                    isInvalid={!!errors.date}
                    disabled={editingStatus}
                  />
                  <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Total Execution</Form.Label>
                  <Form.Control
                    type="number"
                    name="total_execution"
                    value={formData.total_execution || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.total_execution}
                    disabled
                  />
                  <Form.Control.Feedback type="invalid">{errors.total_execution}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Test Case Execution</Form.Label>
                  <Form.Control
                    type="number"
                    name="tc_execution"
                    value={formData.tc_execution}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.tc_execution}
                  // disabled
                  />
                  <Form.Control.Feedback type="invalid">{errors.tc_execution}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Pass Count</Form.Label>
                  <Form.Control
                    type="number"
                    name="pass_count"
                    value={formData.pass_count}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.pass_count}
                  />
                  <Form.Control.Feedback type="invalid">{errors.pass_count}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fail Count</Form.Label>
                  <Form.Control
                    type="number"
                    name="fail_count"
                    value={formData.fail_count}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.fail_count}
                  />
                  <Form.Control.Feedback type="invalid">{errors.fail_count}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>No Run</Form.Label>
                  <Form.Control
                    type="number"
                    name="no_run"
                    value={formData.no_run}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.no_run}
                  />
                  <Form.Control.Feedback type="invalid">{errors.no_run}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Blocked</Form.Label>
                  <Form.Control
                    type="number"
                    name="blocked"
                    value={formData.blocked}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.blocked}
                  />
                  <Form.Control.Feedback type="invalid">{errors.blocked}</Form.Control.Feedback>
                </Form.Group>


                <Form.Group controlId="project_name_id">
                  <Form.Label>Project Name:</Form.Label>
                  {/* Auto-select project name from sessionStorage and disable it */}
                  <Form.Control
                    type="text"
                    value={projectName || sessionStorage.getItem('selectedProject')} 
                    readOnly
                  />
                  <Form.Control
                    type="hidden"
                    name="project_name_id"
                    value={sessionStorage.getItem('projectID') || ''}
                  />
                </Form.Group>

              </Col>
            </Row>

            {/* <Button
              variant="primary"
              onClick={handleSubmit}
              style={{ backgroundColor: '#000d6b', borderColor: '#000d6b' }}
            >
              {editingStatus ? 'Update Status' : 'Add Status'}
            </Button> */}


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

      {/* Project Modal */}
      <Modal show={showProjectModal} onHide={handleCloseProjectModal} size="lg" centered>
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
                      variant="info"
                      onClick={() => fetchDefects(project.id)}
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

      {/* Defects Modal */}
      <Modal show={showDefectsModal} onHide={handleCloseDefectsModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Defects</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {defects.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Defect ID</th>
                  <th>Pass Count</th>
                  <th>Fail Count</th>
                  <th>No Run</th>
                  <th>Blocked</th>
                  {user_role === 'admin' && <th>Actions</th>}

                </tr>
              </thead>
              <tbody>
                {defects.map(defect => (
                  <tr key={defect.id}>
                    <td>{formatDate(defect.date)}</td>
                    <td>{defect.id}</td>
                    <td>{defect.pass_count}</td>
                    <td>{defect.fail_count}</td>
                    <td>{defect.no_run}</td>
                    <td>{defect.blocked}</td>
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
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No defects found for this project.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageTestExecutionStatus;




