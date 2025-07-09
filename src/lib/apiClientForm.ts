import axios from 'axios';

const apiClientForm = axios.create({
  baseURL: 'https://imjuver-backend.onrender.com/api',
  withCredentials: true,
});
export default apiClientForm;
//https://imjuver-backend.onrender.com/api