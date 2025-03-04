// MY CODE 

import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Dropdown, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
 
const MetricsForm = () => {
  const [formData, setFormData] = useState({
    defectleakage: { cpDefect: '', uatDefect: '' },
    defectdensity: { cpDefects: '', totalLinesOfCode: '' },
    defectremovalefficiency: { cpDefects: '', uatDefects: '' },
    automationcoverage: { totalAutomationTcExecuted: '', totalTestCases: '' },
    testcasesefficiency: { defectsDetectedByTestCase: '', totalDefects: '' },
    testerproductivity: { numberOfTestCasesExecuted: '', numberOfTesters: '' },
    defectseverityindex: { critical: '', high: '', medium: '', low: '' },
    defectfixrate: { defectFixed: '', defectReportedLevels: '' },
    defectrejectionratio: { totalRejectedDefects: '', totalDefectsReported: '' },
    meantimetofinddefect: { totalTimeToIdentifyDefects: '', totalNumberOfDefects: '' },
    meantimetorepair: { totalTimeToFixDefects: '', totalDefectsFixed: '' },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for the modal visibility
  const [projectDetails, setProjectDetails] = useState(null); // To store the selected project details
  const [selectedProjectId, setSelectedProjectId] = useState(null); // To store the selected project ID
  const navigate = useNavigate();



  const [projectName, setProjectName] = useState(''); // Store project name from sessionStorage





  const [errors, setErrors] = useState({});




  // Fetch the list of projects from the backend
  const fetchPendingProjects = async () => {
    try {
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) {
        setApiError('No access token found. Please login.');
        return;
      }

      const response = await axios.get(' https://frt4cnbr-5000.inc1.devtunnels.ms/project-details', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200 && response.data.project_details) {
        setProjects(response.data.project_details);
      } else {
        setApiError('Failed to fetch projects.');
      }
    } catch (error) {
      setApiError('Error fetching projects.');
    }
  };

  // Call fetchPendingProjects on mount
  useEffect(() => {
    fetchPendingProjects();

    // Retrieve the selected project name from sessionStorage
    const projectNameFromSession = sessionStorage.getItem('selectedProject');
    if (projectNameFromSession) {
      setProjectName(projectNameFromSession); // Set the project name from session
      setFormData(prevState => ({
        ...prevState,
      }));
          }


    // Retrieve the form data from sessionStorage
    const savedFormData = sessionStorage.getItem('formData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));  // Set the state with stored form data
    }


  }, []);


const handleChange = (e, section, field) => {
  const value = e.target.value;
  const parsedValue = value === '' ? '' : parseInt(value, 10);

  // Update form data
  const updatedFormData = {
    ...formData,
    [section]: {
      ...formData[section],
      [field]: parsedValue,
    },
  };

  // Save updated form data to sessionStorage
  sessionStorage.setItem('formData', JSON.stringify(updatedFormData));

  setFormData(updatedFormData);
};

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    // Create an object to store validation errors
    let validationErrors = {};
  
    // Iterate through the form data and validate each field
    Object.keys(formData).forEach(section => {
      Object.keys(formData[section]).forEach(field => {
        const value = formData[section][field];
        const error = validateField(field, value);
  
        if (error) {
          validationErrors[`${section}.${field}`] = error; // Store errors by section and field
        }
      });
    });
  
    // If there are any validation errors, stop the form submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      alert("Please fill out all the required fields correctly.");
      return; // Prevent form submission
    }
  
    // Proceed with form submission if no validation errors
    if (!projectName) {
      alert("Please select a project.");
      return;
    }
  
    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const date = currentDate.toISOString().split('T')[0];
  
    const dataToSubmit = {
      month: month,
      date: date,
      project_name: projectName,
      defectleakage: formData.defectleakage,
      defectdensity: formData.defectdensity,
      defectremovalefficiency: formData.defectremovalefficiency,
      automationcoverage: formData.automationcoverage,
      testcasesefficiency: formData.testcasesefficiency,
      testerproductivity: formData.testerproductivity,
      defectseverityindex: formData.defectseverityindex,
      defectfixrate: formData.defectfixrate,
      defectrejectionratio: formData.defectrejectionratio,
      meantimetofinddefect: formData.meantimetofinddefect,
      meantimetorepair: formData.meantimetorepair,
    };
  
    const accessToken = sessionStorage.getItem('access_token');
    if (!accessToken) {
      alert("No access token found. Please login.");
      return;
    }
  
    try {
      const response = await fetch(' https://frt4cnbr-5000.inc1.devtunnels.ms/create-matrix-inputs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(dataToSubmit),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit the form');
      }
  
      const responseData = await response.json();
      console.log('Form Submitted Successfully:', responseData);
  
      // Clear session and sessionStorage data after completing the form
      sessionStorage.removeItem('projectName');
      sessionStorage.removeItem('formData');
  
      navigate('/TestLead/project-info');
      alert('Form Submitted Successfully');
    } catch (error) {
      console.error('Error:', error);
      setApiError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleViewProject = async () => {
    if (!selectedProjectId) {
      alert("Please select a project.");
      return;
    }

    try {
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) {
        setApiError('No access token found. Please login.');
        return;
      }

      const response = await axios.get(` https://frt4cnbr-5000.inc1.devtunnels.ms/get-matrix-inputs/${selectedProjectId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("projectDetails", projectDetails);  // Check the structure of projectDetails


      if (response.status === 200) {
        setProjectDetails(response.data);  // Set the project details in the modal
        setShowModal(true); // Show the modal with the project details
      } else {
        setApiError('Failed to fetch project details.');
      }
    } catch (error) {
      setApiError('Error fetching project details.');
    }
  };



  const validateField = (name, value) => {
    let error = '';
  
    // Check if the field is empty
    if (!value || value === '') {
      error = `${name} is required.`; // Show error if field is empty
    }
  
    // Example: If the field is "totalLinesOfCode", check if it is a valid number
    if (name === 'totalLinesOfCode' && value && isNaN(value)) {
      error = 'Total Lines of Code must be a valid number.';
    }
  
    // You can add more field-specific validation rules here if needed
  
    return error;
  };
  
  
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
  
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error, // Set the error message for the specific field
    }));
  };
  

  return (
    <div className="container mt-4"
    >
      <Card>
        <Card.Header
          as="h5"
          style={{
            backgroundColor: '#000d6b',
            color: '#ffffff',
            borderRadius: '10px 10px 0 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            // padding: '10px 20px',
          }}
        >
          Manage Metrics
          <Button
            variant="outline-light"
            style={{
              marginLeft: 'auto',
              backgroundColor: 'transparent',
              borderColor: '#ffffff',
            }}
            onClick={() => setShowModal(true)} // Show the modal when the button is clicked
          >
            View Project
          </Button>
        </Card.Header>

        <Card.Body style={{ backgroundColor: '#ffffff', padding: '30px', maxHeight: '600px', overflowY: 'auto' }}>
          <Form onSubmit={handleSubmit}>

            {/* Auto-select project name from sessionStorage and disable it */}
            <Form.Group controlId="project_name_id">
            <Form.Label
                style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#555',
                  marginBottom: '8px',
                }}

              >Selected Project</Form.Label>
              
              <Form.Control
                type="text"
                value={sessionStorage.getItem('selectedProject') || projectName} // Retrieve from sessionStorage if available
                onChange={handleChange}
               
                readOnly // Make the input read-only
              />

              
            </Form.Group>
            

            {/* Display Form Fields for each metric with a more consistent layout */}
            {Object.keys(formData).map((key) => {
              const sectionData = formData[key];
              return (
                <div key={key} className="mb-4"

                  style={{
                    color: '#333',
                    padding: '15px 20px',
                    maxHeight: '600px',
                    overflowY: 'auto',
                    position: 'relative',
                  }}>
                  <div
                    style={{
                      backgroundColor: '#f3f4f6',
                      color: '#333',
                      padding: '15px 20px',
                      borderRadius: '10px 10px 0 0',
                      maxHeight: '600px', overflowY: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  >

                    <h5
                      style={{
                        fontWeight: 'bold',
                        fontSize: '1.25rem',
                        textTransform: 'capitalize',
                        letterSpacing: '1px',
                        color: '#000d6b',
                      }}

                    >{key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                    </h5>
                  </div>


                  <div
                    style={{
                      padding: '20px',
                      borderRadius: '0 0 10px 10px',
                      backgroundColor: '#fff',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Row>
                      {Object.keys(sectionData).map((field) => (
                        <Col md={4} key={`${key}-${field}`} className="mb-4">
                          <Form.Group>
                            <Form.Label
                              style={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                color: '#555',
                                marginBottom: '8px',
                              }}
                            >{field.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}</Form.Label>
                            <Form.Control
                              type="number"
                              name={field}
                              value={sectionData[field]}
                              onChange={(e) => handleChange(e, key, field)}
                              onBlur={handleBlur} // Apply validation on blur
              isInvalid={errors[field]} // Show validation error for this field
                              required
                              min={field === 'totalLinesOfCode' ? 1000 : undefined} // Apply min only for 'totalLinesOfCode'
                              style={{
                                padding: '10px',
                                fontSize: '1rem',
                                borderRadius: '8px',
                                borderColor: '#ccc',
                                transition: 'all 0.3s ease',
                              }}
                              onFocus={(e) => (e.target.style.borderColor = '#000d6b')}
                            
                            />

                            <Form.Control.Feedback type="invalid">
                              {errors[field]} {/* Display error message for the field */}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </div>
              );
            })}

            {/* Submit Button */}
            <div className="text-center">
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: '#000d6b',
                  borderColor: '#000d6b',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  padding: '12px 24px',
                  fontSize: '18px',
                  borderRadius: '8px',
                  transition: 'background-color 0.3s, border-color 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#4a6ec1';
                  e.target.style.borderColor = '#4a6ec1';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#000d6b';
                  e.target.style.borderColor = '#000d6b';
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
              <br />
              <br />
            </div>
          </Form>
        </Card.Body>
      </Card>

      {apiError && (
        <div className="alert alert-danger mt-3">
          <strong>Error!</strong> {apiError}
        </div>
      )}

      {/* Modal for selecting and viewing project details */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>View Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Dropdown for selecting the project */}
          <Form.Group className="mb-4">
            <Form.Label>Select a Project</Form.Label>
            <Dropdown
              onSelect={(selectedKey) => {
                const selectedProject = projects.find((project) => project.project_name === selectedKey);
                setSelectedProject(selectedProject);
                setSelectedProjectId(selectedProject ? selectedProject.id : null);
              }}
            >
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {selectedProject ? selectedProject.project_name : 'Select a Project'}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <Dropdown.Item key={project.project_name} eventKey={project.project_name}>
                      {project.project_name}
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item disabled>No projects available</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>

          {/* Button to fetch project details */}
          <div className="text-center">
            <Button variant="primary" onClick={handleViewProject} disabled={!selectedProjectId}>
              View
            </Button>
          </div>

          {/* Display project details if available */}
          {projectDetails && projectDetails.length > 0 ? (
            <div>
              <h5>Project Metrics</h5>
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Defect Leakage</td>
                    <td>{projectDetails[0].defectleakage != null ? projectDetails[0].defectleakage.toFixed(2) : 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>Defect Density</td>
                    <td>{projectDetails[0].defectdensity != null ? projectDetails[0].defectdensity.toFixed(2) : 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>Defect Fix Rate</td>
                    <td>{projectDetails[0].defectfixrate != null ? projectDetails[0].defectfixrate.toFixed(2) : 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>Defect Rejection Ratio</td>
                    <td>{projectDetails[0].defectrejectionratio != null ? projectDetails[0].defectrejectionratio.toFixed(2) : 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>Defect Removal Efficiency</td>
                    <td>{projectDetails[0].defectremovalefficiency != null ? projectDetails[0].defectremovalefficiency.toFixed(2) : 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>Defect Severity Index</td>
                    <td>{projectDetails[0].defectseverityindex != null ? projectDetails[0].defectseverityindex.toFixed(2) : 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>Mean Time to Find Defect</td>
                    <td>{projectDetails[0].meantimetofinddefect != null ? projectDetails[0].meantimetofinddefect.toFixed(2) : 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>Mean Time to Repair</td>
                    <td>{projectDetails[0].meantimetorepair != null ? projectDetails[0].meantimetorepair.toFixed(2) : 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>Automation Coverage</td>
                    <td>{projectDetails[0].automationcoverage != null ? projectDetails[0].automationcoverage.toFixed(2) : 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>Test Cases Efficiency</td>
                    <td>{projectDetails[0].testcasesefficiency != null ? projectDetails[0].testcasesefficiency.toFixed(2) : 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>Tester Productivity</td>
                    <td>{projectDetails[0].testerproductivity != null ? projectDetails[0].testerproductivity.toFixed(2) : 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>Month</td>
                    <td>{projectDetails[0].month || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>Date</td>
                    <td>{projectDetails[0].date ? new Date(projectDetails[0].date).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p>Loading project details...</p>
          )}

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>





    </div>
  );
};

export default MetricsForm;
