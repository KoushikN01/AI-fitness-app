"use client"

import { motion } from "framer-motion"

interface AnimatedStatProps {
  value: string | number
  label: string
  delay?: number
}

export function AnimatedStat({ value, label, delay = 0 }: AnimatedStatProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
    >
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </motion.div>
  )
}
