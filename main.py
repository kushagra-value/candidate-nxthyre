from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from Service.MongoFilter import MongoFilter

app = FastAPI()

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

@app.post("/filter-resumes/", response_model=List[Dict])
async def filter_resumes(filters: FilterInput):
    """
    POST endpoint to filter resumes based on skills, locations, experience, and keywords.
    Returns a list of filtered resume documents.
    """
    # MongoDB URI (replace with your actual URI or use environment variables)
    uri = "mongodb+srv://leena:leena123@cluster0.hinzr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    
    # Initialize MongoFilter
    mongo_filter = MongoFilter(uri)

    try:
        # Connect to MongoDB
        mongo_filter.connect()

        # Convert filter input to dictionary
        filter_dict = filters.dict(exclude_unset=True)

        # Merge keywords into skills if provided
        if filter_dict.get("keywords"):
            keyword_list = [kw.strip() for kw in filter_dict["keywords"].split(",") if kw.strip()]
            filter_dict["skills"] = (filter_dict.get("skills") or []) + keyword_list
            del filter_dict["keywords"]  # Remove keywords from filter_dict

        # Get filtered data
        results = mongo_filter.get_filtered_data(filter_dict)

        return results

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

    finally:
        # Close MongoDB connection
        mongo_filter.close()