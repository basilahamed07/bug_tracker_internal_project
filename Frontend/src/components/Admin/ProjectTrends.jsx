
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import Defects from "../panel/assets/defects.svg";
// import test_execution from "../panel/assets/Test_ Execution_Status.svg";
// import manage_test from "../panel/assets/Total_Defects.svg";
// import manage_build from "../panel/assets/manage_build.svg";
// import accept_reject from "../panel/assets/accept_reject.svg";
// import test_status from "../panel/assets/test_status.svg";

// const ProjectTrends = () => {
//   // State to manage the currently hovered div
//   const [hoveredIndex, setHoveredIndex] = useState(null);

//   // Define the routes for each div
//   const routes = [
//     'AdminPanel/ManageDefects',
//     'AdminPanel/ManageTestExecutionStatus',
//     'AdminPanel/ManageTotalDefectStatus',
//     'AdminPanel/ManageBuildStatus',
//     'AdminPanel/ManageDefectAcceptedRejected',
//     'AdminPanel/ManageTestCaseCreationStatus',
//   ];

//   // Define the custom messages for each route
//   const messages = [
//     'Manage Defects',
//     'Manage Test Execution Status',
//     'Manage Total Defect Status',
//     'Manage Build Status',
//     'Manage Defect Accepted/Rejected',
//     'Manage Test Case Creation Status',
//   ];

//   const svg = [
//     Defects,
//     test_execution,
//     manage_test,
//     manage_build,
//     accept_reject,
//     test_status,
//   ];

//   return (
//     <div
//       style={{
//         fontFamily: "'Montserrat', sans-serif",
//         height: '105vh',
//         display: 'flex',
//         flexDirection: 'column', // Stack the header and content vertically
//         justifyContent: 'center',
//         alignItems: 'center',
//         margin: 0,
//         gap: '20px',
//       }}
//     >
//       {/* Heading */}
//       <h1
//         style={{
//           fontSize: '36px',
//           color: '#000d6b',
//           marginBottom: '-70px', // Add space between heading and content
//           fontWeight: 'bold',
//         }}
//       >
//         Manage Buzz
//       </h1>

//       {/* Main Content */}
//       <div
//         style={{
//           display: 'flex',
//           flexWrap: 'wrap', // Allow wrapping to create rows
//           gap: '-200px', // Add space between the divs
//           justifyContent: 'space-around', // Distribute the items across the available space
//         }}
//       >
//         {/* Render 6 divs (3 columns and 2 rows) with links */}
//         {routes.map((route, index) => (
//           <Link
//             key={index}
//             to={`/${route}`} // Set the path for each route
//             style={{
//               textDecoration: 'none', // Remove the default underline from the link
//               width: '300px', // Fixed width for all divs
//               height: '300px', // Fixed height for all divs (Make sure all divs have the same height)
//               display: 'flex',
//               flexDirection: 'column', // Stack elements vertically
//               justifyContent: 'center',
//               alignItems: 'center', // Center content within each div
//             }}
//           >
//             <div
//               onMouseEnter={() => setHoveredIndex(index)} // Set the hovered div's index
//               onMouseLeave={() => setHoveredIndex(null)} // Reset when mouse leaves
//               style={{
//                 textAlign: 'center',
//                 padding: '20px',
//                 borderRadius: '10px',
//                 backgroundColor: '#ffffff',
//                 boxShadow: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
//                 transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition
//                 transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)', // Slightly increase size on hover
//                 boxShadow: hoveredIndex === index ? '0 20px 40px rgba(0, 0, 0, 0.35)' : '0 14px 28px rgba(0, 0, 0, 0.25)', // Stronger shadow on hover
//                 position: 'relative', // Ensure scaling is applied properly within the container
//                 zIndex: hoveredIndex === index ? 10 : 1, // Ensure the hovered div is on top of others
//               }}
//             >
//               <img
//                 src={svg[index]}
//                 alt="Documents"
//                 style={{
//                   width: '2.5cm',
//                   height: '2.5cm',
//                   color: '#ffffff',
//                   backgroundColor: '#ffffff',
//                   borderRadius: '10px',
//                 }}
//               />
//               <p style={{ fontSize: '18px', color: 'BLACK' }}>
//                 {/* Always show the message, but change it on hover */}
//                 {messages[index]}
//               </p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProjectTrends;



// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import * as XLSX from 'xlsx'; // Import XLSX
// import Defects from "../panel/assets/defects.svg";
// import test_execution from "../panel/assets/Test_ Execution_Status.svg";
// import manage_test from "../panel/assets/Total_Defects.svg";
// import manage_build from "../panel/assets/manage_build.svg";
// import accept_reject from "../panel/assets/accept_reject.svg";
// import test_status from "../panel/assets/test_status.svg";

// const ProjectTrends = () => {
//   const [hoveredIndex, setHoveredIndex] = useState(null);

//   const routes = [
//     'AdminPanel/ManageDefects',
//     'AdminPanel/ManageTestExecutionStatus',
//     'AdminPanel/ManageTotalDefectStatus',
//     'AdminPanel/ManageBuildStatus',
//     'AdminPanel/ManageDefectAcceptedRejected',
//     'AdminPanel/ManageTestCaseCreationStatus',
//   ];

//   const messages = [
//     'Manage Defects',
//     'Manage Test Execution Status',
//     'Manage Total Defect Status',
//     'Manage Build Status',
//     'Manage Defect Accepted/Rejected',
//     'Manage Test Case Creation Status',
//   ];

//   const svg = [
//     Defects,
//     test_execution,
//     manage_test,
//     manage_build,
//     accept_reject,
//     test_status,
//   ];

//   // Function to handle Excel download
//   const downloadExcel = () => {
//     const data = [
//       ["Route", "Message"], // Header row
//       ...routes.map((route, index) => [route, messages[index]]),
//     ];

//     const ws = XLSX.utils.aoa_to_sheet(data); // Create worksheet
//     const wb = XLSX.utils.book_new(); // Create new workbook
//     XLSX.utils.book_append_sheet(wb, ws, "Manage_Defects"); // Append the sheet to the workbook

//     XLSX.writeFile(wb, "Manage Defects.xlsx"); // Trigger the download
//   };

//   // Function to handle Excel file upload
//   const handleUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = e.target.result;
//       const wb = XLSX.read(data, { type: "array" }); // Parse the file
//       const sheet = wb.Sheets[wb.SheetNames[0]]; // Get the first sheet
//       const jsonData = XLSX.utils.sheet_to_json(sheet); // Convert sheet to JSON

//       console.log("Uploaded Data:", jsonData);
//     };

//     reader.readAsArrayBuffer(file); // Read the file as ArrayBuffer
//   };

//   return (
//     <div
//       style={{
//         fontFamily: "'Montserrat', sans-serif",
//         height: '105vh',
//         display: 'flex',
//         flexDirection: 'column', // Stack the header and content vertically
//         justifyContent: 'center',
//         alignItems: 'center',
//         margin: 0,
//         gap: '20px',
//       }}
//     >
//       {/* Heading */}
//       <h1
//         style={{
//           fontSize: '36px',
//           color: '#000d6b',
//           marginBottom: '-70px',
//           fontWeight: 'bold',
//         }}
//       >
//         Manage Buzz
//       </h1>

//       {/* Excel Download and Upload Buttons */}
//       <div
//         style={{
//           display: 'flex',
//           gap: '20px',
//           marginBottom: '20px',
//         }}
//       >
//         {/* Download Excel Button */}
//         <button
//           onClick={downloadExcel}
//           style={{
//             padding: '10px 20px',
//             backgroundColor: '#007bff',
//             color: '#fff',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: 'pointer',
//             fontSize: '16px',
//           }}
//         >
//           Download Excel
//         </button>

//         {/* Upload Excel Button */}
//         <input
//           type="file"
//           accept=".xlsx, .xls"
//           onChange={handleUpload}
//           style={{
//             padding: '10px',
//             fontSize: '16px',
//             cursor: 'pointer',
//           }}
//         />
//       </div>

//       {/* Main Content */}
//       <div
//         style={{
//           display: 'flex',
//           flexWrap: 'wrap',
//           gap: '-200px',
//           justifyContent: 'space-around',
//         }}
//       >
//         {routes.map((route, index) => (
//           <Link
//             key={index}
//             to={`/${route}`}
//             style={{
//               textDecoration: 'none',
//               width: '300px',
//               height: '300px',
//               display: 'flex',
//               flexDirection: 'column',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//           >
//             <div
//               onMouseEnter={() => setHoveredIndex(index)}
//               onMouseLeave={() => setHoveredIndex(null)}
//               style={{
//                 textAlign: 'center',
//                 padding: '20px',
//                 borderRadius: '10px',
//                 backgroundColor: '#ffffff',
//                 boxShadow: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
//                 transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//                 transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
//                 boxShadow: hoveredIndex === index ? '0 20px 40px rgba(0, 0, 0, 0.35)' : '0 14px 28px rgba(0, 0, 0, 0.25)',
//                 position: 'relative',
//                 zIndex: hoveredIndex === index ? 10 : 1,
//               }}
//             >
//               <img
//                 src={svg[index]}
//                 alt="Documents"
//                 style={{
//                   width: '2.5cm',
//                   height: '2.5cm',
//                   color: '#ffffff',
//                   backgroundColor: '#ffffff',
//                   borderRadius: '10px',
//                 }}
//               />
//               <p style={{ fontSize: '18px', color: 'BLACK' }}>
//                 {messages[index]}
//               </p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProjectTrends;


// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import * as XLSX from 'xlsx'; // Import XLSX
// import Defects from "../panel/assets/defects.svg";
// import test_execution from "../panel/assets/Test_ Execution_Status.svg";
// import manage_test from "../panel/assets/Total_Defects.svg";
// import manage_build from "../panel/assets/manage_build.svg";
// import accept_reject from "../panel/assets/accept_reject.svg";
// import test_status from "../panel/assets/test_status.svg";
// import { FaDownload, FaUpload } from 'react-icons/fa'; // Import FontAwesome icons


// const ProjectTrends = () => {
//   const [hoveredIndex, setHoveredIndex] = useState(null);

//   const routes = [
//     'AdminPanel/ManageDefects',
//     'AdminPanel/ManageTestExecutionStatus',
//     'AdminPanel/ManageTotalDefectStatus',
//     'AdminPanel/ManageBuildStatus',
//     'AdminPanel/ManageDefectAcceptedRejected',
//     'AdminPanel/ManageTestCaseCreationStatus',
//   ];

//   const messages = [
//     'Manage Defects',
//     'Manage Test Execution Status',
//     'Manage Total Defect Status',
//     'Manage Build Status',
//     'Manage Defect Accepted/Rejected',
//     'Manage Test Case Creation Status',
//   ];

//   const svg = [
//     Defects,
//     test_execution,
//     manage_test,
//     manage_build,
//     accept_reject,
//     test_status,
//   ];

//   // Excel download function
//   const downloadExcel = () => {
//     const data = [
//       [  
//         ["Regression Defect", ""], 
//         ["Functional Defect", ""], 
//         ["Defect Reopened", ""], 
//         ["UAT Defect", ""], 
//         ["Project Name ID", ""], 
//         ["User ID", ""]],
//       [ 
//         ["Total Execution", ""], 
//         ["Test Case Execution", ""], 
//         ["Pass Count", ""], 
//         ["Fail Count", ""], 
//         ["No Run", ""], 
//         ["Blocked", ""], 
//         ["Project Name ID", ""]],
//       [   
//         ["Total Defect", ""], 
//         ["Defects Closed", ""], 
//         ["Open Defect", ""], 
//         ["Critical", ""], 
//         ["High", ""], 
//         ["Medium", ""], 
//         ["Low", "Value"], 
//         ["Project Name ID", ""]],
//       [  
//         ["Total Build Received", ""], 
//         ["Builds Accepted", ""], 
//         ["Builds Rejected", ""], 
//         ["Project Name ID", ""]],
//       [   
//         ["Total Defects", ""], 
//         ["Dev Team Accepted", ""], 
//         ["Dev Team Rejected", ""], 
//         ["Project Name ID", ""]],
//       [  
//         ["Total Test Cases Created", ""], 
//         ["Test Cases Approved", ""], 
//         ["Test Cases Rejected", ""], 
//         ["Project Name ID", ""]]
//     ];

//     const sheetNames = [
//       'Manage Defects',
//       'Test Execution Status',
//       'Total Defect Status',
//       'Build Status',
//       'Defect AcceptedRejected',
//       'Test Case Creation Status'
//     ];

//     const wb = XLSX.utils.book_new();

//     sheetNames.forEach((sheetName, index) => {
//       const ws = XLSX.utils.aoa_to_sheet(data[index]);
//       XLSX.utils.book_append_sheet(wb, ws, sheetName);
//     });

//     XLSX.writeFile(wb, "Manage_Defects_6_Sheets.xlsx");
//   };

//   // Function to handle Excel file upload
//   const handleUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = e.target.result;
//       const wb = XLSX.read(data, { type: "array" });
//       const sheet = wb.Sheets[wb.SheetNames[0]];
//       const jsonData = XLSX.utils.sheet_to_json(sheet);

//       console.log("Uploaded Data:", jsonData);
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   return (
//     <div
//       style={{
//         fontFamily: "'Montserrat', sans-serif",
//         height: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'flex-start',
//         alignItems: 'center',
//         margin: 0,
//         padding: '20px',
//       }}
//     >
//       {/* Heading */}
//       <h1
//         style={{
//           fontSize: '36px',
//           color: '#000d6b',
//           marginBottom: '-40px',
//           fontWeight: 'bold',
//           position: 'relative',
//         }}
//       >
//         Manage Buzz
//       </h1>

//       {/* Excel Download and Upload Buttons */}
//       <div
//         style={{
//           display: 'flex',
//           position: 'absolute',
//           top: '20px',  // Position at the top of the page
//           right: '20px', // Align to the right of the page
//           gap: '10px', // Space between the buttons
//         }}
//       >
//         {/* Download Excel Button */}
//         {/* Download Excel Button */}

//         <button
//   onClick={downloadExcel}
//   style={{
//     padding: '5px 10px', // Reduced padding
//     backgroundColor: '#000d6b',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '8px',
//     cursor: 'pointer',
//     fontSize: '18px', // Icon size
//     display: 'flex', // Use flex to center the icon
//     justifyContent: 'center', // Center horizontally
//     alignItems: 'center', // Center vertically
//   }}
//   title="Download Excel Format" // Tooltip text on hover
//   onMouseEnter={(e) => e.target.style.backgroundColor = '#3b4f91'} // Hover effect on mouse enter
//   onMouseLeave={(e) => e.target.style.backgroundColor = '#000d6b'} // Reset to original on mouse leave
// >
//   <FaDownload /> {/* FontAwesome Download Icon */}
// </button>

// {/* Upload Excel Button */}
// <button
//   style={{
//     padding: '5px 10px',
//     backgroundColor: '#fff',
//     color: '#000d6b',
//     border: '2px solid #000d6b',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     fontSize: '18px', // Icon size
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//   }}
//   title="Upload Excel" // Tooltip text on hover
//   onMouseEnter={(e) => e.target.style.borderColor = '#3b4f91'} // Hover effect on mouse enter
//   onMouseLeave={(e) => e.target.style.borderColor = '#000d6b'} // Reset to original on mouse leave
// >
//   <FaUpload /> {/* FontAwesome Upload Icon */}
// </button>


//       </div>

//       {/* Main Content */}
//       <div
//         style={{
//           display: 'flex',
//           flexWrap: 'wrap',
//           gap: '40px',
//           justifyContent: 'center',
//           flexGrow: 1,
//         }}
//       >
//         {routes.map((route, index) => (
//           <Link
//             key={index}
//             to={`/${route}`}
//             style={{
//               textDecoration: 'none',
//               width: '300px',
//               height: '300px',
//               display: 'flex',
//               flexDirection: 'column',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//           >
//             <div
//               onMouseEnter={() => setHoveredIndex(index)}
//               onMouseLeave={() => setHoveredIndex(null)}
//               style={{
//                 textAlign: 'center',
//                 padding: '20px',
//                 borderRadius: '10px',
//                 backgroundColor: '#ffffff',
//                 boxShadow: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
//                 transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//                 transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
//                 boxShadow: hoveredIndex === index ? '0 20px 40px rgba(0, 0, 0, 0.35)' : '0 14px 28px rgba(0, 0, 0, 0.25)',
//                 position: 'relative',
//                 zIndex: hoveredIndex === index ? 10 : 1,
//               }}
//             >
//               <img
//                 src={svg[index]}
//                 alt="Documents"
//                 style={{
//                   width: '2.5cm',
//                   height: '2.5cm',
//                   color: '#ffffff',
//                   backgroundColor: '#ffffff',
//                   borderRadius: '10px',
//                 }}
//               />
//               <p style={{ fontSize: '18px', color: 'BLACK' }}>
//                 {messages[index]}
//               </p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProjectTrends;







// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import * as XLSX from 'xlsx'; // Import XLSX
// import Defects from "../panel/assets/defects.svg";
// import test_execution from "../panel/assets/Test_ Execution_Status.svg";
// import manage_test from "../panel/assets/Total_Defects.svg";
// import manage_build from "../panel/assets/manage_build.svg";
// import accept_reject from "../panel/assets/accept_reject.svg";
// import test_status from "../panel/assets/test_status.svg";
// import { FaDownload, FaUpload } from 'react-icons/fa'; // Import FontAwesome icons


// const ProjectTrends = () => {
//   const [hoveredIndex, setHoveredIndex] = useState(null);
//   const [fileName, setFileName] = useState(''); // State to store the uploaded file name

//   const routes = [
//     'AdminPanel/ManageDefects',
//     'AdminPanel/ManageTestExecutionStatus',
//     'AdminPanel/ManageTotalDefectStatus',
//     'AdminPanel/ManageBuildStatus',
//     'AdminPanel/ManageDefectAcceptedRejected',
//     'AdminPanel/ManageTestCaseCreationStatus',
//   ];

//   const messages = [
//     'Manage Defects',
//     'Manage Test Execution Status',
//     'Manage Total Defect Status',
//     'Manage Build Status',
//     'Manage Defect Accepted/Rejected',
//     'Manage Test Case Creation Status',
//   ];

//   const svg = [
//     Defects,
//     test_execution,
//     manage_test,
//     manage_build,
//     accept_reject,
//     test_status,
//   ];

//   // Excel download function
//   const downloadExcel = () => {
//     const data = [
//       [  
//         ["Regression Defect", ""], 
//         ["Functional Defect", ""], 
//         ["Defect Reopened", ""], 
//         ["UAT Defect", ""], 
//         ["Project Name ID", ""], 
//         ["User ID", ""]],
//       [ 
//         ["Total Execution", ""], 
//         ["Test Case Execution", ""], 
//         ["Pass Count", ""], 
//         ["Fail Count", ""], 
//         ["No Run", ""], 
//         ["Blocked", ""], 
//         ["Project Name ID", ""]],
//       [   
//         ["Total Defect", ""], 
//         ["Defects Closed", ""], 
//         ["Open Defect", ""], 
//         ["Critical", ""], 
//         ["High", ""], 
//         ["Medium", ""], 
//         ["Low", "Value"], 
//         ["Project Name ID", ""]],
//       [  
//         ["Total Build Received", ""], 
//         ["Builds Accepted", ""], 
//         ["Builds Rejected", ""], 
//         ["Project Name ID", ""]],
//       [   
//         ["Total Defects", ""], 
//         ["Dev Team Accepted", ""], 
//         ["Dev Team Rejected", ""], 
//         ["Project Name ID", ""]],
//       [  
//         ["Total Test Cases Created", ""], 
//         ["Test Cases Approved", ""], 
//         ["Test Cases Rejected", ""], 
//         ["Project Name ID", ""]]
//     ];

//     const sheetNames = [
//       'Manage Defects',
//       'Test Execution Status',
//       'Total Defect Status',
//       'Build Status',
//       'Defect AcceptedRejected',
//       'Test Case Creation Status'
//     ];

//     const wb = XLSX.utils.book_new();

//     sheetNames.forEach((sheetName, index) => {
//       const ws = XLSX.utils.aoa_to_sheet(data[index]);
//       XLSX.utils.book_append_sheet(wb, ws, sheetName);
//     });

//     XLSX.writeFile(wb, "Manage_Defects_6_Sheets.xlsx");
//   };

//   // Function to handle Excel file upload
//   const handleUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     setFileName(file.name); // Update file name on state

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = e.target.result;
//       const wb = XLSX.read(data, { type: "array" });
//       const sheet = wb.Sheets[wb.SheetNames[0]];
//       const jsonData = XLSX.utils.sheet_to_json(sheet);

//       console.log("Uploaded Data:", jsonData);
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   return (
//     <div
//       style={{
//         fontFamily: "'Montserrat', sans-serif",
//         height: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'flex-start',
//         alignItems: 'center',
//         margin: 0,
//         padding: '20px',
//       }}
//     >
//       {/* Heading */}
//       <h1
//         style={{
//           fontSize: '36px',
//           color: '#000d6b',
//           marginBottom: '-40px',
//           fontWeight: 'bold',
//           position: 'relative',
//         }}
//       >
//         Manage Buzz
//       </h1>

//       {/* Excel Download and Upload Buttons */}
//       <div
//         style={{
//           display: 'flex',
//           position: 'absolute',
//           top: '20px',  // Position at the top of the page
//           right: '20px', // Align to the right of the page
//           gap: '10px', // Space between the buttons
//         }}
//       >
//         {/* Download Excel Button */}
//         <button
//           onClick={downloadExcel}
//           style={{
//             padding: '5px 10px', // Reduced padding
//             backgroundColor: '#000d6b',
//             color: '#fff',
//             border: 'none',
//             borderRadius: '8px',
//             cursor: 'pointer',
//             fontSize: '18px', // Icon size
//             display: 'flex', // Use flex to center the icon
//             justifyContent: 'center', // Center horizontally
//             alignItems: 'center', // Center vertically
//           }}
//           title="Download Excel Format" // Tooltip text on hover
//           onMouseEnter={(e) => e.target.style.backgroundColor = '#3b4f91'} // Hover effect on mouse enter
//           onMouseLeave={(e) => e.target.style.backgroundColor = '#000d6b'} // Reset to original on mouse leave
//         >
//           <FaDownload /> {/* FontAwesome Download Icon */}
//         </button>

//         {/* Upload Excel Button */}
//         <label
//           style={{
//             padding: '5px 10px',
//             backgroundColor: '#fff',
//             color: '#000d6b',
//             border: '2px solid #000d6b',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             fontSize: '18px', // Icon size
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             position: 'relative',
//             display: 'flex',
//             gap: '5px',
//           }}
//         >
//           <FaUpload /> {/* FontAwesome Upload Icon */}
//           <input
//             type="file"
//             accept=".xlsx, .xls"
//             onChange={handleUpload}
//             style={{
//               position: 'absolute',
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               opacity: 0, // Hide the default file input
//             }}
//           />
//           {fileName && <span style={{ fontSize: '12px', color: '#000' }}> {fileName}</span>} {/* Display the uploaded file name */}
//         </label>
//       </div>

//       {/* Main Content */}
//       <div
//         style={{
//           display: 'flex',
//           flexWrap: 'wrap',
//           gap: '40px',
//           justifyContent: 'center',
//           flexGrow: 1,
//         }}
//       >
//         {routes.map((route, index) => (
//           <Link
//             key={index}
//             to={`/${route}`}
//             style={{
//               textDecoration: 'none',
//               width: '300px',
//               height: '300px',
//               display: 'flex',
//               flexDirection: 'column',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//           >
//             <div
//               onMouseEnter={() => setHoveredIndex(index)}
//               onMouseLeave={() => setHoveredIndex(null)}
//               style={{
//                 textAlign: 'center',
//                 padding: '20px',
//                 borderRadius: '10px',
//                 backgroundColor: '#ffffff',
//                 boxShadow: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
//                 transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//                 transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
//                 boxShadow: hoveredIndex === index ? '0 20px 40px rgba(0, 0, 0, 0.35)' : '0 14px 28px rgba(0, 0, 0, 0.25)',
//                 position: 'relative',
//                 zIndex: hoveredIndex === index ? 10 : 1,
//               }}
//             >
//               <img
//                 src={svg[index]}
//                 alt="Documents"
//                 style={{
//                   width: '2.5cm',
//                   height: '2.5cm',
//                   color: '#ffffff',
//                   backgroundColor: '#ffffff',
//                   borderRadius: '10px',
//                 }}
//               />
//               <p style={{ fontSize: '18px', color: 'BLACK' }}>
//                 {messages[index]}
//               </p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProjectTrends;




// _____New Code ____


// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import * as XLSX from 'xlsx'; // Import XLSX
// import Defects from "../panel/assets/defects.svg";
// import test_execution from "../panel/assets/Test_ Execution_Status.svg";
// import manage_test from "../panel/assets/Total_Defects.svg";
// import manage_build from "../panel/assets/manage_build.svg";
// import accept_reject from "../panel/assets/accept_reject.svg";
// import test_status from "../panel/assets/test_status.svg";
// import { FaDownload, FaUpload } from 'react-icons/fa'; // Import FontAwesome icons
// import axios from 'axios'; // Import axios for making API requests

// const ProjectTrends = () => {
//   const [hoveredIndex, setHoveredIndex] = useState(null);
//   const [fileName, setFileName] = useState(''); // State to store the uploaded file name

//   const routes = [
//     'AdminPanel/ManageDefects',
//     'AdminPanel/ManageTestExecutionStatus',
//     'AdminPanel/ManageTotalDefectStatus',
//     'AdminPanel/ManageBuildStatus',
//     'AdminPanel/ManageDefectAcceptedRejected',
//     'AdminPanel/ManageTestCaseCreationStatus',
//   ];

//   const messages = [
//     'Manage Defects',
//     'Manage Test Execution Status',
//     'Manage Total Defect Status',
//     'Manage Build Status',
//     'Manage Defect Accepted/Rejected',
//     'Manage Test Case Creation Status',
//   ];

//   const svg = [
//     Defects,
//     test_execution,
//     manage_test,
//     manage_build,
//     accept_reject,
//     test_status,
//   ];

//   // Excel download function
  // const downloadExcel = () => {
  //   const data = [
  //     [ 
  //     ["date", ""] ,
  //       ["regression_defect", ""], 
  //       ["functional_defect", ""], 
  //       ["defect_reopened", ""], 
  //       ["uat_defect", ""], 
  //       ["project_name_id", ""], 
  //       ],

  //     [ 
  //       ["Total Execution", ""], 
  //       ["Test Case Execution", ""], 
  //       ["Pass Count", ""], 
  //       ["Fail Count", ""], 
  //       ["No Run", ""], 
  //       ["Blocked", ""], 
  //       ["Project Name ID", ""]],

  //     [   
  //       ["Total Defect", ""], 
  //       ["Defects Closed", ""], 
  //       ["Open Defect", ""], 
  //       ["Critical", ""], 
  //       ["High", ""], 
  //       ["Medium", ""], 
  //       ["Low", "Value"], 
  //       ["Project Name ID", ""]],

  //     [  
  //       ["Total Build Received", ""], 
  //       ["Builds Accepted", ""], 
  //       ["Builds Rejected", ""], 
  //       ["Project Name ID", ""]],

  //     [   
  //       ["Total Defects", ""], 
  //       ["Dev Team Accepted", ""], 
  //       ["Dev Team Rejected", ""], 
  //       ["Project Name ID", ""]],

  //     [  
  //       ["Total Test Cases Created", ""], 
  //       ["Test Cases Approved", ""], 
  //       ["Test Cases Rejected", ""], 
  //       ["Project Name ID", ""]]
  //   ];

  //   const sheetNames = [
  //     'Manage Defects',
  //     'Test Execution Status',
  //     'Total Defect Status',
  //     'Build Status',
  //     'Defect AcceptedRejected',
  //     'Test Case Creation Status'
  //   ];

//     const wb = XLSX.utils.book_new();

//     sheetNames.forEach((sheetName, index) => {
//       const ws = XLSX.utils.aoa_to_sheet(data[index]);
//       XLSX.utils.book_append_sheet(wb, ws, sheetName);
//     });

//     XLSX.writeFile(wb, "Manage_Defects_6_Sheets.xlsx");
//   };

//   // Function to handle Excel file upload
//   const handleUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;
  
//     setFileName(file.name); // Update file name on state
  
//     const reader = new FileReader();
//     reader.onload = async (e) => {
//       const data = e.target.result;
//       const wb = XLSX.read(data, { type: "array" });
//       const sheet = wb.Sheets[wb.SheetNames[0]];
//       const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Read rows as arrays
  
//       if (jsonData.length === 0) {
//         alert("The uploaded file is empty.");
//         return;
//       }
  
//       // Convert transposed data into a proper key-value format
//       const dataObject = {};
//       jsonData.forEach(row => {
//         if (row.length === 2) {
//           dataObject[row[0].toLowerCase().trim()] = row[1]; // Normalize key to lowercase and trim
//         }
//       });
  
//       // Ensure that all required headers are present
//       const requiredHeaders = [
//         "regression_defect",
//         "functional_defect",
//         "defect_reopened",
//         "uat_defect",
//         "project_name_id"
//       ];
  
//       const missingHeaders = requiredHeaders.filter(header => !(header in dataObject));
  
//       if (missingHeaders.length > 0) {
//         alert(`The uploaded file is missing the following required columns: ${missingHeaders.join(', ')}`);
//         return;
//       }
  
//       // Prepare the data to be sent to the API
//       const defectsData = [
//         {
//           date: dataObject['date'],
//           regression_defect: dataObject['regression_defect'],
//           functional_defect: dataObject['functional_defect'],
//           defect_reopened: dataObject['defect_reopened'],
//           uat_defect: dataObject['uat_defect'],
//           project_name_id: dataObject['project_name_id'],
//         }
//       ];
  
//       try {
//         // Send the data to the backend via POST request
//         await postDefectsData(defectsData);
//       } catch (error) {
//         console.error("Error uploading defects data", error);
//       }
//     };
  
//     reader.readAsArrayBuffer(file);
//   };
  
  

//   // Function to post defects data to the backend
//   const postDefectsData = async (defectsData, modelName) => {
//     try {
//       const response = await axios.post('http://localhost:5000//upload_data', {
//         model_name: modelName,
//         data: defectsData,
//       }, {
//         headers: {
//           Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
//         },
//       });
//       console.log("Data uploaded successfully:", response.data);
//       alert("Data uploaded successfully.");
//     } catch (error) {
//       console.error("Error uploading data:", error);
//       alert("There was an error uploading the data.");
//     }
//   };
  

//   return (
//     <div
//       style={{
//         fontFamily: "'Montserrat', sans-serif",
//         height: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'flex-start',
//         alignItems: 'center',
//         margin: 0,
//         padding: '20px',
//       }}
//     >
//       {/* Heading */}
//       <h1
//         style={{
//           fontSize: '36px',
//           color: '#000d6b',
//           marginBottom: '-40px',
//           fontWeight: 'bold',
//           position: 'relative',
//         }}
//       >
//         Manage Buzz
//       </h1>

//       {/* Excel Download and Upload Buttons */}
//       <div
//         style={{
//           display: 'flex',
//           position: 'absolute',
//           top: '20px',  // Position at the top of the page
//           right: '20px', // Align to the right of the page
//           gap: '10px', // Space between the buttons
//         }}
//       >
//         {/* Download Excel Button */}
//         <button
//           onClick={downloadExcel}
//           style={{
//             padding: '5px 10px', // Reduced padding
//             backgroundColor: '#000d6b',
//             color: '#fff',
//             border: 'none',
//             borderRadius: '8px',
//             cursor: 'pointer',
//             fontSize: '18px', // Icon size
//             display: 'flex', // Use flex to center the icon
//             justifyContent: 'center', // Center horizontally
//             alignItems: 'center', // Center vertically
//           }}
//           title="Download Excel Format" // Tooltip text on hover
//           onMouseEnter={(e) => e.target.style.backgroundColor = '#3b4f91'} // Hover effect on mouse enter
//           onMouseLeave={(e) => e.target.style.backgroundColor = '#000d6b'} // Reset to original on mouse leave
//         >
//           <FaDownload /> {/* FontAwesome Download Icon */}
//         </button>

//         {/* Upload Excel Button */}
//         <label
//           style={{
//             padding: '5px 10px',
//             backgroundColor: '#fff',
//             color: '#000d6b',
//             border: '2px solid #000d6b',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             fontSize: '18px', // Icon size
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             position: 'relative',
//             display: 'flex',
//             gap: '5px',
//           }}
//         >
//           <FaUpload /> {/* FontAwesome Upload Icon */}
//           <input
//             type="file"
//             accept=".xlsx, .xls"
//             onChange={handleUpload}
//             style={{
//               position: 'absolute',
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               opacity: 0, // Hide the default file input
//             }}
//           />
//           {fileName && <span style={{ fontSize: '12px', color: '#000' }}> {fileName}</span>} {/* Display the uploaded file name */}
//         </label>
//       </div>

//       {/* Main Content */}
//       <div
//         style={{
//           display: 'flex',
//           flexWrap: 'wrap',
//           gap: '40px',
//           justifyContent: 'center',
//           flexGrow: 1,
//         }}
//       >
//         {routes.map((route, index) => (
//           <Link
//             key={index}
//             to={`/${route}`}
//             style={{
//               textDecoration: 'none',
//               width: '300px',
//               height: '300px',
//               display: 'flex',
//               flexDirection: 'column',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//           >
//             <div
//               onMouseEnter={() => setHoveredIndex(index)}
//               onMouseLeave={() => setHoveredIndex(null)}
//               style={{
//                 textAlign: 'center',
//                 padding: '20px',
//                 borderRadius: '10px',
//                 backgroundColor: '#ffffff',
//                 boxShadow: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
//                 transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//                 transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
//                 boxShadow: hoveredIndex === index ? '0 20px 40px rgba(0, 0, 0, 0.35)' : '0 14px 28px rgba(0, 0, 0, 0.25)',
//                 position: 'relative',
//                 zIndex: hoveredIndex === index ? 10 : 1,
//               }}
//             >
//               <img
//                 src={svg[index]}
//                 alt="Documents"
//                 style={{
//                   width: '2.5cm',
//                   height: '2.5cm',
//                   color: '#ffffff',
//                   backgroundColor: '#ffffff',
//                   borderRadius: '10px',
//                 }}
//               />
//               <p style={{ fontSize: '18px', color: 'BLACK' }}>
//                 {messages[index]}
//               </p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProjectTrends;




// BASIL CODE 

// import React, { useState } from 'react';
// import { FaDownload, FaUpload } from 'react-icons/fa'; // Import FontAwesome icons
// import * as XLSX from 'xlsx'; // Import XLSX
// import { Link } from 'react-router-dom';
// import Defects from "../panel/assets/defects.svg";
// import test_execution from "../panel/assets/Test_ Execution_Status.svg";
// import manage_test from "../panel/assets/Total_Defects.svg";
// import manage_build from "../panel/assets/manage_build.svg";
// import accept_reject from "../panel/assets/accept_reject.svg";
// import test_status from "../panel/assets/test_status.svg";
// import axios from 'axios'; // Import axios for making API requests

// const ProjectTrends = () => {
//   const [fileName, setFileName] = useState('');
//   const [hoveredIndex, setHoveredIndex] = useState(null);
//   const routes = [
//     'AdminPanel/ManageDefects',
//     'AdminPanel/ManageTestExecutionStatus',
//     'AdminPanel/ManageTotalDefectStatus',
//     'AdminPanel/ManageBuildStatus',
//     'AdminPanel/ManageDefectAcceptedRejected',
//     'AdminPanel/ManageTestCaseCreationStatus',
//   ];

// const svg = [
//   Defects,
//   test_execution,
//   manage_test,
//   manage_build,
//   accept_reject,
//   test_status,
// ];

//   const messages = [
//     'Manage Defects',
//     'Manage Test Execution Status',
//     'Manage Total Defect Status',
//     'Manage Build Status',
//     'Manage Defect Accepted/Rejected',
//     'Manage Test Case Creation Status',
//   ];

//   // Function to handle Excel file upload
//   // Function to handle Excel file upload
//   const handleUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     setFileName(file.name); // Update file name on state

//     // Create a new FormData object to send the file
//     const formData = new FormData();
//     formData.append('file', file); // Add the file to the FormData object

//     // Send the file to the backend
//     sendFileToBackend(formData);
//   };


//   // Function to send the file to the backend
//   const sendFileToBackend = async (formData) => {
//     try {
//       const response = await axios.post('http://localhost:5000//upload_data', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data', // Make sure to set the content type
//           Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
//         },
//       });

//       console.log("File uploaded successfully:", response.data);
//       alert("File uploaded successfully.");
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       alert("There was an error uploading the file.");
//     }
//   };


//   // Function to post data to the backend for all sheets
//   const sendDataToBackend = async (allSheetData) => {
//     try {
//       const modelMapping = {
//         "Manage Defects": "new_defects",
//         "Test Execution Status": "test_execution_status",
//         "Total Defect Status": "total_defect_status",
//         "Build Status": "build_status",
//         "Defect AcceptedRejected": "defect_accepted_rejected",
//         "Test Case Creation Status": "test_case_creation_status"
//       };

//       for (const sheetName in allSheetData) {
//         const dataObject = allSheetData[sheetName];
//         const modelName = modelMapping[sheetName];

//         if (modelName) {
//           // Map the data based on the model
//           const dataToSend = formatDataForModel(dataObject, modelName);

//           // Send the data to the backend
//           await postDefectsData(dataToSend, modelName);
//         }
//       }

//     } catch (error) {
//       console.error("Error uploading data:", error);
//       alert("There was an error uploading the data.");
//     }
//   };

  
//   const downloadExcel = () => {
//     const data = [
//       [  
//        ["fields", "values"], 
//        ["regression_defect", ""], 
//        ["functional_defect", ""], 
//        ["defect_reopened", ""], 
//        ["uat_defect", ""], 
//        ["project_name_id", ""]],
       
//       [["fields", "values"],
//         ["total_execution", ""], 
//        ["tc_execution", ""], 
//        ["pass_count", ""], 
//        ["fail_count", ""], 
//        ["no_run", ""], 
//        ["blocked", ""], 
//        ["project_name_id", ""]],
       
//       [  ["fields", "values"],
//        ["total_defect", ""], 
//        ["defects_closed", ""], 
//        ["open_defect", ""], 
//        ["critical", ""], 
//        ["high", ""], 
//        ["medium", ""], 
//        ["low", ""], 
//        ["project_name_id", ""]],
       
//       [  ["fields", "values"],
//        ["total_build_received", ""], 
//        ["builds_accepted", ""], 
//        ["builds_rejected", ""], 
//        ["project_name_id", ""]],
       
//       [  ["fields", "values"],
//        ["total_defects", ""], 
//        ["dev_team_accepted", ""], 
//        ["dev_team_rejected", ""], 
//        ["project_name_id", ""]],
       
//       [  ["fields", "values"],
//        ["total_test_case_created", ""], 
//        ["test_case_approved", ""], 
//        ["test_case_rejected", ""], 
//        ["project_name_id", ""]]
//     ];
    

//      // const downloadExcel = () => {
//     // const data = [
//     //   [ 
//     //   ["date", ""] ,
//     //     ["regression_defect", ""], 
//     //     ["functional_defect", ""], 
//     //     ["defect_reopened", ""], 
//     //     ["uat_defect", ""], 
//     //     ["project_name_id", ""], 
//     //     ],

//     //   [ 
//     //     ["total_execution", ""], 
//     //     ["tc_execution", ""], 
//     //     ["pass_count", ""], 
//     //     ["Fail Count", ""], 
//     //     ["No Run", ""], 
//     //     ["Blocked", ""], 
//     //     ["Project Name ID", ""]],

//     //   [   
//     //     ["Total Defect", ""], 
//     //     ["Defects Closed", ""], 
//     //     ["Open Defect", ""], 
//     //     ["Critical", ""], 
//     //     ["High", ""], 
//     //     ["Medium", ""], 
//     //     ["Low", "Value"], 
//     //     ["Project Name ID", ""]],

//       // [  
//       //   ["Total Build Received", ""], 
//       //   ["Builds Accepted", ""], 
//       //   ["Builds Rejected", ""], 
//       //   ["Project Name ID", ""]],

//     //   [   
//     //     ["Total Defects", ""], 
//     //     ["Dev Team Accepted", ""], 
//     //     ["Dev Team Rejected", ""], 
//     //     ["Project Name ID", ""]],

//     //   [  
//     //     ["Total Test Cases Created", ""], 
//     //     ["Test Cases Approved", ""], 
//     //     ["Test Cases Rejected", ""], 
//     //     ["Project Name ID", ""]]
//     // ];

  
//     console.log(data);
  
//     const sheetNames = [
//       'Manage Defects',
//       'Test Execution Status',
//       'Total Defect Status',
//       'Build Status',
//       'Defect AcceptedRejected',
//       'Test Case Creation Status'
//     ];
  
//     const wb = XLSX.utils.book_new();
  
//     sheetNames.forEach((sheetName, index) => {
//       // Each sheet in data corresponds to each sheetName in sheetNames
//       const ws = XLSX.utils.aoa_to_sheet(data[index]); // Instead of data[index], directly use data
//       XLSX.utils.book_append_sheet(wb, ws, sheetName);
//     });
  
//     XLSX.writeFile(wb, "Manage_Defects_6_Sheets.xlsx");
//   };
  

//   // Function to format data for each model
//   const formatDataForModel = (dataObject, modelName) => {
//     let formattedData = [];

//     switch (modelName) {
//       case "new_defects":
//         formattedData = [{
//           date: dataObject['date'],
//           regression_defect: dataObject['regression_defect'],
//           functional_defect: dataObject['functional_defect'],
//           defect_reopened: dataObject['defect_reopened'],
//           uat_defect: dataObject['uat_defect'],
//           project_name_id: dataObject['project_name_id'],
//           user_id: dataObject['user_id']
//         }];
//         break;
//       case "test_execution_status":
//         formattedData = [{
//           date: dataObject['date'],
//           total_execution: dataObject['total_execution'],
//           tc_execution: dataObject['tc_execution'],
//           pass_count: dataObject['pass_count'],
//           fail_count: dataObject['fail_count'],
//           no_run: dataObject['no_run'],
//           blocked: dataObject['blocked'],
//           project_name_id: dataObject['project_name_id'],
//           user_id: dataObject['user_id']
//         }];
//         break;
//       case "total_defect_status":
//         formattedData = [{
//           date: dataObject['date'],
//           total_defect: dataObject['total_defect'],
//           defect_closed: dataObject['defect_closed'],
//           open_defect: dataObject['open_defect'],
//           critical: dataObject['critical'],
//           high: dataObject['high'],
//           medium: dataObject['medium'],
//           low: dataObject['low'],
//           project_name_id: dataObject['project_name_id'],
//           user_id: dataObject['user_id']
//         }];
//         break;
//       case "build_status":
//         formattedData = [{
//           date: dataObject['date'],
//           total_build_received: dataObject['total_build_received'],
//           builds_accepted: dataObject['builds_accepted'],
//           builds_rejected: dataObject['builds_rejected'],
//           project_name_id: dataObject['project_name_id'],
//           user_id: dataObject['user_id']
//         }];
//         break;
//       case "defect_accepted_rejected":
//         formattedData = [{
//           date: dataObject['date'],
//           total_defects: dataObject['total_defects'],
//           dev_team_accepted: dataObject['dev_team_accepted'],
//           dev_team_rejected: dataObject['dev_team_rejected'],
//           project_name_id: dataObject['project_name_id'],
//           user_id: dataObject['user_id']
//         }];
//         break;
//       case "test_case_creation_status":
//         formattedData = [{
//           date: dataObject['date'],
//           total_test_case_created: dataObject['total_test_case_created'],
//           test_case_approved: dataObject['test_case_approved'],
//           test_case_rejected: dataObject['test_case_rejected'],
//           project_name_id: dataObject['project_name_id'],
//           user_id: dataObject['user_id']
//         }];
//         break;
//       default:
//         break;
//     }

//     return formattedData;
//   };

//   // Function to post data to the backend
//   const postDefectsData = async (defectsData, modelName) => {
//     try {
//       const response = await axios.post('http://localhost:5000//upload_data', {
//         model_name: modelName,
//         data: defectsData,
//       }, {
//         headers: {
//           Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
//         },
//       });
//       console.log("Data uploaded successfully:", response.data);
//       alert("Data uploaded successfully.");
//     } catch (error) {
//       console.error("Error uploading data:", error);
//       alert("There was an error uploading the data.");
//     }
//   };

//   return (
//     <div style={{ fontFamily: "'Montserrat', sans-serif", height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', margin: 0, padding: '20px' }}>
//       <h1 style={{ fontSize: '36px', color: '#000d6b', marginBottom: '-40px', fontWeight: 'bold', position: 'relative' }}>Manage Buzz</h1>

//       <div style={{ display: 'flex', position: 'absolute', top: '20px', right: '20px', gap: '10px' }}>
//         <button onClick={downloadExcel} style={{ padding: '5px 10px', backgroundColor: '#000d6b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '18px' }}>
//           <FaDownload />
//         </button>

//         <label style={{ padding: '5px 10px', backgroundColor: '#fff', color: '#000d6b', border: '1px solid #000d6b', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//           <FaUpload />
//           <input type="file" accept=".xlsx, .xls" onChange={handleUpload} style={{ display: 'none' }} />
//         </label>
//       </div>
//       <div
//         style={{
//           display: 'flex',
//           flexWrap: 'wrap',
//           gap: '40px',
//           justifyContent: 'center',
//           flexGrow: 1,
//         }}
//       >
//         {routes.map((route, index) => (
//           <Link
//             key={index}
//             to={`/${route}`}
//             style={{
//               textDecoration: 'none',
//               width: '300px',
//               height: '300px',
//               display: 'flex',
//               flexDirection: 'column',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//           >
//             <div
//               onMouseEnter={() => setHoveredIndex(index)}
//               onMouseLeave={() => setHoveredIndex(null)}
//               style={{
//                 textAlign: 'center',
//                 padding: '20px',
//                 borderRadius: '10px',
//                 backgroundColor: '#ffffff',
//                 boxShadow: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
//                 transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//                 transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
//                 boxShadow: hoveredIndex === index ? '0 20px 40px rgba(0, 0, 0, 0.35)' : '0 14px 28px rgba(0, 0, 0, 0.25)',
//                 position: 'relative',
//                 zIndex: hoveredIndex === index ? 10 : 1,
//               }}
//             >
//               <img
//                 src={svg[index]}
//                 alt="Documents"
//                 style={{
//                   width: '2.5cm',
//                   height: '2.5cm',
//                   color: '#ffffff',
//                   backgroundColor: '#ffffff',
//                   borderRadius: '10px',
//                 }}
//               />
//               <p style={{ fontSize: '18px', color: 'BLACK' }}>
//                 {messages[index]}
//               </p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProjectTrends;



// MY CODE 

import React, { useState } from 'react';
import { FaDownload, FaUpload } from 'react-icons/fa'; // Import FontAwesome icons
import * as XLSX from 'xlsx'; // Import XLSX
import { Link } from 'react-router-dom';
import Defects from "../panel/assets/defects.svg";
import Settings from "../panel/assets/settings.svg";
// import test_execution from "../panel/assets/Test_Execution_Status.svg";
import test_execution from "../panel/assets/Test_ Execution_Status.svg";
import manage_test from "../panel/assets/Total_Defects.svg";
import manage_build from "../panel/assets/manage_build.svg";
import accept_reject from "../panel/assets/accept_reject.svg";
import test_status from "../panel/assets/test_status.svg";
import axios from 'axios'; // Import axios for making API requests

const ProjectTrends = () => {
  const [fileName, setFileName] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const routes = [
    'AdminPanel/ManageBuzz',
    'AdminPanel/MetricsBuzz',
    'AdminPanel/ScrumBuzz',
    // 'TestLead/ScrumTeamManagement',
    'AdminPanel/testingtype',
    
    
    // 'AdminPanel/ManageDefects',
    // 'AdminPanel/ManageTestExecutionStatus',
    // 'AdminPanel/ManageTotalDefectStatus',
    // 'AdminPanel/ManageBuildStatus',
    // 'AdminPanel/ManageDefectAcceptedRejected',
    // 'AdminPanel/ManageTestCaseCreationStatus',
  ];

  const svg = [
    Settings,
    // manage_test,
    manage_test,
    manage_build,
    test_execution,
    // manage_test,
    // manage_build,
    // accept_reject,
    // test_status,
  ];

  const messages = [
    'Manage Buzz',
    'Metrics Buzz',
    'Sprint Buzz',
    // 'Scrum Buzz',
    'Testing Type'
    // 'Manage Defects',
    // 'Manage Test Execution Status',
    // 'Manage Total Defect Status',
    // 'Manage Build Status',
    // 'Manage Defect Accepted/Rejected',
    // 'Manage Test Case Creation Status',
  ];

  // Function to handle Excel file upload
  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name); // Update file name on state

    // Create a new FormData object to send the file
    const formData = new FormData();
    formData.append('file', file); // Add the file to the FormData object

    // Send the file to the backend
    sendFileToBackend(formData);
  };

  // Function to send the file to the backend
  const sendFileToBackend = async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/upload_data', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Make sure to set the content type
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
        },
      });

      console.log("File uploaded successfully:", response.data);
      alert("File uploaded successfully.");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("There was an error uploading the file.");
    }
  };

  const downloadExcel = () => {
    const data = {
      'Manage Defects': [
        ['name', 'Value'],
        ['regression_defect', ''],
        ['functional_defect', ''],
        ['defect_reopened', ''],
        ['uat_defect', ''],
        ['project_name_id', '']
      ],
      'Test Execution Status': [
        ['name', 'Value'],
        ['total_execution', ''],
        ['tc_execution', ''],
        ['pass_count', ''],
        ['fail_count', ''],
        ['no_run', ''],
        ['blocked', ''],
        ['project_name_id', '']
      ],
      'Total Defect Status': [
        ['name', 'Value'],
        ['total_defect', ''],
        ['defect_closed', ''],
        ['open_defect', ''],
        ['critical', ''],
        ['high', ''],
        ['medium', ''],
        ['low', ''],
        ['project_name_id', '']
      ],
      'Build Status': [
        ['name', 'Value'],
        ['total_build_received', ''],
        ['builds_accepted', ''],
        ['builds_rejected', ''],
        ['project_name_id', '']
      ],
      'Defect AcceptedRejected': [
        ['name', 'Value'],
        ['total_defects', ''],
        ['dev_team_accepted', ''],
        ['dev_team_rejected', ''],
        ['project_name_id', '']
      ],
      'Test Case Creation Status': [
        ['name', 'Value'],
        ['total_test_case_created', ''],
        ['test_case_approved', ''],
        ['test_case_rejected', ''],
        ['project_name_id', '']
      ]
    };
  
    const wb = XLSX.utils.book_new();
  
    // Iterate through data object and create a sheet for each category
    for (let sheetName in data) {
      const ws = XLSX.utils.aoa_to_sheet(data[sheetName]);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    }
  
    // Download the Excel file with 6 sheets
    XLSX.writeFile(wb, "Manage_Defects_6_Sheets.xlsx");
  };
  
  

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', margin: 0, padding: '20px' }}>
      <h1 style={{ fontSize: '36px', color: '#000d6b', marginBottom: '-40px', fontWeight: 'bold', position: 'relative' }}>Manage input</h1>

      <div style={{ display: 'flex', position: 'absolute', top: '20px', right: '20px', gap: '10px' }}>
        <button onClick={downloadExcel} style={{ padding: '5px 10px', backgroundColor: '#000d6b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '18px' }}>
          <FaDownload />
        </button>

        <label style={{ padding: '5px 10px', backgroundColor: '#fff', color: '#000d6b', border: '1px solid #000d6b', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <FaUpload />
          <input type="file" accept=".xlsx, .xls" onChange={handleUpload} style={{ display: 'none' }} />
        </label>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '40px',
          justifyContent: 'center',
          flexGrow: 1,
        }}
      >
        {routes.map((route, index) => (
          <Link
            key={index}
            to={`/${route}`}
            style={{
              textDecoration: 'none',
              width: '300px',
              height: '300px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                textAlign: 'center',
                padding: '20px',
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                boxShadow: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                boxShadow: hoveredIndex === index ? '0 20px 40px rgba(0, 0, 0, 0.35)' : '0 14px 28px rgba(0, 0, 0, 0.25)',
                position: 'relative',
                zIndex: hoveredIndex === index ? 10 : 1,
              }}
            >
              <img
                src={svg[index]}
                alt="Documents"
                style={{
                  width: '2.5cm',
                  height: '2.5cm',
                  color: '#ffffff',
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                }}
              />
              <p style={{ fontSize: '18px', color: 'BLACK' }}>
                {messages[index]}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectTrends;
