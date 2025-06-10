import os
from flask import Flask, jsonify, request, send_file
from huggingface_hub import InferenceClient
from flask_cors import CORS
from io import BytesIO
import numpy as np
import cv2
from ultralytics import YOLO
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from langchain_huggingface import HuggingFaceEmbeddings
from sklearn.cluster import KMeans
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

# Initialize Qdrant Client and Vector Store globally
QDRANT_URL = "https://256bc441-1429-429e-9979-0c86a49d523e.eu-central-1-0.aws.cloud.qdrant.io:6333"
QDRANT_API_KEY = "IpyGrMlAtVqguM1ki5Cj2AGq_H-MWPE5l3lRy4co5jx4SrufCwXG1Q"
COLLECTION_NAME = "knowledge_base"
HF_TOKEN = "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"
MODEL = "deepseek-ai/DeepSeek-V3-0324"

client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vector_store = QdrantVectorStore(
    client=client,
    collection_name=COLLECTION_NAME,
    embedding=embeddings,
)

inference_client = InferenceClient(provider="novita", api_key=HF_TOKEN)

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/upload', methods=['POST'])
def upload_image():
    global report_data

    model_anomalies = YOLO('models/anomalies.pt')
    model_teeth = YOLO('models/teeth.pt')

    class_names_anomalies = ['IMP', 'PRR', 'OBT', 'END', 'CAR', 'BON', 'IMT', 'API', 'ROT', 'FUR', 'APS', 'ROR', 'ORD', 'SRD']
    anomaly_full_names = {
        'IMP': 'Implant',
        'PRR': 'Periapical Radiolucency',
        'OBT': 'Obturation',
        'END': 'Endodontic Treatment',
        'CAR': 'Caries',
        'BON': 'Bone Loss',
        'IMT': 'Impacted Tooth',
        'API': 'Apical Periodontitis',
        'ROT': 'Root Rotation',
        'FUR': 'Furcation Involvement',
        'APS': 'Apical Scar',
        'ROR': 'Root Overfilling',
        'ORD': 'Orthodontic Treatment',
        'SRD': 'Surgical Root Debris'
    }

    num_classes_anomalies = len(class_names_anomalies)
    color_map = {i: tuple(np.random.randint(0, 255, 3).tolist()) for i in range(num_classes_anomalies)}

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Read image
        image = np.frombuffer(file.read(), np.uint8)
        decoded_image = cv2.imdecode(image, cv2.IMREAD_COLOR)

        # Inference
        results_anomalies = model_anomalies(decoded_image)
        results_teeth = model_teeth(decoded_image)

        annotated_image = decoded_image.copy()
        report_data = {i: [] for i in range(1, 33)}

        # Step 1: Extract and cluster teeth boxes
        teeth_boxes = []
        for result in results_teeth:
            for bbox in result.boxes.xyxy:
                x1, y1, x2, y2 = map(int, bbox)
                teeth_boxes.append((x1, y1, x2, y2))

        # Cluster teeth: upper/lower
        centers_y = np.array([[(y1 + y2) / 2] for (_, y1, _, y2) in teeth_boxes])
        kmeans = KMeans(n_clusters=2, random_state=0).fit(centers_y)
        labels = kmeans.labels_
        upper_label = 0 if np.mean(centers_y[labels == 0]) < np.mean(centers_y[labels == 1]) else 1
        lower_label = 1 - upper_label

        upper_teeth = sorted([tb for tb, l in zip(teeth_boxes, labels) if l == upper_label], key=lambda b: (b[0] + b[2]) / 2)
        lower_teeth = sorted([tb for tb, l in zip(teeth_boxes, labels) if l == lower_label], key=lambda b: (b[0] + b[2]) / 2)
        sorted_teeth = upper_teeth + lower_teeth
        tooth_number_map = {i + 1: sorted_teeth[i] for i in range(len(sorted_teeth))}

        # Step 2: Process anomaly detections
        for result in results_anomalies:
            for bbox, cls in zip(result.boxes.xyxy, result.boxes.cls):
                x1, y1, x2, y2 = map(int, bbox)
                anomaly_box = (x1, y1, x2, y2)
                class_id = int(cls)
                label = class_names_anomalies[class_id]
                full_name = anomaly_full_names[label]
                color = color_map[class_id]

                def compute_iou(boxA, boxB):
                    ax1, ay1, ax2, ay2 = boxA
                    bx1, by1, bx2, by2 = boxB
                    ix1 = max(ax1, bx1)
                    iy1 = max(ay1, by1)
                    ix2 = min(ax2, bx2)
                    iy2 = min(ay2, by2)
                    iw = max(0, ix2 - ix1)
                    ih = max(0, iy2 - iy1)
                    intersection = iw * ih
                    areaA = (ax2 - ax1) * (ay2 - ay1)
                    areaB = (bx2 - bx1) * (by2 - by1)
                    union = areaA + areaB - intersection
                    return intersection / union if union != 0 else 0

                # Assign anomaly to tooth with highest IoU
                assigned = False
                for tooth_id, tooth_box in tooth_number_map.items():
                    iou = compute_iou(anomaly_box, tooth_box)
                    if iou > 0.05:  # use a relaxed threshold
                        if full_name not in report_data[tooth_id]:
                            report_data[tooth_id].append(full_name)
                        assigned = True

                # Fallback: basic bbox overlap if IoU threshold not met
                if not assigned:
                    for tooth_id, (tx1, ty1, tx2, ty2) in tooth_number_map.items():
                        if not (x2 < tx1 or x1 > tx2 or y2 < ty1 or y1 > ty2):
                            if full_name not in report_data[tooth_id]:
                                report_data[tooth_id].append(full_name)

                # Draw box
                cv2.rectangle(annotated_image, (x1, y1), (x2, y2), color, 2)
                label_text = f"{label}"
                (text_width, text_height), _ = cv2.getTextSize(label_text, cv2.FONT_HERSHEY_SIMPLEX, 1, 2)
                cv2.rectangle(annotated_image, (x1, y1 - text_height - 2), (x1 + text_width, y1), color, -1)
                cv2.putText(annotated_image, label_text, (x1, y1 - 2), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

        _, img_encoded = cv2.imencode('.jpg', annotated_image)
        img_bytes = img_encoded.tobytes()

        return send_file(
            BytesIO(img_bytes),
            mimetype='image/jpeg',
            as_attachment=False,
            download_name='annotated_image.jpg'
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/report', methods=['GET'])
def get_report():
    if report_data is None:
        return jsonify({"error": "No report available. Please upload an image first."}), 404

    return jsonify(report_data)


@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')
    chat_history = request.json.get('history', [])  # Retrieve chat history
    report = request.json.get('report', None)  # Retrieve report if available

    # Construct the prompt with history
    history_context = "\n".join([f"{msg['sender']}: {msg['text']}" for msg in chat_history])
    context_docs = vector_store.similarity_search(user_message, k=3)
    context = "\n\n".join([doc.page_content for doc in context_docs])

    system_prompt = (
        "You are a Dental anomaly expert. Your role is to help people understand dental anomalies and help them with their queries. "
        "You should answer questions related to dental anomalies, treatments, and general dental health. "
        "and provide accurate and helpful answers to their questions. Based on the chat history create a new question, answer it and dont show the question"
        "The report contains information about detected anomalies in the uploaded dental radiograph or in all the radiographs of the patient. Use the report to connect the question with the patiens anomalies. "
        "For example, if the question is about a specific problem like 'What is the treatment for caries?', and the report indicates that caries was detected in tooth 12, you can mention that in your answer. "
        "If the problem does not appear in the report, you can still specify that the problem was not detected in the report. "
        "Keep the answers short and concise. Use the following context to assist:\n\n"
        f"{context}\n\n"
        f"Conversation History:\n{history_context}\n\n"
        f"Question: {user_message}\n\n"
        f"Report: {report}\n\n"
        "Answer:"
    )

    # Generate response using OpenAI
    completion = inference_client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
    )

    return jsonify({"response": completion.choices[0].message.content})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0',port=port,debug=True)
