"use client"

import { useState } from "react"

interface FitnessData {
  profile: any
  currentStep: string
  progressData: any
  timestamp: number
}

export function useFitnessStorage() {
  const [isLoaded, setIsLoaded] = useState(false)

  const loadData = (): FitnessData | null => {
    if (typeof window === "undefined") return null
    try {
      const stored = localStorage.getItem("fitnessData")
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  const saveData = (data: FitnessData) => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem("fitnessData", JSON.stringify(data))
    } catch {
      console.error("Failed to save fitness data")
    }
  }

  const clearData = () => {
    if (typeof window === "undefined") return
    try {
      localStorage.removeItem("fitnessData")
    } catch {
      console.error("Failed to clear fitness data")
    }
  }

  return { loadData, saveData, clearData, isLoaded, setIsLoaded }
}
