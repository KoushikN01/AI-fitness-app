"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

const MOTIVATIONAL_TIPS = [
  {
    title: "Stay Hydrated",
    message: "Drink water throughout your workout for optimal performance",
    icon: "💧",
  },
  {
    title: "Focus on Form",
    message: "Quality over quantity - proper form prevents injuries",
    icon: "🎯",
  },
  {
    title: "Rest is Important",
    message: "Recovery days help muscles grow and prevent burnout",
    icon: "😴",
  },
  {
    title: "Track Progress",
    message: "Keep a log of your workouts to see improvement over time",
    icon: "📊",
  },
  { title: "Warm Up First", message: "5-10 minutes of warm-up prepares your body for exercise", icon: "🔥" },
  {
    title: "Nutrition Matters",
    message: "Fuel your body with proper nutrition to support your goals",
    icon: "🥗",
  },
]

export function MotivationBanner() {
  const [tip, setTip] = useState(MOTIVATIONAL_TIPS[0])

  useEffect(() => {
    const hour = new Date().getHours()
    const tipIndex = hour % MOTIVATIONAL_TIPS.length
    setTip(MOTIVATIONAL_TIPS[tipIndex])
  }, [])

  return (
    <Card className="p-4 border border-accent/30 bg-gradient-to-r from-accent/5 to-primary/5">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{tip.icon}</span>
        <div className="flex-1">
          <p className="font-semibold text-foreground">{tip.title}</p>
          <p className="text-sm text-muted-foreground">{tip.message}</p>
        </div>
      </div>
    </Card>
  )
}
