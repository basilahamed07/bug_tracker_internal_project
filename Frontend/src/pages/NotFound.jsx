import React from "react";
import { useNavigate } from "react-router-dom";

// Import a 404 image or icon
import notFoundImage from "../components/panel/assets/404.jpg"; // If you have an image

const NotFound = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/"); // Navigate to the homepage
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <img
          src={notFoundImage} // Replace with your icon or image path
          alt="404"
          style={styles.image}
        />
        <h1 style={styles.title}>404</h1>
        <p style={styles.message}>Oops! The page you're looking for doesn't exist.</p>
        <button onClick={handleBackHome} style={styles.button}>
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

// Styling for the page
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f4f9", // Background color for the whole page
    fontFamily: "'Roboto', sans-serif",
  },
  content: {
    textAlign: "center",
    maxWidth: "400px",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  image: {
    width: "120px",
    height: "120px",
    marginBottom: "20px",
  },
  title: {
    fontSize: "72px",
    color: "#0d6efd", // Apply the blue color to the title
    marginBottom: "10px",
  },
  message: {
    fontSize: "18px",
    color: "#333333", // Text color for the message
    marginBottom: "20px",
  },
  button: {
    padding: "12px 20px",
    fontSize: "16px",
    backgroundColor: "#0d6efd", // Button background set to the blue color
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default NotFound;
