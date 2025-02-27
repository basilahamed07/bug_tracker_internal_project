import React, { useState, useEffect } from 'react';
import { Card, Table, Alert, Spinner } from 'react-bootstrap';

const Nonagileview = () => {
  const [manualData, setManualData] = useState(null);
  const [automationData, setAutomationData] = useState(null);
  const [openDefects, setOpenDefects] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestingDetails = async () => {
      try {
        const token = sessionStorage.getItem('access_token');
        const projectId = sessionStorage.getItem('project_name_id');

        if (!token || !projectId) {
          throw new Error('Missing required session data');
        }

        // Fetch manual testing data
        const manualResponse = await fetch(
          `https://frt4cnbr-5000.inc1.devtunnels.ms/testing-type/manual/latest/${projectId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          }
        );

        // Fetch automation testing data
        const automationResponse = await fetch(
          `https://frt4cnbr-5000.inc1.devtunnels.ms/testing-type/automation/latest/${projectId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          }
        );

        // Fetch open defects data
        const defectsResponse = await fetch(
          `https://frt4cnbr-5000.inc1.devtunnels.ms/open_defact/${projectId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          }
        );

        if (!manualResponse.ok || !automationResponse.ok || !defectsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const manualResult = await manualResponse.json();
        const automationResult = await automationResponse.json();
        const defectsResult = await defectsResponse.json();

        setManualData(manualResult);
        setAutomationData(automationResult);
        setOpenDefects(defectsResult);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTestingDetails();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">Error: {error}</Alert>;
  }

  return (
    <div style={{ width: '80%', margin: 'auto' }}>
      <Card>
        <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff' }}>
          Test Case Summary
        </Card.Header>
        <Card.Body>
          {/* Manual Test Case Summary */}
          <div>
            <h5>Manual Test Case Details</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Total Test Cases</th>
                  <th>Test Cases Executed</th>
                  <th>Passed</th>
                  <th>Failed</th>
                  <th>Open Defects</th>
                </tr>
              </thead>
              <tbody>
                {manualData ? (
                  <tr>
                    <td>{manualData.total_testcase}</td>
                    <td>{manualData.tcexecution}</td>
                    <td>{manualData.passed}</td>
                    <td>{manualData.fail}</td>
                    <td>{manualData.opendefact}</td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">No manual testing data available</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Automation Test Case Summary */}
          <div style={{ marginTop: '30px' }}>
            <h5>Automation Test Case Details</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Total Test Cases</th>
                  <th>Test Cases Executed</th>
                  <th>Passed</th>
                  <th>Failed</th>
                  <th>Open Defects</th>
                </tr>
              </thead>
              <tbody>
                {automationData ? (
                  <tr>
                    <td>{automationData.total_testcase}</td>
                    <td>{automationData.tcexecution}</td>
                    <td>{automationData.passed}</td>
                    <td>{automationData.fail}</td>
                    <td>{automationData.opendefact}</td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">No automation testing data available</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Open Defects Summary */}
          <div style={{ marginTop: '30px' }}>
            <h5>Open Defect Details</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Total Defects</th>
                  <th>Critical</th>
                  <th>High</th>
                  <th>Medium</th>
                  <th>Low</th>
                </tr>
              </thead>
              <tbody>
                {openDefects ? (
                  <tr>
                    <td>{openDefects.total_defect}</td>
                    <td>{openDefects.critical}</td>
                    <td>{openDefects.high}</td>
                    <td>{openDefects.medium}</td>
                    <td>{openDefects.low}</td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">No defect data available</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Nonagileview;
