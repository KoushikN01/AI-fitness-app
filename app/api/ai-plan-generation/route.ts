import { type NextRequest, NextResponse } from "next/server"

interface UserProfile {
  name: string
  age: number
  gender: string
  height: number
  weight: number
  fitnessLevel: string
  goal: string
  workoutLocation: string
  dietaryPreferences: string
  medicalHistory?: string
  stressLevel?: string
}

export async function POST(request: NextRequest) {
  try {
    const userProfile: UserProfile = await request.json()

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        plan: JSON.stringify({
          weeklyWorkout: [
            { day: "Monday", focus: "Upper Body", exercises: ["Push-ups", "Rows", "Shoulder Press"] },
            { day: "Wednesday", focus: "Lower Body", exercises: ["Squats", "Lunges", "Leg Press"] },
            { day: "Friday", focus: "Full Body", exercises: ["Deadlifts", "Pull-ups", "Planks"] },
          ],
          mealPlan: {
            Monday: {
              breakfast: "Oatmeal with berries (450 cal, 15g protein)",
              lunch: "Grilled chicken with rice (600 cal, 35g protein)",
              dinner: "Salmon with vegetables (550 cal, 40g protein)",
            },
          },
          tips: "Stay consistent, track your workouts, eat enough protein, and get adequate rest.",
        }),
      })
    }

    const prompt = `Create a personalized fitness and meal plan for:
Name: ${userProfile.name}
Age: ${userProfile.age}
Gender: ${userProfile.gender}
Height: ${userProfile.height}cm
Weight: ${userProfile.weight}kg
Fitness Level: ${userProfile.fitnessLevel}
Goal: ${userProfile.goal}
Workout Location: ${userProfile.workoutLocation}
Dietary Preferences: ${userProfile.dietaryPreferences}
${userProfile.medicalHistory ? `Medical History: ${userProfile.medicalHistory}` : ""}
${userProfile.stressLevel ? `Stress Level: ${userProfile.stressLevel}` : ""}

Please provide:
1. A detailed weekly workout plan with exercises, sets, reps, and rest times
2. A complete meal plan with breakfast, lunch, dinner, and snacks with macros
3. Tips for form, motivation, and nutrition

Format the response as JSON.`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        max_tokens: 4096,
        messages: [
          {
            role: "system",
            content:
              "You are an expert fitness coach and nutritionist. Create detailed, personalized plans based on user profiles.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] OpenAI API error:", errorData)
      return NextResponse.json({
        plan: JSON.stringify({
          weeklyWorkout: [
            { day: "Monday", focus: "Strength Training", exercises: ["Compound lifts", "Core work"] },
            { day: "Wednesday", focus: "Cardio & Flexibility", exercises: ["Running or cycling", "Stretching"] },
            { day: "Friday", focus: "Functional Fitness", exercises: ["Functional movements", "Conditioning"] },
          ],
          mealPlan: {
            default: "Follow balanced macros: 40% carbs, 30% protein, 30% fat. Track calories based on your goal.",
          },
          tips: "Progressive overload, recovery, and consistency are key to success.",
        }),
      })
    }

    const data = await response.json()
    const planContent = data.choices[0].message.content

    return NextResponse.json({ plan: planContent })
  } catch (error) {
    console.error("[v0] Plan generation error:", error)
    return NextResponse.json({
      plan: JSON.stringify({
        message: "Using default fitness plan. Customize based on your preferences.",
        quickTips: [
          "Warm up for 5-10 minutes before workouts",
          "Rest 60-90 seconds between sets",
          "Eat protein with every meal",
          "Stay hydrated throughout the day",
        ],
      }),
    })
  }
}
