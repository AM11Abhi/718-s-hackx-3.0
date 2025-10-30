from pydantic import BaseModel
from typing import List, Any, Optional

class Movie(BaseModel):
    title: str
    year: Optional[int] = None
    director: Optional[str] = ""
    genres: List[str] = []
    plot_summary: Optional[str] = ""
    poster_url: Optional[str] = ""
    trailer_url: Optional[str] = ""
    similarity_score: Optional[float] = 0.0
    reason_for_recommendation: List[str] = []

class Node(BaseModel):
    id: str
    name: str
    type: str
    data: Optional[Any] = None

class Link(BaseModel):
    source: str
    target: str

class GraphResponse(BaseModel):
    nodes: List[Node]
    links: List[Link]
