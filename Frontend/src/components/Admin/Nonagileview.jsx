import React, { useState, useEffect } from 'react';
import { Card, Table, Alert, Spinner } from 'react-bootstrap';

const Nonagileview = () => {
  const [testingData, setTestingData] = useState(null);
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

        const response = await fetch(
          `https://h25ggll0-5000.inc1.devtunnels.ms/testing-type/${projectId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          }
        );
        console.log("response is",response);

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();
        setTestingData(result);
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

  const getLatestDefectDetails = () => {
    if (!testingData?.defect_details || testingData.defect_details.length === 0) {
      return null;
    }
    return testingData.defect_details[testingData.defect_details.length - 1];
  };

  const getTestingDataByType = (type) => {
    return testingData?.testing_entries?.find(entry => entry.type_of_testing === type);
  };

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
                {testingData ? (
                  <tr>
                    {(() => {
                      const manualData = getTestingDataByType('Manual');
                      return manualData ? (
                        <>
                          <td>{manualData.total_testcase}</td>
                          <td>{manualData.tcexecution}</td>
                          <td>{manualData.passed}</td>
                          <td>{manualData.fail}</td>
                          <td>{manualData.opendefact}</td>
                        </>
                      ) : (
                        <td colSpan="5" className="text-center">No manual testing data available</td>
                      );
                    })()}
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">Loading...</td>
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
                {testingData ? (
                  <tr>
                    {(() => {
                      const automationData = getTestingDataByType('Automation');
                      return automationData ? (
                        <>
                          <td>{automationData.total_testcase}</td>
                          <td>{automationData.tcexecution}</td>
                          <td>{automationData.passed}</td>
                          <td>{automationData.fail}</td>
                          <td>{automationData.opendefact}</td>
                        </>
                      ) : (
                        <td colSpan="5" className="text-center">No automation testing data available</td>
                      );
                    })()}
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">Loading...</td>
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
                {testingData ? (
                  <tr>
                    {(() => {
                      const defect_details = getLatestDefectDetails();
                      return defect_details ? (
                        <>
                          <td>{defect_details.total_defect}</td>
                          <td>{defect_details.critical}</td>
                          <td>{defect_details.high}</td>
                          <td>{defect_details.medium}</td>
                          <td>{defect_details.low}</td>
                        </>
                      ) : (
                        <td colSpan="5" className="text-center">No defect data available</td>
                      );
                    })()}
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">Loading...</td>
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
