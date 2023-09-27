import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/global';
import { UserButton } from '@clerk/clerk-react';

function NavBar() {
  const {
    handleSubmit,
    search,
    handleChange,
  } = useGlobalContext();

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  // Close the dropdown when clicking outside of it
  const closeDropdown = () => {
    setDropdownOpen(false);
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

        <form action="" className="search-form" onSubmit={handleSubmit}>
          <div className="input-control">
            <input
              type="text"
              placeholder="Search Anime"
              value={search}
              onChange={handleChange}
            />
            <button id='icon' type="submit" className="material-icons">
              search
            </button>
          </div>
        </form>

        <div className='profile-button' onClick={toggleDropdown}>
          <button
            id='icon'
            className="material-icons"
          >
            bookmark
          </button>
          {/* Use isDropdownOpen state to conditionally display the dropdown */}
          {isDropdownOpen && (
            <div className='dropdown-menu' onClick={(e) => e.stopPropagation()}>
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

        <div className='user-button-wrapper'>
          <UserButton />
        </div>
      </div>
      {/* Close the dropdown when clicking outside of it */}
      {isDropdownOpen && <div className="overlay" onClick={closeDropdown}></div>}
    </NavBarStyled>
  );
}

const NavBarStyled = styled.nav`
position: fixed;
top: 0;
width: 100%;
z-index: 100;
background-color: #21252b;

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center; 

  .search-form {
    display: flex;
    justify-content: center;
    flex-grow: 1; 
    height: 40px;
  }

   #icon {
      border-radius: 10px;
      border: none;
      transform: translateY(35%);
      position: absolute; 
      right: 4px;
      background-color: #222121;
      color: grey;
      cursor: pointer;
   }

  input {
      border-radius: 10px 10px 10px 10px; 
      height: 100%;
      padding: 5px 15px 5px 15px;
      background-color: #222121;
      border: none;
      color: white;
  }

  .input-control {
    position: relative;
  }

  .profile-button {
    position: relative;
    right: 50px;
    top: -20px;

    .dropdown-menu {
      display: none;
      position: absolute;
      top: calc(100% + 30px);
      right: -25px;
      background-color: black;
      padding: 10px;
      border-radius: 5px;
      z-index: 1; 
    }

    &:hover .dropdown-menu,
    .dropdown-menu:hover {
      display: block;
    }
  }

  .overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .lists {
    display: flex;
    justify-content: flex-end;
  }

  .yellow {
    color: yellow;
  }

  .white {
      color: white;
  }

  .logo {
    margin: 10px 5px 5px 15px;
  }

  .user-button-wrapper {
  position: relative;
  right: 20px; /* This moves the UserButton 20px to the left */
}

;`



export default NavBar;


