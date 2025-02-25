import React from 'react';
import { Card, Table } from 'react-bootstrap';

const Nonagileview = () => {
  // Static data for manual and automation test cases
  const manualData = {
    totalTestCases: 120,
    testCasesExecuted: 110,
    passed: 100,
    failed: 10,
    openDefect: 5
  };

  const automationData = {
    totalTestCases: 150,
    testCasesExecuted: 140,
    passed: 130,
    failed: 10,
    openDefect: 3
  };

  // Static data for open defects
  const openDefects = {
    totalDefect: 20,
    critical: 2,
    high: 5,
    medium: 8,
    low: 5
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
                <tr>
                  <td>{manualData.totalTestCases}</td>
                  <td>{manualData.testCasesExecuted}</td>
                  <td>{manualData.passed}</td>
                  <td>{manualData.failed}</td>
                  <td>{manualData.openDefect}</td>
                </tr>
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
                <tr>
                  <td>{automationData.totalTestCases}</td>
                  <td>{automationData.testCasesExecuted}</td>
                  <td>{automationData.passed}</td>
                  <td>{automationData.failed}</td>
                  <td>{automationData.openDefect}</td>
                </tr>
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
                <tr>
                  <td>{openDefects.totalDefect}</td>
                  <td>{openDefects.critical}</td>
                  <td>{openDefects.high}</td>
                  <td>{openDefects.medium}</td>
                  <td>{openDefects.low}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Nonagileview;
