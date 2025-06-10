from flask import Blueprint, request, jsonify, current_app
from supabase import create_client, Client
import requests
import re

radiograph_blueprint = Blueprint('radiograph', __name__)

# Function to get Supabase client
def get_supabase_client():
    url = current_app.config["SUPABASE_URL"]
    key = current_app.config["SUPABASE_KEY"]
    supabase: Client = create_client(url, key)
    return supabase

@radiograph_blueprint.route('/radiographs', methods=['POST'])
def create_radiograph():
    try:
        print("Creating radiograph")
        patient_id = request.form.get('patient_id')
        report = request.form.get('report')
        date = request.form.get('date')
        image = request.files.get('image')  # Get the uploaded image file

        if not patient_id or not image or not report:
            return jsonify({"error": "Missing required fields"}), 400

        # Save the image to Supabase storage
        print("Saving image to Supabase storage")
        supabase = get_supabase_client()
        safe_date = re.sub(r"[^a-zA-Z0-9_-]", "_", date)
        file_name = f"radiographs/{patient_id}_{safe_date}.png"
        image_data = image.read()  # Read the binary data of the image
        print(f"File name: {file_name}")
        print(f"Image data type: {type(image_data)}")
        print(f"Image data size: {len(image_data)} bytes")
        storage_response = supabase.storage.from_("radiographs").upload(file_name, image_data)

        print(f"Storage response: {storage_response}")
        if not storage_response:
            return jsonify({"error": "Failed to upload image to storage"}), 500

        # Get the public URL of the uploaded image
        public_url = supabase.storage.from_("radiographs").get_public_url(file_name)

        # Save metadata to the Radiographs table
        print("Saving metadata to Supabase database")
        db_response = supabase.table('Radiographs').insert({
            "patient_id": patient_id,
            "url": public_url,
            "report": report,
            "date": date,
        }).execute()

        if not db_response.data:
            return jsonify({"error": "Failed to save radiograph metadata"}), 500

        return jsonify({"message": "Radiograph saved successfully", "data": db_response.data}), 200

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
            return jsonify({"patients": []}), 200
        return jsonify({"patients": response.data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@radiograph_blueprint.route('/radiographs/<radiograph_id>', methods=['DELETE'])
def delete_radiograph(radiograph_id):
    try:
        print(f"Deleting radiograph with ID: {radiograph_id}")
        supabase = get_supabase_client()

        # Fetch the radiograph metadata to get the file name
        radiograph_response = supabase.table('Radiographs').select('*').eq('id', radiograph_id).execute()
        if not radiograph_response.data:
            return jsonify({"error": "Radiograph not found"}), 404

        radiograph = radiograph_response.data[0]
        file_url = radiograph['url']
        file_name = file_url.split('/')[-1]  # Extract the file name from the URL
        file_name = file_name.split('?')[0]  # Remove any query parameters if present
        file_name = f"radiographs/{file_name}"  # Ensure the file name includes the storage path

        print(f"Deleting image from Supabase storage: {file_name}")
        storage_response = supabase.storage.from_('radiographs').remove([file_name])
        if not storage_response:
            return jsonify({"error": "Failed to delete image from storage"}), 500

        # Delete the metadata from the Radiographs table
        print("Deleting metadata from Supabase database")
        db_response = supabase.table('Radiographs').delete().eq('id', radiograph_id).execute()
        if not db_response.data:
            return jsonify({"error": "Failed to delete radiograph metadata"}), 500

        return jsonify({"message": "Radiograph deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
