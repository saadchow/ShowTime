import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AnimeContext } from './AnimeContext';
import { useClerk } from '@clerk/clerk-react';
import api from '../../lib/api';

const CurrentlyWatching = () => {
  const { setCompleted, currentlyWatching, setCurrentlyWatching, setNotification } = useContext(AnimeContext);
  const { user } = useClerk();

  useEffect(() => {
    if (user?.id) api.defaults.headers.common['x-clerk-user-id'] = user.id;
  }, [user]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`anime?list=currentlywatching`);
        setCurrentlyWatching(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error('Error fetching currently watching:', e);
        setCurrentlyWatching([]);
      }
    })();
  }, [setCurrentlyWatching]);

  const removeFromCurrentlyWatching = async (mal_id) => {
    try {
      await api.delete(`anime/${mal_id}`);
      setCurrentlyWatching((cur) => cur.filter((a) => a.mal_id !== mal_id));
      setNotification('Anime removed from "Currently Watching"');
    } catch (e) {
      console.error('Error removing anime:', e);
    }
  };

  const addToCompleted = async (anime) => {
    try {
      // Move via PUT, no delete+repost
      const res = await api.put(`anime/${anime.mal_id}`, { list: 'completed' });
      const moved = res.data || { ...anime, list: 'completed' };

      setCompleted((cur) => [moved, ...cur]);
      setCurrentlyWatching((cur) => cur.filter((a) => a.mal_id !== anime.mal_id));
      setNotification('Anime moved to "Completed"');
    } catch (e) {
      console.error('Error moving anime:', e);
    }
  };

  const items = Array.isArray(currentlyWatching) ? currentlyWatching : [];
  return (
    <ListStyled>
      <div className='body'>
        <h1 style={{ textAlign: 'center' }}>Currently Watching</h1>
        {items.length > 0 ? (
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
              {items.map((anime, index) => (
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
                    {anime.type} - {anime.episodes} episode(s)<br/>
                    {anime.aired?.string}<br/><br/>
                    {(anime.synopsis || '').length > 300
                      ? <>
                          {(anime.synopsis || '').substring(0, 300)}…
                          <Link to={`/anime/${anime.mal_id}`}><span>Read More</span></Link>
                        </>
                      : (anime.synopsis || '')
                    }
                  </td>
                  <td className="score">
                    <i id="star" className="material-icons">star</i>{anime.score}
                  </td>
                  <td>
                    <button onClick={() => addToCompleted(anime)} title="Add to Completed">
                      <i className="material-icons">check</i>
                    </button>
                    <button onClick={() => removeFromCurrentlyWatching(anime.mal_id)} title="Delete">
                      <i className="material-icons">delete</i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: 'grey', textAlign: 'center' }}>
            No entries: Add any anime to this list to start tracking!
          </p>
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

  button {
    width: 34px;
    height: 34px;
    margin-right: 10px;
    background: transparent;
    border: none;
    cursor: pointer;
  }

  .material-icons {
    color: var(--accent);
    margin-right: 5px;
    align-self: center;
  }

  #star { position: relative; top: 4px; color: var(--accent); }

  span { font-weight: 600; color: var(--accent); }

  table {
    width: 100%;
    text-align: center;
    background: var(--surface);
    border: 1px solid var(--ring);
    border-radius: 12px;
    overflow: hidden;
  }

  thead th {
    background: #f1f5f9;
    color: var(--text);
  }

  img { width: 100px; height: auto; border-radius: 8px; }

  th, td { padding: 16px; }

  tr { border-bottom: 1px solid var(--ring); }
  tr:last-child { border-bottom: none; }

  strong { color: var(--text); }

  td:nth-child(3) {
    font-size: 0.95rem;
    text-align: left;
    color: var(--muted);
  }

  th:nth-child(4), td:nth-child(4), th:nth-child(5), td:nth-child(5) {
    width: 140px;
  }
`;

export default CurrentlyWatching;
