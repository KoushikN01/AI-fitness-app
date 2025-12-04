"use client"
import { Button } from "@/components/ui/button"
import { useVoiceCommand } from "@/hooks/use-voice-command"

interface VoiceCommandButtonProps {
  onRegeneratePlan?: () => void
  onToggleDarkMode?: () => void
  onExportPlan?: () => void
}

export function VoiceCommandButton({ onRegeneratePlan, onToggleDarkMode, onExportPlan }: VoiceCommandButtonProps) {
  const commands = [
    { command: "regenerate plan", action: onRegeneratePlan || (() => {}) },
    { command: "toggle dark mode", action: onToggleDarkMode || (() => {}) },
    { command: "export plan", action: onExportPlan || (() => {}) },
    { command: "read workout", action: () => console.log("Read workout") },
    { command: "read diet", action: () => console.log("Read diet") },
  ]

  const { startListening, isListening, transcript, isSupported } = useVoiceCommand(commands)

  if (!isSupported) return null

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={startListening}
        disabled={isListening}
        variant={isListening ? "default" : "outline"}
        className="gap-2"
        size="sm"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm0 2c-2.76 0-5-2.24-5-5v-1H5c-1.1 0-2 .9-2 2v4c0 2.2 1.79 4 4 4h2v1c0 .55.45 1 1 1s1-.45 1-1v-1h2v1c0 .55.45 1 1 1s1-.45 1-1v-1h2c2.21 0 4-1.8 4-4v-4c0-1.1-.9-2-2-2h-2v1c0 2.76-2.24 5-5 5z" />
        </svg>
        {isListening ? "Listening..." : "Voice Command"}
      </Button>
      {transcript && <p className="text-xs text-muted-foreground">Heard: "{transcript}"</p>}
    </div>
  )
}
