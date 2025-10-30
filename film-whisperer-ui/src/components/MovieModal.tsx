import { X, Play, Star, Calendar, User, Film } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface Movie {
  title: string;
  year: number;
  director: string;
  genres: string[];
  plot_summary: string;
  poster_url: string;
  trailer_url: string;
  similarity_score: number;
  reason_for_recommendation: string[];
}

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  const similarityPercentage = Math.round(movie.similarity_score * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-card border-2 border-border rounded-3xl shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 bg-background/80 backdrop-blur-sm border border-border rounded-full hover:bg-background transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Left: Poster */}
          <div className="space-y-4">
            <div className="relative group overflow-hidden rounded-2xl">
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Play Button Overlay */}
              <a
                href={movie.trailer_url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <div className="flex items-center gap-3 px-6 py-3 bg-primary rounded-full shadow-lg transform transition-transform hover:scale-110">
                  <Play className="w-6 h-6 fill-current" />
                  <span className="font-semibold">Watch Trailer</span>
                </div>
              </a>
            </div>

            {/* Similarity Score */}
            <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border">
              <span className="text-sm text-muted-foreground">Match Score</span>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round((movie.similarity_score * 5))
                          ? "fill-accent text-accent"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-bold text-accent">{similarityPercentage}%</span>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-4xl font-display font-bold leading-tight">
                {movie.title}
              </h2>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{movie.year}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{movie.director}</span>
                </div>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <Badge
                  key={genre}
                  variant="secondary"
                  className="px-3 py-1 bg-accent/10 text-accent border-accent/20"
                >
                  <Film className="w-3 h-3 mr-1" />
                  {genre}
                </Badge>
              ))}
            </div>

            {/* Plot */}
            <div className="space-y-2">
              <h3 className="text-lg font-display font-semibold">Plot Summary</h3>
              <p className="text-muted-foreground leading-relaxed">
                {movie.plot_summary}
              </p>
            </div>

            {/* Recommendations */}
            <div className="space-y-3 p-4 bg-primary/5 border border-primary/10 rounded-xl">
              <h3 className="text-sm font-semibold text-primary">Why this recommendation?</h3>
              <ul className="space-y-2">
                {movie.reason_for_recommendation.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-accent mt-1">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <Button
              asChild
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <a href={movie.trailer_url} target="_blank" rel="noopener noreferrer">
                <Play className="w-4 h-4 mr-2 fill-current" />
                Watch Trailer
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
