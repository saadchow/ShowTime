import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { AnimeContext } from './AnimeContext';
import axios from 'axios';
import { useClerk } from '@clerk/clerk-react';

function AnimeItem() {
    const {id} = useParams()
    const [anime, setAnime] = React.useState({})
    const [characters, setCharacters] = React.useState([])
    const [showMore, setShowMore] = React.useState(false)
    const {
        title, synopsis, 
        trailer,aired, 
        images, rank, 
        score, 
        status, rating,} = anime
    const getAnime = async (anime) => {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${anime}`)
        const data = await response.json()
        setAnime(data.data)
    }
    const getCharacters = async (anime) => {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${anime}/characters`)
        const data = await response.json()
        setCharacters(data.data)
        console.log(data.data)
    }
    const { setCurrentlyWatching, setPlanToWatch, setNotification } = React.useContext(AnimeContext);   

    const { user } = useClerk();

    const addToCurrentlyWatching = () => {
        axios.defaults.headers.common['x-clerk-user-id'] = user.id; // replace 'user-id' with actual user id from Clerk

        axios.post('http://localhost:5000/api/anime', { ...anime, list: 'currentlywatching' }, {
            headers: { 'x-clerk-user-id': user.id }
      })
      .then(() => {
        setCurrentlyWatching(current => [...current, anime]);
        setNotification(`Anime added to "Currently Watching"`);
      })
      .catch(error => console.error("Error adding anime: ", error));
    };

    const addToCompleted = () => {
        // AnimeItem.jsx
        axios.defaults.headers.common['x-clerk-user-id'] = user.id; // replace 'user-id' with actual user id from Clerk
        console.log('THIS IS THE START OF THE FUNCTION BEFORE THE THEN STATEMENT');
        axios.post('http://localhost:5000/api/anime', { ...anime, list: 'completed' }, {
            headers: { 'x-clerk-user-id': user.id }
      })
      .catch(error => console.error("Error adding anime: ", error));
    };

    const addToPlanToWatch = () => {

        // AnimeItem.jsx
        axios.defaults.headers.common['x-clerk-user-id'] = user.id; // replace 'user-id' with actual user id from Clerk 
        axios.post('http://localhost:5000/api/anime', { ...anime, list: 'plantowatch' }, {
            headers: { 'x-clerk-user-id': user.id }
      })
      .then(() => {
        setPlanToWatch(current => [...current, anime]);
        setNotification(`Anime added to "Plan To Watch"`);
      })
      .catch(error => console.error("Error adding anime: ", error));
    };

     const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
    getAnime(id);
    getCharacters(id);
}, [id]);

    return (
        <AnimeItemStyled>
            <h1>{title}</h1>
            <div className="details">
                <div className="detail">
                    <div className="image">
                        <img src={images && images.jpg.large_image_url} alt="" />
                    </div>
                    <div className="anime-details">
                        <p><span>Aired:</span><span>{aired && aired.string}</span></p>
                        <p><span>Rating:</span><span>{rating}</span></p>
                        <p><span>Rank:</span><span>{rank}</span></p>
                        <p><span>Score:</span><span>{score}</span></p>
                        <p><span>Status:</span><span>{status}</span></p>
                        <button onClick={addToPlanToWatch}>Add to Plan To Watch</button>
                        <button onClick={addToCurrentlyWatching}>Add to Currently Watching</button>
                        <button onClick={addToCompleted}>Add to Completed</button>

                    </div>
                </div>
                <p className="description">
                    {showMore ? synopsis : (synopsis && synopsis.substring(0, 450)) + '...'}
                    <button onClick={() => {
                        setShowMore(!showMore)
                    }}>{showMore ? 'Show Less': 'Read More'}</button>
                </p>
            </div>
            <h3 className="title">Trailer</h3>
            <div className="trailer-con">
                {trailer && trailer.embed_url ? 
                    <iframe 
                        src={trailer && trailer.embed_url} 
                        title="Inline Frame Example"
                        width="800"
                        height="450"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen>
                    </iframe> :
                    <h3>Trailer not available</h3>
                }
            </div>
            <h3 className="title">Characters</h3>
            <div className="characters">
            {characters && characters.slice(0, isExpanded ? characters.length : 12).map((character, index) => {
                const {role} = character;
                const {images, name, mal_id} = character.character;
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

        </AnimeItemStyled >
    )
}

const AnimeItemStyled = styled.div`
    padding: 80px 18rem;
    background-color: black;
    p {
        color: black;
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
        &:hover{
            transform: skew(-3deg);
        }
    }
    .title{
        display: inline-block;
        margin: 3rem 0;
        font-size: 2rem;
        cursor: pointer;
        background:linear-gradient( to right, #A855F7 23%, #27AE60);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
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
            color: #27AE60;
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
            img{
                border-radius: 7px;
            }
        }
        .anime-details{
            display: flex;
            flex-direction: column;
            p{
                display: flex;
                gap: 1rem;
            }
            p span:first-child{
                font-weight: 600;
                color: #454e56;
            }
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
        button {
         align-self: flex-end;
            }
        .character{
            padding: .4rem .6rem;
            border-radius: 7px;
            background-color: #EDEDED;
            transition: all .4s ease-in-out;
            img{
                width: 100%;
            }
            h4{
                padding: .5rem 0;
                color: #454e56;
            }
            p{
                color: #27AE60;
            }
            &:hover{
                transform: translateY(-5px);
            }
        }
    }
`;

export default AnimeItem