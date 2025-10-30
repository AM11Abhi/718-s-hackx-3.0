# ML API Specification & Integration Guide

## Overview
This document specifies the API format for the Film Whisperer movie recommendation system. The backend is built with **FastAPI** and uses **Neo4j** graph database for storing and querying movie relationships.

---

## API Base URL

```
http://localhost:8000/api/v1
```

---

## API Endpoints

### **GET** `/api/v1/graph`

Returns the complete knowledge graph with movie nodes and their relationships (genres, directors, etc.).

---

## 1. Request Format

### Endpoint URL
```
GET http://localhost:8000/api/v1/graph
```

### Request Headers
```json
{
  "Accept": "application/json"
}
```

### Request Parameters
**None** - This is a simple GET request that returns the full graph.

### Example Request (cURL)
```bash
curl http://localhost:8000/api/v1/graph
```

### Example Request (JavaScript)
```javascript
fetch('http://localhost:8000/api/v1/graph')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 2. Response Format

### Response Structure
The backend returns a **GraphResponse** object with nodes and links:

```json
{
  "nodes": [                     // Array of node objects
    {
      "id": "string",            // Unique identifier (e.g., "Inception", "Sci-Fi", "Christopher Nolan")
      "name": "string",          // Display name (same as id)
      "type": "string",          // Node type: "movie", "genre", "director"
      "data": {                  // Optional: Additional data for the node
        "title": "string",       // For movie nodes
        "year": 0,               // For movie nodes
        "director": "string",    // For movie nodes
        "genres": ["string"],    // For movie nodes
        "plot_summary": "string",// For movie nodes
        "poster_url": "string",  // For movie nodes
        "trailer_url": "string", // For movie nodes
        "similarity_score": 0.0, // For movie nodes (0.0-1.0)
        "reason_for_recommendation": ["string"] // For movie nodes
      }
    }
  ],
  "links": [                     // Array of link objects (relationships)
    {
      "source": "string",        // Node ID (source)
      "target": "string"         // Node ID (target)
    }
  ]
}
```

### Key Differences from Traditional APIs:
- ✅ **No separate movie list** - Movies are embedded in the graph as nodes
- ✅ **Simple structure** - Just nodes and links (edges)
- ✅ **Graph-first design** - Relationships are first-class citizens
- ✅ **Flexible data** - Movie details stored in node's `data` field

---

## 3. Complete Example Response

### Simple Example (Currently Implemented)
```json
{
  "nodes": [
    {
      "id": "Inception",
      "name": "Inception",
      "type": "movie",
      "data": {
        "title": "Inception",
        "year": 2010
      }
    },
    {
      "id": "Sci-Fi",
      "name": "Sci-Fi",
      "type": "genre",
      "data": null
    },
    {
      "id": "Christopher Nolan",
      "name": "Christopher Nolan",
      "type": "director",
      "data": null
    }
  ],
  "links": [
    {
      "source": "Inception",
      "target": "Sci-Fi"
    },
    {
      "source": "Inception",
      "target": "Christopher Nolan"
    }
  ]
}
```

### Full Example (With Complete Movie Data)
```json
{
  "nodes": [
    {
      "id": "The Silence of the Lambs",
      "name": "The Silence of the Lambs",
      "type": "movie",
      "data": {
        "title": "The Silence of the Lambs",
        "year": 1991,
        "director": "Jonathan Demme",
        "genres": ["Thriller", "Crime", "Drama"],
        "plot_summary": "A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.",
        "poster_url": "https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg",
        "trailer_url": "https://www.youtube.com/watch?v=W6Mm8Sbe__o",
        "similarity_score": 0.88,
        "reason_for_recommendation": [
          "Iconic psychological thriller",
          "Serial killer investigation theme",
          "Mind games and suspense elements"
        ]
      }
    },
    {
      "id": "Zodiac",
      "name": "Zodiac",
      "type": "movie",
      "data": {
        "title": "Zodiac",
        "year": 2007,
        "director": "David Fincher",
        "genres": ["Mystery", "Thriller", "Crime"],
        "plot_summary": "A San Francisco cartoonist becomes obsessed with tracking down the Zodiac Killer.",
        "poster_url": "https://image.tmdb.org/t/p/w500/yMF3XMJLq4qkn4fqOzwW2wFDMMG.jpg",
        "trailer_url": "https://www.youtube.com/watch?v=yNncHPl1UXg",
        "similarity_score": 0.85,
        "reason_for_recommendation": [
          "Same director: David Fincher",
          "Real-life serial killer investigation",
          "Atmospheric and methodical pacing"
        ]
      }
    },
    {
      "id": "Thriller",
      "name": "Thriller",
      "type": "genre",
      "data": null
    },
    {
      "id": "Crime",
      "name": "Crime",
      "type": "genre",
      "data": null
    },
    {
      "id": "David Fincher",
      "name": "David Fincher",
      "type": "director",
      "data": null
    },
    {
      "id": "Jonathan Demme",
      "name": "Jonathan Demme",
      "type": "director",
      "data": null
    }
  ],
  "links": [
    {
      "source": "The Silence of the Lambs",
      "target": "Thriller"
    },
    {
      "source": "The Silence of the Lambs",
      "target": "Crime"
    },
    {
      "source": "The Silence of the Lambs",
      "target": "Jonathan Demme"
    },
    {
      "source": "Zodiac",
      "target": "Thriller"
    },
    {
      "source": "Zodiac",
      "target": "Crime"
    },
    {
      "source": "Zodiac",
      "target": "David Fincher"
    },
    {
      "source": "The Silence of the Lambs",
      "target": "Zodiac"
    }
  ]
}
```

---

## 4. Error Response Format

FastAPI returns standard HTTP error responses:

### 404 Not Found
```json
{
  "detail": "Not Found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal Server Error"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "field_name"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

---

## 5. How We Display the Data

### 5.1 **Graph Visualization**

The response's `nodes` and `links` arrays are displayed directly as an **interactive force-directed graph** using `react-force-graph-2d`:

#### Node Types & Colors:
- **Movies** (Red, `hsl(0, 73%, 51%)`) - Larger nodes (8px) - `type: "movie"`
- **Genres** (Orange, `hsl(38, 92%, 50%)`) - Medium nodes (5px) - `type: "genre"`
- **Directors** (Gray, `hsl(0, 0%, 65%)`) - Medium nodes (5px) - `type: "director"`

#### Links:
- Simple connections between nodes
- All links are displayed with the same style (can be customized later)
- Connect movies to their genres and directors

#### Interactions:
- **Click on movie nodes**: Opens modal with movie details from `node.data`
- **Hover**: Shows node name
- **Drag**: Repositions nodes
- **Zoom/Pan**: Navigate the graph

### 5.2 **Movie Modal (Detail View)**

When a movie node (where `type === "movie"`) is clicked:

```
┌─────────────────────────────────────────────────────────┐
│  [X Close]                                              │
│                                                         │
│  ┌──────────┐     MOVIE TITLE                         │
│  │          │     Tagline (if from TMDB)               │
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

**Data Mapping from Node:**
- Title → `node.data.title`
- Poster → `node.data.poster_url` or fetch from TMDB
- Year → `node.data.year`
- Director → `node.data.director`
- Genres → `node.data.genres[]`
- Plot → `node.data.plot_summary`
- Rating → `node.data.similarity_score` (shown as %)
- Reasons → `node.data.reason_for_recommendation[]`
- Trailer → `node.data.trailer_url`

### 5.3 **Data Flow**

1. Frontend calls `GET /api/v1/graph`
2. Backend returns `{ nodes: [...], links: [...] }`
3. Frontend extracts movie nodes (where `type === "movie"`)
4. Graph is rendered with all nodes and links
5. User clicks movie node → Modal shows `node.data` details
6. Optional: Frontend fetches additional data from TMDB API

---

## 6. Data Flow

```
Frontend Loads/Searches
     ↓
GET /api/v1/graph
     ↓
Backend queries Neo4j database
     ↓
Returns { nodes: [...], links: [...] }
     ↓
Frontend receives graph
     ↓
├─ Renders nodes as graph visualization
├─ Displays links as connections
└─ User clicks movie node
     ↓
Extract node.data for movie details
     ↓
Optional: Fetch additional data from TMDB
     ↓
Display in Modal with full details
```

---

## 7. Important Notes for Backend/ML Team

### Backend Stack:
✅ **FastAPI** - Python web framework  
✅ **Neo4j** - Graph database for storing movie relationships  
✅ **Pydantic** - Data validation using models  
✅ **CORS enabled** - Frontend can access from localhost:8080  

### Must-Have Fields in Node Data (for movie nodes):
✅ `title` - Exact movie title (important for TMDB matching)  
✅ `year` - Release year (integer)  
✅ `genres` - Array of genre strings  
✅ `similarity_score` - Float 0.0-1.0  
✅ `reason_for_recommendation` - Array of reason strings (at least 2-3)  

### Optional But Recommended Fields:
🔸 `director` - Director name (string)  
🔸 `plot_summary` - Brief plot description  
🔸 `poster_url` - Direct URL saves API calls  
🔸 `trailer_url` - YouTube URL  

### Node Types:
- `"movie"` - Movie nodes (must have `data` field with movie details)
- `"genre"` - Genre nodes (can have `data: null`)
- `"director"` - Director nodes (can have `data: null`)

### Performance Requirements:
- Response time: < 2 seconds (ideal)
- Max payload size: < 5MB
- Graph should contain 10-50 nodes for best visualization

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
Test the backend with:

```bash
curl http://localhost:8000/api/v1/graph
```

### Test with Python
```python
import requests

response = requests.get('http://localhost:8000/api/v1/graph')
print(response.json())
```

### Test with JavaScript
```javascript
fetch('http://localhost:8000/api/v1/graph')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

### Sample Test Cases for Neo4j Queries:
1. **Get all movies** with their genres and directors
2. **Find similar movies** based on shared genres/directors
3. **Get movies by specific genre** (e.g., "Thriller")
4. **Get movies by specific director** (e.g., "Christopher Nolan")
5. **Find shortest path** between two movies

---

## 9. Frontend Integration Points

### Files to Update:

1. **`src/pages/Index.tsx`** - Update to fetch from backend:
```typescript
const handleSearch = async (query: string) => {
  setLoading(true);
  try {
    const response = await fetch('http://localhost:8000/api/v1/graph');
    const graphData = await response.json();
    
    // Extract movie nodes from graph
    const movieNodes = graphData.nodes.filter(node => node.type === 'movie');
    const movies = movieNodes.map(node => node.data);
    
    setMovies(movies);
    setGraphData(graphData); // Store full graph for visualization
    setHasSearched(true);
  } catch (error) {
    console.error('Failed to fetch graph:', error);
  } finally {
    setLoading(false);
  }
};
```

2. **`src/components/GraphSection.tsx`** - Already compatible!
   - Currently auto-generates graph from movies array
   - Can be updated to use `graphData` prop directly

3. **Create `src/services/backendApi.ts`** - Centralized API service:
```typescript
const API_BASE_URL = 'http://localhost:8000/api/v1';

export async function fetchGraph() {
  const response = await fetch(`${API_BASE_URL}/graph`);
  if (!response.ok) {
    throw new Error('Failed to fetch graph');
  }
  return response.json();
}
```

---

## 10. Fallback & Error Handling

### Scenarios We Handle:
- ❌ Backend API is down → Show cached/dummy data
- ❌ Neo4j connection fails → Show error message
- ❌ Slow response → Show loading skeleton
- ❌ Invalid data format → Use fallback structure
- ❌ TMDB fetch fails → Use backend-provided data

---

## 11. Backend Setup Instructions

### Prerequisites:
1. Python 3.8+
2. Neo4j database (local or cloud)

### Installation:
```bash
cd film-whisperer-backend
pip install -r requirements.txt
```

### Configuration:
Create `.env` file:
```bash
FRONTEND_URL=http://localhost:8080
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password
```

### Run Backend:
```bash
uvicorn app.main:app --reload --port 8000
```

### Access API Docs:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## Questions for Backend/ML Team?

Contact: [Your Name/Team]  
Email: [Your Email]  
Slack: [Channel]  

**Timeline**: Backend is already set up! Focus on populating Neo4j with movie data  
**Documentation**: FastAPI auto-generates docs at /docs  
**Testing**: Use http://localhost:8000/api/v1/graph

---

## Appendix: Neo4j Data Model

### Recommended Neo4j Schema:

**Nodes:**
- `(:Movie {title, year, director, plot_summary, poster_url, trailer_url, similarity_score})`
- `(:Genre {name})`
- `(:Director {name})`

**Relationships:**
- `(:Movie)-[:HAS_GENRE]->(:Genre)`
- `(:Movie)-[:DIRECTED_BY]->(:Director)`
- `(:Movie)-[:SIMILAR_TO {score}]->(:Movie)`

### Sample Cypher Query:
```cypher
// Get all movies with their relationships
MATCH (m:Movie)-[r]-(n)
RETURN m, r, n
LIMIT 50
```
