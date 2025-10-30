# Visual Guide: ML API → Frontend Display

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER INTERACTION                            │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  User loads/searches   │
                    │    for movies          │
                    └────────────┬───────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                             │
│                                                                      │
│  1. Show loading state                                              │
│  2. GET http://localhost:8000/api/v1/graph                          │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND API (FastAPI)                             │
│                                                                      │
│  GET /api/v1/graph                                                  │
│                                                                      │
│  ▼ Query Neo4j database                                             │
│                                                                      │
│  Response:                                                           │
│  {                                                                   │
│    "nodes": [                    ◄─── All nodes                    │
│      {                                                              │
│        "id": "Inception",                                           │
│        "name": "Inception",                                         │
│        "type": "movie",                                             │
│        "data": { movie details }                                    │
│      },                                                             │
│      ...genres, directors                                           │
│    ],                                                               │
│    "links": [                    ◄─── All relationships            │
│      {                                                              │
│        "source": "Inception",                                       │
│        "target": "Sci-Fi"                                           │
│      },                                                             │
│      ...                                                            │
│    ]                                                                │
│  }                                                                   │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    FRONTEND DATA PROCESSING                          │
│                                                                      │
│  1. Receive nodes and links                                         │
│  2. Pass directly to graph visualization                            │
│  3. Extract movie nodes (type === "movie")                          │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       DISPLAY: GRAPH VIEW                            │
│                                                                      │
│           🔴 Movie Nodes (clickable) - type: "movie"                │
│           🟠 Genre Nodes - type: "genre"                            │
│           ⚪ Director Nodes - type: "director"                      │
│                                                                      │
│           Lines connect based on links array                         │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                      User clicks movie node
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    OPTIONAL: TMDB ENRICHMENT                         │
│                                                                      │
│  Extract node.data (movie details)                                  │
│  Search TMDB by title                                               │
│                                                                      │
│  Get: poster, backdrop, trailer, rating, runtime                    │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       DISPLAY: MODAL VIEW                            │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  ┌────────┐                                                  │  │
│  │  │ Poster │  THE SILENCE OF THE LAMBS                       │  │
│  │  │ Image  │  "A census taker once tried to test me..."      │  │
│  │  │        │                                                  │  │
│  │  └────────┘  📅 1991  👤 Jonathan Demme  🎬 118min  ⭐8.6  │  │
│  │                                                              │  │
│  │  [Thriller] [Crime] [Drama]                                 │  │
│  │                                                              │  │
│  │  Plot: A young FBI cadet must receive the help...           │  │
│  │                                                              │  │
│  │  Why this recommendation?                                    │  │
│  │  • Iconic psychological thriller                            │  │
│  │  • Serial killer investigation                              │  │
│  │  • Mind games and suspense                                  │  │
│  │                                                              │  │
│  │  Match Score: 88% ⭐⭐⭐⭐⭐                                 │  │
│  │                                                              │  │
│  │  [▶️ Watch Trailer]                                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Graph Node Types & Visual Representation

### Movie Nodes
```
     🔴
   ┌─────┐
   │     │  Size: 8px (larger)
   │Movie│  Color: Red (hsl(0, 73%, 51%))
   │     │  Clickable: YES
   └─────┘  Data: Full movie object
```

### Genre Nodes
```
     🟠
   ┌─────┐
   │Genre│  Size: 5px (smaller)
   └─────┘  Color: Orange (hsl(38, 92%, 50%))
            Clickable: No (for now)
```

### Director Nodes
```
     ⚪
   ┌────────┐
   │Director│  Size: 5px (smaller)
   └────────┘  Color: Gray (hsl(0, 0%, 65%))
               Clickable: No (for now)
```

### Theme/Actor Nodes (Future)
```
     🔵
   ┌─────┐
   │Theme│  Size: 5px (smaller)
   └─────┘  Color: Blue (custom)
            Example: "Serial Killer", "Space Opera"
```

---

## 🔗 Graph Edge Types

### has_genre
```
Movie ──────────> Genre
      (solid line)
```

### directed_by
```
Movie ──────────> Director
      (solid line)
```

### similar_to
```
Movie ←─────────→ Movie
      (dashed line, weight affects thickness)
```

### has_theme
```
Movie ──────────> Theme
      (dotted line)
```

---

## 📝 Example: From Backend Data to Display

### Input (Backend API Response):
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
        "similarity_score": 0.88,
        "reason_for_recommendation": [
          "Iconic psychological thriller",
          "Serial killer investigation"
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
      "id": "Jonathan Demme",
      "name": "Jonathan Demme",
      "type": "director",
      "data": null
    }
  ],
  "links": [
    { "source": "The Silence of the Lambs", "target": "Thriller" },
    { "source": "The Silence of the Lambs", "target": "Crime" },
    { "source": "The Silence of the Lambs", "target": "Jonathan Demme" }
  ]
}
```

### Processing (Frontend Logic):
```javascript
// Receive nodes and links directly from backend
const graphData = await fetch('http://localhost:8000/api/v1/graph').then(r => r.json());

// Extract movie nodes for list view (if needed)
const movieNodes = graphData.nodes.filter(n => n.type === 'movie');
const movies = movieNodes.map(n => n.data);

// Pass graphData directly to ForceGraph2D component
<ForceGraph2D graphData={graphData} ... />
```

### Output (Visual Graph):
```
                Thriller
                   |
                   |
    Jonathan Demme ─── The Silence of the Lambs ─── Crime
                              
```

**Note**: The backend pre-computes the graph structure, so frontend just renders it directly!

---

## 📊 Similarity Score Display

The `similarity_score` (0.0-1.0) is displayed in multiple ways:

### 1. As Percentage
```
0.88 → 88%
```

### 2. As Star Rating
```
0.88 → ⭐⭐⭐⭐⭐ (4.4 out of 5 stars)
```

### 3. As Progress Bar
```
[████████░░] 88%
```

### 4. In Modal
```
┌─────────────────────────┐
│ Match Score             │
│ ⭐⭐⭐⭐⭐  88%         │
└─────────────────────────┘
```

---

## 🎯 Recommendation Reasons Display

ML provides array of strings in `reason_for_recommendation[]`

### Format:
```
Why this recommendation?
• Iconic psychological thriller
• Serial killer investigation theme
• Mind games and suspense elements
```

### Best Practices for ML Team:
✅ Keep each reason under 60 characters  
✅ Provide 2-5 reasons per movie  
✅ Mix different types:
  - Genre similarity
  - Director/Actor connections
  - Theme/Plot elements
  - Rating/Popularity
  - Era/Style

---

## 🖼️ Image Handling

### Priority Order:
1. **ML provides `poster_url`** → Use directly (fastest)
2. **ML provides `tmdb_id`** → Fetch from TMDB by ID (accurate)
3. **ML provides `title`** → Search TMDB by title (fallback)
4. **Nothing provided** → Use placeholder image

### Image URLs Format:
```
poster_url: "https://image.tmdb.org/t/p/w500/[path].jpg"
backdrop_url: "https://image.tmdb.org/t/p/w1280/[path].jpg"
```

---

## ⚡ Performance Considerations

### Response Time:
- **< 1 second**: Excellent ⚡
- **1-3 seconds**: Good ✅
- **3-5 seconds**: Acceptable ⚠️
- **> 5 seconds**: Too slow ❌ (add caching)

### Data Size:
- **Recommended**: 10 movies per response
- **Max payload**: < 5MB
- **Min data**: title, year, genres, similarity_score

### Caching Strategy:
- Popular queries can be pre-computed
- Similar searches can reuse results
- TMDB data cached for 24 hours

---

## 🔄 Integration Checklist

### ML Team Provides:
- [ ] API endpoint URL
- [ ] Authentication method (if needed)
- [ ] Response format matches spec
- [ ] Test data / staging environment
- [ ] Error codes documentation
- [ ] Rate limits information
- [ ] SLA / uptime expectations

### Frontend Team Implements:
- [ ] API service integration
- [ ] Loading states
- [ ] Error handling
- [ ] Data transformation
- [ ] Graph rendering
- [ ] Modal displays
- [ ] TMDB enrichment
- [ ] Analytics tracking

---

## 📞 Communication Flow

```
Backend Team               Frontend Team
   │                            │
   │  1. Backend setup done ────►
   │  (FastAPI + Neo4j)         │
   │                            │
   │  2. Populate Neo4j DB      │
   │     with movie data        │
   │                            │
   │  3. Test /api/v1/graph ────►
   │                            │
   │ ◄──── 4. Frontend connects │
   │ ◄──── 5. Test integration  │
   │                            │
   │  6. Add more movies/data   │
   │                            │
   │ ◄──── 7. Confirm working   │
   │                            │
   │  8. Deploy both services   │
   │                            │
```

---

## 🚀 Go Live Steps

1. **Development**: Use dummy data (currently implemented)
2. **Integration**: Connect to ML staging API
3. **Testing**: Verify all features work
4. **Staging**: Deploy to staging environment
5. **Production**: Switch to production ML API
6. **Monitoring**: Track errors and performance

---

For questions, refer to `ML_API_SPECIFICATION.md` for detailed technical specs.
