"use client"

import { motion } from "framer-motion"
import { useState } from "react"

interface ExerciseCardProps {
  name: string
  sets: number
  reps: string
  rest: string
  notes: string
  delay?: number
}

export function ExerciseCard({ name, sets, reps, rest, notes, delay = 0 }: ExerciseCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const getExerciseImage = (exerciseName: string) => {
    const exerciseMap: { [key: string]: string } = {
      "Push-ups": "man doing push-ups exercise",
      "Pull-ups": "man doing pull-ups exercise",
      "Dumbbell Bench Press": "man doing dumbbell bench press",
      "Barbell Rows": "man doing barbell rows",
      Squats: "man doing squats exercise",
      Deadlifts: "man doing deadlifts",
      "Leg Press": "leg press machine exercise",
      Lunges: "man doing lunges exercise",
      "Kettlebell Swings": "kettlebell swing exercise",
      Burpees: "burpees exercise",
      "Mountain Climbers": "mountain climbers exercise",
      Planks: "plank exercise",
    }
    return exerciseMap[exerciseName] || "fitness exercise"
  }

  const handleImageClick = async () => {
    if (imageUrl || isGenerating) return

    setIsGenerating(true)
    try {
      const prompt = getExerciseImage(name)
      const response = await fetch("/api/ai-image-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type: "exercise" }),
      })

      if (response.ok) {
        const data = await response.json()
        setImageUrl(data.imageUrl)
      }
    } catch (error) {
      console.error("Error generating image:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const displayImage = imageUrl || "/placeholder.svg"

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="border-l-2 border-primary pl-4"
    >
      <div className="flex items-start justify-between mb-3 gap-4">
        <div className="flex-1">
          <p className="font-semibold text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground mt-1">Tip: {notes}</p>
        </div>
        <button
          onClick={handleImageClick}
          disabled={isGenerating}
          className="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0 relative group cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50"
          title={imageUrl ? "Image generated" : "Click to generate AI image"}
        >
          <img
            src={displayImage}
            alt={name}
            className="w-full h-full object-cover"
          />
          {isGenerating && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {!imageUrl && !isGenerating && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">AI</span>
            </div>
          )}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground">
        <div>
          <span className="font-semibold text-foreground">{sets}</span> sets
        </div>
        <div>
          <span className="font-semibold text-foreground">{reps}</span> reps
        </div>
        <div>
          <span className="font-semibold text-foreground">{rest}</span> rest
        </div>
      </div>
    </motion.div>
  )
}
