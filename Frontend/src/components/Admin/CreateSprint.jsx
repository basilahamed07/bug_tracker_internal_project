// working code below

import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const CreateSprint = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stories, setStories] = useState([{ storyName: '', name: '', storyPoint: '', status: '', completion: '', type: '', tester_id: ''}]);
  const [testers, setTesters] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [error, setError] = useState(null);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [screamId, setScreamId] = useState(null);  // Added screamId state
  const navigate = useNavigate();
  const projectId = sessionStorage.getItem('projectId');
  const [userId, setUserId] = useState(null);
  const [sprintName, setSprintName] = useState('');  // State for sprint name input
  const [userRole, setUserRole] = useState(null);
  const [piName, setPiName] = useState(''); // Add new state for PI name

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = sessionStorage.getItem('access_token');
        const response = await fetch('https://frt4cnbr-5000.inc1.devtunnels.ms/get-role', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch role');
        }

        const data = await response.json();
        setUserRole(data.role); // Assuming the role is in the 'role' field of the response
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserRole();
  }, []);
  useEffect(() => {
    if (projectId) {
      fetchTesters(projectId);
      fetchSprints();
      // Fetch sprint details by agile_id
      fetchSprintDetailsFromApi(projectId);
      getUserIdFromToken();
      const storedScreamId = sessionStorage.getItem('scrumId');  // Fetch screamId from session storage
      if (storedScreamId) {
        setScreamId(storedScreamId);
      }
      // Add PI name retrieval from session storage
      const storedPiName = sessionStorage.getItem('piName');
      if (storedPiName) {
        setPiName(storedPiName);
      }
    }
  }, [projectId]);


  const fetchSprintDetailsFromApi = async (agile_id) => {
    try {
      const accessToken = sessionStorage.getItem('access_token');
      const response = await axios.get(`https://frt4cnbr-5000.inc1.devtunnels.ms/sprint_details/${agile_id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });
      setSprints(response.data);  // Set the sprint details in state
      
    } catch (error) {
      console.error('Error fetching sprint details:', error);
    }
  };

  // Fetch testers from the API
  const fetchTesters = async (projectId) => {
    try {
      const accessToken = sessionStorage.getItem('access_token');
      const response = await axios.get(`https://frt4cnbr-5000.inc1.devtunnels.ms/tester_name_by_project/${projectId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }
      });
      setTesters(response.data);
      console.log("TESTER NAME ID : ", response.data[0].id)
      // settesterid(response.data[0].id)
    } catch (error) {
      console.error('Error fetching testers:', error);
    }
  };

  // Fetch all sprints from local storage
  const fetchSprints = () => {
    const storedSprints = JSON.parse(localStorage.getItem('sprints')) || [];
    setSprints(storedSprints);
  };
  const handleStoryChange = (index, e) => {
    const updatedStories = [...stories];
    updatedStories[index][e.target.name] = e.target.value;
  
    // If the field being updated is the tester select dropdown, map it to tester_id.
    if (e.target.name === "name") {
      updatedStories[index]["tester_id"] = e.target.value; // Store the tester_id here
    }
  
    setStories(updatedStories);
  };
  
  const getUserIdFromToken = () => {
    const accessToken = sessionStorage.getItem('access_token');
    if (accessToken) {
      const decoded = jwtDecode(accessToken);  // Decode the token
      const userId = decoded.user_id;  // Assuming 'user_id' is in the decoded token
      setUserId(userId); // Save user_id to state
      return userId;
    }
    return null; // If no token is found, return null
  };
  
  // Add a new story
  const handleAddStory = () => {
    setStories([...stories, { storyName: '', name: '', storyPoint: '', status: '', completion: '', type: '', tester_id: ''}]);
  };


  const handleSubmit = async () => {
    const story_committed = stories.length;
    const story_completed = stories.filter(story => story.status === 'Done').length;
    const story_points_committed = stories.reduce((acc, story) => acc + (parseInt(story.storyPoint) || 0), 0);
    const story_points_completed = story_committed; 

    const formattedStartDate = `${startDate}T00:00:00`;
    const formattedEndDate = `${endDate}T00:00:00`;

    const sprintDetails = {
      // sprint_id: selectedSprint.id,
      ...(editMode && { sprint_id: selectedSprint.id }),
      story_committed,
      story_completed,
      story_points_committed,
      story_points_completed,
      defect_open_critical: 0,  
      defect_open_high: 0,      
      defect_open_medium: 0,    
      defect_open_low: 0,       
      user_id: userId,
      project_name_id: projectId, 
      scream_id: screamId,
      pi_name: piName, // Add PI name to the payload
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      sprint_name: sprintName,
    };

    const newSprintDetails = {
      sprint_details: {
        ...sprintDetails,
        scream_id: screamId,
      },
      story_details: stories.map(story => ({
        id: story.id, // Make sure to include the ID for updating
        story_name: story.storyName,
        story_point: story.storyPoint,
        status: story.status,
        completed_percentage: story.completion,
        manual_or_automation: story.type || 'Manual', 
        tester_id: story.tester_id, // The tester name ID
      }))
    };


    try {
      const accessToken = sessionStorage.getItem('access_token');
      if (editMode) {
        // PUT request to update sprint
        const response = await axios.put('https://frt4cnbr-5000.inc1.devtunnels.ms/update_sprint_story_put', newSprintDetails, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          }
        });
        console.log('Sprint updated successfully:', response.data);
        setSprints(prevSprints => prevSprints.map(sprint => sprint.sprint_id === response.data.sprint_details.sprint_id ? response.data.sprint_details : sprint));
      } else {
        // POST request to create new sprint
        const response = await axios.post('https://frt4cnbr-5000.inc1.devtunnels.ms/update_sprint_story', newSprintDetails, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          }
        });
        console.log('Sprint created successfully:', response.data);
        setSprints(prevSprints => [...prevSprints, response.data.sprint_details]);
        
      }
      setShowModal(false);
      // window.location.reload()
    } catch (error) {
      console.error('Error submitting sprint:', error);
    }
  };

  const fetchSprintDetails = (index) => {
    setSelectedSprint(sprints[index]);
    setShowModal(true);
  };
  const handleDeleteSprint = async () => {
    const isconfirmed = window.confirm("Are you sure want to delete the sprint")
    if(!isconfirmed){
      return
    }
    try {
      // Get the sprint ID from the selected sprint object
      const sprintId = selectedSprint.id;
      console.log("selectedSprint : ", selectedSprint)
  
      // Make a DELETE request to the API to delete the sprint
      const accessToken = sessionStorage.getItem('access_token');
      const response = await axios.delete(`https://frt4cnbr-5000.inc1.devtunnels.ms/sprint_details/${sprintId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
  
      // If the API call is successful, remove the sprint from the local state
      if (response.status === 200) {
        const updatedSprints = sprints.filter(sprint => sprint.sprint_id !== sprintId);
        localStorage.setItem('sprints', JSON.stringify(updatedSprints));  // Update local storage as well
        setSprints(updatedSprints);
        setShowModal(false); // Close the modal after deletion
        console.log('Sprint deleted successfully:', response.data);
      }
      window.location.reload()
    } catch (error) {
      console.error('Error deleting sprint:', error);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if month < 10
    const day = date.getDate().toString().padStart(2, '0'); // Add leading zero if day < 10
    return `${year}-${month}-${day}`;
  };
  const handleEditSprint = () => {
    setEditMode(true);
  
    // Set form fields with the current sprint details
    setStories(selectedSprint.story_details.map(story => ({
      ...story,
      id: story.id,  // Ensure the ID is included for updating
      storyName: story.story_name,
      name: story.tester_id, // Make sure to set tester ID here
      storyPoint: story.story_point,
      status: story.status,
      completion: story.completed_percentage,
      type: story.manual_or_automation,
    })));
  
    // Set start and end dates
    setStartDate(formatDate(selectedSprint.start_date)); // Split to get the date part
    // console.log("startDate : ", selectedSprint.start_date)
    setEndDate(formatDate(selectedSprint.end_date)); // Split to get the date part
    setSprintName(selectedSprint.sprint_name); // Set sprint name as well
  
    // Close the modal once the details are pre-filled
    setShowModal(true);
    closeModal(true);
  };
  

  const closeModal = () => {
    setShowModal(false);
    };
  return (
    <div style={{ width: '60%', margin: 'auto' }}>
      <Card>
        <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Create Sprint
          {userRole === 'admin' &&<Button
            variant="outline-light"
            style={{ backgroundColor: 'transparent', borderColor: '#ffffff', color: '#ffffff' }}
            onClick={() => setShowModal(true)}
          >
            View Sprint
          </Button>}
        </Card.Header>

        <Card.Body>
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>

          <Form>
          <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Sprint Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={sprintName}
                    onChange={(e) => setSprintName(e.target.value)}
                    placeholder="Enter Sprint Name"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            {stories.map((story, index) => (
              <div key={index} style={{ marginBottom: '1rem' }}>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Story #</Form.Label>
                      <Form.Control
                        type="text"
                        name="storyName"
                        value={story.storyName}
                        onChange={(e) => handleStoryChange(index, e)}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Name</Form.Label>
                    <Form.Control
  as="select"
  name="name"
  value={story.name} // This should be set to the tester's ID
  onChange={(e) => handleStoryChange(index, e)}
>
  <option value="">Select Tester</option>
  {testers.map((tester, i) => (
    <option key={i} value={tester.id}>{tester.tester_name}</option>
  ))}
</Form.Control>

                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Story Point</Form.Label>
                      <Form.Control
                        type="number"
                        name="storyPoint"
                        value={story.storyPoint}
                        onChange={(e) => handleStoryChange(index, e)}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <Form.Control
                        as="select"
                        name="status"
                        value={story.status}
                        onChange={(e) => handleStoryChange(index, e)}
                      >
                        <option value="">Select Status</option>
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>% Completion</Form.Label>
                      <Form.Control
                        type="number"
                        name="completion"
                        value={story.completion}
                        onChange={(e) => handleStoryChange(index, e)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

<Row className="mb-3">
<Col md={6}>
  <Form.Group>
    <Form.Label>Type</Form.Label>
    <Form.Control
      as="select"
      name="type"
      value={story.type}
      onChange={(e) => handleStoryChange(index, e)}
    >
      <option value="Manual">Manual</option>
      <option value="Automation">Automation</option>
    </Form.Control>
  </Form.Group>
</Col>
</Row>

                <hr style={{ borderTop: '1px solid #000d6b', margin: '20px 0' }} />
              </div>
            ))}

            <Button variant="secondary" onClick={handleAddStory} style={{ marginRight: '10px' }}>
              Add Another Story
            </Button>

            <br /><br />

            <Button
              variant="primary"
              onClick={handleSubmit}
              style={{
                fontWeight: 'bold',
                color: '#ffffff',
                backgroundColor: '#000d6b',
                borderColor: '#000d6b',
              }}
            >
              {editMode ? 'Update Sprint' : 'Submit Sprint'}
            </Button>

          </Form>

          </div>
          
        </Card.Body>
      </Card>

      {/* Modal for displaying all sprints */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>View Sprint Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {sprints.length > 0 ? (
            <div>
              <h5>Select a Sprint:</h5>
              {sprints.map((sprint, index) => (
                <Button
                  key={index}
                  variant="info"
                  onClick={() => fetchSprintDetails(index)}
                  style={{ marginRight: '10px', marginBottom: '10px' }}
                >
                  {sprint.sprint_name}
                </Button>
              ))}
            </div>
          ) : (
            <p>No sprint details available.</p>
          )}
        </Modal.Body>
      </Modal>

<Modal show={showModal && selectedSprint} onHide={() => setShowModal(false)} size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Sprint Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedSprint ? (
      <div>
        <table className="table table-bordered">
          <tbody>
          <tr>
              <td><strong>Sprint Name</strong></td>
              <td>{selectedSprint.sprint_name}</td>
            </tr>
            <tr>
              <td><strong>Start Date:</strong></td>
              <td>{selectedSprint.start_date}</td>
            </tr>
            <tr>
              <td><strong>End Date:</strong></td>
              <td>{selectedSprint.end_date}</td>
            </tr>
            <tr>
              <td><strong>Total Stories:</strong></td>
              <td>{selectedSprint.story_committed}</td>
            </tr>
            <tr>
              <td><strong>Completed Stories:</strong></td>
              <td>{selectedSprint.story_completed}</td>
            </tr>
            <tr>
              <td><strong>PI Name:</strong></td>
              <td>{selectedSprint.PI_name}</td>
            </tr>
          </tbody>
        </table>

        <h5>Story Details:</h5>
        {selectedSprint.story_details && selectedSprint.story_details.length > 0 ? (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Story Name</th>
                <th>Story Point</th>
                <th>Status</th>
                <th>Completion (%)</th>
              </tr>
            </thead>
            <tbody>
              {selectedSprint.story_details.map((story, index) => (
                <tr key={index}>
                  <td>{story.story_name}</td>
                  <td>{story.story_point}</td>
                  <td>{story.status}</td>
                  <td>{story.completed_percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No story details available.</p>
        )}
      </div>
    ) : null}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={closeModal}>Close</Button>
    <Button variant="danger" onClick={handleDeleteSprint}>Delete Sprint</Button>
    <Button variant="primary" onClick={handleEditSprint}>Edit Sprint</Button>
  </Modal.Footer>
</Modal>


    </div>
  );
};

export default CreateSprint;




// working code below

// import React, { useState, useEffect } from 'react';
// import { Form, Button, Card, Row, Col, Modal } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';

// const CreateSprint = () => {
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [stories, setStories] = useState([{ storyName: '', name: '', storyPoint: '', status: '', completion: '', type: '', tester_id: ''}]);
//   const [testers, setTesters] = useState([]);
//   const [sprints, setSprints] = useState([]);
//   const [error, setError] = useState(null);
//   const [selectedSprint, setSelectedSprint] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [screamId, setScreamId] = useState(null);  // Added screamId state
//   const navigate = useNavigate();
//   const projectId = sessionStorage.getItem('projectId');
//   const [userId, setUserId] = useState(null);
//   const [sprintName, setSprintName] = useState('');  // State for sprint name input
//   const [userRole, setUserRole] = useState(null);

//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const token = sessionStorage.getItem('access_token');
//         const response = await fetch('https://frt4cnbr-5000.inc1.devtunnels.ms/get-role', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch role');
//         }

//         const data = await response.json();
//         setUserRole(data.role); // Assuming the role is in the 'role' field of the response
//       } catch (error) {
//         setError(error.message);
//       }
//     };

//     fetchUserRole();
//   }, []);
//   useEffect(() => {
//     if (projectId) {
//       fetchTesters(projectId);
//       fetchSprints();
//       // Fetch sprint details by agile_id
//       fetchSprintDetailsFromApi(projectId);
//       getUserIdFromToken();
//       const storedScreamId = sessionStorage.getItem('screamId');  // Fetch screamId from session storage
//       if (storedScreamId) {
//         setScreamId(storedScreamId);
//       }
//     }
//   }, [projectId]);


//   const fetchSprintDetailsFromApi = async (agile_id) => {
//     try {
//       const accessToken = sessionStorage.getItem('access_token');
//       const response = await axios.get(`https://frt4cnbr-5000.inc1.devtunnels.ms/sprint_details/${agile_id}`, {
//         headers: {
//           'Authorization': `Bearer ${accessToken}`,
//         }
//       });
//       setSprints(response.data);  // Set the sprint details in state
      
//     } catch (error) {
//       console.error('Error fetching sprint details:', error);
//     }
//   };

//   // Fetch testers from the API
//   const fetchTesters = async (projectId) => {
//     try {
//       const accessToken = sessionStorage.getItem('access_token');
//       const response = await axios.get(`https://frt4cnbr-5000.inc1.devtunnels.ms/tester_name_by_project/${projectId}`, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${accessToken}`,
//         }
//       });
//       setTesters(response.data);
//       console.log("TESTER NAME ID : ", response.data[0].id)
//       // settesterid(response.data[0].id)
//     } catch (error) {
//       console.error('Error fetching testers:', error);
//     }
//   };

//   // Fetch all sprints from local storage
//   const fetchSprints = () => {
//     const storedSprints = JSON.parse(localStorage.getItem('sprints')) || [];
//     setSprints(storedSprints);
//   };
//   const handleStoryChange = (index, e) => {
//     const updatedStories = [...stories];
//     updatedStories[index][e.target.name] = e.target.value;
  
//     // If the field being updated is the tester select dropdown, map it to tester_id.
//     if (e.target.name === "name") {
//       updatedStories[index]["tester_id"] = e.target.value; // Store the tester_id here
//     }
  
//     setStories(updatedStories);
//   };
  
//   const getUserIdFromToken = () => {
//     const accessToken = sessionStorage.getItem('access_token');
//     if (accessToken) {
//       const decoded = jwtDecode(accessToken);  // Decode the token
//       const userId = decoded.user_id;  // Assuming 'user_id' is in the decoded token
//       setUserId(userId); // Save user_id to state
//       return userId;
//     }
//     return null; // If no token is found, return null
//   };
  
//   // Add a new story
//   const handleAddStory = () => {
//     setStories([...stories, { storyName: '', name: '', storyPoint: '', status: '', completion: '', type: '', tester_id: ''}]);
//   };


//   const handleSubmit = async () => {
//     const story_committed = stories.length;
//     const story_completed = stories.filter(story => story.status === 'Done').length;
//     const story_points_committed = stories.reduce((acc, story) => acc + (parseInt(story.storyPoint) || 0), 0);
//     const story_points_completed = story_committed; 

//     const formattedStartDate = `${startDate}T00:00:00`;
//     const formattedEndDate = `${endDate}T00:00:00`;

//     const sprintDetails = {
//       // sprint_id: selectedSprint.id,
//       ...(editMode && { sprint_id: selectedSprint.id }),
//       story_committed,
//       story_completed,
//       story_points_committed,
//       story_points_completed,
//       defect_open_critical: 0,  
//       defect_open_high: 0,      
//       defect_open_medium: 0,    
//       defect_open_low: 0,       
//       user_id: userId,
//       project_name_id: projectId, 
//       scream_id: screamId,
//       start_date: formattedStartDate,
//       end_date: formattedEndDate,
//       sprint_name: sprintName,
//     };

//     const newSprintDetails = {
//       sprint_details: {
//         ...sprintDetails,
//         scream_id: screamId,
//       },
//       story_details: stories.map(story => ({
//         id: story.id, // Make sure to include the ID for updating
//         story_name: story.storyName,
//         story_point: story.storyPoint,
//         status: story.status,
//         completed_percentage: story.completion,
//         manual_or_automation: story.type || 'Manual', 
//         tester_id: story.tester_id, // The tester name ID
//       }))
//     };


//     try {
//       const accessToken = sessionStorage.getItem('access_token');
//       if (editMode) {
//         // PUT request to update sprint
//         const response = await axios.put('https://frt4cnbr-5000.inc1.devtunnels.ms/update_sprint_story_put', newSprintDetails, {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${accessToken}`,
//           }
//         });
//         console.log('Sprint updated successfully:', response.data);
//         setSprints(prevSprints => prevSprints.map(sprint => sprint.sprint_id === response.data.sprint_details.sprint_id ? response.data.sprint_details : sprint));
//       } else {
//         // POST request to create new sprint
//         const response = await axios.post('https://frt4cnbr-5000.inc1.devtunnels.ms/update_sprint_story', newSprintDetails, {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${accessToken}`,
//           }
//         });
//         console.log('Sprint created successfully:', response.data);
//         setSprints(prevSprints => [...prevSprints, response.data.sprint_details]);
        
//       }
//       setShowModal(false);
//       window.location.reload()
//     } catch (error) {
//       console.error('Error submitting sprint:', error);
//     }
//   };

//   const fetchSprintDetails = (index) => {
//     setSelectedSprint(sprints[index]);
//     setShowModal(true);
//   };
//   const handleDeleteSprint = async () => {
//     const isconfirmed = window.confirm("Are you sure want to delete the sprint")
//     if(!isconfirmed){
//       return
//     }
//     try {
//       // Get the sprint ID from the selected sprint object
//       const sprintId = selectedSprint.id;
//       console.log("selectedSprint : ", selectedSprint)
  
//       // Make a DELETE request to the API to delete the sprint
//       const accessToken = sessionStorage.getItem('access_token');
//       const response = await axios.delete(`https://frt4cnbr-5000.inc1.devtunnels.ms/sprint_details/${sprintId}`, {
//         headers: {
//           'Authorization': `Bearer ${accessToken}`,
//         },
//       });
  
//       // If the API call is successful, remove the sprint from the local state
//       if (response.status === 200) {
//         const updatedSprints = sprints.filter(sprint => sprint.sprint_id !== sprintId);
//         localStorage.setItem('sprints', JSON.stringify(updatedSprints));  // Update local storage as well
//         setSprints(updatedSprints);
//         setShowModal(false); // Close the modal after deletion
//         console.log('Sprint deleted successfully:', response.data);
//       }
//       window.location.reload()
//     } catch (error) {
//       console.error('Error deleting sprint:', error);
//     }
//   };
  
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if month < 10
//     const day = date.getDate().toString().padStart(2, '0'); // Add leading zero if day < 10
//     return `${year}-${month}-${day}`;
//   };
//   const handleEditSprint = () => {
//     setEditMode(true);
  
//     // Set form fields with the current sprint details
//     setStories(selectedSprint.story_details.map(story => ({
//       ...story,
//       id: story.id,  // Ensure the ID is included for updating
//       storyName: story.story_name,
//       name: story.tester_id, // Make sure to set tester ID here
//       storyPoint: story.story_point,
//       status: story.status,
//       completion: story.completed_percentage,
//       type: story.manual_or_automation,
//     })));
  
//     // Set start and end dates
//     setStartDate(formatDate(selectedSprint.start_date)); // Split to get the date part
//     // console.log("startDate : ", selectedSprint.start_date)
//     setEndDate(formatDate(selectedSprint.end_date)); // Split to get the date part
//     setSprintName(selectedSprint.sprint_name); // Set sprint name as well
  
//     // Close the modal once the details are pre-filled
//     setShowModal(true);
//     closeModal(true);
//   };
  

//   const closeModal = () => {
//     setShowModal(false);
//     };
//   return (
//     <div style={{ width: '60%', margin: 'auto' }}>
//       <Card>
//         <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           Create Sprint
//           {userRole === 'admin' &&<Button
//             variant="outline-light"
//             style={{ backgroundColor: 'transparent', borderColor: '#ffffff', color: '#ffffff' }}
//             onClick={() => setShowModal(true)}
//           >
//             View Sprint
//           </Button>}
//         </Card.Header>

//         <Card.Body>
//           <div style={{ maxHeight: '600px', overflowY: 'auto' }}>

//           <Form>
//           <Row className="mb-3">
//               <Col md={12}>
//                 <Form.Group>
//                   <Form.Label>Sprint Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={sprintName}
//                     onChange={(e) => setSprintName(e.target.value)}
//                     placeholder="Enter Sprint Name"
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>
//             <Row className="mb-3">
//               <Col md={6}>
//                 <Form.Group>
//                   <Form.Label>Start Date</Form.Label>
//                   <Form.Control
//                     type="date"
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={6}>
//                 <Form.Group>
//                   <Form.Label>End Date</Form.Label>
//                   <Form.Control
//                     type="date"
//                     value={endDate}
//                     onChange={(e) => setEndDate(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             {stories.map((story, index) => (
//               <div key={index} style={{ marginBottom: '1rem' }}>
//                 <Row className="mb-3">
//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>Story #</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="storyName"
//                         value={story.storyName}
//                         onChange={(e) => handleStoryChange(index, e)}
//                       />
//                     </Form.Group>
//                   </Col>

//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>Name</Form.Label>
//                       {/* <Form.Control
//                         as="select"
//                         name="name"
//                         value={story.name}
//                         onChange={(e) => handleStoryChange(index, e)}
//                       >
//                         <option value="">Select Tester</option>
//                         {testers.map((tester, i) => (
//                           <option key={i} value={tester.id}>{tester.tester_name}</option>
//                         ))}
//                       </Form.Control> */}

// <Form.Control
//   as="select"
//   name="name"
//   value={story.name} // This should be set to the tester's ID
//   onChange={(e) => handleStoryChange(index, e)}
// >
//   <option value="">Select Tester</option>
//   {testers.map((tester, i) => (
//     <option key={i} value={tester.id}>{tester.tester_name}</option>
//   ))}
// </Form.Control>

//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 <Row className="mb-3">
//                   <Col md={4}>
//                     <Form.Group>
//                       <Form.Label>Story Point</Form.Label>
//                       <Form.Control
//                         type="number"
//                         name="storyPoint"
//                         value={story.storyPoint}
//                         onChange={(e) => handleStoryChange(index, e)}
//                       />
//                     </Form.Group>
//                   </Col>

//                   <Col md={4}>
//                     <Form.Group>
//                       <Form.Label>Status</Form.Label>
//                       <Form.Control
//                         as="select"
//                         name="status"
//                         value={story.status}
//                         onChange={(e) => handleStoryChange(index, e)}
//                       >
//                         <option value="">Select Status</option>
//                         <option value="Not Started">Not Started</option>
//                         <option value="In Progress">In Progress</option>
//                         <option value="Done">Done</option>
//                       </Form.Control>
//                     </Form.Group>
//                   </Col>

//                   <Col md={4}>
//                     <Form.Group>
//                       <Form.Label>% Completion</Form.Label>
//                       <Form.Control
//                         type="number"
//                         name="completion"
//                         value={story.completion}
//                         onChange={(e) => handleStoryChange(index, e)}
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>

// <Row className="mb-3">
// <Col md={6}>
//   <Form.Group>
//     <Form.Label>Type</Form.Label>
//     <Form.Control
//       as="select"
//       name="type"
//       value={story.type}
//       onChange={(e) => handleStoryChange(index, e)}
//     >
//       <option value="Manual">Manual</option>
//       <option value="Automation">Automation</option>
//     </Form.Control>
//   </Form.Group>
// </Col>
// </Row>

//                 <hr style={{ borderTop: '1px solid #000d6b', margin: '20px 0' }} />
//               </div>
//             ))}

//             <Button variant="secondary" onClick={handleAddStory} style={{ marginRight: '10px' }}>
//               Add Another Story
//             </Button>

//             <br /><br />

//             <Button
//               variant="primary"
//               onClick={handleSubmit}
//               style={{
//                 fontWeight: 'bold',
//                 color: '#ffffff',
//                 backgroundColor: '#000d6b',
//                 borderColor: '#000d6b',
//               }}
//             >
//               {editMode ? 'Update Sprint' : 'Submit Sprint'}
//             </Button>

//           </Form>

//           </div>
          
//         </Card.Body>
//       </Card>

//       {/* Modal for displaying all sprints */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>View Sprint Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {sprints.length > 0 ? (
//             <div>
//               <h5>Select a Sprint:</h5>
//               {sprints.map((sprint, index) => (
//                 <Button
//                   key={index}
//                   variant="info"
//                   onClick={() => fetchSprintDetails(index)}
//                   style={{ marginRight: '10px', marginBottom: '10px' }}
//                 >
//                   {sprint.sprint_name}
//                 </Button>
//               ))}
//             </div>
//           ) : (
//             <p>No sprint details available.</p>
//           )}
//         </Modal.Body>
//       </Modal>

// <Modal show={showModal && selectedSprint} onHide={() => setShowModal(false)} size="lg">
//   <Modal.Header closeButton>
//     <Modal.Title>Sprint Details</Modal.Title>
//   </Modal.Header>
//   <Modal.Body>
//     {selectedSprint ? (
//       <div>
//         <table className="table table-bordered">
//           <tbody>
//           <tr>
//               <td><strong>Sprint Name</strong></td>
//               <td>{selectedSprint.sprint_name}</td>
//             </tr>
//             <tr>
//               <td><strong>Start Date:</strong></td>
//               <td>{selectedSprint.start_date}</td>
//             </tr>
//             <tr>
//               <td><strong>End Date:</strong></td>
//               <td>{selectedSprint.end_date}</td>
//             </tr>
//             <tr>
//               <td><strong>Total Stories:</strong></td>
//               <td>{selectedSprint.story_committed}</td>
//             </tr>
//             <tr>
//               <td><strong>Completed Stories:</strong></td>
//               <td>{selectedSprint.story_completed}</td>
//             </tr>
//           </tbody>
//         </table>

//         <h5>Story Details:</h5>
//         {selectedSprint.story_details && selectedSprint.story_details.length > 0 ? (
//           <table className="table table-bordered">
//             <thead>
//               <tr>
//                 <th>Story Name</th>
//                 <th>Story Point</th>
//                 <th>Status</th>
//                 <th>Completion (%)</th>
//               </tr>
//             </thead>
//             <tbody>
//               {selectedSprint.story_details.map((story, index) => (
//                 <tr key={index}>
//                   <td>{story.story_name}</td>
//                   <td>{story.story_point}</td>
//                   <td>{story.status}</td>
//                   <td>{story.completed_percentage}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p>No story details available.</p>
//         )}
//       </div>
//     ) : null}
//   </Modal.Body>
//   <Modal.Footer>
//     <Button variant="secondary" onClick={closeModal}>Close</Button>
//     <Button variant="danger" onClick={handleDeleteSprint}>Delete Sprint</Button>
//     <Button variant="primary" onClick={handleEditSprint}>Edit Sprint</Button>
//   </Modal.Footer>
// </Modal>


//     </div>
//   );
// };

// export default CreateSprint;