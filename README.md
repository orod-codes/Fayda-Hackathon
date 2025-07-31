<img align=center width="399" height="393" alt="image" src="https://github.com/user-attachments/assets/072ceced-3ee1-4225-80d8-ab0e5db7b7d3" />

# Hakim AI

## Contributors

- **Dorsis Girma** Email: Girmadorsis@gmail.com
- **Hiba Khalid** Email: khalidhiba42@gmail.com
- **Sebrina Semir** Email: sebrinasemir2445@gmail.com

---

## Project Synopsis

**Hakim AI** is a two-sided digital health platform that connects patients and healthcare professionals through a single, secure, AI-enhanced medical history, controlled by the patient.
### 1. Problem Statement

In Ethiopia, patient medical histories are fragmented, siloed in paper records across various clinics and hospitals. This creates significant challenges:

- **For Patients:**  
  Individuals lack ownership and easy access to their own health information. This disempowers them from actively participating in their healthcare, leads to repetitive medical tests, and poses risks from uncommunicated allergies or conditions.

- **For Healthcare Professionals:**  
  Doctors often work with incomplete information, spending valuable consultation time trying to reconstruct a patient's history. This can lead to diagnostic delays, medication errors, and inefficient, repetitive care.


### 2. Planned Solution

**Hakim AI** is a two-sided digital health platform that connects patients and healthcare professionals through a single, secure, AI-enhanced medical history, controlled by the patient.

#### a. The Patient Experience: An Empowering Health Companion

Patients interact with an AI-powered chatbot that has secure, permissioned access to their verified medical history. This enables:

- **Contextual Health Conversations:**  
  Get safe, personalized answers to health queries that account for their specific allergies and conditions.

- **Proactive Engagement:**  
  Receive AI-driven follow-ups for prescriptions and reminders for check-ups.

- **On-Demand Summaries:**  
  Instantly get plain-language summaries of their conditions, medications, or recent doctor visits.

- **Absolute Data Control:**  
  Patients grant and revoke access to their data to specific, verified professionals using their Fayda ID.

#### b. The Professional Experience: An Efficient & Informed Workflow

Professionals access a secure web portal to view a structured, timeline-based history of patients who have granted them permission. This provides:

- **Continuity of Care:**  
  See a complete, verified picture of a patient's diagnoses, prescriptions, and lab results from all providers.

- **AI-Powered Summarization:**  
  A "Quick Summary" button generates a concise overview of a patient's history, flagging critical information like allergies and chronic conditions to save time.

- **"Smart Upload" Workflow:**  
  A feature to digitize paper prescriptions and lab results using OCR and AI-driven entity extraction, turning unstructured documents into usable, structured data after professional verification.


### 3. Expected Outcome

We aim to create a connected healthcare ecosystem where medical data is secure, portable, and works for both patients and providers. The expected outcomes are:

- **Improved Health Outcomes:**  
  Reduced medical errors and better management of chronic diseases.

- **Empowered Patients:**  
  Patients become active, informed participants in their own healthcare journey.

- **Increased Efficiency:**  
  Doctors save time and resources, allowing them to focus on patient care rather than administrative work.


## Fayda's Role: The Foundation of Trust

Fayda is the cornerstone of the Hakim AI platform, providing the foundational layer of trust and identity.

- **Authentication:**  
  Both patients and healthcare professionals will log in securely using their Fayda-verified digital identity.

- **Verification:**  
  We will leverage Fayda to verify the credentials of healthcare professionals against a national registry. This ensures that only licensed, legitimate doctors can access patient data.

- **Secure Access Control:**  
  A patient grants access to their health record by authorizing a doctor's specific Fayda ID, creating an auditable and secure link between them.

---


### Key Features:
- **Patient-Centric Control:** Patients manage their own health data and grant access to professionals.
- **AI-Powered Chatbot:** Patients can ask questions about their health in natural language and get answers based on their verified medical records.
- **Secure Authentication:** Utilizes Fayda OIDC for patient authentication, ensuring a high level of security and trust.
- **Healthcare Professional Portal:** Doctors and hospital admins have their own secure dashboards to manage patients and view medical histories.
- **Containerized Deployment:** The entire application is containerized with Docker for easy setup and deployment.

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

3.  **Launch with Docker Compose or npm:**
    From the root directory of the project, run the following command:
    ```bash
    docker-compose up --build
    ```
    This command will build the images for both the frontend and backend services and start the application.
    Alternatively use 
    ```bash
    npm install
    npm run dev
    ```

5.  **Access the Application:**
    * The frontend will be available at [http://localhost:3000](http://localhost:3000).
    * The backend API will be running on `http://localhost:3001`.
    * A health check endpoint is available at `http://localhost:3001/api/health`.

# Navigation

| Page                | Path                   | Description                        |
|---------------------|------------------------|-------------------------------------|
| Landing             | `/`                    | Main landing page (role selection)  |
| Patient Dashboard   | `/patient`             | Patient dashboard                   |
| Patient Login       | `/patient/login`       | Patient login (Fayda + OTP)         |
| Doctor Dashboard    | `/doctor`              | Doctor dashboard                    |
| Doctor Login        | `/doctor/login`        | Doctor login                        |
| Hospital Admin      | `/hospital-admin`      | Hospital admin dashboard            |
| Hospital Admin Login| `/hospital-admin/login`| Hospital admin login                |
| Super Admin         | `/super-admin`         | Super admin dashboard               |
| Super Admin Login   | `/super-admin/login`   | Super admin login                   |
| AI Health Chat      | `/chat`                | AI health chat (patients only)      |


## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** In-memory JSON database (for demo purposes)
- **AI:** OpenAI GPT-3.5-Turbo
- **Authentication:** Fayda OIDC
- **Deployment:** Docker, Docker Compose


## Diagram

<img width="1358" height="320" alt="image" src="https://github.com/user-attachments/assets/b2c2c0a6-de65-4c82-ac8b-3bc5b3be3767" />

## Architectural & Strategic Decisions

### Data & AI Strategy: Privacy First

Handling sensitive health data requires a privacy-first approach. Our strategy is twofold:

- **Primary Strategy (Zero Data Retention):**  
  We plan to use a service like Microsoft's Azure OpenAI Service. This gives us access to powerful models (like GPT-4) while allowing us to configure zero data retention. This means prompts and responses are not stored on third-party servers, which is critical for complying with Ethiopia's Personal Data Protection Proclamation (No. 1321/2024).

- **Long-Term Strategy (Data Sovereignty):**  
  For maximum security and data sovereignty, we will architect our system to eventually accommodate self-hosted open-source models. This involves running models like Tesseract (for OCR) and BioBERT (for medical NLP) on our own local or in-country servers, ensuring sensitive data never leaves our controlled environment.

- **Prompt & Response Engineering:**  
  All AI interactions will be managed by our backend. We will use the Retrieval-Augmented Generation (RAG) pattern to feed the AI with minimal, relevant, and de-identified data. We will also engineer and filter AI responses to ensure safety and accuracy before they are displayed to the user.

### Data Integrity & EMR

- **Hakim AI as an EMR:**  
  We are building our own secure, cloud-based Electronic Medical Record (EMR) system to store all user data. Fayda will be used for identity, not for storing clinical data.

- **Data Verification:**  
  To prevent false information, our EMR will differentiate between patient-reported data (marked as unverified) and professionally-verified data. Doctors will have the ability to review and verify patient-reported information, creating a trusted and reliable medical history.


---


## References and Additional Resources

For developers interested in understanding more about Fayda OIDC integration, please refer to these official repositories:

- **[OIDC Test App](https://github.com/National-ID-Program-Ethiopia/oidc-test-app)**: A JavaScript-based example showing how to implement the OIDC flow with React frontend and Express backend.
- **[OIDC Project](https://github.com/National-ID-Program-Ethiopia/oidc-project)**: A Django-based proof of concept for OIDC integration.

These repositories provide valuable examples and patterns that informed the implementation of our Fayda integration.
