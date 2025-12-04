"use client"

import { Button } from "@/components/ui/button"
import { useVoice } from "@/hooks/use-voice"
import { useElevenLabsVoice } from "@/hooks/use-elevenlabs-voice"
import { useState, useMemo } from "react"

interface VoiceReadButtonProps {
  text: string
  label?: string
  section?: "workout" | "diet" | "both"
  onSelectSection?: (section: string) => void
  useElevenLabs?: boolean
}

export function VoiceReadButton({
  text,
  label = "Read Aloud",
  section = "both",
  onSelectSection,
  useElevenLabs = false,
}: VoiceReadButtonProps) {
  const [selectedSection, setSelectedSection] = useState(section)

  const webVoice = useVoice()
  const elevenLabsVoice = useElevenLabsVoice()

  const voiceHook = useMemo(() => {
    return useElevenLabs ? elevenLabsVoice : webVoice
  }, [useElevenLabs, elevenLabsVoice, webVoice])

  const { speak, stop, isPlaying } = voiceHook

  return (
    <div className="flex gap-2 items-center">
      {section !== "both" ? null : (
        <select
          value={selectedSection}
          onChange={(e) => {
            const newSection = e.target.value
            setSelectedSection(newSection)
            onSelectSection?.(newSection)
          }}
          className="px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground"
        >
          <option value="both">Read All</option>
          <option value="workout">Workout Only</option>
          <option value="diet">Diet Only</option>
        </select>
      )}

      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          if (isPlaying) {
            stop()
          } else {
            speak(text)
          }
        }}
        className="gap-2"
      >
        {isPlaying ? (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h4v12H6V6zm8 0h4v12h-4V6z" />
            </svg>
            Stop
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.25-1.68 4.45-3.85h2.14c-.3 2.88-2.88 5.05-6.59 5.05-3.72 0-6.78-3.05-6.78-6.75 0-3.15 2.13-5.77 4.9-6.48V3h2.88z" />
            </svg>
            {label}
          </>
        )}
      </Button>
    </div>
  )
}
