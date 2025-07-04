from flask import Blueprint, request, jsonify, current_app
from supabase import create_client


patient_blueprint = Blueprint('patient', __name__)

# Function to get Supabase client
def get_supabase_client():
    url = current_app.config["SUPABASE_URL"]
    key = current_app.config["SUPABASE_KEY"]
    return create_client(url, key)

# CRUD API to create a new patient
@patient_blueprint.route('/patients', methods=['POST'])
def create_patient():
    request_data = request.get_json()
    phone = request_data.get('phone')
    full_name = request_data.get('fullname')
    dob = request_data.get('dob')
    gender = request_data.get('gender')
    email = request_data.get('email')
    user_id = request_data.get('user_id')

    
    if not full_name or not dob or not gender or not email or not user_id or not phone:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        supabase = get_supabase_client()
        response = supabase.table('Patients').insert({
            "fullname": full_name,
            "date_of_birth": dob,
            "gender": gender,
            "phone": phone,
            "email": email,
            "user_id": user_id,
        }).execute()

        if not response.data:
            return jsonify({"error": "Failed to create patient"}), 400
        return jsonify({"message": "Patient created successfully", "data": response.data}), 201


    except Exception as e:
        return jsonify({"error": str(e)}), 500


# CRUD API to get all patients
@patient_blueprint.route('/patients', methods=['GET'])
def get_patients():
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        #TODO: Fetch patients by user_id; Now all are fetched
        supabase = get_supabase_client()
        response = supabase.table('Patients').select('*').eq("user_id", user_id).execute()

        if not response.data:
            return jsonify({"error": "Failed to fetch patients"}), 400
        return jsonify({"patients": response.data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# CRUD API to get a single patient by patient_id
@patient_blueprint.route('/patients/<int:patient_id>', methods=['GET'])
def get_patient(patient_id):
    try:
        supabase = get_supabase_client()
        response = supabase.table('Patients').select('*').eq('id', patient_id).single().execute()

        if not response.data:
            return jsonify({"error": "Patient not found"}), 404
        return jsonify({"patient": response.data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# CRUD API to update an existing patient's information
@patient_blueprint.route('/patients/<int:patient_id>', methods=['PUT'])
def update_patient(patient_id):
    request_data = request.get_json()

    full_name = request_data.get('fullname')
    phone = request_data.get('phone')
    dob = request_data.get('dob')
    gender = request_data.get('gender')
    email = request_data.get('email')
    print(request_data)

    if not full_name  or not dob or not gender or not email:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        supabase = get_supabase_client()
        response = supabase.table('Patients').update({
            "fullname": full_name,
            "date_of_birth": dob,
            "gender": gender,
            "phone": phone,
            "email": email
        }).eq('id', patient_id).execute()

        if not response.data:
            return jsonify({"error": "Failed to update patient"}), 400
        return jsonify({"message": "Patient updated successfully", "data": response.data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# CRUD API to delete a patient
@patient_blueprint.route('/patients/<int:patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    try:
        # Delete the patient record by patient_id
        supabase = get_supabase_client()
        response = supabase.table('Patients').delete().eq('id', patient_id).execute()

        if not response.data:
            return jsonify({"error": "Failed to delete patient"}), 400
        return jsonify({"message": "Patient deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500