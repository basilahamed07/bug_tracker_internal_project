import React, { useState } from 'react';
import { Card, Table, Row, Col, Form } from 'react-bootstrap';

const SprintStatus = () => {
  const [selectedSprint, setSelectedSprint] = useState('Sprint 3');

  const sprints = [
    {
      name: 'Sprint 3',
      startDate: '5th Feb',
      endDate: '14th Feb',
      summary: { 
        committed: {
          stories: 5,
          storyPoints: 11,
        },
        completed: {
          stories: 1,
          storyPoints: 5,
        }
      },
      stories: [
        {
          story: 'EHPS101',
          name: 'Ravi',
          storyPoints: 2,
          status: 'Done',
          completion: '100%',
          type: 'Manual',
          notes: 'No Risk or issue'
        },
        {
          story: 'gfd',
          name: 'Karthik',
          storyPoints: 3,
          status: 'In Progress',
          completion: '50%',
          type: 'Automation',
          notes: ''
        },
        {
          story: 'gfd',
          name: 'Suresh',
          storyPoints: 2,
          status: 'Not Started',
          completion: '0%',
          type: 'Manual',
          notes: ''
        },
        {
          story: 'fdgfd',
          name: 'Manoj',
          storyPoints: 2,
          status: 'In Progress',
          completion: '70%',
          type: 'Automation',
          notes: ''
        },
        {
          story: 'gfd',
          name: 'Basil',
          storyPoints: 2,
          status: 'Not Started',
          completion: '60%',
          type: 'Manual',
          notes: ''
        }
      ]
    },
    {
      name: 'Sprint 2',
      startDate: '1st Feb',
      endDate: '10th Feb',
      summary: {
        committed: {
          stories: 4,
          storyPoints: 8,
        },
        completed: {
          stories: 2,
          storyPoints: 4,
        }
      },
      stories: [
        {
          story: 'AB123',
          name: 'John',
          storyPoints: 3,
          status: 'Done',
          completion: '100%',
          type: 'Manual',
          notes: ''
        },
        {
          story: 'CD456',
          name: 'Emily',
          storyPoints: 2,
          status: 'In Progress',
          completion: '60%',
          type: 'Automation',
          notes: ''
        },
        {
          story: 'EF789',
          name: 'Alex',
          storyPoints: 3,
          status: 'Not Started',
          completion: '0%',
          type: 'Manual',
          notes: ''
        }
      ]
    },
    {
      name: 'Sprint 1',
      startDate: '15th Jan',
      endDate: '24th Jan',
      summary: {
        committed: {
          stories: 6,
          storyPoints: 12,
        },
        completed: {
          stories: 4,
          storyPoints: 9,
        }
      },
      stories: [
        {
          story: 'XY123',
          name: 'Mark',
          storyPoints: 2,
          status: 'Done',
          completion: '100%',
          type: 'Manual',
          notes: 'No issues'
        },
        {
          story: 'AB234',
          name: 'David',
          storyPoints: 2,
          status: 'In Progress',
          completion: '40%',
          type: 'Automation',
          notes: ''
        }
      ]
    }
  ];

  const currentSprint = sprints.find(sprint => sprint.name === selectedSprint);

  return (
    <div style={{ width: '90%', margin: 'auto', marginTop: '20px' }}>
      <Card>
        <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff' }}>
          {currentSprint.name} - Sprint Status
        </Card.Header>
        <Card.Body>
          {/* Sprint Dropdown */}
          <Form.Group controlId="sprintSelect">
            <Form.Label>Select Sprint</Form.Label>
            <Form.Control as="select" value={selectedSprint} onChange={(e) => setSelectedSprint(e.target.value)}>
              {sprints.map((sprint) => (
                <option key={sprint.name} value={sprint.name}>
                  {sprint.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {/* Sprint Date Range */}
          <Row>
          {/* <h6>Sprint Dates</h6> */}
            <Col md={4}>
              
              <p>Start Date: {currentSprint.startDate}</p>
              
            </Col>
            <Col md={4}>
              
              <p>End Date: {currentSprint.endDate}</p>
              
            </Col>
          </Row>

          {/* Sprint Summary Section */}
          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <h6>Story Committed</h6>
                  <p><strong>Stories: {currentSprint.summary.committed.stories}</strong></p>
                  <p><strong>Story Points: {currentSprint.summary.committed.storyPoints}</strong></p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <h6>Story Completed</h6>
                  <p><strong>Stories: {currentSprint.summary.completed.stories}</strong></p>
                  <p><strong>Story Points: {currentSprint.summary.completed.storyPoints}</strong></p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
  <Card>
    <Card.Body>
      <h6>Defects Open</h6>
      <Row>
        <Col md={6}>
          <p><strong>Critical:</strong> 0</p>
          <p><strong>High:</strong> 1</p>
        </Col>
        <Col md={6}>
          <p><strong>Medium:</strong> 2</p>
          <p><strong>Low:</strong> 0</p>
        </Col>
      </Row>
    </Card.Body>
  </Card>
</Col>

          </Row>

          <hr />

          {/* Sprint Stories Table */}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Story #</th>
                <th>Name</th>
                <th>Story Points</th>
                <th>Status</th>
                <th>Completion</th>
                <th>Type</th>
                <th>Notes/Risk/Issue</th>
              </tr>
            </thead>
            <tbody>
              {currentSprint.stories.map((item, index) => (
                <tr key={index}>
                  <td>{item.story}</td>
                  <td>{item.name}</td>
                  <td>{item.storyPoints}</td>
                  <td>{item.status}</td>
                  <td>{item.completion}</td>
                  <td>{item.type}</td>
                  <td>{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SprintStatus;
