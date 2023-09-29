import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimeContext } from './AnimeContext';
import styled from 'styled-components';
import axios from 'axios';

const CurrentlyWatching = () => {
  const { setCompleted, currentlyWatching, setCurrentlyWatching, setNotification } = useContext(AnimeContext);

  useEffect(() => {
  axios.get(`${process.env.REACT_APP_API_URL}api/anime/currentlywatching`)
    .then(response => setCurrentlyWatching(response.data))
    .catch(error => console.error("Error fetching anime: ", error));
}, [setCurrentlyWatching]);

  const removeFromCurrentlyWatching = (id) => {
    axios.delete(`${process.env.REACT_APP_API_URL}api/anime/${id}`)
      .then(() => {
        setCurrentlyWatching(current => current.filter(anime => anime.mal_id !== id));
        setNotification(`Anime removed from "Currently Watching"`);
      })
      .catch(error => console.error("Error removing anime: ", error));
  };

  const addToCompleted = (anime) => {
  // First, remove the anime from the "Currently Watching" list
  removeFromCurrentlyWatching(anime.mal_id);

  // Then, create a new anime object with the list value set to 'completed'
  const updatedAnime = { ...anime, list: 'completed' };

  // Finally, send a POST request to add the updated anime to the "Completed" list
  axios.post(`${process.env.REACT_APP_API_URL}api/anime`, updatedAnime)
    .then(response => {
      setCompleted(current => [...current, response.data]);
      setNotification(`Anime moved to "Completed"`);
    })
    .catch(error => console.error("Error adding anime: ", error));
};

  return (
    <ListStyled>
      <div className='body'>
        <h1 style={{ textAlign: 'center' }}>Currently Watching</h1>
        {currentlyWatching && currentlyWatching.length > 0 ? (
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
              {currentlyWatching && currentlyWatching.map((anime, index) => (
                <tr key={anime.mal_id}>
                  <td>{index + 1}</td>
                  <td>
                    <Link to={`/anime/${anime.mal_id}`}>
                      <img src={anime.images && anime.images.jpg && anime.images.jpg.large_image_url} alt={anime.title_english || anime.title} />
                    </Link>
                  </td>
                   <td>
                    <strong>{anime.title_english || anime.title}</strong><br/>
                    {anime.type} - {anime.episodes} episode(s)<br/>
                    {anime.aired && anime.aired.string}<br/>
                    <br/>
                    {anime.synopsis.length > 100 
                      ? <>
                          {anime.synopsis.substring(0, 300)}...
                          <Link to={`/anime/${anime.mal_id}`}><span>Read More</span></Link>
                        </>
                      : anime.synopsis
                    }
                  </td>
                  <td className="score">
                     <i id="star" class="material-icons">star</i>{anime.score}
                  </td>
                   <td>
                    <button onClick={() => addToCompleted(anime)}>
                      <span title='Add to Completed'> 
                      <i class="material-icons">check</i>
                      </span>
                    </button>
                    <button onClick={() => removeFromCurrentlyWatching(anime.mal_id)}>
                      <span title='Delete'>
                     <i class="material-icons">delete</i>
                     </span>
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
  background: black;
  color: white;

  .body {
    background: black;
    width: 70%;
    margin: auto;
  }

  button {
    width: 30px; 
    height: 30px; 
    margin-right: 10px;
    background: transparent;
    border: none;
  }

  .material-icons {
    color: white;
    stroke: white;
    stroke-width: 1px;
    margin-right: 5px;
    align-self: center;
    cursor: pointer;
  }

  #star {
    position: relative;
    top: 4px;
  }
  
  span {
    font-weight: bold;
    color: white;
  }

  table {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }

  img {
    width: 100px;
    height: auto;
  }

  th, td {
    padding: 15px;
  }

  tr {
    border-bottom: 1px solid white;
  }

  strong {
    font-size: calc(1em + 5px); 
  }

  td:nth-child(3) {
    font-size: calc(1em - 5px);
    text-align: left;
  }

  th:nth-child(4), td:nth-child(4), th:nth-child(5), td:nth-child(5) {
    width: calc(1em + 100px);
  }

`;


export default CurrentlyWatching;
