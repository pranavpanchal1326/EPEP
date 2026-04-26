import { useState, useEffect } from 'react'

export const useInstallPrompt = () => {
  const [promptEvent, setPromptEvent] = useState(null)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setPromptEvent(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!promptEvent) return
    promptEvent.prompt()
    const { outcome } = await promptEvent.userChoice
    if (outcome === 'accepted') setPromptEvent(null)
  }

  return { canInstall: !!promptEvent, handleInstall }
};