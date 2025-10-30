# query_agent/entity_extractor.py

import spacy
from typing import Dict, List
from schema import Entities

# Load a medium spaCy model (you can switch to en_core_web_trf later if you want better accuracy)
nlp = spacy.load("en_core_web_sm")

# Some custom word lists to help spaCy (extend later)
KNOWN_GENRES = [
    "action", "drama", "comedy", "thriller", "sci-fi", "romance", "horror", 
    "fantasy", "animation", "documentary", "crime", "adventure"
]

def extract_entities(query: str) -> Entities:
    """Extract movie-related entities from a query using spaCy and simple keyword matching."""
    doc = nlp(query)
    actors, directors, genres = [], [], []

    # Extract named entities from spaCy
    for ent in doc.ents:
        if ent.label_ in ["PERSON"]:  # likely actor or director
            actors.append(ent.text)
        elif ent.label_ in ["WORK_OF_ART"]:  # sometimes captures movie names
            # We will treat these as possible directors for now
            directors.append(ent.text)

    # Genre keyword matching
    for token in doc:
        if token.text.lower() in KNOWN_GENRES:
            genres.append(token.text.title())

    return Entities(
        actors=list(set(actors)),
        directors=list(set(directors)),
        genres=list(set(genres))
    )
