// import React, { useState, useEffect } from 'react';
// import { Form, Button, Card, Modal } from 'react-bootstrap';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const AdminScrumBuzz = () => {
//   const [selectedProject, setSelectedProject] = useState('');
//   const [projects, setProjects] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [defects, setDefects] = useState([]);
//   const [scrums, setScrums] = useState([]); // Scrum details for selected project
//   const [selectedScrum, setSelectedScrum] = useState(''); // Scrum selected by user
//   const [showScrumModal, setShowScrumModal] = useState(false); // Modal to show scrum selection

//   const [user_role, setUserRole] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchUserProjects();
//   }, []);

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
//     } catch (error) {
//       console.error('Error fetching user projects:', error);
//     }
//   };

//   const fetchScrums = async (project_name_id) => {
//     setLoading(true); // Set loading state when scrum details are being fetched
//     const token = sessionStorage.getItem('access_token');
//     try {
//       const response = await axios.get(`https://frt4cnbr-5000.inc1.devtunnels.ms/agile_details/${project_name_id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       setScrums(response.data); // Set the scrum details for the selected project
//       setLoading(false); // Stop loading after fetching scrums
//       console.log(response.data);
//     } catch (error) {
//       console.error('Error fetching scrum details:', error);
//       setLoading(false); // Stop loading even in case of error
//     }
//   };

//   const handleProjectStatusUpdate = () => {
//     if (!selectedProject) {
//       alert('Please select a project to update.');
//       return;
//     }

//     // Store the selected project ID and project name in sessionStorage
//     const selectedProjectData = projects.find(project => project.id === parseInt(selectedProject));
//     if (selectedProjectData) {
//       sessionStorage.setItem('project_name_id', selectedProject);
//       sessionStorage.setItem('projectName', selectedProjectData.project_name); // Store project name in sessionStorage
//     }

//     // Fetch scrum details for the selected project
//     fetchScrums(selectedProject);
//     setShowScrumModal(true); // Show the scrum selection modal
//   };

//   const handleScrumSelection = () => {
//     if (!selectedScrum) {
//       alert('Please select a scrum.');
//       return;
//     }

//     // Store the selected project ID and selected scrum in sessionStorage
//     sessionStorage.setItem('projectId', selectedProject);
//     sessionStorage.setItem('screamId', selectedScrum);
  
//     // Optionally, you can also store the scrum object itself if needed
//     const selectedScrumData = scrums.find((scrum) => scrum.id === parseInt(selectedScrum));
//     if (selectedScrumData) {
//       sessionStorage.setItem('scrumDetails', JSON.stringify(selectedScrumData)); // Store full scrum data
//     }
  
//     // Navigate to the next component
//     navigate('/AdminPanel/ScrumDetails');
//   };

//   return (
//     <div style={{ width: '45%' }}>
//       {loading ? (
//         <p>Loading scrum details...</p>
//       ) : (
//         <div>
//           {projects.length === 0 ? (
//             <p>No projects available.</p>
//           ) : (
//             <Card>
//               <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff' }}>
//                 All Projects
//               </Card.Header>
//               <Card.Body>
//                 <Form>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Project Name</Form.Label>
//                     <Form.Control
//                       as="select"
//                       name="project_name_id"
//                       value={selectedProject}
//                       onChange={(e) => setSelectedProject(e.target.value)}
//                       isInvalid={!!errors.project_name_id}
//                     >
//                       <option value="">Select Project</option>
//                       {projects.map((project) => (
//                         <option key={project.id} value={project.id}>
//                           {project.project_name}
//                         </option>
//                       ))}
//                     </Form.Control>
//                     <Form.Control.Feedback type="invalid">{errors.project_name_id}</Form.Control.Feedback>
//                   </Form.Group>

//                   <br />

//                   <Button
//                     variant="primary"
//                     onClick={handleProjectStatusUpdate}
//                     style={{
//                       fontWeight: 'bold',
//                       color: '#ffffff',
//                       backgroundColor: '#000d6b',
//                       borderColor: '#000d6b',
//                     }}
//                   >
//                     Proceed to update the Status
//                   </Button>
//                 </Form>
//               </Card.Body>
//             </Card>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminScrumBuzz;




import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminScrumBuzz = () => {
  const [selectedProject, setSelectedProject] = useState('');
  const [projects, setProjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [defects, setDefects] = useState([]);
  const [scrums, setScrums] = useState([]); // Scrum details for selected project
  const [selectedScrum, setSelectedScrum] = useState(''); // Scrum selected by user
  const [showScrumModal, setShowScrumModal] = useState(false); // Modal to show scrum selection

  const [user_role, setUserRole] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProjects();
  }, []);

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
    } catch (error) {
      console.error('Error fetching user projects:', error);
    }
  };

  const fetchScrums = async (project_name_id) => {
    setLoading(true); // Set loading state when scrum details are being fetched
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get(`https://frt4cnbr-5000.inc1.devtunnels.ms/agile_details/${project_name_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setScrums(response.data); // Set the scrum details for the selected project
      setLoading(false); // Stop loading after fetching scrums
      console.log(response.data);

      // Proceed to navigate only after the scrums are successfully fetched and set
      if (response.data.length > 0) {
        setShowScrumModal(true); // Show the scrum selection modal
      } else {
        alert('No scrum details available for the selected project.');
      }
    } catch (error) {
      console.error('Error fetching scrum details:', error);
      setLoading(false); // Stop loading even in case of error
    }
  };

  const handleProjectStatusUpdate = () => {
    if (!selectedProject) {
      alert('Please select a project to update.');
      return;
    }

    // Store the selected project ID and project name in sessionStorage
    const selectedProjectData = projects.find(project => project.id === parseInt(selectedProject));
    if (selectedProjectData) {
      sessionStorage.setItem('project_name_id', selectedProject);
      sessionStorage.setItem('projectName', selectedProjectData.project_name); // Store project name in sessionStorage
    }

    // Fetch scrum details for the selected project
    fetchScrums(selectedProject);
  };

  const handleScrumSelection = () => {
    if (!selectedScrum) {
      alert('Please select a scrum.');
      return;
    }

    // Store the selected project ID and selected scrum in sessionStorage
    sessionStorage.setItem('projectId', selectedProject);
    sessionStorage.setItem('screamId', selectedScrum);
  
    // Optionally, you can also store the scrum object itself if needed
    const selectedScrumData = scrums.find((scrum) => scrum.id === parseInt(selectedScrum));
    if (selectedScrumData) {
      sessionStorage.setItem('scrumDetails', JSON.stringify(selectedScrumData)); // Store full scrum data
    }
  
    // Navigate to the next component
    navigate('/AdminPanel/ScrumDetails');
  };

  return (
    <div style={{ width: '45%' }}>
      {loading ? (
        <p>Loading scrum details...</p>
      ) : (
        <div>
          {projects.length === 0 ? (
            <p>No projects available.</p>
          ) : (
            <Card>
              <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff' }}>
                All Projects
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Project Name</Form.Label>
                    <Form.Control
                      as="select"
                      name="project_name_id"
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      isInvalid={!!errors.project_name_id}
                    >
                      <option value="">Select Project</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.project_name}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">{errors.project_name_id}</Form.Control.Feedback>
                  </Form.Group>

                  <br />

                  <Button
                    variant="primary"
                    onClick={handleProjectStatusUpdate}
                    style={{
                      fontWeight: 'bold',
                      color: '#ffffff',
                      backgroundColor: '#000d6b',
                      borderColor: '#000d6b',
                    }}
                  >
                    Proceed to update the Status
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminScrumBuzz;
