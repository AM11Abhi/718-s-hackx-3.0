import { MousePointer2, Sparkles, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { getMovieByTitle, convertTMDBToAppMovie } from "@/services/tmdb";
import { useToast } from "@/hooks/use-toast";

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
  runtime?: number;
  rating?: number;
  tagline?: string;
  backdrop_url?: string;
}

interface GraphSectionProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

const GraphSection = ({ movies, onMovieClick }: GraphSectionProps) => {
  const graphRef = useRef<any>();
  const [loadingMovie, setLoadingMovie] = useState<string | null>(null);
  const { toast } = useToast();

  // Handle movie node click with TMDB API fetch
  const handleMovieNodeClick = async (node: any) => {
    if (node.type !== "movie" || !node.data) return;
    
    setLoadingMovie(node.data.title);
    
    try {
      // Fetch movie details from TMDB API
      const tmdbMovie = await getMovieByTitle(node.data.title);
      
      if (tmdbMovie) {
        // Convert TMDB data to app format
        const enrichedMovie = convertTMDBToAppMovie(tmdbMovie, node.data.similarity_score);
        onMovieClick(enrichedMovie);
        
        toast({
          title: "Movie loaded",
          description: `Fetched details for "${node.data.title}" from TMDB`,
        });
      } else {
        // Fallback to original data if TMDB fetch fails
        onMovieClick(node.data);
        
        toast({
          title: "Using cached data",
          description: `Could not fetch fresh data for "${node.data.title}"`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching movie from TMDB:", error);
      // Fallback to original data
      onMovieClick(node.data);
      
      toast({
        title: "Error loading movie",
        description: "Using cached movie data",
        variant: "destructive",
      });
    } finally {
      setLoadingMovie(null);
    }
  };

  // Prepare graph data
  const graphData = {
    nodes: [
      ...movies.map((movie) => ({
        id: movie.title,
        name: movie.title,
        type: "movie",
        data: movie,
      })),
      // Add genre nodes
      ...Array.from(new Set(movies.flatMap((m) => m.genres))).map((genre) => ({
        id: genre,
        name: genre,
        type: "genre",
      })),
      // Add director nodes
      ...Array.from(new Set(movies.map((m) => m.director))).map((director) => ({
        id: director,
        name: director,
        type: "director",
      })),
    ],
    links: [
      // Connect movies to genres
      ...movies.flatMap((movie) =>
        movie.genres.map((genre) => ({
          source: movie.title,
          target: genre,
        }))
      ),
      // Connect movies to directors
      ...movies.map((movie) => ({
        source: movie.title,
        target: movie.director,
      })),
    ],
  };

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force("charge").strength(-300);
      graphRef.current.d3Force("link").distance(100);
    }
  }, []);

  const getNodeColor = (node: any) => {
    switch (node.type) {
      case "movie":
        return "hsl(0, 73%, 51%)"; // primary
      case "genre":
        return "hsl(38, 92%, 50%)"; // accent
      case "director":
        return "hsl(0, 0%, 65%)"; // muted
      default:
        return "hsl(0, 0%, 50%)";
    }
  };

  const getNodeSize = (node: any) => {
    return node.type === "movie" ? 8 : 5;
  };

  return (
    <section className="min-h-screen py-20 px-6 animate-slide-up">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground">Interactive Knowledge Graph</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold">
            Explore Movie Connections
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Click on any movie node to view detailed information and discover similar films
          </p>
        </div>

        {/* Graph Container */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-border bg-card/50 backdrop-blur-sm">
          {/* Interactive Hint / Loading Indicator */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-4 py-2 bg-background/90 backdrop-blur-md border border-border rounded-full shadow-lg">
            {loadingMovie ? (
              <>
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-sm font-medium">Loading {loadingMovie}...</span>
              </>
            ) : (
              <>
                <MousePointer2 className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-medium">Click nodes to explore</span>
              </>
            )}
          </div>

          {/* Graph */}
          <div className="w-full h-[600px]">
            <ForceGraph2D
              ref={graphRef}
              graphData={graphData}
              nodeColor={getNodeColor}
              nodeVal={getNodeSize}
              nodeLabel={(node: any) => node.name}
              nodeCanvasObject={(node: any, ctx, globalScale) => {
                const label = node.name;
                const fontSize = 12 / globalScale;
                ctx.font = `${fontSize}px Inter`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = node.type === "movie" ? "#f5f5f5" : "#999";
                ctx.fillText(label, node.x, node.y + 15);
              }}
              onNodeClick={handleMovieNodeClick}
              linkColor={() => "rgba(255, 255, 255, 0.1)"}
              linkWidth={1}
              backgroundColor="rgba(0, 0, 0, 0)"
              nodeCanvasObjectMode={() => "after"}
            />
          </div>

          {/* Legend */}
          <div className="absolute bottom-6 right-6 bg-background/90 backdrop-blur-md border border-border rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-sm">Movies</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-sm">Genres</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-muted-foreground" />
              <span className="text-sm">Directors</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GraphSection;
