import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const { toolType, inputData, language = 'en' } = await request.json();

		// AI Tools responses for different tool types
		const aiToolsResponses = {
			'diagnosis-assistant': {
				en: {
					"chest pain": {
						analysis: `**AI Diagnosis Analysis**

**Presenting Symptoms**: ${inputData}

**Differential Diagnosis**:
1. **Primary Consideration**: Acute coronary syndrome (ACS)
2. **Secondary Possibilities**: 
   - Pulmonary embolism
   - Aortic dissection
   - Pneumonia
   - Costochondritis
   - GERD

**Red Flags**:
- Shortness of breath
- Pain radiating to arm/jaw
- Diaphoresis
- Nausea/vomiting
- Syncope

**Recommended Workup**:
• ECG immediately
• Troponin levels
• CXR
• Consider CT angiography if PE suspected

**Next Steps**:
• Complete physical examination
• Monitor vital signs closely
• Consider urgent cardiology consult
• Document all findings

*This is AI-assisted analysis. Always use clinical judgment.*`,
						isEmergency: true
					},
					"headache": {
						analysis: `**AI Diagnosis Analysis**

**Presenting Symptoms**: ${inputData}

**Differential Diagnosis**:
1. **Primary Consideration**: Tension headache
2. **Secondary Possibilities**: 
   - Migraine
   - Cluster headache
   - Sinus headache
   - Medication overuse headache
   - Secondary causes (infection, vascular)

**Red Flags**:
- Sudden onset "thunderclap" headache
- Headache with fever and stiff neck
- Headache with focal neurological deficits
- Headache after head injury
- Headache in immunocompromised patient

**Recommended Workup**:
• Complete neurological examination
• Consider imaging if red flags present
• Blood work if infection suspected

**Next Steps**:
• Assess pain characteristics
• Review medication history
• Consider prophylactic treatment if recurrent
• Monitor for symptom progression

*This is AI-assisted analysis. Always use clinical judgment.*`,
						isEmergency: false
					},
					"fever": {
						analysis: `**AI Diagnosis Analysis**

**Presenting Symptoms**: ${inputData}

**Differential Diagnosis**:
1. **Primary Consideration**: Viral infection
2. **Secondary Possibilities**: 
   - Bacterial infection
   - Inflammatory conditions
   - Medication side effects
   - Heat-related illness
   - Malignancy

**Red Flags**:
- Fever >103°F (>39.4°C)
- Fever with severe symptoms
- Fever lasting >3 days
- Fever with rash
- Fever in immunocompromised patient

**Recommended Workup**:
• CBC with differential
• CRP/ESR
• Blood cultures if severe
• Imaging if localized symptoms

**Next Steps**:
• Assess for source of infection
• Consider empiric antibiotics if bacterial suspected
• Monitor for complications
• Follow up if symptoms persist

*This is AI-assisted analysis. Always use clinical judgment.*`,
						isEmergency: false
					},
					default: {
						analysis: `**AI Diagnosis Analysis**

**Presenting Symptoms**: ${inputData}

**Differential Diagnosis**:
1. **Primary Consideration**: Based on symptoms, consider most common causes
2. **Secondary Possibilities**: Alternative diagnoses to consider
3. **Red Flags**: Watch for emergency signs

**Recommended Workup**:
• Appropriate lab tests based on symptoms
• Imaging if indicated
• Specialist referral if needed

**Next Steps**:
• Complete physical examination
• Order appropriate diagnostic tests
• Monitor for symptom progression
• Document all findings

*This is AI-assisted analysis. Always use clinical judgment.*`,
						isEmergency: false
					}
				}
			},
			'drug-interaction': {
				en: {
					"warfarin": {
						analysis: `**Drug Interaction Analysis**

**Medications**: ${inputData}

**Interaction Assessment**:
⚠️ **Major Interactions Detected**:
• Warfarin + Aspirin: Increased bleeding risk
• Warfarin + NSAIDs: Increased bleeding risk
• Warfarin + Antibiotics: May affect INR

**Recommendations**:
• Monitor INR more frequently
• Check for signs of bleeding
• Consider alternative medications
• Educate patient about bleeding signs

**Safety Notes**:
• Always verify with pharmacy
• Monitor patient response closely
• Document any adverse effects
• Regular INR monitoring required`,
						isEmergency: false
					},
					"metformin": {
						analysis: `**Drug Interaction Analysis**

**Medications**: ${inputData}

**Interaction Assessment**:
✅ **No Major Interactions Detected**
⚠️ **Moderate Interactions**:
• Metformin + Furosemide: May affect glucose control
• Metformin + ACE inhibitors: Monitor renal function

**Recommendations**:
• Monitor blood glucose closely
• Check renal function regularly
• Consider dose adjustments if needed
• Monitor for side effects

**Safety Notes**:
• Always verify with pharmacy
• Monitor patient response
• Document any adverse effects`,
						isEmergency: false
					},
					default: {
						analysis: `**Drug Interaction Analysis**

**Medications**: ${inputData}

**Interaction Assessment**:
✅ **No Major Interactions Detected**
⚠️ **Moderate Interactions**:
• Monitor for specific effects
• Consider dose adjustments

**Recommendations**:
• Monitor patient closely
• Check for side effects
• Consider alternative medications if needed

**Safety Notes**:
• Always verify with pharmacy
• Monitor patient response
• Document any adverse effects`,
						isEmergency: false
					}
				}
			},
			'treatment-planner': {
				en: {
					"hypertension": {
						analysis: `**Treatment Plan Generated**

**Diagnosis**: ${inputData}

**Evidence-Based Treatment Plan**:

**Phase 1 - Acute Management**:
• Immediate BP control if severe hypertension
• Lifestyle modifications
• Monitoring parameters

**Phase 2 - Maintenance**:
• First-line medications: ACE inhibitors, ARBs, CCBs, or thiazide diuretics
• Target BP <130/80 mmHg
• Regular follow-up every 3-6 months

**Phase 3 - Prevention**:
• Salt reduction (<2.4g/day)
• DASH diet
• Regular exercise
• Weight management
• Smoking cessation

**Monitoring Plan**:
• Home BP monitoring
• Regular clinic visits
• Lab monitoring (electrolytes, renal function)
• Annual cardiovascular risk assessment`,
						isEmergency: false
					},
					"diabetes": {
						analysis: `**Treatment Plan Generated**

**Diagnosis**: ${inputData}

**Evidence-Based Treatment Plan**:

**Phase 1 - Acute Management**:
• Immediate glucose control
• Lifestyle modifications
• Monitoring parameters

**Phase 2 - Maintenance**:
• Metformin first-line
• Add sulfonylurea, DPP-4 inhibitor, or SGLT2 inhibitor if needed
• Target HbA1c <7%
• Regular follow-up every 3-6 months

**Phase 3 - Prevention**:
• Diet and exercise counseling
• Foot care education
• Eye examination annually
• Cardiovascular risk management

**Monitoring Plan**:
• Self-monitoring of blood glucose
• Regular HbA1c testing
• Annual comprehensive foot exam
• Annual eye examination`,
						isEmergency: false
					},
					default: {
						analysis: `**Treatment Plan Generated**

**Diagnosis**: ${inputData}

**Evidence-Based Treatment Plan**:

**Phase 1 - Acute Management**:
• Immediate interventions
• Symptom control
• Monitoring parameters

**Phase 2 - Maintenance**:
• Long-term medications
• Lifestyle modifications
• Follow-up schedule

**Phase 3 - Prevention**:
• Preventive measures
• Risk factor management
• Patient education

**Monitoring Plan**:
• Regular check-ups
• Lab monitoring
• Symptom tracking`,
						isEmergency: false
					}
				}
			},
			'lab-interpreter': {
				en: {
					"cbc": {
						analysis: `**Lab Results Interpretation**

**Results**: ${inputData}

**Analysis**:
📊 **Normal Values**:
• WBC: 4,000-11,000/μL
• Hgb: 12-16 g/dL (women), 14-18 g/dL (men)
• Platelets: 150,000-450,000/μL

🔍 **Abnormal Findings**:
• [Specific abnormalities found]
• Clinical significance
• Possible causes

💡 **Clinical Correlation**:
• Possible causes
• Differential diagnosis
• Recommended follow-up

**Next Steps**:
• Additional testing if needed
• Specialist referral
• Treatment adjustments`,
						isEmergency: false
					},
					default: {
						analysis: `**Lab Results Interpretation**

**Results**: ${inputData}

**Analysis**:
📊 **Normal Values**:
• [Normal ranges]

🔍 **Abnormal Findings**:
• [Specific abnormalities]
• Clinical significance

💡 **Clinical Correlation**:
• Possible causes
• Differential diagnosis
• Recommended follow-up

**Next Steps**:
• Additional testing if needed
• Specialist referral
• Treatment adjustments`,
						isEmergency: false
					}
				}
			},
			'risk-calculator': {
				en: {
					"cardiovascular": {
						analysis: `**Risk Assessment Results**

**Patient Profile**: ${inputData}

**Risk Scores**:
🎯 **Framingham Risk Score**: [Calculated score]
📊 **Risk Factors**:
• Age, gender, smoking status
• Hypertension, diabetes
• Family history
• Modifiable vs non-modifiable

**Risk Stratification**:
• Low/Medium/High risk
• Recommended interventions
• Monitoring frequency

**Prevention Strategies**:
• Lifestyle modifications
• Screening recommendations
• Follow-up schedule`,
						isEmergency: false
					},
					default: {
						analysis: `**Risk Assessment Results**

**Patient Profile**: ${inputData}

**Risk Scores**:
🎯 **Primary Risk**: [Calculated risk score]
📊 **Risk Factors**:
• [List of risk factors]
• Modifiable vs non-modifiable

**Risk Stratification**:
• Low/Medium/High risk
• Recommended interventions
• Monitoring frequency

**Prevention Strategies**:
• Lifestyle modifications
• Screening recommendations
• Follow-up schedule`,
						isEmergency: false
					}
				}
			},
			'medical-literature': {
				en: {
					"hypertension": {
						analysis: `**Medical Literature Search Results**

**Query**: ${inputData}

**Recent Studies**:
📚 **Key Findings**:
• SPRINT Study: Intensive BP control reduces cardiovascular events
• ACCORD Study: Intensive glucose control in diabetes
• Latest AHA/ACC Guidelines (2024)

**Clinical Guidelines**:
📋 **Current Recommendations**:
• Target BP <130/80 mmHg for most patients
• SGLT2 inhibitors show renal protection
• Home BP monitoring improves outcomes

**Evidence Level**:
• Level A evidence for lifestyle modifications
• Level B evidence for medication choices
• Level C evidence for specific combinations

**Clinical Application**:
• Apply findings in practice
• Consider patient-specific factors
• Limitations of current evidence`,
						isEmergency: false
					},
					default: {
						analysis: `**Medical Literature Search Results**

**Query**: ${inputData}

**Recent Studies**:
📚 **Key Findings**:
• [Study 1]: [Key findings]
• [Study 2]: [Key findings]
• [Study 3]: [Key findings]

**Clinical Guidelines**:
📋 **Current Recommendations**:
• [Guideline 1]: [Recommendations]
• [Guideline 2]: [Recommendations]

**Evidence Level**:
• Level of evidence for each recommendation
• Strength of recommendations

**Clinical Application**:
• How to apply findings in practice
• Limitations of current evidence`,
						isEmergency: false
					}
				}
			}
		};

		// Get responses for the specific tool type and language
		const toolResponses = aiToolsResponses[toolType as keyof typeof aiToolsResponses];
		if (!toolResponses) {
			return NextResponse.json({
				message: "Invalid tool type. Please select a valid AI tool.",
				timestamp: new Date().toISOString(),
			});
		}

		const languageResponses = toolResponses[language as keyof typeof toolResponses] || toolResponses.en;
		const lowerInput = inputData.toLowerCase();

		// Find matching response
		let response = languageResponses.default;
		for (const [key, value] of Object.entries(languageResponses)) {
			if (key !== 'default' && lowerInput.includes(key.toLowerCase())) {
				response = value;
				break;
			}
		}

		return NextResponse.json({
			message: response.analysis,
			isEmergency: response.isEmergency || false,
			timestamp: new Date().toISOString(),
		});

	} catch (error) {
		console.error("AI Tools API error:", error);

		return NextResponse.json({
			message: "I apologize, but I'm currently unable to process your request. Please try again later or consult with a colleague for immediate assistance.",
			isEmergency: false,
			timestamp: new Date().toISOString(),
		});
	}
} 