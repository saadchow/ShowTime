import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const Sidebar = () => {
  return (
    <SidebarStyled>
      <h3>Browse</h3>
      <nav className="menu">
        <NavLink to="/popular" className={({isActive}) => isActive ? 'item active' : 'item'}>Most Popular</NavLink>
        <NavLink to="/airing" className={({isActive}) => isActive ? 'item active' : 'item'}>Currently Airing</NavLink>
        <NavLink to="/upcoming" className={({isActive}) => isActive ? 'item active' : 'item'}>Upcoming</NavLink>
      </nav>
    </SidebarStyled>
  );
};

const SidebarStyled = styled.aside`
  position: sticky;
  top: 72px;
  height: fit-content;
  background: var(--surface);
  border: 1px solid var(--ring);
  border-radius: 12px;
  padding: 14px;
  color: var(--text);

  h3 { margin: 4px 8px 10px; font-size: 1rem; color: var(--muted); }

  .menu { display: grid; gap: 8px; }
  .item {
    display: block;
    padding: 10px 12px;
    background: var(--surface);
    border: 1px solid var(--ring);
    border-radius: 10px;
    color: var(--text);
    font-weight: 600;
  }
  .item:hover { background: #f8fafc; }
  .active {
    background: var(--accent);
    color: #fff !important;
    border-color: var(--accent);
  }

  @media (max-width: 900px) {
    position: static;
    order: -1;
  }
`;

export default Sidebar;
