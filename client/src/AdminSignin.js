import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import "./AdminSignin.css";

const API_BASE = "http://localhost:3001";

function AdminSignin() {
  const navigate = useNavigate();
  const { pathName } = window.location;
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    try {
      const response = await fetch(API_BASE + '/admin/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
  
      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        login();
        navigate(pathName, { state: { isAdmin: true } });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sign in');
      }
    } catch (error) {
      console.error("Error signing in: ", error.message);
      window.alert(error.message);
    }
  };

  return (
    <div>
      <input
        id="sign-field"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder='Username'
      />
      <input
        id="sign-field"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button id="sign-in-button" onClick={handleSignIn}>Sign in</button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default AdminSignin;
