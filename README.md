<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<img align=center width="495" height="494" alt="image" src="https://github.com/user-attachments/assets/6d118565-e581-441d-9f4f-5727ba449f57" />
# Hakim AI
=======
# [Project Title – HAKIM AI]
>>>>>>> 0b9334e (Update README.md)



## Contributors

- Dorsis Girma
- Hiba Khalid
- Sebrina Semir
  
=======
# [Project Title – HAKim AI]
>>>>>>> 0719684 (Update README.md)

<<<<<<< HEAD
=======
## Contributors  
- Dorsis Girma
- Hiba Khalid
- Sebrina Semir
---
>>>>>>> 54f41fe (Update README.md)
=======
# Hakim AI

## Contributors

- Dorsis Girma
- Hiba Khalid
- Sebrina Semir
  
>>>>>>> 3f2b9bf (Update README.md)
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

<<<<<<< HEAD
<<<<<<< HEAD
=======
## Business Model

We will pursue a multi-stream revenue model to ensure sustainability and growth:

- **Freemium for Patients:**  
  A free tier for basic features to drive user acquisition, and a Hakim Plus subscription for advanced AI features and unlimited storage.

- **SaaS for Professionals:**  
  A Professional Pro subscription for individual doctors and an Enterprise License for clinics and hospitals, offering advanced tools and management dashboards.

- **Transactional Revenue:**  
  A commission on telemedicine consultations and referral fees from partnerships with labs and pharmacies.



>>>>>>> 3f2b9bf (Update README.md)
=======
>>>>>>> 630ced9 (Update README.md)
## Tech Stack

- **Frontend:** React / Next.js (for a responsive web app)
- **Backend:** Node.js (Express.js) / Python (Django/FastAPI)
- **Database:** PostgreSQL / MongoDB (for flexible, structured EMR data)
- **AI & Machine Learning:**
<<<<<<< HEAD
  - Primary: ChatGPT OpenAI Service (API) [future: Self-hosted GPT model]
=======
  - Primary: Azure OpenAI Service
>>>>>>> 3f2b9bf (Update README.md)
  - Secondary/Self-Hosted: Python, TensorFlow/PyTorch, Tesseract, Hugging Face (BioBERT)
- **Authentication:** Fayda OIDC Integration
- **Cloud & Deployment:** Docker, AWS / Azure (with a focus on African data centers)
- 
## Hackathon MVP Scope
To demonstrate the core value proposition, our MVP will focus on the complete data loop in a simplified way:
<<<<<<< HEAD

- **Patient Side:**  
  A user logs in with Fayda, manually enters one allergy, and asks the chatbot a question. The chatbot's response will prove it has access to the entered allergy.

- **Professional Side:**  
  A "Doctor" user logs in, sees a sample patient, and uses a simple form to add a new prescription to that patient's record.

- **Closing the Loop:**  
  The patient can then ask the chatbot, "What is my latest prescription?" The chatbot will correctly state the medication entered by the doctor, proving the two-sided connection and the real-time update of the shared medical history.

## Diagram

<img width="1358" height="320" alt="image" src="https://github.com/user-attachments/assets/b2c2c0a6-de65-4c82-ac8b-3bc5b3be3767" />

> 🏁 *This project is being built for the 2025 Fayda Hackathon (July 26 – August 4) under the HealthTech track.*
=======
>>>>>>> 3f2b9bf (Update README.md)

- **Patient Side:**  
  A user logs in with Fayda, manually enters one allergy, and asks the chatbot a question. The chatbot's response will prove it has access to the entered allergy.

- **Professional Side:**  
  A "Doctor" user logs in, sees a sample patient, and uses a simple form to add a new prescription to that patient's record.

- **Closing the Loop:**  
  The patient can then ask the chatbot, "What is my latest prescription?" The chatbot will correctly state the medication entered by the doctor, proving the two-sided connection and the real-time update of the shared medical history.

# 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Get your OpenAI API key:**
   - Go to [OpenAI Platform](https://platform.openai.com/)
   - Sign up or log in to your account
   - Navigate to "API Keys" in your dashboard
   - Click "Create new secret key"
   - Copy the key and paste it in your `.env.local` file

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

# 🧭 Navigation

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

# 🎯 User Roles

## 👤 Patient
- Authentication: Fayda OIDC + Phone OTP verification
- Features: 
  - AI health chat with direct ChatGPT integration
  - Emergency detection and alerts
  - Medical history management
  - Document uploads
  - Medication reminders
  - Video consultations
  - Health device integration

## 👨‍⚕️ Doctor
- Authentication: Email/Password (created by Hospital Admin)
- Features:
  - Access patient data via Fayda ID search
  - View complete medical history
  - Review AI consultation logs
  - Add diagnoses and treatment notes
  - AI-powered drug interaction checks
  - Generate medical reports

## 🏥 Hospital Admin
- Authentication: Email/Password
- Features:
  - Create and manage doctor accounts
  - Monitor hospital activities
  - View analytics and reports
  - Manage hospital resources

## 👑 Super Admin
- Authentication: Email/Password
- Features:
  - System-wide management
  - Hospital and admin oversight
  - Security monitoring
  - Activity logs and analytics

# 🤖 ChatGPT Integration

The patient chat feature uses direct ChatGPT integration for intelligent health assistance:

- Real-time responses from OpenAI's GPT-3.5-turbo model
- Multilingual support (English, Amharic, Afaan Oromo)
- Emergency detection with automatic alerts
- Cultural sensitivity for Ethiopian context
- Fallback mode with intelligent demo responses when API key is not configured

### Demo Mode vs ChatGPT Mode

- Without API Key: Intelligent demo responses for common health questions
- With API Key: Full ChatGPT integration with real-time AI responses

# 🎨 Features

- Modern UI/UX with glass-morphism design
- Light/Dark Mode support across all pages
- Responsive Design for mobile and desktop
- Role-based Access Control
- Multilingual Interface
- Real-time Chat with AI health assistant
- Emergency Detection and alerts
- Medical History Management
- Document Upload System
- Medication Reminders

# 🛠 Tech Stack

- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- UI Components: Shadcn/ui
- Icons: Lucide React
- AI Integration: OpenAI GPT-3.5-turbo
- Authentication: Fayda OIDC (Patients) + Email/Password (Staff)

# 🔧 Configuration

## Environment Variables

| Variable         | Description                          | Required                  |
|------------------|--------------------------------------|---------------------------|
| OPENAI_API_KEY   | OpenAI API key for ChatGPT integration | Yes (for full AI features) |

## Demo Credentials

For testing purposes, you can use these demo credentials:

Doctor Login:
- Email: doctor@hakim.com
- Password: demo123

Hospital Admin Login:
- Email: admin@hakim.com 
- Password: demo123

Super Admin Login:
- Email: superadmin@hakim.com
- Password: demo123

# 🚨 Emergency Features

The system includes emergency detection in chat, with automatic alerts and escalation for critical health situations.
