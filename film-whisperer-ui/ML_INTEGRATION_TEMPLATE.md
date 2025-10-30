# Quick Start: Backend API Integration Template

## For Backend/ML Team: Test Your API Response

The backend is already set up with FastAPI and Neo4j. This guide helps you populate the database and test the API.

---

## API Endpoint

```
GET http://localhost:8000/api/v1/graph
```

---

## Minimum Viable Response (MVP)

This is the **absolute minimum** the API must return:

```json
{
  "nodes": [
    {
      "id": "Movie Title",
      "name": "Movie Title",
      "type": "movie",
      "data": {
        "title": "Movie Title",
        "year": 2020
      }
    },
    {
      "id": "Genre1",
      "name": "Genre1",
      "type": "genre",
      "data": null
    }
  ],
  "links": [
    {
      "source": "Movie Title",
      "target": "Genre1"
    }
  ]
}
```

---

## Enhanced Response (Recommended)

Include movie details in the `data` field:

```json
{
  "nodes": [
    {
      "id": "Movie Title",
      "name": "Movie Title",
      "type": "movie",
      "data": {
        "title": "Movie Title",
        "year": 2020,
        "director": "Director Name",
        "genres": ["Genre1", "Genre2"],
        "plot_summary": "Brief plot description",
        "similarity_score": 0.85,
        "reason_for_recommendation": [
          "Same director: Director Name",
          "Similar genre: Genre1",
          "Common themes: Theme description"
        ],
        "poster_url": "https://image.tmdb.org/t/p/w500/poster.jpg",
        "trailer_url": "https://www.youtube.com/watch?v=VIDEO_ID"
      }
    },
    {
      "id": "Genre1",
      "name": "Genre1",
      "type": "genre",
      "data": null
    },
    {
      "id": "Director Name",
      "name": "Director Name",
      "type": "director",
      "data": null
    }
  ],
  "links": [
    {
      "source": "Movie Title",
      "target": "Genre1"
    },
    {
      "source": "Movie Title",
      "target": "Director Name"
    }
  ]
}
```

---

## Complete Response (Ideal)

With multiple movies and relationships:

```json
{
  "nodes": [
    {
      "id": "Inception",
      "name": "Inception",
      "type": "movie",
      "data": {
        "title": "Inception",
        "year": 2010,
        "director": "Christopher Nolan",
        "genres": ["Sci-Fi", "Thriller"],
        "plot_summary": "A thief who steals corporate secrets...",
        "similarity_score": 0.92,
        "reason_for_recommendation": [
          "Mind-bending sci-fi thriller",
          "Complex narrative structure"
        ],
        "poster_url": "https://image.tmdb.org/t/p/w500/...",
        "trailer_url": "https://www.youtube.com/watch?v=..."
      }
    },
    {
      "id": "Interstellar",
      "name": "Interstellar",
      "type": "movie",
      "data": {
        "title": "Interstellar",
        "year": 2014,
        "director": "Christopher Nolan",
        "genres": ["Sci-Fi", "Drama"],
        "plot_summary": "A team of explorers travel through a wormhole...",
        "similarity_score": 0.88,
        "reason_for_recommendation": [
          "Same director: Christopher Nolan",
          "Epic sci-fi storytelling"
        ]
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
    { "source": "Inception", "target": "Sci-Fi" },
    { "source": "Inception", "target": "Christopher Nolan" },
    { "source": "Interstellar", "target": "Sci-Fi" },
    { "source": "Interstellar", "target": "Christopher Nolan" },
    { "source": "Inception", "target": "Interstellar" }
  ]
}
```

---

## Testing Your API

### 1. Start the Backend

```bash
cd film-whisperer-backend
uvicorn app.main:app --reload --port 8000
```

### 2. Using cURL

```bash
curl http://localhost:8000/api/v1/graph
```

### 3. Using Python

```python
import requests
import json

url = "http://localhost:8000/api/v1/graph"

response = requests.get(url)
print(json.dumps(response.json(), indent=2))
```

### 4. Using JavaScript/Node.js

```javascript
const fetch = require('node-fetch');

const url = 'http://localhost:8000/api/v1/graph';

fetch(url)
  .then(res => res.json())
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(err => console.error('Error:', err));
```

### 5. Using Browser

Simply open: `http://localhost:8000/api/v1/graph`

### 6. Using FastAPI Docs

Open: `http://localhost:8000/docs` and try the API interactively

---

## Field Validation Checklist

Before deploying, validate your API response:

### ✅ Response Structure

```
✓ Must return an object with "nodes" and "links" arrays
✓ Both arrays must be present (can be empty)
```

### ✅ Node Structure

```
Each node must have:
  ✓ id (string, unique across all nodes)
  ✓ name (string, display name)
  ✓ type (string: "movie" | "genre" | "director")
  ✓ data (object or null)
```

### ✅ Movie Node Data (when type === "movie")

```
node.data should contain:
  ✓ title (string, not empty)
  ✓ year (number, 1800-2100) - Optional
  ✓ genres (array of strings) - Optional
  ✓ similarity_score (number, 0.0-1.0) - Optional
  ✓ reason_for_recommendation (array, at least 2 items) - Optional
  ✓ director (string) - Optional
  ✓ plot_summary (string, 100-500 chars) - Optional
  ✓ poster_url (valid URL) - Optional
  ✓ trailer_url (valid YouTube URL) - Optional
```

### ✅ Link Structure

```
Each link must have:
  ✓ source (string, matches a node id)
  ✓ target (string, matches a node id)
```

---

## Common Mistakes to Avoid

### ❌ Don't Do This:

```json
{
  "movies": [...],      // Wrong: Missing nodes/links structure
  "edges": [...]        // Wrong: Should be "links" not "edges"
}
```

### ✅ Do This:

```json
{
  "nodes": [...],       // Correct
  "links": [...]        // Correct
}
```

---

### ❌ Don't Do This:

```json
{
  "nodes": [
    {
      "id": "Movie 1",
      "name": "Movie 1",
      "type": "movie"
      // Missing "data" field for movie node
    }
  ]
}
```

### ✅ Do This:

```json
{
  "nodes": [
    {
      "id": "Movie 1",
      "name": "Movie 1",
      "type": "movie",
      "data": { "title": "Movie 1", "year": 2020 }
    }
  ]
}
```

---

### ❌ Don't Do This:

```json
{
  "links": [
    {
      "from": "Movie 1",    // Wrong: Should be "source"
      "to": "Genre 1"       // Wrong: Should be "target"
    }
  ]
}
```

### ✅ Do This:

```json
{
  "links": [
    {
      "source": "Movie 1",  // Correct
      "target": "Genre 1"   // Correct
    }
  ]
}
```

---

## Sample Neo4j Data Population

Populate your Neo4j database with test data:

### 1. Create Movie Nodes
```cypher
CREATE (m:Movie {
  title: 'Inception',
  year: 2010,
  plot_summary: 'A thief who steals corporate secrets...',
  similarity_score: 0.92
})
```

### 2. Create Genre Nodes
```cypher
CREATE (g:Genre {name: 'Sci-Fi'})
```

### 3. Create Director Nodes
```cypher
CREATE (d:Director {name: 'Christopher Nolan'})
```

### 4. Create Relationships
```cypher
MATCH (m:Movie {title: 'Inception'})
MATCH (g:Genre {name: 'Sci-Fi'})
MATCH (d:Director {name: 'Christopher Nolan'})
CREATE (m)-[:HAS_GENRE]->(g)
CREATE (m)-[:DIRECTED_BY]->(d)
```

### 5. Full Example Script
```cypher
// Create all at once
CREATE (inception:Movie {
  title: 'Inception',
  year: 2010,
  plot_summary: 'A thief who steals corporate secrets through dream-sharing technology.',
  similarity_score: 0.92
})
CREATE (scifi:Genre {name: 'Sci-Fi'})
CREATE (nolan:Director {name: 'Christopher Nolan'})
CREATE (inception)-[:HAS_GENRE]->(scifi)
CREATE (inception)-[:DIRECTED_BY]->(nolan)
```

---

## Response Size Guidelines

### Number of Recommendations:
- **Minimum**: 5 movies
- **Recommended**: 10 movies
- **Maximum**: 20 movies

### Payload Size:
- **Target**: < 1 MB
- **Maximum**: < 5 MB

---

## Error Handling Examples

### Not Found
```json
{
  "status": "error",
  "error_code": "MOVIE_NOT_FOUND",
  "message": "No movies found matching your query"
}
```

### Invalid Input
```json
{
  "status": "error",
  "error_code": "INVALID_QUERY",
  "message": "Query cannot be empty"
}
```

### Server Error
```json
{
  "status": "error",
  "error_code": "INTERNAL_ERROR",
  "message": "An error occurred processing your request"
}
```

---

## Integration Timeline

### Phase 1: Basic Integration (Week 1)
- [ ] Return minimum viable response
- [ ] Test with frontend team
- [ ] Fix any format issues

### Phase 2: Enhanced Data (Week 2)
- [ ] Add director, plot_summary
- [ ] Include TMDB IDs
- [ ] Optimize response time

### Phase 3: Graph Data (Week 3)
- [ ] Generate graph_data structure
- [ ] Test graph visualization
- [ ] Performance optimization

---

## Contact & Support

**Frontend Lead**: [Your Name]  
**Email**: [Your Email]  
**Slack**: #film-whisperer-dev  

**Questions?**
- API format: See `ML_API_SPECIFICATION.md`
- Visual guide: See `ML_VISUAL_GUIDE.md`
- Issues: Create GitHub issue

---

## Quick Validation Script

Use this Python script to validate your response:

```python
def validate_ml_response(response):
    errors = []
    
    # Check status
    if response.get('status') != 'success':
        errors.append("Status must be 'success'")
    
    # Check recommended_movies
    movies = response.get('recommended_movies', [])
    if not movies:
        errors.append("recommended_movies cannot be empty")
    
    for i, movie in enumerate(movies):
        # Required fields
        if not movie.get('title'):
            errors.append(f"Movie {i}: title is required")
        
        if not isinstance(movie.get('year'), int):
            errors.append(f"Movie {i}: year must be integer")
        
        if not isinstance(movie.get('genres'), list) or len(movie.get('genres', [])) == 0:
            errors.append(f"Movie {i}: genres must be non-empty array")
        
        score = movie.get('similarity_score')
        if not isinstance(score, (int, float)) or not (0 <= score <= 1):
            errors.append(f"Movie {i}: similarity_score must be float 0.0-1.0")
        
        reasons = movie.get('reason_for_recommendation', [])
        if not isinstance(reasons, list) or len(reasons) < 2:
            errors.append(f"Movie {i}: need at least 2 recommendation reasons")
    
    if errors:
        print("❌ Validation Failed:")
        for error in errors:
            print(f"  - {error}")
        return False
    else:
        print("✅ Response format is valid!")
        return True

# Test your response
import json
with open('your_response.json', 'r') as f:
    response = json.load(f)
    validate_ml_response(response)
```

---

## Ready to Integrate?

1. ✅ Ensure your API matches the format above
2. ✅ Test with the validation script
3. ✅ Share your API endpoint URL
4. ✅ Provide sample responses for testing
5. ✅ Join the #film-whisperer-dev Slack channel

**Let's build something awesome! 🎬**
