import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_bcrypt import Bcrypt
from supabase import create_client, Client

load_dotenv()

app = Flask(__name__)

bcrypt = Bcrypt(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
supabase_url: str = os.getenv("SUPABASE_URL", "")
supabase_key: str = os.getenv("SUPABASE_KEY", "")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

supabase: Client = create_client(supabase_url, supabase_key)

@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'

@app.route('/signup', methods=['POST'])
def signup():
    request_data = request.get_json()
    try:
        response = supabase.auth.sign_up(
        {
            "email": request_data['email'],
            "password": request_data['password'],
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return response.json(), 200

@app.route('/signin/google', methods=['POST'])
def signin_with_google():
    res = supabase.auth.sign_in_with_oauth(
        {
            "provider": "google",
            "options": {
                "redirect_to": "https://ascqlpmgjkfwtpawkkjy.supabase.co/auth/v1/callback",
            }
        }
    )
    return res.json(), 200

@app.route('/signin', methods=['POST'])
def signin():
    request_data = request.get_json()
    
    try:
        response = supabase.auth.sign_in_with_password(
            {
                "email": request_data['email'],
                "password": request_data['password'],
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    return response.json(), 200


if __name__ == '__main__':
    app.run()
