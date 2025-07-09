import axios from 'axios';

const apiClientForm = axios.create({
  baseURL: 'http://127.0.0.1:3001/api',
  withCredentials: true,
});
export default apiClientForm;