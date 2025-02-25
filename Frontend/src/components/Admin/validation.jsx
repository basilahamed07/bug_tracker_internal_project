// src/validation.js
export const validateProjectName = (value, confirmValue) => {
    if (!value) return "Project Name is required.";
    if (value !== confirmValue) return "Project names must match.";
    return '';
  };
  
  export const validateConfirmProjectName = (value) => {
    if (!value) return "Please confirm the Project Name.";
    return '';
  };
  