import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { checkAuth, loginUser, logoutUser } from './utils/api';

import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import Watching from './pages/Watching';
import PlanToWatch from './pages/PlanToWatch';
import Watched from './pages/Watched';

function AuthenticatedApp({ user, onLogout }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  return (
    <>
      <Navbar user={user} onLogout={onLogout} />
      <Routes>
        <Route path="/" element={<Homepage user={user} />} />
        <Route path="/watching" element={<Watching user={user} />} />
        <Route path="/plan-to-watch" element={<PlanToWatch user={user} />} />
        <Route path="/watched" element={<Watched user={user} />} />
      </Routes>
    </>
  );
}


function UnauthenticatedApp({ onLogin }) {
  const navigate = useNavigate();

  const handleLogin = async (username, password) => {
    const user = await loginUser(username, password);
    onLogin(user);
    navigate("/watching");
  };

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Homepage />} />
      </Routes>
    </>
  );
}


function App() {
  const [user, setUser] = useState(null);
  const [seasonalAnime, setSeasonalAnime] = useState([]);

  const fetchSeasonalAnime = async () => {
    try {
      const response = await fetch("https://api.jikan.moe/v4/seasons/now");
      const data = await response.json();
      setSeasonalAnime(data.anime);
    } catch (error) {
      console.error("Failed to fetch seasonal anime:", error);
    }
  };

  useEffect(() => {
    fetchSeasonalAnime();
  }, []);

  useEffect(() => {
    const init = async () => {
      const user = await checkAuth();
      setUser(user);
    };
    init();
  }, []);

  const handleLogin = (user) => {
    setUser(user);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {user ? (
          <Route
            path="*"
            element={
              <AuthenticatedApp user={user} onLogout={handleLogout} />
            }
          />
        ) : (
          <Route
            path="*"
            element={<UnauthenticatedApp onLogin={handleLogin} />}
          />
        )}
        <Route
          path="/"
          element={<Homepage seasonalAnime={seasonalAnime} />}
        />
      </Routes>
    </Router>
  );
}

export default App;