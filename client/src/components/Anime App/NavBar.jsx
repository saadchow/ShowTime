import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/global';
import { UserButton } from '@clerk/clerk-react';

function NavBar() {
  const { search, handleChange } = useGlobalContext();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen((v) => !v);
  const closeDropdown = () => setDropdownOpen(false);

  // NEW: navigate to /search?q=...
  const onSubmit = (e) => {
    e.preventDefault();
    const q = (search || '').trim();
    if (!q) return;
    setDropdownOpen(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <NavBarStyled>
      <div className="navbar">
        <Link to="/">
          <div className="logo">
            <h1>
              <span className="yellow">Show</span>
              <span className="white">Time</span>
            </h1>
          </div>
        </Link>

        <form className="search-form" onSubmit={onSubmit}>
          <div className="input-control">
            <input
              type="text"
              placeholder="Search anime..."
              value={search}
              onChange={handleChange}
              aria-label="Search anime"
            />
            <button id="icon" type="submit" className="material-icons" aria-label="Search">
              search
            </button>
          </div>
        </form>

        <div className="right">
          <div className="profile-button" onClick={toggleDropdown}>
            <button id="icon" className="material-icons" aria-label="Lists menu">
              bookmark
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                <Link to="/plan-to-watch">
                  <button>Plan To Watch</button>
                </Link>
                <Link to="/currently-watching">
                  <button>Currently Watching</button>
                </Link>
                <Link to="/completed">
                  <button>Completed</button>
                </Link>
              </div>
            )}
          </div>

          <div className="user-button-wrapper">
            <UserButton />
          </div>
        </div>
      </div>

      {isDropdownOpen && <div className="overlay" onClick={closeDropdown} />}
    </NavBarStyled>
  );
}

const NavBarStyled = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  background: var(--surface);
  color: var(--text);
  border-bottom: 1px solid var(--ring);

  .navbar {
    max-width: 1200px;
    margin: 0 auto;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: space-between;
  }

  .logo h1 {
    font-size: 1.6rem;
    margin: 0;
    line-height: 1;
  }
  .yellow { color: var(--accent); }
  .white { color: var(--text); }

  .search-form {
    flex: 1 1 600px;
    max-width: 640px;
    margin: 0 12px;
    height: 40px;
  }
  .input-control {
    position: relative;
    height: 100%;
  }
  .input-control input {
    width: 100%;
    height: 100%;
    padding: 0 44px 0 14px;
    border-radius: 10px;
    border: 1px solid var(--ring);
    background: var(--surface);
    color: var(--text);
    outline: none;
  }
  .input-control #icon {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    height: 32px;
    width: 36px;
    border-radius: 8px;
    border: none;
    background: var(--accent);
    color: #fff;
    display: grid;
    place-items: center;
    cursor: pointer;
  }

  .right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .profile-button {
    position: relative;
  }
  .profile-button > #icon {
    background: transparent;
    color: var(--accent);
    border: none;
    width: 36px;
    height: 36px;
    transform: none;
    position: static;
    cursor: pointer;
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    background: var(--surface);
    border: 1px solid var(--ring);
    border-radius: 12px;
    padding: 10px;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
    min-width: 220px;
  }
  .dropdown-menu a { display: block; }
  .dropdown-menu button {
    width: 100%;
    margin: 6px 0;
    padding: 10px 12px;
    color: #fff;
    background-color: var(--accent);
    font-size: 0.95rem;
    font-weight: 600;
    text-align: center;
    border: none;
    border-radius: 10px;
    outline: none;
    cursor: pointer;
    transition: transform .15s ease, opacity .15s ease;
  }
  .dropdown-menu button:hover {
    transform: translateY(-1px);
    opacity: .95;
  }

  .user-button-wrapper {
    display: grid;
    place-items: center;
  }

  .overlay {
    position: fixed;
    inset: 0;
    background: transparent;
  }

  @media (max-width: 700px) {
    .logo h1 { font-size: 1.3rem; }
    .search-form { flex-basis: 360px; }
  }
`;

export default NavBar;
