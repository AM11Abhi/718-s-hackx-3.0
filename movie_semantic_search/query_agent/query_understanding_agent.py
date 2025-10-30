# query_understanding_agent.py

import os
import json
import spacy
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

# -------------------------------------------------
# 1️⃣ ENVIRONMENT SETUP
# -------------------------------------------------
# Google Gemini API key
GEMINI_API_KEY = "AIzaSyC2-XB0fwWFKXntNAvZeiV4shS0rxqVEUc"

# -------------------------------------------------
# 2️⃣ LOAD SPACY MODEL
# -------------------------------------------------
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("⚙️ Installing spaCy model (first-time setup)...")
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# -------------------------------------------------
# 3️⃣ GENRE LISTS
# -------------------------------------------------
KNOWN_GENRES = [
    "action", "drama", "comedy", "thriller", "sci-fi", "romance", "horror", 
    "fantasy", "animation", "documentary", "crime", "adventure"
]

GENRE_SYNONYMS = {
    "sci-fi": "Sci-Fi",
    "science fiction": "Sci-Fi",
    "romcom": "Romance",
    "romantic comedy": "Romance",
    "crime thriller": "Thriller"
}

# -------------------------------------------------
# 4️⃣ ENTITY EXTRACTOR
# -------------------------------------------------
def extract_entities(query: str) -> dict:
    """Extract movie-related entities using spaCy + genre keywords."""
    doc = nlp(query)
    actors, directors, genres, movie_name = [], [], [], None

    for ent in doc.ents:
        if ent.label_ == "PERSON":
            actors.append(ent.text)
        elif ent.label_ == "WORK_OF_ART":
            movie_name = ent.text

    for token in doc:
        text = token.text.lower()
        if text in KNOWN_GENRES:
            genres.append(token.text.title())
        elif text in GENRE_SYNONYMS:
            genres.append(GENRE_SYNONYMS[text])

    return {
        "actors": list(set(actors)),
        "directors": [],
        "genres": list(set(genres)),
        "movie_name": movie_name
    }

# -------------------------------------------------
# 5️⃣ GEMINI MODEL
# -------------------------------------------------
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0.3,
    google_api_key=GEMINI_API_KEY
)

# -------------------------------------------------
# 6️⃣ PROMPT TEMPLATE
# -------------------------------------------------
prompt = PromptTemplate(
    template=(
        "You are a movie query understanding agent.\n"
        "Analyze the following user query and output structured JSON in this format:\n\n"
        "{{\n"
        "  'intent': 'semantic_search',\n"
        "  'query_type': 'plot_based | genre_based | director_based | actor_based | mixed',\n"
        "  'criteria': [list of keywords or themes],\n"
        "  'movie_name': '<movie name or null>',\n"
        "  'entities': {{'actors': [], 'directors': [], 'genres': []}},\n"
        "  'themes': [list of inferred ideas like revenge, friendship, dreams]\n"
        "}}\n\n"
        "User query: {query}\n\n"
        "Entities extracted using spaCy: {entities}\n"
        "Return only valid JSON — no text, no explanations."
    ),
    input_variables=["query", "entities"]
)

# -------------------------------------------------
# 7️⃣ MAIN FUNCTION
# -------------------------------------------------
def parse_query(query: str):
    """Uses Gemini to interpret and structure the movie query."""
    entities = extract_entities(query)
    formatted_prompt = prompt.format(query=query, entities=json.dumps(entities, indent=2))

    print("\n🤖 Sending prompt to Gemini...\n")
    response = llm.invoke(formatted_prompt)
    raw_output = getattr(response, "content", str(response))

    # Clean up formatting
    clean_json = raw_output.strip("```json").strip("```").strip()

    try:
        return json.loads(clean_json)
    except json.JSONDecodeError:
        return {"error": "Failed to parse JSON", "raw_output": clean_json}

# -------------------------------------------------
# 8️⃣ CLI TEST
# -------------------------------------------------
if __name__ == "__main__":
    print("🎬 Movie Query Understanding Agent (spaCy + Gemini)")
    user_query = input("Enter your movie-related query:\n> ")
    result = parse_query(user_query)
    print("\n🧾 Structured Output:\n")
    print(json.dumps(result, indent=2))
