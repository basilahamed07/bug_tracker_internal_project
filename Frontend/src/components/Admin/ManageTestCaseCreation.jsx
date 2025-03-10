import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Card, Row, Col, Modal } from 'react-bootstrap';
import axios from 'axios';

import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import { getUserRoleFromToken } from '../../utils/tokenUtils';
import { jwtDecode } from 'jwt-decode'; // Add this import


const ManageTestCaseCreationStatus = () => {
  const [testCaseStatuses, setTestCaseStatuses] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    total_test_case_created: '',
    test_case_approved: '',
    test_case_rejected: '', 
    project_name_id: ''
  });
  const [projects, setProjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [editingStatus, setEditingStatus] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false); // State for the Project Modal
  const [showDefectModal, setShowDefectModal] = useState(false); // State for the Defect Modal
  const [defects, setDefects] = useState([]); // State for defects
  const [selectedProjectId, setSelectedProjectId] = useState(null); // Store selected project ID
  const [user_role, setUserRole] = useState(null);


  const [showPopup, setShowPopup] = useState(false); // State for the confirmation popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for the success popup
  const [successMessage, setSuccessMessage] = useState('');

  const [editingDefect, setEditingDefect] = useState(null); // or a default value
  const [loading, setLoading] = useState(false);



  const [projectName, setProjectName] = useState(''); // Store project name from sessionStorage    


  const navigate = useNavigate(); // Initialize useNavigate for navigation


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
    fetchTestCaseStatuses();
    fetchUserProjects();  // Fetch projects when the component mounts

    // Check if there's data in localStorage for manageDefect
    const storedData = localStorage.getItem('ManageTestCaseCreation');
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
      date: selectedDate
      }));
    }

  }, []);

  const fetchTestCaseStatuses = async () => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get('https://frt4cnbr-5000.inc1.devtunnels.ms/test_case_creation_status', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setTestCaseStatuses(response.data);
    } catch (error) {
      console.error('Error fetching test case statuses:', error);
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
      setProjects(response.data.projects);  // Store the user's projects
      setUserRole(response.data.user_role);
    } catch (error) {
      console.error('Error fetching user projects:', error);
    }
  };

  // Fetch defects when the "View Defect" button is clicked
  const handleViewDefect = async (projectId) => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get(`https://frt4cnbr-5000.inc1.devtunnels.ms/test_case_creation_status/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setDefects(response.data); // Store defects in state
      setSelectedProjectId(projectId); // Store the selected project ID
      setShowDefectModal(true); // Show the Defect Modal
    } catch (error) {
      console.error('Error fetching defects:', error);
    }
  };

  // Close the project modal
  const handleCloseProjectModal = () => {
    setShowProjectModal(false);
  };

  // Close the defect modal
  const handleCloseDefectModal = () => {
    setShowDefectModal(false);
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate date
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else if (new Date(formData.date) > new Date()) {
      newErrors.date = 'Date cannot be in the future';
    }

    // Validate test_case_approved
    if (!formData.test_case_approved) {
      newErrors.test_case_approved = 'Number of approved test cases is required';
    } else if (isNaN(formData.test_case_approved) || parseInt(formData.test_case_approved) < 0) {
      newErrors.test_case_approved = 'Please enter a valid number';
    }

    // Validate test_case_rejected
    if (!formData.test_case_rejected) {
      newErrors.test_case_rejected = 'Number of rejected test cases is required';
    } else if (isNaN(formData.test_case_rejected) || parseInt(formData.test_case_rejected) < 0) {
      newErrors.test_case_rejected = 'Please enter a valid number';
    }

    // Validate project_name_id
    if (!formData.project_name_id && !projectName) {
      newErrors.project_name_id = 'Project name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    if(name == 'date'){
      sessionStorage.setItem('date', value);
    }

    // Automatically update total_test_case_created
    if (name === 'test_case_approved' || name === 'test_case_rejected') {
      const total = parseInt(newFormData.test_case_approved || 0) + parseInt(newFormData.test_case_rejected || 0);
      newFormData.total_test_case_created = total;
    }

    setFormData(newFormData);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const token = sessionStorage.getItem('access_token');
    const method = editingStatus ? 'PUT' : 'POST';
    const url = editingStatus
      ? `https://frt4cnbr-5000.inc1.devtunnels.ms/test_case_creation_status/${editingStatus.id}`
      : 'https://frt4cnbr-5000.inc1.devtunnels.ms/test_case_creation_status';

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
          total_test_case_created: '',
          test_case_approved: '',
          test_case_rejected: '',
          project_name_id: ''
        });
        fetchTestCaseStatuses();
      } else {
        alert('Failed to save status.');
      }
    } catch (error) {
      console.error('Error saving status:', error);
    }
  };


  const fetchStatuses = () => {
    // Your function to fetch statuses after submission
    console.log("Fetching statuses...");
    // Perform the fetching logic (like calling an API or updating UI state)
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('access_token');
      const projectId = sessionStorage.getItem('selectedProject') || projectName;

      // Define all API endpoints and their corresponding localStorage keys
      const endpoints = [
        {
          key: 'ManageBuildStatus',
          url: 'https://frt4cnbr-5000.inc1.devtunnels.ms/build_status'
        },
        {
          key: 'ManageDefectAcceptedRejected',
          url: 'https://frt4cnbr-5000.inc1.devtunnels.ms/defect_accepted_rejected'
        },
        {
          key: 'ManageTestCaseCreation',
          url: 'https://frt4cnbr-5000.inc1.devtunnels.ms/test_case_creation_status'
        },
        {
          key: 'ManageTestExecutionStatus',
          url: 'https://frt4cnbr-5000.inc1.devtunnels.ms/test_execution_status'
        },
        {
          key: 'ManageTotalDefectStatuses',
          url: 'https://frt4cnbr-5000.inc1.devtunnels.ms/total_defect_status'
        },
        {
          key: 'manageDefect',
          url: 'https://frt4cnbr-5000.inc1.devtunnels.ms/new_defects'
        }
      ];

      // Send all data in parallel
      const promises = endpoints.map(async endpoint => {
        const storedData = localStorage.getItem(endpoint.key);
        if (storedData) {
          const data = JSON.parse(storedData);
          // Ensure project_name_id is set
          const dataToSubmit = {
            ...data,
            project_name_id: data.project_name_id || projectId
          };

          return axios({
            method: 'POST',
            url: endpoint.url,
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            data: dataToSubmit
          });
        }
        return null;
      });

      // Wait for all requests to complete
      const results = await Promise.all(promises.filter(p => p !== null));
      
      // Check if all requests were successful
      const allSuccessful = results.every(res => res.status === 200 || res.status === 201);

      if (allSuccessful) {
        setSuccessMessage('All statuses updated successfully!');
        setShowPopup(false);
        setShowSuccessPopup(true);
        
        // Clear all localStorage items
        endpoints.forEach(endpoint => {
          localStorage.removeItem(endpoint.key);
          sessionStorage.removeItem('formData');
        });

        // Reset form
        setFormData({
          date: '',
          total_test_case_created: '',
          test_case_approved: '',
          test_case_rejected: '',
          project_name_id: ''
        });

        // Navigate after successful submission
        const currentRole = getUserRoleFromToken();
        console.log('Current role for navigation:', currentRole);

        if (currentRole === 'admin') {
          navigate('/AdminPanel/MatrixInput');
        } else {
          navigate('/TestLead/MatrixInput');
        }
      } else {
        throw new Error('Some requests failed');
      }
    } catch (error) {
      console.error('Error submitting forms:', error);
      setSuccessMessage('Failed to save some statuses. Please try again.');
      setShowSuccessPopup(true);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this status?')) {
      const token = sessionStorage.getItem('access_token');
      try {
        const response = await axios.delete(`https://frt4cnbr-5000.inc1.devtunnels.ms/test_case_creation_status/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          alert('Status deleted successfully!');
          fetchTestCaseStatuses();
        } else {
          alert('Failed to delete status.');
        }
      } catch (error) {
        console.error('Error deleting status:', error);
      }
    }
  };

  const handleEditClick = status => {
    setShowDefectModal(false);
    setShowProjectModal(false);
    setEditingStatus(status);
    setFormData({
      ...status,
      date: formatDate(status.date) // Make sure to set the correct date format
    });
  };

  // Handle View Button click, show the modal with the list of projects
  const handleViewClick = () => {
    setShowProjectModal(true);  // Show the project modal
  };

  const formatDate = date => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = d.getFullYear();
    return `${year}-${month}-${day}`; // This formats it to yyyy-mm-dd for input type="date"
  };


  const handlePreviewSubmit = (e) => {
    e.preventDefault();
    
    // Create a complete form data object with all required fields
    const currentFormData = {
      ...formData,
      project_name_id: formData.project_name_id || sessionStorage.getItem('selectedProject') || projectName,
      total_test_case_created: parseInt(formData.test_case_approved || 0) + parseInt(formData.test_case_rejected || 0)
    };

    // Validate all required fields
    const newErrors = {};
    if (!currentFormData.date) newErrors.date = 'Date is required';
    if (!currentFormData.test_case_approved) newErrors.test_case_approved = 'Approved test cases is required';
    if (!currentFormData.test_case_rejected) newErrors.test_case_rejected = 'Rejected test cases is required';
    if (!currentFormData.project_name_id) newErrors.project_name_id = 'Project name is required';

    setErrors(newErrors);

    // Only proceed if there are no errors
    if (Object.keys(newErrors).length === 0) {
      // Store the complete form data
      localStorage.setItem('ManageTestCaseCreation', JSON.stringify(currentFormData));
      setShowPopup(true);
    }
  };

  // Single validateField function to handle all validations
  const validateField = (name, value) => {
    switch (name) {
      case 'date':
        if (!value) return 'Date is required';
        if (new Date(value) > new Date()) return 'Date cannot be in the future';
        break;
      
      case 'test_case_approved':
        if (!value) return 'Number of approved test cases is required';
        if (isNaN(value) || value < 0) return 'Please enter a valid number';
        break;
      
      case 'test_case_rejected':
        if (!value) return 'Number of rejected test cases is required';
        if (isNaN(value) || value < 0) return 'Please enter a valid number';
        break;
      
      case 'project_name_id':
        if (!value) return 'Project name is required';
        break;
      
      default:
        if (!value) return `${name} is required.`;
        return '';
    }
    return '';
  };

  // Remove the duplicate validateField function and update handleBlur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
  };

  // This function will be triggered when the "Go to Previous" button is clicked
  const handlePrevious = () => {
    // Fetch the form data from localStorage
    const savedData = JSON.parse(localStorage.getItem('ManageDefectAcceptedRejected'));

    if (savedData) {
      setFormData(savedData); // Restore the form data from localStorage
    } else {
      console.log('No data found in localStorage.');
    }

    // Navigate to the previous page (can be a specific path or use -1 for going back to the last visited page)
    // navigate('AdminPanel/ManageDefects'); // This will go back to the previous page
    const currentRole = getUserRoleFromToken();
    console.log('Current role for previous:', currentRole);

    if (currentRole === 'admin') {
      navigate('/AdminPanel/ManageDefectAcceptedRejected');
    } else {
      navigate('/TestLead/ManageDefectAcceptedRejected');
    }
  };


  const handlePopupCancel = () => {
    setShowPopup(false); // Close the popup without submitting
  };



  // validation 

  // const validateField = (name, value) => {
  //   let error = '';
  //   if (!value) {
  //     error = `${name} is required.`;
  //   }
  //   return error;
  // };

  // const handleBlur = (e) => {
  //   const { name, value } = e.target;
  //   const error = validateField(name, value);
  //   setErrors(prevErrors => ({
  //     ...prevErrors,
  //     [name]: error
  //   }));
  // };


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
            justifyContent: 'space-between', // This ensures the button is positioned to the right
            alignItems: 'center'
          }}
        >
          Manage Test Case Creation Statuses
          <Button
            variant="outline-light" // You can choose a different variant as needed
            style={{ marginLeft: 'auto', backgroundColor: 'transparent', borderColor: '#ffffff' }}
            onClick={handleViewClick} // When clicked, show the modal with projects
          >
            View Projects
          </Button>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={(e) => e.preventDefault()}>
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
                    max={new Date().toISOString().split('T')[0]}
                    isInvalid={!!errors.date}
                    disabled={editingStatus} // Disable date input when editing
                    placeholder="Select date"
                  />
                  <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Total Test Case Created</Form.Label>
                  <Form.Control
                    type="number"
                    name="total_test_case_created"
                    value={formData.total_test_case_created}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.total_test_case_created}
                    disabled
                    style={{ backgroundColor: '#e9ecef' }}
                    placeholder="Auto-calculated from approved and rejected cases"
                  />
                  <Form.Control.Feedback type="invalid">{errors.total_test_case_created}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Test Case Approved</Form.Label>
                  <Form.Control
                    type="number"
                    name="test_case_approved"
                    value={formData.test_case_approved}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.test_case_approved}
                    placeholder="Enter number of approved test cases"
                    min="0"
                  />
                  <Form.Control.Feedback type="invalid">{errors.test_case_approved}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Test Case Rejected</Form.Label>
                  <Form.Control
                    type="number"
                    name="test_case_rejected"
                    value={formData.test_case_rejected}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.test_case_rejected}
                    placeholder="Enter number of rejected test cases"
                    min="0"
                  />
                  <Form.Control.Feedback type="invalid">{errors.test_case_rejected}</Form.Control.Feedback>
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
              onClick={handlePreviewSubmit}
              disabled={loading}
              style={{
                backgroundColor: '#000d6b',
                borderColor: '#000d6b',
                float: 'right', // Align to the right
              }}
            >
              {loading ? 'Processing...' : (editingStatus ? 'Update Status' : 'Proceed Submit')}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Confirm All Status Updates</h3>
            <p>Are you sure you want to submit all status updates for this project?</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Button 
                onClick={handleFinalSubmit} 
                disabled={loading}
                style={{ backgroundColor: '#000d6b', borderColor: '#000d6b' }}
              >
                {loading ? 'Submitting All Status...' : 'Yes, Proceed'}
              </Button>
              <Button 
                onClick={handlePopupCancel}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Success</h3>
            <p style={{ color: 'green' }}>{successMessage}</p>
          </div>
        </div>
      )}

      {/* Modal for displaying the list of projects */}
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
                <th>Actions</th> {/* Added Actions column */}
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.project_name}</td>
                  <td>{project.id}</td>
                  <td>
                    {/* View Defect button */}
                    <Button
                      variant="secondary"
                      onClick={() => handleViewDefect(project.id)}
                    >
                      View Defect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      {/* Modal for displaying defects */}
      <Modal show={showDefectModal} onHide={handleCloseDefectModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Defects for Project {selectedProjectId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {defects.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Defect ID</th>
                  <th>Test_case_approved</th>
                  <th>Test_case_rejected</th>
                  {user_role === 'admin' && <th>actions</th>}
                </tr>
              </thead>
              <tbody>
                {defects.map((defect) => (
                  <tr key={defect.id}>
                    <td>{formatDate(defect.date)}</td>
                    <td>{defect.id}</td>
                    <td>{defect.test_case_approved}</td>
                    <td>{defect.test_case_rejected}</td>
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

export default ManageTestCaseCreationStatus;
