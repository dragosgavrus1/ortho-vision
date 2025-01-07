from flask import Blueprint, request, jsonify, current_app
from supabase import create_client, Client


radiograph_blueprint = Blueprint('patient', __name__)

# Function to get Supabase client
def get_supabase_client():
    url = current_app.config["SUPABASE_URL"]
    key = current_app.config["SUPABASE_KEY"]
    return create_client(url, key)

# CRUD API to create a new patient
@radiograph_blueprint.route('/radiographs', methods=['POST'])
def create_radiograph():
    request_data = request.get_json()

    patient_id = request_data.get('patient_id')
    url = request_data.get('url')
    date = request_data.get('date')

    if not patient_id or not url:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        supabase = get_supabase_client()
        response = supabase.table('Radiographs').insert({
            "patient_id": patient_id,
            "url": url,
        }).execute()

        if not response.data:
            return jsonify({"error": "Failed to create radiograph"}), 400
        return jsonify({"message": "Radiograph created successfully", "data": response.data}), 201


    except Exception as e:
        return jsonify({"error": str(e)}), 500


# CRUD API to get all patients
@radiograph_blueprint.route('/radiographs', methods=['GET'])
def get_radiographs():
    patient_id = request.args.get('patient_id')

    if not patient_id:
        return jsonify({"error": "Patient ID is required"}), 400

    try:
        supabase = get_supabase_client()
        response = supabase.table('Radiographs').select('*').eq('patient_id', patient_id).execute()

        if not response.data:
            return jsonify({"error": "Failed to fetch radiographs"}), 400
        return jsonify({"patients": response.data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
