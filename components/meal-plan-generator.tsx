"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { VoiceReadButton } from "@/components/voice-read-button"
import { downloadPlanAsHTML } from "@/utils/pdf-export"
import { MealCard } from "@/components/meal-card"
import { AnimatedCard } from "@/components/animated-card"
import { AnimatedStat } from "@/components/animated-stat"

interface MealPlanGeneratorProps {
  profile: any
  onNext: () => void
  onBack: () => void
}

interface Meal {
  time: string
  meal: string
  cals: number
  protein: number
  carbs: number
  fat: number
  ingredients: string[]
}

interface DayPlan {
  day: string
  meals: Meal[]
  totalCals: number
}

export default function MealPlanGenerator({ profile, onNext, onBack }: MealPlanGeneratorProps) {
  const mealPlans: DayPlan[] = [
    {
      day: "Monday",
      totalCals: 1850,
      meals: [
        {
          time: "Breakfast",
          meal: "Oatmeal with berries and almonds",
          cals: 350,
          protein: 12,
          carbs: 45,
          fat: 8,
          ingredients: ["Oats", "Blueberries", "Almonds", "Honey"],
        },
        {
          time: "Lunch",
          meal: "Grilled chicken breast with brown rice and broccoli",
          cals: 550,
          protein: 45,
          carbs: 52,
          fat: 10,
          ingredients: ["Chicken Breast", "Brown Rice", "Broccoli", "Olive Oil"],
        },
        {
          time: "Snack",
          meal: "Greek yogurt with granola",
          cals: 200,
          protein: 20,
          carbs: 22,
          fat: 4,
          ingredients: ["Greek Yogurt", "Granola", "Honey"],
        },
        {
          time: "Dinner",
          meal: "Salmon with sweet potato and green beans",
          cals: 650,
          protein: 42,
          carbs: 58,
          fat: 18,
          ingredients: ["Salmon", "Sweet Potato", "Green Beans", "Lemon"],
        },
      ],
    },
    {
      day: "Wednesday",
      totalCals: 1900,
      meals: [
        {
          time: "Breakfast",
          meal: "Scrambled eggs with whole wheat toast",
          cals: 320,
          protein: 18,
          carbs: 28,
          fat: 12,
          ingredients: ["Eggs", "Whole Wheat Bread", "Butter", "Salt"],
        },
        {
          time: "Lunch",
          meal: "Turkey sandwich with avocado",
          cals: 480,
          protein: 35,
          carbs: 42,
          fat: 16,
          ingredients: ["Turkey Breast", "Whole Wheat Bread", "Avocado", "Lettuce"],
        },
        {
          time: "Snack",
          meal: "Protein shake with banana",
          cals: 280,
          protein: 25,
          carbs: 32,
          fat: 3,
          ingredients: ["Whey Protein", "Banana", "Milk", "Almond Butter"],
        },
        {
          time: "Dinner",
          meal: "Lean beef steak with asparagus and rice",
          cals: 700,
          protein: 50,
          carbs: 65,
          fat: 20,
          ingredients: ["Beef Steak", "Asparagus", "White Rice", "Olive Oil"],
        },
      ],
    },
  ]

  const [selectedDay, setSelectedDay] = useState(0)
  const currentDay = mealPlans[selectedDay]

  const dailyMacros = {
    protein: currentDay.meals.reduce((sum, meal) => sum + meal.protein, 0),
    carbs: currentDay.meals.reduce((sum, meal) => sum + meal.carbs, 0),
    fat: currentDay.meals.reduce((sum, meal) => sum + meal.fat, 0),
  }

  const getMealSummary = () => {
    const mealsText = currentDay.meals.map((m) => `${m.time}: ${m.meal} with ${m.cals} calories`).join(". ")
    return `Your meal plan for ${currentDay.day}. Total daily calories: ${currentDay.totalCals}. ${mealsText}`
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-foreground mb-2">Your Meal Plan</h2>
        <p className="text-muted-foreground">Tailored nutrition to support your fitness goals</p>
      </motion.div>

      <motion.div
        className="flex gap-3 mb-8 overflow-x-auto pb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {mealPlans.map((plan, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedDay(idx)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedDay === idx
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-foreground hover:bg-secondary"
            }`}
          >
            {plan.day}
          </button>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <AnimatedCard delay={0.1}>
          <div className="p-4">
            <AnimatedStat value={currentDay.totalCals} label="Daily Calories" delay={0.2} />
          </div>
        </AnimatedCard>
        <AnimatedCard delay={0.2}>
          <div className="p-4">
            <AnimatedStat value={`${dailyMacros.protein}g`} label="Protein" delay={0.3} />
          </div>
        </AnimatedCard>
        <AnimatedCard delay={0.3}>
          <div className="p-4">
            <AnimatedStat value={`${dailyMacros.carbs}g`} label="Carbs" delay={0.4} />
          </div>
        </AnimatedCard>
        <AnimatedCard delay={0.4}>
          <div className="p-4">
            <AnimatedStat value={`${dailyMacros.fat}g`} label="Fat" delay={0.5} />
          </div>
        </AnimatedCard>
      </div>

      <motion.div
        className="space-y-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {currentDay.meals.map((meal, i) => (
          <MealCard
            key={i}
            time={meal.time}
            meal={meal.meal}
            cals={meal.cals}
            protein={meal.protein}
            carbs={meal.carbs}
            fat={meal.fat}
            ingredients={meal.ingredients}
            delay={0.5 + i * 0.1}
          />
        ))}
      </motion.div>

      <motion.div
        className="flex gap-3 mb-8 flex-wrap"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <VoiceReadButton text={getMealSummary()} label="Read Meal Plan" />
        <Button variant="outline" onClick={() => downloadPlanAsHTML(profile, [], mealPlans)} className="gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download Plan
        </Button>
      </motion.div>

      <motion.div
        className="flex justify-between gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <Button
          onClick={onBack}
          variant="outline"
          className="border-border text-foreground hover:bg-secondary bg-transparent"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Button>
        <Button onClick={onNext} className="bg-primary text-primary-foreground hover:bg-primary/90">
          View Progress Tracking
        </Button>
      </motion.div>
    </div>
  )
}
