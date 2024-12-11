import datetime
import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_file
import jwt
from supabase import create_client, Client
from flask_cors import CORS
from io import BytesIO
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
    

@app.route('/upload', methods=['POST'])
def upload_image():
    model = YOLO('models/best.pt')
    class_names = ['IMP', 'PRR', 'OBT', 'END', 'CAR', 'BON', 'IMT', 'API', 'ROT', 'FUR', 'APS', 'ROR', 'ORD', 'SRD']
    num_classes = len(class_names)

    color_map = {i: tuple(np.random.randint(0, 255, 3).tolist()) for i in range(num_classes)}

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    try:
        # Read image from the request
        image = np.frombuffer(file.read(), np.uint8)
        decoded_image = cv2.imdecode(image, cv2.IMREAD_COLOR)

        # Perform inference
        results = model(decoded_image)

        # Get bounding boxes and draw them on the image
        annotated_image = decoded_image.copy()
        for result in results:
            for bbox, cls in zip(result.boxes.xyxy, result.boxes.cls):  # Get bounding boxes and classes
                x1, y1, x2, y2 = map(int, bbox)
                class_id = int(cls)
                color = color_map[class_id]  # Get color for this class
                label = class_names[class_id]  # Get class name
                
                # Draw bounding box
                cv2.rectangle(annotated_image, (x1, y1), (x2, y2), color, 2)
                
                # Draw class label above the bounding box
                label_text = f"{label}"
                (text_width, text_height), _ = cv2.getTextSize(label_text, cv2.FONT_HERSHEY_SIMPLEX, 2, 2)
                cv2.rectangle(annotated_image, (x1, y1 - text_height - 2), (x1 + text_width, y1), color, -1)
                cv2.putText(annotated_image, label_text, (x1, y1 - 2), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

        # Convert the annotated image to JPEG and send it as a response
        _, img_encoded = cv2.imencode('.jpg', annotated_image)
        img_bytes = img_encoded.tobytes()

        return send_file(
            BytesIO(img_bytes),
            mimetype='image/jpeg',
            as_attachment=False,
            download_name='annotated_image.jpg'
        )

    except Exception as e:
        return jsonify({"Error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port="3000")
