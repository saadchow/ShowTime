import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../../context/global';

const Sidebar = ({ rendered, setRendered }) => {
  const { getAiringAnime, getUpcomingAnime, setIsSearch, dispatch } = useGlobalContext();
  const [topSeason, setTopSeason] = useState([]);
  const [loading, setLoading] = useState(true);

  const resetSearch = () => {
    setIsSearch(false);
    dispatch({ type: 'Search', payload: [] });
  };

  useEffect(() => {
    let abort = false;
    (async () => {
      setLoading(true);
      try {
        // Most popular this season: use "members" as popularity proxy
        const res = await fetch(
          'https://api.jikan.moe/v4/seasons/now?sfw=true&limit=10&order_by=members&sort=desc'
        );
        const data = await res.json();
        if (!abort) setTopSeason(Array.isArray(data?.data) ? data.data : []);
      } catch {
        if (!abort) setTopSeason([]);
      } finally {
        if (!abort) setLoading(false);
      }
    })();
    return () => { abort = true; };
  }, []);

  return (
    <Wrap>
      <div className="section">
        <button
          className={`pill ${rendered === 'popular' ? 'active' : ''}`}
          onClick={() => { setRendered('popular'); resetSearch(); }}
        >
          Most Popular
        </button>
        <button
          className={`pill ${rendered === 'airing' ? 'active' : ''}`}
          onClick={() => { setRendered('airing'); getAiringAnime(); resetSearch(); }}
        >
          Currently Airing
        </button>
        <button
          className={`pill ${rendered === 'upcoming' ? 'active' : ''}`}
          onClick={() => { setRendered('upcoming'); getUpcomingAnime(); resetSearch(); }}
        >
          Upcoming
        </button>
      </div>

      <div className="section">
        <h3>Top This Season</h3>
        {loading && <p className="muted">Loading…</p>}
        {!loading && topSeason.length === 0 && <p className="muted">No data</p>}
        <ul className="ranking">
          {topSeason.map((a, i) => (
            <li key={a.mal_id}>
              <span className="rank">{i + 1}</span>
              <Link to={`/anime/${a.mal_id}`} className="item">
                <img
                  loading="lazy"
                  decoding="async"
                  src={a.images?.webp?.image_url || a.images?.jpg?.image_url}
                  alt={a.title_english || a.title}
                />
                <div className="meta">
                  <div className="title">{a.title_english || a.title}</div>
                  <div className="sub">
                    {a.type || ''} {a.episodes ? `• ${a.episodes} ep` : ''}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Wrap>
  );
};

const Wrap = styled.aside`
  width: 260px;
  flex: 0 0 260px;

  .section {
    background: var(--surface);
    border: 1px solid var(--ring);
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 16px;
  }

  .pill {
    width: 100%;
    display: block;
    text-align: left;
    padding: 10px 12px;
    margin: 6px 0;
    border-radius: 10px;
    border: 1px solid var(--ring);
    background: var(--surface);
    color: var(--text);
    font-weight: 600;
    cursor: pointer;
    transition: background .15s ease, color .15s ease, transform .15s ease;
  }
  .pill:hover { transform: translateY(-1px); }
  .pill.active {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
  }

  h3 {
    margin: 4px 2px 10px;
    font-size: 1.1rem;
    color: var(--text);
  }

  .muted { color: var(--muted); margin: 6px 2px; }

  .ranking {
    list-style: none; padding: 0; margin: 0;
  }
  .ranking li {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 6px; border-radius: 10px;
    transition: background .15s ease;
  }
  .ranking li:hover { background: #f1f5f9; } /* slate-100 */
  .rank {
    font-weight: 800; width: 20px; text-align: right; color: var(--muted);
  }
  .item { display: flex; gap: 10px; align-items: center; color: var(--text); }
  img { width: 42px; height: 60px; object-fit: cover; border-radius: 6px; }
  .title { font-size: .95rem; line-height: 1.1; }
  .sub { color: var(--muted); font-size: .85rem; }
`;

export default Sidebar;
