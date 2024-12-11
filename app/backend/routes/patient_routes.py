from flask import Blueprint, app, request, jsonify, current_app
from supabase import create_client, Client


patient_blueprint = Blueprint('patient', __name__)

supabase: Client = create_client(app.config["SUPABASE_URL"], app.config["SUPABASE_KEY"])
# CRUD API to create a new patient
@patient_blueprint.route('/patients', methods=['POST'])
def create_patient():
    request_data = request.get_json()

    first_name = request_data.get('first_name')
    last_name = request_data.get('last_name')
    dob = request_data.get('dob')
    gender = request_data.get('gender')
    contact_number = request_data.get('contact_number')
    email = request_data.get('email')
    user_id = request_data.get('user_id')

    if not first_name or not last_name or not dob or not gender or not contact_number or not email or not user_id:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        response = supabase.table('Patients').insert({
            "first_name": first_name,
            "last_name": last_name,
            "dob": dob,
            "gender": gender,
            "contact_number": contact_number,
            "email": email,
            "user_id": user_id,
        }).execute()

        if response.status_code == 201:
            return jsonify({"message": "Patient created successfully", "data": response.data}), 201
        else:
            return jsonify({"error": "Failed to create patient"}), 400

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
        response = supabase.table('Patients').select('*').execute()

        if response.status_code == 200:
            return jsonify({"patients": response.data}), 200
        else:
            return jsonify({"error": "Failed to fetch patients"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# CRUD API to get a single patient by patient_id
@patient_blueprint.route('/patients/<int:patient_id>', methods=['GET'])
def get_patient(patient_id):
    try:
        response = supabase.table('Patients').select('*').eq('patient_id', patient_id).single().execute()

        if response.status_code == 200:
            return jsonify({"patient": response.data}), 200
        else:
            return jsonify({"error": "Patient not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# CRUD API to update an existing patient's information
@patient_blueprint.route('/patients/<int:patient_id>', methods=['PUT'])
def update_patient(patient_id):
    request_data = request.get_json()

    first_name = request_data.get('first_name')
    last_name = request_data.get('last_name')
    dob = request_data.get('dob')
    gender = request_data.get('gender')
    contact_number = request_data.get('contact_number')
    email = request_data.get('email')

    if not first_name or not last_name or not dob or not gender or not contact_number or not email:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        response = supabase.table('Patients').update({
            "first_name": first_name,
            "last_name": last_name,
            "dob": dob,
            "gender": gender,
            "contact_number": contact_number,
            "email": email
        }).eq('patient_id', patient_id).execute()

        if response.status_code == 200:
            return jsonify({"message": "Patient updated successfully", "data": response.data}), 200
        else:
            return jsonify({"error": "Failed to update patient"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# CRUD API to delete a patient
@patient_blueprint.route('/patients/<int:patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    try:
        # Delete the patient record by patient_id
        response = supabase.table('Patients').delete().eq('patient_id', patient_id).execute()

        if response.status_code == 200:
            return jsonify({"message": "Patient deleted successfully"}), 200
        else:
            return jsonify({"error": "Failed to delete patient"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500