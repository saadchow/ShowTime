import React from 'react'
import { Link } from 'react-router-dom'
import { useGlobalContext } from '../../context/global'
import styled from 'styled-components'
import Sidebar from './Sidebar'

function Upcoming({rendered}) {
    const {upcomingAnime ,isSearch, searchResults} = useGlobalContext()

    const conditionalRender = () => {
        if(!isSearch && rendered === 'upcoming'){
            return upcomingAnime && upcomingAnime.map((anime) => {
                return <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
                    <img src={anime.images.jpg.large_image_url} alt="" />
                    <p>{anime.title_english || anime.title}</p>
                </Link>
            })
        }else{
            return searchResults && searchResults.map((anime) => {
                return <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
                    <img src={anime.images.jpg.large_image_url} alt="" />
                    <p>{anime.title_english || anime.title}</p>
                </Link>
            })
        }
    }

    return (
        <PopularStyled>
            <Sidebar />
            <div className="upcoming-anime">
                {conditionalRender()}
            </div>
            
        </PopularStyled>
    )
}

const PopularStyled = styled.div`
   display: flex;
  padding-top: 60px;
  background: var(--bg);
  color: var(--text);

  .body {
    background: var(--bg);
    width: min(1100px, 90%);
    margin: auto;
  }

  h1 { text-align: center; margin-bottom: 12px; }

  table {
    width: 100%;
    text-align: center;
    background: var(--surface);
    border: 1px solid var(--ring);
    border-radius: 12px;
    overflow: hidden;
    margin-top: 18px;
  }

  thead th {
    background: #f1f5f9; /* slate-100 */
    color: var(--text);
  }

  img { width: 100px; height: auto; border-radius: 8px; }

  th, td { padding: 16px; vertical-align: top; }

  tr { border-bottom: 1px solid var(--ring); }
  tr:last-child { border-bottom: none; }

  strong { color: var(--text); }

  td:nth-child(3) {
    font-size: 0.95rem;
    text-align: left;
    color: var(--muted);
  }

  .material-icons {
    color: var(--accent);
    margin-right: 5px;
    align-self: center;
    vertical-align: middle;
  }

  #star { position: relative; top: 4px; color: var(--accent); }

  .actions button {
    width: 34px; height: 34px; margin-right: 8px;
    background: transparent; border: none; cursor: pointer;
  }

  span { font-weight: 600; color: var(--accent); }
`;

export default Upcoming
