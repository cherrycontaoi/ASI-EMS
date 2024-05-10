import React, { useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import UploadDocument from "./UploadDocument";
import FindDocument from "./FindDocument";
import './App.css';
import logo from "./images/logo-asi.png";
import AdminSignin from "./AdminSignin";
import { AuthProvider } from "./AuthContext";
import * as icons from "bootstrap-icons/font/bootstrap-icons.css";

function LandingPage() {
  const isAdminLoggedIn = sessionStorage.getItem('isAdminLoggedIn');
  const [isHovering, setIsHovering] = useState(false);
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminLoggedIn');
    window.location.reload();
  };

  return (
    <>
        <div className="header">
          <div><img src={logo} alt="" id="asi-logo"/></div>
          {isAdminLoggedIn ? (
            <div id="admin-greeting" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
              Hello, Admin!
              {isHovering && (
                <div id="admin-dropdown">
                  <button className="admin-button" onClick={handleLogout}>Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <div id="admin-login-div">
              {!isLoginFormVisible && (
                <div id="admin-login-button" onClick={() => setIsLoginFormVisible(true)}>Sign in</div>
              )}
            </div>
          )}
          {isLoginFormVisible && !isAdminLoggedIn && (
            <div className="admin-login-form">
              <AdminSignin />
            </div>
          )}
        </div>
        <div className="home-body">
            <div className="menu">
                EQUIPMENT<br />MANAGEMENT SYSTEM
                <div className="buttons">
                    <div id="upload-div">
                        <Link to="/upload-document"><button id="uploadbutton"><i className="bi bi-cloud-upload" /></button></Link>
                        <br/>Upload Document
                    </div>
                    <div id="find-div">
                        <a href="/find-document"><button id="findbutton"><i className="bi bi-search" /></button></a>
                        <br/>Search Document
                    </div>
                </div>
            </div>
            
        </div>
    </>
);
}

function App() {
  const isAdminLoggedIn = sessionStorage.getItem('isAdminLoggedIn');

  return (
    <AuthProvider>
      <Router>
          <div className="App">
              <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/upload-document" element={<UploadDocument />} />
                  <Route path="/find-document" element={<FindDocument isAdminLoggedIn={isAdminLoggedIn} />} />
              </Routes>
          </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
