import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from 'axios';

// SVG Imports
import logo from "../components/panel/assets/logo.svg";
import expandall from "../components/panel/assets/expand-all.svg";
import Calender from "../components/panel/assets/sceduled.svg";
import Projects from "../components/panel/assets/projects.svg";
import PowerOff from "../components/panel/assets/power-off-solid.svg";

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const SidebarContainer = styled.div`
  background-color: var(--black);
  width: ${(props) => (props.clicked ? "12rem" : "3.5rem")};
  height: 100vh; /* Ensuring full height */
  border-radius: 0 30px 30px 0;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
  transition: width 0.5s ease;
  overflow: hidden; /* Ensures no overflow */
  
  &:hover {
    width: 12rem; /* Expands when hovered */
  }
`;

const Logo = styled.div`
  width: 2rem;
  img {
    width: 100%;
    height: auto;
  }
`;

const SlickBar = styled.ul`
  color: var(--white);
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--black);
  padding: 2rem 0;
  width: 100%;
  overflow-y: auto; /* Allows vertical scrolling */
  height: calc(100% - 4rem); /* Adjust based on logo and logout space */
  margin-bottom: auto; /* Pushes logout button to the bottom */
`;

const Item = styled(NavLink)`
  text-decoration: none;
  color: var(--white);
  width: 100%;
  padding: 1rem 0;
  cursor: pointer;
  display: flex;
  padding-left: 1rem;
  &:hover {
    border-right: 4px solid var(--white);
    img {
      filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%);
    }
  }
  img {
    width: 1.2rem;
    height: auto;
    filter: invert(92%) sepia(4%) saturate(1033%) hue-rotate(169deg) brightness(78%) contrast(85%);
  }
`;

const Text = styled.span`
  width: ${(props) => (props.clicked || props.hovered ? "100%" : "0")}; /* Adjusted to show on hover too */
  overflow: hidden;
  margin-left: ${(props) => (props.clicked || props.hovered ? "1.5rem" : "0")};
  transition: all 0.3s ease;
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: ${(props) => (props.clicked ? "0.5rem" : "0rem")};
  padding: 1rem;
  overflow-y: auto; /* Allows vertical scrolling */
  transition: margin-left 0.5s ease;
`;

const Sidebar = () => {
  const navigate = useNavigate();
  const [click] = useState(false);
  const [hovered, setHovered] = useState(false);  // Track hover state
  const [role, setRole] = useState(null); // To store the fetched role

  useEffect(() => {
    const fetchRole = async () => {
      try {
        // Get the access token from sessionStorage
        const token = sessionStorage.getItem('access_token');
        if (!token) {
          console.log('No access token found');
          return;
        }

        // Fetch the role using the API
        const response = await axios.get('http://localhost:5000/get-role', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Set the role state
        setRole(response.data.role);
      } catch (error) {
        console.error('Error fetching role:', error);
      }
    };

    fetchRole();
  }, []);

  // const handleClick = () => setClick(!click);

  const handleLogout = () => {
    sessionStorage.clear();
    console.log('Logged out');
    navigate('/');
  };

  return (
    <Container>
      <SidebarContainer 
        clicked={click} 
        onMouseEnter={() => setHovered(true)}  // Set hover state to true when mouse enters
        onMouseLeave={() => setHovered(false)} // Set hover state to false when mouse leaves
      >
        {/* <Button clicked={click} onClick={handleClick} /> */}
        <Logo>
          <img src={logo} alt="logo" />
        </Logo>
        <SlickBar>
          {/* Render items based on the role */}
          {role === "admin" && (
            <>
              <Item activeClassName="active" to="/AdminPanel/adminaddproject">
                <img src={Projects} alt="Add Project" />
                <Text clicked={click} hovered={hovered}>Add Project</Text>
              </Item>
              <Item activeClassName="active" to="/AdminPanel/viewproject">
                <img src={Projects} alt="Projects" />
                <Text clicked={click} hovered={hovered}>view project</Text>
              </Item>
              <Item activeClassName="active" to="/AdminPanel/project-trends">
                <img src={expandall} alt="Manage inputs" />
                <Text clicked={click} hovered={hovered}>Manage input</Text>
              </Item>
              <Item activeClassName="active" to="/AdminPanel/add-user">
                <img src={expandall} alt="Manage inputs" />
                <Text clicked={click} hovered={hovered}>add user</Text>
              </Item>
              <Item activeClassName="active" to="/AdminPanel/matrix-view">
                <img src={expandall} alt="matrix view" />
                <Text clicked={click} hovered={hovered}>matrix input</Text>
              </Item>
              {/* <Item activeClassName="active" to="/AdminPanel/AdminScrumBuzz">
                <img src={expandall} alt="matrix view" />
                <Text clicked={click} hovered={hovered}>ScrumDetails</Text>
              </Item> */}
            </>
          )}
          
          {role === "TestLead" && (
            <>
              <Item activeClassName="active" to="/TestLead/project-info">
                <img src={Projects} alt="Projects" />
                <Text clicked={click} hovered={hovered}>Projects</Text>
              </Item>
              <Item activeClassName="active" to="/TestLead/project-trends">
                <img src={expandall} alt="Manage input" />
                <Text clicked={click} hovered={hovered}>Manage input</Text>
              </Item>
            </>
          )}

          {role === "Manager" && (
            <>  
              <Item activeClassName="active" to="/ManagerView/manager_view">
                <img src={Calender} alt="Manager View" />
                <Text clicked={click} hovered={hovered}>Manager View</Text>
              </Item>
              <Item activeClassName="active" to="/AdminPanel/Summary">
                <img src={expandall} alt="Manager View" />
                <Text clicked={click} hovered={hovered}>Metrics Summary</Text>
              </Item>
            </>
          )}
        </SlickBar>

        {/* Logout Button at the bottom */}
        <Item onClick={handleLogout} activeClassName="active" to="/">
          <img src={PowerOff} alt="Logout" />
          <Text clicked={click} hovered={hovered}>Logout</Text>
        </Item>
      </SidebarContainer>
      <MainContent clicked={click}>
        <Outlet />
      </MainContent>
    </Container>
  );
};

export default Sidebar;
