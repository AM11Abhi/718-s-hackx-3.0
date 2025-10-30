// TMDB API Service
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'YOUR_API_KEY_HERE';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genres: Array<{ id: number; name: string }>;
  runtime: number;
  status: string;
  tagline: string;
  videos?: {
    results: Array<{
      key: string;
      site: string;
      type: string;
      name: string;
    }>;
  };
  credits?: {
    crew: Array<{
      id: number;
      name: string;
      job: string;
      department: string;
    }>;
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
  };
}

// Search for a movie by title
export async function searchMovie(query: string): Promise<TMDBMovie[]> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search movie');
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching movie:', error);
    throw error;
  }
}

// Get detailed movie information
export async function getMovieDetails(movieId: number): Promise<TMDBMovie> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=videos,credits`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
}

// Get movie by title (searches and returns detailed info of first match)
export async function getMovieByTitle(title: string): Promise<TMDBMovie | null> {
  try {
    const searchResults = await searchMovie(title);
    
    if (searchResults.length === 0) {
      return null;
    }
    
    // Get detailed info for the first result
    const movieDetails = await getMovieDetails(searchResults[0].id);
    return movieDetails;
  } catch (error) {
    console.error('Error getting movie by title:', error);
    return null;
  }
}

// Helper function to get full poster URL
export function getPosterUrl(posterPath: string | null, size: 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
  if (!posterPath) {
    return 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop';
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`;
}

// Helper function to get full backdrop URL
export function getBackdropUrl(backdropPath: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string {
  if (!backdropPath) {
    return 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=1200&h=675&fit=crop';
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${backdropPath}`;
}

// Helper function to get YouTube trailer URL
export function getTrailerUrl(movie: TMDBMovie): string | null {
  if (!movie.videos || !movie.videos.results) {
    return null;
  }
  
  const trailer = movie.videos.results.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );
  
  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
}

// Helper function to get director name
export function getDirector(movie: TMDBMovie): string {
  if (!movie.credits || !movie.credits.crew) {
    return 'Unknown';
  }
  
  const director = movie.credits.crew.find((person) => person.job === 'Director');
  return director ? director.name : 'Unknown';
}

// Convert TMDB movie to app movie format
export function convertTMDBToAppMovie(tmdbMovie: TMDBMovie, similarityScore: number = 0.85) {
  return {
    title: tmdbMovie.title,
    year: tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear() : 0,
    director: getDirector(tmdbMovie),
    genres: tmdbMovie.genres.map((g) => g.name),
    plot_summary: tmdbMovie.overview,
    poster_url: getPosterUrl(tmdbMovie.poster_path),
    backdrop_url: getBackdropUrl(tmdbMovie.backdrop_path),
    trailer_url: getTrailerUrl(tmdbMovie) || '',
    similarity_score: similarityScore,
    reason_for_recommendation: [
      tmdbMovie.tagline || 'Highly rated movie',
      `Rating: ${tmdbMovie.vote_average.toFixed(1)}/10`,
      `${tmdbMovie.vote_count.toLocaleString()} votes`,
    ],
    runtime: tmdbMovie.runtime,
    rating: tmdbMovie.vote_average,
    tagline: tmdbMovie.tagline,
  };
}
