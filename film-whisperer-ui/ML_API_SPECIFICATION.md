# ML API Specification & Integration Guide

## Overview
This document specifies the expected API format from the ML team for the Film Whisperer movie recommendation system.

---

## API Endpoint

### **POST** `/api/recommend`

The frontend will send a user's movie query and expect recommendations in return.

---

## 1. Request Format

### Endpoint URL
```
POST https://your-ml-backend.com/api/recommend
```

### Request Headers
```json
{
  "Content-Type": "application/json"
}
```

### Request Body
```json
{
  "query": "string",           // User's search query (movie title or description)
  "num_recommendations": 10,   // Optional: Number of recommendations to return (default: 10)
  "include_similar": true      // Optional: Include similarity explanations (default: true)
}
```

### Example Request
```json
{
  "query": "Dark psychological thriller like Seven",
  "num_recommendations": 10,
  "include_similar": true
}
```

---

## 2. Response Format

### Response Structure
```json
{
  "status": "success",           // "success" or "error"
  "query": "string",             // Echo back the original query
  "search_movie": {              // Optional: The movie user searched for (if applicable)
    "title": "string",
    "year": 0,
    "tmdb_id": 0                // TMDB ID for fetching additional data
  },
  "recommended_movies": [        // Array of recommended movies
    {
      "title": "string",         // Movie title
      "year": 0,                 // Release year
      "director": "string",      // Director name
      "genres": ["string"],      // Array of genre names
      "plot_summary": "string",  // Brief plot description
      "similarity_score": 0.0,   // Float between 0.0-1.0 (e.g., 0.91)
      "reason_for_recommendation": [  // Array of reason strings
        "string",
        "string",
        "string"
      ],
      "tmdb_id": 0,              // TMDB movie ID (optional, for fetching real-time data)
      "poster_url": "string",    // Optional: Direct poster URL if available
      "trailer_url": "string"    // Optional: YouTube trailer URL
    }
  ],
  "graph_data": {                // Graph structure for visualization
    "nodes": [
      {
        "id": "string",          // Unique identifier (movie title or genre)
        "name": "string",        // Display name
        "type": "string",        // "movie", "genre", "director", "actor", "theme"
        "properties": {}         // Optional: Additional properties
      }
    ],
    "edges": [
      {
        "source": "string",      // Node ID (source)
        "target": "string",      // Node ID (target)
        "weight": 0.0,           // Connection strength (0.0-1.0)
        "relation": "string"     // Relationship type: "has_genre", "directed_by", "similar_to"
      }
    ]
  },
  "metadata": {                  // Optional: Additional metadata
    "processing_time": 0.0,      // Time taken to generate recommendations (seconds)
    "model_version": "string",   // ML model version used
    "total_movies_analyzed": 0   // Number of movies in the database
  }
}
```

---

## 3. Complete Example Response

```json
{
  "status": "success",
  "query": "Dark psychological thriller like Seven",
  "search_movie": {
    "title": "Se7en",
    "year": 1995,
    "tmdb_id": 807
  },
  "recommended_movies": [
    {
      "title": "The Silence of the Lambs",
      "year": 1991,
      "director": "Jonathan Demme",
      "genres": ["Thriller", "Crime", "Drama"],
      "plot_summary": "A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.",
      "similarity_score": 0.88,
      "reason_for_recommendation": [
        "Iconic psychological thriller",
        "Serial killer investigation theme",
        "Mind games and suspense elements"
      ],
      "tmdb_id": 274,
      "poster_url": "https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg",
      "trailer_url": "https://www.youtube.com/watch?v=W6Mm8Sbe__o"
    },
    {
      "title": "Zodiac",
      "year": 2007,
      "director": "David Fincher",
      "genres": ["Mystery", "Thriller", "Crime"],
      "plot_summary": "A San Francisco cartoonist becomes obsessed with tracking down the Zodiac Killer.",
      "similarity_score": 0.85,
      "reason_for_recommendation": [
        "Same director: David Fincher",
        "Real-life serial killer investigation",
        "Atmospheric and methodical pacing"
      ],
      "tmdb_id": 1949,
      "poster_url": "https://image.tmdb.org/t/p/w500/yMF3XMJLq4qkn4fqOzwW2wFDMMG.jpg",
      "trailer_url": "https://www.youtube.com/watch?v=yNncHPl1UXg"
    }
  ],
  "graph_data": {
    "nodes": [
      {
        "id": "movie_274",
        "name": "The Silence of the Lambs",
        "type": "movie",
        "properties": {
          "year": 1991,
          "similarity_score": 0.88
        }
      },
      {
        "id": "movie_1949",
        "name": "Zodiac",
        "type": "movie",
        "properties": {
          "year": 2007,
          "similarity_score": 0.85
        }
      },
      {
        "id": "genre_thriller",
        "name": "Thriller",
        "type": "genre"
      },
      {
        "id": "genre_crime",
        "name": "Crime",
        "type": "genre"
      },
      {
        "id": "director_fincher",
        "name": "David Fincher",
        "type": "director"
      },
      {
        "id": "theme_serial_killer",
        "name": "Serial Killer",
        "type": "theme"
      }
    ],
    "edges": [
      {
        "source": "movie_274",
        "target": "genre_thriller",
        "weight": 1.0,
        "relation": "has_genre"
      },
      {
        "source": "movie_274",
        "target": "genre_crime",
        "weight": 1.0,
        "relation": "has_genre"
      },
      {
        "source": "movie_1949",
        "target": "genre_thriller",
        "weight": 1.0,
        "relation": "has_genre"
      },
      {
        "source": "movie_1949",
        "target": "director_fincher",
        "weight": 1.0,
        "relation": "directed_by"
      },
      {
        "source": "movie_274",
        "target": "theme_serial_killer",
        "weight": 0.9,
        "relation": "has_theme"
      },
      {
        "source": "movie_1949",
        "target": "theme_serial_killer",
        "weight": 0.95,
        "relation": "has_theme"
      },
      {
        "source": "movie_274",
        "target": "movie_1949",
        "weight": 0.82,
        "relation": "similar_to"
      }
    ]
  },
  "metadata": {
    "processing_time": 1.23,
    "model_version": "v2.1.0",
    "total_movies_analyzed": 15000
  }
}
```

---

## 4. Error Response Format

```json
{
  "status": "error",
  "error_code": "string",        // Error code (e.g., "MOVIE_NOT_FOUND", "INVALID_QUERY")
  "message": "string",           // Human-readable error message
  "details": {}                  // Optional: Additional error details
}
```

### Example Error Response
```json
{
  "status": "error",
  "error_code": "MOVIE_NOT_FOUND",
  "message": "No movies found matching your query",
  "details": {
    "query": "Dark psychological thriller like Seven",
    "suggestions": ["Try different keywords", "Check spelling"]
  }
}
```

---

## 5. How We Display the Data

### 5.1 **Graph Visualization**

The `graph_data` is displayed as an **interactive force-directed graph** using `react-force-graph-2d`:

#### Node Types & Colors:
- **Movies** (Red, `hsl(0, 73%, 51%)`) - Larger nodes (8px)
- **Genres** (Orange, `hsl(38, 92%, 50%)`) - Medium nodes (5px)
- **Directors** (Gray, `hsl(0, 0%, 65%)`) - Medium nodes (5px)
- **Themes/Actors** (Blue/Custom) - Can be added as needed

#### Edges/Links:
- Connect movies to genres, directors, themes, and other movies
- Line thickness can represent `weight` (connection strength)
- Different colors for different `relation` types

#### Interactions:
- **Click on movie nodes**: Opens modal with detailed movie information
- **Hover**: Shows node name/label
- **Drag**: Repositions nodes
- **Zoom/Pan**: Navigate the graph

### 5.2 **Movie Modal (Detail View)**

When a movie node is clicked, we show:

```
┌─────────────────────────────────────────────────────────┐
│  [X Close]                                              │
│                                                         │
│  ┌──────────┐     MOVIE TITLE                         │
│  │          │     Tagline (if available)               │
│  │  Poster  │     Year • Director • Runtime • ⭐ Rating│
│  │  Image   │                                          │
│  │          │     [Genre] [Genre] [Genre]             │
│  └──────────┘                                          │
│               Plot Summary                             │
│               Lorem ipsum dolor sit amet...            │
│                                                         │
│               Why this recommendation?                  │
│               • Reason 1 (similarity_score based)      │
│               • Reason 2                                │
│               • Reason 3                                │
│                                                         │
│               [▶ Watch Trailer Button]                 │
└─────────────────────────────────────────────────────────┘
```

**Data Mapping:**
- Title → `recommended_movies[].title`
- Poster → `recommended_movies[].poster_url` or TMDB fetch
- Year → `recommended_movies[].year`
- Director → `recommended_movies[].director`
- Genres → `recommended_movies[].genres[]`
- Plot → `recommended_movies[].plot_summary`
- Rating → `recommended_movies[].similarity_score` (shown as %)
- Reasons → `recommended_movies[].reason_for_recommendation[]`
- Trailer → `recommended_movies[].trailer_url`

### 5.3 **Search Results**

After search, we display:
1. **Hero section** with search query
2. **Graph visualization** with all recommended movies
3. **Similarity scores** shown as percentage (0.88 → 88%)
4. **Toast notifications** for loading states

---

## 6. Data Flow

```
User Input → Frontend Search
     ↓
POST /api/recommend (your ML API)
     ↓
ML Model processes & returns JSON
     ↓
Frontend receives response
     ↓
├─ Extracts recommended_movies[]
├─ Builds graph from graph_data
├─ Renders interactive visualization
└─ On click → Fetch TMDB data (optional enrichment)
     ↓
Display in Modal with full details
```

---

## 7. Important Notes for ML Team

### Must-Have Fields:
✅ `title` - Exact movie title (important for TMDB matching)  
✅ `year` - Release year  
✅ `genres[]` - Array of genres  
✅ `similarity_score` - Float 0.0-1.0  
✅ `reason_for_recommendation[]` - At least 2-3 reasons  

### Optional But Recommended:
🔸 `tmdb_id` - Makes TMDB fetching more accurate  
🔸 `graph_data` - If not provided, we auto-generate from movies/genres/directors  
🔸 `poster_url` - Direct URL saves API calls  
🔸 `director` - Enhances graph connections  

### Performance Requirements:
- Response time: < 3 seconds (ideal)
- Max payload size: < 5MB
- Support for 5-20 recommendations per request

### Similarity Score Guidelines:
- `0.9-1.0` - Extremely similar (same franchise, sequels)
- `0.8-0.9` - Highly similar (same director, themes, style)
- `0.7-0.8` - Similar (same genre, mood)
- `0.6-0.7` - Moderately similar
- `< 0.6` - Loosely related (probably don't include)

### Reason for Recommendation - Examples:
- "Same director: [Name]"
- "Similar genre: [Genre]"
- "Common themes: [Theme]"
- "Plot similarity: [Brief description]"
- "Same lead actor: [Name]"
- "Similar pacing and atmosphere"
- "Released in same era"

---

## 8. Testing the Integration

### Test Endpoint
Once your API is ready, we'll test with:

```bash
curl -X POST https://your-api.com/api/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Dark psychological thriller",
    "num_recommendations": 5
  }'
```

### Sample Test Cases:
1. **Specific movie**: "Movies like Inception"
2. **Genre-based**: "Romantic comedies"
3. **Description**: "Dark psychological thrillers with twist endings"
4. **Director**: "Christopher Nolan movies"
5. **Actor**: "Movies with Tom Hanks"

---

## 9. Frontend Integration Points

### Files to Update (Once ML API is Ready):
1. **`src/pages/Index.tsx`** - Update `handleSearch()` function:
```typescript
const handleSearch = async (query: string) => {
  setLoading(true);
  try {
    const response = await fetch('YOUR_ML_API_URL/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, num_recommendations: 10 })
    });
    const data = await response.json();
    
    if (data.status === 'success') {
      setMovies(data.recommended_movies);
      setHasSearched(true);
    }
  } catch (error) {
    console.error('Search failed:', error);
  } finally {
    setLoading(false);
  }
};
```

2. **Create `src/services/mlApi.ts`** - Centralized API service
3. **Update `src/components/GraphSection.tsx`** - Use ML graph_data if provided

---

## 10. Fallback & Error Handling

### Scenarios We Handle:
- ❌ ML API is down → Show cached/dummy data
- ❌ No results found → Show popular movies
- ❌ Slow response → Show loading skeleton
- ❌ Invalid data format → Use fallback structure
- ❌ TMDB fetch fails → Use ML-provided data

---

## Questions for ML Team?

Contact: [Your Name/Team]  
Email: [Your Email]  
Slack: [Channel]  

**Timeline**: Please have API ready by [DATE]  
**Documentation**: Please provide Swagger/OpenAPI spec  
**Testing**: We need access to staging environment

---

## Appendix: Graph Data Auto-Generation

If ML team doesn't provide `graph_data`, we auto-generate it from:
- Movies → Create movie nodes
- Genres → Extract unique genres, create nodes
- Directors → Extract unique directors, create nodes
- Links → Connect movies to their genres and directors

This is already implemented in `GraphSection.tsx` but a pre-computed graph from ML is preferred for better relationship representation.
