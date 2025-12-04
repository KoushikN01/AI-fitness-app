"use client"

import { useState, useCallback } from "react"

export function useElevenLabsVoice() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const speak = useCallback(async (text: string, voiceId = "21m00Tcm4TlvDq8ikWAM") => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceId }),
      })

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.statusText}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)

      audio.onplay = () => setIsPlaying(true)
      audio.onended = () => setIsPlaying(false)
      audio.onerror = () => setIsPlaying(false)

      audio.play()
    } catch (error) {
      console.error("Error with ElevenLabs voice:", error)
      fallbackToWebSpeech(text)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fallbackToWebSpeech = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1
    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    window.speechSynthesis.speak(utterance)
  }

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsPlaying(false)
  }, [])

  return { speak, stop, isPlaying, isLoading }
}
