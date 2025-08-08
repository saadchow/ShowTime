import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AnimeContext } from './AnimeContext';
import { useClerk } from '@clerk/clerk-react';
import api from '../../lib/api';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const SearchResults = () => {
  const qs = useQuery();
  const q = (qs.get('q') || '').trim();

  const { setNotification, setPlanToWatch, setCurrentlyWatching, setCompleted } = useContext(AnimeContext);
  const { user } = useClerk();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(Boolean(q));
  const [error, setError] = useState('');

  // attach Clerk header for API actions
  useEffect(() => {
    if (user?.id) api.defaults.headers.common['x-clerk-user-id'] = user.id;
  }, [user]);

  useEffect(() => {
    let abort = false;
    (async () => {
      setLoading(true);
      setError('');
      setResults([]);

      if (!q) {
        setLoading(false);
        return;
      }

      try {
        // Jikan search
        const res = await fetch(
          `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&order_by=score&sort=desc&sfw=true&limit=24`
        );
        const data = await res.json();
        if (!abort) {
          const arr = Array.isArray(data?.data) ? data.data : [];
          setResults(arr);
        }
      } catch (e) {
        if (!abort) setError('Failed to fetch results. Try again.');
      } finally {
        if (!abort) setLoading(false);
      }
    })();
    return () => { abort = true; };
  }, [q]);

  const addTo = async (anime, listKey) => {
    try {
      // normalize payload from Jikan result
      const payload = {
        mal_id: anime.mal_id,
        title: anime.title_english || anime.title,
        synopsis: anime.synopsis || '',
        images: anime.images || {},
        rank: anime.rank ?? null,
        score: anime.score ?? null,
        status: anime.status || '',
        rating: anime.rating || '',
        list: listKey,
        episodes: anime.episodes ?? 0,
        type: anime.type || '',
        aired: anime.aired || null
      };
      await api.post(`anime`, payload);
      if (listKey === 'plantowatch') setPlanToWatch(cur => [payload, ...cur]);
      if (listKey === 'currentlywatching') setCurrentlyWatching(cur => [payload, ...cur]);
      if (listKey === 'completed') setCompleted(cur => [payload, ...cur]);
      setNotification(`Added to "${labelFromKey(listKey)}"`);
    } catch (e) {
      console.error('Add failed:', e);
      setNotification('Could not add. Please try again.');
    }
  };

  const labelFromKey = (k) =>
    k === 'currentlywatching' ? 'Currently Watching' :
    k === 'plantowatch' ? 'Plan To Watch' : 'Completed';

  return (
    <ListStyled>
      <div className='body'>
        <h1 style={{ textAlign: 'center' }}>
          Search results{q ? ` for “${q}”` : ''}{!loading && results?.length ? ` • ${results.length}` : ''}
        </h1>

        {loading && (
          <p style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 24 }}>Searching…</p>
        )}

        {error && !loading && (
          <p style={{ color: 'crimson', textAlign: 'center', marginTop: 24 }}>{error}</p>
        )}

        {!loading && !error && results.length === 0 && (
          <p style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 24 }}>
            No results found. Try a different keyword.
          </p>
        )}

        {!loading && !error && results.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Title</th>
                <th>Description</th>
                <th>Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((anime, index) => (
                <tr key={anime.mal_id}>
                  <td>{index + 1}</td>
                  <td>
                    <Link to={`/anime/${anime.mal_id}`}>
                      <img
                        src={anime.images?.jpg?.large_image_url}
                        alt={anime.title_english || anime.title || 'Anime'}
                      />
                    </Link>
                  </td>
                  <td>
                    <strong>{anime.title_english || anime.title}</strong><br/>
                    {anime.type} {anime.episodes ? `• ${anime.episodes} ep` : ''}<br/>
                    {anime.aired?.string || ''}<br/><br/>
                    {(anime.synopsis || '').length > 300
                      ? <>
                          {(anime.synopsis || '').substring(0, 300)}…
                          <Link to={`/anime/${anime.mal_id}`}><span> Read more</span></Link>
                        </>
                      : (anime.synopsis || '')
                    }
                  </td>
                  <td className="score">
                    <i id="star" className="material-icons">star</i>{anime.score ?? '—'}
                  </td>
                  <td className="actions">
                    <button onClick={() => addTo(anime, 'plantowatch')} title="Add to Plan To Watch">
                      <i className="material-icons">add</i>
                    </button>
                    <button onClick={() => addTo(anime, 'currentlywatching')} title="Add to Currently Watching">
                      <i className="material-icons">visibility</i>
                    </button>
                    <button onClick={() => addTo(anime, 'completed')} title="Add to Completed">
                      <i className="material-icons">check</i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </ListStyled>
  );
};

const ListStyled = styled.div`
  display: flex;
  padding-top: 60px;
  background: var(--bg);
  color: var(--text);

  .body {
    background: var(--bg);
    width: min(1100px, 90%);
    margin: auto;
  }

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
    width: 34px;
    height: 34px;
    margin-right: 8px;
    background: transparent;
    border: none;
    cursor: pointer;
  }

  span { font-weight: 600; color: var(--accent); }
`;

export default SearchResults;
