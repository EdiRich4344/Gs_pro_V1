import { GoogleGenAI } from "@google/genai";

// Fix: Directly use process.env.API_KEY as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateNotice = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a concise, friendly, and well-formatted notice for a ladies' hostel notice board based on the following keywords. The hostel is named 'Good Shepherd Ladies Hostel'. The notice should be clear and easy to read. Keywords: "${prompt}"`,
      config: {
        temperature: 0.7,
        topP: 1,
        topK: 1,
        maxOutputTokens: 256,
        // Fix: Added thinkingConfig to reserve tokens for output when using maxOutputTokens with gemini-2.5-flash.
        thinkingConfig: { thinkingBudget: 100 },
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate notice from Gemini API.");
  }
};

export const generatePaymentReminder = async (residentName: string, amount: number, dueDate: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a polite but firm reminder message for a resident of 'Good Shepherd Ladies Hostel' about an overdue rent payment. The message should be suitable for SMS or a short email.
            
            Details for the reminder:
            - Resident Name: ${residentName}
            - Overdue Amount: ₹${amount.toLocaleString('en-IN')}
            - Original Due Date: ${new Date(dueDate).toLocaleDateString()}
            
            The tone should be professional and courteous, but make it clear that the payment is now overdue and requires prompt attention. Sign off from "Good Shepherd Hostel Management".`,
             config: {
                temperature: 0.8,
                maxOutputTokens: 256,
                // Fix: Added thinkingConfig to reserve tokens for output when using maxOutputTokens with gemini-2.5-flash.
                thinkingConfig: { thinkingBudget: 100 },
            }
        });

        return response.text;

    } catch (error) {
        console.error("Error calling Gemini API for payment reminder:", error);
        throw new Error("Failed to generate payment reminder from Gemini API.");
    }
};
