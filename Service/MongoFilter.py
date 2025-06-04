import json
from pymongo import MongoClient
from typing import List, Dict, Any, Optional
from bson.regex import Regex
from bson import ObjectId
from bson.errors import InvalidId
from typing import Optional, Dict, Any
from fastapi import HTTPException

class MongoFilter:
    def __init__(self, uri: str):
        self.client = MongoClient(uri)
        self.db_name = "Resumes"
        self.collection_name = "Resumes"
        self.collection = None

    def connect(self) -> None:
        """Connect to MongoDB."""
        try:
            self.client.server_info()
            self.collection = self.client[self.db_name][self.collection_name]
            print("Connected to MongoDB")
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")
            raise

    def close(self) -> None:
        """Close MongoDB connection."""
        try:
            self.client.close()
            print("MongoDB connection closed")
        except Exception as e:
            print(f"Error closing MongoDB connection: {e}")
            raise

    def get_filtered_data(self, filters: Dict[str, Any]) -> List[Dict]:
        """Fetch data based on provided filters and save unfiltered and filtered data to JSON."""
        if self.collection is None:
            raise RuntimeError("Database not connected. Call connect() first.")

        try:
            # Fetch unfiltered data
            unfiltered_data = list(self.collection.find({}))
            for doc in unfiltered_data:
                doc['_id'] = str(doc['_id'])
            
            with open('unfiltered_data.json', 'w') as f:
                json.dump(unfiltered_data, f, indent=4)
            print("Unfiltered data saved to unfiltered_data.json")

            # Build query dynamically for filtered data
            query = {}

            # Add skills filter if provided
            if filters.get("skills") and len(filters["skills"]) > 0:
                skill_pattern = "|".join(filters["skills"])
                query["core_technical_skills_claimed"] = {
                    "$regex": skill_pattern,
                    "$options": "i"
                }

            # Add locations filter if provided
            if filters.get("locations") and len(filters["locations"]) > 0:
                query["preferred_location"] = {"$in": filters["locations"]}

            # Aggregation pipeline
            pipeline = [
                # Convert total_experience to float if it's a string
                {
                    "$addFields": {
                        "total_experience_float": {
                            "$convert": {
                                "input": "$total_experience",
                                "to": "double",
                                "onError": 0.0,  # Default to 0 if conversion fails
                                "onNull": 0.0
                            }
                        }
                    }
                },
                # Apply filters
                {"$match": query},
                # Add experience filter if provided
                {
                    "$match": {
                        "total_experience_float": {
                            "$gte": filters.get("experience", 0),
                            "$lt": filters.get("experience", 0) + 1
                        } if filters.get("experience") is not None else {}
                    }
                },
                # Remove temporary field
                {
                    "$unset": "total_experience_float"
                }
            ]

            filtered_data = list(self.collection.aggregate(pipeline))
            for doc in filtered_data:
                if '_id' in doc:
                    doc['_id'] = str(doc['_id'])
            
            with open('filtered_data.json', 'w') as f:
                json.dump(filtered_data, f, indent=4)
            print("Filtered data saved to filtered_data.json")

            return filtered_data
        except Exception as e:
            print(f"Error fetching or saving data: {e}")
            raise
        
    def get_data_by_id(self, resume_id: str) -> Optional[Dict[str, Any]]:
        """Fetch a single resume document by its ID."""
        if self.collection is None:
            raise RuntimeError("Database not connected. Call connect() first.")
        
        try:
            # Convert string to ObjectId
            object_id = ObjectId(resume_id)
            resume = self.collection.find_one({"_id": object_id})
            if resume:
                resume['_id'] = str(resume['_id'])  # Convert ObjectId to string
            return resume
        except InvalidId:
            # Handle invalid ObjectId format
            print(f"Invalid ObjectId format: {resume_id}")
            return None
        except Exception as e:
            print(f"Error fetching data by ID: {e}")
            raise