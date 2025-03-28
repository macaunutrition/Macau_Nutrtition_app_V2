import axios from 'axios';

export const httpFactory = axios.create({
   baseURL: 'http://24.199.118.232:8000',
   headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
   },
});
