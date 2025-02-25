import React, { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Nonagileform = () => {
  // Manual form data state
  const [manualData, setManualData] = useState({
    totalTestCases: '',
    testCasesExecuted: '',
    passed: '',
    failed: '',
    openDefect: ''
  });

  // Automation form data state
  const [automationData, setAutomationData] = useState({
    totalTestCases: '',
    testCasesExecuted: '',
    passed: '',
    failed: '',
    openDefect: ''
  });

  
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Handle change for Manual form
  const handleManualChange = (e) => {
    const { name, value } = e.target;
    setManualData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle change for Automation form
  const handleAutomationChange = (e) => {
    const { name, value } = e.target;
    setAutomationData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission for Manual and Automation data
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = sessionStorage.getItem('access_token');
    const projectNameId = sessionStorage.getItem('projectID'); // Get project_name_id from sessionStorage
    // const userId = sessionStorage.getItem('user_id'); // Get user_id from sessionStorage
  
    if (!token || !projectNameId) {
      console.error('Missing token or session data');
      return;
    }
  
    // Prepare payload for both manual and automation testing
    const payload = [
      {
        total_testcase: manualData.totalTestCases,
        tcexecution: manualData.testCasesExecuted,
        passed: manualData.passed,
        fail: manualData.failed,
        opendefact: manualData.openDefect,
        type_of_testing: 'Manual',
        project_name_id: projectNameId, // Use dynamic project_name_id
        // user_id: userId, // Use dynamic user_id
      },
      {
        total_testcase: automationData.totalTestCases,
        tcexecution: automationData.testCasesExecuted,
        passed: automationData.passed,
        fail: automationData.failed,
        opendefact: automationData.openDefect,
        type_of_testing: 'Automation',
        project_name_id: projectNameId, // Use dynamic project_name_id
        // user_id: userId, // Use dynamic user_id
      },
    ];
  
    try {
      const response = await fetch('https://frt4cnbr-5000.inc1.devtunnels.ms/testing-type', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        console.error('Failed to submit data:', response);
      } else {
        console.log('Data Submitted Successfully for Manual and Automation');
  
        // Show success alert
        alert('Testing details submitted successfully!');
  
        // Reset form data after successful submission
        setManualData({
          totalTestCases: '',
          testCasesExecuted: '',
          passed: '',
          failed: '',
          openDefect: '',
        });
        setAutomationData({
          totalTestCases: '',
          testCasesExecuted: '',
          passed: '',
          failed: '',
          openDefect: '',
        });
  
        // Navigate to the ManageDefects page after a brief delay
        setTimeout(() => {
          navigate('/AdminPanel/ManageDefects');
        }, 1000); // 1-second delay before navigating
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };
  

  return (
    <div style={{ width: '80%', margin: 'auto' }}>
      <Card>
        <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff' }}>
          Test Case Information
        </Card.Header>
        <Card.Body>
          {/* Manual Form Section */}
          <div>
            <h5>Manual Test Case Details</h5>
            <Form>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Total Test Cases</Form.Label>
                    <Form.Control
                      type="number"
                      name="totalTestCases"
                      value={manualData.totalTestCases}
                      onChange={handleManualChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Test Cases Executed</Form.Label>
                    <Form.Control
                      type="number"
                      name="testCasesExecuted"
                      value={manualData.testCasesExecuted}
                      onChange={handleManualChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Passed</Form.Label>
                    <Form.Control
                      type="number"
                      name="passed"
                      value={manualData.passed}
                      onChange={handleManualChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Failed</Form.Label>
                    <Form.Control
                      type="number"
                      name="failed"
                      value={manualData.failed}
                      onChange={handleManualChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Open Defect</Form.Label>
                    <Form.Control
                      type="number"
                      name="openDefect"
                      value={manualData.openDefect}
                      onChange={handleManualChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </div>

          {/* Automation Form Section */}
          <div style={{ marginTop: '30px' }}>
            <h5>Automation Test Case Details</h5>
            <Form>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Total Test Cases</Form.Label>
                    <Form.Control
                      type="number"
                      name="totalTestCases"
                      value={automationData.totalTestCases}
                      onChange={handleAutomationChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Test Cases Executed</Form.Label>
                    <Form.Control
                      type="number"
                      name="testCasesExecuted"
                      value={automationData.testCasesExecuted}
                      onChange={handleAutomationChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Passed</Form.Label>
                    <Form.Control
                      type="number"
                      name="passed"
                      value={automationData.passed}
                      onChange={handleAutomationChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Failed</Form.Label>
                    <Form.Control
                      type="number"
                      name="failed"
                      value={automationData.failed}
                      onChange={handleAutomationChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Open Defect</Form.Label>
                    <Form.Control
                      type="number"
                      name="openDefect"
                      value={automationData.openDefect}
                      onChange={handleAutomationChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </div>

          <Button
            variant="primary"
            onClick={handleSubmit}
            style={{
              fontWeight: 'bold',
              color: '#ffffff',
              backgroundColor: '#000d6b',
              borderColor: '#000d6b',
              marginTop: '20px'
            }}
          >
            Submit Both Manual & Automation Data
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Nonagileform;
