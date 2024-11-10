import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger icon only visible on mobile */}
      <button className="hamburger" onClick={toggleSidebar}>
        ☰
      </button>

      <aside className={`custom-sidebar ${isOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleSidebar}>✕</button>
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/friends">Friends</Link></li>
          <li><Link to="/find">Find People</Link></li>
          {/* <li><Link to="/chat">Chat</Link></li>
          <li><Link to="/settings">Settings</Link></li> */}
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
