import mediapipe as mp
import cv2
import numpy as np
import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")

client = MongoClient(MONGO_URI)
db = client['faceid_db']
embeddings_collection = db['embeddings']

def extract_embedding(image_path):
    img = cv2.imread(image_path)
    if img is None:
        return None

    mp_face = mp.solutions.face_mesh
    with mp_face.FaceMesh(static_image_mode=True) as face_mesh:
        results = face_mesh.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        if not results.multi_face_landmarks:
            return None

        landmarks = results.multi_face_landmarks[0]
        points = [(lm.x, lm.y, lm.z) for lm in landmarks.landmark]
        return np.array(points).flatten().tolist()

def save_embedding(user_id, embedding):
    embeddings_collection.update_one(
            {'user_id': user_id},
            {'$set': {'embedding': embedding}},
            upsert=True
        )

def match_embedding(embedding):
    input_vec = np.array(embedding)
    all_embeddings = list(embeddings_collection.find())
    
    if not all_embeddings:
        return None, 0.0
        
    for doc in all_embeddings:
        user_id = doc['user_id']
        vec = doc['embedding']
        dist = np.linalg.norm(input_vec - np.array(vec))
        if dist < 5.0:  
            return user_id, 1 - dist / 10
            
    return None, 0.0