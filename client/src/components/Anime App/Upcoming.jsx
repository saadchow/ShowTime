import React from 'react';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../../context/global';
import styled from 'styled-components';
import Sidebar from './Sidebar';

function Upcoming({ rendered }) {
  const { upcomingAnime, isSearch, searchResults } = useGlobalContext();

  const list = (!isSearch && rendered === 'upcoming') ? upcomingAnime : searchResults;

  return (
    <PageWrap>
      <Sidebar />
      <main className="content">
        <h1>Upcoming</h1>
        <div className="grid">
          {Array.isArray(list) && list.map(anime => (
            <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id} className="card">
              <img src={anime.images?.jpg?.large_image_url} alt={anime.title_english || anime.title} />
              <p className="title">{anime.title_english || anime.title}</p>
            </Link>
          ))}
        </div>
      </main>
    </PageWrap>
  );
}

const PageWrap = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 20px;
  padding: 80px 4vw 40px;
  background: var(--bg);
  color: var(--text);

  .content h1 { margin: 4px 0 12px; }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }

  .card {
    display: block;
    background: var(--surface);
    border: 1px solid var(--ring);
    border-radius: 12px;
    overflow: hidden;
    transition: transform .15s ease, box-shadow .15s ease;
  }
  .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 22px rgba(15,23,42,.08);
  }

  .card img {
    width: 100%;
    height: 240px;
    object-fit: cover;
    display: block;
  }

  .title {
    padding: 10px 12px;
    font-size: .95rem;
    color: var(--text);
  }

  @media (max-width: 900px){
    grid-template-columns: 1fr;
  }
`;

export default Upcoming;
