import axios from "axios";

const api = axios.create(
    {
        BASE_URL: "http://localhost:5000"
    }
);

export default api;
