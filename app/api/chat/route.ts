import { NextRequest, NextResponse } from "next/server";
import { getUserInfo } from "../../../lib/auth";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
	try {
		const reqHeaders = headers();
		const authHeader = reqHeaders.get("Authorization");
		const token = authHeader?.split(" ")[1];
		
		// Try to get user info, but don't fail if it doesn't work
		let userInfo = null;
		try {
			if (token && typeof token === 'string') {
				userInfo = await getUserInfo(token);
			}
		} catch (error) {
			console.log("Authentication failed, continuing with demo mode:", error);
		}

		const { message, language } = await request.json();

		// Fallback response if ChatGPT is unavailable
		const fallbackResponses = {
			en: "I apologize, but I'm currently unable to process your request. Please try again later or contact a healthcare professional for immediate assistance.",
			am: "ይቅርታ፣ አሁን ጥያቄዎን ማስተካከል አልቻልኩም። እባክዎ በኋላ ዳግም ይሞክሩ ወይም ወቅታዊ እርዳታ ለማግኘት የጤና ባለሙያ ያነጋግሩ።",
			or: "Dhiifama, amma gaaffii keessan sirreessuu hin dandeenye. Maaloo booda yaali yookiin gargaarsa dhiyeessaa argachuuf gorsaa fayyaa waliin walqunnamaa.",
		};

		// Check if OpenAI API key is configured - force demo mode for now
		if (true) { // !process.env.OPENAI_API_KEY) {
			// Provide helpful demo responses when API key is not configured
			const demoResponses = {
				en: {
					hello:
						"Hello! I'm Hakmin, your AI health assistant. I'm here to help you with health-related questions. How can I assist you today?",
					hi: "Hi there! I'm Hakmin, your AI health assistant. How can I help you today?",
					"how are you":
						"I'm doing well, thank you for asking! I'm here to help you with any health-related questions you might have. I can assist with:\n\n🏥 **Health Topics**:\n• Symptom analysis and possible causes\n• Information about medical conditions\n• Medication guidance and interactions\n• Wellness tips and preventive care\n• Emergency symptom recognition\n\n💬 **How to Use Me**:\n• Describe your symptoms in detail\n• Ask about specific health concerns\n• Get information about medications\n• Learn about preventive care\n• Understand when to seek medical help\n\nWhat health topic would you like to discuss today?",
					headache:
						"I understand you're experiencing a headache. Let me help you understand what might be causing it:\n\n🤕 **Types of Headaches**:\n• **Tension headache**: Pressure around head, stress-related\n• **Migraine**: One-sided, throbbing, with nausea/sensitivity\n• **Cluster headache**: Severe, one-sided, around eye\n• **Sinus headache**: Pressure around eyes/nose\n• **Caffeine withdrawal**: From stopping caffeine\n\n🔍 **Common Triggers**:\n• Stress, anxiety\n• Dehydration\n• Poor sleep\n• Eye strain\n• Hormonal changes\n• Certain foods\n\n💊 **Home Remedies**:\n• Rest in dark, quiet room\n• Cold/hot compress\n• Hydration\n• Over-the-counter pain relievers\n• Relaxation techniques\n\n⚠️ **Seek Care If**:\n• Worst headache of your life\n• Headache with fever/stiff neck\n• Headache with confusion/weakness\n• Headache after head injury\n\nWhere exactly is your headache located?",
					"head pain":
						"I understand you're experiencing head pain. Let me help you understand what might be causing it:\n\n🤕 **Types of Head Pain**:\n• **Tension headache**: Pressure around head, stress-related\n• **Migraine**: One-sided, throbbing, with nausea/sensitivity\n• **Cluster headache**: Severe, one-sided, around eye\n• **Sinus headache**: Pressure around eyes/nose\n• **Caffeine withdrawal**: From stopping caffeine\n\n🔍 **Common Triggers**:\n• Stress, anxiety\n• Dehydration\n• Poor sleep\n• Eye strain\n• Hormonal changes\n• Certain foods\n\n💊 **Home Remedies**:\n• Rest in dark, quiet room\n• Cold/hot compress\n• Hydration\n• Over-the-counter pain relievers\n• Relaxation techniques\n\n⚠️ **Seek Care If**:\n• Worst headache of your life\n• Headache with fever/stiff neck\n• Headache with confusion/weakness\n• Headache after head injury\n\nWhere exactly is your head pain located?",
					fever:
						"I understand you have a fever. Let me help you understand what this means:\n\n🌡️ **Fever Levels**:\n• **Low-grade**: 99-100.4°F (37.2-38°C)\n• **Moderate**: 100.4-102.2°F (38-39°C)\n• **High**: 102.2-104°F (39-40°C)\n• **Very high**: >104°F (>40°C)\n\n🔍 **Common Causes**:\n• **Viral infections**: Cold, flu, COVID-19\n• **Bacterial infections**: Strep throat, UTI\n• **Inflammatory conditions**: Autoimmune diseases\n• **Medications**: Side effects\n• **Heat exhaustion**: From overheating\n\n💊 **Home Care**:\n• Rest and fluids\n• Light clothing\n• Lukewarm bath\n• Acetaminophen/ibuprofen\n• Monitor temperature\n\n⚠️ **Seek Care If**:\n• Fever >103°F (>39.4°C)\n• Fever with severe symptoms\n• Fever lasting >3 days\n• Fever with rash\n\nWhat's your temperature reading?",
					temperature:
						"I understand you have an elevated temperature. Let me help you understand what this means:\n\n🌡️ **Temperature Levels**:\n• **Normal**: 97-99°F (36.1-37.2°C)\n• **Low-grade fever**: 99-100.4°F (37.2-38°C)\n• **Moderate fever**: 100.4-102.2°F (38-39°C)\n• **High fever**: 102.2-104°F (39-40°C)\n• **Very high**: >104°F (>40°C)\n\n🔍 **Common Causes**:\n• **Viral infections**: Cold, flu, COVID-19\n• **Bacterial infections**: Strep throat, UTI\n• **Inflammatory conditions**: Autoimmune diseases\n• **Medications**: Side effects\n• **Heat exhaustion**: From overheating\n\n💊 **Home Care**:\n• Rest and fluids\n• Light clothing\n• Lukewarm bath\n• Acetaminophen/ibuprofen\n• Monitor temperature\n\n⚠️ **Seek Care If**:\n• Temperature >103°F (>39.4°C)\n• High temp with severe symptoms\n• Temp lasting >3 days\n• Temp with rash\n\nWhat's your temperature reading?",
					"chest pain":
						"🚨 **CHEST PAIN - POTENTIAL EMERGENCY**\n\nChest pain can indicate serious conditions:\n\n💔 **Heart Attack Signs**:\n• Pain/pressure in center of chest\n• Pain radiating to arm, jaw, back\n• Shortness of breath, sweating\n• Nausea, lightheadedness\n\n🫁 **Other Causes**:\n• Angina, pulmonary embolism\n• Pneumonia, pleurisy\n• Acid reflux, muscle strain\n\n⚠️ **EMERGENCY**: If you have chest pain with:\n• Shortness of breath\n• Sweating\n• Pain radiating to arm/jaw\n• Nausea or dizziness\n\n**CALL 911 IMMEDIATELY**\n\nAre you experiencing any of these emergency symptoms?",
					stomach:
						"I understand you're having stomach issues. Let me help you understand what might be going on:\n\n🤢 **Common Stomach Problems**:\n• **Gastritis**: Burning pain, nausea\n• **Food poisoning**: Diarrhea, vomiting, fever\n• **Ulcers**: Burning pain, worse when hungry\n• **IBS**: Cramping, bloating, diarrhea/constipation\n• **Appendicitis**: Right lower pain, nausea, fever\n\n📍 **Location Matters**:\n• Upper right: Gallbladder, liver\n• Upper left: Stomach, spleen\n• Lower right: Appendix, colon\n• Lower left: Colon, ovary\n\n⚠️ **Seek Care If**:\n• Severe pain\n• Blood in stool\n• Fever with pain\n• Pain lasting >24 hours\n\nWhere exactly is your pain located?",
					nausea:
						"I understand you're feeling nauseous. Here's what could be causing it:\n\n🤢 **Common Causes**:\n• **Viral gastroenteritis**: Stomach flu\n• **Food poisoning**: From contaminated food\n• **Motion sickness**: Travel-related\n• **Pregnancy**: Morning sickness\n• **Medications**: Side effects\n• **Anxiety**: Stress-related\n\n💊 **Home Remedies**:\n• Small, frequent meals\n• Clear fluids (ginger tea, broth)\n• Rest in cool environment\n• Avoid strong smells\n\n⚠️ **Seek Care If**:\n• Severe dehydration\n• Blood in vomit\n• Severe abdominal pain\n• Fever >101°F\n\nHow long have you been nauseous?",
					vomiting:
						"I understand you're vomiting. Here's what you should know:\n\n🤮 **Common Causes**:\n• **Viral infection**: Most common cause\n• **Food poisoning**: From bacteria/toxins\n• **Migraine**: Can cause vomiting\n• **Pregnancy**: Morning sickness\n• **Medications**: Side effects\n\n💧 **Dehydration Signs**:\n• Dry mouth, thirst\n• Dark urine\n• Dizziness\n• Fatigue\n\n🏠 **Home Care**:\n• Small sips of clear fluids\n• Rest\n• Avoid solid foods initially\n• Gradually reintroduce bland foods\n\n⚠️ **Seek Care If**:\n• Severe dehydration\n• Blood in vomit\n• Severe abdominal pain\n• Fever >101°F\n\nAre you able to keep fluids down?",
					cough:
						"I understand you have a cough. Let me help you understand what might be causing it:\n\n🤧 **Types of Cough**:\n• **Dry cough**: Tickling sensation, no mucus\n• **Wet cough**: Produces mucus/phlegm\n• **Barking cough**: Croup-like sound\n• **Whooping cough**: Paroxysmal coughing fits\n\n🔍 **Common Causes**:\n• **Viral infections**: Cold, flu, COVID-19\n• **Allergies**: Seasonal, environmental\n• **Asthma**: Wheezing, chest tightness\n• **GERD**: Acid reflux\n• **Post-nasal drip**: From sinus issues\n\n💊 **Home Remedies**:\n• Honey (for adults)\n• Steam inhalation\n• Humidifier\n• Rest and fluids\n• Over-the-counter cough suppressants\n\n⚠️ **Seek Care If**:\n• Difficulty breathing\n• Chest pain\n• Coughing up blood\n• Fever >101°F\n• Cough lasting >3 weeks\n\nIs your cough dry or productive (bringing up mucus)?",
					cold: "I understand you have a cold. Here's what you should know:\n\n🤧 **Common Symptoms**: Runny nose, sore throat, cough, congestion, mild fever\n⏰ **Duration**: Usually 7-10 days\n💊 **Treatment**: Rest, fluids, over-the-counter medications (decongestants, pain relievers)\n🏠 **Home Care**: Steam inhalation, saltwater gargle, honey for cough\n⚠️ **When to See Doctor**: High fever (>103°F), severe symptoms, or symptoms lasting >10 days\n\nHow long have you been experiencing symptoms?",
					flu: "I understand you have flu-like symptoms. Here's what you should know:\n\n🤒 **Flu Symptoms**: High fever, body aches, fatigue, headache, dry cough\n⏰ **Duration**: 1-2 weeks\n💊 **Treatment**: Rest, fluids, antiviral medications (if caught early)\n🏠 **Home Care**: Fever management, pain relievers, plenty of rest\n⚠️ **When to Seek Care**: Difficulty breathing, persistent chest pain, severe muscle pain\n\nAre you experiencing any of these severe symptoms?",
					emergency:
						"🚨 EMERGENCY DETECTED! This sounds like a medical emergency. Please call emergency services immediately at 911 or your local emergency number. Do not wait for further advice.",
					help: "I'm here to help! I can assist you with:\n\n🔍 **Symptom Analysis**: Describe your symptoms and I'll help you understand possible causes\n🏥 **Health Information**: Get information about conditions, treatments, and medications\n💊 **Medication Guidance**: Learn about drug interactions, side effects, and usage\n🏃 **Wellness Tips**: Get advice on diet, exercise, and preventive care\n🚨 **Emergency Guidance**: Recognize when to seek immediate medical attention\n\n**Popular Topics**:\n• Headaches and migraines\n• Fever and infections\n• Stomach problems\n• Respiratory issues\n• Pain management\n• Medication questions\n• Wellness and prevention\n\nWhat specific health question do you have?",
					"what can you do":
						"I'm Hakmin, your AI health assistant! I can help you with:\n\n🔍 **Symptom Analysis**: Describe your symptoms and I'll help you understand possible causes\n🏥 **Health Information**: Get information about conditions, treatments, and medications\n💊 **Medication Guidance**: Learn about drug interactions, side effects, and usage\n🏃 **Wellness Tips**: Get advice on diet, exercise, and preventive care\n🚨 **Emergency Guidance**: Recognize when to seek immediate medical attention\n🌍 **Multi-language Support**: I can respond in English, Amharic, and Afaan Oromo\n\nWhat health topic would you like to explore?",
					default:
						"I'm here to help you with your health questions! I can provide information about symptoms, conditions, medications, wellness tips, and general health guidance. What specific health topic would you like to discuss? For example, you can ask me about:\n\n• Symptoms and their possible causes\n• General health advice and wellness tips\n• Information about common conditions\n• Medication questions\n• Preventive care recommendations\n\nWhat would you like to know about?",
				},
				am: {
					ሰላም: "ሰላም! እኔ ሃክሚን ነኝ፣ የእርስዎ AI ጤና አማካሪ። ዛሬ እንዴት ልረዳዎት እችላለሁ?",
					ሰላምታ: "ሰላምታ! እኔ ሃክሚን ነኝ፣ የእርስዎ AI ጤና አማካሪ። ዛሬ እንዴት ልረዳዎት እችላለሁ?",
					"እንደምን አለህ":
						"ደህና ነኝ፣ አመሰግናለሁ! እኔ እዚህ እለያለሁ የጤና ጥያቄዎችዎን ለመመለስ። ምን ማወቅ ይፈልጋሉ?",
					"ራስ ማሳዘን": "ራስ ማሳዘን እያለዎት እረዳለሁ። ለምን ያህል ጊዜ ነው? ሌላ ምልክቶች አሉን?",
					"የራስ ህመም": "የራስ ህመም እያለዎት እረዳለሁ። ለምን ያህል ጊዜ ነው? ሌላ ምልክቶች አሉን?",
					"የሰውነት ሙቀት": "የሰውነት ሙቀትዎ ስንት ነው? ሌላ ምልክቶች አሉን?",
					"የደረት ህመም":
						"የደረት ህመም ከባድ ሊሆን ይችላል። የመተንፈስ ችግር አለዎት? ይህ አደጋ ሊሆን ይችላል።",
					"የሆድ ህመም": "የሆድ ህመም እያለዎት እረዳለሁ። ስለ ምልክቶችዎ ተጨማሪ መረጃ ሊሰጡ ይችላሉ?",
					አደጋ: "🚨 አደጋ ተገኝቷል! ይህ የጤና አደጋ ይመስላል። እባክዎ ወቅታዊ እርዳታ ለማግኘት 911 ወይም የአካባቢዎ የአደጋ ቁጥር ይደውሉ።",
					እርዳታ: "እርዳታ ለመስጠት እዚህ እለያለሁ! አጠቃላይ የጤና መረጃ፣ የምልክቶች ግምገማ እና መመሪያ ልሰጥ እችላለሁ። ምን ዓይነት የጤና ጥያቄ አለዎት?",
					"ምን ማድረግ ትችላለህ":
						"እኔ ሃክሚን ነኝ፣ የእርስዎ AI ጤና አማካሪ! አጠቃላይ የጤና መረጃ፣ የምልክቶች ግምገማ፣ የጤና ምክሮች እና የአደጋ መመሪያ ልሰጥ እችላለሁ። ምን ማወቅ ይፈልጋሉ?",
					default:
						"አመሰግናለሁ ለመልእክትዎ! አጠቃላይ የጤና መረጃ እና መመሪያ ለመስጠት እዚህ እለያለሁ። እባክዎ ስለ ጤና ጥንቃቄዎ ተጨማሪ ዝርዝር መረጃ ሊሰጡ ይችላሉ እንድረዳዎት? ለተለያዩ የሕክምና ምርመራ ወይም ሕክምና፣ እባክዎ የጤና ባለሙያ ያነጋግሩ።",
				},
				or: {
					akkam:
						"Akkam! Ani Hakmin dha, gorsaa fayyaa AI keessan. Har'a akkamiin isin gargaaruu danda'a?",
					selam:
						"Selam! Ani Hakmin dha, gorsaa fayyaa AI keessan. Har'a akkamiin isin gargaaruu danda'a?",
					"akka jirta":
						"Gaarii jiru, galatoomi! Ani isin gargaaruu danda'uuf as jiru. Mallattoo fayyaa waliin walqunnamaa qabaattuu? Maaloo naan himaa?",
					"dhukkuba mataa":
						"Dhukkuba mataa qabaattuu fahadhaa. Yeroo dheeressuu isaa yoo ta'e, mallattoo biroo qabaattuu?",
					"dhukkuba qaallii":
						"Dhukkuba qaallii qabaattuu fahadhaa. Yeroo dheeressuu isaa yoo ta'e, mallattoo biroo qabaattuu?",
					"ho'a": "Ho'a keessan maaloo? Mallattoo biroo qabaattuu?",
					"dhukkuba lafa":
						"Dhukkuba lafa cimaa ta'a danda'a. Rakkina hojii dhaabbii qabaattuu? Kun balaa ta'a danda'a.",
					"dhukkuba garaa":
						"Dhukkuba garaa qabaattuu fahadhaa. Mallattoo keessanii waa'ee odeeffannoo dabalataa nuu kenni?",
					balaa:
						"🚨 Balaa argame! Kun dhukkuba fayyaa ta'a danda'a. Maaloo gargaarsa dhiyeessaa argachuuf 911 ykn lakki keessan balaa lakki dhaabbadhaa.",
					gargaarsa:
						"Gargaarsa kennuu danda'uuf as jiru! Odeeffannoo fayyaa guutuu, qorannoo mallattoo fi qajeelcha balaa kennuu danda'a. Gaaffii fayyaa maaloo qabaattuu?",
					"maaloo hojjeta":
						"Ani Hakmin dha, gorsaa fayyaa AI keessan! Odeeffannoo fayyaa guutuu, qorannoo mallattoo, qajeelcha fayyaa fi balaa kennuu danda'a. Maaloo naan himaa?",
					default:
						"Galatoomi gaaffii keessan! Odeeffannoo fayyaa guutuu fi qajeelcha kennuu danda'uuf as jiru. Maaloo mallattoo keessanii waa'ee odeeffannoo dabalataa nuu kenni naan gargaaruu danda'uuf? Yaadannoo, qorannoo fayyaa guutuu ykn dabalataa argachuuf gorsaa fayyaa waliin walqunnamaa.",
				},
			};

			const currentResponses =
				demoResponses[language as keyof typeof demoResponses] ||
				demoResponses.en;
			const lowerMessage = message.toLowerCase();

			let response = currentResponses.default;
			for (const [key, value] of Object.entries(currentResponses)) {
				if (lowerMessage.includes(key.toLowerCase())) {
					response = value;
					break;
				}
			}

			// Check for emergency keywords
			const emergencyKeywords = [
				"emergency",
				"chest pain",
				"heart attack",
				"stroke",
				"unconscious",
				"bleeding",
				"የደረት ህመም",
				"የልብ ምት",
				"የስትሮክ",
				"ስሜት አለመስማት",
				"ደም መፍሰስ",
				"አደጋ",
				"dhukkuba lafa",
				"dhukkuba onnee",
				"dhukkuba miidhaa",
				"balaa",
			];

			const isEmergency = emergencyKeywords.some((keyword) =>
				lowerMessage.includes(keyword.toLowerCase()),
			);

			return NextResponse.json({
				message: response,
				isEmergency,
				timestamp: new Date().toISOString(),
			});
		}

		// Direct ChatGPT integration when API key is available
		const response = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
			},
			body: JSON.stringify({
				model: "gpt-3.5-turbo",
				messages: [
					{
						role: "system",
						content: `You are a medical AI assistant for Hakmin Health System in Ethiopia. You provide helpful health information and guidance in a supportive manner. You can respond in English, Amharic, or Afaan Oromo based on the user's language preference.

IMPORTANT GUIDELINES:
- Always prioritize patient safety
- If you detect any emergency symptoms (chest pain, severe bleeding, difficulty breathing, etc.), immediately advise calling emergency services
- Provide general health information but always recommend consulting healthcare professionals for specific medical advice
- Be culturally sensitive to Ethiopian context
- Keep responses concise and clear
- If the user mentions emergency symptoms, respond with urgency and clear emergency instructions

Emergency symptoms to watch for:
- Chest pain or pressure
- Severe bleeding
- Difficulty breathing
- Severe head injury
- Loss of consciousness
- Severe abdominal pain
- Signs of stroke (FAST: Face drooping, Arm weakness, Speech difficulty, Time to call emergency)

Respond in the same language as the user's message. If the user writes in Amharic, respond in Amharic. If they write in Afaan Oromo, respond in Afaan Oromo. Otherwise, respond in English.`,
					},
					{
						role: "user",
						content: message,
					},
				],
				max_tokens: 500,
				temperature: 0.7,
			}),
		});

		if (!response.ok) {
			throw new Error(`OpenAI API error: ${response.status}`);
		}

		const data = await response.json();
		const aiResponse = data.choices[0].message.content;

		// Check for emergency keywords in the response
		const emergencyKeywords = [
			"emergency",
			"chest pain",
			"difficulty breathing",
			"severe bleeding",
			"stroke",
			"heart attack",
			"call 911",
			"call emergency",
			"immediately",
			"urgent",
			"critical",
			"life-threatening",
			"ደረት ህመም",
			"የልብ ምት",
			"የስትሮክ",
			"ደም መፍሰስ",
			"dhukkuba lafa",
			"dhukkuba onnee",
		];

		const isEmergency = emergencyKeywords.some((keyword) =>
			aiResponse.toLowerCase().includes(keyword.toLowerCase()),
		);

		return NextResponse.json({
			message: aiResponse,
			isEmergency,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Chat API error:", error);

		// Default fallback response
		const fallbackResponse = "I apologize, but I'm currently unable to process your request. Please try again later or contact a healthcare professional for immediate assistance.";

		return NextResponse.json({
			message: fallbackResponse,
			isEmergency: false,
			timestamp: new Date().toISOString(),
		});
	}
}
