import React from "react";
import axios from "axios";

const GenerateReport = () => {
  const handleGenerateReport = async () => {
    try {
      // Make an API call to generate the PDF report
      const response = await axios.get("https://h25ggll0-5000.inc1.devtunnels.ms/pdf_report", {
        responseType: "blob",  // Ensure the response is a PDF
      });

      // Create a URL for the PDF blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a link element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tester_report.pdf");

      // Trigger the download
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error generating the report:", error);
    }
  };

  return (
    <div>
      <button onClick={handleGenerateReport}>Generate Full Report</button>
    </div>
  );
};

export default GenerateReport;
