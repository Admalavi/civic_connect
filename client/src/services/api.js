import axios from 'axios';
const api=axios.create({baseURL:import.meta.env.VITE_API_URL||'/api'});
api.interceptors.request.use(c=>{if(localStorage.token)c.headers.Authorization='Bearer '+localStorage.token;return c});
export const errMsg=e=>e.response?.data?.message||e.message;
export default api;
