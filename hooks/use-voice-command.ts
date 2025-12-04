"use client"

import { useState, useCallback } from "react"

interface VoiceCommand {
  command: string
  action: () => void
}

export function useVoiceCommand(commands: VoiceCommand[]) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported] = useState(() => {
    if (typeof window === "undefined") return false
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    return !!SpeechRecognition
  })

  const startListening = useCallback(() => {
    if (!isSupported) {
      console.warn("Speech Recognition not supported")
      return
    }

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onstart = () => {
      setIsListening(true)
      setTranscript("")
    }

    recognition.onresult = (event: any) => {
      let interimTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          const command = transcript.toLowerCase().trim()
          commands.forEach((cmd) => {
            if (command.includes(cmd.command.toLowerCase())) {
              cmd.action()
            }
          })
        } else {
          interimTranscript += transcript
        }
      }
      setTranscript(interimTranscript)
    }

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }, [isSupported, commands])

  return { startListening, isListening, transcript, isSupported }
}
