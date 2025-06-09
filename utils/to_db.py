import json
from pymongo import MongoClient

# Replace with your connection string from MongoDB Atlas
mongo_uri = "mongodb+srv://leena:leena123@cluster0.hinzr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Replace with your DB and collection names
db_name = "Resumes"
collection_name = "Resumes1"

# Load JSON file
with open('D:\\Resume_Screening\\backend\\utils\\final_output_selected.json', 'r') as f:
    data = json.load(f)  # Expecting a list of dictionaries

# Connect to MongoDB Atlas
client = MongoClient(mongo_uri)
db = client[db_name]
collection = db[collection_name]

# Insert data
if isinstance(data, list):
    result = collection.insert_many(data)
    print(f"{len(result.inserted_ids)} records inserted.")
else:
    print("JSON file must contain a list of objects.")
