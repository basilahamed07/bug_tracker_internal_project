import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



// SVG Imports
import cponly from "../components/panel/assets/cponly.svg";


const SlidingAuth = () => {
  // const [isSignIn, setIsSignIn] = useState(true);

  // State for form data
  const [signInData, setSignInData] = useState({
    username: '',  // Only username and password are needed
    password: '',
  });

  // State for validation errors
  const [errors, setErrors] = useState({
    signIn: {},
  });

  const navigate = useNavigate();

  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateSignIn = () => {
    const { username, password } = signInData;
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors((prevErrors) => ({ ...prevErrors, signIn: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (validateSignIn()) {
      try {
        // Make the API call to log in
        const response = await axios.post('http://localhost:5000/login', signInData);

        if (response.status === 200) {
          const { access_token, user } = response.data;

          // Store access token and username in sessionStorage
          sessionStorage.setItem('access_token', access_token);
          sessionStorage.setItem('username', user.username);

          // Clear form data
          setSignInData({
            username: '',
            password: '',
          });

          // Clear errors
          setErrors((prevErrors) => ({ ...prevErrors, signIn: {} }));

          // Navigate based on the role in the response
          if (user.role === 'TestLead') {
            navigate('/TestLead/project-info');
          } else if (user.role === 'admin') {
            navigate('/AdminPanel/viewproject');
          } else if (user.role === 'Manager') {
            navigate('/ManagerView/manager_view');
          } else {
            console.error('Unexpected role:', user.role);
            setErrors((prevErrors) => ({
              ...prevErrors,
              signIn: { general: 'Unexpected role returned from server.' },
            }));
          }
        } else {
          console.error('Unexpected response status:', response.status);
          setErrors((prevErrors) => ({
            ...prevErrors,
            signIn: { general: 'Unexpected response from the server.' },
          }));
        }
      } catch (error) {
        if (error.response) {
          console.error('Sign In Error:', error.response.data);

          if (error.response.status === 401) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              signIn: { general: 'Invalid username or password. Please try again.' },
            }));
          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              signIn: error.response.data,
            }));
          }
        } else if (error.request) {
          console.error('Sign In Error: No response received', error.request);
          setErrors((prevErrors) => ({
            ...prevErrors,
            signIn: { general: 'No response received from the server.' },
          }));
        } else {
          console.error('Sign In Error:', error.message);
          setErrors((prevErrors) => ({
            ...prevErrors,
            signIn: { general: error.message },
          }));
        }
      }
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Montserrat', sans-serif",
        height: '100vh',  // Full viewport height
        display: 'flex',  // Flexbox to center content
        justifyContent: 'center',  // Center horizontally
        alignItems: 'center',  // Center vertically
        background: '#f6f5f7',  // Light background color
        margin: 0,  // Remove default margin
      }}
    >
      <div
        style={{
          display: 'flex',  // Flexbox for both form and right banner side
          width: '768px',  // Fixed width
          height: '480px',  // Minimum height for the form and banner
          maxWidth: '100%',
          borderRadius: '10px',
          boxShadow: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
        }}
      >
        {/* Sign In Form */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '50%',  // Left side width
            height: '100%',
            background: '#fff',
            padding: '20px',
          }}
        >
          <form onSubmit={handleSignInSubmit} style={{ textAlign: 'center', width: '100%' }}>
            <h1 style={{ fontWeight: 'bold', margin: 0 }}>Sign In</h1>
            <input
              type="text"
              name="username"
              value={signInData.username}
              onChange={handleSignInChange}
              placeholder="Username"
              style={{
                margin: '10px 0',
                padding: '10px',
                width: '80%',
              }}
            />
            {errors.signIn.username && <p style={{ color: 'red' }}>{errors.signIn.username}</p>}

            <input
              type="password"
              name="password"
              value={signInData.password}
              onChange={handleSignInChange}
              placeholder="Password"
              style={{
                margin: '10px 0',
                padding: '10px',
                width: '80%',
              }}
            />
            {errors.signIn.password && <p style={{ color: 'red' }}>{errors.signIn.password}</p>}

            <button
              type="submit"
              style={{
                borderRadius: '20px',
                border: '1px solid #000d6b',
                backgroundColor: '#000d6b',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 'bold',
                padding: '12px 45px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginTop: '20px',
                // border: 'none',
              }}
            >
              Sign In
            </button>
            {errors.signIn.general && <p style={{ color: 'red' }}>{errors.signIn.general}</p>}
          </form>
        </div>

        {/* Right Side Banner */}
        <div
          style={{
            background: 'linear-gradient(to right, #000d6b, #00297a)',  // Gradient background
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#ffffff',  // White text color
            height: '100%',
            width: '50%',  // Right side width
            display: 'flex',  // Flexbox to center text
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '20px',
          }}
        >
        <img src={cponly} alt="Changepond Technologies" 
        
        style={{
          width: '80%',  // Makes the image responsive
          height: 'auto',  // Keeps the aspect ratio intact
          marginBottom: '20px',
        }}
        />
          <h1>Digital Assurance</h1>
          <p>Platform Led Quality Engineering</p>
        </div>
      </div>
    </div>
  );
};

export default SlidingAuth;
