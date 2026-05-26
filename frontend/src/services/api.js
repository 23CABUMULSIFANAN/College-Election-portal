

import axios from "axios";

const api = axios.create({
    baseURL: "https://college-election-api.onrender.com/api",
});

export default api;