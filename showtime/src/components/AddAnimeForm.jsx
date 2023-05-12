import React, { useState } from 'react';
import axios from 'axios';

function AddAnimeForm({ list }) {
    const [animeId, setAnimeId] = useState('');

    const handleSubmit = async event => {
        event.preventDefault();
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/user/${list}/add`, { animeId }, {
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
            });
            setAnimeId('');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={animeId}
                onChange={e => setAnimeId(e.target.value)}
                placeholder="Enter Anime ID"
            />
            <button type="submit">Add to {list}</button>
        </form>
    );
}

export default AddAnimeForm;
