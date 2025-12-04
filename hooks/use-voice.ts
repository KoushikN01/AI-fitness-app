"use client"

import { useState, useCallback } from "react"

export function useVoice() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSpeechSupported] = useState(() => {
    return typeof window !== "undefined" && ("speechSynthesis" in window || "webkitSpeechSynthesis" in window)
  })

  const speak = useCallback(
    (text: string, rate = 1) => {
      if (!isSpeechSupported) {
        console.warn("Speech synthesis not supported")
        return
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = rate

      utterance.onstart = () => setIsPlaying(true)
      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = () => setIsPlaying(false)

      window.speechSynthesis.speak(utterance)
    },
    [isSpeechSupported],
  )

  const stop = useCallback(() => {
    if (isSpeechSupported) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
    }
  }, [isSpeechSupported])

  return { speak, stop, isPlaying, isSpeechSupported }
}
