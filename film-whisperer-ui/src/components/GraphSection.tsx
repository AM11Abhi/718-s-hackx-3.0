import { MousePointer2, Sparkles, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { getMovieByTitle, convertTMDBToAppMovie } from "@/services/tmdb";
import { useToast } from "@/hooks/use-toast";
import MovieModal from "./MovieModal";
import { sampleMLData } from "@/data/sampleMLData";

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

const ForceGraph2DAny = ForceGraph2D as any;

const GraphSection = () => {
  const graphRef = useRef<any>();
  const [loadingMovie, setLoadingMovie] = useState<string | null>(null);
  const { toast } = useToast();

  // Modal state
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use the sample ML data (safe guard if empty)
  const mlData = sampleMLData ?? { results: [], total_results: 0 };

  // Convert ML results into app Movie objects (minimal fields)
  const movies: Movie[] = mlData.results.map((m: any) => ({
    title: m.title || "Unknown Title",
    year: m.year || 0,
    director: m.director || "Unknown Director",
    genres: m.genre ? [m.genre] : [],
    plot_summary: "",
    poster_url: "",
    trailer_url: "",
    similarity_score: 1,
    reason_for_recommendation: [`Based on cast match`],
  }));

  // Handle node click: fetch TMDB details if possible, then open modal
  const handleMovieNodeClick = async (node: any) => {
    if (node.type !== "movie" || !node.data) return;

    setLoadingMovie(node.data.title);
    try {
      const tmdbMovie = await getMovieByTitle(node.data.title);
      if (tmdbMovie) {
        const enrichedMovie = convertTMDBToAppMovie(tmdbMovie, node.data.similarity_score);
        setSelectedMovie(enrichedMovie);
        setIsModalOpen(true);
        toast({
          title: "Movie loaded",
          description: `Fetched details for "${node.data.title}" from TMDB`,
        });
      } else {
        // fallback to the basic ML-provided movie object
        setSelectedMovie(node.data);
        setIsModalOpen(true);
        toast({
          title: "Using cached data",
          description: `Could not fetch fresh data for "${node.data.title}"`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching movie from TMDB:", error);
      setSelectedMovie(node.data);
      setIsModalOpen(true);
      toast({
        title: "Error loading movie",
        description: "Using cached movie data",
        variant: "destructive",
      });
    } finally {
      setLoadingMovie(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  // Prepare graph data (uses ML data for actors/genres/directors)
  const graphData = {
    nodes: [
      // Movie nodes
      ...movies.map((movie) => ({
        id: movie.title,
        name: movie.title,
        type: "movie",
        data: movie,
      })),
      // Cast nodes
      ...Array.from(
        new Set(
          mlData.results.flatMap((m: any) =>
            m.cast ? m.cast.split(",").map((actor: string) => actor.trim()) : []
          )
        )
      ).map((actor: any) => ({
        id: actor,
        name: actor,
        type: "actor",
      })),
      // Genre nodes
      ...Array.from(new Set(mlData.results.map((m: any) => m.genre))).map((genre: any) => ({
        id: genre,
        name: genre,
        type: "genre",
      })),
      // Director nodes
      ...Array.from(new Set(mlData.results.map((m: any) => m.director))).map((director: any) => ({
        id: director,
        name: director,
        type: "director",
      })),
    ],
    links: [
      // Movie to Cast links
      ...mlData.results.flatMap((movie: any) =>
        (movie.cast ? movie.cast.split(",") : []).map((actor: string) => ({
          source: movie.title,
          target: actor.trim(),
          type: "acted_in",
        }))
      ),
      // Movie to Genre links
      ...mlData.results.map((movie: any) => ({
        source: movie.title,
        target: movie.genre,
        type: "has_genre",
      })),
      // Movie to Director links
      ...mlData.results.map((movie: any) => ({
        source: movie.title,
        target: movie.director,
        type: "directed_by",
      })),
    ],
  };

  useEffect(() => {
    console.log("Graph data:", graphData);
  }, []);

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
      case "actor":
        return "hsl(217, 91%, 60%)"; // blue
      case "genre":
        return "hsl(38, 92%, 50%)"; // accent
      case "director":
        return "hsl(0, 0%, 65%)"; // muted
      default:
        return "hsl(0, 0%, 50%)";
    }
  };

  const getNodeSize = (node: any) => {
    switch (node.type) {
      case "movie":
        return 8;
      case "actor":
        return 6;
      case "genre":
      case "director":
        return 5;
      default:
        return 4;
    }
  };

  return (
    <section className="min-h-screen py-20 px-6 animate-slide-up">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground">
              Found {mlData.total_results} Movies
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold">
            Explore Movie Connections
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Click on any movie node to view detailed information
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
          <div className="w-full h-[600px] bg-black">
            <ForceGraph2DAny
              ref={graphRef}
              graphData={graphData}
              nodeColor={getNodeColor}
              nodeVal={getNodeSize}
              // let the canvas fill the parent container (cast used to avoid TS prop error)
              style={{ width: "100%", height: "100%" }}
              // make the canvas transparent so the container bg-black fills the whole area
              backgroundColor="transparent"
              nodeLabel={(node: any) => node.name}
              nodeCanvasObject={(node: any, ctx, globalScale) => {
                // Draw node circle
                ctx.beginPath();
                ctx.arc(node.x, node.y, getNodeSize(node), 0, 2 * Math.PI);
                ctx.fillStyle = getNodeColor(node);
                ctx.fill();

                // Draw label
                const label = node.name;
                const fontSize = 12 / globalScale;
                ctx.font = `${fontSize}px Inter`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "#ffffff";
                ctx.fillText(label, node.x, node.y + 15);
              }}
              onNodeClick={handleMovieNodeClick}
              linkColor={() => "rgba(255, 255, 255, 0.2)"}
              linkWidth={2}
              cooldownTicks={100}
            />
          </div>

          {/* Legend */}
          <div className="absolute bottom-6 right-6 bg-background/90 backdrop-blur-md border border-border rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-sm">Movies</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[hsl(217,91%,60%)]" />
              <span className="text-sm">Actors</span>
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

      {/* Movie Modal */}
      {isModalOpen && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleModalClose} />
      )}
    </section>
  );
};

export default GraphSection;