import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimeContext } from './AnimeContext';
import styled from 'styled-components';
import axios from 'axios';

const Completed = () => {
  const { completed, setCompleted, setNotification } = useContext(AnimeContext);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

const removeFromCompleted = (id) => {
  axios.delete(`http://localhost:5000/api/anime/${id}`)
    .then(() => {
      setCompleted(current => current.filter(anime => anime.mal_id !== id));
      setLoading(true); // set loading to true before data is fetched
      setNotification(`Anime removed from Completed`);
    })
    .catch(error => {
      console.error("Error removing anime: ", error);
      console.log('Error details:', error.response); // log the error details
    });
};

useEffect(() => {
  axios.get('http://localhost:5000/api/anime/completed')
    .then(response => {
      setCompleted(response.data);
      setLoading(false); // set loading to false after data is fetched
      setHasFetched(true); 
    })
    .catch(error => {
      console.error("Error fetching anime: ", error);
      console.log('Error details:', error.response); // log the error details
    });
}, [setCompleted, loading]);


   return (
    <ListStyled>
      <div className='body'>
        <h1 style={{ textAlign: 'center' }}>Completed</h1>
        {!hasFetched ? ( // modify this line
          <p>Loading...</p>
        ) : completed.length > 0 ? (
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
              {completed.map((anime, index) => (
                <tr key={anime.mal_id}>
                  <td>{index + 1}</td>
                  <td>
                    <Link to={`/anime/${anime.mal_id}`}>
                      <img src={anime.images?.jpg?.large_image_url} alt={anime.title} />
                    </Link>
                  </td>
                  <td>
                    <strong>{anime.title}</strong><br/>
                    {anime.type} - {anime.episodes} episode(s)<br/>
                    {anime.aired?.string}<br/>
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
                    <button onClick={() => removeFromCompleted(anime.mal_id)}title="Delete">
                    <i class="material-icons">delete</i>
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

export default Completed;
