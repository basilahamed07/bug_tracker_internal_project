import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // Import useParams hook
import { Table, Card } from 'react-bootstrap';

const NonAgile = () => {
  const { project_name_id } = useParams(); // Use useParams to get project_name_id

  const [manualData, setManualData] = useState(null);
  const [automationData, setAutomationData] = useState(null);
  const [openDefactData, setOpenDefactData] = useState(null);

  const [manualError, setManualError] = useState(false);
  const [automationError, setAutomationError] = useState(false);
  const [openDefactError, setOpenDefactError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem('access_token');
    
      if (!token) {
        console.error('No access token found in session storage');
        return;
      }
    
      try {
        // Fetch Manual Testing data
        const manualResponse = await fetch(
          `http://localhost:5000/testing-type/manual/latest/${project_name_id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (manualResponse.ok) {
          const manualJson = await manualResponse.json();
          setManualData(manualJson);
        } else if (manualResponse.status === 404) {
          setManualError(true); // Set error flag when 404
        } else {
          console.error('Failed to fetch manual testing data:', manualResponse);
        }
    
        // Fetch Automation Testing data
        const automationResponse = await fetch(
          `http://localhost:5000/testing-type/automation/latest/${project_name_id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (automationResponse.ok) {
          const automationJson = await automationResponse.json();
          setAutomationData(automationJson);
        } else if (automationResponse.status === 404) {
          setAutomationError(true); // Set error flag when 404
        } else {
          console.error('Failed to fetch automation testing data:', automationResponse);
        }
    
        // Fetch Open Defact data
        const openDefactResponse = await fetch(
          `http://localhost:5000/open_defact/${project_name_id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (openDefactResponse.ok) {
          const openDefactJson = await openDefactResponse.json();
          setOpenDefactData(openDefactJson);
        } else if (openDefactResponse.status === 404) {
          setOpenDefactError(true); // Set error flag when 404
        } else {
          console.error('Failed to fetch open defect data:', openDefactResponse);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, [project_name_id]);

  if (!manualData && !automationData && !openDefactData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <Card className="mb-4">
        <Card.Body>
          <h2>Non-Agile Testing Dashboard</h2>
        </Card.Body>
      </Card>

      {/* Render Manual Testing Table only if data is available */}
      {!manualError && manualData && (
        <Card className="mb-4">
          <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff' }}>
            Manual Testing
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Fail</th>
                  <th>Open Defact</th>
                  <th>Passed</th>
                  <th>Test Execution</th>
                  <th>Total Testcase</th>
                  <th>Type of Testing</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{manualData.fail}</td>
                  <td>{manualData.opendefact}</td>
                  <td>{manualData.passed}</td>
                  <td>{manualData.tcexecution}</td>
                  <td>{manualData.total_testcase}</td>
                  <td>{manualData.type_of_testing}</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Render Automation Testing Table only if data is available */}
      {!automationError && automationData && (
        <Card className="mb-4">
          <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff' }}>
            Automation Testing
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Fail</th>
                  <th>Open Defact</th>
                  <th>Passed</th>
                  <th>Test Execution</th>
                  <th>Total Testcase</th>
                  <th>Type of Testing</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{automationData.fail}</td>
                  <td>{automationData.opendefact}</td>
                  <td>{automationData.passed}</td>
                  <td>{automationData.tcexecution}</td>
                  <td>{automationData.total_testcase}</td>
                  <td>{automationData.type_of_testing}</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Render Open Defact Table only if data is available */}
      {!openDefactError && openDefactData && (
        <Card className="mb-4">
          <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff' }}>
            Open Defact
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Critical</th>
                  <th>High</th>
                  <th>Low</th>
                  <th>Medium</th>
                  <th>Total Defact</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{openDefactData.critical}</td>
                  <td>{openDefactData.high}</td>
                  <td>{openDefactData.low}</td>
                  <td>{openDefactData.medium}</td>
                  <td>{openDefactData.total_defect}</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default NonAgile;
