import axios from 'axios'

const api = axios.create({
  baseURL: 'http://api.boilerplate.test',
  timeout: 1000,
});

api.defaults.withCredentials = true;
api.defaults.withXSRFToken = true;

export default api;
