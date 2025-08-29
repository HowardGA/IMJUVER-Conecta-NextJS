import axios from 'axios';

const apiClientForm = axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials: true,
});
export default apiClientForm;
//https://imjuver-backend.onrender.com/api