# Quick Start: ML API Integration Template

## For ML Team: Test Your API Response

Use this template to ensure your API response matches our requirements.

---

## Minimum Viable Response (MVP)

This is the **absolute minimum** your API must return:

```json
{
  "status": "success",
  "recommended_movies": [
    {
      "title": "Movie Title",
      "year": 2020,
      "genres": ["Genre1", "Genre2"],
      "similarity_score": 0.85,
      "reason_for_recommendation": [
        "Reason 1",
        "Reason 2"
      ]
    }
  ]
}
```

---

## Enhanced Response (Recommended)

Include these fields for better user experience:

```json
{
  "status": "success",
  "query": "User's original query",
  "recommended_movies": [
    {
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
      "tmdb_id": 12345,
      "poster_url": "https://image.tmdb.org/t/p/w500/poster.jpg",
      "trailer_url": "https://www.youtube.com/watch?v=VIDEO_ID"
    }
  ]
}
```

---

## Complete Response (Ideal)

With graph data for better visualization:

```json
{
  "status": "success",
  "query": "User's original query",
  "recommended_movies": [
    {
      "title": "Movie Title",
      "year": 2020,
      "director": "Director Name",
      "genres": ["Genre1", "Genre2"],
      "plot_summary": "Brief plot description",
      "similarity_score": 0.85,
      "reason_for_recommendation": [
        "Same director: Director Name",
        "Similar genre: Genre1"
      ],
      "tmdb_id": 12345
    }
  ],
  "graph_data": {
    "nodes": [
      {
        "id": "movie_1",
        "name": "Movie Title",
        "type": "movie",
        "properties": { "year": 2020, "similarity": 0.85 }
      },
      {
        "id": "genre_thriller",
        "name": "Thriller",
        "type": "genre"
      },
      {
        "id": "director_1",
        "name": "Director Name",
        "type": "director"
      }
    ],
    "edges": [
      { "source": "movie_1", "target": "genre_thriller", "relation": "has_genre" },
      { "source": "movie_1", "target": "director_1", "relation": "directed_by" }
    ]
  }
}
```

---

## Testing Your API

### 1. Using cURL

```bash
curl -X POST https://your-ml-api.com/api/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Dark psychological thriller",
    "num_recommendations": 5
  }'
```

### 2. Using Python

```python
import requests
import json

url = "https://your-ml-api.com/api/recommend"
payload = {
    "query": "Dark psychological thriller",
    "num_recommendations": 5
}

response = requests.post(url, json=payload)
print(json.dumps(response.json(), indent=2))
```

### 3. Using JavaScript/Node.js

```javascript
const fetch = require('node-fetch');

const url = 'https://your-ml-api.com/api/recommend';
const payload = {
  query: 'Dark psychological thriller',
  num_recommendations: 5
};

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
  .then(res => res.json())
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(err => console.error('Error:', err));
```

---

## Field Validation Checklist

Before sending your response, validate:

### ✅ Required Fields

```
recommended_movies[] must have:
  ✓ title (string, not empty)
  ✓ year (number, 1800-2100)
  ✓ genres (array, at least 1 item)
  ✓ similarity_score (number, 0.0-1.0)
  ✓ reason_for_recommendation (array, at least 2 items)
```

### ✅ Optional But Recommended

```
  ✓ director (string)
  ✓ plot_summary (string, 100-500 chars)
  ✓ tmdb_id (number)
  ✓ poster_url (valid URL)
  ✓ trailer_url (valid YouTube URL)
```

### ✅ Graph Data (if provided)

```
graph_data.nodes[] must have:
  ✓ id (string, unique)
  ✓ name (string)
  ✓ type (string: "movie"|"genre"|"director"|"theme")

graph_data.edges[] must have:
  ✓ source (string, matches a node id)
  ✓ target (string, matches a node id)
  ✓ relation (string: "has_genre"|"directed_by"|"similar_to"|"has_theme")
```

---

## Common Mistakes to Avoid

### ❌ Don't Do This:

```json
{
  "movies": [...],           // Wrong key name
  "similarity_score": "0.85" // Wrong type (string instead of number)
}
```

### ✅ Do This:

```json
{
  "recommended_movies": [...], // Correct key name
  "similarity_score": 0.85     // Correct type (number)
}
```

---

### ❌ Don't Do This:

```json
{
  "reason_for_recommendation": "Similar genre" // String instead of array
}
```

### ✅ Do This:

```json
{
  "reason_for_recommendation": ["Similar genre", "Same era"] // Array
}
```

---

### ❌ Don't Do This:

```json
{
  "similarity_score": 85 // Not normalized (0-1 range)
}
```

### ✅ Do This:

```json
{
  "similarity_score": 0.85 // Normalized (0.0-1.0)
}
```

---

## Sample Test Queries

Test your API with these queries:

1. **Specific Movie**
   ```json
   { "query": "Movies like Inception" }
   ```

2. **Genre**
   ```json
   { "query": "Romantic comedies" }
   ```

3. **Description**
   ```json
   { "query": "Dark psychological thrillers with twist endings" }
   ```

4. **Director**
   ```json
   { "query": "Christopher Nolan movies" }
   ```

5. **Actor**
   ```json
   { "query": "Movies starring Tom Hanks" }
   ```

6. **Mood/Theme**
   ```json
   { "query": "Feel-good movies for family night" }
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
