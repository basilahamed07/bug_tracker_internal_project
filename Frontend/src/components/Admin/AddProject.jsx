// MY LATEST CODE 
import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Modal, Dropdown, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios, { formToJSON } from 'axios';
import "./AddProject.css"
import { useDispatch, useSelector } from 'react-redux';
import { validateField } from '../validation/store';  
import { validateProjectName, validateConfirmProjectName } from './validation';

export default function AddProjectWithDetails({ projectNameProp }) {
  const [projectName, setProjectName] = useState(projectNameProp);
  const [confirmProjectName, setConfirmProjectName] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showCreateDetails, setShowCreateDetails] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [showPopup, setShowPopup] = useState(false); // State for the confirmation popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for the success popup
  const [errorMessage, setErrorMessage] = useState("");
  const [hoveredOption, setHoveredOption] = useState('');

  // for pending form 

  const [pendingProjects, setPendingProjects] = useState([]); // State to store pending projects
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');

  const [formErrors, setFormErrors] = useState({
    projectName: '',
    confirmProjectName: '',
    rag: '',
    rag_details: '',
    billing_type: '',
    tester_count: '',
    automation: '',
    ai_used: '',
    agile_type: '',
    billable: '',
    nonbillable: ''
  });

  const validateField = (name, value) => {
    let error = '';
  
    // Check if value is a string before calling trim()
    const safeValue = typeof value === 'string' ? value.trim() : '';
  
    switch (name) {
      case 'projectName':
        if (!safeValue) {
          error = 'Project name is required';
        } else if (safeValue.length < 3) {
          error = 'Project name must be at least 3 characters';
        }
        break;
  
      case 'confirmProjectName':
        if (!safeValue) {
          error = 'Please confirm project name';
        } else if (safeValue !== projectName) {
          error = 'Project names do not match';
        }
        break;
  
      case 'rag':
        if (!value) {
          error = 'Please select a RAG status';
        }
        break;
  
      case 'rag_details':
        if (!safeValue) {
          error = 'RAG details are required';
        }
        break;
  
      case 'billing_type':
        if (!value) {
          error = 'Please select a billing type';
        }
        break;
  
      case 'agile_type':
        if (!value) {
          error = 'Please select a project type';
        }
        break;
  
      case 'billable':
        if (!value || value.length === 0) {
          error = 'At least one billable tester is required';
        }
        break;
  
      case 'nonbillable':
        if (!value || value.length === 0) {
          error = 'At least one non-billable tester is required';
        }
        break;
  
      case 'automation':
        if (!value) {
          error = 'Please select whether automation is used';
        }
        break;
  
      case 'ai_used':
        if (!value) {
          error = 'Please select whether AI is used';
        }
        break;
  
      default:
        break;
    }
  
    return error;
  };
  

  const handleBlur = (fieldName, value) => {
    let error = '';
    
    if (fieldName === 'projectName' || fieldName === 'confirmProjectName') {
      // Create a proper action object instead of dispatching string
      dispatch({
        type: 'VALIDATE_FIELD',
        payload: {
          field: fieldName,
          error: fieldName === 'projectName' 
            ? validateProjectName(projectName, confirmProjectName)
            : validateConfirmProjectName(confirmProjectName)
        }
      });
    } 
  
    // Form validation for other fields
    error = validateField(fieldName, value);
  
    // Update form errors state
    setFormErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  // const { setSelectedProject } = useProject();  // Access the setSelectedProject function
  

  const navigate = useNavigate(); // Initialize useNavigate hook

  const [formData, setFormData] = useState({
    project_name_id: '',
    rag: '',
    tester_count: 0, // Initialize with 0
    billable: [],
    nonbillable: [],
    billing_type: '',
    rag_details: '',
    automation: 'No',  // Set default value
    ai_used: 'No',    // Set default value
    automation_details: null,
    ai_used_details: null,
    agile_type: ''

  });

  const [testers, setTesters] = useState([]);
  const [loadingTesters, setLoadingTesters] = useState(false);
  const [showCreateTesterModal, setShowCreateTesterModal] = useState(false);
  const [selectedTesterType, setSelectedTesterType] = useState('');
  const [selectedTesters, setSelectedTesters] = useState({
    billable: [],
    nonbillable: [],
  });

  const handleIconClick = () => setShowForm(true);

  useEffect(() => {

    // Load the saved form data from sessionStorage (if any)
    const savedFormData = sessionStorage.getItem('formData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData)); // Set the form data to saved state
    }

  }, [showCreateDetails]); // Run only on initial render (mount) or page refresh


  // Step 2: Save form data to sessionStorage whenever formData changes
  useEffect(() => {
    if (formData) {
      sessionStorage.setItem('formData', JSON.stringify(formData));
    }

    
  }, [formData]); // This effect runs every time formData changes


  // for validation 

  const dispatch = useDispatch();
  const { errors } = useSelector((state) => state.formValidation);

  const fetchTesters = async () => {
    setLoadingTesters(true);
    try {
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) {
        setError('No access token found. Please login.');
        return;
      }

      const response = await fetch('https://frt4cnbr-5000.inc1.devtunnels.ms/tester-billable', {
        // const response = await fetch('https://frt4cnbr-5000.inc1.devtunnels.ms/tester-billable', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
 
      const data = await response.json();
      setTesters(data.testers || []);
    } catch (error) {
      console.error('Error fetching testers:', error);
      setError('Error fetching testers: ' + error.message);
    } finally {
      setLoadingTesters(false);
    }
  };

  useEffect(() => {
    fetchTesters();
  }, []);

  const handleTesterSelection = (tester, type) => {
    const updatedList = selectedTesters[type].find(item => item.tester_name === tester.tester_name)
      ? selectedTesters[type].filter(item => item.tester_name !== tester.tester_name)
      // : [...selectedTesters[type], { ...tester, project_name: projectName }];
      : [...selectedTesters[type], { ...tester, project_name: selectedProject ? selectedProject : projectName }];

    const updatedSelectedTesters = { ...selectedTesters, [type]: updatedList };

    setSelectedTesters(updatedSelectedTesters);
    updateTesterCount(updatedSelectedTesters);
  };

  const handleCreateTester = async (testerName, type) => {
    const newTester = {
      tester_name: testerName,
      // project_name: projectName,
      project_name: selectedProject ? selectedProject : projectName,
      billable: type === 'billable',
    };

    const updatedList = type === 'billable' ? [...selectedTesters.billable, newTester] : [...selectedTesters.nonbillable, newTester];
    const updatedSelectedTesters = { ...selectedTesters, [type]: updatedList };

    setSelectedTesters(updatedSelectedTesters);
    updateTesterCount(updatedSelectedTesters);
    setShowCreateTesterModal(false);
  };

  const updateTesterCount = (updatedSelectedTesters) => {
    const totalCount = updatedSelectedTesters.billable.length + updatedSelectedTesters.nonbillable.length;
    setFormData({ ...formData, tester_count: totalCount });
  };

  const isFormValid = () => {
    const errors = {
      projectName: validateField('projectName', projectName),
      confirmProjectName: validateField('confirmProjectName', confirmProjectName),
      rag: validateField('rag', formData.rag),
      rag_details: validateField('rag_details', formData.rag_details),
      billing_type: validateField('billing_type', formData.billing_type),
      agile_type: validateField('agile_type', formData.agile_type),
      billable: validateField('billable', selectedTesters.billable),
      nonbillable: validateField('nonbillable', selectedTesters.nonbillable),
      automation: validateField('automation', formData.automation || 'No'),
      ai_used: validateField('ai_used', formData.ai_used || 'No')
    };
  
    setFormErrors(errors);
    return !Object.values(errors).some(error => error !== '');
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const projectNameError = validateField('projectName', projectName);
    const confirmProjectNameError = validateField('confirmProjectName', confirmProjectName);

    setFormErrors(prev => ({
      ...prev,
      projectName: projectNameError,
      confirmProjectName: confirmProjectNameError
    }));

    if (projectNameError || confirmProjectNameError) {
      return; // Stop submission if there are errors
    }

    if (projectName !== confirmProjectName) {
      setError('Project names do not match.');
      return;
    }

    try {
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) throw new Error('User is not authenticated');

      setIsPending(true);

      const requestBody = {
        project_name: selectedProject ? selectedProject : projectName,
      };

      const response = await fetch('https://frt4cnbr-5000.inc1.devtunnels.ms/create-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });
      console.log("DFGHJKJHGFDFGHJK : ", response)
      // const data = await response.jsonify()

      // console.log("Data from responese : " , data)

      if (!response.ok) {
        const error = await response.json();
        if (error && error.message === 'Project name already exists') {
          // If the project name already exists
          setError('Project name already exists.');
        } else {
          // Handle other errors
          throw new Error('Project creation failed');
        }
        return;  // Exit the function after handling the error
      }

      const projectDataResponse = await response.json();



// Store the project_id in sessionStorage
sessionStorage.setItem('projectID', projectDataResponse.project_id);

      // setSuccessMessage('Project created successfully!');

      // Save the state in sessionStorage to indicate the project is created
      // sessionStorage.setItem('isProjectCreated', 'true');
      setShowCreateDetails(true);


    } catch (error) {
      setError('Error creating project: ' + error.message);
    } finally {
      setIsPending(false);
      setShowPopup(false); // Close the popup after submitting
    }
  };


  // Handle Submit (Trigger Popup)
  const handleSubmitClick = (e) => {
    e.preventDefault();
    
    // Check all required fields
    const allErrors = {
      rag: validateField('rag', formData.rag),
      rag_details: validateField('rag_details', formData.rag_details),
      billing_type: validateField('billing_type', formData.billing_type),
      agile_type: validateField('agile_type', formData.agile_type),
      automation: validateField('automation', formData.automation || 'No'),
      ai_used: validateField('ai_used', formData.ai_used || 'No'),
      billable: validateField('billable', selectedTesters.billable),
      nonbillable: validateField('nonbillable', selectedTesters.nonbillable)
    };
  
    setFormErrors(allErrors);
  
    // Check if any validation errors exist
    const hasErrors = Object.values(allErrors).some(error => error !== '');
    
    if (hasErrors) {
      setErrorMessage("Please fix all validation errors before submitting.");
      return;
    }
  
    // Check if all required fields are filled
    const requiredFields = {
      rag: formData.rag,
      rag_details: formData.rag_details,
      billing_type: formData.billing_type,
      agile_type: formData.agile_type,
      automation: formData.automation,
      ai_used: formData.ai_used,
      billable: selectedTesters.billable.length > 0,
      nonbillable: selectedTesters.nonbillable.length > 0
    };
  
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field]) => field);
  
    if (missingFields.length > 0) {
      setErrorMessage(`Please fill in the following fields: ${missingFields.join(', ')}`);
      return;
    }
  
    // If all validations pass, show the confirmation popup
    setShowPopup(true);
  };
  

  const handlePopupCancel = () => {
    setShowPopup(false); // Close the popup without submitting
  };

  const handleProjectDetailsSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
  
    try {
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) throw new Error('User is not authenticated');
  
      setIsPending(true);
      setErrorMessage(''); // Clear any previous error messages

      const testersToSubmit = [
        ...selectedTesters.billable.map(tester => ({
          tester_name: tester.tester_name,
          // project_name: projectName,
          project_name: selectedProject ? selectedProject : projectName,
          billable: true,
        })),
        ...selectedTesters.nonbillable.map(tester => ({
          tester_name: tester.tester_name,
          // project_name: projectName,
          project_name: selectedProject ? selectedProject : projectName,
          billable: false,
        })),
      ];
      
      const createTestersResponse = await fetch('https://frt4cnbr-5000.inc1.devtunnels.ms/tester-billable', {
        // const createTestersResponse = await fetch('https://frt4cnbr-5000.inc1.devtunnels.ms/tester-billable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ testers: testersToSubmit }),
      });

      if (!createTestersResponse.ok) {
        throw new Error('Testers creation failed');
      }

      const testersResponseData = await createTestersResponse.json();
      console.log('Testers created successfully:', testersResponseData);

      // Prepare the payload
      const projectDetailsPayload = {
        project_name: selectedProject ? selectedProject : projectName,
        project_name_id: sessionStorage.getItem('projectID'), // Get from sessionStorage
        rag: formData.rag,
        rag_details: formData.rag_details,
        billing_type: formData.billing_type,
        tester_count: formData.tester_count,
        automation: formData.automation,
        ai_used: formData.ai_used,
        automation_details: formData.automation === 'Yes' ? formData.automation_details : "No Automation is used here",
        ai_used_details: formData.ai_used === 'Yes' ? formData.ai_used_details : "No ai used here",
        agile_type: formData.agile_type === 'Agile' ? true : false,
        testers: [
          ...selectedTesters.billable.map(tester => ({
            tester_name: tester.tester_name,
            project_name: selectedProject ? selectedProject : projectName,
            billable: true
          })),
          ...selectedTesters.nonbillable.map(tester => ({
            tester_name: tester.tester_name,
            project_name: selectedProject ? selectedProject : projectName,
            billable: false
          }))
        ]
      };
  
      console.log('Submitting payload:', projectDetailsPayload);
  
      const response = await fetch('https://frt4cnbr-5000.inc1.devtunnels.ms/create-project-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(projectDetailsPayload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit project details');
      }
  
      const responseData = await response.json();
      console.log('Success response:', responseData);
  
      // Show success message and handle navigation
      setSuccessMessage('Project details updated successfully!');
      setShowPopup(false);
      setShowSuccessPopup(true);
  
      // Set session storage values
      sessionStorage.setItem('projectFlow', 'True');
      sessionStorage.setItem('selectedProject', selectedProject ? selectedProject : projectName);
      
      // Navigate after short delay
      setTimeout(() => {
        const agileType = sessionStorage.getItem('agileType');
        if (agileType === 'true') {
          navigate('/TestLead/ScrumTeamManagement');
        } else {
          navigate('/TestLead/NonAgileForm');
        }
      }, 1000);
  
    } catch (error) {
      console.error('Submission error:', error);
      setErrorMessage(`Error submitting project details: ${error.message}`);
    } finally {
      setIsPending(false);
    }
  };
  

  



  
  // Fetch pending projects from API
  const fetchPendingProjects = async () => {
    setLoading(true);
    try {
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) {
        setError('No access token found. Please login.');
        return;
      }

      const response3 = await axios.get('https://frt4cnbr-5000.inc1.devtunnels.ms/pending-project', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // console.log(response3.data);  // Log the entire response


      // Assuming the response3 returns an array of projects with project_name
      if (response3.data && Array.isArray(response3.data)) {
        setPendingProjects([response3.data.sample_data]); // Wrap it in an array
        // console.log(response3.data.sample_data);  // Log the fetched projects
      } else {
        // setError('No pending projects available.');
      }



      if (response3.data && Array.isArray(response3.data.sample_data)) {
        setPendingProjects(response3.data.sample_data);
        // console.log(response3.data.sample_data);  // Log the fetched projects
      } else {
        setError('No pending projects available.');
      }

    } catch (err) {
      setError('Failed to fetch pending projects.');
    } finally {
      setLoading(false);
    }
  };

  // Add this validation function
  const validateSelectedProject = (project) => {
    if (!project) {
      return 'Please select a project';
    }
    return '';
  };

  // Update the handleProjectUpdate function
  const handleProjectUpdate = (project) => {
    const validationError = validateSelectedProject(project);
    if (validationError) {
      setError(validationError);
      return;
    }
  
    setProjectName(project.project_name);
    setSelectedProject(project);
    setError(''); // Clear any existing errors
    setShowCreateDetails(true);
  };

  // Fetch projects when component mounts
  useEffect(() => {
    fetchPendingProjects();
  }, []);



  const getAvailableTesters = (type) => {
    return testers.filter(tester =>
      !selectedTesters.billable.some(selectedTester => selectedTester.tester_name === tester.tester_name) &&
      !selectedTesters.nonbillable.some(selectedTester => selectedTester.tester_name === tester.tester_name)
    );
  };



// Color Option

  const handleHover = (value) => {
    
    setHoveredOption(value);
 
    
  };
  

  const handleChange = (e) => {
    setFormData({ ...formData, rag: e.target.value });
  };

  return (
    <div className="container mt-5 mb-5 ">
      {/* Parent container with flexbox to display both sections side by side */}
      {showForm && !showCreateDetails && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>


          {/* Add Project Form */}
          <div style={{ width: "50%" }}>
            {showForm && !showCreateDetails && (
              <Card>
                <Card.Header
                  as="h5"
                  style={{ backgroundColor: "#000d6b", color: "#ffffff" }}
                >
                  Add Project
                </Card.Header>
                <Card.Body>
                  {error && <p className="text-danger">{error}</p>}
                  {successMessage && <p className="text-success">{successMessage}</p>}
                  {errorMessage && (
                    <div className="alert alert-danger mb-3">
                      {errorMessage}
                    </div>
                  )}
                  <Form onSubmit={handleProjectSubmit}>
                    <Form.Group controlId="projectName">
                      <Form.Label>Project Name:</Form.Label>
                      <Form.Control
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        onBlur={(e) => handleBlur('projectName', e.target.value)}
                        className={formErrors.projectName ? 'is-invalid' : ''}
                      />
                      {formErrors.projectName && (
                        <div className="invalid-feedback">{formErrors.projectName}</div>
                      )}
                    </Form.Group>
                    <Form.Group controlId="confirmProjectName">
                      <Form.Label>Confirm Project Name:</Form.Label>
                      <Form.Control
                        type="text"
                        value={confirmProjectName}
                        onChange={(e) => setConfirmProjectName(e.target.value)}
                        onBlur={(e) => handleBlur('confirmProjectName', e.target.value)}
                        className={formErrors.confirmProjectName ? 'is-invalid' : ''}
                      />
                      {formErrors.confirmProjectName && (
                        <div className="invalid-feedback">{formErrors.confirmProjectName}</div>
                      )}
                    </Form.Group>
                    <br />
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isPending}
                      style={{
                        fontWeight: "bold",
                        color: "#ffffff",
                        backgroundColor: "#000d6b",
                        borderColor: "#000d6b",
                      }}
                    >
                      {isPending ? "Creating..." : "Create Project"}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            )}
          </div>

          {/* Left Section: Display Pending Projects */}
          <div style={{ width: '45%' }}>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div>
                {pendingProjects.length === 0 ? (
                  <p>No pending projects available.</p>
                ) : (
                  <Card>
                    <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff' }}>
                      Pending Projects
                    </Card.Header>
                    <Card.Body>
                      <Form>
                        {/* Dropdown for selecting project */}
                        <Form.Group>
                          <Form.Label>Project Name:</Form.Label>
                          <Form.Control
                            as="select"
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            className={error ? 'is-invalid' : ''}
                          >
                            <option value="">Select a project</option>
                            {pendingProjects.map((projectName, index) => (
                              <option key={index} value={projectName}>
                                {projectName}
                              </option>
                            ))}
                          </Form.Control>
                          {error && (
                            <div className="invalid-feedback">{error}</div>
                          )}
                        </Form.Group>

                        <Form.Group>
                          <Form.Label>Status: Pending</Form.Label>
                          {/* <Form.Control
                            as="select"
                            value="Pending"
                            readOnly
                            style={{ borderColor: '' }} // Apply warning color for Pending
                          >
                            {/* <option>Pending</option> */}
                          {/* </Form.Control> */} 
                        </Form.Group>
                        <br />
                        <Button
                          variant="primary"
                          onClick={() => handleProjectUpdate(selectedProject)} // Pass the selected project name
                          disabled={!selectedProject || isPending}
                          style={{
                            fontWeight: 'bold',
                            color: '#ffffff',
                            backgroundColor: '#000d6b',
                            borderColor: '#000d6b',
                          }}
                        >
                          {isPending ? 'Proceeding...' : 'Proceed with Update'}
                        </Button>
                        {error && (
                          <div className="text-danger mt-2">{error}</div>
                        )}
                      </Form>
                    </Card.Body>
                  </Card>
                )}
              </div>
            )}
          </div>



        </div>
      )}

      {/* Create Project Details Form */}
      {showCreateDetails && (
        <Card className="mt-2">
          <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff' }}>
            Add Project Details
          </Card.Header>
          <Card.Body>
            {errorMessage && (
              <div className="alert alert-danger mb-3">
                {errorMessage}
              </div>
            )}
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}> {/* Apply Scroll on Overflow */}
              <Form onSubmit={(e) => {
                e.preventDefault();
                handleSubmitClick(e);
              }}>
                <div className="row">
                  <div className="col-md-6">
                    {/* Project Name */}
                    <Form.Group controlId="project_name_id">
                      <Form.Label>Project Name:</Form.Label>
                      <Form.Control
                        type="text"
                        value={selectedProject ? selectedProject : projectName}
                        readOnly
                      />
                    </Form.Group>

                    {/* rag */}
                    <Form.Group controlId="rag">
                      <Form.Label>RAG Status</Form.Label>
                      <Form.Control
                        as="select"
                        value={formData.rag}
                        onChange={(e) => setFormData({ ...formData, rag: e.target.value })}
                        onBlur={(e) => handleBlur('rag', e.target.value)}
                        className={formErrors.rag ? 'is-invalid' : ''}
                      >
                        <option value="">Select RAG Status</option>
                        <option
                          value="Green"
                          style={{
                            backgroundColor: hoveredOption === 'Green' ? '#28a745' : '',
                            color: hoveredOption === 'Green' ? 'white' : '',
                          }}
                          onMouseEnter={() => handleHover('Green')}
                          onMouseLeave={() => setHoveredOption('')}
                        >
                          Green
                        </option>
                        <option
                          value="Amber"
                          style={{
                            backgroundColor: hoveredOption === 'Amber' ? '#ffc107' : '',
                            color: hoveredOption === 'Amber' ? 'black' : '',
                          }}
                          onMouseEnter={() => handleHover('Amber')}
                          onMouseLeave={() => setHoveredOption('')}
                        >
                          Amber
                        </option>
                        <option
                          value="Red"
                          style={{
                            backgroundColor: hoveredOption === 'Red' ? '#dc3545' : '',
                            color: hoveredOption === 'Red' ? 'white' : '',
                          }}
                          onMouseEnter={() => handleHover('Red')}
                          onMouseLeave={() => setHoveredOption('')}
                        >
                          Red
                        </option>
                      </Form.Control>
                      {formErrors.rag && (
                        <div className="invalid-feedback">{formErrors.rag}</div>
                      )}
                    </Form.Group>

                    {/* rag Details */}
                    <Form.Group controlId="rag_details">
                      <Form.Label>RAG Details</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.rag_details}
                        onChange={(e) => setFormData({ ...formData, rag_details: e.target.value })}
                        onBlur={(e) => handleBlur('rag_details', e.target.value)}
                        className={formErrors.rag_details ? 'is-invalid' : ''}
                      />
                      {formErrors.rag_details && (
                        <div className="invalid-feedback">{formErrors.rag_details}</div>
                      )}
                    </Form.Group>

                    <Form.Group controlId="tester_count">
                      <Form.Label style={{ fontWeight: '' }}>Tester Count</Form.Label>
                      <Form.Control
                        type="number"
                        value={formData.tester_count}
                        readOnly
                        style={{ borderRadius: '5px', padding: '10px', backgroundColor: '#f8f9fa' }}
                      />
                      {errors.tester_count && <div style={{ color: 'red' }}>{errors.tester_count}</div>}
                    </Form.Group>

                    <Form.Group controlId="billing_type">
                      <Form.Label>Billing Type</Form.Label>
                      <Form.Control
                        as="select"
                        value={formData.billing_type}
                        onChange={(e) => setFormData({ ...formData, billing_type: e.target.value })}
                        onBlur={(e) => handleBlur('billing_type', e.target.value)}
                        className={formErrors.billing_type ? 'is-invalid' : ''}
                        required
                      >
                        <option value="">Select Billing Type</option>
                        <option value="T&M">T&M</option>
                        <option value="FIXED">FIXED</option>
                      </Form.Control>
                      {formErrors.billing_type && (
                        <div className="invalid-feedback">{formErrors.billing_type}</div>
                      )}
                    </Form.Group>

                    {/* Billable Testers Dropdown */}
                    
                    
                  </div>

                  <div className="col-md-6">
                    {/* Non-Billable Testers Dropdown */}

                    <Form.Group controlId="billable">
                      <Form.Label>Billable Testers</Form.Label>
                      <Dropdown>
                        <Dropdown.Toggle 
                          variant="success" 
                          id="dropdown-basic"
                          className={formErrors.billable ? 'is-invalid' : ''}
                          style={{
                            width: '100%',
                            padding: '8px',
                            textAlign: 'left',
                            backgroundColor: '#000d6b',
                            borderColor: formErrors.billable ? '#dc3545' : '#000d6b',
                            color: '#ffffff',
                            borderRadius: '5px'
                          }}
                          onBlur={() => handleBlur('billable', selectedTesters.billable)}
                        >
                          {selectedTesters.billable.length > 0
                            ? selectedTesters.billable.map(t => t.tester_name).join(', ')
                            : 'Select Testers'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {loadingTesters ? (
                            <Dropdown.ItemText>
                              <Spinner animation="border" size="sm" />
                              Loading...
                            </Dropdown.ItemText>
                          ) : (
                            getAvailableTesters('billable').map(tester => (
                              <Dropdown.Item
                                key={tester.id}
                                onClick={() => handleTesterSelection(tester, 'billable')}
                              >
                                {tester.tester_name}
                              </Dropdown.Item>
                            ))
                          )}
                          <Dropdown.Item onClick={() => { setSelectedTesterType('billable'); setShowCreateTesterModal(true); }}>
                            Add New Tester
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                      {formErrors.billable && (
                        <div className="text-danger mt-1 small">{formErrors.billable}</div>
                      )}
                    </Form.Group>

                    <Form.Group controlId="nonbillable">
                      <Form.Label>Non-Billable Testers</Form.Label>
                      <Dropdown>
                        <Dropdown.Toggle 
                          variant="secondary" 
                          id="dropdown-basic"
                          className={formErrors.nonbillable ? 'is-invalid' : ''}
                          style={{
                            width: '100%',
                            padding: '10px',
                            textAlign: 'left',
                            backgroundColor: '#000d6b', // Fixed string literal
                            borderColor: formErrors.nonbillable ? '#dc3545' : '#000d6b'
                          }}
                          onBlur={() => handleBlur('nonbillable', selectedTesters.nonbillable)}
                        >
                          {selectedTesters.nonbillable.length > 0
                            ? selectedTesters.nonbillable.map(t => t.tester_name).join(', ')
                            : 'Select Testers'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {loadingTesters ? (
                            <Dropdown.ItemText>
                              <Spinner animation="border" size="sm" />
                              Loading...
                            </Dropdown.ItemText>
                          ) : (
                            getAvailableTesters('nonbillable').map(tester => (
                              <Dropdown.Item
                                key={tester.id}
                                onClick={() => handleTesterSelection(tester, 'nonbillable')}
                              >
                                {tester.tester_name}
                              </Dropdown.Item>
                            ))
                          )}
                          <Dropdown.Item onClick={() => { setSelectedTesterType('nonbillable'); setShowCreateTesterModal(true); }}>
                            Add New Tester
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                      {formErrors.nonbillable && (
                        <div className="text-danger mt-1 small">{formErrors.nonbillable}</div>
                      )}
                    </Form.Group>

                    {/* Billing Type Dropdown */}
                    

                    {/* Automation Used Section */}
                    <Form.Group controlId="Automation">
                      <Form.Label>Automation Used *</Form.Label>
                      <div>
                        <Form.Check
                          type="radio"
                          label="Yes"
                          value="Yes"
                          name="automation"
                          checked={formData.automation === 'Yes'}
                          onChange={(e) => {
                            setFormData({ 
                              ...formData, 
                              automation: e.target.value,
                              automation_details: '' // Reset details when switching to Yes
                            });
                          }}
                          required
                        />
                        <Form.Check
                          type="radio"
                          label="No"
                          value="No"
                          name="automation"
                          checked={formData.automation === 'No'}
                          onChange={(e) => {
                            setFormData({ 
                              ...formData, 
                              automation: e.target.value,
                              automation_details: "No Automation is used here" // Clear details when No is selected
                            });
                          }}
                          required
                        />
                      </div>
                      {formErrors.automation && (
                        <div className="text-danger">{formErrors.automation}</div>
                      )}
                      {formData.automation === 'Yes' && (
                        <div>
                          <Button
                            variant="secondary"
                            onClick={() => setFormData({ ...formData, automation_details: "Selenium" })}
                            style={{ marginRight: '10px' }}
                          >
                            Selenium
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => setFormData({ ...formData, automation_details: "Pytest" })}
                          >
                            Pytest
                          </Button>
                          <Form.Group controlId="automationDetails" style={{ marginTop: '10px' }}>
                            <Form.Label>Automation Tool</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              value={formData.automation_details}
                              onChange={(e) => setFormData({ ...formData, automation_details: e.target.value })}
                              placeholder="Details about the selected automation tool"
                            />
                          </Form.Group>
                        </div>
                      )}
                    </Form.Group>
                    <Form.Group controlId="agile_type">

                      <Form.Label>Project Type</Form.Label>
                      <Form.Control
                        as="select"
                        value={formData.agile_type}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          setFormData({ ...formData, agile_type: selectedValue });

                          // Set the session storage based on the selected value
                          sessionStorage.setItem('agileType', selectedValue === 'Agile' ? 'true' : 'false');
                        }}
                        onBlur={(e) => handleBlur('agile_type', e.target.value)}
                        className={formErrors.agile_type ? 'is-invalid' : ''}
                        required
                      >
                        <option value="">Select Project Type</option>
                        <option value="Agile">Agile</option>
                        <option value="Non-Agile">Non-Agile</option>
                      </Form.Control>
                      {formErrors.agile_type && (
                        <div className="invalid-feedback">{formErrors.agile_type}</div>
                      )}
                    </Form.Group>


                    {/* AI Used Section */}
                    <Form.Group controlId="AI">
                      <Form.Label>AI Used *</Form.Label>
                      <div>
                        <Form.Check
                          type="radio"
                          label="Yes"
                          value="Yes"
                          name="ai_used"
                          checked={formData.ai_used === 'Yes'}
                          onChange={(e) => {
                            setFormData({ 
                              ...formData, 
                              ai_used: e.target.value,
                              ai_used_details: '' // Reset details when switching to Yes
                            });
                          }}
                          required
                        />
                        <Form.Check
                          type="radio"
                          label="No"
                          value="No"
                          name="ai_used"
                          checked={formData.ai_used === 'No'}
                          onChange={(e) => {
                            setFormData({ 
                              ...formData, 
                              ai_used: e.target.value,
                              ai_used_details: "No ai is used here" // Clear details when No is selected
                            });
                          }}
                          required
                        />
                      </div>
                      {formErrors.ai_used && (
                        <div className="text-danger">{formErrors.ai_used}</div>
                      )}
                      {formData.ai_used === 'Yes' && (
                        <div>
                          <Button
                            variant="secondary"
                            onClick={() => setFormData({ ...formData, ai_used_details: "TensorFlow" })}
                            style={{ marginRight: '10px' }}
                          >
                            TensorFlow
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => setFormData({ ...formData, ai_used_details: "PyTorch" })}
                          >
                            PyTorch
                          </Button>
                          <Form.Group controlId="aiUsedDetails" style={{ marginTop: '10px' }}>
                            <Form.Label>AI Tool</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              value={formData.ai_used_details}
                              onChange={(e) => setFormData({ ...formData, ai_used_details: e.target.value })}
                              placeholder="Details about the selected AI tool"
                            />
                          </Form.Group>
                          
                          
                        </div>
                      )}
                    </Form.Group>
                  </div>
                </div>
                {/* Submit Button */}
                <Button 
                  variant="primary" 
                  type="submit"
                  style={{ 
                    fontWeight: 'bold', 
                    color: '#ffffff', 
                    backgroundColor: '#000d6b', 
                    borderColor: '#000d6b' 
                  }}
                >
                  Submit
                </Button>



              </Form>
            </div> {/* End of scrollable wrapper */}
          </Card.Body>
        </Card>
      )}

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Confirm Project Details</h3>
            <p>Are you sure you want to proceed with the project "{selectedProject || projectName}"?</p>
            <div className="popup-buttons">
              <Button 
                onClick={handleProjectDetailsSubmit}
                disabled={isPending}
                style={{ marginRight: '10px' }}
              >
                {isPending ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Submitting...
                  </>
                ) : (
                  'Yes, Proceed'
                )}
              </Button>
              <Button 
                onClick={handlePopupCancel}
                disabled={isPending}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
            {errorMessage && (
              <div className="alert alert-danger mt-3">
                {errorMessage}
              </div>
            )}
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

      {/* Modal for creating tester */}
      <Modal show={showCreateTesterModal} onHide={() => setShowCreateTesterModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Tester</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateTester(e.target.testerName.value, selectedTesterType);
            }}
          >
            <Form.Group controlId="testerName">
              <Form.Label>Tester Name:</Form.Label>
              <Form.Control
                type="text"
                name="testerName"
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">Create Tester</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};


