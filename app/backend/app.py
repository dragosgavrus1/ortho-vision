import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from supabase import create_client, Client
from flask_cors import CORS

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Fetch Supabase credentials from environment variables
supabase_url: str = os.getenv("SUPABASE_URL", "")
supabase_key: str = os.getenv("SUPABASE_KEY", "")

# Initialize Supabase client
supabase: Client = create_client(supabase_url, supabase_key)

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/signup', methods=['POST'])
def signup():
    request_data = request.get_json()

    # Validate the input data
    email = request_data.get('email')
    password = request_data.get('password')
    fullname = request_data.get('fullname')
    print(email, password, fullname)

    if not email or not password or not fullname:
        return jsonify({"error": "Email, password or fullname missing."}), 400

    try:
        # Call Supabase API to sign up the user
        response = supabase.auth.sign_up({
            "email": email,
            "password": password,
        })

        # Check if user was created successfully
        user = response.user
        if user:
            user_id = user.id
            print(user_id)
            # Insert user info into the 'Users' table
            supabase.table('Users').insert({
                "fullname": fullname,
                "role": "user",
                "user_id": user_id,
            }).execute()
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(response.model_dump_json()), 200

@app.route('/signin', methods=['POST'])
def signin():
    request_data = request.get_json()

    # Validate the input data
    email = request_data.get('email')
    password = request_data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        # Call Supabase API to sign in the user
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password,
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(response.model_dump_json()), 200

if __name__ == '__main__':
    app.run(debug=True)
