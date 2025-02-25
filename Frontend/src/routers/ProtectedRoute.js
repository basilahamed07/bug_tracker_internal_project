// // // ProtectedRoute.js
// // import React from 'react';
// // import { Navigate, Outlet } from 'react-router-dom';

// // const ProtectedRoute = () => {
// //   const token = localStorage.getItem('access'); // Adjust the key based on your storage

// //   if (!token) {
// //     return <Navigate to="/signin" replace />; // Redirect if not authenticated
// //   }

// //   return <Outlet />; // Render child routes if authenticated
// // }; 

// // export default ProtectedRoute;


// // import React from "react";
// // import { Navigate, Outlet } from "react-router-dom";
// // import { useAuth } from "../pages/authContext"; // Import the custom hook for auth context

// // const ProtectedRoute = () => {
// //   const { user } = useAuth(); // Get the user from context

// //   if (!user) {
// //     return <Navigate to="/signin" replace />; // Redirect to signin if no user is found in context
// //   }

// //   return <Outlet />; // Render child routes if authenticated
// // };

// // export default ProtectedRoute;




// import React, { useEffect, useState } from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../pages/authContext"; // Import the custom hook for auth context

// const ProtectedRoute = () => {
//   const { user } = useAuth(); // Get the user from context
//   const [loading, setLoading] = useState(true); // Loading state to wait for the auth check

//   useEffect(() => {
//     // Set loading to false once user data is checked
//     if (user !== null) {
//       setLoading(false);
//     }
//   }, [user]);

//   // Show a loading screen or spinner while user state is being checked
//   if (loading) {
//     return <div>Loading...</div>; // You can replace this with a spinner or loading indicator
//   }

//   if (!user || !user.access_token) {
//     return <Navigate to="/signin" replace />; // Redirect to signin if no user is found or no access token
//   }

//   return <Outlet />; // Render child routes if authenticated
// };

// export default ProtectedRoute;



import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Check if there's an access_token in sessionStorage
  const token = sessionStorage.getItem('access_token'); // Adjusted for sessionStorage

  if (!token) {
    return <Navigate to="*" replace />; // Redirect to signin if no token is found
  }

  return <Outlet />; // Render child routes if authenticated
};

export default ProtectedRoute;
