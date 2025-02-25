// // BASIL CODE 

// import React, { useState, useEffect } from 'react';
// import { FaEdit, FaTrashAlt } from 'react-icons/fa';
// import { Button, Table, Form, Card, Row, Col, Modal } from 'react-bootstrap';
// import axios from 'axios';
// import {jwtDecode} from 'jwt-decode'; 

// const ManageTotalDefectStatus = () => {
//   const [defectStatuses, setDefectStatuses] = useState([]);
//   const [formData, setFormData] = useState({
//     date: '',
//     total_defect: '',
//     defect_closed: '',
//     open_defect: '',
//     critical: '',
//     high: '',
//     medium: '',
//     low: '',
//     project_name_id: ''
//   });
//   const [projects, setProjects] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [editingStatus, setEditingStatus] = useState(null);
//   const [showProjectsModal, setShowProjectsModal] = useState(false);
//   const [showDefectsModal, setShowDefectsModal] = useState(false);
//   const [selectedProjectId, setSelectedProjectId] = useState(null);
//   const [projectDefects, setProjectDefects] = useState([]);
//   const [user_role, setUserRole] = useState(null);

//   useEffect(() => {

//         // Decode JWT token to extract role and userId
//         // const token = sessionStorage.getItem('access_token');
//         // const decodedToken = jwtDecode(token);
//         // setUserRole(decodedToken.role); // Store role in state



//         // console.log("User role:", role); // Add this line to see if role is correctly set

//     fetchDefectStatuses();
//     fetchUserProjects();
//   }, []);

//   const fetchDefectStatuses = async () => {
//     const token = sessionStorage.getItem('access_token');
//     try {
//       const response = await axios.get('https://frt4cnbr-5000.inc1.devtunnels.ms/total_defect_status', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       setDefectStatuses(response.data);
//     } catch (error) {
//       console.error('Error fetching total defect statuses:', error);
//     }
//   };


//   const fetchUserProjects = async () => {
//     const token = sessionStorage.getItem('access_token');
//     try {
//       const response = await axios.get('https://frt4cnbr-5000.inc1.devtunnels.ms/get-user-projects', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       setProjects(response.data.projects);
//       setUserRole(response.data.user_role);

//       console.log("UserRole : ",  response)
//     } catch (error) {
//       console.error('Error fetching user projects:', error);
//     }
//   };

//   const fetchProjectDefects = async (projectId) => {
//     const token = sessionStorage.getItem('access_token');
//     try {
//       const response = await axios.get(`https://frt4cnbr-5000.inc1.devtunnels.ms/total_defect_status/${projectId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       setProjectDefects(response.data);
//       setSelectedProjectId(projectId);
//     } catch (error) {
//       console.error('Error fetching project defects:', error);
//     }
//   };

//   const validateForm = () => {
//     let formIsValid = true;
//     let errors = {};

//     // Validate Date
//     if (!formData.date) {
//       formIsValid = false;
//       errors.date = 'Date is required';
//     }

//     // Validate Total Defect
//     if (!formData.total_defect || formData.total_defect <= 0) {
//       formIsValid = false;
//       errors.total_defect = 'Total defect is required and should be a positive number';
//     }

//     // Validate Defect Closed
//     // if (!formData.defect_closed || formData.defect_closed < 0) {
//     //   formIsValid = false;
//     //   errors.defect_closed = 'Defect closed is required and should be a non-negative number';
//     // }

//     // Validate Open Defect
//     // if (formData.open_defect && formData.open_defect < 0) {
//     //   formIsValid = false;
//     //   errors.open_defect = 'Open defect should be a non-negative number';
//     // }

//     // Validate Critical, High, Medium, Low
//     const severityLevels = ['critical', 'high', 'medium', 'low'];
//     severityLevels.forEach(level => {
//       if (formData[level] && formData[level] < 0) {
//         formIsValid = false;
//         errors[level] = `${level.charAt(0).toUpperCase() + level.slice(1)} should be a non-negative number`;
//       }
//     });

//     // Validate Project Name
//     if (!formData.project_name_id && !editingStatus) {
//       formIsValid = false;
//       errors.project_name_id = 'Project Name is required';
//     }

//     setErrors(errors); // Set the errors object for feedback
//     return formIsValid;
//   };

//   const handleChange = e => {
//     const { name, value } = e.target;
  
//     // Handle changes for critical, high, medium, and low defects
//     if (['critical', 'high', 'medium', 'low'].includes(name)) {
//       const updatedFormData = { ...formData, [name]: value };
  
//       // Calculate open_defect based on the sum of critical, high, medium, and low
//       const totalDefect = (
//         Number(updatedFormData.critical || 0) +
//         Number(updatedFormData.high || 0) +
//         Number(updatedFormData.medium || 0) +
//         Number(updatedFormData.low || 0)
//       ).toString();

  
//       // Calculate total_defect by adding open_defect and defect_closed
//       // const totalDefect = ( Number(updatedFormData.open_defect) + Number(updatedFormData.defect_closed || 0)).toString();
  
//       setFormData({
//         ...updatedFormData,
//         // open_defect: openDefect,
//         total_defect: totalDefect
//       });
//     } 
//     // Handle changes for defect_closed
//     else if (name === 'defect_closed') {
//       const updatedFormData = { ...formData, [name]: value };
  
//       // Calculate open_defect based on the sum of critical, high, medium, and low
//       const totalDefect = (
//         Number(updatedFormData.critical || 0) +
//         Number(updatedFormData.high || 0) +
//         Number(updatedFormData.medium || 0) +
//         Number(updatedFormData.low || 0)
//       ).toString();
  
//       // Calculate total_defect by adding open_defect and defect_closed
//       // const totalDefect = (Number(openDefect) + Number(value || 0)).toString();
  
//       setFormData({
//         ...updatedFormData,
//         // open_defect: openDefect,
//         total_defect: totalDefect
//       });
//     } 
//     // Handle other fields
//     else {
//       setFormData({
//         ...formData,
//         [name]: value
//       });
//     }
//   };
  
//   const handleSubmit = async () => {
//     if (!validateForm()) return; // Call validateForm to check for errors
//     const token = sessionStorage.getItem('access_token');
//     const method = editingStatus ? 'PUT' : 'POST';
//     const url = editingStatus
//       ? `https://frt4cnbr-5000.inc1.devtunnels.ms/total_defect_status/${editingStatus.id}`
//       : 'https://frt4cnbr-5000.inc1.devtunnels.ms/total_defect_status';

//     try {
//       const response = await axios({
//         method,
//         url,
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         data: formData
//       });
//       if (response.status === 200 || response.status === 201) {
//         alert(editingStatus ? 'Status updated successfully!' : 'Status added successfully!');
//         setEditingStatus(null);
//         setFormData({
//           date: '',
//           total_defect: '',
//           defect_closed: '',
//           open_defect: '',
//           critical: '',
//           high: '',
//           medium: '',
//           low: '',
//           project_name_id: ''
//         });
//         fetchDefectStatuses();
//       } else {
//         alert('Failed to save status.');
//       }
//     } catch (error) {
//       console.error('Error saving status:', error);
//     }
//   };

//   const handleDelete = async id => {
//     if (window.confirm('Are you sure you want to delete this status?')) {
//       const token = sessionStorage.getItem('access_token');
//       try {
//         const response = await axios.delete(`https://frt4cnbr-5000.inc1.devtunnels.ms/total_defect_status/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         if (response.status === 200) {
//           alert('Status deleted successfully!');
//           fetchDefectStatuses();
//         } else {
//           alert('Failed to delete status.');
//         }
//       } catch (error) {
//         console.error('Error deleting status:', error);
//       }
//     }
//   };

//   const handleEditClick = status => {
//     setShowProjectsModal(false);
//     setShowDefectsModal(false);
//     // setProjectDefects([]); // Reset project defects
//     // setSelectedProjectId(null);
   
//     setEditingStatus(status);
//     // Pre-fill the form data including the date when editing
//     setFormData({
//       ...status,
//       date: formatDate(status.date) // Make sure to set the correct date format
//     });
//     // setShowDefectsModal(true); // Open the defects modal when editing
//   };

//   const handleViewClick = projectId => {
//     fetchProjectDefects(projectId); // Fetch project defects when "View" is clicked
//     setShowDefectsModal(true); // Show the defects modal
//   };

//   const handleCloseProjectsModal = () => {
//     setShowProjectsModal(false); // Close the projects modal
//   };

//   const handleCloseDefectsModal = () => {
//     setShowDefectsModal(false); // Close the defects modal
//     // setProjectDefects([]); // Reset project defects
//     // setSelectedProjectId(null); // Reset selected project ID
//   };

//   // Utility function to format date to DD-MM-YYYY
//   const formatDate = date => {
//     const d = new Date(date);
//     const day = String(d.getDate()).padStart(2, '0');
//     const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
//     const year = d.getFullYear();
//     return `${year}-${month}-${day}`; // This formats it to yyyy-mm-dd for input type="date"
//   };

//   return (
//     <div className="container mt-5">
//       <Card>
//         <Card.Header
//           as="h5"
//           style={{
//             backgroundColor: '#000d6b',
//             color: '#ffffff',
//             borderRadius: '10px 10px 0 0',
//             display: 'flex',
//             justifyContent: 'space-between', // Align button to the right
//             alignItems: 'center'
//           }}
//         >
//           Manage Total Defect Statuses
//           <Button
//             variant="outline-light"
//             style={{ backgroundColor: 'transparent', borderColor: '#ffffff' }}
//             onClick={() => setShowProjectsModal(true)} // Open modal to view projects
//           >
//             View Projects
//           </Button>
//         </Card.Header>
//         <Card.Body>
//           <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
//           <Form>
//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Date</Form.Label>
//                   <Form.Control
//                     type="date"
//                     name="date"
//                     value={formData.date}
//                     onChange={handleChange}
//                     max={new Date().toISOString().split('T')[0]}
//                     isInvalid={!!errors.date}
//                     disabled={editingStatus} // Disable date input when editing
//                   />
//                   <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label>Total Defect</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="total_defect"
//                     value={formData.total_defect}
//                     onChange={handleChange}
//                     isInvalid={!!errors.total_defect}
//                     readOnly
//                     style={{ backgroundColor: '#e9ecef' }}
//                   />
//                   <Form.Control.Feedback type="invalid">{errors.total_defect}</Form.Control.Feedback>
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label>Defect Closed</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="defect_closed"
//                     value={formData.defect_closed}
//                     onChange={handleChange}
//                     isInvalid={!!errors.defect_closed}
//                   />
//                   <Form.Control.Feedback type="invalid">{errors.defect_closed}</Form.Control.Feedback>
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label>Open Defect</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="open_defect"
//                     value={formData.open_defect}
//                     onChange={handleChange}
//                     isInvalid={!!errors.open_defect}
//                     // readOnly
//                     style={{ backgroundColor: '#e9ecef' }}
//                   />
//                   <Form.Control.Feedback type="invalid">{errors.open_defect}</Form.Control.Feedback>
//                 </Form.Group>

//                 {/* Hide Project Name when editing */}
//                 {!editingStatus && (
//                   <Form.Group className="mb-3">
//                     <Form.Label>Project Name</Form.Label>
//                     <Form.Control
//                       as="select"
//                       name="project_name_id"
//                       value={formData.project_name_id}
//                       onChange={handleChange}
//                       isInvalid={!!errors.project_name_id}
//                     >
//                       <option value="">Select a project</option>
//                       {projects.map(project => (
//                         <option key={project.id} value={project.project_name_id}>
//                           {project.project_name}
//                         </option>
//                       ))}
//                     </Form.Control>
//                     <Form.Control.Feedback type="invalid">{errors.project_name_id}</Form.Control.Feedback>
//                   </Form.Group>
//                 )}
//               </Col>

//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Critical</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="critical"
//                     value={formData.critical}
//                     onChange={handleChange}
//                     isInvalid={!!errors.critical}
//                   />
//                   <Form.Control.Feedback type="invalid">{errors.critical}</Form.Control.Feedback>
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label>High</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="high"
//                     value={formData.high}
//                     onChange={handleChange}
//                     isInvalid={!!errors.high}
//                   />
//                   <Form.Control.Feedback type="invalid">{errors.high}</Form.Control.Feedback>
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label>Medium</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="medium"
//                     value={formData.medium}
//                     onChange={handleChange}
//                     isInvalid={!!errors.medium}
//                   />
//                   <Form.Control.Feedback type="invalid">{errors.medium}</Form.Control.Feedback>
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label>Low</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="low"
//                     value={formData.low}
//                     onChange={handleChange}
//                     isInvalid={!!errors.low}
//                   />
//                   <Form.Control.Feedback type="invalid">{errors.low}</Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//             </Row>
//             <Button
//               variant="primary"
//               onClick={handleSubmit}
//               style={{ width: '100%' }}
//             >
//               {editingStatus ? 'Update Status' : 'Add Status'}
//             </Button>
//           </Form>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* Projects Modal */}
//       <Modal show={showProjectsModal} onHide={handleCloseProjectsModal} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Projects</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Table striped bordered hover>
//             <thead>
//               <tr>
//                 <th>Project Name</th>
//                 <th>Project ID</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {projects.map(project => (
//                 <tr key={project.id}>
//                   <td>{project.project_name}</td>
//                   <td>{project.id}</td>
//                   <td>
//                     <Button
//                       variant="info"
//                       size="sm"
//                       onClick={() => handleViewClick(project.id)}
//                     >
//                       View Defects
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseProjectsModal}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Defects Modal */}
//       <Modal show={showDefectsModal} onHide={handleCloseDefectsModal} size="lg">
//     <Modal.Header closeButton>
//         <Modal.Title>Project Defects</Modal.Title>
//     </Modal.Header>
   
// <Modal.Body>
//   {projectDefects.length > 0 ? (
//     <Table striped bordered hover>
//       <thead>
//         <tr>
//           <th>Date</th>
//           <th>Total Defects</th>
//           <th>Defects Closed</th>
//           <th>Open Defects</th>
//           <th>Critical</th>
//           <th>High</th>
//           <th>Medium</th>
//           <th>Low</th>
//           {user_role === 'admin' && <th>Actions</th>} {/* Conditionally render the Actions header */}
//         </tr>
//       </thead>
//       <tbody>
//         {projectDefects.map(defect => (
//           <tr key={defect.id}>
//             <td>{formatDate(defect.date)}</td>
//             <td>{defect.total_defect}</td>
//             <td>{defect.defect_closed}</td>
//             <td>{defect.open_defect}</td>
//             <td>{defect.critical}</td>
//             <td>{defect.high}</td>
//             <td>{defect.medium}</td>
//             <td>{defect.low}</td>
//             {user_role === 'admin' && (  // Conditionally render the Actions column for admin
//               <td>
//                 <Button
//                   variant="outline-warning"
//                   onClick={() => handleEditClick(defect)}
//                   size="sm" // Smaller button size
//                 >
//                   ✏️
//                 </Button>
//                 <Button
//                   variant="outline-danger"
//                   onClick={() => handleDelete(defect.id)}
//                   size="sm" // Smaller button size
//                   style={{ marginLeft: '10px' }}
//                 >
//                   🗑️
//                 </Button>
//               </td>
//             )}
//           </tr>
//         ))}
//       </tbody>
//     </Table>
//   ) : (
//     <p>No defects found for this project.</p>
//   )}
// </Modal.Body>



//     <Modal.Footer>
//         <Button variant="secondary" onClick={handleCloseDefectsModal}>
//             Close
//         </Button>
//     </Modal.Footer>
// </Modal>

//     </div>
//   );
// };

// export default ManageTotalDefectStatus;




// MY CODE 
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Button, Table, Form, Card, Row, Col, Modal } from 'react-bootstrap';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';



import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory


const ManageTotalDefectStatus = () => {
  const [defectStatuses, setDefectStatuses] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    total_defect: '',
    defect_closed: '',
    open_defect: '',
    critical: '',
    high: '',
    medium: '',
    low: '',
    project_name_id: ''
  });
  const [projects, setProjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [editingStatus, setEditingStatus] = useState(null);
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [showDefectsModal, setShowDefectsModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projectDefects, setProjectDefects] = useState([]);
  const [user_role, setUserRole] = useState(null);



  const navigate = useNavigate(); // Initialize useNavigate for navigation


  const [projectName, setProjectName] = useState(''); // Store project name from sessionStorage    


  useEffect(() => {



    // console.log("User role:", role); // Add this line to see if role is correctly set

    fetchDefectStatuses();
    fetchUserProjects();

    // Check if there's data in localStorage for manageDefect
    const storedData = localStorage.getItem('ManageTotalDefectStatuses');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setFormData(parsedData); // Fill the form with the stored data
    }


    // Retrieve the selected project name from sessionStorage
    const projectNameFromSession = sessionStorage.getItem('projectName');
    if (projectNameFromSession) {
      setProjectName(projectNameFromSession); // Set the project name from session
      setFormData(prevState => ({
        ...prevState,
        project_name_id: projectNameFromSession, // Set project_name_id based on sessionStorage data
      }));
    }






  }, []);

  const fetchDefectStatuses = async () => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get('https://frt4cnbr-5000.inc1.devtunnels.ms/total_defect_status', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setDefectStatuses(response.data);
    } catch (error) {
      console.error('Error fetching total defect statuses:', error);
    }
  };


  const fetchUserProjects = async () => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get('https://frt4cnbr-5000.inc1.devtunnels.ms/get-user-projects', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setProjects(response.data.projects);
      setUserRole(response.data.user_role);

      console.log("UserRole : ", response)
    } catch (error) {
      console.error('Error fetching user projects:', error);
    }
  };

  const fetchProjectDefects = async (projectId) => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get(`https://frt4cnbr-5000.inc1.devtunnels.ms/total_defect_status/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setProjectDefects(response.data);
      setSelectedProjectId(projectId);
    } catch (error) {
      console.error('Error fetching project defects:', error);
    }
  };

  const validateForm = () => {
    const requiredFields = [
      'date',
      'total_defect',
      'open_defect',
      'defect_closed',
      'critical',
      'high',
      'medium',
      'low',
      'project_name_id'
    ];
    const newErrors = {};

    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    if (formData.date > today) {
      newErrors.date = 'Date cannot be in the future.';
    }

    requiredFields.forEach(field => {
      if (!formData[field] && field !== 'date') {
        newErrors[field] = `${field} is required.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleChange = e => {
    const { name, value } = e.target;

    // Handle changes for critical, high, medium, and low defects
    if (['critical', 'high', 'medium', 'low'].includes(name)) {
      const updatedFormData = { ...formData, [name]: value };

      // Calculate open_defect based on the sum of critical, high, medium, and low
      const totalDefect = (
        Number(updatedFormData.critical || 0) +
        Number(updatedFormData.high || 0) +
        Number(updatedFormData.medium || 0) +
        Number(updatedFormData.low || 0)
      ).toString();


      // Calculate total_defect by adding open_defect and defect_closed
      // const totalDefect = ( Number(updatedFormData.open_defect) + Number(updatedFormData.defect_closed || 0)).toString();

      setFormData({
        ...updatedFormData,
        // open_defect: openDefect,
        total_defect: totalDefect
      });
    }
    // Handle changes for defect_closed
    else if (name === 'defect_closed') {
      const updatedFormData = { ...formData, [name]: value };

      // Calculate open_defect based on the sum of critical, high, medium, and low
      const totalDefect = (
        Number(updatedFormData.critical || 0) +
        Number(updatedFormData.high || 0) +
        Number(updatedFormData.medium || 0) +
        Number(updatedFormData.low || 0)
      ).toString();

      // Calculate total_defect by adding open_defect and defect_closed
      // const totalDefect = (Number(openDefect) + Number(value || 0)).toString();

      setFormData({
        ...updatedFormData,
        // open_defect: openDefect,
        total_defect: totalDefect
      });
    }
    // Handle other fields
    else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return; // Call validateForm to check for errors
    const token = sessionStorage.getItem('access_token');
    const method = editingStatus ? 'PUT' : 'POST';
    const url = editingStatus
      ? `https://frt4cnbr-5000.inc1.devtunnels.ms/total_defect_status/${editingStatus.id}`
      : 'https://frt4cnbr-5000.inc1.devtunnels.ms/total_defect_status';

    try {
      const response = await axios({
        method,
        url,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: formData
      });
      if (response.status === 200 || response.status === 201) {
        alert(editingStatus ? 'Status updated successfully!' : 'Status added successfully!');
        setEditingStatus(null);
        setFormData({
          date: '',
          total_defect: '',
          defect_closed: '',
          open_defect: '',
          critical: '',
          high: '',
          medium: '',
          low: '',
          project_name_id: ''
        });
        fetchDefectStatuses();
      } else {
        alert('Failed to save status.');
      }
    } catch (error) {
      console.error('Error saving status:', error);
    }
  };

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this status?')) {
      const token = sessionStorage.getItem('access_token');
      try {
        const response = await axios.delete(`https://frt4cnbr-5000.inc1.devtunnels.ms/total_defect_status/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          alert('Status deleted successfully!');
          fetchDefectStatuses();
        } else {
          alert('Failed to delete status.');
        }
      } catch (error) {
        console.error('Error deleting status:', error);
      }
    }
  };

  const handleEditClick = status => {
    setShowProjectsModal(false);
    setShowDefectsModal(false);
    // setProjectDefects([]); // Reset project defects
    // setSelectedProjectId(null);

    setEditingStatus(status);
    // Pre-fill the form data including the date when editing
    setFormData({
      ...status,
      date: formatDate(status.date) // Make sure to set the correct date format
    });
    // setShowDefectsModal(true); // Open the defects modal when editing
  };

  const handleViewClick = projectId => {
    fetchProjectDefects(projectId); // Fetch project defects when "View" is clicked
    setShowDefectsModal(true); // Show the defects modal
  };

  const handleCloseProjectsModal = () => {
    setShowProjectsModal(false); // Close the projects modal
  };

  const handleCloseDefectsModal = () => {
    setShowDefectsModal(false); // Close the defects modal
    // setProjectDefects([]); // Reset project defects
    // setSelectedProjectId(null); // Reset selected project ID
  };

  // Utility function to format date to DD-MM-YYYY
  const formatDate = date => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = d.getFullYear();
    return `${year}-${month}-${day}`; // This formats it to yyyy-mm-dd for input type="date"
  };




  const handleNext = () => {
    // Check if all required fields are filled
    // const isValid = Object.values(formData).every(field => field !== '');
    const isValid = validateForm()
    if (!isValid) {
      alert('Please fill all the fields before proceeding.');
      return;
    }

    // Store the form data in localStorage
    localStorage.setItem('ManageTotalDefectStatuses', JSON.stringify(formData));

    // Navigate to the next component
    navigate('/AdminPanel/ManageBuildStatus');
  };


  // This function will be triggered when the "Go to Previous" button is clicked
  const handlePrevious = () => {
    // Fetch the form data from localStorage
    const savedData = JSON.parse(localStorage.getItem('ManageTestExecutionStatus'));

    if (savedData) {
      setFormData(savedData); // Restore the form data from localStorage
    } else {
      console.log('No data found in localStorage.');
    }

    // Navigate to the previous page (can be a specific path or use -1 for going back to the last visited page)
    // navigate('AdminPanel/ManageDefects'); // This will go back to the previous page
    navigate(-1); // This will go back to the previous page
  };



  // validation 

  const validateField = (name, value) => {
    let error = '';
    if (!value) {
      error = `${name} is required.`;
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
  };


  return (
    <div className="container mt-5">
      <Card>
        <Card.Header
          as="h5"
          style={{
            backgroundColor: '#000d6b',
            color: '#ffffff',
            borderRadius: '10px 10px 0 0',
            display: 'flex',
            justifyContent: 'space-between', // Align button to the right
            alignItems: 'center'
          }}
        >
          Manage Total Defect Statuses
          <Button
            variant="outline-light"
            style={{ backgroundColor: 'transparent', borderColor: '#ffffff' }}
            onClick={() => setShowProjectsModal(true)} // Open modal to view projects
          >
            View Projects
          </Button>
        </Card.Header>
        <Card.Body>
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      max={new Date().toISOString().split('T')[0]}
                      isInvalid={!!errors.date}
                      disabled={editingStatus} // Disable date input when editing
                    />
                    <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Total Defect</Form.Label>
                    <Form.Control
                      type="number"
                      name="total_defect"
                      value={formData.total_defect}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.total_defect}
                      readOnly
                      style={{ backgroundColor: '#e9ecef' }}
                    />
                    <Form.Control.Feedback type="invalid">{errors.total_defect}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Defect Closed</Form.Label>
                    <Form.Control
                      type="number"
                      name="defect_closed"
                      value={formData.defect_closed}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.defect_closed}
                    />
                    <Form.Control.Feedback type="invalid">{errors.defect_closed}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Open Defect</Form.Label>
                    <Form.Control
                      type="number"
                      name="open_defect"
                      value={formData.open_defect}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.open_defect}
                      // readOnly
                      style={{ backgroundColor: '#e9ecef' }}
                    />
                    <Form.Control.Feedback type="invalid">{errors.open_defect}</Form.Control.Feedback>
                  </Form.Group>

                  {/* Hide Project Name when editing */}



                  <Form.Group controlId="project_name_id">
                    <Form.Label>Project Name:</Form.Label>
                    {/* Auto-select project name from sessionStorage and disable it */}
                    <Form.Control
                      type="text"
                      value={sessionStorage.getItem('selectedProject') || projectName} // Retrieve from sessionStorage if available
                      readOnly // Make the input read-only
                    />
                  </Form.Group>

                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Critical</Form.Label>
                    <Form.Control
                      type="number"
                      name="critical"
                      value={formData.critical}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.critical}
                    />
                    <Form.Control.Feedback type="invalid">{errors.critical}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>High</Form.Label>
                    <Form.Control
                      type="number"
                      name="high"
                      value={formData.high}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.high}
                    />
                    <Form.Control.Feedback type="invalid">{errors.high}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Medium</Form.Label>
                    <Form.Control
                      type="number"
                      name="medium"
                      value={formData.medium}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.medium}
                    />
                    <Form.Control.Feedback type="invalid">{errors.medium}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Low</Form.Label>
                    <Form.Control
                      type="number"
                      name="low"
                      value={formData.low}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.low}
                    />
                    <Form.Control.Feedback type="invalid">{errors.low}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              {/* <Button
              variant="primary"
              onClick={handleSubmit}
              style={{ width: '100%' }}
            >
              {editingStatus ? 'Update Status' : 'Add Status'}
            </Button> */}

              <Button
                variant="primary"
                onClick={handlePrevious}
                style={{ backgroundColor: '#000d6b', borderColor: '#000d6b' }}
              >
                Go to Previous
              </Button>

              <Button
                variant="primary"
                onClick={handleNext}
                style={{
                  backgroundColor: '#000d6b',
                  borderColor: '#000d6b',
                  float: 'right', // Align to the right
                }}
              >
                {editingStatus ? 'Update Status' : 'Proceed Next'}
              </Button>

            </Form>
          </div>
        </Card.Body>
      </Card>

      {/* Projects Modal */}
      <Modal show={showProjectsModal} onHide={handleCloseProjectsModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Projects</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Project ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id}>
                  <td>{project.project_name}</td>
                  <td>{project.id}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleViewClick(project.id)}
                    >
                      View Defects
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseProjectsModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Defects Modal */}
      <Modal show={showDefectsModal} onHide={handleCloseDefectsModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Project Defects</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {projectDefects.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Total Defects</th>
                  <th>Defects Closed</th>
                  <th>Open Defects</th>
                  <th>Critical</th>
                  <th>High</th>
                  <th>Medium</th>
                  <th>Low</th>
                  {user_role === 'admin' && <th>Actions</th>} {/* Conditionally render the Actions header */}
                </tr>
              </thead>
              <tbody>
                {projectDefects.map(defect => (
                  <tr key={defect.id}>
                    <td>{formatDate(defect.date)}</td>
                    <td>{defect.total_defect}</td>
                    <td>{defect.defect_closed}</td>
                    <td>{defect.open_defect}</td>
                    <td>{defect.critical}</td>
                    <td>{defect.high}</td>
                    <td>{defect.medium}</td>
                    <td>{defect.low}</td>
                    {user_role === 'admin' && (  // Conditionally render the Actions column for admin
                      <td>
                        <Button
                          variant="outline-warning"
                          onClick={() => handleEditClick(defect)}
                          size="sm" // Smaller button size
                        >
                          ✏️
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={() => handleDelete(defect.id)}
                          size="sm" // Smaller button size
                          style={{ marginLeft: '10px' }}
                        >
                          🗑️
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No defects found for this project.</p>
          )}
        </Modal.Body>



        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDefectsModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default ManageTotalDefectStatus;


