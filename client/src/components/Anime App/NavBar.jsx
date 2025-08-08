import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/global';
import { UserButton } from '@clerk/clerk-react';

function NavBar() {
  const { search, handleChange } = useGlobalContext();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(v => !v);
  const closeDropdown = () => setDropdownOpen(false);

  // Navigate to /search?q=...
  const onSubmit = (e) => {
    e.preventDefault();
    const q = (search || '').trim();
    if (!q) return;
    setDropdownOpen(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <NavBarStyled>
      <div className='navbar'>
        <Link to="/">
          <div className='logo'>
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
            <button id='icon' type="submit" className="material-icons" aria-label="Search">
              search
            </button>
          </div>
        </form>

        <div className='right'>
          <div className='profile-button'>
            <button id='icon' className="material-icons" onClick={toggleDropdown} aria-label="Lists menu">
              bookmark
            </button>

            {isDropdownOpen && (
              <div className='dropdown-menu' onClick={(e) => e.stopPropagation()}>
                {/* Pure links, styled like buttons */}
                <Link className="menu-btn" to="/plan-to-watch" onClick={closeDropdown}>Plan To Watch</Link>
                <Link className="menu-btn" to="/currently-watching" onClick={closeDropdown}>Currently Watching</Link>
                <Link className="menu-btn" to="/completed" onClick={closeDropdown}>Completed</Link>
              </div>
            )}
          </div>

          <div className='user-button-wrapper'>
            <UserButton />
          </div>
        </div>
      </div>

      {isDropdownOpen && <div className="overlay" onClick={closeDropdown}></div>}
    </NavBarStyled>
  );
}

const NavBarStyled = styled.nav`
  position: fixed;
  top: 0; width: 100%; z-index: 200;
  background-color: var(--surface);
  color: var(--text);
  border-bottom: 1px solid var(--ring);

  .navbar {
    display: flex; justify-content: space-between; align-items: center;
    max-width: 1200px; margin: 0 auto; padding: 10px 16px; gap: 12px;
  }

  .logo { margin: 6px 8px; }
  .yellow { color: var(--accent); }
  .white { color: var(--text); }

  .search-form { flex: 1 1 600px; max-width: 640px; height: 40px; }
  .input-control { position: relative; height: 100%; }
  input {
    width: 100%; height: 100%;
    padding: 0 44px 0 14px;
    border-radius: 10px; border: 1px solid var(--ring);
    background-color: var(--surface); color: var(--text); outline: none;
  }
  #icon {
    border-radius: 8px; border: none;
    position: absolute; right: 4px; top: 50%; transform: translateY(-50%);
    background-color: var(--accent); color: #fff; cursor: pointer;
    width: 36px; height: 32px; display: grid; place-items: center;
  }

  .right { display: flex; align-items: center; gap: 12px; }

  .profile-button { position: relative; }
  .profile-button > #icon {
    position: static; transform: none;
    background: transparent; color: var(--accent);
    width: 36px; height: 36px;
  }

  .dropdown-menu {
    position: absolute; top: calc(100% + 10px); right: 0;
    background: var(--surface); border: 1px solid var(--ring);
    border-radius: 12px; padding: 10px; min-width: 220px;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
    z-index: 300; /* above overlay */
  }
  .menu-btn {
    display: block; width: 100%;
    margin: 6px 0; padding: 10px 12px; text-align: center;
    background: var(--accent); color: #fff; border-radius: 10px;
    font-weight: 600; border: none;
  }

  .user-button-wrapper { display: grid; place-items: center; }

  .overlay {
    position: fixed; inset: 0; background: transparent;
    z-index: 250; /* below dropdown, above page */
  }
`;

export default NavBar;
