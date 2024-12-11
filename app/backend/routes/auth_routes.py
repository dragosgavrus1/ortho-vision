from flask import Blueprint, request, jsonify, current_app
from supabase import create_client, Client
import datetime
import jwt


auth_blueprint = Blueprint('auth', __name__)

supabase = current_app.supabase

@auth_blueprint.route('/signup', methods=['POST'])
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
            token = jwt.encode(payload, current_app.config["JWT_SECRET_KEY"], algorithm="HS256")

            return jsonify({
                "message": "User created and logged in successfully",
                "token": token,
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
                token = jwt.encode(payload, current_app.config["JWT_SECRET_KEY"], algorithm="HS256")
                return jsonify({
                    "message": "Login successful",
                    "token": token,
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
        supabase.auth.sign_out()
        
        return jsonify({"message": "User successfully logged out."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400