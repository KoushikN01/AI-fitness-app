"use client"

import { motion } from "framer-motion"
import { useState } from "react"

interface MealCardProps {
  time: string
  meal: string
  cals: number
  protein: number
  carbs: number
  fat: number
  ingredients: string[]
  delay?: number
}

export function MealCard({ time, meal, cals, protein, carbs, fat, ingredients, delay = 0 }: MealCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const getMealImage = (mealName: string) => {
    const mealMap: { [key: string]: string } = {
      "Oatmeal with berries and almonds": "oatmeal bowl with berries",
      "Grilled chicken breast with brown rice and broccoli": "grilled chicken with rice",
      "Greek yogurt with granola": "greek yogurt with granola",
      "Salmon with sweet potato and green beans": "grilled salmon with vegetables",
      "Scrambled eggs with whole wheat toast": "scrambled eggs with toast",
      "Turkey sandwich with avocado": "turkey sandwich healthy",
      "Protein shake with banana": "protein smoothie drink",
      "Lean beef steak with asparagus and rice": "grilled steak with vegetables",
    }
    return mealMap[mealName] || "healthy meal"
  }

  const handleImageClick = async () => {
    if (imageUrl || isGenerating) return

    setIsGenerating(true)
    try {
      const prompt = getMealImage(meal)
      const response = await fetch("/api/ai-image-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type: "food" }),
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="p-6 border border-border bg-card hover:shadow-md transition-shadow rounded-lg"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-1">
          <p className="font-semibold text-foreground text-lg">{time}</p>
          <p className="text-muted-foreground mt-1">{meal}</p>
        </div>
        <button
          onClick={handleImageClick}
          disabled={isGenerating}
          className="w-24 h-24 rounded-lg overflow-hidden bg-secondary flex-shrink-0 relative group cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50"
          title={imageUrl ? "Image generated" : "Click to generate AI image"}
        >
          <img
            src={displayImage}
            alt={meal}
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

      <div className="flex items-center justify-between mb-3">
        <span className="text-accent font-semibold text-lg">{cals} cal</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
        <div className="flex items-center gap-2 text-foreground">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="font-medium">{protein}g protein</span>
        </div>
        <div className="flex items-center gap-2 text-foreground">
          <div className="w-3 h-3 rounded-full bg-accent"></div>
          <span className="font-medium">{carbs}g carbs</span>
        </div>
        <div className="flex items-center gap-2 text-foreground">
          <div className="w-3 h-3 rounded-full bg-chart-3"></div>
          <span className="font-medium">{fat}g fat</span>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground font-medium mb-2">Ingredients:</p>
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ingredient, idx) => (
            <span key={idx} className="text-xs bg-secondary text-foreground px-3 py-1 rounded-full">
              {ingredient}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
