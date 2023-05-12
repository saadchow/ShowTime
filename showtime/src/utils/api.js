import axios from 'axios';

const ANI_API_URL = 'https://api.aniapi.com/v1/anime';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export async function getAnime(searchTerm) {
    try {
        const response = await axios.get(ANI_API_URL, {
            params: { title: searchTerm }
        });
        if (response.status === 200) {
            return { data: response.data.data.documents, error: null };
        }
    } catch (error) {
        console.error(error);
        return { data: null, error: error };
    }
}


export async function getAnimeList(list) {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/${list}`, {
            headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function loginUser(username, password) {
    try {
        const response = await api.post('/login', { username, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data.user;
    } catch (error) {
        console.error(error);
    }
}

export async function checkAuth() {
    try {
        const response = await api.get('/check-auth', {
            headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
        });
        return response.data.user;
    } catch (error) {
        console.error(error);
    }
}

export function logoutUser() {
  localStorage.removeItem('token');
}
