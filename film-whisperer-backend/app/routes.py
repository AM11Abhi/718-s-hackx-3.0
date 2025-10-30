from fastapi import APIRouter
import logging

from .models import GraphResponse
from .neo4j_client import fetch_graph

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/graph", response_model=GraphResponse)
async def get_graph():
    """
    Returns a knowledge graph (nodes + links).
    Currently returns a dummy graph so frontend can be tested immediately.
    TODO: Replace with real Neo4j-backed graph once neo4j_client is implemented.
    """
    logger.info("GET /api/v1/graph called")
    graph = fetch_graph()
    return graph
