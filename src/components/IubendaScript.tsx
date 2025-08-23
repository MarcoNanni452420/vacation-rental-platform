'use client'

import { useEffect } from 'react'

export default function IubendaScript() {
  useEffect(() => {
    // Inietta lo script di iubenda nel head prima di Google Analytics
    const script = document.createElement('script')
    script.src = '//embeds.iubenda.com/widgets/ed407eb0-2359-4c3a-8cd4-53ccbe043016.js'
    script.async = false // Caricamento sincrono per assicurarsi che sia prima di GA
    
    // Inserisce come primo elemento nel head per garantire che carichi prima di tutto
    if (document.head.firstChild) {
      document.head.insertBefore(script, document.head.firstChild)
    } else {
      document.head.appendChild(script)
    }
    
    // Cleanup quando il componente viene smontato
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])
  
  return null
}