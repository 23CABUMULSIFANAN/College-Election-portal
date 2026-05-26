

import axios from "axios";

const api = axios.create({
    baseURL: "https://college-election-portal.onrender.com/api",
});

export default api;