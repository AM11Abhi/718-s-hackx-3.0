# query_agent/schema.py

from typing import List, Dict, Optional
from pydantic import BaseModel

class Entities(BaseModel):
    actors: Optional[List[str]] = []
    directors: Optional[List[str]] = []
    genres: Optional[List[str]] = []

class QueryUnderstandingOutput(BaseModel):
    intent: str = "semantic_search"
    query_type: str  # e.g. plot_based | genre_based | director_based | actor_based | mixed
    criteria: List[str]
    movie_name: Optional[str] = None
    entities: Entities
    themes: Optional[List[str]] = []
