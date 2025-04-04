import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Add this import

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

  // Add new state for Open Defect Details
  const [openDefectDetails, setOpenDefectDetails] = useState({
    totalDefects: 0,
    critical: '',
    high: '',
    medium: '',
    low: ''
  });

  // Add state for validation errors
  const [defectErrors, setDefectErrors] = useState('');

  // Calculate total defects whenever manual or automation data changes
  useEffect(() => {
    const totalDefects = Number(manualData.openDefect || 0) + Number(automationData.openDefect || 0);
    setOpenDefectDetails(prev => ({
      ...prev,
      totalDefects
    }));
  }, [manualData.openDefect, automationData.openDefect]);

  const navigate = useNavigate(); // Initialize useNavigate hook

  // Add effect to check session data on component mount
  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    const projectId = sessionStorage.getItem('projectID');
    // const userId = sessionStorage.getItem('user_id');

    if (!token || !projectId) {
      alert('Session data is incomplete. Please ensure you are logged in and have selected a project.');
      navigate('/AdminPanel/project-info'); // Navigate back to project selection
      return;
    }
  }, [navigate]);

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

  // Handle change for Open Defect Details form with validation
  const handleDefectDetailsChange = (e) => {
    const { name, value } = e.target;
    const numValue = Number(value || 0);

    // Update the specific field
    setOpenDefectDetails(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculate sum of all severity levels
    const newValues = {
      ...openDefectDetails,
      [name]: numValue
    };

    const totalSeverity = Number(newValues.critical || 0) +
                         Number(newValues.high || 0) +
                         Number(newValues.medium || 0) +
                         Number(newValues.low || 0);

    // Validate against total defects
    if (totalSeverity > openDefectDetails.totalDefects) {
      setDefectErrors('Sum of defects by severity cannot exceed total defects');
    } else {
      setDefectErrors('');
    }
  };

  // Handle form submission for Manual and Automation data
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate defect totals
    const totalSeverity = Number(openDefectDetails.critical || 0) +
                         Number(openDefectDetails.high || 0) +
                         Number(openDefectDetails.medium || 0) +
                         Number(openDefectDetails.low || 0);

    if (totalSeverity !== openDefectDetails.totalDefects) {
      setDefectErrors('Sum of defects by severity must equal total defects');
      return;
    }

    // Get session data with error handling
    const token = sessionStorage.getItem('access_token');
    const projectNameId = sessionStorage.getItem('projectID');
    // const userId = sessionStorage.getItem('user_id');


    // Enhanced session data validation
    if (!token) {
      alert('Authentication token not found. Please login again.');
      navigate('/login');
      return;
    }

    if (!projectNameId) {
      alert('Project ID not found. Please select a project first.');
      navigate('/AdminPanel/project-info');
      return;
    }

    // Format the data as integers and handle empty values
    const formatData = (data) => ({
      total_testcase: parseInt(data.totalTestCases) || 0,
      tcexecution: parseInt(data.testCasesExecuted) || 0,
      passed: parseInt(data.passed) || 0,
      fail: parseInt(data.failed) || 0,
      opendefact: parseInt(data.openDefect) || 0
    });

    // Get current date and month
    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'long' });

    const payload = {
      testing_details: [{
        ...formatData(manualData),
        type_of_testing: 'Manual',
        project_name_id: parseInt(projectNameId),
        // user_id: parseInt(userId)
      },
      {
        ...formatData(automationData),
        type_of_testing: 'Automation',
        project_name_id: parseInt(projectNameId),
        // user_id: parseInt(userId)
      }],
      defect_details: {
        total_defects: parseInt(openDefectDetails.totalDefects) || 0,
        critical: parseInt(openDefectDetails.critical) || 0,
        high: parseInt(openDefectDetails.high) || 0,
        medium: parseInt(openDefectDetails.medium) || 0,
        low: parseInt(openDefectDetails.low) || 0,
        project_name_id: parseInt(projectNameId),
        month: month,
        date: currentDate.toISOString().split('T')[0],
        defect_closed: 0, // Default value
        open_defect: parseInt(openDefectDetails.totalDefects) || 0 // Same as total defects initially
      }
    };

    try {
      const response = await fetch('https://h25ggll0-5000.inc1.devtunnels.ms/testing-type', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      alert('Testing details submitted successfully!');

      // Reset all forms
      setManualData({
        totalTestCases: '',
        testCasesExecuted: '',
        passed: '',
        failed: '',
        openDefect: ''
      });
      setAutomationData({
        totalTestCases: '',
        testCasesExecuted: '',
        passed: '',
        failed: '',
        openDefect: ''
      });
      setOpenDefectDetails({
        totalDefects: 0,
        critical: '',
        high: '',
        medium: '',
        low: ''
      });

      navigate('/AdminPanel/ManageDefects');
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Error submitting data: ' + error.message);
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

          {/* Open Defect Details Form */}
          <div style={{ marginTop: '30px' }}>
            <h5>Open Defect Details</h5>
            <Form>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Total Defects</Form.Label>
                    <Form.Control
                      type="number"
                      value={openDefectDetails.totalDefects}
                      disabled
                    />
                    <Form.Text className="text-muted">
                      Sum of open defects from Manual and Automation testing
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Critical</Form.Label>
                    <Form.Control
                      type="number"
                      name="critical"
                      value={openDefectDetails.critical}
                      onChange={handleDefectDetailsChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>High</Form.Label>
                    <Form.Control
                      type="number"
                      name="high"
                      value={openDefectDetails.high}
                      onChange={handleDefectDetailsChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Medium</Form.Label>
                    <Form.Control
                      type="number"
                      name="medium"
                      value={openDefectDetails.medium}
                      onChange={handleDefectDetailsChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Low</Form.Label>
                    <Form.Control
                      type="number"
                      name="low"
                      value={openDefectDetails.low}
                      onChange={handleDefectDetailsChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {defectErrors && (
                <div className="text-danger mb-3">{defectErrors}</div>
              )}
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
