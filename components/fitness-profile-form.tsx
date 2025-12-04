"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FitnessProfileFormProps {
  onSubmit: (profile: any) => void
}

export default function FitnessProfileForm({ onSubmit }: FitnessProfileFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    fitnessLevel: "beginner",
    goal: "weight-loss",
    daysPerWeek: "3",
    injuries: "",
    dietaryRestrictions: "",
  })

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      onSubmit(formData)
      setLoading(false)
    }, 1000)
  }

  const isStep1Valid = formData.name && formData.age && formData.weight && formData.height
  const isStep2Valid = formData.goal && formData.daysPerWeek && formData.fitnessLevel

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section with AI Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <h2 className="text-4xl font-bold text-foreground">AI-Powered Fitness Plan Generator</h2>
          <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 px-4 py-2 text-sm">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            AI Powered
          </Badge>
        </div>
        <p className="text-lg text-muted-foreground mb-2">
          Get a personalized workout and nutrition plan tailored by AI
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Personalized Plans
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            AI Analysis
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Smart Recommendations
          </div>
        </div>
      </motion.div>

      {/* AI Features Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card className="p-6 border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-foreground">AI-Powered Personalization</h3>
                <Badge variant="outline" className="text-xs">Advanced AI</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Our AI analyzes your profile to create a completely personalized fitness and nutrition plan. 
                Every recommendation is tailored to your specific goals, fitness level, and preferences.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  <span className="text-muted-foreground">Smart Workout Plans</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  <span className="text-muted-foreground">Nutrition Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  <span className="text-muted-foreground">Progress Tracking</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className={`flex-1 h-2 rounded-full transition-all ${step >= 1 ? 'bg-primary' : 'bg-secondary'}`}></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
            step >= 1 ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-secondary text-muted-foreground'
          }`}>
            1
          </div>
          <div className={`flex-1 h-2 rounded-full transition-all ${step >= 2 ? 'bg-primary' : 'bg-secondary'}`}></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
            step >= 2 ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-secondary text-muted-foreground'
          }`}>
            2
          </div>
          <div className={`flex-1 h-2 rounded-full transition-all ${step >= 2 ? 'bg-primary' : 'bg-secondary'}`}></div>
        </div>
        <div className="flex items-center justify-between text-sm font-medium">
          <span className={step >= 1 ? 'text-primary' : 'text-muted-foreground'}>Personal Info</span>
          <span className={step >= 2 ? 'text-primary' : 'text-muted-foreground'}>Goals & Preferences</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 space-y-6 border border-border bg-card shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-bl-full"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-6">
                    <h3 className="text-2xl font-bold text-foreground">Personal Information</h3>
                    <Badge variant="outline" className="text-xs">Step 1 of 2</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    Help our AI understand your current fitness level and body metrics
                  </p>
                  <div className="grid grid-cols-1 gap-6">
              <div>
                <Label htmlFor="name" className="text-foreground mb-2 block">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="bg-input border-border h-12 text-base focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age" className="text-foreground mb-2 block">
                    Age
                  </Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="25"
                    className="bg-input border-border h-12 text-base focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="weight" className="text-foreground mb-2 block">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="70"
                    className="bg-input border-border h-12 text-base focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="height" className="text-foreground mb-2 block">
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder="180"
                  className="bg-input border-border h-12 text-base focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fitnessLevel" className="text-foreground mb-2 block">
                    Current Level
                  </Label>
                  <select
                    id="fitnessLevel"
                    name="fitnessLevel"
                    value={formData.fitnessLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary h-12 text-base"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="injuries" className="text-foreground mb-2 block">
                    Injuries/Limitations
                  </Label>
                  <Input
                    id="injuries"
                    name="injuries"
                    value={formData.injuries}
                    onChange={handleInputChange}
                    placeholder="None"
                    className="bg-input border-border h-12 text-base focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-border">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!isStep1Valid}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base font-semibold gap-2"
                >
                  Continue to Goals
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </div>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 space-y-6 border border-border bg-card shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-bl-full"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-6">
                    <h3 className="text-2xl font-bold text-foreground">Goals & Preferences</h3>
                    <Badge variant="outline" className="text-xs">Step 2 of 2</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    Tell our AI what you want to achieve and your preferences
                  </p>
                  <div className="grid grid-cols-1 gap-6">
              <div>
                <Label htmlFor="goal" className="text-foreground mb-2 block">
                  Primary Goal
                </Label>
                <select
                  id="goal"
                  name="goal"
                  value={formData.goal}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary h-12 text-base"
                >
                  <option value="weight-loss">Weight Loss</option>
                  <option value="muscle-gain">Muscle Gain</option>
                  <option value="endurance">Build Endurance</option>
                  <option value="flexibility">Improve Flexibility</option>
                  <option value="general-fitness">General Fitness</option>
                </select>
              </div>

              <div>
                <Label htmlFor="daysPerWeek" className="text-foreground mb-2 block">
                  Training Days Per Week
                </Label>
                <select
                  id="daysPerWeek"
                  name="daysPerWeek"
                  value={formData.daysPerWeek}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary h-12 text-base"
                >
                  <option value="2">2 days</option>
                  <option value="3">3 days</option>
                  <option value="4">4 days</option>
                  <option value="5">5 days</option>
                  <option value="6">6 days</option>
                </select>
              </div>

              <div>
                <Label htmlFor="dietaryRestrictions" className="text-foreground mb-2 block">
                  Dietary Restrictions
                </Label>
                <Input
                  id="dietaryRestrictions"
                  name="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={handleInputChange}
                  placeholder="e.g., vegan, gluten-free, nut allergy"
                  className="bg-input border-border h-12 text-base focus:ring-2 focus:ring-primary"
                />
              </div>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-border gap-4">
                <Button
                  type="button"
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="border-border text-foreground hover:bg-secondary px-6 py-6"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={!isStep2Valid || loading}
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90 px-8 py-6 text-base font-semibold gap-2 shadow-lg"
                >
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      AI is Generating Your Plan...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                      Generate AI Plan
                    </>
                  )}
                </Button>
              </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  )
}
