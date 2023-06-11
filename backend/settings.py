# settings module to be used throughout the backend
# store all configurable settings here and use it elsewhere

import os

# loading environment variables
from dotenv import load_dotenv
load_dotenv()

# this should not be True when in production
DEBUG = os.environ.get('DEBUG')

# CORS 
CORS = {
    "allowed_origins": ["*"],  # Allows all origins
    "allowed_credentials": True,
    "allowed_methods": ["*"],  # Allows all methods
    "allowed_headers": ["*"],  # Allows all headers
}

# Database credentials
DATABASE = {
    "db_engine": "sqlite:///database/aixplora.db",
    "host": os.environ.get('DB_HOST'), 
    "port": os.environ.get('DB_PORT'), 
    "name": os.environ.get('DB_NAME'), 
    "username": os.environ.get('DB_USER'), 
    "password": os.environ.get('DB_PASSWORD'), 
}

DEFAULT_LLM_MODEL = "gpt-3.5-turbo"
