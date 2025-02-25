import React, { useState, useEffect } from 'react';
import { Card, Table, Row, Col, Form, Button } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SprintDetailsTable = () => {
  const [sprintDetails, setSprintDetails] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingStory, setEditingStory] = useState(null);
  const [editedStory, setEditedStory] = useState({});
  const [userRole, setUserRole] = useState(null);
  const [selectedPI, setSelectedPI] = useState('');
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchSprintDetails = async () => {
      try {
        const agileId = sessionStorage.getItem('screamId');
        const piName = sessionStorage.getItem('piName');
        const token = sessionStorage.getItem('access_token');

        if (!agileId || !token || !piName) {
          setError('Missing required session data');
          setLoading(false);
          return;
        }

        setSelectedPI(piName);

        const response = await fetch(
          `https://frt4cnbr-5000.inc1.devtunnels.ms/sprint_details/${agileId}/${piName}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error('Failed to fetch data');

        const data = await response.json();
        setSprintDetails(data);

        // Find current sprint and set it as selected
        const currentSprint = findCurrentSprint(data);
        if (currentSprint) {
          setSelectedSprint(currentSprint.sprint_name);
        } else if (data.length > 0) {
          // If no current sprint, default to first sprint
          setSelectedSprint(data[0].sprint_name);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSprintDetails();
  }, []);

  const handleEditClick = (story) => {
    setEditingStory(story.id);
    setEditedStory({ ...story });
  };

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

  const handleSaveEdit = async () => {
    const { id, story_name, status, completed_percentage, story_point, manual_or_automation, tester_id } = editedStory;
    const sprintData = sprintDetails.find(sprint => sprint.story_details.some(story => story.id === id));
    const token = sessionStorage.getItem('access_token');
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0] + 'T' + date.toTimeString().split(' ')[0];
    };
    const cleanStartDate = formatDate(sprintData.start_date);
    const cleanEndDate = formatDate(sprintData.end_date);
    const payload = {
      sprint_details: {
        story_committed: sprintData.story_committed,
        story_completed: sprintData.story_completed,
        story_points_committed: sprintData.story_points_committed,
        story_points_completed: sprintData.story_points_completed,
        defect_open_critical: sprintData.defect_open_critical,
        defect_open_high: sprintData.defect_open_high,
        defect_open_medium: sprintData.defect_open_medium,
        defect_open_low: sprintData.defect_open_low,
        start_date: cleanStartDate,
        end_date: cleanEndDate,
        project_name_id: sprintData.project_name_id,
        scream_id: sprintData.scream_id,
        sprint_name: sprintData.sprint_name,
        sprint_id: sprintData.id,
      },
      story_details: [{
        id: id,
        story_name: story_name,
        status: status,
        completed_percentage: completed_percentage,
        story_point: story_point,
        manual_or_automation: manual_or_automation,
        tester_id: tester_id,
      }],
    };

    try {
      const response = await fetch(`https://frt4cnbr-5000.inc1.devtunnels.ms/update_sprint_story_put`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to update story');

      setSprintDetails(sprintDetails.map(sprint =>
        sprint.id === sprintData.id
          ? { ...sprint, story_details: sprint.story_details.map(story => story.id === id ? { ...story, ...editedStory } : story) }
          : sprint
      ));
      setEditingStory(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingStory(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedStory({ ...editedStory, [name]: value });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const currentSprint = sprintDetails.find(sprint => sprint.sprint_name === selectedSprint);
  if (!currentSprint) return <div>No sprint data available</div>;

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
          {currentSprint.sprint_name} - Sprint Status (PI: {selectedPI})
          {userRole === 'admin' && (
            <div style={{ float: 'right' }}>
              <FaTrash
                onClick={() => handleDeleteSprintClick(currentSprint.id)}
                style={{ cursor: 'pointer', color: 'red' }}
              />
            </div>
          )}
        </Card.Header>
        <Card.Body>
          <Form.Group controlId="sprintSelect">
            <Form.Label>Select Sprint</Form.Label>
            <Form.Control
              as="select"
              value={selectedSprint}
              onChange={(e) => setSelectedSprint(e.target.value)}
            >
              {sprintDetails.map(renderSprintOption)}
            </Form.Control>
          </Form.Group>

          <Row>
            <Col md={4}>
              <p>Start Date: {new Date(currentSprint.start_date).toLocaleDateString()}</p>
            </Col>
            <Col md={4}>
              <p>End Date: {new Date(currentSprint.end_date).toLocaleDateString()}</p>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <h6>Story Committed</h6>
                  <p><strong>Stories: {currentSprint.story_committed}</strong></p>
                  <p><strong>Story Points: {currentSprint.story_points_committed}</strong></p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <h6>Story Completed</h6>
                  <p><strong>Stories: {currentSprint.story_completed}</strong></p>
                  <p><strong>Story Points: {currentSprint.story_points_completed}</strong></p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <h6>Defects Open</h6>
                  <Row>
                    <Col md={6}>
                      <p><strong>Critical:</strong> {currentSprint.defect_open_critical}</p>
                      <p><strong>High:</strong> {currentSprint.defect_open_high}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Medium:</strong> {currentSprint.defect_open_medium}</p>
                      <p><strong>Low:</strong> {currentSprint.defect_open_low}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <hr />

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Story Name</th>
                <th>Status</th>
                <th>Completion</th>
                <th>Story Points</th>
                <th>Type</th>
                {userRole === 'admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {currentSprint.story_details.map(story => (
                <tr key={story.id}>
                  <td>{editingStory === story.id ? (
                    <input type="text" name="story_name" value={editedStory.story_name} onChange={handleInputChange} />
                  ) : (
                    story.story_name
                  )}</td>
                  <td>{editingStory === story.id ? (
                    <select name="status" value={editedStory.status} onChange={handleInputChange}>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="To Do">To Do</option>
                    </select>
                  ) : (
                    story.status
                  )}</td>
                  <td>{editingStory === story.id ? (
                    <input type="number" name="completed_percentage" value={editedStory.completed_percentage} onChange={handleInputChange} />
                  ) : (
                    story.completed_percentage
                  )}</td>
                  <td>{editingStory === story.id ? (
                    <input type="number" name="story_point" value={editedStory.story_point} onChange={handleInputChange} />
                  ) : (
                    story.story_point
                  )}</td>
                  <td>{editingStory === story.id ? (
                    <input type="text" name="manual_or_automation" value={editedStory.manual_or_automation} onChange={handleInputChange} />
                  ) : (
                    story.manual_or_automation
                  )}</td>
                  <td>
                    {editingStory === story.id ? (
                      <>
                        <Button variant="success" onClick={handleSaveEdit}>Save</Button>
                        <Button variant="danger" onClick={handleCancelEdit}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        {userRole === 'admin' && (
                          <FaEdit onClick={() => handleEditClick(story)} style={{ cursor: 'pointer', marginRight: '10px' }} />
                        )}
                        {userRole === 'admin' && (
                          <FaTrash onClick={() => handleDeleteClick(story.id)} style={{ cursor: 'pointer', color: 'red' }} />
                        )}
                      </>
                    )}
                  </td>
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