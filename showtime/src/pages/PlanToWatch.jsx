import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimeList from '../components/AnimeList';

function PlanToWatch({ user }) {
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    return (
        <div>
            <h1>Plan to Watch</h1>
            {user && <AnimeList list={user.planToWatch} />}
        </div>
    );
}

export default PlanToWatch;

