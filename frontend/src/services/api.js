import axios from "axios"

const api=axios.create({
    baseURL: "https://college-election-portal.onrender.com",
})
export default api