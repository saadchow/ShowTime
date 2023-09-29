import React, { useState } from 'react';
import { useGlobalContext } from '../../context/global'
import Popular from './Popular'
import styled from 'styled-components'
import Upcoming from './Upcoming'
import Airing from './Airing'
import MyCarousel from './MyCarousel';

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
        return <Airing rendered={rendered} />
    }
  }

  return (
    <HomepageStyled>
      <MyCarousel />
      <header>
        <div className="logo">
          <h1>
            {rendered === 'popular' ? 'Most Popular Anime' : 
            rendered === 'airing' ? 'Currently Airing Anime' : 'Upcoming Anime'}
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

    button {
    margin: 1vmin;
    padding: 1vmin;
    color: black;
    background-color: orange;
    font-size: 2vmin;
    text-decoration: none;
    text-align: center;
    border: .1vmin solid var(--tan-2);
    border-radius: .5vmin;
    outline: none;
    cursor: pointer;

    /* Add transition for smooth hover effect */
    transition: all 0.3s ease; 
}

button:hover {
    /* Enlarge the button on hover */
    transform: scale(1.1); 

    /* Lighten the button color on hover */
    background-color: #ffb732; 
}

`

export default Homepage