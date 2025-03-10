import React, { useState } from 'react';
import axios from 'axios';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('TestLead'); // Default role is "user"
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous messages
    setErrorMessage('');
    setSuccessMessage('');

    // Send the POST request to the Flask backend
    try {
      const response = await axios.post('http://localhost:5000/register', {
        username: username,
        password: password,
        role: role, // Include the selected role
      });
      
      // Handle the response
      if (response.status === 201) {
        setSuccessMessage('User registered successfully!');
      }
    } catch (error) {
      // Handle error responses
      if (error.response) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="TestLead">TestLead</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>

      {/* Display success or error messages */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default RegisterPage;
