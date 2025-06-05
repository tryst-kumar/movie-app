import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-gray-900 p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        {/* Logo/Site Title */}
        <Link to="/" className="text-white text-3xl font-extrabold tracking-wide hover:text-blue-400 transition-colors">
          MoviePulse
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              flex-grow p-2 rounded-l-md bg-gray-700 text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500
              border border-gray-600
            "
          />
          <button
            type="submit"
            className="
              bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700
              transition-colors font-medium
            "
          >
            Search
          </button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;