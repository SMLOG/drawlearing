import React, { useState } from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import Nav from './Nav'; // Import the Nav component

const LayoutContainer = styled.div`
  display: flex;
  position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;


`;

const Aside = styled.aside`
  width: 250px; /* Width of the sidebar */
  background: #f4f4f4;
  padding: 20px;
  position: fixed;
  top: 50px; /* Below the nav */
  left: 0;
  height: calc(100% - 50px); /* Adjust based on nav height */
  transform: translateX(-100%); /* Hide by default */
  transition: transform 0.3s ease;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  z-index: 11000; /* Updated z-index for the aside */

  &.visible {
    transform: translateX(0); /* Show when visible */
  }
`;

const Mask = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  z-index: 10999; /* Updated z-index for the mask */
  display: ${props => (props.$visible ? 'block' : 'none')}; /* Show/hide based on state */
`;

const Main = styled.main`
  flex-grow: 1; /* Allow the main content to grow */
  position: relative; /* Position relative for inner elements */
  margin-top: 50px; /* Adjust based on nav height */
  padding: 20px;
  transition: margin-left 0.3s ease;
`;

const Layout = () => {
  const [isAsideVisible, setAsideVisible] = useState(false);

  const toggleAside = () => {
    setAsideVisible(!isAsideVisible);
  };



  return (
    <LayoutContainer>
      <Nav toggleAside={toggleAside} /> {/* Pass the toggle function to Nav */}
      <Aside className={isAsideVisible ? 'visible' : ''}>
        <h2>Sidebar</h2>
        <p>Some additional content here.</p>
      </Aside>
      <Mask $visible={isAsideVisible} onClick={toggleAside} />
      <Main>
        <Outlet />
      </Main>
    </LayoutContainer>
  );
};

export default Layout;
