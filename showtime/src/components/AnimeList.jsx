import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import Anime from './Anime';

async function fetchAnimes(list) {
    const promises = list.map(id => axios.get(`${process.env.REACT_APP_API_URL}/anime/${id}`));
    const animes = await Promise.all(promises);
    return animes.map(response => response.data);
}

function AnimeList({ list }) {
    const { data: animes, isLoading, isError, error } = useQuery(['animeList', list], () => fetchAnimes(list));

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            {animes.map(anime => (
                <Anime key={anime._id} anime={anime} />
            ))}
        </div>
    );
}

export default AnimeList;
