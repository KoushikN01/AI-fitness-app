import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, type } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        imageUrl: `/placeholder.svg?height=1024&width=1024&query=${encodeURIComponent(prompt)}`,
      })
    }

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt:
          type === "exercise" ? `Professional gym exercise demonstration: ${prompt}` : `Food photography: ${prompt}`,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      }),
    })

    if (!response.ok) {
      console.error("Image generation API error:", response.statusText)
      return NextResponse.json({
        imageUrl: `/placeholder.svg?height=1024&width=1024&query=${encodeURIComponent(prompt)}`,
      })
    }

    const data = await response.json()
    const imageUrl = data.data[0].url

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("Image generation error:", error)
    const prompt = request.body ? "fitness" : "exercise"
    return NextResponse.json({
      imageUrl: `/placeholder.svg?height=1024&width=1024&query=${encodeURIComponent(prompt)}`,
    })
  }
}
