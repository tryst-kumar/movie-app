import React from 'react';
import { Link } from 'react-router-dom';
import { type Movie } from '../types/tmdb.d';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  return (
    <div
      className="
        relative bg-gray-800 rounded-lg shadow-xl overflow-hidden
        transition-transform transform hover:scale-105 duration-300
        group cursor-pointer
        w-40 sm:w-48 md:w-56 lg:w-64 xl:w-72
        flex-shrink-0
      "
      // Removed inline width, letting Tailwind handle it
    >
      <Link to={`/movie/${movie.id}`}>
        <img
          src={imageUrl}
          alt={movie.title}
          className="w-full h-auto object-cover rounded-t-lg"
          style={{ aspectRatio: '2/3' }} // Maintain aspect ratio for consistent card size
        />
        <div className="p-3 text-white">
          <h3 className="text-sm sm:text-base font-semibold truncate mb-1">
            {movie.title}
          </h3>
          <div className="flex items-center text-xs sm:text-sm text-gray-400">
            ⭐{' '}
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
            <span className="ml-2 text-gray-500">
              ({movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'})
            </span>
          </div>
        </div>
        {/* Overlay for hover effect */}
        <div
          className="
            absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4
            opacity-0 group-hover:opacity-100 transition-opacity duration-300
            text-white text-center text-sm sm:text-base overflow-hidden
          "
        >
          <p className="line-clamp-6">{movie.overview || "No overview available."}</p>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
