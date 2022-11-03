import axios from 'axios';
import dotenv from  'dotenv';
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000/api/v1/';

export default axios.create({
  baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});