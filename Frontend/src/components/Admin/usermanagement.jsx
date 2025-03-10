// import React, { useState, useEffect, useRef } from 'react';
// import { Button, Modal, Form, Card } from 'react-bootstrap';
// import axios from 'axios';
// import $ from 'jquery';
// import 'datatables.net';
// import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';

// const UserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editUserId, setEditUserId] = useState(null);
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [role, setRole] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [editOption, setEditOption] = useState(''); // Track if we are editing password or role

//   const tableRef = useRef(null);

//   // Fetch all users when the component mounts
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     const token = sessionStorage.getItem('access_token');
//     try {
//       const response = await axios.get('http://localhost:5000/all-users', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
  
//       if (Array.isArray(response.data.user)) {
//         // Filter out users with 'admin' role
//         const filteredUsers = response.data.user.filter(user => user.role !== 'admin');
//         // Sort users by user_id in ascending order
//         const sortedUsers = filteredUsers.sort((a, b) => a.user_id - b.user_id);
//         setUsers(sortedUsers);
//       } else {
//         setError('Received invalid data format from the server.');
//         setUsers([]);
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       setError('Failed to fetch users.');
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   const handleAddUser = async () => {
//     if (!username || !password || !confirmPassword || !role) {
//       setError('All fields are required!');
//       return;
//     }
  
//     if (password !== confirmPassword) {
//       setError('Passwords do not match.');
//       return;
//     }
  
//     const token = sessionStorage.getItem('access_token');
//     try {
//       const response = await axios.post(
//         'http://localhost:5000/register',
//         { username, password, role },
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
  
//       if (response.status === 200) {

//         // Show success message
//         setError('User registered successfully!');
        
//         // Clear the form inputs
//         setUsername('');
//         setPassword('');
//         setConfirmPassword('');
//         setRole('');
  
//         // Close the modal
//         setShowModal(false);
  
//         // Refresh the user list
//         fetchUsers();
  
//         // Optionally, you can trigger a page reload for a full refresh
//         // location.reload();  // This will reload the page, but it's generally better to use state to trigger changes
//       }
//     } catch (error) {
//       console.error('Error adding user:', error);
//       setError('Failed to add user.');
//     }
//   };
  
//   const handleEditUser = (userId, currentUsername, currentRole) => {
//     setEditUserId(userId);
//     setUsername(currentUsername);
//     setRole(currentRole);
//     setEditOption(''); // Reset edit option on user edit
//     setShowModal(true);
//     setError(''); // Reset error message when opening the modal
//   };

//   const handleUpdateUser = async () => {
//     if (editOption === 'password') {
//       if (!password || !confirmPassword) {
//         setError('Password and confirm password are required.');
//         return;
//       }
//       if (password !== confirmPassword) {
//         setError('Passwords do not match.');
//         return;
//       }
//     }
//     if (editOption === 'role' && !role) {
//       setError('Role is required.');
//       return;
//     }

//     const token = sessionStorage.getItem('access_token');
//     try {
//       let response;
//       if (editOption === 'password') {
//         response = await axios.post(
//           'http://localhost:5000/password-update',
//           { userId: editUserId, password },
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );
//       } else if (editOption === 'role') {
//         response = await axios.post(
//           'http://localhost:5000/role-change',
//           { userId: editUserId, role },
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );
//       }

//       if (response.status === 200) {
//         setUsername('');
//         setPassword('');
//         setConfirmPassword('');
//         setRole('');
//         setEditUserId(null);
//         setEditOption('');
//         setShowModal(false);
//         fetchUsers(); // Refresh the user list
//       }
//     } catch (error) {
//       console.error('Error updating user:', error);
//       setError('Failed to update user.');
//     }
//   };

//   // Initialize DataTables after users are loaded
//   useEffect(() => {
//     if (users.length > 0) {
//       $(tableRef.current).DataTable();
//     }
//   }, [users]);

//   return (
//     <div className="container mt-5">
//       <h2>User Management</h2>

//       {/* Error message */}
//       {error && <div className="alert alert-danger">{error}</div>}

//       {/* Add User Button */}
//       <Button variant="primary" onClick={() => setShowModal(true)}>
//   Add User
// </Button>


//       {/* User List Table */}
//       {loading ? (
//         <div>Loading...</div>
//       ) : (
//         <Card className="mt-4">
//           <Card.Body>
//             <table ref={tableRef} className="table table-striped table-bordered" id="userTable">
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Username</th>
//                   <th>Role</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {Array.isArray(users) && users.length > 0 ? (
//                   users.map((user, index) => (
//                     <tr key={user.user_id}>
//                       <td>{index + 1}</td>
//                       <td>{user.username}</td>
//                       <td>{user.role}</td>
//                       <td>
//                         <Button
//                           variant="warning"
//                           onClick={() =>
//                             handleEditUser(user.user_id, user.username, user.role)
//                           }
//                         >
//                           Edit
//                         </Button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="4" className="text-center">No users found</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </Card.Body>
//         </Card>
//       )}

//       {/* Modal for Adding/Editing User */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//   <Modal.Header closeButton>
//     <Modal.Title>{editUserId ? 'Edit User' : 'Add User'}</Modal.Title>
//   </Modal.Header>
//   <Modal.Body>
//     {error && <div className="alert alert-danger">{error}</div>} {/* Show error in the modal */}

//     <Form>
//       {/* Username field (disabled if editing) */}
//       <Form.Group controlId="formUsername">
//         <Form.Label>Username</Form.Label>
//         <Form.Control
//           type="text"
//           placeholder="Enter username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           disabled={editUserId !== null} // Disable when editing
//         />
//       </Form.Group>

//       {/* Add User: Show Role selection */}
//       {editUserId === null && (
//         <Form.Group controlId="formRole">
//           <Form.Label>Role</Form.Label>
//           <Form.Control
//             as="select"
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//           >
//             <option value="">Select Role</option>
//             <option value="TestLead">TestLead</option>
//             <option value="Manager">Manager</option>
//           </Form.Control>
//         </Form.Group>
//       )}

//       {/* Password and Confirm Password (only shown when adding user) */}
//       {editUserId === null && (
//         <>
//           <Form.Group controlId="formPassword">
//             <Form.Label>Password</Form.Label>
//             <Form.Control
//               type="password"
//               placeholder="Enter password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </Form.Group>

//           <Form.Group controlId="formConfirmPassword">
//             <Form.Label>Confirm Password</Form.Label>
//             <Form.Control
//               type="password"
//               placeholder="Confirm password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//             />
//           </Form.Group>
//         </>
//       )}

//       {/* Edit option buttons (only shown when editing an existing user) */}
//       {editUserId !== null && (
//         <Form.Group controlId="formEditOption">
//           <Form.Label>What do you want to edit?</Form.Label>
//           <div>
//             <Button
//               variant="secondary"
//               onClick={() => setEditOption('password')}
//               className="mr-2"
//             >
//               Change Password
//             </Button>
//             <Button
//               variant="secondary"
//               onClick={() => setEditOption('role')}
//             >
//               Change Role
//             </Button>
//           </div>
//         </Form.Group>
//       )}

//       {/* Conditional Fields based on Edit Option */}
//       {editOption === 'password' && (
//         <>
//           <Form.Group controlId="formNewPassword">
//             <Form.Label>New Password</Form.Label>
//             <Form.Control
//               type="password"
//               placeholder="Enter new password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </Form.Group>

//           <Form.Group controlId="formConfirmNewPassword">
//             <Form.Label>Confirm Password</Form.Label>
//             <Form.Control
//               type="password"
//               placeholder="Confirm new password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//             />
//           </Form.Group>
//         </>
//       )}

//       {editOption === 'role' && (
//         <Form.Group controlId="formRole">
//           <Form.Label>Role</Form.Label>
//           <Form.Control
//             as="select"
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//           >
//             <option value="">Select Role</option>
//             <option value="TestLead">TestLead</option>
//             <option value="Manager">Manager</option>
//           </Form.Control>
//         </Form.Group>
//       )}

//       {/* Submit Button (calls handleAddUser or handleUpdateUser) */}
//       <Button
//         variant="primary"
//         onClick={editUserId ? handleUpdateUser : handleAddUser} // Trigger either add or update based on editUserId
//         className="mt-3"
//       >
//         {editUserId ? 'Update User' : 'Add User'}
//       </Button>
//     </Form>
//   </Modal.Body>
// </Modal>



//     </div>
//   );
// };

// export default UserManagement;


import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Form, Card } from 'react-bootstrap';
import axios from 'axios';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // New state for success modal
  const [editUserId, setEditUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editOption, setEditOption] = useState(''); // Track if we are editing password or role

  const tableRef = useRef(null);

  // Fetch all users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get('http://localhost:5000/all-users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data.user)) {
        // Filter out users with 'admin' role
        const filteredUsers = response.data.user.filter(user => user.role !== 'admin');
        // Sort users by user_id in ascending order
        const sortedUsers = filteredUsers.sort((a, b) => a.user_id - b.user_id);
        setUsers(sortedUsers);
      } else {
        setError('Received invalid data format from the server.');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!username || !password || !confirmPassword || !role) {
      setError('All fields are required!');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.post(
        'http://localhost:5000/register',
        { username, password, role },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 201) {
        // Clear the form inputs
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setRole('');

        // Close the modal
        setShowModal(false);

        // Show success modal
        setShowSuccessModal(true);
        

        // Refresh the user list
        fetchUsers();
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setError('Failed to add user.');
    }
  };

  // const handleCloseSuccessModal = () => {
  //   setShowSuccessModal(false);
  //   window.location.reload();
  // };

  const handleEditUser = (userId, currentUsername, currentRole) => {
    setEditUserId(userId);
    setUsername(currentUsername);
    setRole(currentRole);
    setEditOption(''); // Reset edit option on user edit
    setShowModal(true);
    setError(''); // Reset error message when opening the modal
  };

  const handleUpdateUser = async () => {
    if (editOption === 'password') {
      if (!password || !confirmPassword) {
        setError('Password and confirm password are required.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }
    if (editOption === 'role' && !role) {
      setError('Role is required.');
      return;
    }

    const token = sessionStorage.getItem('access_token');
    try {
      let response;
      if (editOption === 'password') {
        response = await axios.post(
          'http://localhost:5000/password-update',
          { userId: editUserId, password },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } else if (editOption === 'role') {
        response = await axios.post(
          'http://localhost:5000/role-change',
          { userId: editUserId, role },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      if (response.status === 200) {
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setRole('');
        setEditUserId(null);
        setEditOption('');
        setShowModal(false);
        fetchUsers(); // Refresh the user list
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user.');
    }
  };

  // Initialize DataTables after users are loaded
  useEffect(() => {
    if (users.length > 0) {
      $(tableRef.current).DataTable();
    }
  }, [users]);

  return (
    <div className="container mt-5">
      <h2>User Management</h2>

      {/* Error message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Add User Button */}
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Add User
      </Button>

      {/* User List Table */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Card className="mt-4">
          <Card.Body>
            <table ref={tableRef} className="table table-striped table-bordered" id="userTable">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user.user_id}>
                      <td>{index + 1}</td>
                      <td>{user.username}</td>
                      <td>{user.role}</td>
                      <td>
                        <Button
                          variant="warning"
                          onClick={() =>
                            handleEditUser(user.user_id, user.username, user.role)
                          }
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card.Body>
        </Card>
      )}

      {/* Modal for Adding/Editing User */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>{editUserId ? 'Edit User' : 'Add User'}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {error && <div className="alert alert-danger">{error}</div>} {/* Show error in the modal */}

    <Form>
      {/* Username field (disabled if editing) */}
      <Form.Group controlId="formUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={editUserId !== null} // Disable when editing
        />
      </Form.Group>

      {/* Add User: Show Role selection */}
      {editUserId === null && (
        <Form.Group controlId="formRole">
          <Form.Label>Role</Form.Label>
          <Form.Control
            as="select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="TestLead">TestLead</option>
            <option value="Manager">Manager</option>
          </Form.Control>
        </Form.Group>
      )}

      {/* Password and Confirm Password (only shown when adding user) */}
      {editUserId === null && (
        <>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
        </>
      )}

      {/* Edit option buttons (only shown when editing an existing user) */}
      {editUserId !== null && (
        <Form.Group controlId="formEditOption">
          <Form.Label>What do you want to edit?</Form.Label>
          <div>
            <Button
              variant="secondary"
              onClick={() => setEditOption('password')}
              className="mr-2"
            >
              Change Password
            </Button>
            <Button
              variant="secondary"
              onClick={() => setEditOption('role')}
            >
              Change Role
            </Button>
          </div>
        </Form.Group>
      )}

      {/* Conditional Fields based on Edit Option */}
      {editOption === 'password' && (
        <>
          <Form.Group controlId="formNewPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formConfirmNewPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
        </>
      )}

      {editOption === 'role' && (
        <Form.Group controlId="formRole">
          <Form.Label>Role</Form.Label>
          <Form.Control
            as="select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="TestLead">TestLead</option>
            <option value="Manager">Manager</option>
          </Form.Control>
        </Form.Group>
      )}

      {/* Submit Button (calls handleAddUser or handleUpdateUser) */}
      <Button
        variant="primary"
        onClick={editUserId ? handleUpdateUser : handleAddUser} // Trigger either add or update based on editUserId
        className="mt-3"
      >
        {editUserId ? 'Update User' : 'Add User'}
      </Button>
    </Form>
  </Modal.Body>
</Modal>


      {/* Success Modal */}
      {/* <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>User Registered Successfully</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>The user has been registered successfully!</p>
          <Button variant="success" onClick={handleCloseSuccessModal}>
            Close
          </Button>
        </Modal.Body>
      </Modal> */}
    </div>
  );
};

export default UserManagement;
