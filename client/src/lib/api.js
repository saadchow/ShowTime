// client/src/lib/api.js
import axios from "axios";

// Shared axios instance for your app.
// In production on Render, the client and server share the same origin,
// so a relative baseURL works. In dev, CRA can proxy /api to :5000.
const api = axios.create({
  baseURL: "/api",
});

export default api;
