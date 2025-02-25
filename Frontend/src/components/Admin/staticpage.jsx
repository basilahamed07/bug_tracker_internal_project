import './staticpage.css';
import React from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
    

const ScrumTeamDashboard = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const teamData = {
    team1: [
      { name: "member1" },
      { name: "member2" },
      { name: "member3" },
      { name: "member4" }, 
      { name: "member5" }
    ],
    team2: [
      { name: "member7" },
      { name: "member9" },
      { name: "member8" },
      { name: "member11" },
      { name: "member13" }
    ],
    team3: [
      { name: "member6" },
      { name: "member14" }
    ]
  };

  const allMembers = [
    {
      name: "member1",
      priorExp: 3.4,
      cptExp: 1.2,
      totalExp: 4.6,
      skills: [
        "JavaScript", "TypeScript", "Python"
      ]
    },
    {
      name: "member2",
      priorExp: 4.4,
      cptExp: 1.2,
      totalExp: 5.6,
      skills: [
        "JavaScript", "TypeScript", "Python", "Java"
      ]
    },
    {
      name: "member3",
      priorExp: 5.4,
      cptExp: 1.2,
      totalExp: 6.6,
      skills: [
        "JavaScript", "DevOps", "UI/UX", "Product Owner"
      ]
    },
    {
      name: "member4",
      priorExp: 6.4,
      cptExp: 1.2,
      totalExp: 7.6,
      skills: [
        "JavaScript", "TypeScript", "Python", "DevOps", "UI/UX", "Product Owner"
      ]
    },
    {
      name: "member5",
      priorExp: 7.4,
      cptExp: 1.2,
      totalExp: 8.6,
      skills: [
        "JavaScript", "TypeScript", "Python"
      ]
    },
    {
      name: "member7",
      priorExp: 8.4,
      cptExp: 1.2,
      totalExp: 9.6,
      skills: [
        "JavaScript", "TypeScript", "DevOps", "UI/UX", "Product Owner"
      ]
    },
    {
      name: "member9",
      priorExp: 9.4,
      cptExp: 1.2,
      totalExp: 10.6,
      skills: [
        "JavaScript", "TypeScript", "Python", "Java", "C#"
      ]
    },
    {
      name: "member8",
      priorExp: 10.4,
      cptExp: 1.2,
      totalExp: 11.6,
      skills: [
        "Python", "Java", "C#", "React", "AWS", "Azure", "Node.js"
      ]
    },
    {
      name: "member11",
      priorExp: 11.4,
      cptExp: 1.2,
      totalExp: 12.6,
      skills: [
        "DevOps", "UI/UX", "Product Owner"
      ]
    },
    {
      name: "member13",
      priorExp: 12.4,
      cptExp: 1.2,
      totalExp: 13.6,
      skills: [
        "Azure", "Node.js", "DevOps", "UI/UX", "Product Owner"
      ]
    },
    {
      name: "member6",
      priorExp: 14.4,
      cptExp: 1.2,
      totalExp: 15.6,
      skills: [
        "JavaScript", "TypeScript", "Python", "Java", "DevOps", "UI/UX", "Product Owner"
      ]
    },
    {
      name: "member14",
      priorExp: 13.4,
      cptExp: 1.2,
      totalExp: 14.6,
      skills: [
        "JavaScript", "TypeScript", "Python", "Java", "C#", "React", "AWS", "Azure", "Node.js"
      ]
    }
  ];

  const renderTeamMembersCards = (team) => {
    return team.map((member, index) => (
      <div className="team-card" key={index} onClick={() => alert(`You clicked on ${member.name}`)}>
        <div className="team-card-body">
          <h5 className="team-card-title">{member.name}</h5>
        </div>
      </div>
    ));
  };

  const renderMemberDetails = () => {
    return allMembers.map((member, index) => (
      <tr key={index}>
        <td>{member.name}</td>
        <td>2020-11-13</td>
        <td>{member.priorExp}</td>
        <td>{member.cptExp}</td>
        <td>{member.totalExp}</td>
        <td>
          {member.skills.map((skill, i) => (
            <span key={i} className="badge bg-info text-dark me-1">{skill}</span>
          ))}
        </td>
      </tr>
    ));
  };

  // Function to handle team card click and navigate to ManagerView/SprintStatus
  const handleTeamClick = (teamName) => {
    navigate(`/ManagerView/SprintStatus?team=${teamName}`); // Navigating to the new path with the team name
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center" style={{ color: "#000d6b" }}>Scrum Team Dashboard</h2>

      {/* Team Cards Layout - Flexbox */}
      <div className="team-cards-container d-flex justify-content-center mb-4">
        <div className="card team-card shadow-lg p-3 mb-4" style={{ width: "18rem", cursor: "pointer", transition: "transform 0.3s ease" }} onClick={() => handleTeamClick('team1')}>
          <div className="card-header text-white" style={{ backgroundColor: "#000d6b" }}>
            <h5>Team 1</h5>
          </div>
          <div className="card-body" style={{ backgroundColor: "#f8f9fa", borderRadius: "8px", paddingLeft: "1.5rem" }}>
            <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
              {teamData.team1.map((member, index) => (
                <li key={index} style={{ marginBottom: "8px" }}>{member.name}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card team-card shadow-lg p-3 mb-4" style={{ width: "18rem", cursor: "pointer", transition: "transform 0.3s ease" }} onClick={() => handleTeamClick('team2')}>
          <div className="card-header text-white" style={{ backgroundColor: "#000d6b" }}>
            <h5>Team 2</h5>
          </div>
          <div className="card-body" style={{ backgroundColor: "#f8f9fa", borderRadius: "8px", paddingLeft: "1.5rem" }}>
            <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
              {teamData.team2.map((member, index) => (
                <li key={index} style={{ marginBottom: "8px" }}>{member.name}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card team-card shadow-lg p-3 mb-4" style={{ width: "18rem", cursor: "pointer", transition: "transform 0.3s ease" }} onClick={() => handleTeamClick('team3')}>
          <div className="card-header text-white" style={{ backgroundColor: "#000d6b" }}>
            <h5>Team 3</h5>
          </div>
          <div className="card-body" style={{ backgroundColor: "#f8f9fa", borderRadius: "8px", paddingLeft: "1.5rem" }}>
            <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
              {teamData.team3.map((member, index) => (
                <li key={index} style={{ marginBottom: "8px" }}>{member.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* All Members Details Table */}
      <div className="card">
        <div className="card-header" style={{ backgroundColor: "#000d6b", color: "white" }}>
          <h5>All Members Details</h5>
        </div>
        <div className="card-body">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>RESOURCE NAME</th>
                <th>JOIN DATE</th>
                <th>PRIOR EXP</th>
                <th>CPT EXP</th>
                <th>TOTAL EXP</th>
                <th>SKILLS</th>
              </tr>
            </thead>
            <tbody>
              {renderMemberDetails()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScrumTeamDashboard;
