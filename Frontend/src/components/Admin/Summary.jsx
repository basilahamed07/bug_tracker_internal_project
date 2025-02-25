// import React, { useState, useEffect } from 'react';
// import { Card, Button, Form, Container, Modal } from 'react-bootstrap';
// import { FaChartLine, FaArrowRight } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
// import ManageBuzz from './SummaryProjects';  // Assuming ManageBuzz is in the same folder

// const Summary = () => {
//   const [showModal, setShowModal] = useState(false);  // State to manage modal visibility

//   const navigate = useNavigate(); // Initialize useNavigate

//   // Function to handle button click and navigate
//   const handleDefectsNavigate = () => {
//     // Navigate logic (for 'Defects' button, as in your code)
//     const summaryId = sessionStorage.getItem('Summary_id');
//     if (summaryId) {
//       navigate(`/ManagerView/full_test_details/${summaryId}`);
//     } else {
//       console.error("Summary_id not found in sessionStorage.");
//     }
//   };
//   // Function to handle button click and navigate
//   const handleManualNavigate = () => {
//     // Navigate logic (for 'Defects' button, as in your code)
//     const summaryId = sessionStorage.getItem('Summary_id');
//     if (summaryId) {
//       navigate(`/ManagerView/full_test_details/${summaryId}`);
//     } else {
//       console.error("Summary_id not found in sessionStorage.");
//     }
//   };
//   // Function to handle button click and navigate
//   const handleAutomationNavigate = () => {
//     // Navigate logic (for 'Defects' button, as in your code)
//     const summaryId = sessionStorage.getItem('Summary_id');
//     if (summaryId) {
//       navigate(`/ManagerView/full_test_details/${summaryId}`);
//     } else {
//       console.error("Summary_id not found in sessionStorage.");
//     }
//   };
//   // Function to handle button click and navigate
//   const handleSecurityNavigate = () => {
//     // Navigate logic (for 'Defects' button, as in your code)
//     const summaryId = sessionStorage.getItem('Summary_id');
//     if (summaryId) {
//       navigate(`/ManagerView/full_test_details/${summaryId}`);
//     } else {
//       console.error("Summary_id not found in sessionStorage.");
//     }
//   };

//   // Toggle modal visibility
//   const handleModalClose = () => setShowModal(false);
//   const handleModalShow = () => setShowModal(true);


//   return (
//     <Container fluid className="mt-5">
//       <Card className="shadow-lg">
//         <Card.Header
//           as="h5"
//           style={{
//             background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
//             color: '#ffffff',
//             borderRadius: '10px 10px 0 0',
//             padding: '1.5rem',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             fontWeight: 'bold',
//             fontSize: '1.25rem'
//           }}
//         >
//           <div className="d-flex align-items-center">
//             <FaChartLine className="mr-2" style={{ fontSize: '1.5rem' }} />
//             Test Metrics Overview
//           </div>
//           <Button
//             variant="outline-light"
//             style={{
//               backgroundColor: 'transparent',
//               borderColor: '#ffffff',
//               padding: '0.5rem 1rem',
//               borderRadius: '50px',
//               fontWeight: 'bold',
//               textTransform: 'uppercase'
//             }}
//             onClick={handleModalShow} // Open modal on button click
//           >
//             View Project
//           </Button>
//         </Card.Header>

//         <Card.Body
//           style={{
//             backgroundColor: '#f9f9f9',
//             borderRadius: '0 0 10px 10px',
//             padding: '2rem'
//           }}
//         >
//           {/* Test Execution Metrics Section */}
//           <Card className="border-light shadow-sm rounded-lg mb-4">
//             <Card.Body>
//               <h5 className="font-weight-bold text-primary mb-4">Test Execution Metrics</h5>

//               <Form.Group className="mb-3">
//                 <Form.Label>Total Test Cases Executed Manually</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value="60%"
//                   disabled
//                   style={{
//                     backgroundColor: '#eaf4ff',
//                     borderColor: '#0085FF',
//                     borderRadius: '10px',
//                     fontWeight: 'bold',
//                     fontSize: '1.1rem'
//                   }}
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Total Test Cases Executed - Automation</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value="30%"
//                   disabled
//                   style={{
//                     backgroundColor: '#eaf4ff',
//                     borderColor: '#0085FF',
//                     borderRadius: '10px',
//                     fontWeight: 'bold',
//                     fontSize: '1.1rem'
//                   }}
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Test Cases Passed</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value="85%"
//                   disabled
//                   style={{
//                     backgroundColor: '#eaf4ff',
//                     borderColor: '#28a745',
//                     borderRadius: '10px',
//                     fontWeight: 'bold',
//                     fontSize: '1.1rem'
//                   }}
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Test Cases Failed</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value="10%"
//                   disabled
//                   style={{
//                     backgroundColor: '#eaf4ff',
//                     borderColor: '#dc3545',
//                     borderRadius: '10px',
//                     fontWeight: 'bold',
//                     fontSize: '1.1rem'
//                   }}
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Test Cases Blocked</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value="5%"
//                   disabled
//                   style={{
//                     backgroundColor: '#eaf4ff',
//                     borderColor: '#ffc107',
//                     borderRadius: '10px',
//                     fontWeight: 'bold',
//                     fontSize: '1.1rem'
//                   }}
//                 />
//               </Form.Group>
//             </Card.Body>
//           </Card>

//           {/* Defect Metrics Section */}
//           <Card className="border-light shadow-sm rounded-lg mb-4">
//             <Card.Body>
//               <h5 className="font-weight-bold text-primary mb-4">Defect Metrics</h5>

//               <Form.Group className="mb-3">
//                 <Form.Label>Total Defects Identified</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value="45"
//                   disabled
//                   style={{
//                     backgroundColor: '#f8d7da',
//                     borderColor: '#dc3545',
//                     borderRadius: '10px',
//                     fontWeight: 'bold',
//                     fontSize: '1.1rem'
//                   }}
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Defect Distribution</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value="Critical: 5, High: 10, Medium: 20, Low: 10"
//                   disabled
//                   style={{
//                     backgroundColor: '#eaf4ff',
//                     borderColor: '#0085FF',
//                     borderRadius: '10px',
//                     fontWeight: 'bold',
//                     fontSize: '1.1rem'
//                   }}
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Defect Resolution Rate</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value="80%"
//                   disabled
//                   style={{
//                     backgroundColor: '#eaf4ff',
//                     borderColor: '#28a745',
//                     borderRadius: '10px',
//                     fontWeight: 'bold',
//                     fontSize: '1.1rem'
//                   }}
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Avg Time to Resolve Defects</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value="72 hrs"
//                   disabled
//                   style={{
//                     backgroundColor: '#eaf4ff',
//                     borderColor: '#ffc107',
//                     borderRadius: '10px',
//                     fontWeight: 'bold',
//                     fontSize: '1.1rem'
//                   }}
//                 />
//               </Form.Group>
//             </Card.Body>
//           </Card>

//           {/* Automation Metrics Section */}
//           <Card className="border-light shadow-sm rounded-lg mb-4">
//             <Card.Body>
//               <h5 className="font-weight-bold text-primary mb-4">Automation Metrics</h5>

//               <Form.Group className="mb-3">
//                 <Form.Label>Percentage of Automation Coverage</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value="50%"
//                   disabled
//                   style={{
//                     backgroundColor: '#eaf4ff',
//                     borderColor: '#0085FF',
//                     borderRadius: '10px',
//                     fontWeight: 'bold',
//                     fontSize: '1.1rem'
//                   }}
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Time Saved Through Automation</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value="150 hrs"
//                   disabled
//                   style={{
//                     backgroundColor: '#eaf4ff',
//                     borderColor: '#28a745',
//                     borderRadius: '10px',
//                     fontWeight: 'bold',
//                     fontSize: '1.1rem'
//                   }}
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>New Scripts Developed</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value="10"
//                   disabled
//                   style={{
//                     backgroundColor: '#eaf4ff',
//                     borderColor: '#0085FF',
//                     borderRadius: '10px',
//                     fontWeight: 'bold',
//                     fontSize: '1.1rem'
//                   }}
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Execution Success Rate</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value="95%"
//                   disabled
//                   style={{
//                     backgroundColor: '#eaf4ff',
//                     borderColor: '#28a745',
//                     borderRadius: '10px',
//                     fontWeight: 'bold',
//                     fontSize: '1.1rem'
//                   }}
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Average Scripting Effort</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value="5 hrs"
//                   disabled
//                   style={{
//                     backgroundColor: '#eaf4ff',
//                     borderColor: '#ffc107',
//                     borderRadius: '10px',
//                     fontWeight: 'bold',
//                     fontSize: '1.1rem'
//                   }}
//                 />
//               </Form.Group>
//             </Card.Body>
//           </Card>

//           {/* Coverage Metrics Section */}
//           <Card className="border-light shadow-sm rounded-lg mb-4">
//             <Card.Body>
//               <h5 className="font-weight-bold text-primary mb-4">Coverage Metrics</h5>

//               <Form.Group className="mb-3">
//                 <Form.Label>Areas/Modules with Highest Defect Rates</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value="Module A: 25 defects, Module B: 15 defects"
//                   disabled
//                   style={{
//                     backgroundColor: '#f8d7da',
//                     borderColor: '#dc3545',
//                     borderRadius: '10px',
//                     fontWeight: 'bold',
//                     fontSize: '1.1rem'
//                   }}
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Gaps Identified During Testing</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value="Requirement X not covered, Scenario Y missed"
//                   disabled
//                   style={{
//                     backgroundColor: '#eaf4ff',
//                     borderColor: '#0085FF',
//                     borderRadius: '10px',
//                     fontWeight: 'bold',
//                     fontSize: '1.1rem'
//                   }}
//                 />
//               </Form.Group>
//             </Card.Body>
//           </Card>

//           {/* Productivity Metrics Section */}
//           <Card className="border-light shadow-sm rounded-lg mb-4">
//             <Card.Body>
//               <h5 className="font-weight-bold text-primary mb-4">Productivity Metrics</h5>

//               <Form.Group className="mb-3">
//                 <Form.Label>Resources Used and Their Utilization Rates</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value="Resource A: 80%, Resource B: 60%"
//                   disabled
//                   style={{
//                     backgroundColor: '#eaf4ff',
//                     borderColor: '#0085FF',
//                     borderRadius: '10px',
//                     fontWeight: 'bold',
//                     fontSize: '1.1rem'
//                   }}
//                 />
//               </Form.Group>
//             </Card.Body>
//           </Card>

//           {/* Improvements and Innovations Section */}
//           <Card className="border-light shadow-sm rounded-lg mb-4">
//             <Card.Body>
//               <h5 className="font-weight-bold text-primary mb-4">Improvements and Innovations</h5>

//               <Form.Group className="mb-3">
//                 <Form.Label>Process Improvements Introduced</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value="Optimized test cycle time, Improved defect tracking"
//                   disabled
//                   style={{
//                     backgroundColor: '#eaf4ff',
//                     borderColor: '#28a745',
//                     borderRadius: '10px',
//                     fontWeight: 'bold',
//                     fontSize: '1.1rem'
//                   }}
//                 />
//               </Form.Group>
//             </Card.Body>
//           </Card>

//           {/* New Tools/Frameworks Adopted Section */}
//           <Card className="border-light shadow-sm rounded-lg mb-4">
//             <Card.Body>
//               <h5 className="font-weight-bold text-primary mb-4">New Tools/Frameworks Adopted</h5>

//               <Form.Group className="mb-3">
//                 <Form.Label>New Tools, Frameworks, or Methodologies</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value="Selenium WebDriver, Jira for defect management"
//                   disabled
//                   style={{
//                     backgroundColor: '#eaf4ff',
//                     borderColor: '#0085FF',
//                     borderRadius: '10px',
//                     fontWeight: 'bold',
//                     fontSize: '1.1rem'
//                   }}
//                 />
//               </Form.Group>
//             </Card.Body>
//           </Card>

//           {/* Footer Button */}
//           <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
//             <Button
//               onClick={handleDefectsNavigate} // Call handleNavigate when button is clicked
//               style={{
//                 background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
//                 padding: '0.75rem 2rem',
//                 borderRadius: '50px',
//                 fontSize: '1.2rem',
//                 fontWeight: 'bold',
//               }}
//             >
//               {/* <FaArrowRight className="mr-2" /> */}
//               Defects
//             </Button>
//             <Button
//               onClick={handleManualNavigate} // Call handleNavigate when button is clicked
//               style={{
//                 background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
//                 padding: '0.75rem 2rem',
//                 borderRadius: '50px',
//                 fontSize: '1.2rem',
//                 fontWeight: 'bold',
//               }}
//             >
//               {/* <FaArrowRight className="mr-2" /> */}
//               Manual
//             </Button>
//             <Button
//               onClick={handleAutomationNavigate} // Call handleNavigate when button is clicked
//               style={{
//                 background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
//                 padding: '0.75rem 2rem',
//                 borderRadius: '50px',
//                 fontSize: '1.2rem',
//                 fontWeight: 'bold',
//               }}
//             >
//               {/* <FaArrowRight className="mr-2" /> */}
//               Automation
//             </Button>
//             <Button
//               onClick={handleSecurityNavigate} // Call handleNavigate when button is clicked
//               style={{
//                 background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
//                 padding: '0.75rem 2rem',
//                 borderRadius: '50px',
//                 fontSize: '1.2rem',
//                 fontWeight: 'bold',
//               }}
//             >
//               {/* <FaArrowRight className="mr-2" /> */}
//               Security
//             </Button>


//             {/* Modal to display ManageBuzz content */}
//       <Modal show={showModal} onHide={handleModalClose} size="lg" centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Manage Projects</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <ManageBuzz /> {/* Render the ManageBuzz component inside the modal */}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleModalClose}>Close</Button>
//         </Modal.Footer>
//       </Modal>
//      </div>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };

// export default Summary;





// import React, { useState, useEffect } from 'react';
// import { Card, Button, Form, Container, Modal, Row, Col } from 'react-bootstrap';
// import { FaChartLine, FaArrowRight } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
// import ManageBuzz from './SummaryProjects';  // Assuming ManageBuzz is in the same folder

// const Summary = () => {
//   const [showModal, setShowModal] = useState(false);  // State to manage modal visibility

//   const navigate = useNavigate(); // Initialize useNavigate

//   // Function to handle button click and navigate
//   const handleDefectsNavigate = () => {
//     const summaryId = sessionStorage.getItem('Summary_id');
//     if (summaryId) {
//       navigate(`/ManagerView/full_test_details/${summaryId}`);
//     } else {
//       console.error("Summary_id not found in sessionStorage.");
//     }
//   };
//   // Function to handle button click and navigate
//   const handleManualNavigate = () => {
//     const summaryId = sessionStorage.getItem('Summary_id');
//     if (summaryId) {
//       navigate(`/ManagerView/full_test_details/${summaryId}`);
//     } else {
//       console.error("Summary_id not found in sessionStorage.");
//     }
//   };
//   // Function to handle button click and navigate
//   const handleAutomationNavigate = () => {
//     const summaryId = sessionStorage.getItem('Summary_id');
//     if (summaryId) {
//       navigate(`/ManagerView/full_test_details/${summaryId}`);
//     } else {
//       console.error("Summary_id not found in sessionStorage.");
//     }
//   };
//   // Function to handle button click and navigate
//   const handleSecurityNavigate = () => {
//     const summaryId = sessionStorage.getItem('Summary_id');
//     if (summaryId) {
//       navigate(`/ManagerView/full_test_details/${summaryId}`);
//     } else {
//       console.error("Summary_id not found in sessionStorage.");
//     }
//   };

//   // Toggle modal visibility
//   const handleModalClose = () => setShowModal(false);
//   const handleModalShow = () => setShowModal(true);

//   return (
//     <Container fluid className="mt-5">
//       <Card className="shadow-lg">
//         <Card.Header
//           as="h5"
//           style={{
//             background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
//             color: '#ffffff',
//             borderRadius: '10px 10px 0 0',
//             padding: '1.5rem',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             fontWeight: 'bold',
//             fontSize: '1.25rem'
//           }}
//         >
//           <div className="d-flex align-items-center">
//             <FaChartLine className="mr-2" style={{ fontSize: '1.5rem' }} />
//             Test Metrics Overview
//           </div>
//           <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
//       <Button
//         onClick={handleDefectsNavigate}
//         className="btn-hover hover:scale-110 hover:shadow-lg"
//         style={{
//           background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
//           padding: '0.5rem 1rem',
//           borderColor: '#ffffff',
//           borderRadius: '50px',
//           // fontSize: '1.2rem',
//           fontWeight: 'bold',
//           transition: 'all 0.3s ease',
//           textTransform: 'uppercase'
//         }}
//       >
//         Defects
//       </Button>
//       <Button
//         onClick={handleManualNavigate}
//         className="btn-hover hover:scale-110 hover:shadow-lg"
//         style={{
//           background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
//           padding: '0.5rem 1rem',
//           borderColor: '#ffffff',
//           borderRadius: '50px',
//           // fontSize: '1.2rem',
//           fontWeight: 'bold',
//           transition: 'all 0.3s ease',
//           textTransform: 'uppercase'
//         }}
//       >
//         Manual
//       </Button>
//       <Button
//         onClick={handleAutomationNavigate}
//         className="btn-hover hover:scale-110 hover:shadow-lg"
//         style={{
//           background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
//           padding: '0.5rem 1rem',
//           borderColor: '#ffffff',
//           borderRadius: '50px',
//           // fontSize: '1.2rem',
//           fontWeight: 'bold',
//           transition: 'all 0.3s ease',
//           textTransform: 'uppercase'
//         }}
//       >
//         Automation
//       </Button>
//       <Button
//         onClick={handleSecurityNavigate}
//         className="btn-hover hover:scale-110 hover:shadow-lg"
//         style={{
//           background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
//           padding: '0.5rem 1rem',
//           borderColor: '#ffffff',
//           borderRadius: '50px',
//           // fontSize: '1.2rem',
//           fontWeight: 'bold',
//           transition: 'all 0.3s ease',
//           textTransform: 'uppercase'
//         }}
//       >
//         Security
//       </Button>
//     </div>
//           <Button
//             variant="outline-light"
//             style={{
//               backgroundColor: 'transparent',
//               borderColor: '#ffffff',
//               padding: '0.5rem 1rem',
//               borderRadius: '50px',
//               fontWeight: 'bold',
//               textTransform: 'uppercase'
//             }}
//             onClick={handleModalShow} // Open modal on button click
//           >
//             View Project
//           </Button>
//         </Card.Header>

//         <Card.Body
//           style={{
//             backgroundColor: '#f9f9f9',
//             borderRadius: '0 0 10px 10px',
//             padding: '2rem'
//           }}
//         >
//           <Row>
//             {/* Left Column */}
//             <Col md={6}>
//               {/* Test Execution Metrics Section */}
//               <Card className="border-light shadow-sm rounded-lg mb-4">
//                 <Card.Body>
//                   <h5 className="font-weight-bold text-primary mb-4">Test Execution Metrics</h5>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Total Test Cases Executed Manually</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value="60%"
//                       disabled
//                       style={{
//                         backgroundColor: '#eaf4ff',
//                         borderColor: '#0085FF',
//                         borderRadius: '10px',
//                         fontWeight: 'bold',
//                         fontSize: '1.1rem'
//                       }}
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Total Test Cases Executed - Automation</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value="30%"
//                       disabled
//                       style={{
//                         backgroundColor: '#eaf4ff',
//                         borderColor: '#0085FF',
//                         borderRadius: '10px',
//                         fontWeight: 'bold',
//                         fontSize: '1.1rem'
//                       }}
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Test Cases Passed</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value="85%"
//                       disabled
//                       style={{
//                         backgroundColor: '#eaf4ff',
//                         borderColor: '#28a745',
//                         borderRadius: '10px',
//                         fontWeight: 'bold',
//                         fontSize: '1.1rem'
//                       }}
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Test Cases Failed</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value="10%"
//                       disabled
//                       style={{
//                         backgroundColor: '#eaf4ff',
//                         borderColor: '#dc3545',
//                         borderRadius: '10px',
//                         fontWeight: 'bold',
//                         fontSize: '1.1rem'
//                       }}
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Test Cases Blocked</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value="5%"
//                       disabled
//                       style={{
//                         backgroundColor: '#eaf4ff',
//                         borderColor: '#ffc107',
//                         borderRadius: '10px',
//                         fontWeight: 'bold',
//                         fontSize: '1.1rem'
//                       }}
//                     />
//                   </Form.Group>
//                 </Card.Body>
//               </Card>

//               {/* Defect Metrics Section */}
//               <Card className="border-light shadow-sm rounded-lg mb-4">
//                 <Card.Body>
//                   <h5 className="font-weight-bold text-primary mb-4">Defect Metrics</h5>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Total Defects Identified</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value="45"
//                       disabled
//                       style={{
//                         backgroundColor: '#f8d7da',
//                         borderColor: '#dc3545',
//                         borderRadius: '10px',
//                         fontWeight: 'bold',
//                         fontSize: '1.1rem'
//                       }}
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Defect Distribution</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value="Critical: 5, High: 10, Medium: 20, Low: 10"
//                       disabled
//                       style={{
//                         backgroundColor: '#eaf4ff',
//                         borderColor: '#0085FF',
//                         borderRadius: '10px',
//                         fontWeight: 'bold',
//                         fontSize: '1.1rem'
//                       }}
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Defect Resolution Rate</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value="80%"
//                       disabled
//                       style={{
//                         backgroundColor: '#eaf4ff',
//                         borderColor: '#28a745',
//                         borderRadius: '10px',
//                         fontWeight: 'bold',
//                         fontSize: '1.1rem'
//                       }}
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Avg Time to Resolve Defects</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value="72 hrs"
//                       disabled
//                       style={{
//                         backgroundColor: '#eaf4ff',
//                         borderColor: '#ffc107',
//                         borderRadius: '10px',
//                         fontWeight: 'bold',
//                         fontSize: '1.1rem'
//                       }}
//                     />
//                   </Form.Group>
//                 </Card.Body>
//               </Card>

//               <Card className="border-light shadow-sm rounded-lg mb-4">
//                 <Card.Body>
//                   <h5 className="font-weight-bold text-primary mb-4">New Tools/Frameworks Adopted</h5>

//                   <Form.Group className="mb-3">
//                     <Form.Label>New Tools, Frameworks, or Methodologies</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value="Selenium WebDriver, Jira for defect management"
//                       disabled
//                       style={{
//                         backgroundColor: '#eaf4ff',
//                         borderColor: '#0085FF',
//                         borderRadius: '10px',
//                         fontWeight: 'bold',
//                         fontSize: '1.1rem'
//                       }}
//                     />
//                   </Form.Group>
//                 </Card.Body>
//               </Card>
//             </Col>

//             {/* Right Column */}
//             <Col md={6}>
//               {/* Automation Metrics Section */}
//               <Card className="border-light shadow-sm rounded-lg mb-4">
//                 <Card.Body>
//                   <h5 className="font-weight-bold text-primary mb-4">Automation Metrics</h5>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Percentage of Automation Coverage</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value="50%"
//                       disabled
//                       style={{
//                         backgroundColor: '#eaf4ff',
//                         borderColor: '#0085FF',
//                         borderRadius: '10px',
//                         fontWeight: 'bold',
//                         fontSize: '1.1rem'
//                       }}
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Time Saved Through Automation</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value="150 hrs"
//                       disabled
//                       style={{
//                         backgroundColor: '#eaf4ff',
//                         borderColor: '#28a745',
//                         borderRadius: '10px',
//                         fontWeight: 'bold',
//                         fontSize: '1.1rem'
//                       }}
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label>New Scripts Developed</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value="10"
//                       disabled
//                       style={{
//                         backgroundColor: '#eaf4ff',
//                         borderColor: '#0085FF',
//                         borderRadius: '10px',
//                         fontWeight: 'bold',
//                         fontSize: '1.1rem'
//                       }}
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Execution Success Rate</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value="95%"
//                       disabled
//                       style={{
//                         backgroundColor: '#eaf4ff',
//                         borderColor: '#28a745',
//                         borderRadius: '10px',
//                         fontWeight: 'bold',
//                         fontSize: '1.1rem'
//                       }}
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Average Scripting Effort</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value="5 hrs"
//                       disabled
//                       style={{
//                         backgroundColor: '#eaf4ff',
//                         borderColor: '#ffc107',
//                         borderRadius: '10px',
//                         fontWeight: 'bold',
//                         fontSize: '1.1rem'
//                       }}
//                     />
//                   </Form.Group>
//                 </Card.Body>
//               </Card>

//               {/* Coverage Metrics Section */}
//               <Card className="border-light shadow-sm rounded-lg mb-4">
//                 <Card.Body>
//                   <h5 className="font-weight-bold text-primary mb-4">Coverage Metrics</h5>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Areas/Modules with Highest Defect Rates</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value="Module A: 25 defects, Module B: 15 defects"
//                       disabled
//                       style={{
//                         backgroundColor: '#f8d7da',
//                         borderColor: '#dc3545',
//                         borderRadius: '10px',
//                         fontWeight: 'bold',
//                         fontSize: '1.1rem'
//                       }}
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Gaps Identified During Testing</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value="Requirement X not covered, Scenario Y missed"
//                       disabled
//                       style={{
//                         backgroundColor: '#eaf4ff',
//                         borderColor: '#0085FF',
//                         borderRadius: '10px',
//                         fontWeight: 'bold',
//                         fontSize: '1.1rem'
//                       }}
//                     />
//                   </Form.Group>
//                 </Card.Body>
//               </Card>

//               {/* Productivity Metrics Section */}
//               <Card className="border-light shadow-sm rounded-lg mb-4">
//                 <Card.Body>
//                   <h5 className="font-weight-bold text-primary mb-4">Productivity Metrics</h5>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Resources Used and Their Utilization Rates</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value="Resource A: 80%, Resource B: 60%"
//                       disabled
//                       style={{
//                         backgroundColor: '#eaf4ff',
//                         borderColor: '#0085FF',
//                         borderRadius: '10px',
//                         fontWeight: 'bold',
//                         fontSize: '1.1rem'
//                       }}
//                     />
//                   </Form.Group>
//                 </Card.Body>
//               </Card>

//               {/* Improvements and Innovations Section */}
//               <Card className="border-light shadow-sm rounded-lg mb-4">
//                 <Card.Body>
//                   <h5 className="font-weight-bold text-primary mb-4">Improvements and Innovations</h5>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Process Improvements Introduced</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value="Optimized test cycle time, Improved defect tracking"
//                       disabled
//                       style={{
//                         backgroundColor: '#eaf4ff',
//                         borderColor: '#28a745',
//                         borderRadius: '10px',
//                         fontWeight: 'bold',
//                         fontSize: '1.1rem'
//                       }}
//                     />
//                   </Form.Group>
//                 </Card.Body>
//               </Card>

//               {/* New Tools/Frameworks Adopted Section */}
              
//             </Col>
//           </Row>

//           {/* Footer Button */}
         

//           {/* Modal to display ManageBuzz content */}
//           <Modal show={showModal} onHide={handleModalClose} size="lg" centered>
//             <Modal.Header closeButton>
//               <Modal.Title>Manage Projects</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               <ManageBuzz /> {/* Render the ManageBuzz component inside the modal */}
//             </Modal.Body>
//             <Modal.Footer>
//               <Button variant="secondary" onClick={handleModalClose}>Close</Button>
//             </Modal.Footer>
//           </Modal>
//         </Card.Body>
//       </Card>
//     </Container>

//   );
// };

// export default Summary;



import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Container, Modal, Row, Col } from 'react-bootstrap';
import { FaChartLine, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import ManageBuzz from './SummaryProjects';  // Assuming ManageBuzz is in the same folder
import ProjectDetails from '../manager_view/full_testcase_details';  // Assuming ProjectDetails is in the same folder

const Summary = () => {
  const [showModal, setShowModal] = useState(false);  // State to manage modal visibility
  const [showProjectDetails, setShowProjectDetails] = useState(false);  // State to manage project details visibility
  const [showOverView, setShowOverView] = useState(true);  // State to manage project details visibility

  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle button click and navigate
  const handleDefectsNavigate = () => {
    const summaryId = sessionStorage.getItem('Summary_id');
    if (summaryId) {
      navigate(`/ManagerView/full_test_details/${summaryId}`);
    } else {
      console.error("Summary_id not found in sessionStorage.");
    }
  };

  // Function to handle button click and navigate
  const handleManualNavigate = () => {
    const summaryId = sessionStorage.getItem('Summary_id');
    if (summaryId) {
      navigate(`/ManagerView/full_test_details/${summaryId}`);
    } else {
      console.error("Summary_id not found in sessionStorage.");
    }
  };

  // Function to handle button click and navigate
  const handleAutomationNavigate = () => {
    const summaryId = sessionStorage.getItem('Summary_id');
    if (summaryId) {
      navigate(`/ManagerView/full_test_details/${summaryId}`);
    } else {
      console.error("Summary_id not found in sessionStorage.");
    }
  };

  // Function to handle button click and navigate
  const handleSecurityNavigate = () => {
    const summaryId = sessionStorage.getItem('Summary_id');
    if (summaryId) {
      navigate(`/ManagerView/full_test_details/${summaryId}`);
    } else {
      console.error("Summary_id not found in sessionStorage.");
    }
  };

  // Toggle modal visibility
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  // Toggle Project Details visibility
  const handleDefectsButtonClick = () => {
    setShowProjectDetails(true);
    setShowOverView(false);
    
  };

  return (
    <Container fluid className="mt-5">
      <Card className="shadow-lg">
        <Card.Header
          as="h5"
          style={{
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            color: '#ffffff',
            borderRadius: '10px 10px 0 0',
            padding: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 'bold',
            fontSize: '1.25rem'
          }}
        >
          <div className="d-flex align-items-center">
            <FaChartLine className="mr-2" style={{ fontSize: '1.5rem' }} />
            Test Metrics Overview
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <Button
              onClick={handleDefectsButtonClick}  // Handle defects button click
              className="btn-hover hover:scale-110 hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                padding: '0.5rem 1rem',
                borderColor: '#ffffff',
                borderRadius: '50px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase'
              }}
            >
              Defects
            </Button>
            <Button
              onClick={handleManualNavigate}
              className="btn-hover hover:scale-110 hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                padding: '0.5rem 1rem',
                borderColor: '#ffffff',
                borderRadius: '50px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase'
              }}
            >
              Manual
            </Button>
            <Button
              onClick={handleAutomationNavigate}
              className="btn-hover hover:scale-110 hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                padding: '0.5rem 1rem',
                borderColor: '#ffffff',
                borderRadius: '50px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase'
              }}
            >
              Automation
            </Button>
            <Button
              onClick={handleSecurityNavigate}
              className="btn-hover hover:scale-110 hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                padding: '0.5rem 1rem',
                borderColor: '#ffffff',
                borderRadius: '50px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase'
              }}
            >
              Security
            </Button>
          </div>
          <Button
            variant="outline-light"
            style={{
              backgroundColor: 'transparent',
              borderColor: '#ffffff',
              padding: '0.5rem 1rem',
              borderRadius: '50px',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}
            onClick={handleModalShow} // Open modal on button click
          >
            View Project
          </Button>
        </Card.Header>

        <Card.Body
          style={{
            backgroundColor: '#f9f9f9',
            borderRadius: '0 0 10px 10px',
            padding: '2rem'
          }}
        >
          {showOverView &&
          <Row>
            {/* Left Column */}
            <Col md={6}>
              {/* Test Execution Metrics Section */}
              <Card className="border-light shadow-sm rounded-lg mb-4">
                <Card.Body>
                  <h5 className="font-weight-bold text-primary mb-4">Test Execution Metrics</h5>
                  <Form.Group className="mb-3">
                    <Form.Label>Total Test Cases Executed Manually</Form.Label>
                    <Form.Control
                      type="text"
                      value="60%"
                      disabled
                      style={{
                        backgroundColor: '#eaf4ff',
                        borderColor: '#0085FF',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Total Test Cases Executed - Automation</Form.Label>
                    <Form.Control
                      type="text"
                      value="30%"
                      disabled
                      style={{
                        backgroundColor: '#eaf4ff',
                        borderColor: '#0085FF',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Test Cases Passed</Form.Label>
                    <Form.Control
                      type="text"
                      value="85%"
                      disabled
                      style={{
                        backgroundColor: '#eaf4ff',
                        borderColor: '#28a745',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Test Cases Failed</Form.Label>
                    <Form.Control
                      type="text"
                      value="10%"
                      disabled
                      style={{
                        backgroundColor: '#eaf4ff',
                        borderColor: '#dc3545',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Test Cases Blocked</Form.Label>
                    <Form.Control
                      type="text"
                      value="5%"
                      disabled
                      style={{
                        backgroundColor: '#eaf4ff',
                        borderColor: '#ffc107',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>

              {/* Defect Metrics Section */}
              <Card className="border-light shadow-sm rounded-lg mb-4">
                <Card.Body>
                  <h5 className="font-weight-bold text-primary mb-4">Defect Metrics</h5>
                  <Form.Group className="mb-3">
                    <Form.Label>Total Defects Identified</Form.Label>
                    <Form.Control
                      type="text"
                      value="45"
                      disabled
                      style={{
                        backgroundColor: '#f8d7da',
                        borderColor: '#dc3545',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Defect Distribution</Form.Label>
                    <Form.Control
                      type="text"
                      value="Critical: 5, High: 10, Medium: 20, Low: 10"
                      disabled
                      style={{
                        backgroundColor: '#eaf4ff',
                        borderColor: '#0085FF',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Defect Resolution Rate</Form.Label>
                    <Form.Control
                      type="text"
                      value="80%"
                      disabled
                      style={{
                        backgroundColor: '#eaf4ff',
                        borderColor: '#28a745',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Avg Time to Resolve Defects</Form.Label>
                    <Form.Control
                      type="text"
                      value="72 hrs"
                      disabled
                      style={{
                        backgroundColor: '#eaf4ff',
                        borderColor: '#ffc107',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>

              {/* New Tools/Frameworks Adopted */}
              <Card className="border-light shadow-sm rounded-lg mb-4">
                <Card.Body>
                  <h5 className="font-weight-bold text-primary mb-4">New Tools/Frameworks Adopted</h5>
                  <Form.Group className="mb-3">
                    <Form.Label>New Tools, Frameworks, or Methodologies</Form.Label>
                    <Form.Control
                      type="text"
                      value="Selenium WebDriver, Jira for defect management"
                      disabled
                      style={{
                        backgroundColor: '#eaf4ff',
                        borderColor: '#0085FF',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>

            {/* Right Column */}
            <Col md={6}>
              {/* Automation Metrics Section */}
              <Card className="border-light shadow-sm rounded-lg mb-4">
                <Card.Body>
                  <h5 className="font-weight-bold text-primary mb-4">Automation Metrics</h5>

                  <Form.Group className="mb-3">
                    <Form.Label>Percentage of Automation Coverage</Form.Label>
                    <Form.Control
                      type="text"
                      value="50%"
                      disabled
                      style={{
                        backgroundColor: '#eaf4ff',
                        borderColor: '#0085FF',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Time Saved Through Automation</Form.Label>
                    <Form.Control
                      type="text"
                      value="150 hrs"
                      disabled
                      style={{
                        backgroundColor: '#eaf4ff',
                        borderColor: '#28a745',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>New Scripts Developed</Form.Label>
                    <Form.Control
                      type="text"
                      value="10"
                      disabled
                      style={{
                        backgroundColor: '#eaf4ff',
                        borderColor: '#0085FF',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Execution Success Rate</Form.Label>
                    <Form.Control
                      type="text"
                      value="95%"
                      disabled
                      style={{
                        backgroundColor: '#eaf4ff',
                        borderColor: '#28a745',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Average Scripting Effort</Form.Label>
                    <Form.Control
                      type="text"
                      value="5 hrs"
                      disabled
                      style={{
                        backgroundColor: '#eaf4ff',
                        borderColor: '#ffc107',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>

              {/* Coverage Metrics Section */}
              <Card className="border-light shadow-sm rounded-lg mb-4">
                <Card.Body>
                  <h5 className="font-weight-bold text-primary mb-4">Coverage Metrics</h5>

                  <Form.Group className="mb-3">
                    <Form.Label>Areas/Modules with Highest Defect Rates</Form.Label>
                    <Form.Control
                      type="text"
                      value="Module A: 25 defects, Module B: 15 defects"
                      disabled
                      style={{
                        backgroundColor: '#f8d7da',
                        borderColor: '#dc3545',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Gaps Identified During Testing</Form.Label>
                    <Form.Control
                      type="text"
                      value="Requirement X not covered, Scenario Y missed"
                      disabled
                      style={{
                        backgroundColor: '#eaf4ff',
                        borderColor: '#0085FF',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>

              {/* Productivity Metrics Section */}
              <Card className="border-light shadow-sm rounded-lg mb-4">
                <Card.Body>
                  <h5 className="font-weight-bold text-primary mb-4">Productivity Metrics</h5>

                  <Form.Group className="mb-3">
                    <Form.Label>Resources Used and Their Utilization Rates</Form.Label>
                    <Form.Control
                      type="text"
                      value="Resource A: 80%, Resource B: 60%"
                      disabled
                      style={{
                        backgroundColor: '#eaf4ff',
                        borderColor: '#0085FF',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>

              {/* Improvements and Innovations Section */}
              <Card className="border-light shadow-sm rounded-lg mb-4">
                <Card.Body>
                  <h5 className="font-weight-bold text-primary mb-4">Improvements and Innovations</h5>

                  <Form.Group className="mb-3">
                    <Form.Label>Process Improvements Introduced</Form.Label>
                    <Form.Control
                      type="text"
                      value="Optimized test cycle time, Improved defect tracking"
                      disabled
                      style={{
                        backgroundColor: '#eaf4ff',
                        borderColor: '#28a745',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          </Row>
           }

          {/* Render the ProjectDetails component when the Defects button is clicked */}
          {showProjectDetails && <ProjectDetails />}

          {/* Modal to display ManageBuzz content */}
          <Modal show={showModal} onHide={handleModalClose} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title>Manage Projects</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ManageBuzz /> {/* Render the ManageBuzz component inside the modal */}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalClose}>Close</Button>
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Summary;