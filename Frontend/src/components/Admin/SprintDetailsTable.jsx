import React, { useState, useEffect } from 'react';
import { Card, Table, Row, Col, Form, Button } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SprintDetailsTable = () => {
  const [sprintDetails, setSprintDetails] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [selectedPI, setSelectedPI] = useState('');
  const [scrumName, setScrumName] = useState('');
  const navigate = useNavigate();

  // Add new states for PI handling
  const [piList, setPIList] = useState([]);
  const [showPIModal, setShowPIModal] = useState(false);
  const [showCreatePIForm, setShowCreatePIForm] = useState(false);
  const [newPIName, setNewPIName] = useState('');
  const [currentSprint, setCurrentSprint] = useState(null);

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

        if (!response.ok) throw new Error('Failed to fetch role');
        const data = await response.json();
        setUserRole(data.role);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserRole();
  }, []);

  const findCurrentSprint = (sprints) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part for date comparison

    return sprints.find(sprint => {
      const startDate = new Date(sprint.start_date);
      const endDate = new Date(sprint.end_date);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      return today >= startDate && today <= endDate;
    });
  };

  // Add new function to find PI with current sprint
  const findCurrentPI = async (pis, scrumId, token) => {
    for (const pi of pis) {
      const sprintsResponse = await fetch(
        `https://frt4cnbr-5000.inc1.devtunnels.ms/sprint_details/${scrumId}/${pi}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (sprintsResponse.ok) {
        const sprintsData = await sprintsResponse.json();
        const currentSprint = findCurrentSprint(sprintsData);
        if (currentSprint) {
          return { pi, sprints: sprintsData, currentSprint };
        }
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchPIAndSprints = async () => {
      try {
        const token = sessionStorage.getItem('access_token');
        const scrumId = sessionStorage.getItem('screamId');

        if (!token || !scrumId) {
          setError('Missing required session data');
          return;
        }

        // Fetch PIs first
        const piResponse = await fetch(
          `https://frt4cnbr-5000.inc1.devtunnels.ms/get_pl_name/${scrumId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!piResponse.ok) throw new Error('Failed to fetch PIs');
        const pis = await piResponse.json();
        setPIList(pis);

        if (pis.length > 0) {
          // Find PI with current sprint
          const currentPIData = await findCurrentPI(pis, scrumId, token);

          if (currentPIData) {
            // Current sprint found in one of the PIs
            setSelectedPI(currentPIData.pi);
            setSprintDetails(currentPIData.sprints);
            setSelectedSprint(currentPIData.currentSprint.sprint_name);
            setCurrentSprint(currentPIData.currentSprint);
          } else {
            // No current sprint found, default to latest PI
            const latestPI = pis[pis.length - 1];
            setSelectedPI(latestPI);
            
            // Fetch sprints for latest PI
            const sprintsResponse = await fetch(
              `https://frt4cnbr-5000.inc1.devtunnels.ms/sprint_details/${scrumId}/${latestPI}`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              }
            );

            if (sprintsResponse.ok) {
              const sprintsData = await sprintsResponse.json();
              setSprintDetails(sprintsData);
              if (sprintsData.length > 0) {
                setSelectedSprint(sprintsData[0].sprint_name);
                setCurrentSprint(sprintsData[0]);
              }
            }
          }
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPIAndSprints();
  }, []);

// Update the fetchScrumName function
const fetchScrumName = async () => {
  try {
    const token = sessionStorage.getItem('access_token');
    const project_name_id = sessionStorage.getItem('project_name_id');
    const scrumId = sessionStorage.getItem('screamId'); // Get scrum ID from session storage
    
    const response = await fetch(
      `https://frt4cnbr-5000.inc1.devtunnels.ms/agile_details/${project_name_id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      // Find the specific scrum that matches the ID from session storage
      const currentScrum = data.find(scrum => scrum.id === parseInt(scrumId));
      if (currentScrum) {
        setScrumName(currentScrum.scream_name);
      }
    }
  } catch (error) {
    console.error('Error fetching scrum name:', error);
  }
};

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

        if (!response.ok) throw new Error('Failed to fetch role');
        const data = await response.json();
        setUserRole(data.role);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserRole();
    fetchScrumName();
  }, []);

  const handleDeleteClick = async (storyId) => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await fetch(`https://frt4cnbr-5000.inc1.devtunnels.ms/story_details/${storyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete story');

      setSprintDetails(sprintDetails.filter(story => story.id !== storyId));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteSprintClick = async (sprintId) => {
    if (!window.confirm('Are you sure you want to delete this sprint?')) return;
    
    try {
      const token = sessionStorage.getItem('access_token');
      const response = await fetch(
        `https://frt4cnbr-5000.inc1.devtunnels.ms/sprint_details/${sprintId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to delete sprint');

      setSprintDetails(prevDetails => prevDetails.filter(sprint => sprint.id !== sprintId));
      navigate("/ManagerView/ScrumDetails");
    } catch (error) {
      setError(error.message);
    }
  };

  // Add handler for PI change
  const handlePIChange = async (newPI) => {
    try {
      const token = sessionStorage.getItem('access_token');
      const scrumId = sessionStorage.getItem('screamId');
      
      setSelectedPI(newPI);
      sessionStorage.setItem('piName', newPI);
      setLoading(true);

      const response = await fetch(
        `https://frt4cnbr-5000.inc1.devtunnels.ms/sprint_details/${scrumId}/${newPI}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch sprints');
      const data = await response.json();
      setSprintDetails(data);

      // Set current sprint or first sprint as default
      const activeSprint = findCurrentSprint(data);
      if (activeSprint) {
        setSelectedSprint(activeSprint.sprint_name);
        setCurrentSprint(activeSprint);
      } else if (data.length > 0) {
        setSelectedSprint(data[0].sprint_name);
        setCurrentSprint(data[0]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add handler for sprint selection change
  const handleSprintChange = (sprintName) => {
    const selectedSprintData = sprintDetails.find(sprint => sprint.sprint_name === sprintName);
    if (selectedSprintData) {
      setSelectedSprint(sprintName);
      setCurrentSprint(selectedSprintData);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const renderSprintOption = (sprint) => {
    const isCurrentSprint = findCurrentSprint([sprint]) !== undefined;
    return (
      <option 
        key={sprint.id} 
        value={sprint.sprint_name}
        style={isCurrentSprint ? {fontWeight: 'bold', color: '#000d6b'} : {}}
      >
        {sprint.sprint_name} {isCurrentSprint ? '(Current)' : ''}
      </option>
    );
  };

  return (
    <div style={{ width: '90%', margin: 'auto', marginTop: '20px' }}>
      <Card>
      <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff' }}>
      <center><strong>{scrumName || 'Sprint Details'}</strong></center>
</Card.Header>  

        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="piSelect">
                <Form.Label><strong>Program Increment</strong></Form.Label>
                <Form.Select
                  value={selectedPI}
                  onChange={(e) => handlePIChange(e.target.value)}
                  style={{ 
                    color: '#000d6b',
                    fontWeight: 'bold',
                    borderColor: '#000d6b'
                  }}
                >
                  {piList.map((pi, index) => (
                    <option key={index} value={pi}>{pi}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="sprintSelect">
                <Form.Label><strong>Sprint</strong></Form.Label>
                <Form.Select
                  value={selectedSprint}
                  onChange={(e) => handleSprintChange(e.target.value)}
                  style={{ 
                    fontWeight: findCurrentSprint(sprintDetails) ? 'bold' : 'normal',
                    borderColor: '#000d6b'
                  }}
                >
                  {sprintDetails.map(renderSprintOption)}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
            
              <p><strong>Start Date: </strong>{new Date(currentSprint.start_date).toLocaleDateString()}</p>
            </Col>
            <Col md={4}>
              <p><strong>End Date:</strong> {new Date(currentSprint.end_date).toLocaleDateString()}</p>
            </Col>
          </Row>

          <Row>
            <Col md={4}> 
              <Card>
                <Card.Body>
                  <p><strong>Story Committed</strong></p>
                  Stories: {currentSprint.story_committed}<br/>
                  Story Points: {currentSprint.story_points_committed}
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <p><strong>Story Completed</strong></p>
                  Stories: {currentSprint.story_completed}<br/>
                  Story Points: {currentSprint.story_points_completed}
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <p><strong>Defects Open</strong></p>
                  <Row>
                    <Col md={6}>
                      Critical: {currentSprint.defect_open_critical}<br/>
                      High: {currentSprint.defect_open_high}
                    </Col>
                    <Col md={6}>
                      Medium: {currentSprint.defect_open_medium}<br/>
                      Low: {currentSprint.defect_open_low}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <hr />

          {/* <Table striped bordered hover>
            <thead>
              <tr>
                <th>Story Name</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Completion %</th>
                <th>Story Points</th>
                <th>Story Points Done</th>
                <th>Type</th>             
              </tr>
            </thead>
            <tbody>
              {currentSprint.story_details.map(story => (
                <tr key={story.id}>
                  <td>{story.story_name}</td>
                  <td>{story.tester_name}</td>
                  <td>{story.status}</td>
                  <td>{story.completed_percentage}</td>
                  <td>{story.story_point}</td>
                  <td>{story.Story_consumed || 0}</td>
                  <td>{story.manual_or_automation}</td>                  
                </tr>
              ))}
            </tbody>
          </Table> */}
          <Table striped bordered hover>
  <thead>
    <tr>
      <th>Story Name</th>
      <th>Assigned To</th>
      <th>Status</th>
      <th>Completion %</th>
      <th>Story Points</th>
      <th>Target Date</th>
      <th>Estimated Hours</th>
      <th>Actual Hours</th>
      <th>Type</th>             
    </tr>
  </thead>
  <tbody>
    {currentSprint.story_details.map(story => (
      <tr key={story.id}>
        <td>{story.story_name}</td>
        <td>{story.tester_name}</td>
        <td>{story.status}</td>
        <td>{story.completed_percentage}</td>
        <td>{story.story_point}/{story.Story_consumed || 0}</td> {/* Story Points (story_point / Story_consumed) */}
        <td>{new Date(story.target_date).toLocaleDateString()}</td> {/* Target Date */}
        <td>{story.estimated_hour}</td> {/* Estimated Hours */}
        <td>{story.actual_hour}</td> {/* Actual Hours */}
        <td>{story.manual_or_automation}</td> {/* Type */}
      </tr>
    ))}
  </tbody>
</Table>

        </Card.Body>
      </Card>
    </div>
  );
};

export default SprintDetailsTable;