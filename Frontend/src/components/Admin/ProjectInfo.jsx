// import React, { useState, useEffect } from 'react';
// import { Card, Table, Button, Form, Modal } from 'react-bootstrap';

// const ProjectTable = () => {
//   const [projects, setProjects] = useState([]);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   // Fetch project data from the API
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const response = await fetch('https://frt4cnbr-5000.inc1.devtunnels.ms/project-details', {
//           headers: {
//             'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
//           }
//         });tru
//         const data = await response.json();
//         setProjects(data.project_details);
//       } catch (error) {
//         console.error('Error fetching projects:', error);
//       }
//     };
//     fetchProjects();
//   }, []);

//   // Handle form submission to update the project
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const form = e.target;

//     const updatedProject = {
//       project_name: form.project_name.value,
//       rag: form.rag.value,
//       tester_count: form.tester_count.value,
//       billable: form.billable.value,
//       nonbillable: form.nonbillable.value,
//       billing_type: form.billing_type.value,
//       automation: form.automation.value,
//       ai_used: form.ai_used.value,
//     };

//     // Update the project (you may want to send this to the API)
//     console.log('Updated Project:', updatedProject);

//     // Update state with the new project details
//     setProjects(prevProjects =>
//       prevProjects.map(project =>
//         project.id === selectedProject.id ? { ...project, ...updatedProject } : project
//       )
//     );

//     // Close the modal after saving
//     setShowModal(false);
//     setSelectedProject(null); // Close the form after saving
//   };

//   // Handle editing a project
//   const handleEdit = (project) => {
//     setSelectedProject(project);
//     setShowModal(true); // Show the modal when "Edit" is clicked
//   };

//   // Close the modal
//   const handleCancel = () => {
//     setShowModal(false);
//     setSelectedProject(null);
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

//   return (
//     <>
//       {/* Project Table */}
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
//                   {/* <th>Actions</th> */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {projects.map((project) => (
//                   <tr key={project.id}>
//                     <td>{project.project_name}</td>
//                     <td>{project.rag}</td>
//                     <td>{project.tester_count}</td>
//                     <td>{project.billable.length}</td> {/* Show length of billable array */}
//                     <td>{project.nonbillable.length}</td> {/* Show length of nonbillable array */}
//                     <td>{project.billing_type}</td>
//                     <td>{project.automation ? 'true' : 'false'}</td> {/* Display true or false */}
//                     <td>{project.ai_used ? 'true' : 'false'}</td> {/* Display true or false */}
//                     {/* <td>
//                       <Button variant="warning" onClick={() => handleEdit(project)}>
//                         Edit
//                       </Button>
//                     </td> */}
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* Project Details Modal (Edit or Create) */}
//       <Modal show={showModal} onHide={handleCancel} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Project Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
//           {selectedProject && (
//             <Form onSubmit={handleSubmit}>
//               <Form.Group controlId="project_name">
//                 <Form.Label>Project Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   defaultValue={selectedProject.project_name}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group controlId="rag">
//                 <Form.Label>rag</Form.Label>
//                 <Form.Control
//                   type="text"
//                   defaultValue={selectedProject.rag}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group controlId="tester_count">
//                 <Form.Label>Tester Count</Form.Label>
//                 <Form.Control
//                   type="number"
//                   defaultValue={selectedProject.tester_count}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group controlId="billable">
//                 <Form.Label>Billable</Form.Label>
//                 <Form.Control
//                   type="text"
//                   defaultValue={selectedProject.billable.join(', ')}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group controlId="nonbillable">
//                 <Form.Label>Non-Billable</Form.Label>
//                 <Form.Control
//                   type="text"
//                   defaultValue={selectedProject.nonbillable.join(', ')}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group controlId="billing_type">
//                 <Form.Label>Billing Type</Form.Label>
//                 <Form.Control
//                   type="text"
//                   defaultValue={selectedProject.billing_type}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group controlId="automation">
//                 <Form.Label>Automation</Form.Label>
//                 <Form.Control
//                   type="text"
//                   defaultValue={selectedProject.automation}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group controlId="ai_used">
//                 <Form.Label>AI</Form.Label>
//                 <Form.Control
//                   type="text"
//                   defaultValue={selectedProject.ai_used}
//                   required
//                 />
//               </Form.Group>
//               <Button
//                 variant="primary"
//                 type="submit"
//                 style={{
//                   fontWeight: 'bold',
//                   color: '#ffffff',
//                   backgroundColor: '#000d6b',
//                   borderColor: '#000d6b',
//                   marginTop: '10px', // Adds Top margin
//                   marginBottom: '10px', // Adds bottom margin
//                 }}
//               >
//                 Update Project
//               </Button>
//               <Button
//                 variant="secondary"
//                 onClick={handleCancel}
//                 style={{
//                   marginLeft: '10px', // Adds left margin
//                   marginTop: '10px', // Adds Top margin
//                   marginBottom: '10px', // Adds bottom margin
//                 }}
//               >
//                 Cancel
//               </Button>
//             </Form>
//           )}
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// };

// export default ProjectTable;


// import React, { useState, useEffect } from 'react';
// import { Card, Table, Button, Form, Modal } from 'react-bootstrap';

// const ProjectTable = () => {
//   const [projects, setProjects] = useState([]);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   // Fetch project data from the API
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const response = await fetch('https://frt4cnbr-5000.inc1.devtunnels.ms/project-details', {
//           headers: {
//             'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
//           }
//         });
//         const data = await response.json();
//         setProjects(data.project_details);
//       } catch (error) {
//         console.error('Error fetching projects:', error);
//       }
//     };
//     fetchProjects();
//   }, []);

//   // Handle form submission to update the project
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const form = e.target;

//     const updatedProject = {
//       project_name: form.project_name.value,
//       rag: form.rag.value,
//       tester_count: form.tester_count.value,
//       billable: form.billable.value,
//       nonbillable: form.nonbillable.value,
//       billing_type: form.billing_type.value,
//       automation: form.automation.value,
//       ai_used: form.ai_used.value,
//     };

//     // Update the project (you may want to send this to the API)
//     console.log('Updated Project:', updatedProject);

//     // Update state with the new project details
//     setProjects(prevProjects =>
//       prevProjects.map(project =>
//         project.id === selectedProject.id ? { ...project, ...updatedProject } : project
//       )
//     );

//     // Close the modal after saving
//     setShowModal(false);
//     setSelectedProject(null); // Close the form after saving
//   };

//   // Handle editing a project
//   const handleEdit = (project) => {
//     setSelectedProject(project);
//     setShowModal(true); // Show the modal when "Edit" is clicked
//   };

//   // Close the modal
//   const handleCancel = () => {
//     setShowModal(false);
//     setSelectedProject(null);
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

//   return (
//     <>
//       {/* Project Table */}
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
//                   {/* <th>Actions</th> */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {projects.map((project) => (
//                   <tr key={project.id}>
//                     <td>{project.project_name}</td>
//                     <td>{project.rag}</td>
//                     <td>{project.tester_count}</td>
//                     <td>{project.billable.length}</td> {/* Show length of billable array */}
//                     <td>{project.nonbillable.length}</td> {/* Show length of nonbillable array */}
//                     <td>{project.billing_type}</td>
//                     <td>{project.automation ? 'true' : 'false'}</td> {/* Display true or false */}
//                     <td>{project.ai_used ? 'true' : 'false'}</td> {/* Display true or false */}
//                     {/* <td>
//                       <Button variant="warning" onClick={() => handleEdit(project)}>
//                         Edit
//                       </Button>
//                     </td> */}
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* Project Details Modal (Edit or Create) */}
//       <Modal show={showModal} onHide={handleCancel} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Project Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
//           {selectedProject && (
//             <Form onSubmit={handleSubmit}>
//               <Form.Group controlId="project_name">
//                 <Form.Label>Project Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   defaultValue={selectedProject.project_name}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group controlId="rag">
//                 <Form.Label>rag</Form.Label>
//                 <Form.Control
//                   type="text"
//                   defaultValue={selectedProject.rag}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group controlId="tester_count">
//                 <Form.Label>Tester Count</Form.Label>
//                 <Form.Control
//                   type="number"
//                   defaultValue={selectedProject.tester_count}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group controlId="billable">
//                 <Form.Label>Billable</Form.Label>
//                 <Form.Control
//                   type="text"
//                   defaultValue={selectedProject.billable.join(', ')}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group controlId="nonbillable">
//                 <Form.Label>Non-Billable</Form.Label>
//                 <Form.Control
//                   type="text"
//                   defaultValue={selectedProject.nonbillable.join(', ')}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group controlId="billing_type">
//                 <Form.Label>Billing Type</Form.Label>
//                 <Form.Control
//                   type="text"
//                   defaultValue={selectedProject.billing_type}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group controlId="automation">
//                 <Form.Label>Automation</Form.Label>
//                 <Form.Control
//                   type="text"
//                   defaultValue={selectedProject.automation}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group controlId="ai_used">
//                 <Form.Label>AI</Form.Label>
//                 <Form.Control
//                   type="text"
//                   defaultValue={selectedProject.ai_used}
//                   required
//                 />
//               </Form.Group>
//               <Button
//                 variant="primary"
//                 type="submit"
//                 style={{
//                   fontWeight: 'bold',
//                   color: '#ffffff',
//                   backgroundColor: '#000d6b',
//                   borderColor: '#000d6b',
//                   marginTop: '10px', // Adds Top margin
//                   marginBottom: '10px', // Adds bottom margin
//                 }}
//               >
//                 Update Project
//               </Button>
//               <Button
//                 variant="secondary"
//                 onClick={handleCancel}
//                 style={{
//                   marginLeft: '10px', // Adds left margin
//                   marginTop: '10px', // Adds Top margin
//                   marginBottom: '10px', // Adds bottom margin
//                 }}
//               >
//                 Cancel
//               </Button>
//             </Form>
//           )}
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// };

// export default ProjectTable;




import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal } from 'react-bootstrap';
import AddProject from './AddProject'; // Import the ProjectForm component

// SVG Imports
import addproject from "../panel/assets/addprojectwhite.svg";

const ProjectTable = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Fetch project data from the API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://frt4cnbr-5000.inc1.devtunnels.ms/project-details', {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
          }
        });
        const data = await response.json();
        setProjects(data.project_details);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  // Handle adding or editing the project
  const handleProjectSubmit = (updatedProject) => {
    if (isEditMode) {
      // Update the project (you may want to send this to the API)
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project.id === selectedProject.id ? { ...project, ...updatedProject } : project
        )
      );
    } else {
      // Add the new project (you may want to send this to the API)
      setProjects([...projects, updatedProject]);
    }

    // Close the modal after saving
    setShowModal(false);
    setSelectedProject(null);
    setIsEditMode(false);
  };

  // Open the modal to add a new project
  const handleAddProject = () => {
    setShowForm(true);
    setSelectedProject(null); // No project selected for adding
    setIsEditMode(false); // Set to Add mode
    setShowModal(true);
  };

  // Open the modal to edit an existing project
  const handleEditProject = (project) => {
    setSelectedProject(project); // Set the selected project to edit
    setIsEditMode(true); // Set to Edit mode
    setShowModal(true);
  };

  // Close the modal
  const handleCancel = () => {
    setShowModal(false);
    setSelectedProject(null);
    setIsEditMode(false);
  };

  return (
    <>
      {/* Add New Project Button */}
      <Button
  variant="primary"
  onClick={handleAddProject}
  style={{
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#000d6b',
    borderColor: '#000d6b',
    marginBottom: '20px',
    display: 'flex',         // Aligns the icon and text horizontally
    alignItems: 'center',    // Centers the icon and text vertically
  }}
>
  <img
    src={addproject}
    alt="Add a new project"  // More descriptive alt text for accessibility
    style={{ width: '20px', height: '20px', marginRight: '8px' }}  // Adds space between the icon and text
  />
  Add New or Update
</Button>


      {/* Project Table */}
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
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.project_name}</td>
                    <td>{project.rag}</td>
                    <td>{project.tester_count}</td>
                    <td>{project.billable.length}</td> {/* Show length of billable array */}
                    <td>{project.nonbillable.length}</td> {/* Show length of nonbillable array */}
                    <td>{project.billing_type}</td>
                    <td>{project.automation.length ? project.automation : "No Details" }</td> {/* Display true or false */}
                    <td>{project.ai_used.length ? project.ai_used : "No Details" }</td> {/* Display true or false */}
                    {/* <td>
                      <Button variant="warning" onClick={() => handleEditProject(project)}>
                        Edit
                      </Button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Project Form Modal (Add/Edit) */}
      <Modal show={showModal} onHide={handleCancel} size="lg">
        <Modal.Header closeButton>
          {/* <Modal.Title>{isEditMode ? 'Edit Project' : 'Add New Project'}</Modal.Title> */}
          <Modal.Title> <b>Add New Project or Update the Existing Project Details</b></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddProject
            project={selectedProject}
            onSubmit={handleProjectSubmit}
            onCancel={handleCancel}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProjectTable;
