from flask import Flask, jsonify, request, send_file
from supabase import create_client, Client
from flask_cors import CORS
from io import BytesIO
import numpy as np
import cv2
from ultralytics import YOLO

from config import Config
from routes.patient_routes import patient_blueprint
from routes.auth_routes import auth_blueprint
from routes.radiograph_routes import radiograph_blueprint

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load secret keys from environment variables
app.config.from_object(Config)

# Import blueprints
app.register_blueprint(patient_blueprint)
app.register_blueprint(auth_blueprint)
app.register_blueprint(radiograph_blueprint)

CORS(app)

# Global variable to store the report
report_data = None

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/upload', methods=['POST'])
def upload_image():
    global report_data

    model_anomalies = YOLO('models/anomalies.pt')
    model_teeth = YOLO('models/teeth.pt')

    class_names_anomalies = ['IMP', 'PRR', 'OBT', 'END', 'CAR', 'BON', 'IMT', 'API', 'ROT', 'FUR', 'APS', 'ROR', 'ORD', 'SRD']
    class_names_teeth = ['Tooth']  # Assuming one class for teeth detection

    num_classes_anomalies = len(class_names_anomalies)
    color_map = {i: tuple(np.random.randint(0, 255, 3).tolist()) for i in range(num_classes_anomalies)}

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Read image from the request
        image = np.frombuffer(file.read(), np.uint8)
        decoded_image = cv2.imdecode(image, cv2.IMREAD_COLOR)

        # Perform inference with both models
        results_anomalies = model_anomalies(decoded_image)
        results_teeth = model_teeth(decoded_image)

        # Prepare to draw bounding boxes
        annotated_image = decoded_image.copy()
        report_data = {i: [] for i in range(1, 33)}  # Initialize report with all 32 teeth

        # Process teeth detections
        teeth_boxes = []
        for result in results_teeth:
            for bbox in result.boxes.xyxy:  # Teeth bounding boxes
                x1, y1, x2, y2 = map(int, bbox)
                teeth_boxes.append((x1, y1, x2, y2))

        # Process anomaly detections and map to teeth
        for result in results_anomalies:
            for bbox, cls in zip(result.boxes.xyxy, result.boxes.cls):
                x1, y1, x2, y2 = map(int, bbox)
                class_id = int(cls)
                color = color_map[class_id]
                label = class_names_anomalies[class_id]

                # Find the teeth this anomaly overlaps with
                overlapping_teeth = []
                for i, (tx1, ty1, tx2, ty2) in enumerate(teeth_boxes):
                    if not (x2 < tx1 or x1 > tx2 or y2 < ty1 or y1 > ty2):
                        overlapping_teeth.append(i + 1)  # Assuming teeth are numbered sequentially

                # Add to report
                for tooth in overlapping_teeth:
                    if label not in report_data[tooth]:
                        report_data[tooth].append(label)

                # Draw anomaly bounding box
                cv2.rectangle(annotated_image, (x1, y1), (x2, y2), color, 2)
                label_text = f"{label}"
                (text_width, text_height), _ = cv2.getTextSize(label_text, cv2.FONT_HERSHEY_SIMPLEX, 1, 2)
                cv2.rectangle(annotated_image, (x1, y1 - text_height - 2), (x1 + text_width, y1), color, -1)
                cv2.putText(annotated_image, label_text, (x1, y1 - 2), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

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

@app.route('/report', methods=['GET'])
def get_report():
    if report_data is None:
        return jsonify({"error": "No report available. Please upload an image first."}), 404

    return jsonify(report_data)

if __name__ == '__main__':
    app.run(debug=True)
