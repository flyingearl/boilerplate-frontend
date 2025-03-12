import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://api.boilerplate.test',
  timeout: 1000,
});

instance.defaults.withCredentials = true;
instance.defaults.withXSRFToken = true;

export default instance;
