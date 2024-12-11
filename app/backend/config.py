import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Fetch Supabase credentials from environment variables
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")