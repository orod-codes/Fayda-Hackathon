# HAKIM AI - MEDITRON Service with Translation Pipeline

This service provides MEDITRON-7B model with Amharic and Afaan Oromo translation support using NLLB-200.

## Setup Instructions

### Prerequisites
- Python 3.9+
- GPU recommended (but can run on CPU for testing)

### Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

### Running the Service

Start the Flask server:
```bash
python app.py
```

The service will be available at `http://localhost:5000`

### API Endpoints

#### POST /translate-chat
Translates user input from Amharic/Oromo to English, processes with MEDITRON, and translates back.

**Request Body:**
```json
{
  "message": "Your message in Amharic or Oromo",
  "src_lang": "amh" // or "gaz" for Oromo
}
```

**Response:**
```json
{
  "response": "Translated medical response in source language"
}
```

### Language Codes
- Amharic: "amh"
- Afaan Oromo: "gaz"

### Performance Notes
- First load will be slow as models are downloaded (~3-5GB total)
- GPU recommended for reasonable response times
- CPU-only mode will be very slow but functional
