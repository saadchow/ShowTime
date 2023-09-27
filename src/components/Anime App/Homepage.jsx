import React, { useState } from 'react';
import { useGlobalContext } from '../../context/global'
import Popular from './Popular'
import styled from 'styled-components'
import Upcoming from './Upcoming'
import Airing from './Airing'

function Homepage({ rendered, setRendered }) {

  const {
    getUpcomingAnime,
    getAiringAnime,
    setIsSearch,
    dispatch
  } = useGlobalContext()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleButtonClick = () => {
    setIsSearch(false);
    dispatch({ type: 'Search', payload: [] });
  };

  const switchComponent = () => {
    switch(rendered){
      case 'popular':
        return <Popular rendered={rendered} />
      case 'airing':
        return <Airing rendered={rendered} />
      case 'upcoming':
        return <Upcoming rendered={rendered} />
      default:
        return <Popular rendered={rendered} />
    }
  }

  return (
    <HomepageStyled>
      <header>
        <div className="logo">
          <h1>
            {rendered === 'popular' ? 'Popular Anime' : 
            rendered === 'airing' ? 'Airing Anime' : 'Upcoming Anime'}
          </h1>
        </div>
        <div className="search-container">
          <div className="filter-btn browse-filter">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              Browse {isDropdownOpen ? '▲' : '▼'}
            </button>
            {isDropdownOpen && (
              <>
                <button onClick={() => {
                  setRendered('popular');
                  handleButtonClick();
                  setIsDropdownOpen(false);
                }}>Popular<i className="fas fa-fire"></i></button>
                <button onClick={() => {
                  setRendered('airing');
                  getAiringAnime();
                  handleButtonClick();
                  setIsDropdownOpen(false);
                }}>Airing</button>
                <button onClick={() => {
                  setRendered('upcoming');
                  getUpcomingAnime();
                  handleButtonClick();
                  setIsDropdownOpen(false);
                }}>Upcoming</button>
              </>
            )}
          </div>
        </div>
      </header>
      {switchComponent()}
    </HomepageStyled >
  );
}

const HomepageStyled = styled.div`
    background-color: black;
    padding-top: 60px;
    header{
        padding: 2rem 15rem;
    }
`

export default Homepage