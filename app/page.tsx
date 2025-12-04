"use client"

import { useState, useEffect } from "react"
import FitnessProfileForm from "@/components/fitness-profile-form"
import WorkoutPlanDisplay from "@/components/workout-plan-display"
import MealPlanGenerator from "@/components/meal-plan-generator"
import ProgressDashboard from "@/components/progress-dashboard"
import AIChatAssistant from "@/components/ai-chat-assistant"
import { DailyQuote } from "@/components/daily-quote"
import { MotivationBanner } from "@/components/motivation-banner"
import { useTheme } from "@/components/theme-provider"
import { useFitnessStorage } from "@/hooks/use-fitness-storage"

export default function Home() {
  const [currentStep, setCurrentStep] = useState<"form" | "workout" | "meal" | "progress">("form")
  const [userProfile, setUserProfile] = useState(null)
  const [showChat, setShowChat] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const { theme, toggleTheme, mounted } = useTheme()
  const { loadData, saveData, clearData } = useFitnessStorage()

  useEffect(() => {
    const saved = loadData()
    if (saved) {
      setUserProfile(saved.profile)
      setCurrentStep(saved.currentStep as any)
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded && userProfile) {
      const data = {
        profile: userProfile,
        currentStep,
        progressData: null,
        timestamp: Date.now(),
      }
      saveData(data)
    }
  }, [userProfile, currentStep, isLoaded])

  const handleProfileSubmit = (profile: any) => {
    setUserProfile(profile)
    setCurrentStep("workout")
  }

  const handleStartOver = () => {
    if (window.confirm("Are you sure? This will clear your saved progress.")) {
      clearData()
      setUserProfile(null)
      setCurrentStep("form")
    }
  }

  if (!isLoaded) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              F
            </div>
            <h1 className="text-xl font-bold text-foreground">Fitness Coach</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Step {currentStep === "form" ? 1 : currentStep === "workout" ? 2 : currentStep === "meal" ? 3 : 4}
            </div>
            <button
              onClick={toggleTheme}
              className="relative p-2 rounded-lg bg-muted hover:bg-muted/80 transition-all duration-200 hover:scale-105 active:scale-95"
              title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              aria-label="Toggle theme"
            >
              {!mounted ? (
                <div className="w-5 h-5" />
              ) : theme === "light" ? (
                <svg
                  className="w-5 h-5 text-foreground transition-all duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-foreground transition-all duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </button>
            {currentStep !== "form" && (
              <button
                onClick={() => setShowChat(!showChat)}
                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                title="Open AI Chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </button>
            )}
            {userProfile && (
              <button
                onClick={handleStartOver}
                className="text-xs px-3 py-1 rounded-md bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
                title="Start over with a new plan"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep !== "form" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <DailyQuote />
            <MotivationBanner />
          </div>
        )}

        {currentStep === "form" && <FitnessProfileForm onSubmit={handleProfileSubmit} />}
        {currentStep === "workout" && userProfile && (
          <WorkoutPlanDisplay
            profile={userProfile}
            onNext={() => setCurrentStep("meal")}
            onBack={() => setCurrentStep("form")}
          />
        )}
        {currentStep === "meal" && userProfile && (
          <MealPlanGenerator
            profile={userProfile}
            onNext={() => setCurrentStep("progress")}
            onBack={() => setCurrentStep("workout")}
          />
        )}
        {currentStep === "progress" && userProfile && (
          <ProgressDashboard profile={userProfile} onBack={() => setCurrentStep("meal")} />
        )}
      </div>

      {showChat && currentStep !== "form" && (
        <div className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] shadow-lg z-40">
          <AIChatAssistant />
        </div>
      )}
    </main>
  )
}
