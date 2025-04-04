import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Modal, Dropdown, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate


// SVG Imports
import addproject from "../panel/assets/addproject.svg";
import ProjectTable from './ProjectInfo';
// css

import "./AddProject.css"

const AdminAddProjectWithDetails = ({ projectNameProp }) => {
  const [projectName, setProjectName] = useState(projectNameProp);
  const [confirmProjectName, setConfirmProjectName] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showCreateDetails, setShowCreateDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // State for the confirmation popup
  const [errorMessage, setErrorMessage] = useState("");



  const navigate = useNavigate(); // Initialize useNavigate hook
  const [formData, setFormData] = useState({
    projectName: '',
    rag: '',
    tester_count: 0, // Initialize with 0
    billable: [],
    nonbillable: [],
    billing_type: '',
    rag_details: '',
    automation: false,
    ai_used: false,
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
    // Check if the project is already created (from sessionStorage)
    const isProjectCreatedFlag = sessionStorage.getItem('isProjectCreated');
    if (isProjectCreatedFlag === 'true') {
      setShowCreateDetails(true); // Navigate to the "Add Project Details" form
    } else {
      setShowCreateDetails(false); // Stay on the "Add Project" form
    }

    // Load the saved form data from sessionStorage (if any)
    const savedFormData = sessionStorage.getItem('formData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData)); // Set the form data to saved state
    }
    // If showCreateDetails is true, set the flag in sessionStorage
    if (showCreateDetails) {
      sessionStorage.setItem('isProjectCreated', 'true');
    }
  }, [showCreateDetails]); // Run only on initial render (mount) or page refresh


  // Step 1: Load the form data from sessionStorage when the component mounts
  useEffect(() => {
    const savedFormData = sessionStorage.getItem('formData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []); // Empty array to run this effect only on mount

  // Step 2: Save form data to sessionStorage whenever formData changes
  useEffect(() => {
    if (formData) {
      sessionStorage.setItem('formData', JSON.stringify(formData));
    }
  }, [formData]); // This effect runs every time formData changes



  const fetchTesters = async () => {
    setLoadingTesters(true);
    try {
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) {
        setError('No access token found. Please login.');
        return;
      }

      const response = await fetch('https://h25ggll0-5000.inc1.devtunnels.ms/tester-billable', {
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
      : [...selectedTesters[type], { ...tester, project_name: projectName }];

    const updatedSelectedTesters = { ...selectedTesters, [type]: updatedList };

    setSelectedTesters(updatedSelectedTesters);
    updateTesterCount(updatedSelectedTesters);
  };

  const handleCreateTester = async (testerName, type) => {
    const newTester = {
      tester_name: testerName,
      project_name: projectName,
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

  const handleProjectSubmit = async (e) => {
    e.preventDefault();

    if (projectName !== confirmProjectName) {
      setError('Project names do not match.');
      return;
    }

    try {
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) throw new Error('User is not authenticated');

      setIsPending(true);

      const requestBody = {
        project_name: projectName,
      };

      const response = await fetch('https://h25ggll0-5000.inc1.devtunnels.ms/create-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error('Project creation failed');

      const projectDataResponse = await response.json();
      // setSuccessMessage('Project created successfully!');

      // Save the state in sessionStorage to indicate the project is created
      // sessionStorage.setItem('isProjectCreated', 'true');
      // setShowCreateDetails(true);


    } catch (error) {
      setError('Error creating project: ' + error.message);
    } finally {
      setIsPending(false);
      setShowPopup(false); // Close the popup after submitting
    }
  };


  // Handle Submit (Trigger Popup)
  const handleSubmitClick = (e) => {
    e.preventDefault(); // Prevent form submission immediately
    setShowPopup(true); // Show the confirmation popup
  };


  const handlePopupCancel = () => {
    setShowPopup(false); // Close the popup without submitting
  };


  const handleProjectDetailsSubmit = async (e) => {
    e.preventDefault();

    // Step 1: Project Submission Logic (Integrated from handleProjectSubmit)
    if (!formData.projectName || formData.projectName.trim() === '') {
      setError('Project name is required');
      return;
    }
    console.log("Projectname: ", formData.projectName)

    try {
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) throw new Error('User is not authenticated');

      setIsPending(true);

      // Create the project first
      const requestBody = {
        project_name: formData.projectName,

      };
      console.log("project_name after request:", requestBody)

      const response = await fetch('https://h25ggll0-5000.inc1.devtunnels.ms/create-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });


      if (!response.ok) throw new Error('Project creation failed');

      const projectDataResponse = await response.json();
      // Set success message or any additional logic after successful project creation
      // setSuccessMessage('Project created successfully!');

      // Save the state in sessionStorage to indicate the project is created
      sessionStorage.setItem('isProjectCreated', 'true');
      setShowCreateDetails(true);

      // Step 2: Create Testers (Making the API call to create testers)
      const testersToSubmit = [
        ...selectedTesters.billable.map(tester => ({
          tester_name: tester.tester_name,
          project_name: formData.projectName,
          billable: true,
        })),
        ...selectedTesters.nonbillable.map(tester => ({
          tester_name: tester.tester_name,
          project_name: formData.projectName,
          billable: false,
        })),
      ];

      const createTestersResponse = await fetch('https://h25ggll0-5000.inc1.devtunnels.ms/tester-billable', {
        // const createTestersResponse = await fetch('https://h25ggll0-5000.inc1.devtunnels.ms/tester-billable', {
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


      // Step 3: Project Details Submission Logic
      const projectDetailsPayload = {
        project_name: formData.projectName,
        rag: formData.rag,
        tester_count: formData.tester_count,
        testers: testersToSubmit,
        billing_type: formData.billing_type,
        rag_details: formData.rag_details,
        automation_details: formData.automation === 'Yes' ? formData.automation_details : '',
        ai_used_details: formData.ai_used === 'Yes' ? formData.ai_used_details : '',
      };

      // Validation: Check if all required fields are filled
      const requiredFields = [
        formData.rag,
        formData.rag_details,
        formData.billing_type,
        formData.automation,
        formData.ai_used,
        selectedTesters.billable.length > 0, // Ensure at least one billable tester is selected
        selectedTesters.nonbillable.length > 0, // Ensure at least one non-billable tester is selected
      ];

      // Check if any required field is missing or empty
      const allFieldsValid = requiredFields.every(field => field !== "" && field !== undefined && field !== null);

      if (!allFieldsValid) {
        setErrorMessage("Please fill in all required fields.");
        return; // Stop the form submission if validation fails
      }

      const response2 = await fetch('https://h25ggll0-5000.inc1.devtunnels.ms/create-project-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(projectDetailsPayload),
      });

      if (!response2.ok) throw new Error('Project details creation failed');

      const projectDetailsResponse = await response2.json();
      // setSuccessMessage('Project details created successfully!');

      // Clear session data after completing the form
      sessionStorage.removeItem('isProjectCreated');
      sessionStorage.removeItem('formData');

    } catch (error) {
      setError('Error creating project details: ' + error.message);
    } finally {
      setIsPending(false);
    }

    // Hide the form and popup after successful submission
    setShowCreateDetails(false);
    setShowPopup(false);

    // Navigate after successful submission
    navigate('/AdminPanel/project-info'); // Navigate to the project info page

    // setTimeout(() => {
    //   navigate('/AdminPanel/project-info'); // Navigate after 2 seconds
    // }, 2000);
  };


  const getAvailableTesters = (type) => {
    return testers.filter(tester =>
      !selectedTesters.billable.some(selectedTester => selectedTester.tester_name === tester.tester_name) &&
      !selectedTesters.nonbillable.some(selectedTester => selectedTester.tester_name === tester.tester_name)
    );
  };

  return (
    <div className="container mt-5">

      {/* Display SVG Icon or Form */}
      {!showForm && (
        <div onClick={handleIconClick} style={{ cursor: 'pointer' }}>
          <img src={addproject} alt="addproject" style={{ width: '189px', height: '189px' }} />
          <p>Click to add project details</p>
        </div>

      )}


      {/* Create Project Details Form */}
      {showForm && (
        <Card className="mt-4 shadow-lg">
          <Card.Header as="h4" style={{ backgroundColor: '#000d6b', color: '#ffffff', borderRadius: '10px 10px 0 0', padding: '15px' }}>
            Add Project Details
          </Card.Header>
          <Card.Body>
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {/* Apply Grid Layout for Left and Right Sections */}
              <Form onSubmit={handleProjectDetailsSubmit}>
                <div className="row">
                  {/* Left Section */}
                  <div className="col-md-6">
                    <Form.Group controlId="projectName">
                      <Form.Label style={{ fontWeight: 'bold' }}>Project Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.projectName}
                        onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                        required
                        style={{ borderRadius: '5px', border: '1px solid #ced4da', padding: '10px' }}
                      />
                    </Form.Group>

                    <Form.Group controlId="rag">
                      <Form.Label style={{ fontWeight: 'bold' }}>rag</Form.Label>
                      <Form.Select
                        value={formData.rag}
                        onChange={(e) => setFormData({ ...formData, rag: e.target.value })}
                        required
                        style={{ borderRadius: '5px', padding: '10px' }}
                      >
                        <option value="" >Select rag</option>
                        <option value="Red" >Red</option>

                        <option value="Amber">Amber</option>
                        <option value="Green">Green</option>

                      </Form.Select>
                    </Form.Group>

                    <Form.Group controlId="rag_details">
                      <Form.Label style={{ fontWeight: 'bold' }}>rag Details</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.rag_details}
                        onChange={(e) => setFormData({ ...formData, rag_details: e.target.value })}
                        required
                        style={{ borderRadius: '5px', border: '1px solid #ced4da', padding: '10px' }}
                      />
                    </Form.Group>

                    <Form.Group controlId="billing_type">
                      <Form.Label style={{ fontWeight: 'bold' }}>Billing Type</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.billing_type}
                        onChange={(e) => setFormData({ ...formData, billing_type: e.target.value })}
                        required
                        style={{ borderRadius: '5px', padding: '10px' }}
                      />
                    </Form.Group>

                    <Form.Group controlId="tester_count">
                      <Form.Label style={{ fontWeight: 'bold' }}>Tester Count</Form.Label>
                      <Form.Control
                        type="number"
                        value={formData.tester_count}
                        readOnly
                        style={{ borderRadius: '5px', padding: '10px', backgroundColor: '#f8f9fa' }}
                      />
                    </Form.Group>
                  </div>

                  {/* Right Section */}
                  <div className="col-md-6">
                    {/* Billable Testers Dropdown */}
                    <Form.Group controlId="billable">
                      <Form.Label style={{ fontWeight: 'bold' }}>Billable Testers</Form.Label>
                      <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic" style={{
                          width: '100%',
                          padding: '8px',
                          textAlign: 'left',
                          backgroundColor: '#000d6b',  // Apply the color to the dropdown button
                          borderColor: '#000d6b',  // Matching border color
                          color: '#ffffff',  // Ensure text is white for contrast
                          borderRadius: '5px'
                        }}>
                          {selectedTesters.billable.length > 0
                            ? selectedTesters.billable.map((t) => t.tester_name).join(', ')
                            : 'Select Billable Testers'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {loadingTesters ? (
                            <Dropdown.ItemText>
                              <Spinner animation="border" size="sm" />
                              Loading...
                            </Dropdown.ItemText>
                          ) : (
                            getAvailableTesters('billable').map((tester) => (
                              <Dropdown.Item
                                key={tester.id}
                                onClick={() => handleTesterSelection(tester, 'billable')}
                              >
                                {tester.tester_name}
                              </Dropdown.Item>
                            ))
                          )}
                          <Dropdown.Item
                            onClick={() => {
                              setSelectedTesterType('billable');
                              setShowCreateTesterModal(true);
                            }}
                          >
                            Add New Tester
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>

                    {/* Non-Billable Testers Dropdown */}
                    <Form.Group controlId="nonbillable">
                      <Form.Label style={{ fontWeight: 'bold' }}>Non-Billable Testers</Form.Label>
                      <Dropdown>
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic" style={{ width: '100%', padding: '10px', textAlign: 'left', backgroundColor: "000d6b" }}>
                          {selectedTesters.nonbillable.length > 0
                            ? selectedTesters.nonbillable.map((t) => t.tester_name).join(', ')
                            : 'Select Non-Billable Testers'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {loadingTesters ? (
                            <Dropdown.ItemText>
                              <Spinner animation="border" size="sm" />
                              Loading...
                            </Dropdown.ItemText>
                          ) : (
                            getAvailableTesters('nonbillable').map((tester) => (
                              <Dropdown.Item
                                key={tester.id}
                                onClick={() => handleTesterSelection(tester, 'nonbillable')}
                              >
                                {tester.tester_name}
                              </Dropdown.Item>
                            ))
                          )}
                          <Dropdown.Item
                            onClick={() => {
                              setSelectedTesterType('nonbillable');
                              setShowCreateTesterModal(true);
                            }}
                          >
                            Add New Tester
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>
                    <br></br>

                    {/* Automation Used Section */}
                    <Form.Group controlId="Automation">
                      <Form.Label style={{ fontWeight: 'bold' }}>Automation Used</Form.Label>
                      <div>
                        <Form.Check
                          type="radio"
                          label="Yes"
                          value="Yes"
                          checked={formData.automation === 'Yes'}
                          onChange={(e) => setFormData({ ...formData, automation: e.target.value })}
                        />
                        <Form.Check
                          type="radio"
                          label="No"
                          value="No"
                          checked={formData.automation === 'No'}
                          onChange={(e) => setFormData({ ...formData, automation: e.target.value })}
                        />
                      </div>
                      {formData.automation === 'Yes' && (
                        <Form.Group controlId="automationDetails">
                          <Form.Label style={{ fontWeight: 'bold' }}>Automation Details</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={formData.automation_details}
                            onChange={(e) => setFormData({ ...formData, automation_details: e.target.value })}
                            style={{ borderRadius: '5px', padding: '10px' }}
                          />
                        </Form.Group>
                      )}
                    </Form.Group>
                    <br></br>

                    {/* AI Used Section */}
                    <Form.Group controlId="AI">
                      <Form.Label style={{ fontWeight: 'bold' }}>AI Used</Form.Label>
                      <div>
                        <Form.Check
                          type="radio"
                          label="Yes"
                          value="Yes"
                          checked={formData.ai_used === 'Yes'}
                          onChange={(e) => setFormData({ ...formData, ai_used: e.target.value })}
                        />
                        <Form.Check
                          type="radio"
                          label="No"
                          value="No"
                          checked={formData.ai_used === 'No'}
                          onChange={(e) => setFormData({ ...formData, ai_used: e.target.value })}
                        />
                      </div>
                      {formData.ai_used === 'Yes' && (
                        <Form.Group controlId="aiUsedDetails">
                          <Form.Label style={{ fontWeight: 'bold' }}>AI Used Details</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={formData.ai_used_details}
                            onChange={(e) => setFormData({ ...formData, ai_used_details: e.target.value })}
                            style={{ borderRadius: '5px', padding: '10px' }}
                          />
                        </Form.Group>
                      )}
                    </Form.Group>
                  </div>
                </div>

                <br />

                {/* Submit Button */}
                <Button
                  variant="primary"
                  type="submit"
                  style={{
                    fontWeight: 'bold',
                    color: '#ffffff',
                    backgroundColor: '#000d6b',
                    borderColor: '#0056b3',
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#004085'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#0056b3'}
                >
                  Submit
                </Button>
              </Form>
            </div>
          </Card.Body>
        </Card>

      )}


      {/* Confirmation Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Confirm Project Details</h3>
            <p>Are you sure you want to proceed with the project "{projectName}"?</p>
            <button onClick={handleProjectDetailsSubmit} >Yes, Proceed</button>
            <button onClick={handlePopupCancel}>Cancel</button>

            {/* Display Success Message in the Popup */}
            {successMessage && <div style={{ color: 'green', marginTop: '10px' }}>{successMessage}</div>}
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

export default AdminAddProjectWithDetails;




