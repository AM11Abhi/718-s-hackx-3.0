import { useState } from "react";
import Hero from "@/components/Hero";
import GraphSection from "@/components/GraphSection";
import MovieModal from "@/components/MovieModal";
import { dummyMovies } from "@/data/dummyMovies";

const Index = () => {
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [movies] = useState(dummyMovies); // In production, this would be fetched from API

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // TODO: API integration point
    // const response = await fetch(`/api/search?q=${query}`);
    // const data = await response.json();
    // setMovies(data.recommended_movies);
    
    setHasSearched(true);
    
    // Smooth scroll to graph
    setTimeout(() => {
      document.getElementById("graph-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleMovieClick = (movie: any) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="min-h-screen">
      <Hero onSearch={handleSearch} />
      
      {hasSearched && (
        <div id="graph-section">
          <GraphSection movies={movies} onMovieClick={handleMovieClick} />
        </div>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Index;
