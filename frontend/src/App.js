import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css';
import Login from "./pages/login";
import Sidebar from "./components/sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/common.css';
import Home from "./pages/home";
import Navbar from "./components/navbar";
import Profile from "./pages/profile";
import Friends from "./pages/friends";
import FindPeople from "./pages/FindPeople";
import React, { useState } from "react";
import { LoaderProvider } from "./context/LoaderContext";
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const noSideBarRoutes = ["/login"]

  return (
    <div className="App">
      <LoaderProvider>
      {!noSideBarRoutes.includes(location.pathname) && <Sidebar />}
      <div className="main-content">
          {!noSideBarRoutes.includes(location.pathname) && <Navbar />}
          <Routes>
          <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />}/>
            <Route path="/profile" element={<Profile isCurrentUser={true} />} />
            <Route path="/viewprofile" element={<Profile isCurrentUser={false}/>} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/find" element={<FindPeople />} />
            {/* <Route path="/viewprofile" element={<Profile isCurrentUser={false}/>} /> */}
          </Routes>
        </div>
        </LoaderProvider>
    </div>
  );
}

export default App;