import React, { useState, useEffect } from 'react';
import { Plus, X, Trash2, UserMinus, Edit2, Check, XCircle } from 'lucide-react';
import { Card, Table, Button, Modal } from 'react-bootstrap';
import axios from 'axios'; // Make sure you have axios installed
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SKILL_OPTIONS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'C#',
  'AWS',
  'Azure',
  'DevOps',
  'Scrum Master',
  'Product Owner',
  'UI/UX',
  'Database',
  'Mobile Development'
];

export default function ScrumTeamManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState(() => {
    // Retrieve the team members from sessionStorage if available
    const storedMembers = sessionStorage.getItem('teamMembers');
    return storedMembers ? JSON.parse(storedMembers) : [];
  });
  const [editingMember, setEditingMember] = useState(null);
  const [editingSkills, setEditingSkills] = useState([]);
  const [formData, setFormData] = useState({
    teamName: '',
    name: '',
    joinDate: '',
    priorExp: '',
    skillSet: [],
    projectNameId: '',
    testerNameId: '' // Added for the selected tester ID
  });
  const [testers, setTesters] = useState([]);

  const navigate = useNavigate(); // Initialize useNavigate hook

  const [projectNameId, setProjectNameId] = useState([]);

  const calculateCptExp = (joinDate) => {
    if (!joinDate) return '0.0';
    const join = new Date(joinDate);
    const now = new Date();
    const diffInMonths = (now.getFullYear() - join.getFullYear()) * 12 + 
                        (now.getMonth() - join.getMonth());
    const years = Math.floor(diffInMonths / 12);
    const months = diffInMonths % 12;
    return `${years}.${months}`;
  };

  const calculateTotalExp = (priorExp, cptExp) => {
    const [priorYears, priorMonths] = priorExp.split('.').map(Number);
    const [cptYears, cptMonths] = cptExp.split('.').map(Number);
    
    let totalMonths = (priorYears * 12 + priorMonths) + (cptYears * 12 + cptMonths);
    const totalYears = Math.floor(totalMonths / 12);
    totalMonths = totalMonths % 12;
    
    return `${totalYears}.${totalMonths}`;
  };


  // UseEffect to make sure data is loaded from sessionStorage when the component mounts
useEffect(() => {
  const storedMembers = sessionStorage.getItem('teamMembers');
  if (storedMembers) {
    setTeamMembers(JSON.parse(storedMembers));
  }
}, []);

  useEffect(() => {
    const fetchProjects = async () => {
      const token = sessionStorage.getItem('access_token');
      if (!token) {
        console.error("Authorization token is missing!");
        return;
      }

      try {
        const response = await axios.get('https://frt4cnbr-5000.inc1.devtunnels.ms/get-user-projects', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const projects = response.data.projects;
        if (Array.isArray(projects)) {
          const projectNameFromSession = sessionStorage.getItem('projectName');
          const matchedProject = projects.find(project => project.project_name === projectNameFromSession);

          if (matchedProject) {
            sessionStorage.setItem('projectNameId', matchedProject.id);

            // Update formData with the matched projectNameId
            setProjectNameId(prevData => ({
              ...prevData,
              projectNameId: matchedProject.id
            }));

            console.log('Matched Project ID:', matchedProject.id);

            console.log('Matched Project ID:', projectNameId);


            // Fetch testers for the matched project
            fetchTesters(matchedProject.id);
          } else {
            console.log('No matching project found.');
          }
        } else {
          console.error('Projects not found or invalid format in response.');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    const fetchTesters = async (projectId) => {
      try {
        const token = sessionStorage.getItem('access_token'); // Retrieve the token from sessionStorage
        if (!token) {
          console.error('Authorization token is missing!');
          return;
        }
    
        // Include the token in the Authorization header
        const response = await axios.get(`https://frt4cnbr-5000.inc1.devtunnels.ms/tester_name_by_project/${projectId}`, {
          headers: {
            'Authorization': `Bearer ${token}` // Add the token to the header
          }
        });
    
        const testerData = response.data;
        setTesters(testerData); // Set the testers in the state
      } catch (error) {
        console.error('Error fetching testers:', error);
      }
    };
    

    fetchProjects();
  }, []); // Only run once when the component mounts

  useEffect(() => {
    if (formData.name.trim()) {
      const existingMember = teamMembers.find(
        member => member.name.toLowerCase() === formData.name.toLowerCase()
      );
      
      if (existingMember) {
        setFormData(prev => ({
          ...prev,
          joinDate: existingMember.joinDate,
          priorExp: existingMember.priorExp,
          skillSet: existingMember.skillSet,
          testerNameId: existingMember.testerNameId || ''
        }));
      }
    }
  }, [formData.name, teamMembers]);

  useEffect(() => {
    // Store the team members in sessionStorage whenever it changes
    sessionStorage.setItem('teamMembers', JSON.stringify(teamMembers));
  }, [teamMembers]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let teamNumber;
    let teamName = formData.teamName.trim();
    
    if (selectedTeam !== null) {
      // If editing, use the existing team name
      teamNumber = selectedTeam;
      const existingTeam = teamMembers.find((member) => member.teamNumber === teamNumber);
      teamName = existingTeam ? existingTeam.teamName : '';
    } else {
      const existingTeams = new Set(teamMembers.map(m => m.teamNumber));
      let nextTeamNumber = 1;
      while (existingTeams.has(nextTeamNumber)) {
        nextTeamNumber++;
      }
      teamNumber = nextTeamNumber;
    }

    const cptExp = calculateCptExp(formData.joinDate);
    const totalExp = calculateTotalExp(formData.priorExp, cptExp);

    const newMember = {
      id: Date.now(),
      teamNumber,
      teamName,
      name: formData.name,
      projectNameId:projectNameId.projectNameId,
      joinDate: formData.joinDate,
      priorExp: formData.priorExp,
      cptExp,
      totalExp,
      skillSet: formData.skillSet,
      testerNameId: formData.testerNameId // Added to the member data
      
 

    };

    setTeamMembers([...teamMembers, newMember]);
    setFormData({ teamName: '', name: '', joinDate: '', priorExp: '', skillSet: [], testerNameId: '' });
    setIsModalOpen(false);
    setSelectedTeam(null);
  };


  const submitToAPI = async () => {
    const headers = {
      'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`,
      'Content-Type': 'application/json',
    };
  
    // Retrieve the team members from sessionStorage
    const storedMembers = JSON.parse(sessionStorage.getItem('teamMembers')) || [];
  
    let payload = [];
  
    try {
      // If it's a PUT request (selectedTeam is not null), fetch the existing details first
      if (selectedTeam !== null) {
        // Loop through each member and fetch their details
        for (let member of storedMembers) {
          const response = await fetch(`https://frt4cnbr-5000.inc1.devtunnels.ms/agile_details/${member.testerNameId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`,
            },
          });
  
          if (response.ok) {
            const data = await response.json();
  
            // Use the fetched `id` (i.e., `data.id`) and map it into the payload
            payload.push({
              id: data[0].id,  // Assuming each member will return an array with one object
              total_experience: member.priorExp,
              cpt_experience_start_date: member.joinDate,
              total: member.totalExp,
              skillset: member.skillSet.split(','), // Assuming skillSet is a comma-separated string
            });
          } else {
            console.error('Failed to fetch data for member with id:', member.testerNameId);
          }
        }
      } else {
        // For POST request, use the original payload format without `id`
        payload = storedMembers.map((member) => ({
          scream_name: member.teamName || `team_${member.teamNumber}`,
          tester_name_id: member.testerNameId,
          cpt_experience_start_date: member.joinDate,
          total_experience: member.priorExp,
          skillset: member.skillSet,
          total: member.totalExp,
          project_name_id: member.projectNameId,
        }));
      }
  
      // API URL & Method (depending on PUT or POST)
      const apiUrl = selectedTeam !== null
        ? 'https://frt4cnbr-5000.inc1.devtunnels.ms/agile_details_put'
        : 'https://frt4cnbr-5000.inc1.devtunnels.ms/agile_details_post';
      
      const method = selectedTeam !== null ? 'PUT' : 'POST';
  
      // Make the request
      const apiResponse = await fetch(apiUrl, {
        method,
        headers,
        body: JSON.stringify(payload),
      });
  
      // Check if the response was successful
      if (apiResponse.ok) {
        alert('Data submitted successfully');

              // Remove the teamMembers key from sessionStorage after successful submission
      sessionStorage.removeItem('teamMembers');
      // sessionStorage.removeItem('projectName');
      sessionStorage.removeItem('projectNameId');
      sessionStorage.removeItem('agileType');

      const username = sessionStorage.getItem('username');
            // Navigate to the Defects page after a short delay
            if (username === 'admin') {
              setTimeout(() => {
                navigate('/AdminPanel/ScrumBuzz');
              }, 1000);  // 1-second delay before navigating to ScrumBuzz
            } else {
              setTimeout(() => {
                navigate('/AdminPanel/ManageDefects');
              }, 1000);  // 1-second delay before navigating to ManageDefects
            }  // 1-second delay before navigating
      

      } else {
        alert('Error submitting data: ' + apiResponse.statusText);
      }
    } catch (error) {
      alert('Error submitting data: ' + error.message);
    }
  };

  
  const deleteTeam = (teamNumber) => {
    const updatedMembers = teamMembers.filter(member => member.teamNumber !== teamNumber);
    setTeamMembers(updatedMembers);
  };

  const deleteMember = (memberId) => {
    const updatedMembers = teamMembers.filter(member => member.id !== memberId);
    setTeamMembers(updatedMembers);

    // Check if the team has no more members and delete the team if it's empty
    const teamMembersCount = updatedMembers.filter(member => member.teamNumber === teamMembers.find(m => m.id === memberId)?.teamNumber).length;
    if (teamMembersCount === 0) {
      const teamNumber = teamMembers.find(m => m.id === memberId)?.teamNumber;
      deleteTeam(teamNumber);
    }
  };

  const openAddMemberModal = (teamNumber) => {
    setSelectedTeam(teamNumber ?? null);
    const existingTeam = teamMembers.find((member) => member.teamNumber === teamNumber);
    
    setFormData({
      teamName: existingTeam ? existingTeam.teamName : '',
      name: '',
      joinDate: '',
      priorExp: '',
      skillSet: [],
      // skillSet: existingTeam ? existingTeam.skillSet : [], // Populate skillSet if team exists,
      testerNameId: ''
    });
    setIsModalOpen(true);
  };

  const startEditingSkills = (member) => {
    setEditingMember(member.id);
    setEditingSkills([...member.skillSet]);
  };

  const saveEditingSkills = (memberId) => {
    setTeamMembers(members =>
      members.map(member =>
        member.id === memberId
          ? { ...member, skillSet: editingSkills }
          : member
      )
    );
    setEditingMember(null);
  };
  const cancelEditingSkills = () => {
    setEditingMember(null);
    setEditingSkills([]);
  };

  const toggleSkill = (skill) => {
    setEditingSkills(current =>
      current.includes(skill)
        ? current.filter(s => s !== skill)
        : [...current, skill]
    );
  };

  const teamGroups = teamMembers.reduce((groups, member) => {
    const group = groups[member.teamNumber] || [];
    group.push(member);
    groups[member.teamNumber] = group;
    return groups;
  }, {});

  

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto" style={{ maxHeight: '600px', overflowY: 'auto' }}>
        <div>
          <h1 className="h2">Scrum Team Dashboard</h1>
          <Button
            variant="primary"
            onClick={() => openAddMemberModal()}
            style={{
              fontWeight: 'bold',
              color: '#ffffff',
              backgroundColor: '#000d6b',
              borderColor: '#000d6b',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Plus size={20} className="me-2" />
            Create New Team
          </Button>
        </div>

        <div className="space-y-8" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {Object.entries(teamGroups).map(([teamNumber, members]) => (
            <Card key={teamNumber} className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h2 className="h5">{members[0].teamName || `Scrum Team ${teamNumber}`}</h2>
                <div>
                  <Button
                    variant="primary"
                    onClick={() => openAddMemberModal(Number(teamNumber))}
                    className="me-2"
                    style={{
                      fontWeight: 'bold',
                      color: '#ffffff',
                      backgroundColor: '#000d6b',
                      borderColor: '#000d6b',
                      alignItems: 'center',
                    }}
                  >
                    <Plus size={20} /> Add Member
                  </Button>
                  <Button
                    variant="link"
                    onClick={() => deleteTeam(Number(teamNumber))}
                    className="text-danger"
                  >
                    <Trash2 size={20} />
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Resource Name</th>
                      <th>Join Date</th>
                      <th>Prior Exp</th>
                      <th>CPT Exp</th>
                      <th>Total Exp</th>
                      <th>Skills</th>
                      <th>Actions</th>
                    </tr>
                  </thead>


                  
                  <tbody>
  {members.map((member) => (
    <tr key={member.id}>

    <td>{member.name}</td>

      <td>{member.joinDate}</td>
      <td>{member.priorExp}</td>
      <td>{member.cptExp}</td>
      <td>{member.totalExp}</td>
      <td>
        {editingMember === member.id ? (
          <div className="d-flex flex-column gap-2">
            <div className="d-flex flex-wrap gap-2">
              {SKILL_OPTIONS.map((skill) => (
                <Button
                  key={skill}
                  variant={editingSkills.includes(skill) ? 'primary' : 'outline-secondary'}
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </Button>
              ))}
            </div>
            <div className="d-flex gap-2">
              <Button
                variant="success"
                onClick={() => saveEditingSkills(member.id)}
              >
                <Check size={20} />
              </Button>
              <Button
                variant="danger"
                onClick={cancelEditingSkills}
              >
                <XCircle size={20} />
              </Button>
            </div>
          </div>
        ) : (
          <div className="d-flex align-items-center gap-2">
            <div className="d-flex flex-wrap gap-1">
              {member.skillSet.map((skill, index) => (
                <span key={index} className="badge bg-info text-white">{skill}</span>
              ))}
            </div>
            <Button
              variant="link"
              onClick={() => startEditingSkills(member)}
            >
              <Edit2 size={16} />
            </Button>
          </div>
        )}
      </td>
      <td>
        <Button
          variant="link"
          className="text-danger"
          onClick={() => deleteMember(member.id)}
        >
          <UserMinus size={20} />
        </Button>
      </td>
    </tr>
  ))}
</tbody>

                </Table>
              </Card.Body>
            </Card>
          ))}
        </div>

                {/* Final Submit Button */}
                <Button
          variant="primary"
          onClick={submitToAPI}
          style={{
            fontWeight: 'bold',
            color: '#ffffff',
            backgroundColor: '#000d6b',
            borderColor: '#000d6b',
            marginBottom: '20px',
          }}
        >
          Submit All Changes
        </Button>

        {/* Modal */}
        <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedTeam ? `Add Member to ${formData.teamName || 'Scrum Team'}` : 'Create New Scrum Team'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit} style={{ maxHeight: '600px', overflowY: 'auto' }}>
              <div className="mb-3">
                <label className="form-label">Team Name</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Select Resource </label>
                
                <select
                  value={formData.testerNameId}
                  onChange={(e) => {
                    const selectedTesterId = e.target.value;
                    const selectedTester = testers.find(tester => tester.id === Number(selectedTesterId));

                    setFormData({
                      ...formData,
                      testerNameId: selectedTesterId,
                      name: selectedTester ? selectedTester.tester_name : '', // Set name based on selected tester
                    });
                  }}
                  className="form-control"
                >
                  <option value="">Select Tester</option>
                  {testers.map(tester => (
                    <option key={tester.id} value={tester.id}>
                      {tester.tester_name}
                    </option>
                  ))}
                </select>



              </div>
              <div className="mb-3">
                <label className="form-label">CPT JOD</label>
                <input
                  type="date"
                  className="form-control"
                  required
                  value={formData.joinDate}
                  onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Prior Experience (years.months)</label>
                <input
                  type="number"
                  className="form-control"
                  required
                  pattern="\d+\.\d+" // This allows a number with a decimal point, e.g., 4.5
                  placeholder="e.g., 2.6"
                  value={formData.priorExp}
                  onChange={(e) => setFormData({ ...formData, priorExp: e.target.value })}
                  step="0.1" // Allows decimal input
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Skill Set</label>
                <div className="d-flex flex-wrap gap-2">
                  {SKILL_OPTIONS.map((skill) => (
                    <Button
                      key={skill}
                      variant={formData.skillSet.includes(skill) ? 'primary' : 'outline-secondary'}
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          skillSet: prev.skillSet.includes(skill)
                            ? prev.skillSet.filter(s => s !== skill)
                            : [...prev.skillSet, skill]
                        }));
                      }}
                    >
                      {skill}
                    </Button>
                  ))}
                </div>
              </div>
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                style={{
                  fontWeight: 'bold',
                  color: '#ffffff',
                  backgroundColor: '#000d6b',
                  borderColor: '#000d6b',
                  marginBottom: '20px',
                  alignItems: 'center',    // Centers the icon and text vertically
                }}
              >
                Submit
              </Button>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}