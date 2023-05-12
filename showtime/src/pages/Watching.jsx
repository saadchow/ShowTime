import React from 'react';
import AnimeList from '../components/AnimeList';

function Watching () {
    const animeList = ["id1", "id2", "id3"]; // Replace with real data

    return (
        <div>
            <h1>Plan to Watch</h1>
            <AnimeList list={animeList} />
        </div>
    );
}

export default Watching;

