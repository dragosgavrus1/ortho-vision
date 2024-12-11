import datetime
import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_file
import jwt
from supabase import create_client, Client
from flask_cors import CORS
import numpy as np
import cv2
from ultralytics import YOLO
from PIL import Image

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Fetch Supabase credentials from environment variables
supabase_url: str = os.getenv("SUPABASE_URL", "")
supabase_key: str = os.getenv("SUPABASE_KEY", "")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")

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

    if not email or not password or not fullname:
        return jsonify({"error": "Email, password or fullname missing."}), 400

    try:
        # Call Supabase API to sign up the user
        response = supabase.auth.sign_up({
            "email": email,
            "password": password,
        })

        user = response.user
        if user:
            user_id = user.id
            # Insert user info into the 'Users' table
            supabase.table('Users').insert({
                "fullname": fullname,
                "role": "user",  # Default role for new users
                "user_id": user_id,
            }).execute()

            # Create JWT Token for new user with fullname and role
            payload = {
                "user_id": user.id,
                "fullname": fullname,
                "role": "user",  # Default role for new users
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),  # Token expires in 1 hour
            }
            token = jwt.encode(payload, JWT_SECRET_KEY, algorithm="HS256")

            return jsonify({
                "message": "User created and logged in successfully",
                "token": token,
            }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"error": "Error during signup."}), 401

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

        user = response.user

        if user:
            user_id = user.id
            user_data = supabase.table('Users').select('fullname', 'role').eq('user_id', user.id).single().execute()
            if user_data.model_validate:
                fullname = user_data.data.get('fullname')
                role = user_data.data.get('role')
                payload = {
                    "user_id": user.id,
                    "fullname": fullname,
                    "role": role,
                    "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),  # Token expires in 1 hour
                }
                token = jwt.encode(payload, JWT_SECRET_KEY, algorithm="HS256")
                return jsonify({
                    "message": "Login successful",
                    "token": token,
                }), 200
            else:
                return jsonify({"error": "Failed to retrieve user data from database"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    return jsonify({"error": "Error during signin."}), 401

@app.route('/logout', methods=['POST'])
def logout():
    try:
        # Supabase provides a `sign_out()` function to revoke the current session
        supabase.auth.sign_out()
        
        return jsonify({"message": "User successfully logged out."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    

@app.route('/upload', methods=['GET'])
def upload_image():
    model = YOLO('models/best.pt')
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    image = Image.open(file.stream)

    image_np = np.array(image)

    results = model(image_np)

    for bbox in results.xyxy[0]:
        x, y, w, h, conf, cls = bbox
        x1, y1 = int(x - w / 2), int(y - h / 2)
        x2, y2 = int(x + w / 2), int(y + h / 2)

        cv2.rectangle(image_np, (x1, y1), (x2, y2), (0, 255, 0), 2)
    
    image_with_bounding_boxes = Image.fromarray(image_np)

    image_io = BytesIO()
    image_with_bounding_boxes.save(image_io, format='PNG')
    image_io.seek(0)

    return send_file(image_io, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True, port="3000")
