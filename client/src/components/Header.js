import React from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <Navbar color="primary" light expand="md">
      <NavbarBrand tag={Link} to="/" className="kindred-brand">
        <div className="kindred-title">Kindred</div>
        <div className="kindred-subtitle">Welcome to Kindred!</div>
      </NavbarBrand>
      <Nav className="ml-auto" navbar>
        <NavItem>
          <NavLink tag={Link} to="/search" className="custom-button">
            Search
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/signup" className="custom-button">
            Signup
          </NavLink>
        </NavItem>
        {/* Add other NavLink components for different routes */}
      </Nav>
    </Navbar>
  );
};

export default Header;

