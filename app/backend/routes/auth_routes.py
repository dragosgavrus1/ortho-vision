from flask import Blueprint, request, jsonify, current_app
from supabase import create_client, Client
import datetime
import jwt


auth_blueprint = Blueprint('auth', __name__)

# Function to get Supabase client
def get_supabase_client():
    url = current_app.config["SUPABASE_URL"]
    key = current_app.config["SUPABASE_KEY"]
    supabase: Client = create_client(url, key)
    return supabase

@auth_blueprint.route('/signup', methods=['POST'])
def signup():
    request_data = request.get_json()

    # Validate the input data
    email = request_data.get('email')
    password = request_data.get('password')
    fullname = request_data.get('fullname')
    role = request_data.get('role', 'user')

    if not email or not password or not fullname:
        return jsonify({"error": "Email, password or fullname missing."}), 400

    try:
        # Call Supabase API to sign up the user
        supabase = get_supabase_client()

        if role == 'patient':
            # 1. Check if patient exists
            patient_response = supabase.table('Patients').select('id').eq('email', email).single().execute()

            if not patient_response.data:
                return {"error": "No existing patient record found. Please contact your doctor."}, 400
            patient_id = patient_response.data['id']

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
                "role": role,
                "user_id": user_id,
                "email": email,
            }).execute()

            # Create JWT Token for new user with fullname and role
            payload = {
                "user_id": user.id,
                "fullname": fullname,
                "role": role,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),  # Token expires in 1 hour
            }
            token = jwt.encode(payload, current_app.config["JWT_SECRET_KEY"], algorithm="HS256")

            return jsonify({
                "message": "User created and logged in successfully",
                "token": token,
                "user_id": user_id,
                **({"patient_id": patient_id} if patient_id else {}),
            }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"error": "Error during signup."}), 401

@auth_blueprint.route('/signin', methods=['POST'])
def signin():
    request_data = request.get_json()

    # Validate the input data
    email = request_data.get('email')
    password = request_data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        # Call Supabase API to sign in the user
        supabase = get_supabase_client()
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password,
        })

        user = response.user
        if user:
            user_id = user.id
            user_data = supabase.table('Users').select('fullname', 'role', 'id').eq('user_id', user_id).single().execute()
            patient_id = None
            if user_data.model_validate:
                fullname = user_data.data.get('fullname')
                role = user_data.data.get('role')

                if role == 'patient':
                    patient_response = supabase.table('Patients').select('id').eq('email', email).single().execute()
                    if patient_response.data:
                        patient_id = patient_response.data.get('id')

                payload = {
                    "user_id": user.id,
                    "fullname": fullname,
                    "role": role,
                    "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),  # Token expires in 1 hour
                }
                token = jwt.encode(payload, current_app.config["JWT_SECRET_KEY"], algorithm="HS256")
                return jsonify({
                    "message": "Login successful",
                    "token": token,
                    "user_id": user_data.data.get('id'),
                    "role": role,
                    **({"patient_id": patient_id} if patient_id else {})
                }), 200
            else:
                return jsonify({"error": "Failed to retrieve user data from database"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    return jsonify({"error": "Error during signin."}), 401

@auth_blueprint.route('/logout', methods=['POST'])
def logout():
    try:
        # Supabase provides a `sign_out()` function to revoke the current session
        supabase = get_supabase_client()
        supabase.auth.sign_out()
        
        return jsonify({"message": "User successfully logged out."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    

@auth_blueprint.route('/get_user', methods=['POST'])
def get_user():
    try:
        request_data = request.get_json()
        user_id = request_data.get("user_id")

        if not user_id:
            return jsonify({"error": "Missing user_id"}), 400

        supabase = get_supabase_client()
        response = supabase.table("Users").select("*").eq("id", user_id).single().execute()

        if response.data:
            return jsonify({"user": response.data}), 200
        else:
            return jsonify({"error": "User not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_blueprint.route('/users/<user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        data = request.get_json()
        fullname = data.get("fullname")
        if not fullname:
            return jsonify({"error": "Missing fullname"}), 400

        supabase = get_supabase_client()
        response = supabase.table("Users").update({"fullname": fullname}).eq("id", user_id).execute()

        if response.data:
            return jsonify({"message": "User updated successfully"}), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500