import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Dropdown, Spinner, Modal } from 'react-bootstrap';

const ProjectForm = ({ projectData = null }) => {
  // State variables
  const [formData, setFormData] = useState({
    projectName: '',
    confirmProjectName: '',
    rag: '',
    rag_details: '',
    billing_type: '',
    automation: 'No',
    automation_details: '',
    ai_used: 'No',
    ai_used_details: '',
    tester_count: 0,
  });
  const [selectedTesters, setSelectedTesters] = useState({
    billable: [],
    nonbillable: [],
  });
  const [loadingTesters, setLoadingTesters] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [showCreateTesterModal, setShowCreateTesterModal] = useState(false);
  const [selectedTesterType, setSelectedTesterType] = useState('');

  // Placeholder function to simulate loading available testers
  const getAvailableTesters = (type) => {
    const allTesters = [
      { id: 1, tester_name: 'Tester 1' },
      { id: 2, tester_name: 'Tester 2' },
      { id: 3, tester_name: 'Tester 3' },
    ];
    return allTesters.filter(
      (tester) =>
        !selectedTesters.billable.some(
          (selectedTester) => selectedTester.tester_name === tester.tester_name
        ) &&
        !selectedTesters.nonbillable.some(
          (selectedTester) => selectedTester.tester_name === tester.tester_name
        )
    );
  };

  // Function to handle edit mode: Populate form data with existing project
  useEffect(() => {
    if (projectData) {
      setFormData({
        projectName: projectData.projectName || '',
        confirmProjectName: projectData.confirmProjectName || '',
        rag: projectData.rag || '',
        rag_details: projectData.rag_details || '',
        billing_type: projectData.billing_type || '',
        automation: projectData.automation || 'No',
        automation_details: projectData.automation_details || '',
        ai_used: projectData.ai_used || 'No',
        ai_used_details: projectData.ai_used_details || '',
        tester_count: projectData.tester_count || 0,
      });

      // If testers are available in projectData, set them
      setSelectedTesters({
        billable: projectData.billableTesters || [],
        nonbillable: projectData.nonbillableTesters || [],
      });
    }
  }, [projectData]);

  // Handler for the form submit to create or update the project
  const handleProjectSubmit = async (e) => {
    e.preventDefault();

    // Validation check for project name
    if (formData.projectName !== formData.confirmProjectName) {
      setError('Project names do not match.');
      return;
    }

    setIsPending(true); // Indicate that the submission is in progress

    // Here, you would normally make an API call to create or update the project
    try {
      const response = await fetch('/api/create-or-update-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create or update project');
      }

      setSuccessMessage('Project saved successfully!');
    } catch (error) {
      setError(error.message); // Show error message on failure
    } finally {
      setIsPending(false);
    }
  };

  // Handles adding testers to the billable or non-billable list
  const handleTesterSelection = (tester, type) => {
    setSelectedTesters((prev) => {
      const newTesters = { ...prev };
      if (type === 'billable') {
        newTesters.billable = [...newTesters.billable, tester];
      } else {
        newTesters.nonbillable = [...newTesters.nonbillable, tester];
      }
      return newTesters;
    });
  };

  // Function to handle modal visibility for adding a new tester
  const handleCreateTester = (name, type) => {
    const newTester = { id: Date.now(), tester_name: name }; // Example, you would get this from your backend
    handleTesterSelection(newTester, type);
    setShowCreateTesterModal(false); // Close the modal after adding the tester
  };

  return (
    <div className="container mt-5">
      <Card>
        <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff' }}>
          {projectData ? 'Edit Project' : 'Add Project'}
        </Card.Header>
        <Card.Body>
          {error && <p className="text-danger">{error}</p>}
          {successMessage && <p className="text-success">{successMessage}</p>}
          <Form onSubmit={handleProjectSubmit}>
            {/* Project Name Input */}
            <Form.Group controlId="projectName">
              <Form.Label>Project Name:</Form.Label>
              <Form.Control
                type="text"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                required
              />
            </Form.Group>

            {/* Confirm Project Name */}
            <Form.Group controlId="confirmProjectName">
              <Form.Label>Confirm Project Name:</Form.Label>
              <Form.Control
                type="text"
                value={formData.confirmProjectName}
                onChange={(e) => setFormData({ ...formData, confirmProjectName: e.target.value })}
                required
              />
            </Form.Group>

            {/* rag */}
            <Form.Group controlId="rag">
              <Form.Label>rag</Form.Label>
              <Form.Control
                type="text"
                value={formData.rag}
                onChange={(e) => setFormData({ ...formData, rag: e.target.value })}
                required
              />
            </Form.Group>

            {/* Billable Testers Dropdown */}
            <Form.Group controlId="billable">
              <Form.Label>Billable Testers</Form.Label>
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {selectedTesters.billable.length > 0
                    ? selectedTesters.billable.map((t) => t.tester_name).join(', ')
                    : 'Select Billable Testers'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {loadingTesters ? (
                    <Dropdown.ItemText>
                      <Spinner animation="border" size="sm" />
                      Loading...
                    </Dropdown.ItemText>
                  ) : (
                    getAvailableTesters('billable').map((tester) => (
                      <Dropdown.Item
                        key={tester.id}
                        onClick={() => handleTesterSelection(tester, 'billable')}
                      >
                        {tester.tester_name}
                      </Dropdown.Item>
                    ))
                  )}
                  <Dropdown.Item onClick={() => { setSelectedTesterType('billable'); setShowCreateTesterModal(true); }}>
                    Add New Tester
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>

            {/* Non-Billable Testers Dropdown */}
            <Form.Group controlId="nonbillable">
              <Form.Label>Non-Billable Testers</Form.Label>
              <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  {selectedTesters.nonbillable.length > 0
                    ? selectedTesters.nonbillable.map((t) => t.tester_name).join(', ')
                    : 'Select Non-Billable Testers'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {loadingTesters ? (
                    <Dropdown.ItemText>
                      <Spinner animation="border" size="sm" />
                      Loading...
                    </Dropdown.ItemText>
                  ) : (
                    getAvailableTesters('nonbillable').map((tester) => (
                      <Dropdown.Item
                        key={tester.id}
                        onClick={() => handleTesterSelection(tester, 'nonbillable')}
                      >
                        {tester.tester_name}
                      </Dropdown.Item>
                    ))
                  )}
                  <Dropdown.Item onClick={() => { setSelectedTesterType('nonbillable'); setShowCreateTesterModal(true); }}>
                    Add New Tester
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>

            {/* Submit Button */}
            <Button variant="primary" type="submit" style={{ fontWeight: 'bold', color: '#ffffff', backgroundColor: '#000d6b', borderColor: '#000d6b' }}>
              {isPending ? 'Saving...' : projectData ? 'Update Project' : 'Create Project'}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Modal for creating tester */}
      <Modal show={showCreateTesterModal} onHide={() => setShowCreateTesterModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Tester</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateTester(e.target.testerName.value, selectedTesterType);
            }}
          >
            <Form.Group controlId="testerName">
              <Form.Label>Tester Name:</Form.Label>
              <Form.Control type="text" name="testerName" required />
            </Form.Group>
            <Button variant="primary" type="submit">
              Create Tester
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProjectForm;
