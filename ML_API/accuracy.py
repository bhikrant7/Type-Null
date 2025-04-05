from langchain_huggingface.embeddings import HuggingFaceEmbeddings
import numpy as np
import math

def get_accuracy(user_note, llm_note):
  model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
  
  # Compute similarity between two texts using BERT embeddings
  embedding1 = model.embed_query(user_note)
  embedding2 = model.embed_query(llm_note)

  similarity_score = np.dot(embedding1, embedding2) / (np.linalg.norm(embedding1) * np.linalg.norm(embedding2))
  
  # Adding penalty if user note and llm notes have very high difference in lengths
  # Get text lengths
  len_user = len(user_note.split())  # Word count
  len_llm = len(llm_note.split())  

  # # Normalization factor (Option 1: Simple Scaling)
  length_penalty = 1 - abs(len_user - len_llm) / max(len_user, len_llm)

  normalized_score = similarity_score * max(0, length_penalty)     # Apply penalty (ensure non-negative)
  normalized_score = max(0, min(normalized_score, 1))              # clamp to [0, 1]

  return normalized_score


def get_embeddings(sentences, model):
    return [model.embed_query(sentence) for sentence in sentences]

def cosine_similarity(vec1, vec2):
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

def find_missing_info(user_note, llm_note, threshold=0.7):
    model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    # Split into sentences (basic, can be improved with NLP)
    user_sentences = user_note.split(". ")
    llm_sentences = llm_note.split(". ")

    # Get embeddings
    user_embeddings = get_embeddings(user_sentences, model)
    llm_embeddings = get_embeddings(llm_sentences, model)

    missing_info = []

    for i, llm_embed in enumerate(llm_embeddings):
        similarities = [cosine_similarity(llm_embed, user_embed) for user_embed in user_embeddings]
        max_similarity = max(similarities) if similarities else 0  # Handle empty case

        if max_similarity < threshold:
            missing_info.append(llm_sentences[i])  

    return missing_info


# Example Usage
user_note = "Static friction acts on stationary objects."
llm_note = """Static friction is the force that resists the initial movement of two surfaces in contact when a force is applied. 
It acts in the opposite direction of the applied force, preventing the object from moving until the applied force exceeds the maximum static friction.
The maximum force of static friction (f_s_max) is given by: f_s_max = μ_s * F_N where μ_s is the coefficient of static friction and F_N is the normal force."""

# missing_points = find_missing_info(user_note, llm_note)

# print("🚨 Missing Information in User Notes:")
# for point in missing_points:
#     print(f"- {point}")



import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer

# nltk.download("punkt")
# nltk.download("stopwords")

def extract_keywords(text, top_n=5):
    """Extracts important keywords using NLTK and TF-IDF."""
    # Tokenize and remove stopwords
    words = word_tokenize(text.lower())
    words = [word for word in words if word.isalnum() and word not in stopwords.words("english")]

    # TF-IDF Keyword Extraction
    vectorizer = TfidfVectorizer(stop_words="english", max_features=10)
    tfidf_matrix = vectorizer.fit_transform([text])
    tfidf_keywords = set(vectorizer.get_feature_names_out())

    # Combine tokenized words + TF-IDF keywords
    keywords = set(words).union(tfidf_keywords)

    return list(keywords)[:top_n]  # Return top N keywords

def find_missing_keywords(user_note, llm_note):
    """Finds keywords in LLM note that are missing in user note."""
    llm_keywords = extract_keywords(llm_note)
    user_keywords = extract_keywords(user_note)

    missing_keywords = set(llm_keywords) - set(user_keywords)

    return missing_keywords


# Example Usage
# user_note = "Static friction acts on stationary objects."
# llm_note = """Static friction is the force that resists the initial movement of two surfaces in contact when a force is applied. 
# It acts in the opposite direction of the applied force, preventing the object from moving until the applied force exceeds the maximum static friction.
# The maximum force of static friction (f_s_max) is given by: f_s_max = μ_s * F_N where μ_s is the coefficient of static friction and F_N is the normal force."""

# missing_keywords = find_missing_keywords(user_note, llm_note)

# print("🚨 Missing Keywords in User Notes:")
# print(missing_keywords)
