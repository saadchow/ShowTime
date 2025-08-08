import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { AnimeContext } from './AnimeContext';
import { useClerk } from '@clerk/clerk-react';
import api from '../../lib/api';

function AnimeItem() {
  const { id } = useParams();
  const [anime, setAnime] = useState({});
  const [characters, setCharacters] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const { setCurrentlyWatching, setPlanToWatch, setNotification } = useContext(AnimeContext);
  const { user } = useClerk();

  // attach Clerk user id to API requests
  useEffect(() => {
    if (user?.id) api.defaults.headers.common['x-clerk-user-id'] = user.id;
  }, [user]);

  const getAnime = async (animeId) => {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
    const data = await response.json();
    setAnime(data?.data || {});
  };

  const getCharacters = async (animeId) => {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/characters`);
    const data = await response.json();
    setCharacters(Array.isArray(data?.data) ? data.data : []);
  };

  useEffect(() => {
    getAnime(id);
    getCharacters(id);
  }, [id]);

  const addViaPost = async (listKey) => {
    // server POST is an upsert; safe to post same mal_id with a new list
    await api.post(`anime`, { ...anime, list: listKey });
    setNotification(`Anime added to "${labelFromKey(listKey)}"`);
  };

  const labelFromKey = (k) =>
    k === 'currentlywatching' ? 'Currently Watching' :
    k === 'plantowatch' ? 'Plan To Watch' :
    'Completed';

  const addToCurrentlyWatching = async () => {
    await addViaPost('currentlywatching');
    setCurrentlyWatching((cur) => [...cur, { ...anime, list: 'currentlywatching' }]);
  };

  const addToCompleted = async () => {
    await addViaPost('completed');
  };

  const addToPlanToWatch = async () => {
    await addViaPost('plantowatch');
    setPlanToWatch((cur) => [...cur, { ...anime, list: 'plantowatch' }]);
  };

  const { title, synopsis, trailer, aired, images, rank, score, status, rating } = anime || {};

  return (
    <AnimeItemStyled>
      {anime && (
        <div>
          <h1>{title}</h1>
          <div className="details">
            <div className="detail">
              <div className="image">
                <img src={images?.jpg?.large_image_url} alt={title || 'Anime'} />
              </div>
              <div className="anime-details">
                <p><span>Aired:</span><span>{aired?.string || '—'}</span></p>
                <p><span>Rating:</span><span>{rating || '—'}</span></p>
                <p><span>Rank:</span><span>{rank ?? '—'}</span></p>
                <p><span>Score:</span><span>{score ?? '—'}</span></p>
                <p><span>Status:</span><span>{status || '—'}</span></p>
                <div className='button-container'>
                  <button onClick={addToPlanToWatch}>Add to Plan To Watch</button>
                  <button onClick={addToCurrentlyWatching}>Add to Currently Watching</button>
                  <button onClick={addToCompleted}>Add to Completed</button>
                </div>
              </div>
            </div>
            <p className="description">
              {showMore ? (synopsis || '') : ((synopsis || '').substring(0, 450))}{synopsis && synopsis.length > 450 ? '...' : ''}
              <button onClick={() => setShowMore((s) => !s)}>
                {showMore ? 'Show Less' : 'Read More'}
              </button>
            </p>
          </div>

          <h3 className="title">Trailer</h3>
          <div className="trailer-con">
            {trailer?.embed_url ? (
              <iframe
                src={trailer.embed_url}
                title="Trailer"
                width="800"
                height="450"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <h3>Trailer not available</h3>
            )}
          </div>

          <h3 className="title">Characters</h3>
          <div className="characters">
            {characters.slice(0, isExpanded ? characters.length : 12).map((character, index) => {
              const { role } = character;
              const { images, name, mal_id } = character.character || {};
              return (
                <Link to={`/character/${mal_id}`} key={index}>
                  <div className="character">
                    <img src={images?.jpg?.image_url} alt={name || 'Character'} />
                    <h4>{name}</h4>
                    <p>{role}</p>
                  </div>
                </Link>
              );
            })}
            <button onClick={() => setIsExpanded((x) => !x)}>
              {isExpanded ? 'Show Less' : 'Show More'}
            </button>
          </div>
        </div>
      )}
    </AnimeItemStyled>
  );
}

const AnimeItemStyled = styled.div`
  padding: 80px 18rem;
  background-color: black;
  p { color: black; }

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
  }

  h1{
    display: inline-block;
    font-size: 3rem;
    margin-bottom: 1.5rem;
    cursor: pointer;
    background: white;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: all .4s ease-in-out;
    &:hover{ transform: skew(-3deg); }
  }

  .title{
    display: inline-block;
    margin: 3rem 0;
    font-size: 2rem;
    cursor: pointer;
  }

  .description{
    margin-top: 2rem;
    color: #6c7983;
    line-height: 1.7rem;
    button{
      background-color: transparent;
      border: none;
      outline: none;
      cursor: pointer;
      font-size: 1.2rem;
      color: white;
      font-weight: 600;
    }
  }

  .trailer-con{
    display: flex;
    justify-content: center;
    align-items: center;
    iframe{
      outline: none;
      border: 5px solid #e5e7eb;
      padding: 1.5rem;
      border-radius: 10px;
      background-color: #FFFFFF;
    }
  }

  .details{
    background-color: #fff;
    border-radius: 20px;
    padding: 2rem;
    border: 5px solid #e5e7eb;

    .detail{
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      img{ border-radius: 7px; }
    }
    .anime-details{
      display: flex;
      flex-direction: column;
      p{
        display: flex;
        gap: 1rem;
        margin-left: 1em;
      }
      p span:first-child{
        font-weight: 600;
        color: black;
      }
    }
    .button-container {
      display: flex;
      flex-direction: column;
      margin-top: 3em;
    }
  }

  .characters{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-gap: 2rem;
    background-color: #fff;
    padding: 2rem;
    border-radius: 20px;
    border: 5px solid #e5e7eb;
    button { align-self: flex-end; }
    .character{
      padding: .4rem .6rem;
      border-radius: 7px;
      background-color: white;
      transition: all .4s ease-in-out;
      img{ width: 100%; }
      h4{ padding: .5rem 0; color: #454e56; }
      p{ color: orange; }
      &:hover{ transform: translateY(-5px); }
    }
  }
`;

export default AnimeItem;
