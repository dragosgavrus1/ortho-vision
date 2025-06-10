# Ortho-Vision: Dental Anomaly Detection and Chatbot Assistance

Ortho-Vision is an AI-powered application designed to assist dental professionals and patients by detecting dental anomalies in X-rays and providing intelligent chatbot support for treatment planning and patient communication.

## Features

- **Dental Anomaly Detection**: Uses advanced AI models to analyze dental X-rays and identify anomalies such as caries, bone loss, and impacted teeth.
- **Interactive Chatbot**: Provides context-aware responses based on patient reports and chat history.
- **Role-Based Access**: Separate interfaces for doctors and patients, ensuring tailored experiences.
- **Patient Management**: Doctors can manage patient records, upload X-rays, and view detailed reports.
- **Comprehensive Reporting**: Generates detailed reports with visual annotations for better understanding.

## Project Structure

```
app/
  backend/       # Backend code and API endpoints
    app.py       # Main Flask application
    config.py    # Configuration settings
    Dockerfile   # Docker setup for the backend
    models/      # Pre-trained AI models for anomaly detection
    routes/      # API route definitions
  frontend/      # Frontend code for the application
    src/         # Source code for React components and pages
    public/      # Static assets
```

## Technologies Used

### Backend
- **Flask**: Web framework for building the API.
- **YOLO**: AI model for detecting dental anomalies and teeth.
- **Supabase**: Storage and database management.
- **Qdrant**: Vector database for chatbot context.
- **Hugging Face**: Embedding models for chatbot responses.

### Frontend
- **React**: Frontend library for building user interfaces.
- **TypeScript**: Strongly typed JavaScript for better code quality.
- **Tailwind CSS**: Utility-first CSS framework for styling.

## Installation

### Prerequisites
- Docker
- Node.js
- Python 3.10

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd app/backend
   ```
2. Build the Docker image:
   ```bash
   docker build -t ortho-vision-backend .
   ```
3. Run the Docker container:
   ```bash
   docker run -p 5000:5000 ortho-vision-backend
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd app/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Access the application at `http://localhost:3000` for the frontend and `http://localhost:5000` for the backend.
2. Doctors can log in to manage patients, upload X-rays, and view reports.
3. Patients can log in to view their history and interact with the chatbot.

## API Endpoints

### Backend
- **`POST /upload`**: Upload a dental X-ray for anomaly detection.
- **`GET /report`**: Retrieve the latest anomaly detection report.
- **`POST /chat`**: Interact with the chatbot.
- **`GET /radiographs`**: Fetch radiographs for a specific patient.
- **`DELETE /radiographs/<id>`**: Delete a specific radiograph.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- [YOLO](https://github.com/ultralytics/yolov5) for anomaly detection.
- [Hugging Face](https://huggingface.co/) for embedding models.
- [Supabase](https://supabase.com/) for storage and database management.
- [Qdrant](https://qdrant.tech/) for vector search capabilities.
