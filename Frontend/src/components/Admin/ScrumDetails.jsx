import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap'; // Add this import
import './staticpage.css';

const ScrumDetails = () => {
    const [scrumDetails, setScrumDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [projectName, setProjectName] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const project_name_id = sessionStorage.getItem('project_name_id');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // Number of items per page

    const [showPIModal, setShowPIModal] = useState(false);
    const [selectedScrum, setSelectedScrum] = useState(null);
    const [piList, setPIList] = useState([]);
    const [selectedPI, setSelectedPI] = useState('');
    const [showCreatePIForm, setShowCreatePIForm] = useState(false);
    const [newPIName, setNewPIName] = useState('');

    useEffect(() => {
        const fetchScrumDetails = async () => {
            try {
                const token = sessionStorage.getItem('access_token');
                const response = await axios.get(`https://frt4cnbr-5000.inc1.devtunnels.ms/agile_details/${project_name_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                if (response.status !== 200) {
                    throw new Error('Failed to fetch data');
                }

                setScrumDetails(response.data);
                setProjectName(response.data[0].project_name);
                setIsLoading(false);
            } catch (error) {
                setError(error.message);
                setIsLoading(false);
            }
        };

        fetchScrumDetails();
    }, [project_name_id]);

    // Logic for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentScrums = scrumDetails.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Function to fetch PIs for selected scrum
    const fetchPIs = async (scrumId) => {
        try {
            const token = sessionStorage.getItem('access_token');
            const response = await axios.get(`https://frt4cnbr-5000.inc1.devtunnels.ms/get_pl_name/${scrumId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            setPIList(response.data);
        } catch (error) {
            console.error('Error fetching PIs:', error);
        }
    };

    // Handle scrum card click
    const handleScrumClick = async (scrum) => {
        setSelectedScrum(scrum);
        await fetchPIs(scrum.id);
        setShowPIModal(true);
    };

    // Modified handlePISubmit
    const handlePISubmit = () => {
        if (!selectedPI && !newPIName) {
            alert('Please either select an existing PI or create a new one');
            return;
        }

        const piNameToUse = selectedPI || newPIName;
        sessionStorage.setItem('screamId', selectedScrum.id);
        sessionStorage.setItem('piName', piNameToUse);
        navigate(`/ManagerView/SprintDetailsTable?team=${selectedScrum.scream_name}`);
        setShowPIModal(false);
    };

    if (isLoading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-danger">Error: {error}</div>;
    }

    return (
        <div className="container mt-4">
            <h2 className="text-center" style={{ color: "#000d6b" }}>
                Scrum Details - {projectName} {/* Display the project name here */}
            </h2>

            <div className="team-cards-container d-flex justify-content-center mb-4">
                {currentScrums.map((scrum, index) => (
                    <div
                        key={index}
                        className="card scrum-card shadow-lg p-3 mb-4"
                        style={{ width: '18rem', cursor: 'pointer', transition: 'transform 0.3s ease' }}
                        onClick={() => handleScrumClick(scrum)}
                    >
                        <div className="card-header text-white" style={{ backgroundColor: '#000d6b' }}>
                            <h5>{scrum.scream_name}</h5>
                        </div>

                        <div className="card-body" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', paddingLeft: '1.5rem' }}>
                            <h6>{scrum.tester_name}</h6>
                        </div>
                    </div>
                ))}
            </div>

            {/* PI Selection Modal */}
            <Modal show={showPIModal} onHide={() => setShowPIModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Program Increment (PI)</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {piList.length > 0 && (
                            <Form.Group className="mb-3">
                                <Form.Label>Select Existing PI</Form.Label>
                                <Form.Select
                                    value={selectedPI}
                                    onChange={(e) => {
                                        setSelectedPI(e.target.value);
                                        setShowCreatePIForm(false);
                                    }}
                                >
                                    <option value="">Select PI</option>
                                    {piList.map((pi, index) => (
                                        <option key={index} value={pi}>
                                            {pi}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        )}

                        {/* <div className="text-center my-3">
                            <span
                                onClick={() => {
                                    setShowCreatePIForm(true);
                                    setSelectedPI('');
                                }}
                                style={{
                                    color: '#000d6b',
                                    cursor: 'pointer',
                                    padding: '6px 12px',
                                    display: 'inline-block'
                                }}
                            >
                                Create New PI
                            </span>
                        </div> */}

                        {showCreatePIForm && (
                            <Form.Group className="mb-3">
                                <Form.Label>New PI Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter new PI name"
                                    value={newPIName}
                                    onChange={(e) => setNewPIName(e.target.value)}
                                />
                            </Form.Group>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPIModal(false)}>
                        Close
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handlePISubmit}
                        style={{
                            backgroundColor: '#000d6b',
                            borderColor: '#000d6b'
                        }}
                    >
                        Proceed
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="card">
                <div className="card-header" style={{ backgroundColor: '#000d6b', color: 'white' }}>
                    <h5>Scrum Members</h5>
                </div>
                <div className="card-body">
                    <table className="table table-bordered">
                        <thead className="table-light">
                            <tr>
                                <th>RESOURCE NAME</th>
                                <th>JOIN DATE</th>
                                <th>PRIOR EXP</th>
                                <th>CPT EXP</th>
                                <th>TOTAL EXP</th>
                                <th>SKILLS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentScrums.map((scrum, index) => (
                                <tr key={index}>
                                    <td>{scrum.tester_name}</td>
                                    <td>{new Date(scrum.join_date).toLocaleDateString()}</td>
                                    <td>{scrum.total_experience}</td>
                                    <td>{scrum.total_experience}</td> {/* Replace with actual CPT Experience if different */}
                                    <td>{scrum.total_experience}</td> {/* Replace with actual Total Experience if different */}
                                    <td>
                                        {scrum.skillset.map((skill, i) => (
                                            <span key={i} className="badge bg-info text-dark me-1">{skill}</span>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="pagination-container d-flex justify-content-center mt-3">
                <button
                    className="btn btn-primary mx-2"
                    style={{backgroundColor: '#000d6b' , color: 'white'}}
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="mt-2">Page {currentPage}</span>
                <button
                    className="btn btn-primary mx-2"
                    onClick={() => paginate(currentPage + 1)}
                    style={{backgroundColor: '#000d6b' , color: 'white'}}
                    disabled={currentPage * itemsPerPage >= scrumDetails.length}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ScrumDetails;
