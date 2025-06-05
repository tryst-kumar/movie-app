// src/api/tmdb.ts
import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY; // For Vite
// const API_KEY = process.env.REACT_APP_TMDB_API_KEY; // For Create React App
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL; // For Vite
// const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL; // For Create React App

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY, // Use this for v3 endpoints
  },
  headers: {
    // 'Authorization': `Bearer ${import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN}`, // For v4 endpoints
    'Content-Type': 'application/json',
  },
});

export const fetchFromApi = async (url: string, params?: Record<string, any>) => {
  try {
    const { data } = await tmdbApi.get(url, { params });
    return data;
  } catch (error) {
    console.error("Error fetching data from TMDB:", error);
    throw error; // Re-throw to handle in components
  }
};