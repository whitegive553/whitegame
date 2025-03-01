import axios from 'axios';

// 使用 `.env` 里的 API 地址
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});

export default api;
