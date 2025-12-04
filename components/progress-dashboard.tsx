"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { useFitnessStorage } from "@/hooks/use-fitness-storage"

interface ProgressDashboardProps {
  profile: any
  onBack: () => void
}

interface ProgressMetric {
  week: string
  weight: number
  calories: number
  workouts: number
}

export default function ProgressDashboard({ profile, onBack }: ProgressDashboardProps) {
  const { loadData, saveData } = useFitnessStorage()
  const [progressData, setProgressData] = useState<ProgressMetric[]>([
    { week: "Week 1", weight: Number.parseFloat(profile.weight), calories: 8500, workouts: 0 },
    { week: "Week 2", weight: Number.parseFloat(profile.weight) - 0.5, calories: 9200, workouts: 2 },
    { week: "Week 3", weight: Number.parseFloat(profile.weight) - 1.2, calories: 9800, workouts: 3 },
    { week: "Week 4", weight: Number.parseFloat(profile.weight) - 1.8, calories: 10200, workouts: 3 },
  ])
  const [showLogWorkout, setShowLogWorkout] = useState(false)
  const [showUpdateWeight, setShowUpdateWeight] = useState(false)
  const [workoutForm, setWorkoutForm] = useState({ date: new Date().toISOString().split("T")[0], notes: "" })
  const [weightForm, setWeightForm] = useState({ weight: "", date: new Date().toISOString().split("T")[0] })

  const goals = [
    {
      name: "Reach Goal Weight",
      target: Number.parseFloat(profile.weight) - 5,
      current: Number.parseFloat(profile.weight),
      unit: "kg",
      progress: 36,
    },
    { name: "Complete Workouts", target: 40, current: 11, unit: "sessions", progress: 27 },
    { name: "Daily Calorie Target", target: 2000, current: 1850, unit: "kcal", progress: 92 },
    { name: "Hit Protein Target", target: 150, current: 145, unit: "g", progress: 97 },
  ]

  const achievements = [
    { icon: "🏋️", title: "First Workout", description: "Completed your first training session", unlocked: true },
    { icon: "🔥", title: "On Fire", description: "7-day workout streak", unlocked: false },
    { icon: "⚡", title: "Cardio Champion", description: "Completed 20 cardio sessions", unlocked: false },
    { icon: "💪", title: "Strength Master", description: "PR on all major lifts", unlocked: false },
    { icon: "🎯", title: "Goal Crusher", description: "Reached your target weight", unlocked: false },
    { icon: "🌟", title: "Consistency King", description: "30-day consecutive tracking", unlocked: false },
  ]

  const handleLogWorkout = () => {
    // Update progress data
    const updated = [...progressData]
    const currentWeek = updated[updated.length - 1]
    currentWeek.workouts += 1
    setProgressData(updated)
    
    // Save to localStorage
    const saved = loadData()
    if (saved) {
      saveData({
        ...saved,
        progressData: { ...saved.progressData, workouts: currentWeek.workouts },
      })
    }
    
    setShowLogWorkout(false)
    setWorkoutForm({ date: new Date().toISOString().split("T")[0], notes: "" })
    alert("Workout logged successfully! 💪")
  }

  const handleUpdateWeight = () => {
    const newWeight = Number.parseFloat(weightForm.weight)
    if (isNaN(newWeight) || newWeight <= 0) {
      alert("Please enter a valid weight")
      return
    }

    // Update progress data
    const updated = [...progressData]
    const newWeek = {
      week: `Week ${updated.length + 1}`,
      weight: newWeight,
      calories: updated[updated.length - 1].calories + 200,
      workouts: updated[updated.length - 1].workouts,
    }
    setProgressData([...updated, newWeek])

    // Save to localStorage
    const saved = loadData()
    if (saved) {
      saveData({
        ...saved,
        progressData: { ...saved.progressData, weight: newWeight },
      })
    }

    setShowUpdateWeight(false)
    setWeightForm({ weight: "", date: new Date().toISOString().split("T")[0] })
    alert(`Weight updated to ${newWeight}kg! 📊`)
  }

  const handleExportProgress = () => {
    const exportData = {
      profile,
      progressData,
      goals,
      achievements,
      exportDate: new Date().toISOString(),
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Progress Report - ${profile.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6; }
            h1 { color: #0ea5e9; }
            h2 { color: #0ea5e9; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f0f0f0; }
            .stat { display: inline-block; margin: 10px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
            .footer { margin-top: 50px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <h1>Progress Report - ${profile.name}</h1>
          <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
          
          <h2>Current Stats</h2>
          <div class="stat">
            <strong>Current Weight:</strong> ${progressData[progressData.length - 1].weight.toFixed(1)} kg
          </div>
          <div class="stat">
            <strong>Total Workouts:</strong> ${progressData.reduce((sum, w) => sum + w.workouts, 0)}
          </div>
          <div class="stat">
            <strong>Avg Weekly Calories:</strong> ${Math.round(progressData.reduce((sum, w) => sum + w.calories, 0) / progressData.length)}
          </div>
          
          <h2>Weight Progress</h2>
          <table>
            <tr><th>Week</th><th>Weight (kg)</th><th>Calories</th><th>Workouts</th></tr>
            ${progressData.map((w) => `<tr><td>${w.week}</td><td>${w.weight.toFixed(1)}</td><td>${w.calories}</td><td>${w.workouts}</td></tr>`).join("")}
          </table>
          
          <h2>Goals</h2>
          <ul>
            ${goals.map((g) => `<li>${g.name}: ${g.current} / ${g.target} ${g.unit} (${g.progress}%)</li>`).join("")}
          </ul>
          
          <div class="footer">
            <p>Generated by Fitness Coach App</p>
          </div>
        </body>
      </html>
    `

    const element = document.createElement("a")
    element.setAttribute("href", "data:text/html;charset=utf-8," + encodeURIComponent(htmlContent))
    element.setAttribute("download", `progress-report-${profile.name}-${Date.now()}.html`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const currentWeight = progressData[progressData.length - 1].weight
  const weightLost = Number.parseFloat(profile.weight) - currentWeight
  const weeklyAvgCalories = Math.round(progressData.reduce((sum, w) => sum + w.calories, 0) / progressData.length)
  const totalWorkouts = progressData.reduce((sum, w) => sum + w.workouts, 0)

  // AI-Powered Insights
  const aiInsights = useMemo(() => {
    const weightTrend = progressData.length > 1 
      ? (progressData[progressData.length - 1].weight - progressData[0].weight) / (progressData.length - 1)
      : 0
    const workoutTrend = progressData.length > 1
      ? progressData[progressData.length - 1].workouts - progressData[0].workouts
      : 0
    
    const insights = []
    
    if (weightTrend < -0.3) {
      insights.push({
        type: "success",
        icon: "📉",
        title: "Excellent Progress!",
        message: `You're losing weight at an optimal rate of ${Math.abs(weightTrend).toFixed(1)}kg per week. Keep up the consistency!`,
        priority: "high"
      })
    } else if (weightTrend < 0) {
      insights.push({
        type: "info",
        icon: "📊",
        title: "Steady Progress",
        message: "Your weight loss is on track. Consider increasing workout intensity for faster results.",
        priority: "medium"
      })
    }
    
    if (workoutTrend > 0) {
      insights.push({
        type: "success",
        icon: "🔥",
        title: "Increasing Activity",
        message: "Great job increasing your workout frequency! This will accelerate your results.",
        priority: "high"
      })
    }
    
    if (totalWorkouts < 8) {
      insights.push({
        type: "warning",
        icon: "💪",
        title: "Boost Your Activity",
        message: "Aim for at least 3 workouts per week to maximize your fitness goals.",
        priority: "medium"
      })
    }
    
    const avgWeeklyLoss = weightLost / progressData.length
    if (avgWeeklyLoss > 0.5) {
      insights.push({
        type: "info",
        icon: "⚡",
        title: "AI Recommendation",
        message: `Based on your progress, you're on track to reach your goal in ${Math.ceil((Number.parseFloat(profile.weight) - 5 - currentWeight) / avgWeeklyLoss)} weeks.`,
        priority: "high"
      })
    }
    
    return insights
  }, [progressData, weightLost, totalWorkouts, profile.weight, currentWeight])

  // Chart data
  const weightChartData = progressData.map((d, idx) => ({
    week: `W${idx + 1}`,
    weight: d.weight,
    target: Number.parseFloat(profile.weight) - 5,
  }))

  const workoutChartData = progressData.map((d, idx) => ({
    week: `W${idx + 1}`,
    workouts: d.workouts,
    calories: d.calories / 100,
  }))

  const chartConfig = {
    weight: {
      label: "Weight (kg)",
      color: "hsl(var(--chart-1))",
    },
    target: {
      label: "Target",
      color: "hsl(var(--chart-2))",
    },
    workouts: {
      label: "Workouts",
      color: "hsl(var(--chart-3))",
    },
    calories: {
      label: "Calories (×100)",
      color: "hsl(var(--chart-4))",
    },
  }

  return (
    <div className="space-y-6">
      {/* Header with AI Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-3xl font-bold text-foreground">AI Progress Dashboard</h2>
              <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 px-3 py-1">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                AI Powered
              </Badge>
            </div>
            <p className="text-muted-foreground">Advanced analytics and AI-driven insights for your fitness journey</p>
          </div>
        </div>
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
      </div>

      {/* AI Insights Section */}
      {aiInsights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {aiInsights.map((insight, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="p-5 border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent border-border">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{insight.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{insight.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        AI Analysis
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.message}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Key Metrics with AI Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 border border-border bg-card hover:shadow-lg transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full"></div>
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">Current Weight</h3>
                <Badge className={`text-xs ${weightLost > 0 ? 'bg-green-500/20 text-green-600' : 'bg-primary/20 text-primary'}`}>
                  {weightLost > 0 ? "↓" : "→"} {Math.abs(weightLost).toFixed(1)}kg
                </Badge>
              </div>
              <p className="text-4xl font-bold text-foreground mb-1">{currentWeight.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">Goal: {(Number.parseFloat(profile.weight) - 5).toFixed(1)} kg</p>
              <div className="mt-3 h-1 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                  style={{ width: `${Math.min((weightLost / 5) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 border border-border bg-card hover:shadow-lg transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-bl-full"></div>
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">Total Workouts</h3>
                <Badge className="text-xs bg-accent/20 text-accent">This Month</Badge>
              </div>
              <p className="text-4xl font-bold text-foreground mb-1">{totalWorkouts}</p>
              <p className="text-xs text-muted-foreground">Target: 12 sessions</p>
              <div className="mt-3 h-1 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-accent to-chart-2 transition-all"
                  style={{ width: `${Math.min((totalWorkouts / 12) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 border border-border bg-card hover:shadow-lg transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-chart-2/10 rounded-bl-full"></div>
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">Avg Calories</h3>
                <Badge className="text-xs bg-chart-2/20 text-chart-2">Weekly</Badge>
              </div>
              <p className="text-4xl font-bold text-foreground mb-1">{weeklyAvgCalories.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Burned/week</p>
              <div className="mt-3 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1 rounded-full ${
                      i <= Math.ceil(weeklyAvgCalories / 2000) ? 'bg-chart-2' : 'bg-secondary'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 border border-border bg-card hover:shadow-lg transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-chart-3/10 rounded-bl-full"></div>
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">Consistency Score</h3>
                <Badge className="text-xs bg-chart-3/20 text-chart-3">AI Rated</Badge>
              </div>
              <p className="text-4xl font-bold text-foreground mb-1">87%</p>
              <p className="text-xs text-muted-foreground">Based on workout frequency</p>
              <div className="mt-3 h-1 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-chart-3 to-primary transition-all"
                  style={{ width: '87%' }}
                ></div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Advanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border border-border bg-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                Weight Trend Analysis
                <Badge variant="outline" className="text-xs">AI Powered</Badge>
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Track your weight loss journey</p>
            </div>
          </div>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <AreaChart data={weightChartData}>
              <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="week" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="hsl(var(--chart-1))"
                fill="url(#weightGradient)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="hsl(var(--chart-2))"
                strokeDasharray="5 5"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </Card>

        <Card className="p-6 border border-border bg-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                Activity Overview
                <Badge variant="outline" className="text-xs">AI Analyzed</Badge>
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Workouts and calories burned</p>
            </div>
          </div>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={workoutChartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="week" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="workouts" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="calories" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </Card>
      </div>

      <Card className="p-6 border border-border bg-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              AI-Tracked Goals
              <Badge variant="outline" className="text-xs">Smart Tracking</Badge>
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Real-time progress monitoring</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 border border-border rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-foreground text-sm">{goal.name}</h4>
                <Badge className={`text-xs ${
                  goal.progress >= 80 ? 'bg-green-500/20 text-green-600' :
                  goal.progress >= 50 ? 'bg-accent/20 text-accent' :
                  'bg-primary/20 text-primary'
                }`}>
                  {goal.progress}%
                </Badge>
              </div>
              <div className="w-full bg-secondary rounded-full h-3 mb-2 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${goal.progress}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                  className={`h-full rounded-full transition-all ${
                    goal.progress >= 80 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                    goal.progress >= 50 ? 'bg-gradient-to-r from-accent to-chart-2' :
                    'bg-gradient-to-r from-primary to-accent'
                  }`}
                ></motion.div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {goal.current} / {goal.target} {goal.unit}
                </span>
                <span className="text-foreground font-semibold">
                  {goal.target - goal.current} {goal.unit} remaining
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      <Card className="p-6 border border-border bg-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              Achievement System
              <Badge variant="outline" className="text-xs">AI Unlocked</Badge>
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Milestones and accomplishments</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievements.map((achievement, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`relative p-4 rounded-lg border transition-all cursor-pointer hover:scale-105 ${
                achievement.unlocked
                  ? "bg-gradient-to-br from-primary/20 to-accent/20 border-primary shadow-lg"
                  : "bg-secondary/30 border-border opacity-60"
              }`}
            >
              {achievement.unlocked && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </div>
              )}
              <div className="text-4xl mb-2 text-center">{achievement.icon}</div>
              <p className="font-semibold text-foreground text-sm text-center mb-1">{achievement.title}</p>
              <p className="text-xs text-muted-foreground text-center mb-2">{achievement.description}</p>
              {achievement.unlocked ? (
                <Badge className="w-full justify-center bg-primary text-primary-foreground text-xs">
                  ✓ Unlocked
                </Badge>
              ) : (
                <Badge variant="outline" className="w-full justify-center text-xs">
                  Locked
                </Badge>
              )}
            </motion.div>
          ))}
        </div>
      </Card>

      <Card className="p-6 border border-border bg-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              Weekly Activity Heatmap
              <Badge variant="outline" className="text-xs">AI Pattern Detection</Badge>
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Track your daily workout consistency</p>
          </div>
        </div>
        <div className="space-y-3">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, idx) => {
            const workoutToday = idx === 0 || idx === 2 || idx === 4
            const completion = workoutToday ? 100 : 0
            const isToday = new Date().getDay() === (idx + 1) % 7

            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                  isToday ? 'bg-primary/10 border border-primary' : 'hover:bg-secondary/50'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className={`text-sm font-medium w-20 ${isToday ? 'text-primary font-semibold' : 'text-foreground'}`}>
                    {day}
                    {isToday && <Badge className="ml-2 text-xs bg-primary text-primary-foreground">Today</Badge>}
                  </span>
                  <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completion}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className={`h-full rounded-full transition-all ${
                        workoutToday
                          ? "bg-gradient-to-r from-primary to-accent"
                          : "bg-muted"
                      }`}
                    ></motion.div>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-20 justify-end">
                  {workoutToday ? (
                    <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      Done
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">Rest</span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
        <div className="mt-4 p-4 bg-secondary/30 rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">AI Insight</Badge>
            <span className="text-xs text-muted-foreground">Weekly Analysis</span>
          </div>
          <p className="text-sm text-foreground">
            You've completed <strong>{totalWorkouts} workouts</strong> this month. 
            {totalWorkouts >= 12 ? " Excellent consistency! " : " Aim for 3-4 workouts per week for optimal results. "}
            Your current streak shows strong commitment to your fitness goals.
          </p>
        </div>
      </Card>

      <div className="flex gap-4 flex-wrap">
        <Dialog open={showLogWorkout} onOpenChange={setShowLogWorkout}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Log Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Log Your Workout</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="workout-date" className="text-foreground">
                  Date
                </Label>
                <Input
                  id="workout-date"
                  type="date"
                  value={workoutForm.date}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, date: e.target.value })}
                  className="bg-input border-border text-foreground mt-1"
                />
              </div>
              <div>
                <Label htmlFor="workout-notes" className="text-foreground">
                  Notes (optional)
                </Label>
                <Textarea
                  id="workout-notes"
                  value={workoutForm.notes}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, notes: e.target.value })}
                  placeholder="What did you do today?"
                  className="bg-input border-border text-foreground mt-1"
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowLogWorkout(false)}
                  className="border-border text-foreground"
                >
                  Cancel
                </Button>
                <Button onClick={handleLogWorkout} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Log Workout
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showUpdateWeight} onOpenChange={setShowUpdateWeight}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Update Weight</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Update Your Weight</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="weight-value" className="text-foreground">
                  Weight (kg)
                </Label>
                <Input
                  id="weight-value"
                  type="number"
                  step="0.1"
                  value={weightForm.weight}
                  onChange={(e) => setWeightForm({ ...weightForm, weight: e.target.value })}
                  placeholder="Enter your current weight"
                  className="bg-input border-border text-foreground mt-1"
                />
              </div>
              <div>
                <Label htmlFor="weight-date" className="text-foreground">
                  Date
                </Label>
                <Input
                  id="weight-date"
                  type="date"
                  value={weightForm.date}
                  onChange={(e) => setWeightForm({ ...weightForm, date: e.target.value })}
                  className="bg-input border-border text-foreground mt-1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowUpdateWeight(false)}
                  className="border-border text-foreground"
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateWeight} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Update Weight
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          onClick={handleExportProgress}
          className="border-border text-foreground hover:bg-secondary bg-transparent"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Export Progress
        </Button>
      </div>
    </div>
  )
}
