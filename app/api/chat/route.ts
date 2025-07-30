import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, language } = await request.json()
    
    // Fallback response if ChatGPT is unavailable
    const fallbackResponses = {
      en: "I apologize, but I'm currently unable to process your request. Please try again later or contact a healthcare professional for immediate assistance.",
      am: "ይቅርታ፣ አሁን ጥያቄዎን ማስተካከል አልቻልኩም። እባክዎ በኋላ ዳግም ይሞክሩ ወይም ወቅታዊ እርዳታ ለማግኘት የጤና ባለሙያ ያነጋግሩ።",
      or: "Dhiifama, amma gaaffii keessan sirreessuu hin dandeenye. Maaloo booda yaali yookiin gargaarsa dhiyeessaa argachuuf gorsaa fayyaa waliin walqunnamaa."
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Provide helpful demo responses when API key is not configured
      const demoResponses = {
        en: {
          "hello": "Hello! I'm Hakmin, your AI health assistant. I'm here to help you with health-related questions. How can I assist you today?",
          "hi": "Hi there! I'm Hakmin, your AI health assistant. How can I help you today?",
          "how are you": "I'm doing well, thank you for asking! I'm here to help you with any health-related questions you might have. What would you like to know?",
          "headache": "I understand you're experiencing a headache. How long have you had it? Is it accompanied by any other symptoms like nausea, sensitivity to light, or fever?",
          "head pain": "I understand you're experiencing head pain. How long have you had it? Is it accompanied by any other symptoms like nausea, sensitivity to light, or fever?",
          "fever": "What's your temperature? Are you experiencing any other symptoms like cough, sore throat, or body aches?",
          "temperature": "What's your temperature? Are you experiencing any other symptoms like cough, sore throat, or body aches?",
          "chest pain": "Chest pain can be serious. Are you experiencing shortness of breath, sweating, or pain radiating to your arm or jaw? This could be an emergency - please call emergency services immediately.",
          "stomach": "I understand you're having stomach issues. Can you tell me more about your symptoms? Are you experiencing pain, nausea, vomiting, or changes in bowel movements?",
          "nausea": "I understand you're feeling nauseous. How long have you been feeling this way? Are you experiencing any other symptoms like vomiting, fever, or abdominal pain?",
          "vomiting": "I understand you're vomiting. How long has this been going on? Are you experiencing any other symptoms like fever, abdominal pain, or dehydration?",
          "cough": "I understand you have a cough. How long have you been coughing? Is it a dry cough or productive? Are you experiencing any other symptoms like fever, sore throat, or difficulty breathing?",
          "cold": "I understand you have a cold. Common symptoms include runny nose, sore throat, and cough. Are you experiencing any other symptoms? Make sure to rest, stay hydrated, and consider over-the-counter medications for symptom relief.",
          "flu": "I understand you have flu-like symptoms. These can include fever, body aches, fatigue, and respiratory symptoms. Are you experiencing any other symptoms? Make sure to rest, stay hydrated, and consider consulting a healthcare provider.",
          "emergency": "🚨 EMERGENCY DETECTED! This sounds like a medical emergency. Please call emergency services immediately at 911 or your local emergency number. Do not wait for further advice.",
          "help": "I'm here to help! I can assist you with general health information, symptom assessment, and guidance. What specific health question do you have?",
          "what can you do": "I'm Hakmin, your AI health assistant! I can help you with general health information, symptom assessment, wellness tips, and emergency guidance. I can respond in English, Amharic, and Afaan Oromo. What would you like to know?",
          "default": "Thank you for your message! I'm here to help with general health information and guidance. Could you please provide more details about your health concern so I can better assist you? Remember, for specific medical diagnosis or treatment, please consult with a healthcare professional."
        },
        am: {
          "ሰላም": "ሰላም! እኔ ሃክሚን ነኝ፣ የእርስዎ AI ጤና አማካሪ። ዛሬ እንዴት ልረዳዎት እችላለሁ?",
          "ሰላምታ": "ሰላምታ! እኔ ሃክሚን ነኝ፣ የእርስዎ AI ጤና አማካሪ። ዛሬ እንዴት ልረዳዎት እችላለሁ?",
          "እንደምን አለህ": "ደህና ነኝ፣ አመሰግናለሁ! እኔ እዚህ እለያለሁ የጤና ጥያቄዎችዎን ለመመለስ። ምን ማወቅ ይፈልጋሉ?",
          "ራስ ማሳዘን": "ራስ ማሳዘን እያለዎት እረዳለሁ። ለምን ያህል ጊዜ ነው? ሌላ ምልክቶች አሉን?",
          "የራስ ህመም": "የራስ ህመም እያለዎት እረዳለሁ። ለምን ያህል ጊዜ ነው? ሌላ ምልክቶች አሉን?",
          "የሰውነት ሙቀት": "የሰውነት ሙቀትዎ ስንት ነው? ሌላ ምልክቶች አሉን?",
          "የደረት ህመም": "የደረት ህመም ከባድ ሊሆን ይችላል። የመተንፈስ ችግር አለዎት? ይህ አደጋ ሊሆን ይችላል።",
          "የሆድ ህመም": "የሆድ ህመም እያለዎት እረዳለሁ። ስለ ምልክቶችዎ ተጨማሪ መረጃ ሊሰጡ ይችላሉ?",
          "አደጋ": "🚨 አደጋ ተገኝቷል! ይህ የጤና አደጋ ይመስላል። እባክዎ ወቅታዊ እርዳታ ለማግኘት 911 ወይም የአካባቢዎ የአደጋ ቁጥር ይደውሉ።",
          "እርዳታ": "እርዳታ ለመስጠት እዚህ እለያለሁ! አጠቃላይ የጤና መረጃ፣ የምልክቶች ግምገማ እና መመሪያ ልሰጥ እችላለሁ። ምን ዓይነት የጤና ጥያቄ አለዎት?",
          "ምን ማድረግ ትችላለህ": "እኔ ሃክሚን ነኝ፣ የእርስዎ AI ጤና አማካሪ! አጠቃላይ የጤና መረጃ፣ የምልክቶች ግምገማ፣ የጤና ምክሮች እና የአደጋ መመሪያ ልሰጥ እችላለሁ። ምን ማወቅ ይፈልጋሉ?",
          "default": "አመሰግናለሁ ለመልእክትዎ! አጠቃላይ የጤና መረጃ እና መመሪያ ለመስጠት እዚህ እለያለሁ። እባክዎ ስለ ጤና ጥንቃቄዎ ተጨማሪ ዝርዝር መረጃ ሊሰጡ ይችላሉ እንድረዳዎት? ለተለያዩ የሕክምና ምርመራ ወይም ሕክምና፣ እባክዎ የጤና ባለሙያ ያነጋግሩ።"
        },
        or: {
          "akkam": "Akkam! Ani Hakmin dha, gorsaa fayyaa AI keessan. Har'a akkamiin isin gargaaruu danda'a?",
          "selam": "Selam! Ani Hakmin dha, gorsaa fayyaa AI keessan. Har'a akkamiin isin gargaaruu danda'a?",
          "akka jirta": "Gaarii jiru, galatoomi! Ani isin gargaaruu danda'uuf as jiru. Mallattoo fayyaa waliin walqunnamaa qabaattuu? Maaloo naan himaa?",
          "dhukkuba mataa": "Dhukkuba mataa qabaattuu fahadhaa. Yeroo dheeressuu isaa yoo ta'e, mallattoo biroo qabaattuu?",
          "dhukkuba qaallii": "Dhukkuba qaallii qabaattuu fahadhaa. Yeroo dheeressuu isaa yoo ta'e, mallattoo biroo qabaattuu?",
          "ho'a": "Ho'a keessan maaloo? Mallattoo biroo qabaattuu?",
          "dhukkuba lafa": "Dhukkuba lafa cimaa ta'a danda'a. Rakkina hojii dhaabbii qabaattuu? Kun balaa ta'a danda'a.",
          "dhukkuba garaa": "Dhukkuba garaa qabaattuu fahadhaa. Mallattoo keessanii waa'ee odeeffannoo dabalataa nuu kenni?",
          "balaa": "🚨 Balaa argame! Kun dhukkuba fayyaa ta'a danda'a. Maaloo gargaarsa dhiyeessaa argachuuf 911 ykn lakki keessan balaa lakki dhaabbadhaa.",
          "gargaarsa": "Gargaarsa kennuu danda'uuf as jiru! Odeeffannoo fayyaa guutuu, qorannoo mallattoo fi qajeelcha balaa kennuu danda'a. Gaaffii fayyaa maaloo qabaattuu?",
          "maaloo hojjeta": "Ani Hakmin dha, gorsaa fayyaa AI keessan! Odeeffannoo fayyaa guutuu, qorannoo mallattoo, qajeelcha fayyaa fi balaa kennuu danda'a. Maaloo naan himaa?",
          "default": "Galatoomi gaaffii keessan! Odeeffannoo fayyaa guutuu fi qajeelcha kennuu danda'uuf as jiru. Maaloo mallattoo keessanii waa'ee odeeffannoo dabalataa nuu kenni naan gargaaruu danda'uuf? Yaadannoo, qorannoo fayyaa guutuu ykn dabalataa argachuuf gorsaa fayyaa waliin walqunnamaa."
        }
      }

      const currentResponses = demoResponses[language as keyof typeof demoResponses] || demoResponses.en
      const lowerMessage = message.toLowerCase()
      
      let response = currentResponses.default
      for (const [key, value] of Object.entries(currentResponses)) {
        if (lowerMessage.includes(key.toLowerCase())) {
          response = value
          break
        }
      }

      // Check for emergency keywords
      const emergencyKeywords = [
        "emergency", "chest pain", "heart attack", "stroke", "unconscious", "bleeding",
        "የደረት ህመም", "የልብ ምት", "የስትሮክ", "ስሜት አለመስማት", "ደም መፍሰስ", "አደጋ",
        "dhukkuba lafa", "dhukkuba onnee", "dhukkuba miidhaa", "balaa"
      ]
      
      const isEmergency = emergencyKeywords.some(keyword => 
        lowerMessage.includes(keyword.toLowerCase())
      )

      return NextResponse.json({
        message: response,
        isEmergency,
        timestamp: new Date().toISOString()
      })
    }

    // Direct ChatGPT integration when API key is available
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
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

Respond in the same language as the user's message. If the user writes in Amharic, respond in Amharic. If they write in Afaan Oromo, respond in Afaan Oromo. Otherwise, respond in English.`
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

    // Check for emergency keywords in the response
    const emergencyKeywords = [
      "emergency", "chest pain", "difficulty breathing", "severe bleeding", 
      "stroke", "heart attack", "call 911", "call emergency", "immediately",
      "urgent", "critical", "life-threatening", "ደረት ህመም", "የልብ ምት",
      "የስትሮክ", "ደም መፍሰስ", "dhukkuba lafa", "dhukkuba onnee"
    ]
    
    const isEmergency = emergencyKeywords.some(keyword => 
      aiResponse.toLowerCase().includes(keyword.toLowerCase())
    )

    return NextResponse.json({ 
      message: aiResponse,
      isEmergency,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Chat API error:", error)
    
    const fallbackResponse = fallbackResponses[language as keyof typeof fallbackResponses] || fallbackResponses.en
    
    return NextResponse.json({ 
      message: fallbackResponse,
      isEmergency: false,
      timestamp: new Date().toISOString()
    })
  }
}
