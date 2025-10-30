import logging
from typing import List, Dict

logger = logging.getLogger(__name__)

def compute_similar_movies(title: str, top_k: int = 5) -> List[Dict]:
    """
    Stubbed ML function returning mock similar movies.
    TODO: Connect to real ML model or service to compute similarities.
    """
    logger.info("compute_similar_movies stub called for title=%s", title)
    # Return simple mocked results
    return [
        {"title": "Interstellar", "similarity_score": 0.92},
        {"title": "Memento", "similarity_score": 0.78},
    ][:top_k]
