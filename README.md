
# Hakim AI

> 🏁 *This project is being built for the 2025 Fayda Hackathon (July 26 – August 4) under the HealthTech track.*

---

## Contributors

- Dorsis Girma
- Hiba Khalid
- Sebrina Semir

---

## Project Synopsis

Hakim AI is a two-sided digital health platform that connects patients and healthcare professionals through a single, secure, AI-enhanced medical history, controlled by the patient.

---

## Key Features

- Patient-Centric Control: Patients manage their own health data and grant access to professionals.
- AI-Powered Chatbot: Patients can ask questions about their health in natural language and get answers based on their verified medical records.
- Secure Authentication: Utilizes Fayda OIDC for patient authentication, ensuring a high level of security and trust.
- Healthcare Professional Portal: Doctors and hospital admins have their own secure dashboards to manage patients and view medical histories.
- Containerized Deployment: The entire application is containerized with Docker for easy setup and deployment.

---

## Installation and Deployment

This project is fully containerized, allowing for a simple, one-command setup.

### Prerequisites
- Docker
- Docker Compose

### Running the App Locally

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/orod-codes/HAKIM-AI.git
    cd HAKIM-AI
    ```

2.  **Create and Configure Environment File:**
    First, copy the example environment file:
    ```bash
    cp backend/.env.example backend/.env
    ```
    Next, open `backend/.env` and add the following credentials:

    *   **Fayda Credentials (`CLIENT_ID`, `PRIVATE_KEY`):**
        *   These credentials are provided by the **Fayda eSignet hackathon organizers**. Please refer to your registration materials or contact the event organizers to obtain them.

    *   **OpenAI API Key (`OPENAI_API_KEY`):**
        1.  Go to [https://platform.openai.com/](https://platform.openai.com/) and log in or create an account.
        2.  Navigate to the **API Keys** section.
        3.  Click **"Create new secret key"** and copy the key into the `.env` file.

    *   **Session Secret (`SESSION_SECRET`):**
        *   This is a secret you create. Generate a long, random, and unpredictable string (at least 32 characters) and paste it here. You can use a password generator for this.

3.  **Launch with Docker Compose:**
    From the root directory of the project, run the following command:
    ```bash
    docker-compose up --build
    ```
    This command will build the images for both the frontend and backend services and start the application.

4.  **Access the Application:**
    * The frontend will be available at [http://localhost:3000](http://localhost:3000).
    * The backend API will be running on `http://localhost:3001`.
    * A health check endpoint is available at `http://localhost:3001/api/health`.

---

## Demo Walk-through Script

**Patient Flow:**
1.  Navigate to `http://localhost:3000`.
2.  Click the "Patient" card to initiate the Fayda login process.
3.  Complete the authentication on the Fayda platform.
4.  You will be redirected to the patient dashboard.
5.  Ask the chatbot: "What are my allergies?". It should respond with "Peanuts".
6.  Add a new allergy, for example, "Aspirin".
7.  Ask the chatbot again: "What are my allergies?". It should now list both "Peanuts" and "Aspirin".

**Professional Flow (Simulated):**
1.  Use an API client (like Postman or curl) to simulate a doctor adding a prescription to the patient's record. You will need to get the `hakim.sid` cookie from your browser's developer tools (from the patient's logged-in session) and include it in the request.
    ```bash
    curl -X POST http://localhost:3001/api/professional/prescription \
    -H "Content-Type: application/json" \
    -H "Cookie: hakim.sid=<YOUR_SESSION_COOKIE>" \
    -d '{
      "patientId": "FAYDA_ID_FOR_PATIENT_1",
      "prescription": "Amoxicillin 500mg",
      "medication": "Amoxicillin",
      "dosage": "500mg every 8 hours",
      "instructions": "Take with food for 7 days"
    }'
    ```
2.  The patient can then ask the chatbot, "What is my latest prescription?" to see the newly added medication.

---

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** In-memory JSON database (for demo purposes)
- **AI:** OpenAI GPT-3.5-Turbo
- **Authentication:** Fayda OIDC
- **Deployment:** Docker, Docker Compose

---

## References and Additional Resources

For developers interested in understanding more about Fayda OIDC integration, please refer to these official repositories:

- **[OIDC Test App](https://github.com/National-ID-Program-Ethiopia/oidc-test-app)**: A JavaScript-based example showing how to implement the OIDC flow with React frontend and Express backend.
- **[OIDC Project](https://github.com/National-ID-Program-Ethiopia/oidc-project)**: A Django-based proof of concept for OIDC integration.

These repositories provide valuable examples and patterns that informed the implementation of our Fayda integration.
