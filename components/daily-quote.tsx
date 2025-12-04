"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

const MOTIVATION_QUOTES = [
  "The only bad workout is the one you didn't do.",
  "Your body can stand almost anything. It's your mind that you need to convince.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Believe in yourself and you're halfway there.",
  "Push yourself, because no one else is going to do it for you.",
  "Fitness is not about being better than someone else. It's about being better than you used to be.",
  "Your future self will thank you for the work you put in today.",
  "Don't stop when you're tired. Stop when you're done.",
  "Every rep, every mile, every bead of sweat brings you closer to your goal.",
  "The hardest part is starting. Keep going.",
  "Strong is the new skinny.",
  "You don't have to be great to start, but you have to start to be great.",
  "Excellence is not a destination; it is a continuous journey that never ends.",
  "No pain, no gain - but that pain means something.",
]

export function DailyQuote() {
  const [quote, setQuote] = useState("")

  useEffect(() => {
    const today = new Date()
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24,
    )
    const quoteIndex = dayOfYear % MOTIVATION_QUOTES.length
    setQuote(MOTIVATION_QUOTES[quoteIndex])
  }, [])

  if (!quote) return null

  return (
    <Card className="p-6 border border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="flex items-start gap-4">
        <div className="text-3xl">💪</div>
        <div className="flex-1">
          <p className="text-lg font-semibold text-foreground italic">"{quote}"</p>
          <p className="text-sm text-muted-foreground mt-2">Daily Motivation</p>
        </div>
      </div>
    </Card>
  )
}
