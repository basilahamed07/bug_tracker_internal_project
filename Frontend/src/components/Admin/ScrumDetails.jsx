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
    const [billableData, setBillableData] = useState({});

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // Number of items per page

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem('access_token');
                
                // Fetch scrum details
                const scrumResponse = await axios.get(
                  `https://frt4cnbr-5000.inc1.devtunnels.ms/agile_details/${project_name_id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    }
                  }
                );
        
                setScrumDetails(scrumResponse.data);
                setProjectName(scrumResponse.data[0]?.project_name);
        
                // Fetch billable status with updated handling
                const billableResponse = await axios.get(
                  `https://frt4cnbr-5000.inc1.devtunnels.ms/project-base-billable/${project_name_id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    }
                  }
                );

                // Create a map using tester_name instead of id
                const billableMap = {};
                if (billableResponse.data && billableResponse.data.tester_info) {
                    billableResponse.data.tester_info.forEach(tester => {
                        billableMap[tester.tester_name] = tester.billable;
                    });
                }
                
                setBillableData(billableMap);
                console.log('Billable Data:', billableMap);
                console.log('Scrum Details:', scrumResponse.data);
        
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [project_name_id]);

    // Logic for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentScrums = scrumDetails.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Modified handleScrumClick - simplified to just store scrum ID and navigate
    const handleScrumClick = (scrum) => {
        sessionStorage.setItem('screamId', scrum.id);
        navigate('/ManagerView/SprintDetailsTable');
    };

    // Add function to calculate total experience
    const calculateTotalExp = (priorExp, cptExp) => {
        const prior = parseFloat(priorExp) || 0;
        const cpt = parseFloat(cptExp) || 0;
        return (prior + cpt).toFixed(1); // Round to 1 decimal place
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
                Project Information - {projectName} {/* Display the project name here */}
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
                                <th>BILLABLE STATUS</th> {/* New column */}
                            </tr>
                        </thead>
                        <tbody>
                            {currentScrums.map((scrum, index) => {
                                console.log('Scrum:', scrum);
                                console.log('Billable status for ID:', scrum.id, billableData[scrum.tester_name]);
                                
                                // Calculate total experience
                                const totalExp = calculateTotalExp(scrum.total_experience, scrum.total_experience);
                                
                                return (
                                    <tr key={index}>
                                        <td>{scrum.tester_name}</td>
                                        <td>{new Date(scrum.join_date).toLocaleDateString()}</td>
                                        <td>{scrum.total_experience}</td> {/* Prior Experience */}
                                        <td>{scrum.total_experience}</td> {/* CPT Experience */}
                                        <td>{totalExp}</td> {/* Total Experience (Prior + CPT) */}
                                        <td>
                                            {scrum.skillset.map((skill, i) => (
                                                <span key={i} className="badge bg-info text-dark me-1">{skill}</span>
                                            ))}
                                        </td>
                                        <td>
                                            <span 
                                                className={`badge ${billableData[scrum.tester_name] ? 'bg-success' : 'bg-warning'}`}
                                                style={{ fontSize: '0.9em' }}
                                            >
                                                {billableData[scrum.tester_name] ? 'Billable' : 'Non-Billable'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modified Pagination Controls - Only show if there's more than one page */}
            {scrumDetails.length > itemsPerPage && (
                <div className="pagination-container d-flex justify-content-center mt-3">
                    {currentPage > 1 && (
                        <button
                            className="btn btn-primary mx-2"
                            style={{backgroundColor: '#000d6b', color: 'white'}}
                            onClick={() => paginate(currentPage - 1)}
                        >
                            Previous
                        </button>
                    )}
                    <span className="mt-2">Page {currentPage}</span>
                    {currentPage * itemsPerPage < scrumDetails.length && (
                        <button
                            className="btn btn-primary mx-2"
                            style={{backgroundColor: '#000d6b', color: 'white'}}
                            onClick={() => paginate(currentPage + 1)}
                        >
                            Next
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ScrumDetails;
