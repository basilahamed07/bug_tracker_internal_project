// import React, { useState, useEffect } from 'react';
// import { Card, Form, Button, Modal, Dropdown, Spinner } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import addproject from "../panel/assets/addproject.svg";
// import "./AddProject.css"

// const AdminAddProjectWithDetails = ({ projectNameProp }) => {
//   const [projectName, setProjectName] = useState(projectNameProp);
//   const [confirmProjectName, setConfirmProjectName] = useState('');
//   const [isPending, setIsPending] = useState(false);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [showCreateDetails, setShowCreateDetails] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [showPopup, setShowPopup] = useState(false); // State for the confirmation popup
//   const [errorMessage, setErrorMessage] = useState("");
//   const [showErrorPopup, setShowErrorPopup] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);



//   const navigate = useNavigate(); // Initialize useNavigate hook
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
//     agile_type: ''
//   });

//   const [errors, setErrors] = useState({
//     projectName: '',
//     rag: '',
//     rag_details: '',
//     billing_type: '',
//     tester_count: '',
//     billable: '',
//     nonbillable: '',
//     automation_details: '',
//     ai_used_details: '',
//     agile_type: ''
//   });

//   const [testers, setTesters] = useState([]);
//   const [loadingTesters, setLoadingTesters] = useState(false);
//   const [showCreateTesterModal, setShowCreateTesterModal] = useState(false);
//   const [selectedTesterType, setSelectedTesterType] = useState('');
//   const [selectedTesters, setSelectedTesters] = useState({
//     billable: [],
//     nonbillable: [],
//   });

//   const handleIconClick = () => setShowForm(true);

//   useEffect(() => {
//     // Check if the project is already created (from sessionStorage)
//     const isProjectCreatedFlag = sessionStorage.getItem('isProjectCreated');
//     if (isProjectCreatedFlag === 'true') {
//       setShowCreateDetails(true); // Navigate to the "Add Project Details" form
//     } else {
//       setShowCreateDetails(false); // Stay on the "Add Project" form
//     }

//     // Load the saved form data from sessionStorage (if any)
//     const savedFormData = sessionStorage.getItem('formData');
//     if (savedFormData) {
//       setFormData(JSON.parse(savedFormData)); // Set the form data to saved state
//     }
//     // If showCreateDetails is true, set the flag in sessionStorage
//     if (showCreateDetails) {
//       sessionStorage.setItem('isProjectCreated', 'true');
//     }
//   }, [showCreateDetails]); // Run only on initial render (mount) or page refresh


//   // Step 1: Load the form data from sessionStorage when the component mounts
//   useEffect(() => {
//     const savedFormData = sessionStorage.getItem('formData');
//     if (savedFormData) {
//       setFormData(JSON.parse(savedFormData));
//     }
//   }, []); // Empty array to run this effect only on mount

//   // Step 2: Save form data to sessionStorage whenever formData changes
//   useEffect(() => {
//     if (formData) {
//       sessionStorage.setItem('formData', JSON.stringify(formData));
//     }
//   }, [formData]); // This effect runs every time formData changes



//   const fetchTesters = async () => {
//     setLoadingTesters(true);
//     try {
//       const accessToken = sessionStorage.getItem('access_token');
//       if (!accessToken) {
//         setError('No access token found. Please login.');
//         return;
//       }

//       const response = await fetch('http://localhost:5000/tester-billable', {
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

//       const requestBody = {
//         project_name: projectName,
//       };

//       const response = await fetch('http://localhost:5000/create-project', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(requestBody),
//       });

//       if (!response.ok) throw new Error('Project creation failed');

//       const projectDataResponse = await response.json();
//       // setSuccessMessage('Project created successfully!');

//       // Save the state in sessionStorage to indicate the project is created
//       // sessionStorage.setItem('isProjectCreated', 'true');
//       // setShowCreateDetails(true);


//     } catch (error) {
//       setError('Error creating project: ' + error.message);
//     } finally {
//       setIsPending(false);
//       setShowPopup(false); // Close the popup after submitting
//     }
//   };


//   // Handle Submit (Trigger Popup)
//   const handleSubmitClick = (e) => {
//     e.preventDefault(); // Prevent form submission immediately
//     setShowPopup(true); // Show the confirmation popup
//   };


//   // const handlePopupCancel = () => {
//   //   setShowPopup(false); // Close the popup without submitting
//   // };

//     // Trigger validation for all fields on submit
//     const validateAllFields = () => {
//       let allErrors = {};
  
//       // Loop through each section and each field
//       Object.keys(formData).forEach((section) => {
//         Object.keys(formData[section]).forEach((field) => {
//           const value = formData[section][field];
//           let error = '';
//           if (value === '' || value === null || value === undefined) {
//             error = `${field.replace(/([A-Z])/g, ' $1')} is required.`;
//           } else if (isNaN(value)) {
//             error = `${field.replace(/([A-Z])/g, ' $1')} must be a valid number.`;
//           }
//           allErrors[`${section}-${field}`] = error;
//         });
//       });
  
//       return allErrors; 
//     };
    

//     const handleBlur = (e) => {
//       const { name, value } = e.target;
//       let errorMessages = { ...errors };
  
//       // Validate the fields onBlur
//       switch (name) {
//         case 'projectName':
//           errorMessages.projectName = value ? '' : 'Project Name is required';
//           break;
//         case 'rag':
//           errorMessages.rag = value ? '' : 'rag selection is required';
//           break;
//         case 'rag_details':
//           errorMessages.rag_details = value ? '' : 'rag Details are required';
//           break;
//         case 'billable':
//             errorMessages.billable = value ? '' : 'Billable tester Details are required';
//             break;
//         case 'nonbillable':
//             errorMessages.nonbillable = value ? '' : 'Non billable Details are required';
//             break;
//         case 'billing_type':
//           errorMessages.billing_type = value ? '' : 'Billing Type is required';
//           break;
//           case 'agile_type':
//           errorMessages.agile_type = value ? '' : 'Agile Type is required';
//           break;
//         case 'automation_details':
//           errorMessages.automation_details = formData.automation === 'Yes' && !value ? 'Automation Details are required' : '';
//           break;
//         case 'ai_used_details':
//           errorMessages.ai_used_details = formData.ai_used === 'Yes' && !value ? 'AI Used Details are required' : '';
//           break;
//         default:
//           break;
//       }
  
//       setErrors(errorMessages);
//     };

//   const handleProjectDetailsSubmit = async (e) => {
//     e.preventDefault();
  
//     // Check for validation errors before submitting the form
//     let errorMessages = {};
//     let isValid = true;
  
//     // Validate each field
//     if (!formData.projectName) {
//       errorMessages.projectName = 'Project Name is required';
//       isValid = false;
//     }
//     if (!formData.rag) {
//       errorMessages.rag = 'rag selection is required';
//       isValid = false;
//     }
//     if (!formData.rag_details) {
//       errorMessages.rag_details = 'rag Details are required';
//       isValid = false;
//     }
//     if (!formData.billing_type) {
//       errorMessages.billing_type = 'Billing Type is required';
//       isValid = false;
//     }
//     if (!formData.agile_type) {
//       errorMessages.agile_type = 'Agile Type is required';
//       isValid = false;
//     }
//      if (!formData.automation) {
//       errorMessages.automation = 'Please select a value for Automation (Yes/No)';
//       isValid = false;
//     } else if (formData.automation === 'Yes' && !formData.automation_details) {
//       errorMessages.automation_details = 'Automation Details are required';
//       isValid = false;
//     }
  
//     if (!formData.ai_used) {
//       errorMessages.ai_used = 'Please select a value for AI Used (Yes/No)';
//       isValid = false;
//     } else if (formData.ai_used === 'Yes' && !formData.ai_used_details) {
//       errorMessages.ai_used_details = 'AI Used Details are required';
//       isValid = false;
//     }
  
  
//     // Check if validation passed
//     if (isValid) {
//       // Proceed with form submission if valid
//       setShowPopup(true);  // Show confirmation popup
//       setSuccessMessage('Project details submitted successfully!');
  
//       try {
//         const accessToken = sessionStorage.getItem('access_token');
//         if (!accessToken) throw new Error('User is not authenticated');
  
//         setIsPending(true);
  
//         // Step 1: Create the project
//         const requestBody = {
//           project_name: formData.projectName,
//         };
  
//         const response = await fetch('http://localhost:5000/create-project', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${accessToken}`,
//           },
//           body: JSON.stringify(requestBody),
//         });
  
//         if (!response.ok) throw new Error('Project creation failed');
  
//         const projectDataResponse = await response.json();
//         sessionStorage.setItem('isProjectCreated', 'true');
//         setShowCreateDetails(true);
  
//         // Step 2: Create Testers
//         const testersToSubmit = [
//           ...selectedTesters.billable.map((tester) => ({
//             tester_name: tester.tester_name,
//             project_name: formData.projectName,
//             billable: true,
//           })),
//           ...selectedTesters.nonbillable.map((tester) => ({
//             tester_name: tester.tester_name,
//             project_name: formData.projectName,
//             billable: false,
//           })),
//         ];
  
//         const createTestersResponse = await fetch('http://localhost:5000/tester-billable', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${accessToken}`,
//           },
//           body: JSON.stringify({ testers: testersToSubmit }),
//         });
  
//         if (!createTestersResponse.ok) {
//           throw new Error('Testers creation failed');
//         }
  
//         // Step 3: Submit project details
//         const projectDetailsPayload = {
//           project_name: formData.projectName,
//           rag: formData.rag,
//           tester_count: formData.tester_count,
//           testers: testersToSubmit,
//           billing_type: formData.billing_type,
//           rag_details: formData.rag_details,
//           agile_type: formData.agile_type === 'Agile' ? true : false, 
//           automation_details: formData.automation === 'Yes' ? formData.automation_details : '',
//           ai_used_details: formData.ai_used === 'Yes' ? formData.ai_used_details : '',
//         };
  
//         const response2 = await fetch('http://localhost:5000/create-project-details', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${accessToken}`,
//           },
//           body: JSON.stringify(projectDetailsPayload),
//         });
  
//         if (!response2.ok) throw new Error('Project details creation failed');
  
//         // Clear session data after completing the form
//         sessionStorage.removeItem('isProjectCreated');
//         sessionStorage.removeItem('formData');
  
//       } catch (error) {
//         setError('Error creating project details: ' + error.message);
//         setShowErrorPopup(true); // Show error message in the popup
//       } finally {
//         setIsPending(false);
//         setShowCreateDetails(false); // Hide the form
//         setShowPopup(false); // Hide the confirmation popup
  
//         // Navigate to the project info page after successful submission
//         navigate('/AdminPanel/project-info');
//       }
//     } else {
//       // If validation fails, show the error popup
//       setShowErrorPopup(true);
//       setErrorMessage('Please fill out all required fields.');
//     }
  
//     // Set error messages for each field
//     setErrors(errorMessages);
//   };


//       const handlePopupCancel = () => {
//         setShowPopup(false);
//       };



//   const getAvailableTesters = (type) => {
//     return testers.filter(tester =>
//       !selectedTesters.billable.some(selectedTester => selectedTester.tester_name === tester.tester_name) &&
//       !selectedTesters.nonbillable.some(selectedTester => selectedTester.tester_name === tester.tester_name)
//     );
//   };



  

//   return (
//     <div className="container mt-5">

//       {/* Create Project Details Form */}
      
//         <Card className="mt-4 shadow-lg">
//           <Card.Header as="h4" style={{ backgroundColor: '#000d6b', color: '#ffffff', borderRadius: '10px 10px 0 0', padding: '15px' }}>
//             Add Project Details
//           </Card.Header>
//           <Card.Body>
//             <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
//               {/* Apply Grid Layout for Left and Right Sections */}
//               <Form onSubmit={handleProjectDetailsSubmit}>
//                 <div className="row">
//                   {/* Left Section */}
//                   <div className="col-md-6">
//                     <Form.Group controlId="projectName">
//                       <Form.Label style={{ fontWeight: 'bold' }}>Project Name</Form.Label>
//                       <Form.Control
//                         type="text"
//                         value={formData.projectName}
//                         onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
//                         onBlur={handleBlur}
//                         // required
//                         style={{ borderRadius: '5px', border: '1px solid #ced4da', padding: '10px' }}
//                       />
//                       {errors.projectName && <div style={{ color: 'red' }}>{errors.projectName}</div>}
//                     </Form.Group>
  
//                     <Form.Group controlId="rag">
//                       <Form.Label style={{ fontWeight: 'bold' }}>rag</Form.Label>
//                       <Form.Select
//                         value={formData.rag}
//                         onChange={(e) => setFormData({ ...formData, rag: e.target.value })}
//                         onBlur={handleBlur}
//                         // required
//                         style={{ borderRadius: '5px', padding: '10px' }}
//                       >
//                         <option value="">Select rag</option>
//                         <option value="Red">Red</option>
//                         <option value="Amber">Amber</option>
//                         <option value="Green">Green</option>
//                       </Form.Select>
//                       {errors.rag && <div style={{ color: 'red' }}>{errors.rag}</div>}
//                     </Form.Group>
  
//                     <Form.Group controlId="rag_details">
//                       <Form.Label style={{ fontWeight: 'bold' }}>rag Details</Form.Label>
//                       <Form.Control
//                         type="text"
//                         value={formData.rag_details}
//                         onChange={(e) => setFormData({ ...formData, rag_details: e.target.value })}
//                         onBlur={handleBlur}
//                         // required
//                         style={{ borderRadius: '5px', border: '1px solid #ced4da', padding: '10px' }}
//                       />
//                       {errors.rag_details && <div style={{ color: 'red' }}>{errors.rag_details}</div>}
//                     </Form.Group>
  
//                     <Form.Group controlId="billing_type">
//                       <Form.Label>Billing Type</Form.Label>
//                       <Form.Control
//                         as="select"
//                         value={formData.billing_type}
//                         onChange={(e) => setFormData({ ...formData, billing_type: e.target.value })}
//                         onBlur={handleBlur}
//                         // required

//                       >
//                         <option value="">Select Billing Type</option>
//                         <option value="T&M">T&M</option>
//                         <option value="FIXED">FIXED</option>
//                       </Form.Control>
//                       {errors.billing_type && <div style={{ color: 'red' }}>{errors.billing_type}</div>}
//                     </Form.Group>
  
//                     <Form.Group controlId="tester_count">
//                       <Form.Label style={{ fontWeight: 'bold' }}>Tester Count</Form.Label>
//                       <Form.Control
//                         type="number"
//                         value={formData.tester_count}
//                         readOnly
//                         style={{ borderRadius: '5px', padding: '10px', backgroundColor: '#f8f9fa' }}
//                       />
//                       {errors.tester_count && <div style={{ color: 'red' }}>{errors.tester_count}</div>}
//                     </Form.Group>
//                   </div>
  
//                   {/* Right Section */}
//                   <div className="col-md-6">
//                     {/* Billable Testers Dropdown */}
//                     <Form.Group controlId="billable">
//                       <Form.Label style={{ fontWeight: 'bold' }}>Billable Testers</Form.Label>
//                       <Dropdown>
//                         <Dropdown.Toggle variant="primary" id="dropdown-basic" style={{
//                           width: '100%',
//                           padding: '8px',
//                           textAlign: 'left',
//                           backgroundColor: '#000d6b',  // Apply the color to the dropdown button
//                           borderColor: '#000d6b',  // Matching border color
//                           color: '#ffffff',  // Ensure text is white for contrast
//                           borderRadius: '5px'
//                         }}>
//                           {selectedTesters.billable.length > 0
//                             ? selectedTesters.billable.map((t) => t.tester_name).join(', ')
//                             : 'Select Billable Testers'}
//                         </Dropdown.Toggle>
//                         <Dropdown.Menu>
//                           {loadingTesters ? (
//                             <Dropdown.ItemText>
//                               <Spinner animation="border" size="sm" />
//                               Loading...
//                             </Dropdown.ItemText>
//                           ) : (
//                             getAvailableTesters('billable').map((tester) => (
//                               <Dropdown.Item
//                                 key={tester.id}
//                                 onClick={() => handleTesterSelection(tester, 'billable')}
//                               >
//                                 {tester.tester_name}
//                               </Dropdown.Item>
//                             ))
//                           )}
//                           <Dropdown.Item
//                             onClick={() => {
//                               setSelectedTesterType('billable');
//                               setShowCreateTesterModal(true);
//                             }}
//                           >
//                             Add New Tester
//                           </Dropdown.Item>
//                         </Dropdown.Menu>
//                       </Dropdown>
//                     </Form.Group>
  
//                     {/* Non-Billable Testers Dropdown */}
//                     <Form.Group controlId="nonbillable">
//                       <Form.Label style={{ fontWeight: 'bold' }}>Non-Billable Testers</Form.Label>
//                       <Dropdown>
//                         <Dropdown.Toggle variant="secondary" id="dropdown-basic" style={{ width: '100%', padding: '10px', textAlign: 'left', backgroundColor: "000d6b" }}>
//                           {selectedTesters.nonbillable.length > 0
//                             ? selectedTesters.nonbillable.map((t) => t.tester_name).join(', ')
//                             : 'Select Non-Billable Testers'}
//                         </Dropdown.Toggle>
//                         <Dropdown.Menu>
//                           {loadingTesters ? (
//                             <Dropdown.ItemText>
//                               <Spinner animation="border" size="sm" />
//                               Loading...
//                             </Dropdown.ItemText>
//                           ) : (
//                             getAvailableTesters('nonbillable').map((tester) => (
//                               <Dropdown.Item
//                                 key={tester.id}
//                                 onClick={() => handleTesterSelection(tester, 'nonbillable')}
//                               >
//                                 {tester.tester_name}
//                               </Dropdown.Item>
//                             ))
//                           )}
//                           <Dropdown.Item
//                             onClick={() => {
//                               setSelectedTesterType('nonbillable');
//                               setShowCreateTesterModal(true);
//                             }}
//                           >
//                             Add New Tester
//                           </Dropdown.Item>
//                         </Dropdown.Menu>
//                       </Dropdown>
//                     </Form.Group>
  
//                     <br />
  
//                     {/* Automation Used */}
//                     <Form.Group controlId="Automation">
//                       <Form.Label>Automation Used <span style={{ color: 'red' }}>*</span></Form.Label>
//                       <div>
//                         <Form.Check
//                           type="radio"
//                           label="Yes"
//                           value="Yes"
//                           checked={formData.automation === 'Yes'}
//                           onChange={(e) => setFormData({ ...formData, automation: e.target.value })}
//                         />
//                         <Form.Check
//                           type="radio"
//                           label="No"
//                           value="No"
//                           checked={formData.automation === 'No'}
//                           onChange={(e) => setFormData({ ...formData, automation: e.target.value })}
//                         />
//                       </div>
//                       {formData.automation === 'Yes' && (
//                         <div>
//                           <Button
//                             variant="secondary"
//                             onClick={() => setFormData({ ...formData, automation_details: "Selenium" })}
//                             style={{ marginRight: '10px' }}
//                           >
//                             Selenium
//                           </Button>
//                           <Button
//                             variant="secondary"
//                             onClick={() => setFormData({ ...formData, automation_details: "Pytest" })}
//                           >
//                             Pytest
//                           </Button>
//                           <Form.Group controlId="automationDetails" style={{ marginTop: '10px' }}>
//                             <Form.Label>Automation Tool</Form.Label>
//                             <Form.Control
//                               as="textarea"
//                               rows={3}
//                               value={formData.automation_details}
//                               onChange={(e) => setFormData({ ...formData, automation_details: e.target.value })}
//                               placeholder="Details about the selected automation tool"
//                               onBlur={handleBlur}
//                             />
//                             {errors.automation_details && <div style={{ color: 'red' }}>{errors.automation_details}</div>}
//                           </Form.Group>
//                         </div>
//                       )}
//                     </Form.Group>
//                     <br />

//                     <Form.Group controlId="agile_type">
//               <Form.Label>Project Type</Form.Label>
//               <Form.Control
//                 as="select"
//                 value={formData.agile_type}
//                 onChange={(e) => setFormData({ ...formData, agile_type: e.target.value })}
//                 required
//               >
//                 <option value="">Select Project Type</option>
//                 <option value="Agile">Agile</option>
//                 <option value="Non-Agile">Non-Agile</option>
//               </Form.Control>
//             </Form.Group>
  
                    
//                     <Form.Group controlId="AI">
//                       <Form.Label>AI Used  <span style={{ color: 'red' }}> *</span></Form.Label>
//                       <div>
//                         <Form.Check
//                           type="radio"
//                           label="Yes"
//                           value="Yes"
//                           checked={formData.ai_used === 'Yes'}
//                           onChange={(e) => setFormData({ ...formData, ai_used: e.target.value })}
//                         />
//                         <Form.Check
//                           type="radio"
//                           label="No"
//                           value="No"
//                           checked={formData.ai_used === 'No'}
//                           onChange={(e) => setFormData({ ...formData, ai_used: e.target.value })}
//                         />
//                       </div>
//                       {formData.ai_used === 'Yes' && (
//                         <div>
//                           <Button
//                             variant="secondary"
//                             onClick={() => setFormData({ ...formData, ai_used_details: "TensorFlow" })}
//                             style={{ marginRight: '10px' }}
//                           >
//                             TensorFlow
//                           </Button>
//                           <Button
//                             variant="secondary"
//                             onClick={() => setFormData({ ...formData, ai_used_details: "PyTorch" })}
//                           >
//                             PyTorch
//                           </Button>
//                           <Form.Group controlId="aiUsedDetails" style={{ marginTop: '10px' }}>
//                             <Form.Label>AI Tool</Form.Label>
//                             <Form.Control
//                               as="textarea"
//                               rows={3}
//                               value={formData.ai_used_details}
//                               onChange={(e) => setFormData({ ...formData, ai_used_details: e.target.value })}
//                               placeholder="Details about the selected AI tool"
//                               onBlur={handleBlur}
//                             />
//                             {errors.ai_used_details && <div style={{ color: 'red' }}>{errors.ai_used_details}</div>}
//                           </Form.Group>
//                         </div>
//                       )}
//                     </Form.Group>
//                   </div>
//                 </div>
  
//                 <br />
  
//                 {/* Submit Button */}
//                 <Button
//                   variant="primary"
//                   type="submit"
//                   style={{
//                     fontWeight: 'bold',
//                     color: '#ffffff',
//                     backgroundColor: '#000d6b',
//                     borderColor: '#0056b3',
//                     width: '100%',
//                     padding: '10px',
//                     borderRadius: '5px',
//                     boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
//                   }}
//                   onMouseOver={(e) => e.target.style.backgroundColor = '#004085'}
//                   onMouseOut={(e) => e.target.style.backgroundColor = '#0056b3'}
//                 >
//                   Submit
//                 </Button>
//               </Form>
//             </div>
//           </Card.Body>
//         </Card>
     
  
//       {/* Confirmation Popup */}
//       {showPopup && (
//         <div className="popup-overlay">
//           <div className="popup">
//             <h3>Confirm Project Details</h3>
//             <p>Are you sure you want to proceed with the project "{projectName}"?</p>
//             <button onClick={handleProjectDetailsSubmit} >Yes, Proceed</button>
//             <button onClick={handlePopupCancel}>Cancel</button>
  
//             {/* Display Success Message in the Popup */}
//             {successMessage && <div style={{ color: 'green', marginTop: '10px' }}>{successMessage}</div>}
//           </div>
//         </div>
//       )}

//             {/* Error Popup */}
//             {showErrorPopup && (
//         <div className="popup-overlay">
//           <div className="popup">
//             <h3>{errorMessage.includes("Successfully") ? "Success" : "Error"}</h3>
//             <p style={{ color: errorMessage.includes("Successfully") ? 'green' : 'red' }}>{errorMessage}</p>
//             <Button variant="outline-dark" onClick={() => setShowErrorPopup(false)} style={{ marginTop: '5px' }}>
//               Close
//             </Button>
//           </div>
//         </div>
//       )}
  
//       {/* Modal for creating tester */}
//       <Modal show={showCreateTesterModal} onHide={() => setShowCreateTesterModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Create New Tester</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleCreateTester(e.target.testerName.value, selectedTesterType);
//             }}
//           >
//             <Form.Group controlId="testerName">
//               <Form.Label>Tester Name:</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="testerName"
//                 // required
//               />
//             </Form.Group>
//             <Button variant="primary" type="submit">Create Tester</Button>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default AdminAddProjectWithDetails;





import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Modal, Dropdown, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import addproject from "../panel/assets/addproject.svg";
import "./AddProject.css"

const AdminAddProjectWithDetails = ({ projectNameProp }) => {
  const [projectName, setProjectName] = useState(projectNameProp);
  const [confirmProjectName, setConfirmProjectName] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showCreateDetails, setShowCreateDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // State for the confirmation popup
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');



  const navigate = useNavigate(); // Initialize useNavigate hook
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
    agile_type: ''
  });

  const [errors, setErrors] = useState({
    projectName: '',
    rag: '',
    rag_details: '',
    billing_type: '',
    tester_count: '',
    billable: '',
    nonbillable: '',
    automation_details: '',
    ai_used_details: '',
    agile_type: ''
  });

  const [testers, setTesters] = useState([]);
  const [loadingTesters, setLoadingTesters] = useState(false);
  const [showCreateTesterModal, setShowCreateTesterModal] = useState(false);
  const [selectedTesterType, setSelectedTesterType] = useState('');
  const [selectedTesters, setSelectedTesters] = useState({
    billable: [],
    nonbillable: [],
  });

  const handleIconClick = () => setShowForm(true);

  useEffect(() => {
    // Check if the project is already created (from sessionStorage)
    const isProjectCreatedFlag = sessionStorage.getItem('isProjectCreated');
    if (isProjectCreatedFlag === 'true') {
      setShowCreateDetails(true); // Navigate to the "Add Project Details" form
    } else {
      setShowCreateDetails(false); // Stay on the "Add Project" form
    }

    // Load the saved form data from sessionStorage (if any)
    const savedFormData = sessionStorage.getItem('formData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData)); // Set the form data to saved state
    }
    // If showCreateDetails is true, set the flag in sessionStorage
    if (showCreateDetails) {
      sessionStorage.setItem('isProjectCreated', 'true');
    }
  }, [showCreateDetails]); // Run only on initial render (mount) or page refresh


  // Step 1: Load the form data from sessionStorage when the component mounts
  useEffect(() => {
    const savedFormData = sessionStorage.getItem('formData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []); // Empty array to run this effect only on mount

  // Step 2: Save form data to sessionStorage whenever formData changes
  useEffect(() => {
    if (formData) {
      sessionStorage.setItem('formData', JSON.stringify(formData));
    }
  }, [formData]); // This effect runs every time formData changes



  const fetchTesters = async () => {
    setLoadingTesters(true);
    try {
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) {
        setError('No access token found. Please login.');
        return;
      }

      const response = await fetch('http://localhost:5000/tester-billable', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setTesters(data.testers || []);
    } catch (error) {
      console.error('Error fetching testers:', error);
      setError('Error fetching testers: ' + error.message);
    } finally {
      setLoadingTesters(false);
    }
  };

  useEffect(() => {
    fetchTesters();
  }, []);

  const handleTesterSelection = (tester, type) => {
    const updatedList = selectedTesters[type].find(item => item.tester_name === tester.tester_name)
      ? selectedTesters[type].filter(item => item.tester_name !== tester.tester_name)
      : [...selectedTesters[type], { ...tester, project_name: projectName }];

    const updatedSelectedTesters = { ...selectedTesters, [type]: updatedList };

    setSelectedTesters(updatedSelectedTesters);
    updateTesterCount(updatedSelectedTesters);
  };

  const handleCreateTester = async (testerName, type) => {
    const newTester = {
      tester_name: testerName,
      project_name: projectName,
      billable: type === 'billable',
    };

    const updatedList = type === 'billable' ? [...selectedTesters.billable, newTester] : [...selectedTesters.nonbillable, newTester];
    const updatedSelectedTesters = { ...selectedTesters, [type]: updatedList };

    setSelectedTesters(updatedSelectedTesters);
    updateTesterCount(updatedSelectedTesters);
    setShowCreateTesterModal(false);
  };

  const updateTesterCount = (updatedSelectedTesters) => {
    const totalCount = updatedSelectedTesters.billable.length + updatedSelectedTesters.nonbillable.length;
    setFormData({ ...formData, tester_count: totalCount });
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();

    if (projectName !== confirmProjectName) {
      setError('Project names do not match.');
      return;
    }

    try {
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) throw new Error('User is not authenticated');

      setIsPending(true);

      const requestBody = {
        project_name: projectName,
      };

      const response = await fetch('http://localhost:5000/create-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error('Project creation failed');

      const projectDataResponse = await response.json();
      // setSuccessMessage('Project created successfully!');

      // Save the state in sessionStorage to indicate the project is created
      // sessionStorage.setItem('isProjectCreated', 'true');
      // setShowCreateDetails(true);


    } catch (error) {
      setError('Error creating project: ' + error.message);
    } finally {
      setIsPending(false);
      setShowPopup(false); // Close the popup after submitting
    }
  };


  // Handle Submit (Trigger Popup)
  const handleSubmitClick = (e) => {
    e.preventDefault(); // Prevent form submission immediately
    setShowPopup(true); // Show the confirmation popup
  };


  // const handlePopupCancel = () => {
  //   setShowPopup(false); // Close the popup without submitting
  // };

    // Trigger validation for all fields on submit
    const validateAllFields = () => {
      let allErrors = {};
  
      // Loop through each section and each field
      Object.keys(formData).forEach((section) => {
        Object.keys(formData[section]).forEach((field) => {
          const value = formData[section][field];
          let error = '';
          if (value === '' || value === null || value === undefined) {
            error = `${field.replace(/([A-Z])/g, ' $1')} is required.`;
          } else if (isNaN(value)) {
            error = `${field.replace(/([A-Z])/g, ' $1')} must be a valid number.`;
          }
          allErrors[`${section}-${field}`] = error;
        });
      });
  
      return allErrors; 
    };
    

    const handleBlur = (e) => {
      const { name, value } = e.target;
      let errorMessages = { ...errors };
  
      // Validate the fields onBlur
      switch (name) {
        case 'projectName':
          errorMessages.projectName = value ? '' : 'Project Name is required';
          break;
        case 'rag':
          errorMessages.rag = value ? '' : 'rag selection is required';
          break;
        case 'rag_details':
          errorMessages.rag_details = value ? '' : 'rag Details are required';
          break;
        case 'billable':
            errorMessages.billable = value ? '' : 'Billable tester Details are required';
            break;
        case 'nonbillable':
            errorMessages.nonbillable = value ? '' : 'Non billable Details are required';
            break;
        case 'billing_type':
          errorMessages.billing_type = value ? '' : 'Billing Type is required';
          break;
          case 'agile_type':
          errorMessages.agile_type = value ? '' : 'Agile Type is required';
          break;
        case 'automation_details':
          errorMessages.automation_details = formData.automation === 'Yes' && !value ? 'Automation Details are required' : '';
          break;
        case 'ai_used_details':
          errorMessages.ai_used_details = formData.ai_used === 'Yes' && !value ? 'AI Used Details are required' : '';
          break;
        default:
          break;
      }
  
      setErrors(errorMessages);
    };

  const handleProjectDetailsSubmit = async (e) => {
    e.preventDefault();
  
    // Check for validation errors before submitting the form
    let errorMessages = {};
    let isValid = true;
  
    // Validate each field
    if (!formData.projectName) {
      errorMessages.projectName = 'Project Name is required';
      isValid = false;
    }
    if (!formData.rag) {
      errorMessages.rag = 'rag selection is required';
      isValid = false;
    }
    if (!formData.rag_details) {
      errorMessages.rag_details = 'rag Details are required';
      isValid = false;
    }
    if (!formData.billing_type) {
      errorMessages.billing_type = 'Billing Type is required';
      isValid = false;
    }
    if (!formData.agile_type) {
      errorMessages.agile_type = 'Agile Type is required';
      isValid = false;
    }
     if (!formData.automation) {
      errorMessages.automation = 'Please select a value for Automation (Yes/No)';
      isValid = false;
    } else if (formData.automation === 'Yes' && !formData.automation_details) {
      errorMessages.automation_details = 'Automation Details are required';
      isValid = false;
    }
  
    if (!formData.ai_used) {
      errorMessages.ai_used = 'Please select a value for AI Used (Yes/No)';
      isValid = false;
    } else if (formData.ai_used === 'Yes' && !formData.ai_used_details) {
      errorMessages.ai_used_details = 'AI Used Details are required';
      isValid = false;
    }
  
  
    // Check if validation passed
    if (isValid) {
      // Proceed with form submission if valid
      setShowPopup(true);  // Show confirmation popup
      setSuccessMessage('Project details submitted successfully!');
  
      try {
        const accessToken = sessionStorage.getItem('access_token');
        if (!accessToken) throw new Error('User is not authenticated');
  
        setIsPending(true);
  
        // Step 1: Create the project
        const requestBody = {
          project_name: formData.projectName,
        };
  
        const response = await fetch('http://localhost:5000/create-project', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(requestBody),
        });
  
        if (!response.ok) throw new Error('Project creation failed');
  
        const projectDataResponse = await response.json();
        sessionStorage.setItem('isProjectCreated', 'true');
        setShowCreateDetails(true);
  
        // Step 2: Create Testers
        const testersToSubmit = [
          ...selectedTesters.billable.map((tester) => ({
            tester_name: tester.tester_name,
            project_name: formData.projectName,
            billable: true,
          })),
          ...selectedTesters.nonbillable.map((tester) => ({
            tester_name: tester.tester_name,
            project_name: formData.projectName,
            billable: false,
          })),
        ];
  
        const createTestersResponse = await fetch('http://localhost:5000/tester-billable', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ testers: testersToSubmit }),
        });
  
        if (!createTestersResponse.ok) {
          throw new Error('Testers creation failed');
        }
  
        // Step 3: Submit project details
        const projectDetailsPayload = {
          project_name: formData.projectName,
          rag: formData.rag,
          tester_count: formData.tester_count,
          testers: testersToSubmit,
          billing_type: formData.billing_type,
          rag_details: formData.rag_details,
          agile_type: formData.agile_type === 'Agile' ? true : false, 
          automation_details: formData.automation === 'Yes' ? formData.automation_details : '',
          ai_used_details: formData.ai_used === 'Yes' ? formData.ai_used_details : '',
        };
  
        const response2 = await fetch('http://localhost:5000/create-project-details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(projectDetailsPayload),
        });
        const responseaftercreateproject = projectDetailsPayload
        console.log("ReferenceError : " , responseaftercreateproject)
  
        if (!response2.ok) throw new Error('Project details creation failed');
  
        // Clear session data after completing the form
        sessionStorage.removeItem('isProjectCreated');
        sessionStorage.removeItem('formData');
        sessionStorage.setItem('projectID', projectDataResponse.project_id);

        // const projectNameToStore = selectedProject ? selectedProject : projectName;
    
    // Set the project name in sessionStorage
    formData.projectName = projectName;
    console.log("DRFTGYHJKLJHGFDSFGHJKGFTDRDTFYGUHGYFTDRSEDTFYGUHJ : " , projectDataResponse);
    sessionStorage.setItem('projectName', responseaftercreateproject.project_name);
  
      } catch (error) {
        setError('Error creating project details: ' + error.message);
        setShowErrorPopup(true); // Show error message in the popup
      } setTimeout(() => {
        // Retrieve agileType from sessionStorage
        const agileType = sessionStorage.getItem('agileType');
      
        // Check if agileType is defined and proceed with navigation logic
        if (agileType !== null) {
          if (agileType === 'true') {
            navigate('/AdminPanel/ScrumTeamManagement');
          } else {
            navigate('/AdminPanel/NonAgileForm');
          }
        } else {
          // Handle the case where agileType is not found in sessionStorage
          console.error('agileType is not defined in sessionStorage');
          setErrorMessage('Error: agileType not found in session storage.');
        }
      }, 1000); 
    } else {
      // If validation fails, show the error popup
      setShowErrorPopup(true);
      setErrorMessage('Please fill out all required fields.');
    }
  
    // Set error messages for each field
    setErrors(errorMessages);
  };


      const handlePopupCancel = () => {
        setShowPopup(false);
      };



  const getAvailableTesters = (type) => {
    return testers.filter(tester =>
      !selectedTesters.billable.some(selectedTester => selectedTester.tester_name === tester.tester_name) &&
      !selectedTesters.nonbillable.some(selectedTester => selectedTester.tester_name === tester.tester_name)
    );
  };



  

  return (
    <div className="container mt-5">

      {/* Create Project Details Form */}
      
        <Card className="mt-4 shadow-lg">
          <Card.Header as="h4" style={{ backgroundColor: '#000d6b', color: '#ffffff', borderRadius: '10px 10px 0 0', padding: '15px' }}>
            Add Project Details
          </Card.Header>
          <Card.Body>
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {/* Apply Grid Layout for Left and Right Sections */}
              <Form onSubmit={handleProjectDetailsSubmit}>
                <div className="row">
                  {/* Left Section */}
                  <div className="col-md-6">
                    <Form.Group controlId="projectName">
                      <Form.Label style={{ fontWeight: 'bold' }}>Project Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.projectName}
                        onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                        onBlur={handleBlur}
                        // required
                        style={{ borderRadius: '5px', border: '1px solid #ced4da', padding: '10px' }}
                      />
                      {errors.projectName && <div style={{ color: 'red' }}>{errors.projectName}</div>}
                    </Form.Group>
  
                    <Form.Group controlId="rag">
                      <Form.Label style={{ fontWeight: 'bold' }}>rag</Form.Label>
                      <Form.Select
                        value={formData.rag}
                        onChange={(e) => setFormData({ ...formData, rag: e.target.value })}
                        onBlur={handleBlur}
                        // required
                        style={{ borderRadius: '5px', padding: '10px' }}
                      >
                        <option value="">Select rag</option>
                        <option value="Red">Red</option>
                        <option value="Amber">Amber</option>
                        <option value="Green">Green</option>
                      </Form.Select>
                      {errors.rag && <div style={{ color: 'red' }}>{errors.rag}</div>}
                    </Form.Group>
  
                    <Form.Group controlId="rag_details">
                      <Form.Label style={{ fontWeight: 'bold' }}>rag Details</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.rag_details}
                        onChange={(e) => setFormData({ ...formData, rag_details: e.target.value })}
                        onBlur={handleBlur}
                        // required
                        style={{ borderRadius: '5px', border: '1px solid #ced4da', padding: '10px' }}
                      />
                      {errors.rag_details && <div style={{ color: 'red' }}>{errors.rag_details}</div>}
                    </Form.Group>
  
                    <Form.Group controlId="billing_type">
                      <Form.Label>Billing Type</Form.Label>
                      <Form.Control
                        as="select"
                        value={formData.billing_type}
                        onChange={(e) => setFormData({ ...formData, billing_type: e.target.value })}
                        onBlur={handleBlur}
                        // required

                      >
                        <option value="">Select Billing Type</option>
                        <option value="T&M">T&M</option>
                        <option value="FIXED">FIXED</option>
                      </Form.Control>
                      {errors.billing_type && <div style={{ color: 'red' }}>{errors.billing_type}</div>}
                    </Form.Group>
  
                    <Form.Group controlId="tester_count">
                      <Form.Label style={{ fontWeight: 'bold' }}>Tester Count</Form.Label>
                      <Form.Control
                        type="number"
                        value={formData.tester_count}
                        readOnly
                        style={{ borderRadius: '5px', padding: '10px', backgroundColor: '#f8f9fa' }}
                      />
                      {errors.tester_count && <div style={{ color: 'red' }}>{errors.tester_count}</div>}
                    </Form.Group>
                  </div>
  
                  {/* Right Section */}
                  <div className="col-md-6">
                    {/* Billable Testers Dropdown */}
                    <Form.Group controlId="billable">
                      <Form.Label style={{ fontWeight: 'bold' }}>Billable Testers</Form.Label>
                      <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic" style={{
                          width: '100%',
                          padding: '8px',
                          textAlign: 'left',
                          backgroundColor: '#000d6b',  // Apply the color to the dropdown button
                          borderColor: '#000d6b',  // Matching border color
                          color: '#ffffff',  // Ensure text is white for contrast
                          borderRadius: '5px'
                        }}>
                          {selectedTesters.billable.length > 0
                            ? selectedTesters.billable.map((t) => t.tester_name).join(', ')
                            : 'Select Testers'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {loadingTesters ? (
                            <Dropdown.ItemText>
                              <Spinner animation="border" size="sm" />
                              Loading...
                            </Dropdown.ItemText>
                          ) : (
                            getAvailableTesters('billable').map((tester) => (
                              <Dropdown.Item
                                key={tester.id}
                                onClick={() => handleTesterSelection(tester, 'billable')}
                              >
                                {tester.tester_name}
                              </Dropdown.Item>
                            ))
                          )}
                          <Dropdown.Item
                            onClick={() => {
                              setSelectedTesterType('billable');
                              setShowCreateTesterModal(true);
                            }}
                          >
                            Add New Tester
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>
  
                    {/* Non-Billable Testers Dropdown */}
                    <Form.Group controlId="nonbillable">
                      <Form.Label style={{ fontWeight: 'bold' }}>Non-Billable Testers</Form.Label>
                      <Dropdown>
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic" style={{ width: '100%', padding: '10px', textAlign: 'left', backgroundColor: "000d6b" }}>
                          {selectedTesters.nonbillable.length > 0
                            ? selectedTesters.nonbillable.map((t) => t.tester_name).join(', ')
                            : 'Select Testers'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {loadingTesters ? (
                            <Dropdown.ItemText>
                              <Spinner animation="border" size="sm" />
                              Loading...
                            </Dropdown.ItemText>
                          ) : (
                            getAvailableTesters('nonbillable').map((tester) => (
                              <Dropdown.Item
                                key={tester.id}
                                onClick={() => handleTesterSelection(tester, 'nonbillable')}
                              >
                                {tester.tester_name}
                              </Dropdown.Item>
                            ))
                          )}
                          <Dropdown.Item
                            onClick={() => {
                              setSelectedTesterType('nonbillable');
                              setShowCreateTesterModal(true);
                            }}
                          >
                            Add New Tester
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>
  
                    <br />
  
                    {/* Automation Used */}
                    <Form.Group controlId="Automation">
                      <Form.Label>Automation Used <span style={{ color: 'red' }}>*</span></Form.Label>
                      <div>
                        <Form.Check
                          type="radio"
                          label="Yes"
                          value="Yes"
                          checked={formData.automation === 'Yes'}
                          onChange={(e) => setFormData({ ...formData, automation: e.target.value })}
                        />
                        <Form.Check
                          type="radio"
                          label="No"
                          value="No"
                          checked={formData.automation === 'No'}
                          onChange={(e) => setFormData({ ...formData, automation: e.target.value })}
                        />
                      </div>
                      {formData.automation === 'Yes' && (
                        <div>
                          <Button
                            variant="secondary"
                            onClick={() => setFormData({ ...formData, automation_details: "Selenium" })}
                            style={{ marginRight: '10px' }}
                          >
                            Selenium
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => setFormData({ ...formData, automation_details: "Pytest" })}
                          >
                            Pytest
                          </Button>
                          <Form.Group controlId="automationDetails" style={{ marginTop: '10px' }}>
                            <Form.Label>Automation Tool</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              value={formData.automation_details}
                              onChange={(e) => setFormData({ ...formData, automation_details: e.target.value })}
                              placeholder="Details about the selected automation tool"
                              onBlur={handleBlur}
                            />
                            {errors.automation_details && <div style={{ color: 'red' }}>{errors.automation_details}</div>}
                          </Form.Group>
                        </div>
                      )}
                    </Form.Group>
                    <br />

                     <Form.Group controlId="agile_type">
                    
                                          <Form.Label>Project Type</Form.Label>
                                          <Form.Control
                                            as="select"
                                            value={formData.agile_type}
                                            onChange={(e) => {
                                              const selectedValue = e.target.value;
                                              setFormData({ ...formData, agile_type: selectedValue });
                    
                                              // Set the session storage based on the selected value
                                              sessionStorage.setItem('agileType', selectedValue === 'Agile' ? 'true' : 'false');
                                            }}
                                            required
                                          >
                                            <option value="">Select Project Type</option>
                                            <option value="Agile">Agile</option>
                                            <option value="Non-Agile">Non-Agile</option>
                                          </Form.Control>
                                        </Form.Group>
  
                    
                    <Form.Group controlId="AI">
                      <Form.Label>AI Used  <span style={{ color: 'red' }}> *</span></Form.Label>
                      <div>
                        <Form.Check
                          type="radio"
                          label="Yes"
                          value="Yes"
                          checked={formData.ai_used === 'Yes'}
                          onChange={(e) => setFormData({ ...formData, ai_used: e.target.value })}
                        />
                        <Form.Check
                          type="radio"
                          label="No"
                          value="No"
                          checked={formData.ai_used === 'No'}
                          onChange={(e) => setFormData({ ...formData, ai_used: e.target.value })}
                        />
                      </div>
                      {formData.ai_used === 'Yes' && (
                        <div>
                          <Button
                            variant="secondary"
                            onClick={() => setFormData({ ...formData, ai_used_details: "TensorFlow" })}
                            style={{ marginRight: '10px' }}
                          >
                            TensorFlow
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => setFormData({ ...formData, ai_used_details: "PyTorch" })}
                          >
                            PyTorch
                          </Button>
                          <Form.Group controlId="aiUsedDetails" style={{ marginTop: '10px' }}>
                            <Form.Label>AI Tool</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              value={formData.ai_used_details}
                              onChange={(e) => setFormData({ ...formData, ai_used_details: e.target.value })}
                              placeholder="Details about the selected AI tool"
                              onBlur={handleBlur}
                            />
                            {errors.ai_used_details && <div style={{ color: 'red' }}>{errors.ai_used_details}</div>}
                          </Form.Group>
                        </div>
                      )}
                    </Form.Group>
                  </div>
                </div>
  
                <br />
  
                {/* Submit Button */}
                <Button
                  variant="primary"
                  type="submit"
                  style={{
                    fontWeight: 'bold',
                    color: '#ffffff',
                    backgroundColor: '#000d6b',
                    borderColor: '#0056b3',
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#004085'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#0056b3'}
                >
                  Submit
                </Button>
              </Form>
            </div>
          </Card.Body>
        </Card>
     
  
      {/* Confirmation Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Confirm Project Details</h3>
            <p>Are you sure you want to proceed with the project "{projectName}"?</p>
            <button onClick={handleProjectDetailsSubmit} >Yes, Proceed</button>
            <button onClick={handlePopupCancel}>Cancel</button>
  
            {/* Display Success Message in the Popup */}
            {successMessage && <div style={{ color: 'green', marginTop: '10px' }}>{successMessage}</div>}
          </div>
        </div>
      )}

            {/* Error Popup */}
            {showErrorPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>{errorMessage.includes("Successfully") ? "Success" : "Error"}</h3>
            <p style={{ color: errorMessage.includes("Successfully") ? 'green' : 'red' }}>{errorMessage}</p>
            <Button variant="outline-dark" onClick={() => setShowErrorPopup(false)} style={{ marginTop: '5px' }}>
              Close
            </Button>
          </div>
        </div>
      )}
  
      {/* Modal for creating tester */}
      <Modal show={showCreateTesterModal} onHide={() => setShowCreateTesterModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Tester</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateTester(e.target.testerName.value, selectedTesterType);
            }}
          >
            <Form.Group controlId="testerName">
              <Form.Label>Tester Name:</Form.Label>
              <Form.Control
                type="text"
                name="testerName"
                // required
              />
            </Form.Group>
            <Button variant="primary" type="submit">Create Tester</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminAddProjectWithDetails;

