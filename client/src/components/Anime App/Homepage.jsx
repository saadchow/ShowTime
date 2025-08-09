import React, { useState } from 'react';
import { useGlobalContext } from '../../context/global';
import Popular from './Popular';
import styled from 'styled-components';
import Upcoming from './Upcoming';
import Airing from './Airing';
import MyCarousel from './MyCarousel';

function Homepage({ rendered, setRendered }) {
  const {
    getUpcomingAnime,
    getAiringAnime,
    setIsSearch,
    dispatch
  } = useGlobalContext();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleButtonClick = () => {
    setIsSearch(false);
    dispatch({ type: 'Search', payload: [] });
  };

  const switchComponent = () => {
    switch (rendered) {
      case 'popular':
        return <Popular rendered={rendered} setRendered={setRendered} />
      case 'airing':
        return <Airing rendered={rendered} setRendered={setRendered} />
      case 'upcoming':
        return <Upcoming rendered={rendered} setRendered={setRendered} />
      default:
        return <Airing rendered={rendered} setRendered={setRendered} />
    }
  };

  return (
    <HomepageStyled>
      <MyCarousel />

      <header>
        <div className="container">
          <div className="logo">
            <h1>
              {rendered === 'popular'
                ? 'Most Popular Anime'
                : rendered === 'airing'
                ? 'Currently Airing Anime'
                : 'Upcoming Anime'}
            </h1>
          </div>

          <div className="browse-filter">
            <button
              className="browse-toggle"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-haspopup="menu"
              aria-expanded={isDropdownOpen}
            >
              Browse {isDropdownOpen ? '▲' : '▼'}
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="menu"
                  role="menu"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="menu-btn"
                    role="menuitem"
                    onClick={() => {
                      setRendered('popular');
                      handleButtonClick();
                      setIsDropdownOpen(false);
                    }}
                  >
                    Popular
                  </button>

                  <button
                    className="menu-btn"
                    role="menuitem"
                    onClick={() => {
                      setRendered('airing');
                      getAiringAnime();
                      handleButtonClick();
                      setIsDropdownOpen(false);
                    }}
                  >
                    Airing
                  </button>

                  <button
                    className="menu-btn"
                    role="menuitem"
                    onClick={() => {
                      setRendered('upcoming');
                      getUpcomingAnime();
                      handleButtonClick();
                      setIsDropdownOpen(false);
                    }}
                  >
                    Upcoming
                  </button>
                </div>

                {/* click-away to close */}
                <div
                  className="overlay"
                  onClick={() => setIsDropdownOpen(false)}
                />
              </>
            )}
          </div>
        </div>
      </header>

      {switchComponent()}
    </HomepageStyled>
  );
}

const HomepageStyled = styled.div`
  background: var(--bg);
  color: var(--text);
  padding-top: 60px;

  header {
    background: var(--bg);
    border-bottom: 1px solid var(--ring);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.25rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  h1 {
    margin: 0;
    font-size: clamp(1.25rem, 2vw + 0.5rem, 2rem);
    color: var(--text);
  }

  .browse-filter {
    position: relative;
  }

  .browse-toggle {
    margin: 0;
    padding: 10px 14px;
    color: #fff;
    background-color: var(--accent);
    font-size: 0.95rem;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    outline: none;
    cursor: pointer;
    transition: transform .15s ease, opacity .15s ease;
  }
  .browse-toggle:hover {
    transform: translateY(-1px);
    opacity: 0.95;
  }

  .menu {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    background: var(--surface);
    border: 1px solid var(--ring);
    border-radius: 12px;
    padding: 8px;
    min-width: 220px;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
    z-index: 5;
  }

  .menu-btn {
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
  .menu-btn:hover {
    transform: translateY(-1px);
    opacity: 0.95;
  }

  .overlay {
    position: fixed;
    inset: 0;
    background: transparent;
    z-index: 4; /* below menu */
  }

  @media (max-width: 900px) {
    .container {
      flex-direction: column;
      align-items: stretch;
      gap: 10px;
    }
    .browse-filter {
      align-self: flex-end;
    }
  }
`;

export default Homepage;
