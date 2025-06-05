import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import SearchResults from './pages/SearchResult';
import Navbar from './components/Navbar';
// import Footer from './components/Footer'; // If you create one

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <main className="min-h-[calc(100vh-80px)]"> {/* Adjust height based on navbar height */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/search" element={<SearchResults />} />
          {/* Add more routes here for TV shows, genres, etc. */}
          <Route path="*" element={<h1 className="text-white text-center text-3xl mt-10">404: Page Not Found</h1>} />
        </Routes>
      </main>
      {/* <Footer /> */}
    </Router>
  );
};

export default App;