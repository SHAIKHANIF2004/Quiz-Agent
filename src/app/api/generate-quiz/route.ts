import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { topic, difficulty = "medium", numQuestions = 5 } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Mock response if no API key is set for smoother local development
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not set. Generating mock quiz for development.");
      return NextResponse.json({
        success: true,
        quiz: Array(numQuestions)
          .fill(0)
          .map((_, i) => ({
            question: `Mock Question ${i + 1} about ${topic}?`,
            type: "mcq",
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: "Option A",
            explanation: "This is a mock explanation since the Gemini API key is missing.",
          })),
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Generate a highly educational quiz about "${topic}".
    The difficulty level should be ${difficulty}.
    Generate exactly ${numQuestions} questions.
    Include a mix of multiple-choice and true/false questions.
    Return the response as a pure JSON array of objects with the following structure:
    [{
      "question": "The question text",
      "type": "mcq" | "boolean",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"], // Only if type is mcq, omit if boolean
      "correctAnswer": "The exact string of the correct option or 'True'/'False'",
      "explanation": "Detailed explanation of why this is the correct answer"
    }]
    Important: Provide ONLY the valid JSON array. Do not include markdown blocks like \`\`\`json.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let quizData;
    try {
      quizData = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse Gemini response:", text);
      return NextResponse.json({ error: "Invalid AI response format" }, { status: 500 });
    }

    return NextResponse.json({ success: true, quiz: quizData });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
  }
}
