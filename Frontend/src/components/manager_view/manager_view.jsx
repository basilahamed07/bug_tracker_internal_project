import React, { useState, useEffect } from 'react';
import { Table, Card, Modal, Button } from 'react-bootstrap';
import FixedChatBot from './Chatbot';

const ManagerView = () => {
  const [projects, setProjects] = useState([]);
  const [testers, setTesters] = useState([]);  // State to hold all testers
  const [projectName, setProjectName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(9); // Change from 3 to 9
  const [totalTesters, setTotalTesters] = useState({
    total: 0,
    billable: 0,
    nonBillable: 0
  });
  
  // Fetch project data
  useEffect(() => {
    fetchProjects();
    fetchAllTesters();  // Fetch all testers when the component loads
  }, []);
  
  // Fetch project details for the manager view
  const fetchProjects = async () => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await fetch('https://frt4cnbr-5000.inc1.devtunnels.ms/project-details-manager-view', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      setProjects(data.project_details);
      setProjectName(data.project_name);

      // Calculate totals from project_details
      const totalBillable = data.project_details.reduce((acc, project) => acc + project.billable.length, 0);
      const totalNonBillable = data.project_details.reduce((acc, project) => acc + project.nonbillable.length, 0);
      
      setTotalTesters({
        total: totalBillable + totalNonBillable,
        billable: totalBillable,
        nonBillable: totalNonBillable
      });

    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // Fetch all tester details from the provided API
  const fetchAllTesters = async () => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await fetch('https://frt4cnbr-5000.inc1.devtunnels.ms/tester_full_details', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      console.log("All Testers Data: ", data);
      const testerDetails = data.tester_details;
      const formattedTesters = Object.values(testerDetails).map(tester => ({
        ...tester,
        projects: tester.projects
      }));
      setTesters(formattedTesters);

      console.log("Testers Data: ", formattedTesters);
    } catch (error) {
      console.error('Error fetching testers:', error);
    }
  };

  // Render the RAG status with the appropriate class
  const getRagClass = (rag) => {
    switch (rag) {
      case 'Red':
        return 'bg-danger text-white';
      case 'Green':
        return 'bg-success text-white';
      case 'Amber':
        return 'bg-warning text-dark';
      default:
        return '';
    }
  };

  const handleModalOpen2= (title, content) => {
    setModalContent({ title, content });
    setShowModal(true);
  };


  // Handle modal opening with specific tester details
  const handleModalOpen = (testerName) => {
    // Access the tester details using the testerName
    const tester = testers.find(tester => tester.tester_name === testerName);

    if (!tester) {
      console.error('Tester details not found');
      return;
    }

    const { tester_name, Tester_id, projects } = tester;
  
    // Safe check for projects
    const projectList = projects || [];
  
    // Modal content
    const content = (
      <div>
        <h5>Tester Details</h5>
        <p><strong>Tester Name:</strong> {tester_name}</p>
        <p><strong>Tester ID:</strong> {Tester_id}</p>
  
        {/* Show project details only if there are projects */}
        {projectList.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Billable/Non-Billable</th>
              </tr>
            </thead>
            <tbody>
              {projectList.map((project, index) => (
                <tr key={index}>
                  <td>{project.project_name}</td>
                  <td>{project["Billable/Non billable"]}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No project details available.</p> // If no projects are found, show a message
        )}
      </div>
    );
  
    setModalContent({ title: `Details for ${tester_name}`, content });
    setShowModal(true);
  };
  
  const renderAutomation = (automation, automationDetails) => {
    return (
      <span
        className="badge bg-info text-white"
        style={{ cursor: 'pointer' }}
        onClick={() => handleModalOpen2('Automation Details', automation ? automationDetails : 'No automation details available')}
      >
        {automation ? 'True' : 'False'}
      </span>
    );
  };

  const renderAI = (aiUsed, aiDetails) => {
    return (
      <span
        className="badge bg-info text-white"
        style={{ cursor: 'pointer' }}
        onClick={() => handleModalOpen2('AI Details', aiUsed ? aiDetails : 'No AI details available')}
      >
        {aiUsed ? 'True' : 'False'}
      </span>
    );
  };

  const renderRag = (rag, ragDetails) => {
    return (
      <span
        className={`badge ${getRagClass(rag)}`}
        style={{ cursor: 'pointer' }}
        onClick={() => handleModalOpen2('RAG Status Details', ragDetails || 'No details available')}
      >
        {rag}
      </span>
    );
  };
  

  const handle_view_details = (project_name_id, agile) => {
    sessionStorage.setItem('project_name_id', project_name_id);

    if (agile) {
      window.location.href = `/ManagerView/ScrumDetails`;
    } else {
      window.location.href = `/ManagerView/Nonagileview`;
    }
  };

  // Calculate pagination
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mt-5">
      {/* Title at the top */}
      
      <center><h1>Quality Engineering Dashboard</h1></center><br></br>
      {/* Projects Table Card */}
      <Card className="mb-4">
        <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff', borderRadius: '10px 10px 0 0' }}>
        <center>Projects Status</center>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover style={{ borderRadius: '15px', overflow: 'hidden' }}>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Project Name</th>
                  <th>rag - Delivery</th>
                  <th>Test Execution Status</th>
                  <th>Tester Count</th>
                  <th>Billable</th>
                  <th>Nonbillable</th>
                  <th>Billing Type</th>
                  {/* <th>Automation?</th> */}
                  {/* <th>AI Used</th> */}
                  <th>Project Metrics TBD</th>
                  {/* <th>ai insight</th> */}
                </tr>
              </thead>
              <tbody>
                {currentProjects.map((project, index) => (
                  <tr key={project.id}>
                    <td>{indexOfFirstProject + index + 1}</td>
                    <td>{project.project_name}</td>
                    <td>{renderRag(project.rag, project.rag_details)}</td>
                    <td>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handle_view_details(project.project_name_id, project.agile);
                        }}
                      >
                        View Details
                      </a>
                    </td>
                    <td>
                      <a href={`/ManagerView/tester_count/${project.project_name_id}`} rel="noopener noreferrer">
                        {project.tester_count}
                      </a>
                    </td>
                    <td>{project.billable.length}</td>
                    <td>{project.nonbillable.length}</td>
                    <td>{project.billing_type || 'N/A'}</td>
                    {/* <td>{renderAutomation(project.automation, project.automation)}</td> */}
                    {/* <td>{renderAI(project.ai_used, project.ai_used)}</td> */}
                    <td>
                      <a href={`/ManagerView/project_metrics/${project.project_name_id}`} rel="noopener noreferrer">
                        View Metrics
                      </a>
                    </td>
                    {/* <td>
                      <a href={`/ManagerView/ai_insist/${project.project_name_id}`} rel="noopener noreferrer">
                        AI insight
                      </a>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Simple totals display */}
            <div className="mt-3 ms-2">
              <strong>Total Testers:</strong> {' '}
              <span className="text-primary">
                {totalTesters.total} ({totalTesters.billable} billable / {totalTesters.nonBillable} non-billable)
              </span>
            </div>
            
            {/* Add Pagination Controls */}
            {projects.length > 9 && (  // Only show pagination if more than 9 projects
              <div className="d-flex justify-content-center mt-3">
                <nav>
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                      <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
          )}            
          </div>
        </Card.Body>
      </Card>


      {/* Modal for detailed view */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent.content}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <FixedChatBot />
    </div>
  );
};

export default ManagerView;