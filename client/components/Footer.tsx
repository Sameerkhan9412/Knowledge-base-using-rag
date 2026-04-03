import React from 'react'
import { FileText } from 'lucide-react'

const Footer = () => {
  return (
     <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <FileText className="w-4 h-4 text-background" />
            </div>
            <span className="font-semibold">Paper Brain Ai Chat</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ using RAG + Grok + Qdrant
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
  )
}

export default Footer