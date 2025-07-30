<img align=center width="495" height="494" alt="image" src="https://github.com/user-attachments/assets/6d118565-e581-441d-9f4f-5727ba449f57" />

# Hakim AI


## Contributors

- Dorsis Girma
- Hiba Khalid
- Sebrina Semir
  
## Project Synopsis

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

## Tech Stack

- **Frontend:** React / Next.js (for a responsive web app)
- **Backend:** Node.js (Express.js) / Python (Django/FastAPI)
- **Database:** PostgreSQL / MongoDB (for flexible, structured EMR data)
- **AI & Machine Learning:**
  - Primary: ChatGPT OpenAI Service (API) [future: Self-hosted GPT model]
  - Secondary/Self-Hosted: Python, TensorFlow/PyTorch, Tesseract, Hugging Face (BioBERT)
- **Authentication:** Fayda OIDC Integration
- **Cloud & Deployment:** Docker, AWS / Azure (with a focus on African data centers)
- 
## Hackathon MVP Scope
To demonstrate the core value proposition, our MVP will focus on the complete data loop in a simplified way:

- **Patient Side:**  
  A user logs in with Fayda, manually enters one allergy, and asks the chatbot a question. The chatbot's response will prove it has access to the entered allergy.

- **Professional Side:**  
  A "Doctor" user logs in, sees a sample patient, and uses a simple form to add a new prescription to that patient's record.

- **Closing the Loop:**  
  The patient can then ask the chatbot, "What is my latest prescription?" The chatbot will correctly state the medication entered by the doctor, proving the two-sided connection and the real-time update of the shared medical history.

## Diagram

<img width="1358" height="320" alt="image" src="https://github.com/user-attachments/assets/b2c2c0a6-de65-4c82-ac8b-3bc5b3be3767" />

> 🏁 *This project is being built for the 2025 Fayda Hackathon (July 26 – August 4) under the HealthTech track.*
