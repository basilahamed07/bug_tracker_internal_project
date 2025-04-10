// // import React, { useState, useEffect } from 'react';
// // import { Card, Form, Button, Modal, Dropdown, Spinner } from 'react-bootstrap';

// // const AddProjectWithDetails = () => {
// //   // State for managing project creation form
// //   const [projectName, setProjectName] = useState('');
// //   const [confirmProjectName, setConfirmProjectName] = useState('');
// //   const [isPending, setIsPending] = useState(false);
// //   const [error, setError] = useState('');
// //   const [successMessage, setSuccessMessage] = useState('');
// //   const [showCreateDetails, setShowCreateDetails] = useState(false);

// //   // State for managing project details form
// //   const [formData, setFormData] = useState({
// //     project_name_id: '',
// //     rag: '',
// //     tester_count: 0,
// //     billable: [],   // Contains selected billable testers
// //     nonbillable: [], // Contains selected non-billable testers
// //     billing_type: '',
// //     rag_details: '',
// //     automation: false,
// //     ai_used: false,
// //   });

// //   const [testers, setTesters] = useState([]);  // State for all testers from the API
// //   const [loadingTesters, setLoadingTesters] = useState(false);
// //   const [showCreateTesterModal, setShowCreateTesterModal] = useState(false);
// //   const [selectedTesterType, setSelectedTesterType] = useState('');

// //   // Fetch all testers from the endpoint
// //   const fetchTesters = async () => {
// //     setLoadingTesters(true);
// //     try {
// //       const accessToken = sessionStorage.getItem('access_token');
// //       if (!accessToken) {
// //         setError('No access token found. Please login.');
// //         return;
// //       }

// //       const response = await fetch('https://h25ggll0-5000.inc1.devtunnels.ms/tester-billable', {
// //         method: 'GET',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Authorization': `Bearer ${accessToken}`,
// //         },
// //       });

// //       if (!response.ok) {
// //         throw new Error(`Error: ${response.statusText}`);
// //       }

// //       const data = await response.json();
// //       setTesters(data.testers || []);  // Save testers data
// //     } catch (error) {
// //       console.error('Error fetching testers:', error);
// //       setError('Error fetching testers: ' + error.message);
// //     } finally {
// //       setLoadingTesters(false);
// //     }
// //   };

// //   // Fetch testers when the component mounts
// //   useEffect(() => {
// //     fetchTesters();
// //   }, []);

// //   // Handle tester selection for billable or non-billable
// //   const handleTesterSelection = (tester, type) => {
// //     const updatedList = formData[type].find(item => item.id === tester.id)
// //       ? formData[type].filter(item => item.id !== tester.id)
// //       : [...formData[type], tester];
    
// //     setFormData({ ...formData, [type]: updatedList });
// //     updateTesterCount(updatedList);
// //     updateSessionStorage();
// //   };

// //   // Update total tester count
// //   const updateTesterCount = (updatedList) => {
// //     setFormData({ ...formData, tester_count: formData.billable.length + formData.nonbillable.length });
// //   };

// //   // Update session storage with selected testers in the required format
// //   const updateSessionStorage = () => {
// //     const selectedTesters = [
// //       ...formData.billable.map(tester => ({ id: tester.id, tester_name: tester.tester_name, billable: true })),
// //       ...formData.nonbillable.map(tester => ({ id: tester.id, tester_name: tester.tester_name, billable: false })),
// //     ];
// //     sessionStorage.setItem('selectedTesters', JSON.stringify({ testers: selectedTesters }));
// //   };

// //   // Handle creation of a new tester (for example, adding a tester)
// //   const handleCreateTester = async (testerName, type) => {
// //     try {
// //       const response = await fetch('https://h25ggll0-5000.inc1.devtunnels.ms/tester-billable', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ tester_name: testerName, type }),
// //       });

// //       const data = await response.json();
// //       if (type === 'billable') {
// //         setFormData({
// //           ...formData,
// //           billable: [...formData.billable, data],
// //         });
// //       } else {
// //         setFormData({
// //           ...formData,
// //           nonbillable: [...formData.nonbillable, data],
// //         });
// //       }
// //       setShowCreateTesterModal(false);
// //       updateSessionStorage();  // Update session storage with newly added tester
// //     } catch (error) {
// //       console.error('Error creating tester:', error);
// //     }
// //   };

// //   // Handle form submission to create project details
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (projectName !== confirmProjectName) {
// //       setError('Project names do not match.');
// //       return;
// //     }

// //     try {
// //       const accessToken = sessionStorage.getItem('access_token');
// //       if (!accessToken) throw new Error('User is not authenticated');

// //       setIsPending(true);
// //       const response = await fetch('https://h25ggll0-5000.inc1.devtunnels.ms/create-project', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Authorization': `Bearer ${accessToken}`,
// //         },
// //         body: JSON.stringify({ project_name: projectName }),
// //       });

// //       if (!response.ok) throw new Error('Project creation failed');

// //       const projectData = await response.json();
// //       setSuccessMessage('Project created successfully!');
// //       setShowCreateDetails(true); // Show project details form
// //     } catch (error) {
// //       setError(error.message);
// //     } finally {
// //       setIsPending(false);
// //     }
// //   };

// //   return (
// //     <div className="container mt-5">
// //       {/* Add Project Form */}
// //       {!showCreateDetails && (
// //         <Card>
// //           <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff' }}>Add Project</Card.Header>
// //           <Card.Body>
// //             {error && <p className="text-danger">{error}</p>}
// //             {successMessage && <p className="text-success">{successMessage}</p>}

// //             <Form onSubmit={handleSubmit}>
// //               <Form.Group controlId="projectName">
// //                 <Form.Label>Project Name:</Form.Label>
// //                 <Form.Control
// //                   type="text"
// //                   value={projectName}
// //                   onChange={(e) => setProjectName(e.target.value)}
// //                   required
// //                 />
// //               </Form.Group>
// //               <Form.Group controlId="confirmProjectName">
// //                 <Form.Label>Confirm Project Name:</Form.Label>
// //                 <Form.Control
// //                   type="text"
// //                   value={confirmProjectName}
// //                   onChange={(e) => setConfirmProjectName(e.target.value)}
// //                   required
// //                 />
// //               </Form.Group>
// //               <Button variant="primary" type="submit" disabled={isPending}>
// //                 {isPending ? 'Creating...' : 'Create Project'}
// //               </Button>
// //             </Form>
// //           </Card.Body>
// //         </Card>
// //       )}

// //       {/* Create Project Details Form */}
// //       {showCreateDetails && (
// //         <Card className="mt-4">
// //           <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff' }}>Add Project Details</Card.Header>
// //           <Card.Body>
// //             <Form onSubmit={() => {}}>
// //               <Form.Group controlId="project_name_id">
// //                 <Form.Label>Project Name:</Form.Label>
// //                 <Form.Control
// //                   type="text"
// //                   value={projectName}
// //                   readOnly
// //                 />
// //               </Form.Group>
// //               <Form.Group controlId="rag">
// //                 <Form.Label>rag</Form.Label>
// //                 <Form.Control
// //                   type="text"
// //                   value={formData.rag}
// //                   onChange={(e) => setFormData({ ...formData, rag: e.target.value })}
// //                   required
// //                 />
// //               </Form.Group>

// //               {/* Billable Testers Dropdown */}
// //               <Form.Group controlId="billable">
// //                 <Form.Label>Billable Testers</Form.Label>
// //                 <Dropdown>
// //                   <Dropdown.Toggle variant="success" id="dropdown-basic">
// //                     {formData.billable.length > 0 ? formData.billable.map(t => t.tester_name).join(', ') : 'Select Billable Testers'}
// //                   </Dropdown.Toggle>
// //                   <Dropdown.Menu>
// //                     {loadingTesters ? (
// //                       <Dropdown.ItemText>
// //                         <Spinner animation="border" size="sm" />
// //                         Loading...
// //                       </Dropdown.ItemText>
// //                     ) : (
// //                       testers.filter(tester => tester.billable).map(tester => (
// //                         <Dropdown.Item
// //                           key={tester.id}
// //                           onClick={() => handleTesterSelection(tester, 'billable')}
// //                         >
// //                           {tester.tester_name}
// //                         </Dropdown.Item>
// //                       ))
// //                     )}
// //                     <Dropdown.Item onClick={() => { setSelectedTesterType('billable'); setShowCreateTesterModal(true); }}>
// //                       Add New Tester
// //                     </Dropdown.Item>
// //                   </Dropdown.Menu>
// //                 </Dropdown>
// //               </Form.Group>

// //               {/* Non-Billable Testers Dropdown */}
// //               <Form.Group controlId="nonbillable">
// //                 <Form.Label>Non-Billable Testers</Form.Label>
// //                 <Dropdown>
// //                   <Dropdown.Toggle variant="secondary" id="dropdown-basic">
// //                     {formData.nonbillable.length > 0 ? formData.nonbillable.map(t => t.tester_name).join(', ') : 'Select Non-Billable Testers'}
// //                   </Dropdown.Toggle>
// //                   <Dropdown.Menu>
// //                     {loadingTesters ? (
// //                       <Dropdown.ItemText>
// //                         <Spinner animation="border" size="sm" />
// //                         Loading...
// //                       </Dropdown.ItemText>
// //                     ) : (
// //                       testers.filter(tester => !tester.billable).map(tester => (
// //                         <Dropdown.Item
// //                           key={tester.id}
// //                           onClick={() => handleTesterSelection(tester, 'nonbillable')}
// //                         >
// //                           {tester.tester_name}
// //                         </Dropdown.Item>
// //                       ))
// //                     )}
// //                     <Dropdown.Item onClick={() => { setSelectedTesterType('nonbillable'); setShowCreateTesterModal(true); }}>
// //                       Add New Tester
// //                     </Dropdown.Item>
// //                   </Dropdown.Menu>
// //                 </Dropdown>
// //               </Form.Group>

// //               {/* Tester Count */}
// //               <Form.Group controlId="tester_count">
// //                 <Form.Label>Tester Count</Form.Label>
// //                 <Form.Control
// //                   type="number"
// //                   value={formData.tester_count}
// //                   readOnly
// //                 />
// //               </Form.Group>
// //               <Button variant="primary" type="submit">
// //                 Submit
// //               </Button>
// //             </Form>
// //           </Card.Body>
// //         </Card>
// //       )}

// //       {/* Modal for Creating Tester */}
// //       {showCreateTesterModal && (
// //         <Modal show={showCreateTesterModal} onHide={() => setShowCreateTesterModal(false)}>
// //           <Modal.Header closeButton>
// //             <Modal.Title>Create New Tester</Modal.Title>
// //           </Modal.Header>
// //           <Modal.Body>
// //             <Form
// //               onSubmit={(e) => {
// //                 e.preventDefault();
// //                 handleCreateTester(e.target.tester_name.value, selectedTesterType);
// //               }}
// //             >
// //               <Form.Group>
// //                 <Form.Label>Tester Name</Form.Label>
// //                 <Form.Control
// //                   type="text"
// //                   name="tester_name"
// //                   required
// //                 />
// //               </Form.Group>
// //               <Button type="submit">Create Tester</Button>
// //             </Form>
// //           </Modal.Body>
// //         </Modal>
// //       )}
// //     </div>
// //   );
// // };

// // export default AddProjectWithDetails;






// import React, { useState, useEffect } from 'react';
// import { Card, Form, Button, Modal, Dropdown, Spinner } from 'react-bootstrap';

// const AddProjectWithDetails = ({ projectNameProp }) => {
//   const [projectName, setProjectName] = useState(projectNameProp); // Using the project name prop here
//   const [confirmProjectName, setConfirmProjectName] = useState('');
//   const [isPending, setIsPending] = useState(false);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [showCreateDetails, setShowCreateDetails] = useState(false);  // This controls whether the details form is shown

//   const [formData, setFormData] = useState({
//     project_name_id: '',
//     rag: '',
//     tester_count: 0,
//     billable: [],  // Selected billable testers
//     nonbillable: [], // Selected non-billable testers
//     billing_type: '',
//     rag_details: '',
//     automation: false,
//     ai_used: false,
//   });

//   const [testers, setTesters] = useState([]);
//   const [loadingTesters, setLoadingTesters] = useState(false);
//   const [showCreateTesterModal, setShowCreateTesterModal] = useState(false);
//   const [selectedTesterType, setSelectedTesterType] = useState('');

//   // Fetch testers from the API
//   const fetchTesters = async () => {
//     setLoadingTesters(true);
//     try {
//       const accessToken = sessionStorage.getItem('access_token');
//       if (!accessToken) {
//         setError('No access token found. Please login.');
//         return;
//       }

//       const response = await fetch('https://h25ggll0-5000.inc1.devtunnels.ms/tester-billable', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${accessToken}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Error: ${response.statusText}`);
//       }

//       const data = await response.json();
//       setTesters(data.testers || []);
//     } catch (error) {
//       console.error('Error fetching testers:', error);
//       setError('Error fetching testers: ' + error.message);
//     } finally {
//       setLoadingTesters(false);
//     }
//   };

//   // Fetch testers on component mount
//   useEffect(() => {
//     fetchTesters();
//   }, []);

//   // Handle tester selection for billable or non-billable
//   const handleTesterSelection = (tester, type) => {
//     // Determine if the tester is already selected in the current list (billable or nonbillable)
//     const updatedList = formData[type].find(item => item.tester_name === tester.tester_name)
//       ? formData[type].filter(item => item.tester_name !== tester.tester_name)
//       : [...formData[type], tester];

//     // Update the formData with the selected testers (billable or nonbillable)
//     setFormData({ ...formData, [type]: updatedList });

//     // Update the tester count
//     updateTesterCount(updatedList);

//     // Immediately update session storage after selection
//     updateSessionStorage();
//   };

//   // Update total tester count
//   const updateTesterCount = (updatedList) => {
//     setFormData({ ...formData, tester_count: formData.billable.length + formData.nonbillable.length });
//   };

//   // Update session storage with selected testers in required format
//   const updateSessionStorage = () => {
//     const selectedTesters = [
//       ...formData.billable.map(tester => ({
//         tester_name: tester.tester_name,
//         project_name: projectName, // Using the project name prop here
//         billable: true
//       })),
//       ...formData.nonbillable.map(tester => ({
//         tester_name: tester.tester_name,
//         project_name: projectName, // Using the project name prop here
//         billable: false
//       })),
//     ];

//     // Store the selected testers in sessionStorage
//     sessionStorage.setItem('selectedTesters', JSON.stringify({ testers: selectedTesters }));

//     // Log sessionStorage for debugging
//     console.log('Session Storage Updated:', JSON.parse(sessionStorage.getItem('selectedTesters')));
//   };

//   // Handle creation of a new tester (storing them in session first)
//   const handleCreateTester = async (testerName, type) => {
//     const newTester = {
//       tester_name: testerName,
//       project_name: projectName, // Using projectName prop
//       billable: type === 'billable',  // Set billable or non-billable
//     };

//     // Add the new tester to the appropriate list (billable or non-billable)
//     const updatedList = type === 'billable' ? [...formData.billable, newTester] : [...formData.nonbillable, newTester];
//     setFormData({ ...formData, [type]: updatedList });

//     // Update session storage with the new tester details
//     updateSessionStorage();

//     // Close the modal after creating the tester
//     setShowCreateTesterModal(false);
//   };

//   // Handle form submission to create project details and submit selected testers
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (projectName !== confirmProjectName) {
//       setError('Project names do not match.');
//       return;
//     }

//     try {
//       const accessToken = sessionStorage.getItem('access_token');
//       if (!accessToken) throw new Error('User is not authenticated');

//       setIsPending(true);

//       // Get the stored testers from session storage
//       const selectedTesters = JSON.parse(sessionStorage.getItem('selectedTesters'))?.testers || [];

//       // Send the project creation request
//       const response = await fetch('https://h25ggll0-5000.inc1.devtunnels.ms/create-project', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify({
//           project_name: projectName,
//           testers: selectedTesters,  // Submit selected testers with project data
//         }),
//       });

//       if (!response.ok) throw new Error('Project creation failed');

//       const projectData = await response.json();
//       setSuccessMessage('Project created successfully!');
//       setShowCreateDetails(true); // Show the project details form once the project is created
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setIsPending(false);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       {/* Add Project Form */}
//       {!showCreateDetails && (
//         <Card>
//           <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff' }}>Add Project</Card.Header>
//           <Card.Body>
//             {error && <p className="text-danger">{error}</p>}
//             {successMessage && <p className="text-success">{successMessage}</p>}

//             <Form onSubmit={handleSubmit}>
//               <Form.Group controlId="projectName">
//                 <Form.Label>Project Name:</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={projectName}
//                   onChange={(e) => setProjectName(e.target.value)}
//                   required
//                 />
//               </Form.Group>
//               <Form.Group controlId="confirmProjectName">
//                 <Form.Label>Confirm Project Name:</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={confirmProjectName}
//                   onChange={(e) => setConfirmProjectName(e.target.value)}
//                   required
//                 />
//               </Form.Group>
//               <Button variant="primary" type="submit" disabled={isPending}>
//                 {isPending ? 'Creating...' : 'Create Project'}
//               </Button>
//             </Form>
//           </Card.Body>
//         </Card>
//       )}

//       {/* Create Project Details Form */}
//       {showCreateDetails && (
//         <Card className="mt-4">
//           <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff' }}>Add Project Details</Card.Header>
//           <Card.Body>
//             <Form onSubmit={() => {}}>
//               <Form.Group controlId="project_name_id">
//                 <Form.Label>Project Name:</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={projectName}
//                   readOnly
//                 />
//               </Form.Group>
//               <Form.Group controlId="rag">
//                 <Form.Label>rag</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={formData.rag}
//                   onChange={(e) => setFormData({ ...formData, rag: e.target.value })}
//                   required
//                 />
//               </Form.Group>

//               {/* Billable Testers Dropdown */}
//               <Form.Group controlId="billable">
//                 <Form.Label>Billable Testers</Form.Label>
//                 <Dropdown>
//                   <Dropdown.Toggle variant="success" id="dropdown-basic">
//                     {formData.billable.length > 0 ? formData.billable.map(t => t.tester_name).join(', ') : 'Select Billable Testers'}
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu>
//                     {loadingTesters ? (
//                       <Dropdown.ItemText>
//                         <Spinner animation="border" size="sm" />
//                         Loading...
//                       </Dropdown.ItemText>
//                     ) : (
//                       testers.map(tester => (
//                         <Dropdown.Item
//                           key={tester.id}
//                           onClick={() => handleTesterSelection(tester, 'billable')}
//                         >
//                           {tester.tester_name}
//                         </Dropdown.Item>
//                       ))
//                     )}
//                     <Dropdown.Item onClick={() => { setSelectedTesterType('billable'); setShowCreateTesterModal(true); }}>
//                       Add New Tester
//                     </Dropdown.Item>
//                   </Dropdown.Menu>
//                 </Dropdown>
//               </Form.Group>

//               {/* Non-Billable Testers Dropdown */}
//               <Form.Group controlId="nonbillable">
//                 <Form.Label>Non-Billable Testers</Form.Label>
//                 <Dropdown>
//                   <Dropdown.Toggle variant="secondary" id="dropdown-basic">
//                     {formData.nonbillable.length > 0 ? formData.nonbillable.map(t => t.tester_name).join(', ') : 'Select Non-Billable Testers'}
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu>
//                     {loadingTesters ? (
//                       <Dropdown.ItemText>
//                         <Spinner animation="border" size="sm" />
//                         Loading...
//                       </Dropdown.ItemText>
//                     ) : (
//                       testers.map(tester => (
//                         <Dropdown.Item
//                           key={tester.id}
//                           onClick={() => handleTesterSelection(tester, 'nonbillable')}
//                         >
//                           {tester.tester_name}
//                         </Dropdown.Item>
//                       ))
//                     )}
//                     <Dropdown.Item onClick={() => { setSelectedTesterType('nonbillable'); setShowCreateTesterModal(true); }}>
//                       Add New Tester
//                     </Dropdown.Item>
//                   </Dropdown.Menu>
//                 </Dropdown>
//               </Form.Group>

//               {/* Tester Count */}
//               <Form.Group controlId="tester_count">
//                 <Form.Label>Tester Count</Form.Label>
//                 <Form.Control
//                   type="number"
//                   value={formData.tester_count}
//                   readOnly
//                 />
//               </Form.Group>
//               <Button variant="primary" type="submit">
//                 Submit
//               </Button>
//             </Form>
//           </Card.Body>
//         </Card>
//       )}

//       {/* Modal for Creating Tester */}
//       {showCreateTesterModal && (
//         <Modal show={showCreateTesterModal} onHide={() => setShowCreateTesterModal(false)}>
//           <Modal.Header closeButton>
//             <Modal.Title>Create New Tester</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <Form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleCreateTester(e.target.tester_name.value, selectedTesterType);
//               }}
//             >
//               <Form.Group>
//                 <Form.Label>Tester Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="tester_name"
//                   required
//                 />
//               </Form.Group>
//               <Button type="submit">Create Tester</Button>
//             </Form>
//           </Modal.Body>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default AddProjectWithDetails;









// import React, { useState, useEffect } from 'react';
// import { Card, Form, Button, Modal, Dropdown, Spinner } from 'react-bootstrap';

// const AddProjectWithDetails = ({ projectNameProp }) => {
//   const [projectName, setProjectName] = useState(projectNameProp); 
//   const [confirmProjectName, setConfirmProjectName] = useState('');
//   const [isPending, setIsPending] = useState(false);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [showCreateDetails, setShowCreateDetails] = useState(false);

//   const [formData, setFormData] = useState({
//     project_name_id: '',
//     rag: '',
//     tester_count: 0, // Initialize with 0
//     billable: [],
//     nonbillable: [],
//     billing_type: '',
//     rag_details: '',
//     automation: false,
//     ai_used: false,
//   });

//   const [testers, setTesters] = useState([]);
//   const [loadingTesters, setLoadingTesters] = useState(false);
//   const [showCreateTesterModal, setShowCreateTesterModal] = useState(false);
//   const [selectedTesterType, setSelectedTesterType] = useState('');

//   const [selectedTesters, setSelectedTesters] = useState({
//     billable: [],
//     nonbillable: [],
//   });

//   const fetchTesters = async () => {
//     setLoadingTesters(true);
//     try {
//       const accessToken = sessionStorage.getItem('access_token');
//       if (!accessToken) {
//         setError('No access token found. Please login.');
//         return;
//       }

//       const response = await fetch('https://h25ggll0-5000.inc1.devtunnels.ms/tester-billable', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${accessToken}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Error: ${response.statusText}`);
//       }

//       const data = await response.json();
//       setTesters(data.testers || []);
//     } catch (error) {
//       console.error('Error fetching testers:', error);
//       setError('Error fetching testers: ' + error.message);
//     } finally {
//       setLoadingTesters(false);
//     }
//   };

//   useEffect(() => {
//     fetchTesters();
//   }, []);


//   const handleTesterSelection = (tester, type) => {
//     // Ensure all testers (existing or new) follow the correct format
//     const updatedList = selectedTesters[type].find(item => item.tester_name === tester.tester_name)
//       ? selectedTesters[type].filter(item => item.tester_name !== tester.tester_name)
//       : [...selectedTesters[type], { ...tester, project_name: projectName }]; // Use projectName state
  
//     const updatedSelectedTesters = { ...selectedTesters, [type]: updatedList };
  
//     // Set the selected testers state
//     setSelectedTesters(updatedSelectedTesters);
  
//     // Update tester count based on the selected testers in both categories
//     updateTesterCount(updatedSelectedTesters);
//   };
  
//   const handleCreateTester = async (testerName, type) => {
//     // Ensure the new tester follows the correct format
//     const newTester = {
//       tester_name: testerName,
//       project_name: projectName,  // Set project_name to the projectName state
//       billable: type === 'billable',
//     };
  
//     const updatedList = type === 'billable' ? [...selectedTesters.billable, newTester] : [...selectedTesters.nonbillable, newTester];
//     const updatedSelectedTesters = { ...selectedTesters, [type]: updatedList };
  
//     // Set the selected testers and update tester count
//     setSelectedTesters(updatedSelectedTesters);
//     updateTesterCount(updatedSelectedTesters);
  
//     setShowCreateTesterModal(false);
//   };

  
//   console.log('Selected Testers:', selectedTesters);

//   const updateTesterCount = (updatedSelectedTesters) => {
//     // Calculate the total tester count from both billable and nonbillable testers
//     const totalCount = updatedSelectedTesters.billable.length + updatedSelectedTesters.nonbillable.length;
//     setFormData({ ...formData, tester_count: totalCount });
//   };



//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     // Ensure the project names match
//     if (projectName !== confirmProjectName) {
//       setError('Project names do not match.');
//       return;
//     }
  
//     try {
//       const accessToken = sessionStorage.getItem('access_token');
//       if (!accessToken) throw new Error('User is not authenticated');
  
//       setIsPending(true);
  
//       // Format testers data before submitting the request
//       const testersToSubmit = [
//         ...selectedTesters.billable.map(tester => ({
//           tester_name: tester.tester_name,
//           project_name: projectName,  // Include project_name as desired
//           billable: true,
//         })),
//         ...selectedTesters.nonbillable.map(tester => ({
//           tester_name: tester.tester_name,
//           project_name: projectName,  // Include project_name as desired
//           billable: false,
//         })),
//       ];
  
//       // Prepare the request body
//       const requestBody = {
//         project_name: projectName,  // Include the project name as required
//         testers: testersToSubmit,   // Use the formatted testers data
//       };
  
//       // Send request to the backend
//       const response = await fetch('https://h25ggll0-5000.inc1.devtunnels.ms/create-project', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(requestBody),  // Send the correctly formatted data
//       });
  
//       if (!response.ok) throw new Error('Project creation failed');
  
//       const projectDataResponse = await response.json();
//       setSuccessMessage('Project created successfully!');
//       setShowCreateDetails(true); // Show the project details form once the project is created
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setIsPending(false);
//     }
//   };
  
  

 

  
//   const getAvailableTesters = (type) => {
//     return testers.filter(tester => 
//       !selectedTesters.billable.some(selectedTester => selectedTester.tester_name === tester.tester_name) &&
//       !selectedTesters.nonbillable.some(selectedTester => selectedTester.tester_name === tester.tester_name)
//     );
//   };

//   return (
//     <div className="container mt-5">
//       {/* Add Project Form */}
//       {!showCreateDetails && (
//         <Card>
//           <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff' }}>Add Project</Card.Header>
//           <Card.Body>
//             {error && <p className="text-danger">{error}</p>}
//             {successMessage && <p className="text-success">{successMessage}</p>}

//             <Form onSubmit={handleSubmit}>
//               <Form.Group controlId="projectName">
//                 <Form.Label>Project Name:</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={projectName}
//                   onChange={(e) => setProjectName(e.target.value)}
//                   required
//                 />
//               </Form.Group>
//               <Form.Group controlId="confirmProjectName">
//                 <Form.Label>Confirm Project Name:</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={confirmProjectName}
//                   onChange={(e) => setConfirmProjectName(e.target.value)}
//                   required
//                 />
//               </Form.Group>
//               <Button variant="primary" type="submit" disabled={isPending}>
//                 {isPending ? 'Creating...' : 'Create Project'}
//               </Button>
//             </Form>
//           </Card.Body>
//         </Card>
//       )}

//       {/* Create Project Details Form */}
//       {showCreateDetails && (
//         <Card className="mt-4">
//           <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff' }}>Add Project Details</Card.Header>
//           <Card.Body>
//             <Form onSubmit={() => {}}>
//               <Form.Group controlId="project_name_id">
//                 <Form.Label>Project Name:</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={projectName}
//                   readOnly
//                 />
//               </Form.Group>
//               <Form.Group controlId="rag">
//                 <Form.Label>rag</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={formData.rag}
//                   onChange={(e) => setFormData({ ...formData, rag: e.target.value })}
//                   required
//                 />
//               </Form.Group>
              
//               <Form.Group controlId="rag_details">
//                 <Form.Label>rag Details</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={formData.rag_details}
//                   onChange={(e) => setFormData({ ...formData, rag_details: e.target.value })}
//                   required
//                 />
//               </Form.Group>
 

//               {/* Billable Testers Dropdown */}
//               <Form.Group controlId="billable">
//                 <Form.Label>Billable Testers</Form.Label>
//                 <Dropdown>
//                   <Dropdown.Toggle variant="success" id="dropdown-basic">
//                     {selectedTesters.billable.length > 0 ? selectedTesters.billable.map(t => t.tester_name).join(', ') : 'Select Billable Testers'}
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu>
//                     {loadingTesters ? (
//                       <Dropdown.ItemText>
//                         <Spinner animation="border" size="sm" />
//                         Loading...
//                       </Dropdown.ItemText>
//                     ) : (
//                       getAvailableTesters('billable').map(tester => (
//                         <Dropdown.Item
//                           key={tester.id}
//                           onClick={() => handleTesterSelection(tester, 'billable')}
//                         >
//                           {tester.tester_name}
//                         </Dropdown.Item>
//                       ))
//                     )}
//                     <Dropdown.Item onClick={() => { setSelectedTesterType('billable'); setShowCreateTesterModal(true); }}>
//                       Add New Tester
//                     </Dropdown.Item>
//                   </Dropdown.Menu>
//                 </Dropdown>
//               </Form.Group>

//               {/* Non-Billable Testers Dropdown */}
//               <Form.Group controlId="nonbillable">
//                 <Form.Label>Non-Billable Testers</Form.Label>
//                 <Dropdown>
//                   <Dropdown.Toggle variant="secondary" id="dropdown-basic">
//                     {selectedTesters.nonbillable.length > 0 ? selectedTesters.nonbillable.map(t => t.tester_name).join(', ') : 'Select Non-Billable Testers'}
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu>
//                     {loadingTesters ? (
//                       <Dropdown.ItemText>
//                         <Spinner animation="border" size="sm" />
//                         Loading...
//                       </Dropdown.ItemText>
//                     ) : (
//                       getAvailableTesters('nonbillable').map(tester => (
//                         <Dropdown.Item
//                           key={tester.id}
//                           onClick={() => handleTesterSelection(tester, 'nonbillable')}
//                         >
//                           {tester.tester_name}
//                         </Dropdown.Item>
//                       ))
//                     )}
//                     <Dropdown.Item onClick={() => { setSelectedTesterType('nonbillable'); setShowCreateTesterModal(true); }}>
//                       Add New Tester
//                     </Dropdown.Item>
//                   </Dropdown.Menu>
//                 </Dropdown>
//               </Form.Group>

//               {/* Tester Count */}
//               <Form.Group controlId="tester_count">
//                 <Form.Label>Tester Count</Form.Label>
//                 <Form.Control
//                   type="number"
//                   value={formData.tester_count}
//                   readOnly
//                 />

//                               {/* Automation Used Section */}
//               <Form.Group controlId="Automation">
//               <Form.Label>Automation Used</Form.Label>
//               <div>
//                 <Form.Check
//                   type="radio"
//                   label="Yes"
//                   value="Yes"
//                   checked={formData.automation === 'Yes'}
//                   onChange={(e) => setFormData({ ...formData, automation: e.target.value })}
//                 />
//                 <Form.Check
//                   type="radio"
//                   label="No"
//                   value="No"
//                   checked={formData.automation === 'No'}
//                   onChange={(e) => setFormData({ ...formData, automation: e.target.value })}
//                 />
//               </div>
//               {formData.automation === 'Yes' && (
//                 <Form.Group controlId="automationDetails">
//                   <Form.Label>Automation Details</Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     rows={3}
//                     value={formData.automation_details}
//                     onChange={(e) => setFormData({ ...formData, automation_details: e.target.value })}
//                   />
//                 </Form.Group>
//               )}
//               </Form.Group>

//               {/* AI Used Section */}
//               <Form.Group controlId="AI">
//               <Form.Label>AI Used</Form.Label>
//               <div>
//                 <Form.Check
//                   type="radio"
//                   label="Yes"
//                   value="Yes"
//                   checked={formData.ai_used === 'Yes'}
//                   onChange={(e) => setFormData({ ...formData, ai_used: e.target.value })}
//                 />
//                 <Form.Check
//                   type="radio"
//                   label="No"
//                   value="No"
//                   checked={formData.ai_used === 'No'}
//                   onChange={(e) => setFormData({ ...formData, ai_used: e.target.value })}
//                 />
//               </div>
//               {formData.ai_used === 'Yes' && (
//                 <Form.Group controlId="aiUsedDetails">
//                   <Form.Label>AI Used Details</Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     rows={3}
//                     value={formData.ai_used_details}
//                     onChange={(e) => setFormData({ ...formData, ai_used_details: e.target.value })}
//                   />
//                 </Form.Group>
//               )}
//               </Form.Group>




//               </Form.Group>
//               <Button variant="primary" type="submit">
//                 Submit
//               </Button>
//             </Form>
//           </Card.Body>
//         </Card>
//       )}

//       {/* Modal for Creating Tester */}
//       {showCreateTesterModal && (
//         <Modal show={showCreateTesterModal} onHide={() => setShowCreateTesterModal(false)}>
//           <Modal.Header closeButton>
//             <Modal.Title>Create New Tester</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <Form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleCreateTester(e.target.tester_name.value, selectedTesterType);
//               }}
//             >
//               <Form.Group>
//                 <Form.Label>Tester Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="tester_name"
//                   required
//                 />
//               </Form.Group>
//               <Button variant="primary" type="submit">Create Tester</Button>
//             </Form>
//           </Modal.Body>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default AddProjectWithDetails;







// import React, { useState, useEffect } from 'react';
// import { Card, Form, Button, Modal, Dropdown, Spinner } from 'react-bootstrap';

// const AddProjectWithDetails = ({ projectNameProp }) => {
//   const [projectName, setProjectName] = useState(projectNameProp); 
//   const [confirmProjectName, setConfirmProjectName] = useState('');
//   const [isPending, setIsPending] = useState(false);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [showCreateDetails, setShowCreateDetails] = useState(false);

//   const [formData, setFormData] = useState({
//     project_name_id: '',
//     rag: '',
//     tester_count: 0, // Initialize with 0
//     billable: [],
//     nonbillable: [],
//     billing_type: '',
//     rag_details: '',
//     automation: false,
//     ai_used: false,
//   });

//   const [testers, setTesters] = useState([]);
//   const [loadingTesters, setLoadingTesters] = useState(false);
//   const [showCreateTesterModal, setShowCreateTesterModal] = useState(false);
//   const [selectedTesterType, setSelectedTesterType] = useState('');

//   const [selectedTesters, setSelectedTesters] = useState({
//     billable: [],
//     nonbillable: [],
//   });

//   const fetchTesters = async () => {
//     setLoadingTesters(true);
//     try {
//       const accessToken = sessionStorage.getItem('access_token');
//       if (!accessToken) {
//         setError('No access token found. Please login.');
//         return;
//       }

//       // const response = await fetch('https://h25ggll0-5000.inc1.devtunnels.ms/tester-billable', {
//       const response = await fetch('https://h25ggll0-5000.inc1.devtunnels.ms/tester-billable', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${accessToken}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Error: ${response.statusText}`);
//       }

//       const data = await response.json();
//       setTesters(data.testers || []);
//     } catch (error) {
//       console.error('Error fetching testers:', error);
//       setError('Error fetching testers: ' + error.message);
//     } finally {
//       setLoadingTesters(false);
//     }
//   };

//   useEffect(() => {
//     fetchTesters();
//   }, []);

//   const handleTesterSelection = (tester, type) => {
//     const updatedList = selectedTesters[type].find(item => item.tester_name === tester.tester_name)
//       ? selectedTesters[type].filter(item => item.tester_name !== tester.tester_name)
//       : [...selectedTesters[type], { ...tester, project_name: projectName }];
  
//     const updatedSelectedTesters = { ...selectedTesters, [type]: updatedList };
  
//     setSelectedTesters(updatedSelectedTesters);
//     updateTesterCount(updatedSelectedTesters);
//   };

//   const handleCreateTester = async (testerName, type) => {
//     const newTester = {
//       tester_name: testerName,
//       project_name: projectName,
//       billable: type === 'billable',
//     };
  
//     const updatedList = type === 'billable' ? [...selectedTesters.billable, newTester] : [...selectedTesters.nonbillable, newTester];
//     const updatedSelectedTesters = { ...selectedTesters, [type]: updatedList };
  
//     setSelectedTesters(updatedSelectedTesters);
//     updateTesterCount(updatedSelectedTesters);
//     setShowCreateTesterModal(false);
//   };

//   const updateTesterCount = (updatedSelectedTesters) => {
//     const totalCount = updatedSelectedTesters.billable.length + updatedSelectedTesters.nonbillable.length;
//     setFormData({ ...formData, tester_count: totalCount });
//   };


//   const handleProjectSubmit = async (e) => {
//     e.preventDefault();
  
//     if (projectName !== confirmProjectName) {
//       setError('Project names do not match.');
//       return;
//     }
  
//     try {
//       const accessToken = sessionStorage.getItem('access_token');
//       if (!accessToken) throw new Error('User is not authenticated');
  
//       setIsPending(true);
  
 
//       // First, create the project
//       const requestBody = {
//         project_name: projectName,
//         // testers: testersToSubmit,
//       };
  
//       const response = await fetch('https://h25ggll0-5000.inc1.devtunnels.ms/create-project', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(requestBody),
//       });
  
//       if (!response.ok) throw new Error('Project creation failed');
  
//       const projectDataResponse = await response.json();
//       setSuccessMessage('Project created successfully!');
//       setShowCreateDetails(true);
  
//       // After creating the project, wait 3 seconds before creating testers and project details
//       setTimeout(() => {
//         handleProjectDetailsSubmit(projectDataResponse.project_id); // Pass the project ID from the response
//       }, 3000); // 3 seconds delay
  
//     } catch (error) {
//       setError('Error creating project: ' + error.message);
//     } finally {
//       setIsPending(false);
//     }
//   };
  
//   const handleProjectDetailsSubmit = async (projectId) => {
//     try {
//       const accessToken = sessionStorage.getItem('access_token');
//       if (!accessToken) throw new Error('User is not authenticated');
  
//       setIsPending(true);
  
//       // Testers to be sent in the project details request (use same testers from selectedTesters)
//       const testersToSubmit = [
//         ...selectedTesters.billable.map(tester => ({
//           tester_name: tester.tester_name,
//           project_name: projectName,
//           billable: true,
//         })),
//         ...selectedTesters.nonbillable.map(tester => ({
//           tester_name: tester.tester_name,
//           project_name: projectName,
//           billable: false,
//         })),
//       ];
  
//       // Step 1: Create the testers
//       const createTestersResponse = await fetch('https://h25ggll0-5000.inc1.devtunnels.ms/tester-billable', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify({ testers: testersToSubmit }),
//       });
  
//       if (!createTestersResponse.ok) {
//         throw new Error('Testers creation failed');
//       }
//       else{
//         console.log(`submited data ${testersToSubmit}`)
//         console.log(`json formate data ${JSON.stringify({ testers: testersToSubmit })}`)
//       }
  
//       const testersResponseData = await createTestersResponse.json();
//       console.log('Testers created successfully:', testersResponseData);
  
//       // Step 2: Create the project details
//       const projectDetailsPayload = {// Use projectId received after project creation
//         project_name: projectName,
//         rag: formData.rag,
//         tester_count: formData.tester_count,
//         testers: testersToSubmit,
//         billing_type: formData.billing_type,
//         rag_details: formData.rag_details,
//         automation: formData.automation === 'Yes', // Assuming 'Yes' is a boolean
//         ai_used: formData.ai_used === 'Yes', // Assuming 'Yes' is a boolean
//       };
  
//       const response2 = await fetch('https://h25ggll0-5000.inc1.devtunnels.ms/create-project-details', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(projectDetailsPayload),
//       });
  
//       if (!response2.ok) throw new Error('Project details creation failed');
  
//       const projectDetailsResponse = await response2.json();
//       setSuccessMessage('Project details created successfully!');
//       // Additional success handling can go here
  
//     } catch (error) {
//       setError('Error creating project details: ' + error.message);
//     } 
//   };

  

//   const getAvailableTesters = (type) => {
//     return testers.filter(tester => 
//       !selectedTesters.billable.some(selectedTester => selectedTester.tester_name === tester.tester_name) &&
//       !selectedTesters.nonbillable.some(selectedTester => selectedTester.tester_name === tester.tester_name)
//     );
//   };

//   return (
//     <div className="container mt-5">
//       {/* Add Project Form */}
//       {!showCreateDetails && (
//         <Card>
//           <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff' }}>Add Project</Card.Header>
//           <Card.Body>
//             {error && <p className="text-danger">{error}</p>}
//             {successMessage && <p className="text-success">{successMessage}</p>}

//             <Form onSubmit={handleProjectSubmit}>
//               <Form.Group controlId="projectName">
//                 <Form.Label>Project Name:</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={projectName}
//                   onChange={(e) => setProjectName(e.target.value)}
//                   required
//                 />
//               </Form.Group>
//               <Form.Group controlId="confirmProjectName">
//                 <Form.Label>Confirm Project Name:</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={confirmProjectName}
//                   onChange={(e) => setConfirmProjectName(e.target.value)}
//                   required
//                 />
//               </Form.Group>
//               <br/>
//               <Button variant="primary" type="submit" disabled={isPending} 
//                     style={{
//                 fontWeight: 'bold',
//                 color: '#ffffff', // White text for better contrast on the dark button
//                 backgroundColor: '#000d6b', // Background color for the button
//                 borderColor: '#000d6b', // Border color to match
//               }}>

//                 {isPending ? 'Creating...' : 'Create Project'}
//               </Button>
//             </Form>
//           </Card.Body>
//         </Card>
//       )}

//       {/* Create Project Details Form */}
//       {showCreateDetails && (
//         <Card className="mt-4">
//           <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff' }}>Add Project Details</Card.Header>
//           <Card.Body>
//             <div style={{ maxHeight: '600px', overflowY: 'auto' }}> {/* Apply Scroll on Overflow */}
//               <Form onSubmit={handleProjectDetailsSubmit}>
//                 <Form.Group controlId="project_name_id">
//                   <Form.Label>Project Name:</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={projectName}
//                     readOnly
//                   />
//                 </Form.Group>
//                 <Form.Group controlId="rag">
//                   <Form.Label>rag</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={formData.rag}
//                     onChange={(e) => setFormData({ ...formData, rag: e.target.value })}
//                     required
//                   />
//                 </Form.Group>


//                 <Form.Group controlId="rag_details">
//                  <Form.Label>rag Details</Form.Label>
//                  <Form.Control
//                    type="text"
//                    value={formData.rag_details}
//                    onChange={(e) => setFormData({ ...formData, rag_details: e.target.value })}
//                    required
//                  />
//                </Form.Group>

//                 {/* Billable Testers Dropdown */}
//                 <Form.Group controlId="billable">
//                   <Form.Label>Billable Testers</Form.Label>
//                   <Dropdown>
//                     <Dropdown.Toggle variant="success" id="dropdown-basic">
//                       {selectedTesters.billable.length > 0 ? selectedTesters.billable.map(t => t.tester_name).join(', ') : 'Select Billable Testers'}
//                     </Dropdown.Toggle>
//                     <Dropdown.Menu>
//                       {loadingTesters ? (
//                         <Dropdown.ItemText>
//                           <Spinner animation="border" size="sm" />
//                           Loading...
//                         </Dropdown.ItemText>
//                       ) : (
//                         getAvailableTesters('billable').map(tester => (
//                           <Dropdown.Item
//                             key={tester.id}
//                             onClick={() => handleTesterSelection(tester, 'billable')}
//                           >
//                             {tester.tester_name}
//                           </Dropdown.Item>
//                         ))
//                       )}
//                       <Dropdown.Item onClick={() => { setSelectedTesterType('billable'); setShowCreateTesterModal(true); }}>
//                         Add New Tester
//                       </Dropdown.Item>
//                     </Dropdown.Menu>
//                   </Dropdown>
//                 </Form.Group>

//                 {/* Non-Billable Testers Dropdown */}
//                 <Form.Group controlId="nonbillable">
//                   <Form.Label>Non-Billable Testers</Form.Label>
//                   <Dropdown>
//                     <Dropdown.Toggle variant="secondary" id="dropdown-basic">
//                       {selectedTesters.nonbillable.length > 0 ? selectedTesters.nonbillable.map(t => t.tester_name).join(', ') : 'Select Non-Billable Testers'}
//                     </Dropdown.Toggle>
//                     <Dropdown.Menu>
//                       {loadingTesters ? (
//                         <Dropdown.ItemText>
//                           <Spinner animation="border" size="sm" />
//                           Loading...
//                         </Dropdown.ItemText>
//                       ) : (
//                         getAvailableTesters('nonbillable').map(tester => (
//                           <Dropdown.Item
//                             key={tester.id}
//                             onClick={() => handleTesterSelection(tester, 'nonbillable')}
//                           >
//                             {tester.tester_name}
//                           </Dropdown.Item>
//                         ))
//                       )}
//                       <Dropdown.Item onClick={() => { setSelectedTesterType('nonbillable'); setShowCreateTesterModal(true); }}>
//                         Add New Tester
//                       </Dropdown.Item>
//                     </Dropdown.Menu>
//                   </Dropdown>
//                 </Form.Group>

//                 {/* Tester Count */}
//                 <Form.Group controlId="tester_count">
//                   <Form.Label>Tester Count</Form.Label>
//                   <Form.Control
//                     type="number"
//                     value={formData.tester_count}
//                     readOnly
//                   />
//                 </Form.Group>

//                 <Form.Group controlId="Billable_Type">


//               <Form.Label>Billable Type</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={formData.Billable_Type}
//                   onChange={(e) => setFormData({ ...formData, Billable_Type: e.target.value })}
//                   required
//                 />
//               </Form.Group>


//                 {/* Automation Used Section */}
//                 <Form.Group controlId="Automation">
//                   <Form.Label>Automation Used</Form.Label>
//                   <div>
//                     <Form.Check
//                       type="radio"
//                       label="Yes"
//                       value="Yes"
//                       checked={formData.automation === 'Yes'}
//                       onChange={(e) => setFormData({ ...formData, automation: e.target.value })}
//                     />
//                     <Form.Check
//                       type="radio"
//                       label="No"
//                       value="No"
//                       checked={formData.automation === 'No'}
//                       onChange={(e) => setFormData({ ...formData, automation: e.target.value })}
//                     />
//                   </div>
//                   {formData.automation === 'Yes' && (
//                     <Form.Group controlId="automationDetails">
//                       <Form.Label>Automation Details</Form.Label>
//                       <Form.Control
//                         as="textarea"
//                         rows={3}
//                         value={formData.automation_details}
//                         onChange={(e) => setFormData({ ...formData, automation_details: e.target.value })}
//                       />
//                     </Form.Group>
//                   )}
//                 </Form.Group>

//                 {/* AI Used Section */}
//                 <Form.Group controlId="AI">
//                   <Form.Label>AI Used</Form.Label>
//                   <div>
//                     <Form.Check
//                       type="radio"
//                       label="Yes"
//                       value="Yes"
//                       checked={formData.ai_used === 'Yes'}
//                       onChange={(e) => setFormData({ ...formData, ai_used: e.target.value })}
//                     />
//                     <Form.Check
//                       type="radio"
//                       label="No"
//                       value="No"
//                       checked={formData.ai_used === 'No'}
//                       onChange={(e) => setFormData({ ...formData, ai_used: e.target.value })}
//                     />
//                   </div>
//                   {formData.ai_used === 'Yes' && (
//                     <Form.Group controlId="aiUsedDetails">
//                       <Form.Label>AI Used Details</Form.Label>
//                       <Form.Control
//                         as="textarea"
//                         rows={3}
//                         value={formData.ai_used_details}
//                         onChange={(e) => setFormData({ ...formData, ai_used_details: e.target.value })}
//                       />
//                     </Form.Group>
//                   )}
//                 </Form.Group>
//                   <br/>
//                 <Button variant="primary" type="submit"                     
//                 style={{
//                 fontWeight: 'bold',
//                 color: '#ffffff', // White text for better contrast on the dark button
//                 backgroundColor: '#000d6b', // Background color for the button
//                 borderColor: '#000d6b', // Border color to match
//               }} >
//                   Submit
//                 </Button>
//               </Form>
//             </div> {/* End of scrollable wrapper */}
//           </Card.Body>
//         </Card>
//       )}

//       {/* Modal for Creating Tester */}
//       {showCreateTesterModal && (
//         <Modal show={showCreateTesterModal} onHide={() => setShowCreateTesterModal(false)}>
//           <Modal.Header closeButton>
//             <Modal.Title>Create New Tester</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <Form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleCreateTester(e.target.tester_name.value, selectedTesterType);
//               }}
//             >
//               <Form.Group>
//                 <Form.Label>Tester Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="tester_name"
//                   required
//                 />
//               </Form.Group>
//               <Button variant="primary" type="submit">Create Tester</Button>
//             </Form>
//           </Modal.Body>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default AddProjectWithDetails;

