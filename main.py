from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from Service.MongoFilter import MongoFilter
from bson import ObjectId
from bson.errors import InvalidId
from typing import Optional, Dict, Any
from fastapi import HTTPException
from db_rerank.match_and_rerank import semantic_search_and_rerank

app = FastAPI()
MongoDB_URI = "mongodb+srv://leena:leena123@cluster0.hinzr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL (adjust if different)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the input model for filters
class FilterInput(BaseModel):
    skills: Optional[List[str]] = None
    locations: Optional[List[str]] = None
    experience: Optional[int] = None
    keywords: Optional[str] = None  # Added for frontend compatibility
    user_nlp_text: Optional[str] = None  # Added for user input text

@app.post("/filter-resumes/", response_model=List[Dict])
async def filter_resumes(filters: FilterInput):
    """
    POST endpoint to filter resumes based on skills, locations, experience, and keywords.
    Returns a list of filtered resume documents.
    """
    # MongoDB URI (replace with your actual URI or use environment variables)
    uri = MongoDB_URI
    
    # Initialize MongoFilter
    mongo_filter = MongoFilter(uri)
    print(filters)
    try:
        # Connect to MongoDB
        mongo_filter.connect()

        # Convert filter input to dictionary, excluding unset fields
        filter_dict = filters.dict(exclude_unset=True)

        # Get filtered data
        results = mongo_filter.get_filtered_data(filter_dict)
        print("Results:", results)

        # Safely check for keywords (handles empty string or unset)
        if filter_dict.get("keywords"):
            print("these are the keywords", filter_dict["keywords"])
            print("these are the results", results)
            results = semantic_search_and_rerank(results, filter_dict["keywords"], top_k=20, rerank_top=20)
        
        print("Filtered Results:", results)
        return results

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

    finally:
        # Close MongoDB connection
        mongo_filter.close()
    # def get_data_by_id(self, resume_id: str) -> Optional[Dict[str, Any]]:
    #     """Fetch a single resume document by its ID."""
    #     if self.collection is None:
    #         raise RuntimeError("Database not connected. Call connect() first.")

    #     try:
    #         resume = self.collection.find_one({"_id": resume_id})
    #         if resume:
    #             resume['_id'] = str(resume['_id'])  # Convert ObjectId to string
    #         return resume
    #     except Exception as e:
    #         print(f"Error fetching data by ID: {e}")
    #         
@app.get("/resume/{resume_id}", response_model=Dict[str, Any])
async def get_resume_by_id(resume_id: str):
    """
    GET endpoint to fetch a single resume document by its ID.
    Returns the resume document if found, otherwise raises a 404 error.
    """
    # Validate ObjectId format first
    try:
        ObjectId(resume_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid resume ID format")
    
    # MongoDB URI (replace with your actual URI or use environment variables)
    uri = MongoDB_URI
    # Initialize MongoFilter
    mongo_filter = MongoFilter(uri)
    try:
        # Connect to MongoDB
        mongo_filter.connect()
        # Fetch resume by ID
        resume = mongo_filter.get_data_by_id(resume_id)
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        return resume
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")
    finally:
        # Close MongoDB connection
        mongo_filter.close()