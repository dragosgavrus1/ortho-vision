import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Fetch Supabase credentials from environment variables
    supabase_url: str = os.getenv("SUPABASE_URL", "")
    supabase_key: str = os.getenv("SUPABASE_KEY", "")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")