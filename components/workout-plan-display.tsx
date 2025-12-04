"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { VoiceReadButton } from "@/components/voice-read-button"
import { downloadPlanAsHTML } from "@/utils/pdf-export"
import { AnimatedCard } from "@/components/animated-card"
import { AnimatedStat } from "@/components/animated-stat"
import { ExerciseCard } from "@/components/exercise-card"

interface WorkoutPlanDisplayProps {
  profile: any
  onNext: () => void
  onBack: () => void
}

interface Exercise {
  name: string
  sets: number
  reps: string
  rest: string
  notes: string
}

interface Workout {
  day: string
  focus: string
  exercises: Exercise[]
  duration: string
  intensity: "Low" | "Moderate" | "High"
}

export default function WorkoutPlanDisplay({ profile, onNext, onBack }: WorkoutPlanDisplayProps) {
  const workoutVariations: Workout[][] = [
    [
      {
        day: "Monday",
        focus: "Upper Body",
        intensity: "High",
        duration: "45 mins",
        exercises: [
          { name: "Push-ups", sets: 4, reps: "10-12", rest: "60s", notes: "Keep core tight" },
          { name: "Pull-ups", sets: 3, reps: "8-10", rest: "90s", notes: "Full range of motion" },
          { name: "Dumbbell Bench Press", sets: 4, reps: "8-12", rest: "90s", notes: "Control the weight" },
          { name: "Barbell Rows", sets: 4, reps: "6-8", rest: "2min", notes: "Heavy weight focus" },
        ],
      },
      {
        day: "Wednesday",
        focus: "Lower Body",
        intensity: "High",
        duration: "50 mins",
        exercises: [
          { name: "Squats", sets: 4, reps: "6-8", rest: "2min", notes: "Deep range of motion" },
          { name: "Deadlifts", sets: 3, reps: "5-6", rest: "3min", notes: "Form over weight" },
          { name: "Leg Press", sets: 3, reps: "10-12", rest: "90s", notes: "Full extension" },
          { name: "Lunges", sets: 3, reps: "12 each leg", rest: "60s", notes: "Alternate legs" },
        ],
      },
      {
        day: "Friday",
        focus: "Full Body",
        intensity: "Moderate",
        duration: "40 mins",
        exercises: [
          { name: "Kettlebell Swings", sets: 4, reps: "20", rest: "60s", notes: "Hip-driven movement" },
          { name: "Burpees", sets: 3, reps: "10-15", rest: "90s", notes: "Explosive power" },
          { name: "Mountain Climbers", sets: 3, reps: "30 total", rest: "60s", notes: "Core engagement" },
          { name: "Planks", sets: 3, reps: "45-60s", rest: "45s", notes: "Keep hips level" },
        ],
      },
    ],
    [
      {
        day: "Monday",
        focus: "Chest & Triceps",
        intensity: "High",
        duration: "50 mins",
        exercises: [
          { name: "Barbell Bench Press", sets: 4, reps: "6-8", rest: "2min", notes: "Explosive rep cadence" },
          { name: "Dumbbell Bench Press", sets: 3, reps: "8-10", rest: "90s", notes: "Shoulder engagement" },
          { name: "Kettlebell Swings", sets: 3, reps: "12-15", rest: "60s", notes: "Full stretch at bottom" },
          { name: "Planks", sets: 3, reps: "8-12", rest: "90s", notes: "Control the descent" },
        ],
      },
      {
        day: "Wednesday",
        focus: "Back & Biceps",
        intensity: "High",
        duration: "50 mins",
        exercises: [
          { name: "Deadlifts", sets: 4, reps: "5-6", rest: "2.5min", notes: "Powerlifting focus" },
          { name: "Barbell Rows", sets: 4, reps: "6-8", rest: "2min", notes: "Thick back builder" },
          { name: "Pull-ups", sets: 3, reps: "8-12", rest: "90s", notes: "Add weight if needed" },
          { name: "Mountain Climbers", sets: 3, reps: "8-10", rest: "90s", notes: "Strict form" },
        ],
      },
      {
        day: "Friday",
        focus: "Legs & Core",
        intensity: "Moderate",
        duration: "45 mins",
        exercises: [
          { name: "Squats", sets: 4, reps: "8-10", rest: "2min", notes: "Core activation" },
          { name: "Lunges", sets: 3, reps: "8-10", rest: "90s", notes: "Posterior chain focus" },
          { name: "Leg Press", sets: 3, reps: "10-12", rest: "60s", notes: "Full range" },
          { name: "Planks", sets: 3, reps: "10-15", rest: "60s", notes: "Progressive difficulty" },
        ],
      },
    ],
  ]

  const [planIndex, setPlanIndex] = useState(0)
  const [expandedDay, setExpandedDay] = useState<string | null>("Monday")
  const [isRegenerating, setIsRegenerating] = useState(false)
  const workouts = workoutVariations[planIndex]

  const handleRegenerate = async () => {
    setIsRegenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setPlanIndex((prev) => (prev + 1) % workoutVariations.length)
    setExpandedDay(workouts[0].day)
    setIsRegenerating(false)
  }

  const intensityColor = (intensity: string) => {
    switch (intensity) {
      case "High":
        return "bg-destructive/10 text-destructive"
      case "Moderate":
        return "bg-accent/10 text-accent"
      case "Low":
        return "bg-primary/10 text-primary"
      default:
        return "bg-muted"
    }
  }

  const getWorkoutSummary = () => {
    return `Your personalized workout plan for ${profile.name}. Training ${workouts.length} days per week for a total of 135 minutes. ${workouts.map((w) => `${w.day}: ${w.focus} workout, ${w.intensity} intensity, ${w.duration}`).join(". ")}`
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-foreground mb-2">Your Workout Plan</h2>
        <p className="text-muted-foreground">AI-personalized routine based on your profile</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <AnimatedCard delay={0.1}>
          <div className="p-4">
            <AnimatedStat value="135 mins" label="Total Weekly Duration" delay={0.2} />
          </div>
        </AnimatedCard>
        <AnimatedCard delay={0.2}>
          <div className="p-4">
            <AnimatedStat value={workouts.length} label="Training Days" delay={0.3} />
          </div>
        </AnimatedCard>
        <AnimatedCard delay={0.3}>
          <div className="p-4">
            <AnimatedStat value={7 - workouts.length} label="Rest Days" delay={0.4} />
          </div>
        </AnimatedCard>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={planIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-1 gap-6 mb-8"
        >
          {workouts.map((workout, idx) => (
            <motion.div
              key={workout.day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
            >
              <Card className="border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setExpandedDay(expandedDay === workout.day ? null : workout.day)}
                  className="w-full p-6 text-left hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground">{workout.day}</h3>
                      <p className="text-accent font-medium">{workout.focus}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-2">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${intensityColor(workout.intensity)}`}
                        >
                          {workout.intensity}
                        </span>
                        <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                          {workout.duration}
                        </span>
                      </div>
                      <motion.svg
                        className="w-5 h-5 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ rotate: expandedDay === workout.day ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </motion.svg>
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {expandedDay === workout.day && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-border bg-secondary/30"
                    >
                      <div className="p-6 space-y-4">
                        {workout.exercises.map((exercise, i) => (
                          <ExerciseCard
                            key={i}
                            name={exercise.name}
                            sets={exercise.sets}
                            reps={exercise.reps}
                            rest={exercise.rest}
                            notes={exercise.notes}
                            delay={0.1 * i}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="flex gap-3 mb-8 flex-wrap"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <VoiceReadButton text={getWorkoutSummary()} label="Read Workout Plan" />
        <Button variant="outline" onClick={handleRegenerate} disabled={isRegenerating} className="gap-2 bg-transparent">
          {isRegenerating ? (
            <>
              <motion.svg
                className="w-4 h-4"
                animate={{ rotate: 360 }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </motion.svg>
              Regenerating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Regenerate Plan
            </>
          )}
        </Button>
        <Button variant="outline" onClick={() => downloadPlanAsHTML(profile, workouts, [])} className="gap-2">
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
          Next: Meal Plan
        </Button>
      </motion.div>
    </div>
  )
}
