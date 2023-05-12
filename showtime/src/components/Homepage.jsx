import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Anime from './Anime';

function Homepage() {
    const [animeList, setAnimeList] = useState([]);

    useEffect(() => {
        const url = `${process.env.REACT_APP_JIKAN_API_URL}/seasons/now`;

        async function fetchCurrentSeasonAnime() {
            try {
                const response = await axios.get(url);
                setAnimeList(response.data.anime);
            } catch (error) {
                console.error('Error fetching current season anime:', error);
            }
        }

        fetchCurrentSeasonAnime();
    }, []);

    return (
        <div>
            <h1>Welcome to ShowTime!</h1>
            {animeList.length > 0 ? (
                <div>
                    {animeList.map(anime => (
                        <Anime key={anime.mal_id} data={anime} />
                    ))}
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

export default Homepage;



