import logging
from .models import Node, Link, GraphResponse

logger = logging.getLogger(__name__)

def fetch_graph() -> GraphResponse:
    """
    Stub implementation that returns a small dummy graph.
    TODO: Implement real Neo4j connection and queries here (use neo4j.Driver).
    """
    logger.info("Fetching graph from Neo4j (stubbed response)")
    # Dummy nodes and links — structure matches the frontend expectations
    nodes = [
        Node(id="Inception", name="Inception", type="movie", data={"title": "Inception", "year": 2010}),
        Node(id="Sci-Fi", name="Sci-Fi", type="genre"),
        Node(id="Christopher Nolan", name="Christopher Nolan", type="director"),
    ]
    links = [
        Link(source="Inception", target="Sci-Fi"),
        Link(source="Inception", target="Christopher Nolan"),
    ]
    return GraphResponse(nodes=nodes, links=links)
