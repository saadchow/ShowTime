import React, { useState } from 'react';
import axios from 'axios';

function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://api.aniapi.com/v1/anime?title=${searchTerm}`);
            if (response.data) {
                setResults(response.data);
            } else {
                setError('No results found');
            }
        } catch (error) {
            setError(error.message);
        }
        setLoading(false);
    };

    return (
        <div>
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <button onClick={handleSearch}>Search</button>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : results.map(anime => (
                <div key={anime.id}>
                    <h2>{anime.title}</h2>
                    <p>{anime.description}</p>
                </div>
            ))}
        </div>
    );
}

export default Search;
