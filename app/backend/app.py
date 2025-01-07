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
CORS(app)#, resources={r"/*": {"origins": ["http://127.0.0.1:3000"]}})


# Load secret keys from environment variables
app.config.from_object(Config)

# Import blueprints
app.register_blueprint(patient_blueprint)
app.register_blueprint(auth_blueprint)
app.register_blueprint(radiograph_blueprint)

CORS(app)

@app.route('/')
def hello_world():
    return 'Hello World!'

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

if __name__ == '__main__':
    app.run(debug=True)
