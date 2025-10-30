# TMDB API Setup Instructions

This application now uses The Movie Database (TMDB) API to fetch real movie data when you click on movie nodes in the graph.

## How to Get Your TMDB API Key

1. Go to [https://www.themoviedb.org/](https://www.themoviedb.org/)
2. Create a free account or log in
3. Go to your account settings: [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
4. Request an API key (choose "Developer" option)
5. Fill out the form (you can use "Educational" or "Personal" for type)
6. Copy your API Key (v3 auth)

## Setup in This Project

1. Create a `.env` file in the root of the `film-whisperer-ui` folder:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and add your API key:
   ```
   VITE_TMDB_API_KEY=your_actual_api_key_here
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

## Features

When you click on a movie node in the graph, the app will:
- Fetch real-time data from TMDB API
- Display updated movie information including:
  - Official poster and backdrop images
  - Accurate plot summaries
  - Real ratings and vote counts
  - Runtime information
  - Movie taglines
  - Official trailers
  - Director information
  
If the API fetch fails, it will gracefully fall back to the cached dummy data.

## Testing

To test if the API is working:
1. Start the dev server
2. Search for a movie
3. Click on any movie node in the graph
4. You should see a toast notification saying "Movie loaded" with the movie title
5. The modal should display rich TMDB data

## Notes

- The API key is free and has generous rate limits
- All API calls are made client-side
- Error handling is built-in with fallback to cached data
