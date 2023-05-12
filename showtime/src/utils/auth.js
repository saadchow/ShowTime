import axios from 'axios';

export async function login(username, password) {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, { username, password });
        localStorage.setItem('token', response.data.token);
    } catch (error) {
        console.error(error);
        
    }
}

export async function register(username, password) {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, { username, password });
        localStorage.setItem('token', response.data.token);
    } catch (error) {
        console.error(error);
        
    }
}

export function logout() {
    localStorage.removeItem('token');
    
}
