// import React, { useState, useEffect } from 'react';
// import { Card, Table, Button, Form, Modal, Alert } from 'react-bootstrap';
// import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa'; // Import the edit and delete icons
// import './Modal.css';

// const AdminProjectTable = () => {
//   const [projects, setProjects] = useState([]);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [ssselectedProject, sssetSelectedProject] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [showAddTesterModal, setShowAddTesterModal] = useState(false);
//   const [billableUsers, setBillableUsers] = useState([]);
//   const [nonBillableUsers, setNonBillableUsers] = useState([]);
//   const [testerName, setTesterName] = useState('');
//   const [testerType, setTesterType] = useState('billable');
//   const [availableUsers, setAvailableUsers] = useState([]);

//   const [automation, setAutomation] = useState(null);
//   const [aiUsed, setAiUsed] = useState(null);
//   const [automationText, setAutomationText] = useState('');
//   const [aiText, setAiText] = useState('');

//   const [formErrors, setFormErrors] = useState({});
//   const [formData, setFormData] = useState({
//     projectName: '',
//     rag: '',
//     tester_count: 0, // Initialize with 0
//     billable: [],
//     nonbillable: [],
//     billing_type: '',
//     rag_details: '',
//     automation: false,
//     ai_used: false,
//   });

//    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
//   const [selectedMonth, setSelectedMonth] = useState(''); // Selected month
//   const [loading, setLoading] = useState(false); // For spinner (loading state)
//   const [error, setError] = useState(''); // For error message
//   const [project_ids, setproject_id] = useState(''); // For error message



//   // Fetch project data from the API
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const response = await fetch('https://frt4cnbr-5000.inc1.devtunnels.ms//project-details', {
//           headers: {
//             'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`,
//           },
//         });
//         const data = await response.json();
//         setproject_id(data)
//         setProjects(data.project_details);
//       } catch (error) {
//         console.error('Error fetching projects:', error);
//       }
//     };
//     fetchProjects();

//   }, []);

// // Function to handle the modal open when the "View Metrics" button is clicked
// const handleViewMetrics = (project_ids) => {
//   setSelectedProject(project_ids);
//   console.log(project_ids)
//   console.log("inside the functuon") // Store the selected project
//   setIsModalOpen(true); // Open the modal
// };

//   // Function to handle the month change
//   const handleMonthChange = (event) => {
//     setSelectedMonth(event.target.value);
//   };


//    // Function to open the modal
//   //  const handleGenerateReport = (projectNameId) => {
//   //   setIsModalOpen(true);
//   // };

//    // Function to close the modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//     console.log("closed")
//     setSelectedMonth('');
//     setError('');
//   };


//   // Fetch users for billable and nonbillable based on the project data
//   const fetchBillableAndNonBillable = async (billableIds, nonBillableIds) => {
//     try {
//       const response = await fetch('https://frt4cnbr-5000.inc1.devtunnels.ms//get_tester_details', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ids: billableIds,
//           nonbillable_ids: nonBillableIds,
//         }),
//       });

//       const data = await response.json();
//       setBillableUsers(data.billable_testers || []);
//       setNonBillableUsers(data.nonbillable_testers || []);
//       setAvailableUsers(data.available_testers || []);
//     } catch (error) {
//       console.error('Error fetching billable or nonbillable users:', error);
//     }
//   };

//   // Handle form submission to update the project
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFormErrors({}); // Reset previous errors

//     const form = e.target;
//     const newErrors = {};

//     // Validate fields
//     if (!form.project_name.value) {
//       newErrors.project_name = 'Project Name is required';
//     }

//     if (!form.rag.value) {
//       newErrors.rag = 'rag is required';
//     }

//     if (billableUsers.length === 0 && nonBillableUsers.length === 0) {
//       newErrors.testers = 'At least one Billable or Non-Billable tester is required';
//     }

//     if (!form.billing_type.value) {
//       newErrors.billing_type = 'Billing Type is required';
//     }

//     // If there are validation errors, do not proceed with form submission
//     if (Object.keys(newErrors).length > 0) {
//       setFormErrors(newErrors);
//       return;
//     }

//     // Prepare the updated project details
//     const updatedProject = {
//       project_name: form.project_name.value,
//       rag: form.rag.value,
//       tester_count: billableUsers.length + nonBillableUsers.length,
//       billable: billableUsers.map((user) => user.tester_name),
//       nonbillable: nonBillableUsers.map((user) => user.tester_name),
//       billing_type: form.billing_type.value,
//       automation: automation ? automationText : null,
//       ai_used: aiUsed ? aiText : null,
//     };

//     console.log(updatedProject); // Log the updated project details for debugging

//     // Send the updated project data to the backend
//     try {
//       const response = await fetch(`https://frt4cnbr-5000.inc1.devtunnels.ms//update-project-details/${selectedProject.id}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updatedProject),
//       });
//       if (response.ok) {
//         setProjects((prevProjects) =>
//           prevProjects.map((project) =>
//             project.id === selectedProject.id ? { ...project, ...updatedProject } : project
//           )
//         );
//         setShowModal(false);
//         setSelectedProject(null);
//       } else {
//         console.error('Failed to update project');
//       }
//     } catch (error) {
//       console.error('Error updating project:', error);
//     }
//   };

//   // Handle editing a project
//   const handleEdit = (project) => {
//     setSelectedProject(project);
//     setShowModal(true);
//     fetchBillableAndNonBillable(project.billable, project.nonbillable);

//     setAutomation(project.automation ? true : false);
//     setAiUsed(project.ai_used ? true : false);
//     setAutomationText(project.automation || '');
//     setAiText(project.ai_used || '');

//     // Prepopulate the rag details field in the form
//     setFormData({
//       ...formData,
//       rag_details: project.rag_details || '',  // Set the rag_details from the selected project
//     });
//   };


//   // Handle deleting a project
//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm('Are you sure you want to delete this project?');
//     if (confirmDelete) {
//       try {
//         const response = await fetch(`https://frt4cnbr-5000.inc1.devtunnels.ms//delete-project/${id}`, {
//           method: 'DELETE',
//           headers: {
//             'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`,
//           },
//         });
//         if (response.ok) {
//           setProjects(projects.filter((project) => project.id !== id));
//         } else {
//           console.error('Failed to delete project');
//         }
//       } catch (error) {
//         console.error('Error deleting project:', error);
//       }
//     }
//   };

//   // Handle closing the modal without saving changes
//   const handleCancel = () => {
//     setShowModal(false);
//     setSelectedProject(null);
//   };

//   // Open the Add Tester modal
//   const handleAddTesterModal = (type) => {
//     setTesterType(type);
//     setShowAddTesterModal(true);
//   };

//   const handleRemoveTester = (testerId, type) => {
//     if (type === 'billable') {
//       setBillableUsers(billableUsers.filter(user => user.id !== testerId));
//     } else {
//       setNonBillableUsers(nonBillableUsers.filter(user => user.id !== testerId));
//     }
//   };

//   // Handle adding tester to the selected list (Billable or Non-Billable)
//   const handleAddTester = () => {
//     if (testerName.trim()) {
//       const newTester = { id: Date.now(), tester_name: testerName };

//       if (testerType === 'billable') {
//         setBillableUsers([...billableUsers, newTester]);
//       } else {
//         setNonBillableUsers([...nonBillableUsers, newTester]);
//       }

//       setTesterName(''); // Clear the tester name field
//       setShowAddTesterModal(false); // Close the Add Tester modal
//     }
//   };

//   // Function to determine background color for rag
//   const getRAGColor = (rag) => {
//     switch (rag) {
//       case 'Red':
//         return 'red';
//       case 'Amber':
//         return 'orange';
//       case 'Green':
//         return 'green';
//       default:
//         return 'transparent';
//     }
//   };

  

//   const handleGenerateReport = async (projectId, month) => {
//     const url = `https://frt4cnbr-5000.inc1.devtunnels.ms/generate_pdf/${projectId}`; // API endpoint
  
//     setLoading(true); // Start loading when generating the report
//     setError(''); // Reset any previous errors
  
//     try {
//       // Make the POST request to the API with the access token in headers and sending the month as part of the payload
//       const response = await fetch(url, {
//         method: 'POST', // Change method to POST
//         headers: {
//           'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ month: month }), // Send the month in the request body as a JSON payload
//       });
  
//       // Check if the response is successful
//       if (!response.ok) {
//         throw new Error('Failed to generate report');
//       }
  
//       // If you expect a PDF file, handle the response like this
      // const blob = await response.blob(); // Assuming the response is a blob (PDF file)
  
//       // Create a URL for the PDF blob and open it in a new window/tab
//       const urlBlob = window.URL.createObjectURL(blob);
//       window.open(urlBlob, '_blank'); // Opens the PDF in a new tab
  
//       // Optionally, you can alert or display a success message
//       alert('Report generated successfully!');
//       closeModal(); // Close the modal after generating the report
  
//     } catch (error) {
//       console.error('Error:', error);
//       setError('Error generating report. Please try again.');
//     } finally {
//       setLoading(false); // Stop loading when done
//     }
//   };

//   return (
//     <>

// <Card className="mb-4">
//         <Card.Body>
//           <h2>admin Dashboard</h2> {/* Title for the page */}
//         </Card.Body>
//       </Card>
//       <Card className="mt-3">
//         <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff', borderRadius: '10px 10px 0 0' }}>
//           Project Details
//         </Card.Header>
//         <Card.Body>
//           <div className="table-responsive">
//             <Table striped bordered hover style={{ borderRadius: '15px', overflow: 'hidden' }}>
//               <thead>
//                 <tr>
//                   <th>Project Name</th>
//                   <th>rag - Delivery</th>
//                   <th>Tester Count</th>
//                   <th>Billable</th>
//                   <th>Nonbillable</th>
//                   <th>Billing Type</th>
//                   <th>Automation</th>
//                   <th>AI</th>
//                   <th>Actions</th>
//                   <th>Download full report</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {projects.map((project) => (
//                   <tr key={project.id} style={{ backgroundColor: getRAGColor(project.rag) }}>
//                     <td>{project.project_name}</td>
//                     <td>{project.rag}</td>
//                     <td>{project.tester_count}</td>
//                     <td>{project.billable.length}</td>
//                     <td>{project.nonbillable.length}</td>
//                     <td>{project.billing_type}</td>
//                     <td>{project.automation ? 'Yes' : 'No'}</td>
//                     <td>{project.ai_used ? 'Yes' : 'No'}</td>
//                     <td>
//                     <Button variant="warning" onClick={() => handleEdit(project)} style={{ marginRight: '10px' }}>
//                         <FaEdit /> {/* Edit Icon */}
//                       </Button>
//                       <Button variant="danger" onClick={() => handleDelete(project.id)}>
//                         <FaTrash /> {/* Delete Icon */}
//                       </Button>
//                     </td>
//                      {/* Button that triggers modal */}
//       <td>
//         <button onClick={() => handleViewMetrics(project)}>
//           View Metrics
//         </button>
//       </td>
      
//                   </tr>

                  
//                 ))}

                
//               </tbody>
              
//             </Table>
//           </div>
          
//         </Card.Body>
        
//       </Card>

//        {/* Modal */}
// {isModalOpen && (
//   <div className="modal-overlay">
//     <div className="modal-content">
//       <div className="modal-header">
//         <h3>Select Month</h3>
//       </div>
//       <select onChange={handleMonthChange} value={selectedMonth}>
//         <option value="">Select Month</option>
//         <option value="January">January</option>
//         <option value="February">February</option>
//         <option value="March">March</option>
//         <option value="April">April</option>
//         <option value="May">May</option>
//         <option value="June">June</option>
//         <option value="July">July</option>
//         <option value="August">August</option>
//         <option value="September">September</option>
//         <option value="October">October</option>
//         <option value="November">November</option>
//         <option value="December">December</option>
//       </select>

//       {error && <p className="error">{error}</p>}

//       {/* Button for generating report */}
//       <button
//         onClick={() => handleGenerateReport(selectedProject.project_name_id, selectedMonth)}
//         disabled={loading || !selectedMonth}
//         className="generate-report-btn"
//       >
//         {loading ? 'Generating Report...' : 'Generate Report'}
//       </button>

//       {/* Close Modal Button */}
//       <button onClick={closeModal} className="close-btn">Close</button>
//     </div>

//     {/* Modal overlay */}
//     <div className="modal-overlay" onClick={closeModal}></div>
//   </div>
// )}

        

      
//       {/* Project Details Modal (Edit or Create) */}
//       <Modal show={showModal} onHide={handleCancel} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Project Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
//           {selectedProject && (
//             <Form onSubmit={handleSubmit}>
//               {/* Project Name */}
//               <Form.Group controlId="project_name">
//                 <Form.Label>Project Name</Form.Label>
//                 <Form.Control type="text" 
//                 style={{backgroundColor : "grey"}}
//                 defaultValue={selectedProject.project_name} required 
//                 readOnly />
//                 {formErrors.project_name && <Alert variant="danger">{formErrors.project_name}</Alert>}
              
//               </Form.Group>
              

//               {/* rag */}
//               <Form.Group controlId="rag">
//                 <Form.Label>rag</Form.Label>
//                 <Form.Select
//                   value={selectedProject.rag} // Prepopulate the rag with the selected project's rag value
//                   onChange={(e) => setFormData({ ...formData, rag: e.target.value })}
//                   required
//                 >
//                   <option value="Red">Red</option>
//                   <option value="Amber">Amber</option>
//                   <option value="Green">Green</option>
//                 </Form.Select>
//               </Form.Group>

//             <Form.Group controlId="rag_details">
//               <Form.Label style={{ fontWeight: '' }}>rag Details</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={formData.rag_details}
//                 onChange={(e) => setFormData({ ...formData, rag_details: e.target.value })}
//                 required
//                 style={{ borderRadius: '5px', border: '1px solid #ced4da', padding: '10px' }}
//               />
//             </Form.Group>

//               {/* Tester Count */}
//               <Form.Group controlId="tester_count">
//                 <Form.Label>Tester Count</Form.Label>
//                 <Form.Control type="number" value={billableUsers.length + nonBillableUsers.length} readOnly />
//               </Form.Group>



// <Form.Group controlId="billable">
//                 <Form.Label>Billable</Form.Label>
//                 <div>
//                   {billableUsers.map((user) => (
//                     <span key={user.id}>
//                       {user.tester_name}{' '}
//                       <FaTimes
//                         style={{ cursor: 'pointer', color: 'red' }}
//                         onClick={() => handleRemoveTester(user.id, 'billable')}
//                       />{' '}
//                     </span>
//                   ))}
//                 </div>

//                 <Button variant="success" onClick={() => handleAddTesterModal('billable')} style={{ marginTop: '10px' }}>
//                   Add Tester
//                 </Button>
//               </Form.Group>


//               {/* Non-Billable */}
//               <Form.Group controlId="nonbillable">
//                 <Form.Label>Non-Billable</Form.Label>
//                 <div>
//                   {nonBillableUsers.map((user) => (
//                     <span key={user.id}>
//                       {user.tester_name}{' '}
//                       <FaTimes
//                         style={{ cursor: 'pointer', color: 'red' }}
//                         onClick={() => handleRemoveTester(user.id, 'nonbillable')}
//                       />{' '}
//                     </span>
//                   ))}
//                 </div>
//                 <Button variant="success" onClick={() => handleAddTesterModal('nonbillable')} style={{ marginTop: '10px' }}>
//                   Add Tester
//                 </Button>
//               </Form.Group>

//               {/* Billing Type */}
//               <Form.Group controlId="billing_type">
//                 <Form.Label>Billing Type</Form.Label>
//                 <Form.Select
//                   value={selectedProject.billing_type} // Prepopulate the billing type
//                   onChange={(e) => setFormData({ ...formData, billing_type: e.target.value })}
//                   required
//                 >
//                   <option value="T&M">T&M</option>
//                   <option value="FIXED">FIXED</option>
//                 </Form.Select>
//               </Form.Group>



//               {/* Automation Field
//               <Form.Group c >
//                 <Form.Label m.Label>
//                 <div>
//                   <Form.Che 
//                     type="r 
//                     label=" 
//                     value="Yes"
//                     checked={formData.automation === 'Yes'}
//                     onChange={(e) => setFormData({ ...formData, automation: e.target.value })}
//                   />
//                   <Form.Check
//                     type="radio"
//                     label="No"
//                     value="No"
//                     checked={formData.automation === 'No'}
//                     onChange={(e) => setFormData({ ...formData, automation: e.target.value })}
//                   />
//                 </div>
//                 {formData.automation === 'Yes' && (
//                   <div>
//                     <Button
//                       variant="secondary"
//                       onClick={() => setFormData({ ...formData, automation_details: "Selenium" })}
//                       style={{ marginRight: '10px' }}
//                     >
//                       Selenium
//                     </Button>
//                     <Button
//                       variant="secondary"
//                       onClick={() => setFormData({ ...formData, automation_details: "Pytest" })}
//                     >
//                       Pytest
//                     </Button>
//                     <Form.Group controlId="automationDetails" style={{ marginTop: '10px' }}>
//                       <Form.Label>Automation Tool</Form.Label>
//                       <Form.Control
//                         as="textarea"
//                         rows={3}
//                         value={formData.automation_details}
//                         onChange={(e) => setFormData({ ...formData, automation_details: e.target.value })}
//                         placeholder="Details about the selected automation tool"
//                       />
//                     </Form.Group>
//                     </div>
//                 )}
//               </Form.Group>
//               AI Used Field
//               <Form.Group controlId="AI">
//                 <Form.Label>AI Used</Form.Label>
//                 <div>
//                   <Form.Check
//                     type="radio"
//                     label="Yes"
//                     value="Yes"
//                     checked={formData.ai_used === 'Yes'}
//                     onChange={(e) => setFormData({ ...formData, ai_used: e.target.value })}
//                   />
//                   <Form.Check
//                     type="radio"
//                     label="No"
//                     value="No"
//                     checked={formData.ai_used === 'No'}
//                     onChange={(e) => setFormData({ ...formData, ai_used: e.target.value })}
//                   />
//                 </div>
//                 {formData.ai_used === 'Yes' && (
//                   <div>
//                     <Button
//                       variant="secondary"
//                       onClick={() => setFormData({ ...formData, ai_used_details: "TensorFlow" })}
//                       style={{ marginRight: '10px' }}
//                     >
//                       TensorFlow
//                     </Button>
//                     <Button
//                       variant="secondary"
//                       onClick={() => setFormData({ ...formData, ai_used_details: "PyTorch" })}
//                     >
//                       PyTorch
//                     </Button>
//                     <Form.Group controlId="aiUsedDetails" style={{ marginTop: '10px' }}>
//                       <Form.Label>AI Tool</Form.Label>
//                       <Form.Control
//                         as="textarea"
//                         rows={3}
//                         value={formData.ai_used_details}
//                         onChange={(e) => setFormData({ ...formData, ai_used_details: e.target.value })}
//                         placeholder="Details about the selected AI tool"
//                       />
//                     </Form.Group>
//                   </div>
//                 )}
//               </Form.Group> */}


//               {/* Automation Field */}
// <Form.Group controlId="Automation">
//   <Form.Label>Automation Used</Form.Label>
//   <div>
//     <Form.Check
//       type="radio"
//       label="Yes"
//       value="Yes"
//       checked={automation === true} // Ensure the correct radio button is selected
//       onChange={() => {
//         setAutomation(true);
//         setAutomationText("");  // Reset text area if changing to "Yes"
//       }}
//     />
//     <Form.Check
//       type="radio"
//       label="No"
//       value="No"
//       checked={automation === false} // Ensure the correct radio button is selected
//       onChange={() => setAutomation(false)}
//     />
//   </div>
//   {automation === true && (  // Display input box when "Yes" is selected
//     <div>
//       <Form.Group controlId="automationDetails" style={{ marginTop: '10px' }}>
//         <Form.Label>Automation Tool</Form.Label>
//         <Form.Control
//           as="textarea"
//           rows={3}
//           value={automationText}
//           onChange={(e) => setAutomationText(e.target.value)}  // Handle text change
//           placeholder="Details about the selected automation tool"
//         />
//       </Form.Group>
//     </div>
//   )}
// </Form.Group>

// {/* AI Used Field */}
// <Form.Group controlId="AI">
//   <Form.Label>AI Used</Form.Label>
//   <div>
//     <Form.Check
//       type="radio"
//       label="Yes"
//       value="Yes"
//       checked={aiUsed === true}  // Ensure the correct radio button is selected
//       onChange={() => {
//         setAiUsed(true);
//         setAiText("");  // Reset text area if changing to "Yes"
//       }}
//     />
//     <Form.Check
//       type="radio"
//       label="No"
//       value="No"
//       checked={aiUsed === false}  // Ensure the correct radio button is selected
//       onChange={() => setAiUsed(false)}
//     />
//   </div>
//   {aiUsed === true && (  // Display input box when "Yes" is selected
//     <div>
//       <Form.Group controlId="aiUsedDetails" style={{ marginTop: '10px' }}>
//         <Form.Label>AI Tool</Form.Label>
//         <Form.Control
//           as="textarea"
//           rows={3}
//           value={aiText}
//           onChange={(e) => setAiText(e.target.value)}  // Handle text change
//           placeholder="Details about the selected AI tool"
//         />
//       </Form.Group>
//     </div>
//   )}
// </Form.Group>


//               <Button variant="primary" type="submit">
//                 Save Changes
//               </Button>
//             </Form>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCancel}>
//             Cancel
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Add Tester Modal */}
//       <Modal show={showAddTesterModal} onHide={() => setShowAddTesterModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Add Tester</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group controlId="testerName">
//               <Form.Label>Tester Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={testerName}
//                 onChange={(e) => setTesterName(e.target.value)}
//                 placeholder="Enter tester's name"
//                 required
//               />
//             </Form.Group>
//             <Button variant="primary" onClick={handleAddTester}>
//               Add Tester
//             </Button>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowAddTesterModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default AdminProjectTable;





import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa'; // Import the edit and delete icons

const AdminProjectTable = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddTesterModal, setShowAddTesterModal] = useState(false);
  const [billableUsers, setBillableUsers] = useState([]);
  const [nonBillableUsers, setNonBillableUsers] = useState([]);
  const [testerName, setTesterName] = useState('');
  const [testerType, setTesterType] = useState('billable');
  const [availableUsers, setAvailableUsers] = useState([]);

  const [automation, setAutomation] = useState(null);
  const [aiUsed, setAiUsed] = useState(null);
  const [automationText, setAutomationText] = useState('');
  const [aiText, setAiText] = useState('');
  const [showDownloadModal, setShowDownloadModal] = useState(false);
const [selectedMonth, setSelectedMonth] = useState('');


  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    projectName: '',
    rag: '',
    tester_count: 0, // Initialize with 0
    billable: [],
    nonbillable: [],
    billing_type: '',
    rag_details: '',
    automation: false,
    ai_used: false,
  });

  // Fetch project data from the API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://frt4cnbr-5000.inc1.devtunnels.ms//project-details', {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`,
          },
        });
        const data = await response.json();
        setProjects(data.project_details);
        console.log(data.project_details);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const fetchBillableAndNonBillable = async (billableIds, nonBillableIds) => {
    try {
      const response = await fetch('https://frt4cnbr-5000.inc1.devtunnels.ms//get_tester_details', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: billableIds,
          nonbillable_ids: nonBillableIds,
        }),
      });
  
      const data = await response.json();
      setBillableUsers(data.billable_testers || []);
      setNonBillableUsers(data.nonbillable_testers || []);
  
      // Combine both billable and nonbillable testers to create a list of already assigned testers
      const assignedTesters = [
        ...data.billable_testers.map(user => user.tester_name), // Use tester_name to avoid duplicate names
        ...data.nonbillable_testers.map(user => user.tester_name),
      ];
  
      // Filter available testers and exclude those who are already assigned to the project
      const availableTesters = data.available_testers.filter(tester => 
        !assignedTesters.includes(tester.tester_name) // Ensure tester names are unique
      );
  
      setAvailableUsers(availableTesters);
  
      console.log("Billable Testers: ", data.billable_testers);
      console.log("Non-Billable Testers: ", data.nonbillable_testers);
      console.log("Available Testers (after filtering): ", availableTesters);
  
    } catch (error) {
      console.error('Error fetching billable or nonbillable users:', error);
    }
  };
  

  // Handle form submission to update the project
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({}); // Reset previous errors

    const newErrors = {};

    // Custom validation
    if (!formData.projectName) {
      newErrors.projectName = 'Project Name is required';
    }

    if (!formData.rag) {
      newErrors.rag = 'rag is required';
    }

    if (billableUsers.length === 0 && nonBillableUsers.length === 0) {
      newErrors.testers = 'At least one Billable or Non-Billable tester is required';
    }

    if (!formData.billing_type) {
      newErrors.billing_type = 'Billing Type is required';
    }

    // If there are validation errors, do not proceed with form submission
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    // Prepare the updated project details
    const updatedProject = {
      project_name: formData.projectName,
      rag: formData.rag,
      tester_count: billableUsers.length + nonBillableUsers.length,
      billable: billableUsers.map((user) => user.tester_name),
      nonbillable: nonBillableUsers.map((user) => user.tester_name),
      billing_type: formData.billing_type,
      automation: automation ? automationText : null,
      ai_used: aiUsed ? aiText : null,
    };

    console.log(updatedProject); // Log the updated project details for debugging

    // Send the updated project data to the backend
    try {
      const response = await fetch(`https://frt4cnbr-5000.inc1.devtunnels.ms//update-project-details/${selectedProject.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProject),
      });
      if (response.ok) {
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === selectedProject.id ? { ...project, ...updatedProject } : project
          )
        );
        setShowModal(false);
        setSelectedProject(null);
      } else {
        console.error('Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  // Handle editing a project
  const handleEdit = (project) => {
    setSelectedProject(project);
    setShowModal(true);
    fetchBillableAndNonBillable(project.billable, project.nonbillable);

    setAutomation(project.automation ? true : false);
    setAiUsed(project.ai_used ? true : false);
    setAutomationText(project.automation || '');
    setAiText(project.ai_used || '');

    // Prepopulate the rag details field in the form
    setFormData({
      ...formData,
      projectName: project.project_name,
      rag: project.rag,
      rag_details: project.rag_details || '', // Set the rag_details from the selected project
      billing_type: project.billing_type || '',
    });
    console.log("Tester from the backend : ",)
  };

  // Handle deleting a project
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this project?');
    if (confirmDelete) {
      try {
        const response = await fetch(`https://frt4cnbr-5000.inc1.devtunnels.ms//delete-project/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`,
          },
        });
        if (response.ok) {
          setProjects(projects.filter((project) => project.id !== id));
        } else {
          console.error('Failed to delete project');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  // Handle closing the modal without saving changes
  const handleCancel = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  const handleAddTesterModal = async (type) => {
    setTesterType(type);
    setShowAddTesterModal(true);
  
    try {
      const response = await fetch('https://frt4cnbr-5000.inc1.devtunnels.ms//tester-billable', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        const allAvailableTesters = data.testers || [];
  
        // Merge both billable and non-billable testers' names into an array
        const assignedTesters = [
          ...billableUsers.map(user => user.tester_name),
          ...nonBillableUsers.map(user => user.tester_name)
        ];
  
        // Filter out testers that are already assigned to the project
        const availableTesters = allAvailableTesters.filter(tester => 
          !assignedTesters.includes(tester.tester_name)
        );
        
        setAvailableUsers(availableTesters);
  
        console.log("Testers available (after filtering): ", availableTesters);
      } else {
        console.error('Failed to fetch available testers');
      }
    } catch (error) {
      console.error('Error fetching available testers:', error);
    }
  };
  
  const handleRemoveTester = (testerId, type) => {
    if (type === 'billable') {
      setBillableUsers(billableUsers.filter(user => user.id !== testerId));
    } else {
      setNonBillableUsers(nonBillableUsers.filter(user => user.id !== testerId));
    }
  };


  const handleAddTester = () => {
    if (testerName.trim()) {
      const newTester = { id: Date.now(), tester_name: testerName };
  
      // Check if the tester name already exists in billable or non-billable users before adding
      const isTesterAlreadyAdded = [
        ...billableUsers.map(user => user.tester_name),
        ...nonBillableUsers.map(user => user.tester_name)
      ].includes(newTester.tester_name);
  
      if (!isTesterAlreadyAdded) {
        if (testerType === 'billable') {
          setBillableUsers([...billableUsers, newTester]);
        } else {
          setNonBillableUsers([...nonBillableUsers, newTester]);
        }
  
        setTesterName(''); // Clear the tester name field
        setShowAddTesterModal(false); // Close the Add Tester modal
      } else {
        console.warn("Tester already added to the project");
      }
    }
  };
  
  // Function to determine background color for rag
  const getRAGColor = (rag) => {
    switch (rag) {
      case 'Red':
        return 'red';
      case 'Amber':
        return 'orange';
      case 'Green':
        return 'green';
      default:
        return 'transparent';
    }
  };

  const handleGenerateReport = async (projectId) => {
    if (!selectedMonth) {
      alert('Please select a month before generating the report');
      return;
    }
  
    const url = `https://frt4cnbr-5000.inc1.devtunnels.ms/generate_pdf/${projectId}`; // API endpoint with project ID
    console.log("Requesting report generation for project:", projectId, "and month:", selectedMonth);
  
    try {
      const response = await fetch(url, {
        method: 'POST',  // Use POST instead of GET
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ month: selectedMonth }), // Send the selected month in the body as JSON
      });
  
      console.log("Month response from backend : ", response);
  
      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const blob = await response.blob(); 
  
      // Create a URL for the PDF blob and open it in a new window/tab
      const urlBlob = window.URL.createObjectURL(blob);
      window.open(urlBlob, '_blank'); // Opens the PDF in a new tab
  
      // Force the download by using the download attribute
      // link.setAttribute('download', `report_${projectId}_${selectedMonth}.pdf`);
  
      // // Trigger the download
      // link.click();
  
      // // Clean up the object URL after the download is triggered
      // window.URL.revokeObjectURL(urlBlob);
  
      alert('Report generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating report. Please try again.');
    }
  };
  
  
  

  return (
    <>
      <Card className="mb-4">
        <Card.Body>
          <h2>admin Dashboard</h2> {/* Title for the page */}
        </Card.Body>
      </Card>
      <Card className="mt-3">
        <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff', borderRadius: '10px 10px 0 0' }}>
          Project Details
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover style={{ borderRadius: '15px', overflow: 'hidden' }}>
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>rag - Delivery</th>
                  <th>Tester Count</th>
                  <th>Billable</th>
                  <th>Nonbillable</th>
                  <th>Billing Type</th>
                  <th>Automation</th>
                  <th>AI</th>
                  <th>Actions</th>
                  <th>Download full report</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} style={{ backgroundColor: getRAGColor(project.rag) }}>
                    <td>{project.project_name}</td>
                    <td>{project.rag}</td>
                    <td>{project.tester_count}</td>
                    <td>{project.billable.length}</td>
                    <td>{project.nonbillable.length}</td>
                    <td>{project.billing_type}</td>
                    <td>{project.automation ? project.automation : "No Details" }</td>
                    <td>{project.ai_used ? project.ai_used : "No Details"}</td>
                    <td>
                      <Button variant="primary" size="sm" onClick={() => handleEdit(project)}>
                        <FaEdit />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(project.id)}>
                        <FaTrash />
                      </Button>
                    </td>
                    <td>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => {
                        setSelectedProject(project); // Set the selected project before showing the modal
                        setShowDownloadModal(true); // Open the modal to select the month
                      }}
                    >
                      Download
                    </Button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Project</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="projectName">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                isInvalid={formErrors.projectName}
                readOnly
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.projectName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="rag">
              <Form.Label>rag - Delivery</Form.Label>
              <Form.Control
                as="select"
                value={formData.rag}
                onChange={(e) => setFormData({ ...formData, rag: e.target.value })}
                isInvalid={formErrors.rag}
              >
                <option value="">Select</option>
                <option value="Red">Red</option>
                <option value="Amber">Amber</option>
                <option value="Green">Green</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {formErrors.rag}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="tester_count">
                <Form.Label>Tester Count</Form.Label>
                <Form.Control type="number" value={billableUsers.length + nonBillableUsers.length} readOnly />
              </Form.Group>

<Form.Group controlId="billable">
  <Form.Label>Billable</Form.Label>
  <div>
    {billableUsers.map((user) => (
      <span key={user.id}>
        {user.tester_name}{' '}
        <FaTimes
          style={{ cursor: 'pointer', color: 'red' }}
          onClick={() => handleRemoveTester(user.id, 'billable')}
        />{' '}
      </span>
    ))}
  </div>

  <Button variant="success" onClick={() => handleAddTesterModal('billable')} style={{ marginTop: '10px' }}>
    Add Tester
  </Button>
</Form.Group>


<Form.Group controlId="nonbillable">
  <Form.Label>Non-Billable</Form.Label>
  <div>
    {nonBillableUsers.map((user) => (
      <span key={user.id}>
        {user.tester_name}{' '}
        <FaTimes
          style={{ cursor: 'pointer', color: 'red' }}
          onClick={() => handleRemoveTester(user.id, 'nonbillable')}
        />{' '}
      </span>
    ))}
  </div>
  <Button variant="success" onClick={() => handleAddTesterModal('nonbillable')} style={{ marginTop: '10px' }}>
    Add Tester
  </Button>
</Form.Group>
<Form.Group controlId="billing_type">
                <Form.Label>Billing Type</Form.Label>
                <Form.Control
                as="select"
                value={formData.billing_type}
                onChange={(e) => setFormData({ ...formData, billing_type: e.target.value })}
                isInvalid={formErrors.billing_type}
              >
                  <option value="Time & Materials">T&M</option>
                  <option value="Fixed Price">FIXED</option>
                  </Form.Control>
             </Form.Group>

            <Form.Group controlId="ragDetails">
              <Form.Label>rag Details</Form.Label>
              <Form.Control
                as="textarea"
                value={formData.rag_details}
                onChange={(e) => setFormData({ ...formData, rag_details: e.target.value })}
              />
            </Form.Group>

<Form.Group controlId="Automation">
  <Form.Label>Automation Used</Form.Label>
  <div>
    <Form.Check
      type="radio"
      label="Yes"
      value="Yes"
      checked={automation === true} // Ensure the correct radio button is selected
      onChange={() => {
        setAutomation(true);
        setAutomationText("");  // Reset text area if changing to "Yes"
      }}
    />
    <Form.Check
      type="radio"
      label="No"
      value="No"
      checked={automation === false} // Ensure the correct radio button is selected
      onChange={() => setAutomation(false)}
    />
  </div>
  {automation === true && (  // Display input box when "Yes" is selected
    <div>
      <Form.Group controlId="automationDetails" style={{ marginTop: '10px' }}>
        <Form.Label>Automation Tool</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={automationText}
          onChange={(e) => setAutomationText(e.target.value)}  // Handle text change
          placeholder="Details about the selected automation tool"
        />
      </Form.Group>
    </div>
  )}
</Form.Group>

{/* AI Used Field */}
<Form.Group controlId="AI">
  <Form.Label>AI Used</Form.Label>
  <div>
    <Form.Check
      type="radio"
      label="Yes"
      value="Yes"
      checked={aiUsed === true}  // Ensure the correct radio button is selected
      onChange={() => {
        setAiUsed(true);
        setAiText("");  // Reset text area if changing to "Yes"
      }}
    />
    <Form.Check
      type="radio"
      label="No"
      value="No"
      checked={aiUsed === false}  // Ensure the correct radio button is selected
      onChange={() => setAiUsed(false)}
    />
  </div>
  {aiUsed === true && (  // Display input box when "Yes" is selected
    <div>
      <Form.Group controlId="aiUsedDetails" style={{ marginTop: '10px' }}>
        <Form.Label>AI Tool</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={aiText}
          onChange={(e) => setAiText(e.target.value)}  // Handle text change
          placeholder="Details about the selected AI tool"
        />
      </Form.Group>
    </div>
  )}
</Form.Group>



            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDownloadModal} onHide={() => setShowDownloadModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Generate Report</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="monthSelect">
        <Form.Label>Select Month</Form.Label>
        <Form.Control
          as="select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">Select Month</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </Form.Control>
      </Form.Group>

      <Button
        variant="primary"
        onClick={() => handleGenerateReport(selectedProject.project_name_id )} // Pass selected project ID and month
      >
        Generate Report
      </Button>
    </Form>
  </Modal.Body>
</Modal>




      {/* Add Tester Modal */}
<Modal show={showAddTesterModal} onHide={() => setShowAddTesterModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Add Tester</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="testerName">
        <Form.Label>Tester Name</Form.Label>
        <Form.Control
          as="select"
          value={testerName}
          onChange={(e) => setTesterName(e.target.value)}
        >
          <option value="">Select Tester</option>
          {availableUsers.map((tester) => (
            <option key={tester.id} value={tester.tester_name}>
              {tester.tester_name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Button variant="primary" onClick={handleAddTester}>
        Add
      </Button>
      <Button variant="secondary" onClick={() => setShowAddTesterModal(false)}>
        Cancel
      </Button>
    </Form>
  </Modal.Body>
</Modal>

    </>
  );
};

export default AdminProjectTable;
