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

  const [errors, setErrors] = useState({
    teamName: '',
    testerNameId: '',
    joinDate: '',
    priorExp: '',
    skillSet: ''
  });

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
        const response = await axios.get('https://h25ggll0-5000.inc1.devtunnels.ms/get-user-projects', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const projects = response.data.projects;
        if (Array.isArray(projects)) {
          // Get project ID from sessionStorage
          const projectId = sessionStorage.getItem('projectID');
          if (projectId) {
            const matchedProject = projects.find(project => project.id === parseInt(projectId));

            if (matchedProject) {
              sessionStorage.setItem('project_name_id', matchedProject.id);
              setProjectNameId(prevData => ({
                ...prevData,
                projectNameId: matchedProject.id
              }));
              
              // Call fetchTesters with the project ID
              fetchTesters(projectId);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    const fetchTesters = async (projectId) => {
      try {
        const token = sessionStorage.getItem('access_token');
        if (!token || !projectId) {
          console.error('Missing token or project ID');
          return;
        }
    
        const response = await axios.get(`https://h25ggll0-5000.inc1.devtunnels.ms/tester_name_by_project/${projectId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
    
        if (response.data && Array.isArray(response.data)) {
          setTesters(response.data);
          console.log('Fetched testers:', response.data);
        } else {
          console.error('Invalid tester data format:', response.data);
        }
      } catch (error) { 
        console.error('Error fetching testers:', error);
      }
    };

    fetchProjects();
  }, []); // Only run once when component mounts

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

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      teamName: '',
      testerNameId: '',
      joinDate: '',
      priorExp: '',
      skillSet: ''
    };

    // Team name validation - enhanced
    if (!formData.teamName || !formData.teamName.trim()) {
      newErrors.teamName = 'Team name is required';
      isValid = false;
    } else if (formData.teamName.trim().length < 3) {
      newErrors.teamName = 'Team name must be at least 3 characters';
      isValid = false;
    }

    // Resource selection validation
    if (!formData.testerNameId) {
      newErrors.testerNameId = 'Please select a resource';
      isValid = false;
    }

    // Join date validation - enhanced
    if (!formData.joinDate) {
      newErrors.joinDate = 'Join date is required';
      isValid = false;
    } else {
      const joinDate = new Date(formData.joinDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
      
      if (isNaN(joinDate.getTime())) {
        newErrors.joinDate = 'Please enter a valid date';
        isValid = false;
      } else if (joinDate > today) {
        newErrors.joinDate = 'Join date cannot be in the future';
        isValid = false;
      }
    }

    // Prior experience validation - enhanced
    if (!formData.priorExp) {
      newErrors.priorExp = 'Prior experience is required';
      isValid = false;
    } else {
      const priorExpStr = formData.priorExp.toString();
      const priorExpFloat = parseFloat(priorExpStr);
      const [years, months] = priorExpStr.split('.');
      
      if (isNaN(priorExpFloat) || priorExpFloat < 0) {
        newErrors.priorExp = 'Please enter a valid experience (e.g., 2.6)';
        isValid = false;
      } else if (months && (parseInt(months) >= 12 || months.length > 2)) {
        newErrors.priorExp = 'Months should be between 0 and 11';
        isValid = false;
      }
    }

    // Skills validation - enhanced
    if (!formData.skillSet || formData.skillSet.length === 0) {
      newErrors.skillSet = 'Please select at least one skill';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'teamName':
        if (!value || !value.trim()) {
          return 'Team name is required';
        } else if (value.trim().length < 3) {
          return 'Team name must be at least 3 characters';
        }
        break;
  
      case 'testerNameId':
        if (!value) {
          return 'Please select a resource';
        }
        break;
  
      case 'joinDate':
        if (!value) {
          return 'Join date is required';
        } else {
          const joinDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (isNaN(joinDate.getTime())) {
            return 'Please enter a valid date';
          } else if (joinDate > today) {
            return 'Join date cannot be in the future';
          }
        }
        break;
  
      case 'priorExp':
        if (!value) {
          return 'Prior experience is required';
        } else {
          const priorExpStr = value.toString();
          const priorExpFloat = parseFloat(priorExpStr);
          const [years, months] = priorExpStr.split('.');
          
          if (isNaN(priorExpFloat) || priorExpFloat < 0) {
            return 'Please enter a valid experience (e.g., 2.6)';
          } else if (months && (parseInt(months) >= 12 || months.length > 2)) {
            return 'Months should be between 0 and 11';
          }
        }
        break;
  
      case 'skillSet':
        if (!value || value.length === 0) {
          return 'Please select at least one skill';
        }
        break;
  
      default:
        return '';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

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
          const response = await fetch(`https://h25ggll0-5000.inc1.devtunnels.ms/agile_details/${member.testerNameId}`, {
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
        ? 'https://h25ggll0-5000.inc1.devtunnels.ms/agile_details_put'
        : 'https://h25ggll0-5000.inc1.devtunnels.ms/agile_details_post';
      
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

  const hasTeams = Object.keys(teamGroups).length > 0;

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
          disabled={!hasTeams}
          style={{
            fontWeight: 'bold',
            color: '#ffffff',
            backgroundColor: '#000d6b',
            borderColor: '#000d6b',
            marginBottom: '20px',
            opacity: hasTeams ? 1 : 0.5, // Visual feedback for disabled state
          }}
        >
          {hasTeams ? 'Submit All Changes' : 'Sbumit All Changes'}
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
                  className={`form-control ${errors.teamName ? 'is-invalid' : ''}`}
                  value={formData.teamName}
                  placeholder="Enter team name (min. 3 characters)"
                  onChange={(e) => {
                    setFormData({ ...formData, teamName: e.target.value });
                    if (errors.teamName) setErrors({ ...errors, teamName: '' });
                  }}
                  onBlur={(e) => {
                    const error = validateField('teamName', e.target.value);
                    setErrors(prev => ({ ...prev, teamName: error }));
                  }}
                />
                {errors.teamName && <div className="invalid-feedback">{errors.teamName}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Select Resource </label>
                
                <select
                  value={formData.testerNameId}
                  onChange={(e) => {
                    const selectedTesterId = e.target.value;
                    const selectedTester = testers.find(tester => tester.id === parseInt(selectedTesterId));

                    setFormData({
                      ...formData,
                      testerNameId: selectedTesterId,
                      name: selectedTester ? selectedTester.tester_name : '', // Set name based on selected tester
                    });
                    if (errors.testerNameId) {
                      setErrors({ ...errors, testerNameId: '' });
                    }
                  }}
                  className={`form-control ${errors.testerNameId ? 'is-invalid' : ''}`}
                  onBlur={(e) => {
                    const error = validateField('testerNameId', e.target.value);
                    setErrors(prev => ({ ...prev, testerNameId: error }));
                  }}
                >
                  <option value="">Select Tester</option>
                  {testers.map(tester => (
                    <option key={tester.id} value={tester.id}>
                      {tester.tester_name}
                    </option>
                  ))}
                </select>
                {errors.testerNameId && <div className="invalid-feedback">{errors.testerNameId}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">CPT JOD</label>
                <input
                  type="date"
                  className={`form-control ${errors.joinDate ? 'is-invalid' : ''}`}
                  value={formData.joinDate}
                  placeholder="Select join date"
                  onChange={(e) => {
                    setFormData({ ...formData, joinDate: e.target.value });
                    if (errors.joinDate) setErrors({ ...errors, joinDate: '' });
                  }}
                  onBlur={(e) => {
                    const error = validateField('joinDate', e.target.value);
                    setErrors(prev => ({ ...prev, joinDate: error }));
                  }}
                />
                {errors.joinDate && <div className="invalid-feedback">{errors.joinDate}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Prior Experience (years.months)</label>
                <input
                  type="text"
                  className={`form-control ${errors.priorExp ? 'is-invalid' : ''}`}
                  placeholder="e.g., 2.6"
                  value={formData.priorExp}
                  onChange={(e) => {
                    setFormData({ ...formData, priorExp: e.target.value });
                    if (errors.priorExp) setErrors({ ...errors, priorExp: '' });
                  }}
                  onBlur={(e) => {
                    const error = validateField('priorExp', e.target.value);
                    setErrors(prev => ({ ...prev, priorExp: error }));
                  }}
                />
                {errors.priorExp && <div className="invalid-feedback">{errors.priorExp}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Skill Set</label>
                <div className={`d-flex flex-wrap gap-2 ${errors.skillSet ? 'is-invalid' : ''}`}>
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
                        if (errors.skillSet) {
                          setErrors({ ...errors, skillSet: '' });
                        }
                      }}
                    >
                      {skill}
                    </Button>
                  ))}
                </div>
                {errors.skillSet && <div className="text-danger mt-2">{errors.skillSet}</div>}
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