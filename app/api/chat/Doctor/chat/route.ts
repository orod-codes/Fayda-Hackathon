import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
	try {
		const { message, chatType, language = 'en' } = await request.json();

		// Demo responses for different chat types
		const demoResponses = {
			diagnosis: {
				en: {
					"fever": "Based on the symptoms described, consider these differential diagnoses: 1) Viral infection (most common), 2) Bacterial infection, 3) Inflammatory conditions. Key questions: Duration of fever? Associated symptoms? Recent travel? Recommend: Complete blood count, CRP, and clinical assessment.",
					"chest pain": "Chest pain requires immediate evaluation. Consider: 1) Acute coronary syndrome, 2) Pulmonary embolism, 3) Aortic dissection, 4) Pneumonia. Emergency signs: Shortness of breath, radiating pain, diaphoresis. Immediate ECG and troponin recommended.",
					"headache": "Headache evaluation: 1) Primary (migraine, tension), 2) Secondary (infection, vascular). Red flags: Sudden onset, fever, focal deficits. Consider: CT if red flags, migraine prophylaxis if recurrent.",
					"abdominal pain": "Abdominal pain assessment: Location guides diagnosis. RLQ pain suggests appendicitis, epigastric suggests gastritis/ulcer, RUQ suggests cholecystitis. Consider: CBC, imaging, surgical consult if severe.",
					default: "For accurate diagnosis, please provide: 1) Symptom duration, 2) Associated symptoms, 3) Medical history, 4) Physical exam findings. Consider appropriate lab work and imaging based on clinical suspicion."
				},
				am: {
					"የሰውነት ሙቀት": "በተገለጸው ምልክቶች ላይ የተመሰረተ፡ 1) የቫይረስ ኢንፌክሽን (በጣም የተለመደ)፣ 2) የባክቴሪያ ኢንፌክሽን፣ 3) የመብጠል ሁኔታዎች። ዋና ጥያቄዎች፡ የሙቀት ቆይታ? የተያያዙ ምልክቶች? የቅርብ ጊዜ ጉዞ? የሚመከር፡ ሙሉ የደም ቆጠራ፣ CRP፣ እና የክሊኒክ ግምገማ።",
					"የደረት ህመም": "የደረት ህመም ወቅታዊ ግምገማ ያስፈልጋል። አስቡ፡ 1) አካዊ ኮሮናሪ ሲንድሮም፣ 2) የፕላስቲካ ኢምቦሊዝም፣ 3) የኦርቲክ ዲሴክሽን፣ 4) የሳንባ በሽታ። የአደጋ ምልክቶች፡ የመተንፈስ ችግር፣ የሚያሰራጭ ህመም፣ ድርቀት። ወቅታዊ ECG እና troponin የሚመከር።",
					default: "ለትክክለኛ ምርመራ፣ እባክዎ ያቅርቡ፡ 1) የምልክቶች ቆይታ፣ 2) የተያያዙ ምልክቶች፣ 3) የሕክምና ታሪክ፣ 4) የአካል ምርመራ ውጤቶች። በክሊኒክ ግምት ላይ የተመሰረተ ተገቢውን የላብ ስራ እና ምስል አስቡ።"
				}
			},
			treatment: {
				en: {
					"hypertension": "Hypertension management: 1) Lifestyle modifications (DASH diet, exercise, salt reduction), 2) First-line medications: ACE inhibitors, ARBs, CCBs, or thiazide diuretics. Target BP <130/80 mmHg. Monitor electrolytes and renal function.",
					"diabetes": "Diabetes management: 1) Lifestyle changes (diet, exercise), 2) Metformin first-line, 3) Add sulfonylurea, DPP-4 inhibitor, or SGLT2 inhibitor if needed. Target HbA1c <7%. Monitor for complications.",
					"pneumonia": "Community-acquired pneumonia treatment: 1) Amoxicillin-clavulanate or doxycycline for mild cases, 2) Add macrolide for atypical coverage, 3) Consider hospitalization if CURB-65 score ≥3. Duration: 5-7 days.",
					default: "Treatment recommendations require: 1) Accurate diagnosis, 2) Patient factors (age, comorbidities), 3) Local resistance patterns. Always consider: efficacy, safety, cost, and patient preferences."
				},
				am: {
					"የደም ግፊት": "የደም ግፊት አስተዳደር፡ 1) የሕይወት ዘመን ለውጦች (DASH ምግብ፣ የአካል ብቃት፣ የጨው መቀነስ)፣ 2) የመጀመሪያ መስመር መድሃኒቶች፡ ACE inhibitors፣ ARBs፣ CCBs፣ ወይም thiazide diuretics። ዓላማ BP <130/80 mmHg። የ electrolytes እና የኩላሊት ስራ ያስተግብሩ።",
					default: "የሕክምና ምክሮች ያስፈልጋሉ፡ 1) ትክክለኛ ምርመራ፣ 2) የታካሚ ሁኔታዎች (ዕድሜ፣ comorbidities)፣ 3) የአካባቢ መቋቋም ቅንብሮች። ሁልጊዜ አስቡ፡ ውጤታማነት፣ ጥብኝነት፣ ወጪ፣ እና የታካሚ ምርጫዎች።"
				}
			},
			literature: {
				en: {
					"covid": "Recent COVID-19 research highlights: 1) Long-term effects (Long COVID) affect 10-30% of patients, 2) Vaccination reduces severe outcomes by 90%, 3) New variants show increased transmissibility. Key studies: NEJM 2023, Lancet 2024.",
					"hypertension": "Latest hypertension guidelines (2024): 1) Lower BP targets for high-risk patients, 2) SGLT2 inhibitors show renal protection, 3) Home BP monitoring improves outcomes. Sources: AHA/ACC Guidelines, ESC Guidelines.",
					"diabetes": "Diabetes research updates: 1) GLP-1 agonists show cardiovascular benefits, 2) SGLT2 inhibitors reduce heart failure risk, 3) Precision medicine approaches emerging. Key journals: Diabetes Care, NEJM, Lancet Diabetes & Endocrinology.",
					default: "For current medical literature, consult: 1) PubMed/MEDLINE, 2) Cochrane Reviews, 3) UpToDate, 4) NEJM, Lancet, JAMA. Always verify with peer-reviewed sources and consider publication dates."
				},
				am: {
					"covid": "የቅርብ ጊዜ COVID-19 ምርምር ያሳያል፡ 1) የረጅም ጊዜ ውጤቶች (Long COVID) 10-30% ታካሚዎችን ያጎላሉ፣ 2) ክትባት 90% የተለያዩ ውጤቶችን ያሳካርማል፣ 3) አዲስ variants የመገናኛ አቅም ጭማሪ ያሳያሉ። ዋና ጥናቶች፡ NEJM 2023፣ Lancet 2024።",
					default: "ለአሁን የሕክምና ጽሑፎች፣ ያነጋግሩ፡ 1) PubMed/MEDLINE፣ 2) Cochrane Reviews፣ 3) UpToDate፣ 4) NEJM፣ Lancet፣ JAMA። ሁልጊዜ ከ peer-reviewed ምንጮች ጋር ያረጋግጡ እና የፕራቢኬሽን ቀኖችን ያስቡ።"
				}
			},
			consultation: {
				en: {
					"emergency": "EMERGENCY PROTOCOL: 1) Assess ABCs (Airway, Breathing, Circulation), 2) Call emergency services immediately, 3) Begin basic life support if needed, 4) Document vital signs and interventions. Time is critical.",
					"drug interaction": "Drug interaction check: 1) Use reliable databases (Lexicomp, Micromedex), 2) Check for CYP450 interactions, 3) Monitor for adverse effects, 4) Consider alternative medications if high risk. Always verify with pharmacy.",
					"referral": "Referral guidelines: 1) Document clinical reasoning, 2) Include relevant test results, 3) Specify urgency level, 4) Provide patient contact information. Follow local referral protocols and insurance requirements.",
					default: "Quick consultation requires: 1) Clear clinical question, 2) Relevant patient data, 3) Urgency assessment. For emergencies, call 911 immediately. For routine questions, consider scheduled consultation."
				},
				am: {
					"emergency": "የአደጋ ፕሮቶኮል፡ 1) ABCs ያስገምግሙ (Airway, Breathing, Circulation)፣ 2) ወዲያውኑ የአደጋ ጊዜ አገልግሎቶችን ይደውሉ፣ 3) አስፈላጊ ከሆነ መሰረታዊ የሕይወት እርዳታ ይጀምሩ፣ 4) የሕይወት ምልክቶችን እና ጣልቃገብነቶችን ያስቀምጡ። ጊዜ ወሳኝ ነው።",
					default: "ፈጣን ምክክር ያስፈልጋል፡ 1) ግልጽ የክሊኒክ ጥያቄ፣ 2) ተዛማጅ የታካሚ መረጃ፣ 3) የአደጋ ግምገማ። ለአደጋዎች፣ ወዲያውኑ 911 ይደውሉ። ለመደበኛ ጥያቄዎች፣ የተዘጋጁ ምክክሮችን ያስቡ።"
				}
			}
		};

		// Get responses for the specific chat type and language
		const chatTypeResponses = demoResponses[chatType as keyof typeof demoResponses];
		if (!chatTypeResponses) {
			return NextResponse.json({
				message: "Invalid chat type. Please select a valid consultation type.",
				timestamp: new Date().toISOString(),
			});
		}

		const languageResponses = chatTypeResponses[language as keyof typeof chatTypeResponses] || chatTypeResponses.en;
		const lowerMessage = message.toLowerCase();

		// Find matching response
		let response = languageResponses.default;
		for (const [key, value] of Object.entries(languageResponses)) {
			if (key !== 'default' && lowerMessage.includes(key.toLowerCase())) {
				response = value;
				break;
			}
		}

		// Check for emergency keywords
		const emergencyKeywords = [
			"emergency", "chest pain", "heart attack", "stroke", "unconscious", "bleeding",
			"የደረት ህመም", "የልብ ምት", "የስትሮክ", "ስሜት አለመስማት", "ደም መፍሰስ", "አደጋ"
		];

		const isEmergency = emergencyKeywords.some((keyword) =>
			lowerMessage.includes(keyword.toLowerCase())
		);

		return NextResponse.json({
			message: response,
			isEmergency,
			timestamp: new Date().toISOString(),
		});

	} catch (error) {
		console.error("Doctor Chat API error:", error);

		return NextResponse.json({
			message: "I apologize, but I'm currently unable to process your request. Please try again later or consult with a colleague for immediate assistance.",
			isEmergency: false,
			timestamp: new Date().toISOString(),
		});
	}
}