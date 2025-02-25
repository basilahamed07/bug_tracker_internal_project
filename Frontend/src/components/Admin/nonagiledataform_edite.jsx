// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Modal, Button, Form } from 'react-bootstrap';

// const TestingTypeTable = () => {
//   // Retrieve the access token and projectId from sessionStorage
//   const accessToken = sessionStorage.getItem('access_token');
//   const projectId = sessionStorage.getItem('projectId');
  
//   const [testingTypes, setTestingTypes] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedTest, setSelectedTest] = useState(null);
//   const [formData, setFormData] = useState({
//     total_testcase: '',
//     tcexecution: '',
//     passed: '',
//     fail: '',
//     opendefact: '',
//     type_of_testing: '',
//     project_name_id: projectId,
//     user_id: '',  // add this if required
//   });

//   useEffect(() => {
//     if (!projectId || !accessToken) {
//       console.error('Missing project ID or access token.');
//       return;
//     }
    
//     // Fetch the latest 5 testing types for the project
//     axios
//       .get(`https://frt4cnbr-5000.inc1.devtunnels.ms/testing-type/${projectId}`, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       })
//       .then((response) => {
//         setTestingTypes(response.data.slice(0, 5)); // Only keep latest 5 records
//       })
//       .catch((error) => {
//         console.error("There was an error fetching the testing types!", error);
//       });
//   }, [projectId, accessToken]);

//   // Handle form changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // Handle Edit button click
//   const handleEditClick = (test) => {
//     setSelectedTest(test);
//     setFormData(test); // Pre-fill form with selected test data
//     setShowModal(true);
//   };

//   // Handle Delete button click
//   const handleDeleteClick = (id) => {
//     if (window.confirm('Are you sure you want to delete this record?')) {
//       axios
//         .delete(`/testing-type/${id}`, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         })
//         .then(() => {
//           // Update the table after deleting
//           setTestingTypes((prevTypes) => prevTypes.filter((test) => test.id !== id));
//         })
//         .catch((error) => {
//           console.error("There was an error deleting the testing type!", error);
//         });
//     }
//   };

//   // Handle form submission for editing
//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     if (selectedTest) {
//       axios
//         .put(`/testing-type/${selectedTest.id}`, formData, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         })
//         .then((response) => {
//           // Update the testing type list with the edited data
//           setTestingTypes((prevTypes) =>
//             prevTypes.map((test) =>
//               test.id === selectedTest.id ? response.data : test
//             )
//           );
//           setShowModal(false);
//         })
//         .catch((error) => {
//           console.error("There was an error updating the testing type!", error);
//         });
//     }
//   };

//   return (
//     <div>
//       <h3>Testing Types</h3>
//       <table className="table">
//         <thead>
//           <tr>
//             <th>Total Testcase</th>
//             <th>Execution</th>
//             <th>Passed</th>
//             <th>Failed</th>
//             <th>Open Defects</th>
//             <th>Type of Testing</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {testingTypes.map((test) => (
//             <tr key={test.id}>
//               <td>{test.total_testcase}</td>
//               <td>{test.tcexecution}</td>
//               <td>{test.passed}</td>
//               <td>{test.fail}</td>
//               <td>{test.opendefact}</td>
//               <td>{test.type_of_testing}</td>
//               <td>
//                 <Button variant="warning" onClick={() => handleEditClick(test)}>
//                   Edit
//                 </Button>
//                 <Button
//                   variant="danger"
//                   onClick={() => handleDeleteClick(test.id)}
//                   className="ml-2"
//                 >
//                   Delete
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Modal for Editing */}
//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Testing Type</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleFormSubmit}>
//             <Form.Group controlId="total_testcase">
//               <Form.Label>Total Testcase</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="total_testcase"
//                 value={formData.total_testcase}
//                 onChange={handleInputChange}
//               />
//             </Form.Group>
//             <Form.Group controlId="tcexecution">
//               <Form.Label>Execution</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="tcexecution"
//                 value={formData.tcexecution}
//                 onChange={handleInputChange}
//               />
//             </Form.Group>
//             <Form.Group controlId="passed">
//               <Form.Label>Passed</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="passed"
//                 value={formData.passed}
//                 onChange={handleInputChange}
//               />
//             </Form.Group>
//             <Form.Group controlId="fail">
//               <Form.Label>Failed</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="fail"
//                 value={formData.fail}
//                 onChange={handleInputChange}
//               />
//             </Form.Group>
//             <Form.Group controlId="opendefact">
//               <Form.Label>Open Defects</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="opendefact"
//                 value={formData.opendefact}
//                 onChange={handleInputChange}
//               />
//             </Form.Group>
//             <Form.Group controlId="type_of_testing">
//               <Form.Label>Type of Testing</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="type_of_testing"
//                 value={formData.type_of_testing}
//                 onChange={handleInputChange}
//               />
//             </Form.Group>
//             <Button variant="primary" type="submit">
//               Save Changes
//             </Button>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default TestingTypeTable;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

const TestingTypeTable = () => {
  // Retrieve the access token and projectId from sessionStorage
  const accessToken = sessionStorage.getItem('access_token');
  const projectId = sessionStorage.getItem('projectId');

  const [testingTypes, setTestingTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [formData, setFormData] = useState({
    total_testcase: '',
    tcexecution: '',
    passed: '',
    fail: '',
    opendefact: '',
    type_of_testing: '',
    project_name_id: projectId,
    user_id: '',  // add this if required
  });

  useEffect(() => {
    if (!projectId || !accessToken) {
      console.error('Missing project ID or access token.');
      return;
    }

    // Fetch the latest 5 testing types for the project
    axios
      .get(`https://frt4cnbr-5000.inc1.devtunnels.ms/testing-type/${projectId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setTestingTypes(response.data.slice(0, 5)); // Only keep latest 5 records
      })
      .catch((error) => {
        console.error('There was an error fetching the testing types!', error);
      });
  }, [projectId, accessToken]);

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle Edit button click
  const handleEditClick = (test) => {
    setSelectedTest(test);
    setFormData(test); // Pre-fill form with selected test data
    setShowModal(true);
  };

  // Handle Delete button click
  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      axios
        .delete(`https://frt4cnbr-5000.inc1.devtunnels.ms/testing-type/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(() => {
          // Update the table after deleting
          setTestingTypes((prevTypes) => prevTypes.filter((test) => test.id !== id));
        })
        .catch((error) => {
          console.error('There was an error deleting the testing type!', error);
        });
    }
  };

  // Handle form submission for editing
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!selectedTest) {
      console.error('No test selected for editing');
      return;
    }

    axios
      .put(`https://frt4cnbr-5000.inc1.devtunnels.ms/testing-type/${selectedTest.id}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        // Update the testing type list with the edited data
        setTestingTypes((prevTypes) =>
          prevTypes.map((test) =>
            test.id === selectedTest.id ? response.data : test
          )
        );
        setShowModal(false);  // Close the modal after saving
      })
      .catch((error) => {
        console.error('There was an error updating the testing type!', error);
      });
  };

  return (
    <div>
      <h3>Testing Types</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Total Testcase</th>
            <th>Execution</th>
            <th>Passed</th>
            <th>Failed</th>
            <th>Open Defects</th>
            <th>Type of Testing</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {testingTypes.map((test) => (
            <tr key={test.id}>
              <td>{test.total_testcase}</td>
              <td>{test.tcexecution}</td>
              <td>{test.passed}</td>
              <td>{test.fail}</td>
              <td>{test.opendefact}</td>
              <td>{test.type_of_testing}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditClick(test)}>
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteClick(test.id)}
                  className="ml-2"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Editing */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Testing Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="total_testcase">
              <Form.Label>Total Testcase</Form.Label>
              <Form.Control
                type="number"
                name="total_testcase"
                value={formData.total_testcase}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="tcexecution">
              <Form.Label>Execution</Form.Label>
              <Form.Control
                type="text"
                name="tcexecution"
                value={formData.tcexecution}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="passed">
              <Form.Label>Passed</Form.Label>
              <Form.Control
                type="number"
                name="passed"
                value={formData.passed}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="fail">
              <Form.Label>Failed</Form.Label>
              <Form.Control
                type="number"
                name="fail"
                value={formData.fail}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="opendefact">
              <Form.Label>Open Defects</Form.Label>
              <Form.Control
                type="number"
                name="opendefact"
                value={formData.opendefact}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="type_of_testing">
              <Form.Label>Type of Testing</Form.Label>
              <Form.Control
                type="text"
                name="type_of_testing"
                value={formData.type_of_testing}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TestingTypeTable;
