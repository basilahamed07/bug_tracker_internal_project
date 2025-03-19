import React, { useState, useEffect } from 'react';
import { Table, Card, Row, Col, Spinner, Button } from 'react-bootstrap'; // Import Bootstrap components
import axios from 'axios'; // Import Axios
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate

const TestersDetails = () => {
  const { projectNameId } = useParams(); // Get projectNameId from the URL
  const navigate = useNavigate(); // Initialize navigate function

  const [testersData, setTestersData] = useState([]);
  const [billableTesters, setBillableTesters] = useState([]);
  const [nonBillableTesters, setNonBillableTesters] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state

  useEffect(() => {
    if (projectNameId) {
      console.log('Project ID from URL:', projectNameId); // Debugging log
      fetchTestersData(projectNameId);
    }
  }, [projectNameId]);

  const fetchTestersData = async (projectId) => {
    try {
      const accessToken = sessionStorage.getItem('access_token'); // Retrieve the access token

      if (!accessToken) {
        setError('No access token found. Please log in again.');
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const apiUrl = `https://frt4cnbr-5000.inc1.devtunnels.ms/project-base-billable/${projectId}`;
      const response = await axios.get(apiUrl, config);

      if (response.status === 200) {
        const data = response.data.tester_info || [];
        setTestersData(data);
        setBillableTesters(data.filter(tester => tester.billable === true));
        setNonBillableTesters(data.filter(tester => tester.billable === false));
      } else {
        setError(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch tester data. Please check your connection or try again later.');
    } finally {
      setLoading(false); // Stop loading after the request completes
    }
  };

  const renderTable = (data, title) => {
    return (
      <Card>
        <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff', borderRadius: '10px 10px 0 0' }}>
          {title}
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover style={{ borderRadius: '15px', overflow: 'hidden' }}>
            <thead>
              <tr>
                <th>Tester Name</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((tester, index) => (
                  <tr key={tester.id || index}>
                    <td>{tester.tester_name || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="1" className="text-center">No data available</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading tester details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/* Heading for Tester Details */}
      <Row className="mb-4">
        <Col>
          <h2>Team Members</h2>
        </Col>
      </Row>

      {/* Back Button in a row */}
      <Row className="mb-4">
        <Col className="d-flex justify-content-start">
          {/* Back Button, smaller size, on the left side */}
          <Button variant="primary" onClick={() => navigate(-1)} className="btn-sm"
            style={{ backgroundColor: '#000d6b', color: '#ffffff' }}>
            Go Back
          </Button>
        </Col>
      </Row>

      {/* Render tables for billable and non-billable testers */}
      <Row className="mb-4">
        <Col md={6}>
          {renderTable(billableTesters, 'Billable')}
        </Col>
        <Col md={6}>
          {renderTable(nonBillableTesters, 'Non-Billable')}
        </Col>
      </Row>
    </div>
  );
};

export default TestersDetails;
