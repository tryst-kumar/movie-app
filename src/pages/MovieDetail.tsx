import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchFromApi } from '../api/tmdb';

interface FullMovieDetail {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  genres: { id: number; name: string }[];
  runtime: number; // in minutes
  tagline: string | null;
  // Add other properties like production companies, budget, revenue, etc.
  credits?: { // Added for cast/crew
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
    crew: { id: number; name: string; job: string; profile_path: string | null }[];
  };
  videos?: { // Added for trailers
    results: { id: string; key: string; name: string; site: string; type: string }[];
  };
}

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<FullMovieDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMovieDetail = async () => {
      if (!id) {
        setError('Movie ID is missing.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);

        // Fetch main movie details
        const movieData: FullMovieDetail = await fetchFromApi(`/movie/${id}`, { language: 'en-US' });

        // Fetch credits (cast & crew)
        const creditsData = await fetchFromApi(`/movie/${id}/credits`);
        movieData.credits = creditsData;

        // Fetch videos (for trailers)
        const videosData = await fetchFromApi(`/movie/${id}/videos`);
        movieData.videos = videosData;

        setMovie(movieData);
      } catch (err) {
        setError('Failed to fetch movie details. It might not exist or there was an API error.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getMovieDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-white text-xl">Loading movie details...</p>
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

  if (!movie) {
    return (
      <div className="text-center text-gray-400 text-xl mt-10 p-4">
        Movie not found.
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : `https://via.placeholder.com/1920x1080?text=No+Backdrop`;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : `https://via.placeholder.com/500x750?text=No+Poster`;

  const director = movie.credits?.crew.find(person => person.job === 'Director');
  const topCast = movie.credits?.cast.slice(0, 8); // Show top 8 cast members
  const trailer = movie.videos?.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');

  return (
    <div className="movie-detail-container bg-gray-900 text-white min-h-screen pb-10">
      {/* Backdrop Section */}
      <div
        className="relative h-96 md:h-[500px] lg:h-[600px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-end w-full">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-36 h-auto sm:w-48 md:w-64 rounded-lg shadow-xl border-2 border-gray-700 mb-4 md:mb-0 md:mr-8 flex-shrink-0"
          />
          <div className="text-center md:text-left w-full">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-2 text-blue-400">
              {movie.title}
            </h1>
            {movie.tagline && <p className="text-lg sm:text-xl text-gray-400 italic mb-4">{movie.tagline}</p>}
            <div className="flex flex-wrap justify-center md:justify-start items-center text-lg sm:text-xl text-gray-300 gap-x-4 gap-y-2">
              <span>⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} / 10</span>
              <span>📅 {movie.release_date}</span>
              <span>⏱️ {movie.runtime} min</span>
              {movie.genres && movie.genres.length > 0 && (
                <span>
                  Genres: {movie.genres.map(g => g.name).join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto p-6 sm:p-8">
        <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2">Overview</h2>
        <p className="text-lg leading-relaxed mb-8 text-gray-300">{movie.overview}</p>

        {/* Director */}
        {director && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-3 border-b border-gray-700 pb-1">Director</h3>
            <p className="text-xl text-blue-300">{director.name}</p>
          </div>
        )}

        {/* Top Cast */}
        {topCast && topCast.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-3 border-b border-gray-700 pb-1">Top Cast</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {topCast.map(person => (
                <div key={person.id} className="text-center bg-gray-800 rounded-lg p-2 shadow-md">
                  <img
                    src={person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : 'https://via.placeholder.com/185x278?text=No+Photo'}
                    alt={person.name}
                    className="w-24 h-24 object-cover rounded-full mx-auto mb-2 border border-gray-600"
                  />
                  <p className="font-semibold text-sm truncate">{person.name}</p>
                  <p className="text-xs text-gray-400 truncate">{person.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trailer */}
        {trailer && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-3 border-b border-gray-700 pb-1">Trailer</h3>
            <div className="aspect-w-16 aspect-h-9 w-full rounded-lg overflow-hidden shadow-lg">
                {/* For real app, use react-youtube or react-player */}
                <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title={trailer.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
            <p className="text-sm text-gray-400 mt-2 text-center">"{trailer.name}"</p>
          </div>
        )}

        {/* You can add more sections like Similar Movies, Reviews, etc. */}
      </div>
    </div>
  );
};

export default MovieDetail;