import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { currentDifficulty, isCorrect, streak } = await req.json();

    let newDifficulty = currentDifficulty;
    let newStreak = isCorrect ? (streak || 0) + 1 : 0;

    // Adaptive difficulty logic
    // If user gets multiple correct consecutively, increase difficulty
    if (isCorrect && newStreak >= 2) {
      if (currentDifficulty === "easy") newDifficulty = "medium";
      else if (currentDifficulty === "medium") newDifficulty = "hard";
    } 
    // If user gets a question wrong, lower the difficulty
    else if (!isCorrect) {
      if (currentDifficulty === "hard") newDifficulty = "medium";
      else if (currentDifficulty === "medium") newDifficulty = "easy";
    }

    return NextResponse.json({
      success: true,
      difficulty: newDifficulty,
      streak: newStreak,
    });
  } catch (error) {
    console.error("Error evaluating answer:", error);
    return NextResponse.json({ error: "Failed to evaluate answer" }, { status: 500 });
  }
}
