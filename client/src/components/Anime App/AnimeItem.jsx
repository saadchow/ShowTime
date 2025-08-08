import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { AnimeContext } from './AnimeContext';
import axios from 'axios';
import { useClerk } from '@clerk/clerk-react';

function AnimeItem() {
  const { id } = useParams();
  const [anime, setAnime] = React.useState({});
  const [characters, setCharacters] = React.useState([]);
  const [showMore, setShowMore] = React.useState(false);
  const { setCurrentlyWatching, setPlanToWatch, setNotification } = React.useContext(AnimeContext);
  const { user } = useClerk();

  const {
    title,
    synopsis,
    trailer,
    aired,
    images,
    rank,
    score,
    status,
    rating,
  } = anime;

  // --- helper to add/override query params on the embed url ---
  const withParams = (url, params) => {
    try {
      const u = new URL(url);
      Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
      return u.toString();
    } catch {
      return url; // if parsing fails, use original
    }
  };

  // Choose ONE of these. Default: muted autoplay.
  const embedSrcMutedAutoplay = trailer?.embed_url
    ? withParams(trailer.embed_url, {
        autoplay: '1',
        mute: '1',
        playsinline: '1',
        rel: '0',
        modestbranding: '1',
      })
    : null;

  const embedSrcNoAutoplay = trailer?.embed_url
    ? withParams(trailer.embed_url, {
        autoplay: '0',
        mute: '1',
        playsinline: '1',
        rel: '0',
        modestbranding: '1',
      })
    : null;

  // pick which one to use:
  const embedSrc = embedSrcMutedAutoplay; // or change to embedSrcNoAutoplay

  const getAnime = async (animeId) => {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
    const data = await response.json();
    setAnime(data.data);
  };

  const getCharacters = async (animeId) => {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/characters`);
    const data = await response.json();
    setCharacters(data.data);
    console.log(data.data);
  };

  const addToCurrentlyWatching = () => {
    axios.defaults.headers.common['x-clerk-user-id'] = user.id;
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/anime`,
        { ...anime, list: 'currentlywatching' },
        { headers: { 'x-clerk-user-id': user.id } }
      )
      .then(() => {
        setCurrentlyWatching((current) => [...current, anime]);
        setNotification(`Anime added to "Currently Watching"`);
      })
      .catch((error) => console.error('Error adding anime: ', error));
  };

  const addToCompleted = () => {
    axios.defaults.headers.common['x-clerk-user-id'] = user.id;
    console.log('THIS IS THE START OF THE FUNCTION BEFORE THE THEN STATEMENT');
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/anime`,
        { ...anime, list: 'completed' },
        { headers: { 'x-clerk-user-id': user.id } }
      )
      .then(() => {
        setNotification(`Anime added to "Completed"`);
      })
      .catch((error) => console.error('Error adding anime: ', error));
  };

  const addToPlanToWatch = () => {
    axios.defaults.headers.common['x-clerk-user-id'] = user.id;
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/anime`,
        { ...anime, list: 'plantowatch' },
        { headers: { 'x-clerk-user-id': user.id } }
      )
      .then(() => {
        setPlanToWatch((current) => [...current, anime]);
        setNotification(`Anime added to "Plan To Watch"`);
      })
      .catch((error) => console.error('Error adding anime: ', error));
  };

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    getAnime(id);
    getCharacters(id);
  }, [id]);

  return (
    <AnimeItemStyled>
      {anime && (
        <div>
          <h1>{title}</h1>
          <div className="details">
            <div className="detail">
              <div className="image">
                <img src={images && images.jpg.large_image_url} alt="" />
              </div>
              <div className="anime-details">
                <p>
                  <span>Aired:</span>
                  <span>{aired && aired.string}</span>
                </p>
                <p>
                  <span>Rating:</span>
                  <span>{rating}</span>
                </p>
                <p>
                  <span>Rank:</span>
                  <span>{rank}</span>
                </p>
                <p>
                  <span>Score:</span>
                  <span>{score}</span>
                </p>
                <p>
                  <span>Status:</span>
                  <span>{status}</span>
                </p>
                <div className="button-container">
                  <button onClick={addToPlanToWatch}>Add to Plan To Watch</button>
                  <button onClick={addToCurrentlyWatching}>Add to Currently Watching</button>
                  <button onClick={addToCompleted}>Add to Completed</button>
                </div>
              </div>
            </div>
            <p className="description">
              {showMore ? synopsis : (synopsis && synopsis.substring(0, 450)) + '...'}
              <button
                onClick={() => {
                  setShowMore(!showMore);
                }}
              >
                {showMore ? 'Show Less' : 'Read More'}
              </button>
            </p>
          </div>
          <h3 className="title">Trailer</h3>
          <div className="trailer-con">
            {embedSrc ? (
              <iframe
                src={embedSrc}
                title="Trailer"
                width="800"
                height="450"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <h3>Trailer not available</h3>
            )}
          </div>
          <h3 className="title">Characters</h3>
          <div className="characters">
            {characters &&
              characters
                .slice(0, isExpanded ? characters.length : 12)
                .map((character, index) => {
                  const { role } = character;
                  const { images, name, mal_id } = character.character;
                  return (
                    <Link to={`/character/${mal_id}`} key={index}>
                      <div className="character">
                        <img src={images && images.jpg.image_url} alt="" />
                        <h4>{name}</h4>
                        <p>{role}</p>
                      </div>
                    </Link>
                  );
                })}
            <button onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? 'Show Less' : 'Show More'}
            </button>
          </div>
        </div>
      )}
    </AnimeItemStyled>
  );
}

const AnimeItemStyled = styled.div`
  padding: 80px 4vw;
  background-color: var(--bg);

  p { color: var(--muted); }

  button {
    margin: 0.6rem 0.6rem 0 0;
    padding: 0.6rem 0.9rem;
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
  button:hover { transform: translateY(-1px); opacity: 0.95; }

  h1{
    display: inline-block;
    font-size: 3rem;
    margin-bottom: 1.5rem;
    color: var(--text);
    -webkit-text-fill-color: currentColor; /* neutralize old text mask */
    transition: transform .2s ease;
  }
  h1:hover{ transform: skew(-3deg); }

  .title{
    display: inline-block;
    margin: 3rem 0 1rem;
    font-size: 2rem;
    color: var(--text);
  }

  .description{
    margin-top: 1.25rem;
    line-height: 1.75rem;
    button{
      background: transparent;
      color: var(--accent);
      border: none;
      padding: 0;
      font-size: 1rem;
      font-weight: 700;
    }
  }

  .trailer-con{
    display: flex;
    justify-content: center;
    align-items: center;
    iframe{
      outline: none;
      border: 1px solid var(--ring);
      padding: 0.75rem;
      border-radius: 12px;
      background-color: var(--surface);
      width: min(100%, 900px);
      height: 506px; /* 16:9 of 900px width; the iframe's own size props can stay */
      max-width: 100%;
    }
  }

  .details{
    background-color: var(--surface);
    border-radius: 16px;
    padding: 2rem;
    border: 1px solid var(--ring);

    .detail{
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
      img{ border-radius: 10px; width: 100%; height: auto; }
    }
    .anime-details{
      display: flex;
      flex-direction: column;
      gap: .4rem;

      p{
        display: flex;
        gap: 0.75rem;
        margin-left: 0.2rem;
        color: var(--text);
      }
      p span:first-child{
        font-weight: 600;
        color: var(--muted);
        min-width: 4.5rem;
        display: inline-block;
      }
    }
    .button-container {
      display: flex;
      flex-wrap: wrap;
      gap: .5rem;
      margin-top: 1.25rem;
    }
  }

  .characters{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
    background-color: var(--surface);
    padding: 1.25rem;
    border-radius: 16px;
    border: 1px solid var(--ring);

    button { align-self: center; }

    .character{
      padding: .5rem .6rem;
      border-radius: 10px;
      background-color: var(--surface);
      outline: 1px solid var(--ring);
      transition: transform .15s ease, box-shadow .15s ease;

      img{ width: 100%; border-radius: 8px; }
      h4{ padding: .5rem 0 .25rem; color: var(--text); }
      p{ color: var(--accent); font-weight: 600; }

      &:hover{
        transform: translateY(-3px);
        box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
      }
    }
  }

  @media (max-width: 900px){
    padding: 60px 5vw;
    .detail{ grid-template-columns: 1fr; }
  }
`;

export default AnimeItem;
