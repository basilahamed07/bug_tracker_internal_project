// import React, { useState } from 'react';
// import { Card, Form, Button } from 'react-bootstrap'; // Import necessary components
// import { FaEdit } from 'react-icons/fa'; // Import FaEdit for icon
// import AddProject from './AddProject';

// const CreateProjectDetails = () => {
//   const [formData, setFormData] = useState({
//     project_name_id: '',
//     rag: '',
//     tester_count: '',
//     billable: '',
//     nonbillable: '',
//     billing_type: '',
//     rag_details: '',
//     automation: false,
//     ai_used: false,
//   });
  
//   const [errors, setErrors] = useState({});
//   const [isPending, setIsPending] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isProjectAdded, setIsProjectAdded] = useState(false); // Track if project is added

//   // Handle form field change
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsPending(true);
//     setErrorMessage('');
//     setSuccessMessage('');

//     // Basic form validation
//     const requiredFields = [
//       'project_name_id', 'rag', 'tester_count', 'billable', 'nonbillable', 'billing_type', 'rag_details',
//     ];
//     let newErrors = {};
//     requiredFields.forEach((field) => {
//       if (!formData[field]) {
//         newErrors[field] = `${field.replace('_', ' ')} is required.`;
//       }
//     });

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       setIsPending(false);
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:5000/create-project-details', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming JWT is stored in localStorage
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setSuccessMessage('Project details created successfully!');
//         setIsProjectAdded(true); // Mark project as added
//         setFormData({
//           project_name_id: '',
//           rag: '',
//           tester_count: '',
//           billable: '',
//           nonbillable: '',
//           billing_type: '',
//           rag_details: '',
//           automation: false,
//           ai_used: false,
//         });
//       } else {
//         setErrorMessage(data.error || 'Something went wrong!');
//       }
//     } catch (error) {
//       setErrorMessage(error.message || 'Network error occurred');
//     } finally {
//       setIsPending(false);
//     }
//   };

//   return (
//     <div className="mt-5">
//       {/* Show Add Project button initially */}
//       {!isProjectAdded ? (
//         <AddProject />
//       ) : (
//         <>
//           <br />
//           <Card>
//             <Card.Header
//               as="h5"
//               style={{
//                 backgroundColor: '#000d6b',
//                 color: '#ffffff',
//                 borderRadius: '10px 10px 0 0',
//               }}
//             >
//               Add Project Details
//             </Card.Header>
//             <Card.Body
//               style={{
//                 maxHeight: '500px',
//                 overflowY: 'auto',
//               }}
//             >
//               {/* Success and Error Messages */}
//               {successMessage && <p className="text-success">{successMessage}</p>}
//               {errorMessage && <p className="text-danger">{errorMessage}</p>}

//               <Form onSubmit={handleSubmit}>
//                 {/* Project Name */}
//                 <Form.Group className="mb-3">
//                   <Form.Label htmlFor="project_name_id">Project Name ID</Form.Label>
//                   <Form.Control
//                     type="text"
//                     id="project_name_id"
//                     name="project_name_id"
//                     value={formData.project_name_id}
//                     onChange={handleChange}
//                     placeholder="Enter project name ID"
//                     isInvalid={!!errors.project_name_id}
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.project_name_id}
//                   </Form.Control.Feedback>
//                 </Form.Group>

//                 {/* rag */}
//                 <Form.Group className="mb-3">
//                   <Form.Label htmlFor="rag">rag</Form.Label>
//                   <Form.Control
//                     type="text"
//                     id="rag"
//                     name="rag"
//                     value={formData.rag}
//                     onChange={handleChange}
//                     placeholder="Enter rag status"
//                     isInvalid={!!errors.rag}
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.rag}
//                   </Form.Control.Feedback>
//                 </Form.Group>

//                 {/* Tester Count */}
//                 <Form.Group className="mb-3">
//                   <Form.Label htmlFor="tester_count">Tester Count</Form.Label>
//                   <Form.Control
//                     type="number"
//                     id="tester_count"
//                     name="tester_count"
//                     value={formData.tester_count}
//                     onChange={handleChange}
//                     placeholder="Enter tester count"
//                     isInvalid={!!errors.tester_count}
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.tester_count}
//                   </Form.Control.Feedback>
//                 </Form.Group>

//                 {/* Billable */}
//                 <Form.Group className="mb-3">
//                   <Form.Label htmlFor="billable">Billable</Form.Label>
//                   <Form.Control
//                     type="number"
//                     id="billable"
//                     name="billable"
//                     value={formData.billable}
//                     onChange={handleChange}
//                     placeholder="Enter billable hours"
//                     isInvalid={!!errors.billable}
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.billable}
//                   </Form.Control.Feedback>
//                 </Form.Group>

//                 {/* Nonbillable */}
//                 <Form.Group className="mb-3">
//                   <Form.Label htmlFor="nonbillable">Nonbillable</Form.Label>
//                   <Form.Control
//                     type="number"
//                     id="nonbillable"
//                     name="nonbillable"
//                     value={formData.nonbillable}
//                     onChange={handleChange}
//                     placeholder="Enter nonbillable hours"
//                     isInvalid={!!errors.nonbillable}
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.nonbillable}
//                   </Form.Control.Feedback>
//                 </Form.Group>

//                 {/* Billing Type */}
//                 <Form.Group className="mb-3">
//                   <Form.Label htmlFor="billing_type">Billing Type</Form.Label>
//                   <Form.Control
//                     type="text"
//                     id="billing_type"
//                     name="billing_type"
//                     value={formData.billing_type}
//                     onChange={handleChange}
//                     placeholder="Enter billing type"
//                     isInvalid={!!errors.billing_type}
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.billing_type}
//                   </Form.Control.Feedback>
//                 </Form.Group>

//                 {/* rag Details */}
//                 <Form.Group className="mb-3">
//                   <Form.Label htmlFor="rag_details">rag Details</Form.Label>
//                   <Form.Control
//                     type="text"
//                     id="rag_details"
//                     name="rag_details"
//                     value={formData.rag_details}
//                     onChange={handleChange}
//                     placeholder="Enter rag details"
//                     isInvalid={!!errors.rag_details}
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.rag_details}
//                   </Form.Control.Feedback>
//                 </Form.Group>

//                 {/* Automation Checkbox */}
//                 <Form.Group className="mb-3">
//                   <Form.Check
//                     type="checkbox"
//                     id="automation"
//                     name="automation"
//                     label="Automation"
//                     checked={formData.automation}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>

//                 {/* AI Used Checkbox */}
//                 <Form.Group className="mb-3">
//                   <Form.Check
//                     type="checkbox"
//                     id="ai_used"
//                     name="ai_used"
//                     label="AI Used"
//                     checked={formData.ai_used}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>

//                 {/* Submit Button */}
//                 <Button
//                   variant="primary"
//                   type="submit"
//                   disabled={isPending}
//                   style={{
//                     backgroundColor: '#000d6b',
//                     borderColor: '#000d6b',
//                     display: 'block',
//                     marginTop: '1rem',
//                   }}
//                 >
//                   {isPending ? 'Submitting...' : 'Create Project Details'}
//                 </Button>
//               </Form>
//             </Card.Body>
//           </Card>
//         </>
//       )}
//     </div>
//   );
// };

// export default CreateProjectDetails




import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Modal } from 'react-bootstrap';
import AddProject from './AddProject';

const CreateProjectDetails = ({ projectNameFromParent }) => {
  const [formData, setFormData] = useState({
    project_name_id: projectNameFromParent || '', // Pre-fill project name from parent
    rag: '',
    tester_count: '',
    billable: '',
    nonbillable: '',
    billing_type: '',
    rag_details: '',
    automation: false,
    ai_used: false,
  });

  const [errors, setErrors] = useState({});
  const [isPending, setIsPending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false); // To control modal visibility

  // Effect to update formData when the prop changes (if necessary)
  useEffect(() => {
    setFormData(prevData => ({
      ...prevData,
      project_name_id: projectNameFromParent || prevData.project_name_id,
    }));
  }, [projectNameFromParent]);

  // Handle form field change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Basic form validation
    const requiredFields = [
      'project_name_id', 'rag', 'tester_count', 'billable', 'nonbillable', 'billing_type', 'rag_details',
    ];
    let newErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace('_', ' ')} is required.`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsPending(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/create-project-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming JWT is stored in localStorage
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('Project details created successfully!');
        setShowModal(true); // Show the modal with project details form
        setFormData({
          project_name_id: '',
          rag: '',
          tester_count: '',
          billable: '',
          nonbillable: '',
          billing_type: '',
          rag_details: '',
          automation: false,
          ai_used: false,
        });
      } else {
        setErrorMessage(data.error || 'Something went wrong!');
      }
    } catch (error) {
      setErrorMessage(error.message || 'Network error occurred');
    } finally {
      setIsPending(false);
    }
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="mt-5">
      {/* Initially show AddProject component */} 
      {/* <AddProject /> */}

      {/* Success and Error Messages */}
      {successMessage && <p className="text-success">{successMessage}</p>}
      {errorMessage && <p className="text-danger">{errorMessage}</p>}

      {/* Modal for Project Details Form */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Project Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Project Name */}
            <Form.Group className="mb-3">
              <Form.Label htmlFor="project_name_id">Project Name ID</Form.Label>
              <Form.Control
                type="text"
                id="project_name_id"
                name="project_name_id"
                value={formData.project_name_id}
                onChange={handleChange}
                placeholder="Enter project name ID"
                isInvalid={!!errors.project_name_id}
              />
              <Form.Control.Feedback type="invalid">
                {errors.project_name_id}
              </Form.Control.Feedback>
            </Form.Group>

            {/* rag */}
            <Form.Group className="mb-3">
              <Form.Label htmlFor="rag">rag</Form.Label>
              <Form.Control
                type="text"
                id="rag"
                name="rag"
                value={formData.rag}
                onChange={handleChange}
                placeholder="Enter rag status"
                isInvalid={!!errors.rag}
              />
              <Form.Control.Feedback type="invalid">
                {errors.rag}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Tester Count */}
            <Form.Group className="mb-3">
              <Form.Label htmlFor="tester_count">Tester Count</Form.Label>
              <Form.Control
                type="number"
                id="tester_count"
                name="tester_count"
                value={formData.tester_count}
                onChange={handleChange}
                placeholder="Enter tester count"
                isInvalid={!!errors.tester_count}
              />
              <Form.Control.Feedback type="invalid">
                {errors.tester_count}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Billable */}
            <Form.Group className="mb-3">
              <Form.Label htmlFor="billable">Billable</Form.Label>
              <Form.Control
                type="number"
                id="billable"
                name="billable"
                value={formData.billable}
                onChange={handleChange}
                placeholder="Enter billable hours"
                isInvalid={!!errors.billable}
              />
              <Form.Control.Feedback type="invalid">
                {errors.billable}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Nonbillable */}
            <Form.Group className="mb-3">
              <Form.Label htmlFor="nonbillable">Nonbillable</Form.Label>
              <Form.Control
                type="number"
                id="nonbillable"
                name="nonbillable"
                value={formData.nonbillable}
                onChange={handleChange}
                placeholder="Enter nonbillable hours"
                isInvalid={!!errors.nonbillable}
              />
              <Form.Control.Feedback type="invalid">
                {errors.nonbillable}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Billing Type */}
            <Form.Group className="mb-3">
              <Form.Label htmlFor="billing_type">Billing Type</Form.Label>
              <Form.Control
                type="text"
                id="billing_type"
                name="billing_type"
                value={formData.billing_type}
                onChange={handleChange}
                placeholder="Enter billing type"
                isInvalid={!!errors.billing_type}
              />
              <Form.Control.Feedback type="invalid">
                {errors.billing_type}
              </Form.Control.Feedback>
            </Form.Group>

            {/* rag Details */}
            <Form.Group className="mb-3">
              <Form.Label htmlFor="rag_details">rag Details</Form.Label>
              <Form.Control
                type="text"
                id="rag_details"
                name="rag_details"
                value={formData.rag_details}
                onChange={handleChange}
                placeholder="Enter rag details"
                isInvalid={!!errors.rag_details}
              />
              <Form.Control.Feedback type="invalid">
                {errors.rag_details}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Automation Checkbox */}
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="automation"
                name="automation"
                label="Automation"
                checked={formData.automation}
                onChange={handleChange}
              />
            </Form.Group>

            {/* AI Used Checkbox */}
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="ai_used"
                name="ai_used"
                label="AI Used"
                checked={formData.ai_used}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Submit Button */}
            <Button
              variant="primary"
              type="submit"
              disabled={isPending}
              style={{
                backgroundColor: '#000d6b',
                borderColor: '#000d6b',
                display: 'block',
                marginTop: '1rem',
              }}
            >
              {isPending ? 'Submitting...' : 'Create Project Details'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CreateProjectDetails;
