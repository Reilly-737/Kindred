import React from "react";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";
import { NavLink as RouterNavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Header = ({ user, updateUser, setAlertMessage, handleSnackType }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    fetch("/logout", { method: "DELETE" })
      .then(() => {
        updateUser(null);
        navigate("/");
      })
      .catch((err) => {
        handleSnackType("error");
        setAlertMessage(err.message);
      });
  };

  return (
    <div id="header">
      <Navbar color="custom" light expand="md" className="custom-navbar">
        <NavbarBrand tag={RouterNavLink} to="/" className="kindred-brand">
          <div className="kindred-title">Kindred</div>
          <div className="kindred-subtitle"></div>
        </NavbarBrand>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink tag={RouterNavLink} to="/search" className="custom-button">
              search
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={RouterNavLink} to="/signup" className="custom-button">
              signup
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={RouterNavLink} to="/aboutus" className="custom-button">
              about
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={RouterNavLink} to="/upload" className="custom-button">
              upload
            </NavLink>
          </NavItem>
          {user ? (
            <NavItem>
              <NavLink tag={RouterNavLink} to={`/profile/${user.id}`} className="custom-button">
                profile
              </NavLink>
            </NavItem>
          ) : (
            <NavItem>
              <NavLink tag={RouterNavLink} to="/login" className="custom-button">
                login
              </NavLink>
            </NavItem>
          )}
          {user && (
            <NavItem>
              <NavLink tag="button" onClick={handleLogout} className="custom-button">
                logout
              </NavLink>
            </NavItem>
          )}
        </Nav>
      </Navbar>
    </div>
  );
};

export default Header;
