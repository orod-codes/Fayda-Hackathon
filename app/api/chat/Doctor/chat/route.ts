import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import OpenAI from 'openai';
//import connectDB from '../../../backend/config/db.js';
// import User from '../../../backend/models/User.js';
// import ChatHistory from '../../../backend/models/ChatHistory.js';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// export async function POST(request: NextRequest) {
//     try {
//         await connectDB();

//         const reqHeaders = headers();
//         const authHeader = reqHeaders.get("Authorization");
//         const token = authHeader?.split(" ")[1];

//         // Simple token validation - you may want to implement proper JWT validation
//         if (!token) {
//             return NextResponse.json(
//                 { error: 'No authentication token provided' }, 
//                 { status: 401 }
//             );
//         }

//         const { message, userId, chatType } = await request.json();

//         // Validate required fields
//         if (!message || !userId || !chatType) {
//             return NextResponse.json(
//                 { error: 'Message, userId, and chatType are required' }, 
//                 { status: 400 }
//             );
//         }

//         // Get user data for context
//         const user = await User.findById(userId);
//         if (!user || user.role !== 'doctor') {
//             return NextResponse.json(
//                 { error: 'Doctor not found' }, 
//                 { status: 404 }
//             );
//         }

//         // Define prompt based on chat type
//         let prompt;
//         switch (chatType) {
//             case 'diagnosis':
//                 prompt = `You are a sophisticated AI Diagnosis Assistant. Provide evidence-based diagnostic support based on the symptoms provided. Always recommend consulting specific medical professionals for final diagnosis.`;
//                 break;
//             case 'treatment':
//                 prompt = `You are an AI Treatment Suggestions Assistant. Suggest treatment options based on provided clinical guidelines and best practices. Ensure all recommendations are evidence-based and advise consulting a human medical professional before making any decisions.`;
//                 break;
//             case 'literature':
//                 prompt = `You are an AI Literature Search Assistant. Provide access to the latest medical research and studies relevant to the query. Always include proper citations and remind users to verify with peer-reviewed sources.`;
//                 break;
//             case 'consultation':
//                 prompt = `You are an AI Quick Consultation Assistant. Provide urgent advice based on best practices, ensuring to prioritize patient safety and recommend contacting emergency services when needed.`;
//                 break;
//             default:
//                 prompt = `You are an AI assistant. Provide general support based on the input provided.`;
//         }

//         const completion = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo",
//             messages: [
//                 {
//                     role: "system",
//                     content: prompt,
//                 },
//                 {
//                     role: "user",
//                     content: message,
//                 }
//             ],
//             max_tokens: 500,
//             temperature: 0.7,
//         });

//         const aiResponse = completion.choices[0].message.content;

//         // Save chat history
//         try {
//             const sessionId = 'doctor-session';
//             let chatHistory = await ChatHistory.findOne({ userId, sessionId });

//             if (!chatHistory) {
//                 chatHistory = new ChatHistory({
//                     userId,
//                     sessionId,
//                     messages: []
//                 });
//             }

//             chatHistory.messages.push(
//                 {
//                     content: message,
//                     role: 'user',
//                     metadata: { chatType }
//                 },
//                 {
//                     content: aiResponse,
//                     role: 'assistant',
//                     metadata: { chatType }
//                 }
//             );

//             await chatHistory.save();
//         } catch (chatError) {
//             console.error('Failed to save chat history:', chatError);
//             // Continue without failing the request
//         }

//         return NextResponse.json({
//             message: aiResponse,
//             timestamp: new Date().toISOString(),
//         });
//     } catch (error) {
//         console.error("Doctor Chat API error:", error);

//         return NextResponse.json({
//             message: 'An error occurred while processing your request.',
//             timestamp: new Date().toISOString(),
//         }, { status: 500 });
//     }
// }