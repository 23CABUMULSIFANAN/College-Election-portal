import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "https://college-election-portal.onrender.com/api",
});

export default api;