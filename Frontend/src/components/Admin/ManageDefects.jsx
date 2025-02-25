// // BASIL

// import React, { useState, useEffect } from 'react';
// import { FaEdit, FaTrashAlt } from 'react-icons/fa';
// import { Button, Table, Form, Card, Row, Col, Modal } from 'react-bootstrap';
// import axios from 'axios';

// const ManageDefects = () => {
//   const [defects, setDefects] = useState([]);
//   const [formData, setFormData] = useState({
//     date: '',
//     regression_defect: '',
//     functional_defect: '',
//     defect_reopened: '',
//     uat_defect: '',
//     project_name_id: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [editingStatus, setEditingStatus] = useState(null);
//   const [editingDefect, setEditingDefect] = useState(null);
//   const [projects, setProjects] = useState([]); // Store projects here
//   const [showModal, setShowModal] = useState(false); // State to control modal visibility
//   const [showDefectsModal, setShowDefectsModal] = useState(false); // Modal for viewing defects
//   const [selectedProjectId, setSelectedProjectId] = useState(null); // Store selected project ID for viewing defects
//   const [showTable, setShowTable] = useState(false); // State to control visibility of the table inside modal
//   const [user_role, setUserRole] = useState(false);

//   useEffect(() => {
//     fetchUserProjects(); // Fetch projects for the logged-in user
//   }, []);

//   useEffect(() => {
//     if (formData.project_name_id) {
//       fetchDefects(formData.project_name_id); // Fetch defects for the selected project
//     }
//   }, [formData.project_name_id]);
  

//   // Fetch defects for the selected project
//   const fetchDefects = async (project_name_id) => {
//     const token = sessionStorage.getItem('access_token');
//     try {
//       const response = await axios.get(`https://frt4cnbr-5000.inc1.devtunnels.ms/new_defects/${project_name_id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       setDefects(response.data);
//     } catch (error) {
//       console.error('Error fetching defects:', error);
//     }
//   };

//   // Fetch projects for the logged-in user 
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
//       console.log("SDFGHJKHGFDS : " , response.data.user_role)
//       setUserRole(response.data.user_role)
//       console.log("projects details : ", response)  // Store the user's projects
//     } catch (error) {
//       console.error('Error fetching user projects:', error);
//     }
//   };

//   const validateForm = () => {
//     const requiredFields = [
//       'date',
//       'regression_defect',
//       'functional_defect',
//       'defect_reopened',
//       'uat_defect',
//       'project_name_id'
//     ];
//     const newErrors = {};
//     requiredFields.forEach(field => {
//       if (!formData[field]) {
//         newErrors[field] = `${field} is required.`;
//       }
//     });
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = e => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;
//     const token = sessionStorage.getItem('access_token');
//     const method = editingDefect ? 'PUT' : 'POST';
//     const url = editingDefect
//       ? `https://frt4cnbr-5000.inc1.devtunnels.ms/new_defects/${editingDefect.id}`
//       : 'https://frt4cnbr-5000.inc1.devtunnels.ms/new_defects';

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
//         alert(editingDefect ? 'Defect updated successfully!' : 'Defect added successfully!');
//         setEditingDefect(null);
//         setFormData({
//           date: '',
//           regression_defect: '',
//           functional_defect: '',
//           defect_reopened: '',
//           uat_defect: '',
//           project_name_id: ''
//         });
//         fetchDefects(formData.project_name_id); // Refresh the defects list after adding or updating
//       } else {
//         alert('Failed to save defect.');
//       }
//     } catch (error) {
//       console.error('Error saving defect:', error);
//     }
//   };

//   const handleDelete = async id => {
//     if (window.confirm('Are you sure you want to delete this defect?')) {
//       const token = sessionStorage.getItem('access_token');
//       try {
//         const response = await axios.delete(`https://frt4cnbr-5000.inc1.devtunnels.ms/new_defects/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         if (response.status === 200) {
//           alert('Defect deleted successfully!');
//           fetchDefects(formData.project_name_id); // Refresh the defects list after deleting
//         } else {
//           alert('Failed to delete defect.');
//         }
//       } catch (error) {
//         console.error('Error deleting defect:', error);
//       }
//     }
//   };

//   const handleEditClick = defect => {
//     setShowDefectsModal(false);
//     setEditingDefect(defect);
//     setFormData({
//       ...defect,
//       date : formatDate(defect.date)
//     });
//   };

//   const handleViewDefects = async (projectId) => {
//     try {
//       const token = sessionStorage.getItem('access_token');
//       const response = await axios.get(`https://frt4cnbr-5000.inc1.devtunnels.ms/new_defects/${projectId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
  
//       if (response.status === 200) {
//         setDefects(response.data); // Set the defects data
//         setSelectedProjectId(projectId); // Set selected project id for viewing defects
//         setShowDefectsModal(true); // Open the defects modal
//         setShowModal(false); // Close the projects modal
//       } else {
//         alert('Failed to fetch defects.');
//       }
//     } catch (error) {
//       console.error('Error fetching defects:', error);
//       alert('Error fetching defects.');
//     }
//   };

//   const handleCloseDefectsModal = () => {
//     setShowDefectsModal(false);
//   };

//   // Function to format date in DD-MM-YYYY format
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0'); // months are zero-indexed
//     const year = date.getFullYear();
//     return `${year}-${month}-${day}`;
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
//             justifyContent: 'space-between', // This ensures the button is positioned to the right
//             alignItems: 'center'
//           }}
//         >
//           Manage Defects
//           <Button
//             variant="outline-light" // You can choose a different variant as needed
//             style={{ marginLeft: 'auto', backgroundColor: 'transparent', borderColor: '#ffffff' }}
//             onClick={() => setShowModal(true)} // When clicked, show the modal with projects
//           >
//             View Projects
//           </Button>
//         </Card.Header>

//         <Card.Body>
//           <Form>
//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Date</Form.Label>
//                   <Form.Control
//                     type="date"
//                     name="date"
//                     value={formData.date ? formData.date : ''}
//                     onChange={handleChange}
//                     isInvalid={!!errors.date}
//                     disabled={editingDefect}
//                     max={new Date().toISOString().split('T')[0]} // This will set today's date as the max date
//                   />
//                   <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label>Regression Defect</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="regression_defect"
//                     value={formData.regression_defect}
//                     onChange={handleChange}
//                     isInvalid={!!errors.regression_defect}
//                   />
//                   <Form.Control.Feedback type="invalid">{errors.regression_defect}</Form.Control.Feedback>
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label>Defect Reopened</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="defect_reopened"
//                     value={formData.defect_reopened}
//                     onChange={handleChange}
//                     isInvalid={!!errors.defect_reopened}
//                   />
//                   <Form.Control.Feedback type="invalid">{errors.defect_reopened}</Form.Control.Feedback>
//                 </Form.Group>
//               </Col>

//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Functional Defect</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="functional_defect"
//                     value={formData.functional_defect}
//                     onChange={handleChange}
//                     isInvalid={!!errors.functional_defect}
//                   />
//                   <Form.Control.Feedback type="invalid">{errors.functional_defect}</Form.Control.Feedback>
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label>UAT Defect</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="uat_defect"
//                     value={formData.uat_defect}
//                     onChange={handleChange}
//                     isInvalid={!!errors.uat_defect}
//                   />
//                   <Form.Control.Feedback type="invalid">{errors.uat_defect}</Form.Control.Feedback>
//                 </Form.Group>
//                 {!editingDefect && (
//                 <Form.Group className="mb-3">
//                   <Form.Label>Project Name ID</Form.Label>
//                   <Form.Control
//                     as="select"
//                     name="project_name_id"
//                     value={formData.project_name_id}
//                     onChange={handleChange}
//                     isInvalid={!!errors.project_name_id}
//                   >
//                     <option value="">Select Project</option>
//                     {projects.map(project => (
//                       <option key={project.id} value={project.project_name_id}>
//                         {project.project_name}
//                       </option>
//                     ))}
//                   </Form.Control>
//                   <Form.Control.Feedback type="invalid">{errors.project_name_id}</Form.Control.Feedback>
//                 </Form.Group>
//                 )}
//               </Col>
//             </Row>

//             <Button
//               variant="primary"
//               onClick={handleSubmit}
//               style={{ backgroundColor: '#000d6b', borderColor: '#000d6b' }}
//             >
//               {editingDefect ? 'Update Defect' : 'Add Defect'}
//             </Button>
//           </Form>
//         </Card.Body>
//       </Card>

//       {/* Modal for displaying the projects */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Projects</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Table striped bordered hover responsive>
//             <thead>
//               <tr>
//                 <th>Project Name</th>
//                 <th>Project ID</th>
//                 <th>Actions</th> {/* Added a new column for actions */}
//               </tr>
//             </thead>
//             <tbody>
//               {projects.map(project => (
//                 <tr key={project.id}>
//                   <td>{project.project_name}</td>
//                   <td>{project.id}</td>
//                   <td>
//                     <Button
//                       variant="primary"
//                       onClick={() => handleViewDefects(project.id)} // When clicked, fetch defects for the project
//                     >
//                       View Defects
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Modal.Body>
//       </Modal>

//       {/* Modal for displaying defects */}
//       <Modal show={showDefectsModal} onHide={handleCloseDefectsModal} size="lg" centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Defects for Project {selectedProjectId}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Table striped bordered hover responsive>
//             <thead>
//               <tr>
//                 <th>Date</th>
//                 <th>Regression Defect</th>
//                 <th>Functional Defect</th>
//                 <th>Defect Reopened</th>
//                 <th>UAT Defect</th>
//                 {user_role === 'admin' && <th>actions</th>}
//               </tr>
//             </thead>
//             <tbody>
//               {defects.map(defect => (
//                 <tr key={defect.id}>
//                   <td>{formatDate(defect.date)}</td>
//                   <td>{defect.regression_defect}</td>
//                   <td>{defect.functional_defect}</td>
//                   <td>{defect.defect_reopened}</td>
//                   <td>{defect.uat_defect}</td>
//                   {user_role === 'admin' && (  // Conditionally render the Actions column for admin
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
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default ManageDefects;



// MY CODE 

import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Button, Table, Form, Card, Row, Col, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory


const ManageDefects = () => {
  const [defects, setDefects] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    regression_defect: '',
    functional_defect: '',
    defect_reopened: '',
    uat_defect: '',
    project_name_id: ''
  });
  const [errors, setErrors] = useState({});
  const [editingStatus, setEditingStatus] = useState(null);
  const [editingDefect, setEditingDefect] = useState(null);
  const [projects, setProjects] = useState([]); // Store projects here
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [showDefectsModal, setShowDefectsModal] = useState(false); // Modal for viewing defects
  const [selectedProjectId, setSelectedProjectId] = useState(null); // Store selected project ID for viewing defects
  const [showTable, setShowTable] = useState(false); // State to control visibility of the table inside modal
  const [user_role, setUserRole] = useState(false);




  const [selectedProject, setSelectedProject] = useState(''); // Store selected project ID or name
  const [projectName, setProjectName] = useState(''); // Store project name from sessionStorage
  const [showCreateDetails, setShowCreateDetails] = useState(false); // Track whether to show create details





  const [showForm, setShowForm] = useState(true);
  const [loading, setLoading] = useState(false);




  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    fetchUserProjects(); // Fetch projects for the logged-in user


    // Check if there's data in localStorage for manageDefect
    const storedData = localStorage.getItem('manageDefect');
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
  }, []); // Run once when component mounts


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  // Fetch defects for the selected project
  const fetchDefects = async (project_name_id) => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get(`https://frt4cnbr-5000.inc1.devtunnels.ms/new_defects/${project_name_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setDefects(response.data);
    } catch (error) {
      console.error('Error fetching defects:', error);
    }
  };

  // Fetch projects for the logged-in user 
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
      // console.log("SDFGHJKHGFDS : " , response.data.user_role)
      setUserRole(response.data.user_role)
      // console.log("projects details : ", response)  // Store the user's projects
    } catch (error) {
      console.error('Error fetching user projects:', error);
    }
  };

  const validateForm = () => {
    const requiredFields = [
      'date',
      'regression_defect',
      'functional_defect',
      'defect_reopened',
      'uat_defect',
      // 'project_name_id'
    ];
    const newErrors = {};
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field} is required.`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async () => {
    if (!validateForm()) return;
    const token = sessionStorage.getItem('access_token');
    const method = editingDefect ? 'PUT' : 'POST';
    const url = editingDefect
      ? `https://frt4cnbr-5000.inc1.devtunnels.ms/new_defects/${editingDefect.id}`
      : 'https://frt4cnbr-5000.inc1.devtunnels.ms/new_defects';

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
        alert(editingDefect ? 'Defect updated successfully!' : 'Defect added successfully!');
        setEditingDefect(null);
        setFormData({
          date: '',
          regression_defect: '',
          functional_defect: '',
          defect_reopened: '',
          uat_defect: '',
          project_name_id: ''
        });
        fetchDefects(formData.project_name_id); // Refresh the defects list after adding or updating
      } else {
        alert('Failed to save defect.');
      }
    } catch (error) {
      console.error('Error saving defect:', error);
    }
  };

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this defect?')) {
      const token = sessionStorage.getItem('access_token');
      try {
        const response = await axios.delete(`https://frt4cnbr-5000.inc1.devtunnels.ms/new_defects/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          alert('Defect deleted successfully!');
          fetchDefects(formData.project_name_id); // Refresh the defects list after deleting
        } else {
          alert('Failed to delete defect.');
        }
      } catch (error) {
        console.error('Error deleting defect:', error);
      }
    }
  };

  const handleEditClick = defect => {
    setShowDefectsModal(false);
    setEditingDefect(defect);
    setFormData({
      ...defect,
      date: formatDate(defect.date)
    });
  };

  const handleViewDefects = async (projectId) => {
    try {
      const token = sessionStorage.getItem('access_token');
      const response = await axios.get(`https://frt4cnbr-5000.inc1.devtunnels.ms/new_defects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setDefects(response.data); // Set the defects data
        setSelectedProjectId(projectId); // Set selected project id for viewing defects
        setShowDefectsModal(true); // Open the defects modal
        setShowModal(false); // Close the projects modal
      } else {
        alert('Failed to fetch defects.');
      }
    } catch (error) {
      console.error('Error fetching defects:', error);
      alert('Error fetching defects.');
    }
  };

  const handleCloseDefectsModal = () => {
    setShowDefectsModal(false);
  };

  // Function to format date in DD-MM-YYYY format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are zero-indexed
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
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
    localStorage.setItem('manageDefect', JSON.stringify(formData));

    // Navigate to the next component
    navigate('/AdminPanel/ManageTestExecutionStatus');
    // window.location.reload();
  };







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

      {/* Create Project Status Form */}

      <Card>
        <Card.Header
          as="h5"
          style={{
            backgroundColor: '#000d6b',
            color: '#ffffff',
            borderRadius: '10px 10px 0 0',
            display: 'flex',
            justifyContent: 'space-between', // This ensures the button is positioned to the right
            alignItems: 'center'
          }}
        >
          Manage Defects
          <Button
            variant="outline-light" // You can choose a different variant as needed
            style={{ marginLeft: 'auto', backgroundColor: 'transparent', borderColor: '#ffffff' }}
            onClick={() => setShowModal(true)} // When clicked, show the modal with projects
          >
            View Projects
          </Button>
        </Card.Header>

        <Card.Body>
          <Form>
            <Row>
              <Col md={6}>
                {/* Date */}
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.date}
                    disabled={editingDefect}
                    max={new Date().toISOString().split('T')[0]} // Max date today
                  />
                  <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                </Form.Group>

                {/* Regression Defect */}
                <Form.Group className="mb-3">
                  <Form.Label>Regression Defect</Form.Label>
                  <Form.Control
                    type="number"
                    name="regression_defect"
                    value={formData.regression_defect}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.regression_defect}
                  />
                  <Form.Control.Feedback type="invalid">{errors.regression_defect}</Form.Control.Feedback>
                </Form.Group>

                {/* Defect Reopened */}
                <Form.Group className="mb-3">
                  <Form.Label>Defect Reopened</Form.Label>
                  <Form.Control
                    type="number"
                    name="defect_reopened"
                    value={formData.defect_reopened}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.defect_reopened}
                  />
                  <Form.Control.Feedback type="invalid">{errors.defect_reopened}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                {/* Functional Defect */}
                <Form.Group className="mb-3">
                  <Form.Label>Functional Defect</Form.Label>
                  <Form.Control
                    type="number"
                    name="functional_defect"
                    value={formData.functional_defect}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.functional_defect}
                  />
                  <Form.Control.Feedback type="invalid">{errors.functional_defect}</Form.Control.Feedback>
                </Form.Group>

                {/* UAT Defect */}
                <Form.Group className="mb-3">
                  <Form.Label>UAT Defect</Form.Label>
                  <Form.Control
                    type="number"
                    name="uat_defect"
                    value={formData.uat_defect}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.uat_defect}
                  />
                  <Form.Control.Feedback type="invalid">{errors.uat_defect}</Form.Control.Feedback>
                </Form.Group>

                {/* Auto-select project name from sessionStorage and disable it */}
                <Form.Group controlId="project_name_id">
                  <Form.Label>Project Name:</Form.Label>

                  <Form.Control
                    type="text"
                    value={sessionStorage.getItem('selectedProject') || projectName} // Retrieve from sessionStorage if available
                    onChange={handleChange}
                    onBlur={handleBlur}
                    readOnly // Make the input read-only
                  />
                </Form.Group>




              </Col>
            </Row>

            <Button
              variant="primary"
              onClick={handleNext}
              style={{ backgroundColor: '#000d6b', borderColor: '#000d6b' }}
            >
              {editingDefect ? 'Update Defect' : 'Proceed Next'}
            </Button>
          </Form>
        </Card.Body>
      </Card>


      {/* Modal for displaying the projects */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Projects</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Project ID</th>
                <th>Actions</th> {/* Added a new column for actions */}
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id}>
                  <td>{project.project_name}</td>
                  <td>{project.id}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleViewDefects(project.id)} // When clicked, fetch defects for the project
                    >
                      View Defects
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      {/* Modal for displaying defects */}
      <Modal show={showDefectsModal} onHide={handleCloseDefectsModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Defects for Project {selectedProjectId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>Regression Defect</th>
                <th>Functional Defect</th>
                <th>Defect Reopened</th>
                <th>UAT Defect</th>
                {user_role === 'admin' && <th>actions</th>}
              </tr>
            </thead>
            <tbody>
              {defects.map(defect => (
                <tr key={defect.id}>
                  <td>{formatDate(defect.date)}</td>
                  <td>{defect.regression_defect}</td>
                  <td>{defect.functional_defect}</td>
                  <td>{defect.defect_reopened}</td>
                  <td>{defect.uat_defect}</td>
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
        </Modal.Body>
      </Modal>
    </div>




  );
};

export default ManageDefects;

