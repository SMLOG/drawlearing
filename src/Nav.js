import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import styled from 'styled-components';

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #333;
  color: #fff;
  padding: 10px;
  position: fixed;
  top: 0;
  left: 0; /* Align to the left */
  right: 0; /* Align to the right */
  z-index: 1000;
  /* Removed height to allow dynamic sizing */
`;

const Hamburger = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
`;

const Line = styled.div`
  width: 100%;
  height: 4px;
  background: #fff;
  margin: 2px 0;
`;

const NavList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex; /* Use flexbox for the list */
  gap: 15px; /* Space between items */
`;

const NavItem = styled.li`
  a {
    color: #fff;
    text-decoration: none;
    padding: 10px;
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

const Nav = ({ toggleAside }) => {
  return (
    <NavContainer>
      <Hamburger onClick={toggleAside}>
        <Line />
        <Line />
        <Line />
      </Hamburger>
      <NavList>
        <NavItem><Link to="/">Home</Link></NavItem>
        <NavItem><Link to="/books">Books</Link></NavItem>
        <NavItem><Link to="/draw">Draw</Link></NavItem>
      </NavList>
    </NavContainer>
  );
};

export default Nav;
