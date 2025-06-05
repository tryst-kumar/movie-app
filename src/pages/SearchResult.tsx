import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchFromApi } from '../api/tmdb';
import { type Movie, type PaginatedResponse } from '../types/tmdb'; // Use type-only import
import MovieCard from '../components/MovieCard';

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchMovies = async () => {
      if (!query) {
        setMovies([]);
        setLoading(false);
        setError(null);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const data: PaginatedResponse<Movie> = await fetchFromApi('/search/movie', {
          query: query,
          language: 'en-US',
          page: 1,
        });
        setMovies(data.results);
      } catch (err) {
        setError(`Failed to search for "${query}". Please try again later.`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [query]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-white text-xl">Searching for "{query}"...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-xl mt-10 p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="search-results-container p-4 sm:p-6 md:p-8 bg-gray-950 min-h-screen text-white">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-8 text-center text-blue-400">
        Results for "{query}"
      </h1>
      <div className="
        grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6
        gap-4 sm:gap-6 md:gap-8 justify-items-center
      ">
        {movies.length > 0 ? (
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        ) : (
          <p className="text-lg text-gray-400 col-span-full">No movies found for "{query}".</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;