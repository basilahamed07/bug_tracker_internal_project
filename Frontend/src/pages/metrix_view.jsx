import React, { useState, useEffect } from 'react';
import { Table, Card, Row, Col, Button, Form } from 'react-bootstrap'; // Import Bootstrap components
import axios from 'axios'; // Import Axios

function MatrixView() {
  const [projects, setProjects] = useState([]); // Store the projects array
  const [selectedProjectId, setSelectedProjectId] = useState(null); // Store the selected project ID
  const [matrixData, setMatrixData] = useState([]); // Store the matrix data
  const [error, setError] = useState(''); // Store any errors
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch the list of projects from the server
  useEffect(() => {
    const fetchProjects = async () => {
      const token = sessionStorage.getItem('access_token');
      if (!token) {
        setError('Please log in to access this data.');
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get('https://frt4cnbr-5000.inc1.devtunnels.ms/project-details', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const projectsData = response.data.project_details.map(project => ({
          project_name: project.project_name,
          project_name_id: project.project_name_id
        }));

        setProjects(projectsData); // Update the state with the extracted data
      } catch (err) {
        setError(err.message);
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Fetch matrix data for the selected project
  useEffect(() => {
    if (!selectedProjectId) return; // Don't fetch if no project is selected
    const fetchMatrixData = async () => {
      const token = sessionStorage.getItem('access_token');
      if (!token) {
        setError('Please log in to access this data.');
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`https://frt4cnbr-5000.inc1.devtunnels.ms/get-matrix-inputs/${selectedProjectId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setMatrixData(response.data); // Update the matrix data state
      } catch (err) {
        if (err.response && err.response.status === 403) {
          setError('Matrix data not found for the given project name and month.');
        } else {
          setError('Failed to load matrix data.');
        }
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatrixData();
  }, [selectedProjectId]);

  // Handle project selection from the dropdown
  const handleProjectSelect = (event) => {
    setSelectedProjectId(event.target.value); // Update the selected project ID
  };

  // Handle delete request for matrix data with confirmation
  const handleDelete = async (id) => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
      setError('Please log in to delete data.');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this matrix data?');
    if (!confirmed) return; // If user clicks "No", do nothing

    try {
      const response = await axios.delete(`https://frt4cnbr-5000.inc1.devtunnels.ms/delete-matrix-inputs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        // Remove the deleted item from the state
        setMatrixData(matrixData.filter(item => item.id !== id));
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError('Matrix data not found for the given project name and month.');
      } else {
        setError('Failed to delete matrix data.');
      }
      console.error('Error deleting matrix data:', err.message);
    }
  };

  // Function to format the date to dd-mm-yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="container mt-5">
      <Row className="mt-4">
        <Col xs={12}>
          <h2>Matrix Data</h2>
        </Col>
      </Row>

      {/* Dropdown for selecting a project */}
      <Row className="mb-4">
        <Col xs={12} md={6}>
          <Form.Select
            aria-label="Select Project"
            onChange={handleProjectSelect}
            value={selectedProjectId}
            disabled={loading}
          >
            <option value="">Select a Project</option>
            {projects.map((project) => (
              <option key={project.project_name_id} value={project.project_name_id}>
                {project.project_name}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Loading Spinner */}
      {loading && <div className="alert alert-info">Loading...</div>}

      {/* Render matrix data in a table */}
      {selectedProjectId && matrixData.length > 0 && (
        <Card className="mb-4">
          <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff', borderRadius: '10px 10px 0 0' }}>
            Matrix Data for Project ID {selectedProjectId}
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover style={{ borderRadius: '15px', overflow: 'hidden' }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Defect Leakage</th>
                  <th>Defect Density</th>
                  <th>Defect Fix Rate</th>
                  <th>Defect Rejection Ratio</th>
                  <th>Defect Removal Efficiency</th>
                  <th>Defect Severity Index</th>
                  <th>Mean Time To Find Defect</th>
                  <th>Mean Time To Repair</th>
                  <th>Test Cases Efficiency</th>
                  <th>Tester Productivity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {matrixData.map(item => (
                  <tr key={item.id}>
                    <td>{formatDate(item.date)}</td> {/* Format the date */}
                    <td>{item.defectleakage.toFixed(2)}</td>
                    <td>{item.defectdensity.toFixed(2)}</td>
                    <td>{item.defectfixrate.toFixed(2)}</td>
                    <td>{item.defectrejectionratio.toFixed(2)}</td>
                    <td>{item.defectremovalefficiency.toFixed(2)}</td>
                    <td>{item.defectseverityindex.toFixed(2)}</td>
                    <td>{item.meantimetofinddefect.toFixed(2)}</td>
                    <td>{item.meantimetorepair.toFixed(2)}</td>
                    <td>{item.testcasesefficiency.toFixed(2)}</td>
                    <td>{item.testerproductivity.toFixed(2)}</td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(item.id)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Message when no matrix data is found */}
      {selectedProjectId && matrixData.length === 0 && !loading && (
        <div className="alert alert-warning">No matrix data available for this project.</div>
      )}
    </div>
  );
}

export default MatrixView;
