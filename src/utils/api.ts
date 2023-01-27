import axios from 'axios';
import { baseURI } from './baseURI';

export const api = axios.create({
  baseURL: `http://${baseURI}:3001`
});
