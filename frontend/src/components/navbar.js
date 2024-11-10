import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/navbar.css';
import { usePostRequestDynamicUrlFunction } from '../hooks/useApi';

const UserDashboard = () => {
  const email = localStorage.getItem("email")
  const navigate = useNavigate();

  const { executePostRequest } = usePostRequestDynamicUrlFunction();

  const handleLogout = async () => {
    const responseData = await executePostRequest("/logout");
    console.log(',g' , responseData)
    if (responseData.data.status === "success") {
      localStorage.removeItem("authToken")
      navigate("/login");
    } else {
      console.error("Logout failed:", responseData);
    }
  };

  return (
    <Navbar expand="lg" className="justify-content-between p-3 custom-navbar">
      <Navbar.Brand>User Dashboard</Navbar.Brand>
      <Nav className="ml-auto d-flex align-items-center gap-2">
        <span className="mr-4">{email}</span>
        <Button variant="outline-danger" onClick={handleLogout}>
          Logout
        </Button>
      </Nav>
    </Navbar>
  );
};

export default UserDashboard;
