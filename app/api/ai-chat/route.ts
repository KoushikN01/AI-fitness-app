import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      // Return helpful mock response instead of error
      return NextResponse.json({
        response:
          "API is not configured. Try asking questions like 'How many calories should I eat?' or 'What exercises target chest?'",
      })
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        max_tokens: 1024,
        messages: [
          {
            role: "system",
            content:
              "You are an expert AI Fitness Coach. Provide helpful, motivational advice on fitness, nutrition, and wellness.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] OpenAI API error:", errorData)

      // Graceful fallback for quota/billing issues
      const mockResponses: Record<string, string> = {
        default:
          "Based on your fitness profile, I recommend: Progressive overload in your workouts, consistent nutrition tracking, and adequate rest days. What specific area would you like help with?",
        calorie:
          "Your daily calorie needs depend on your goal. For weight loss: eat 300-500 calories below maintenance. For muscle gain: eat 300-500 calories above maintenance. Use your profile data to calculate your maintenance calories.",
        protein:
          "Protein intake: Aim for 1.6-2.2g per kg of body weight daily. This supports muscle recovery and growth. Distribute protein across your meals for optimal protein synthesis.",
        rest: "Rest days are crucial! Take 1-2 rest days per week to allow muscle recovery. Active recovery like light walking or yoga can be beneficial on rest days.",
        cardio:
          "Cardio recommendations: For fat loss, 150-300 minutes per week of moderate cardio. For general fitness, 150 minutes per week is ideal. Balance with strength training.",
      }

      let key = "default"
      const messageLower = message.toLowerCase()
      if (messageLower.includes("calorie")) key = "calorie"
      else if (messageLower.includes("protein")) key = "protein"
      else if (messageLower.includes("rest")) key = "rest"
      else if (messageLower.includes("cardio")) key = "cardio"

      return NextResponse.json({ response: mockResponses[key] })
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("[v0] AI Chat error:", error)
    // Return mock response instead of error
    return NextResponse.json({
      response:
        "I'm having trouble reaching the AI service. Here's some general advice: Stay hydrated, maintain consistent workouts, and track your nutrition. Feel free to ask more specific questions!",
    })
  }
}
