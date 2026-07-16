import { HeroSection } from '@/components/sections/HeroSection'
import { ServerConfigSection } from '@/components/sections/ServerConfigSection'
import { CreatorSection } from '@/components/sections/CreatorSection'
import { MemoryGame } from '@/components/sections/MemoryGame'
import { WorkshopPopup } from '@/components/ui/WorkshopPopup'
import { SurveyResultsSection } from '@/components/sections/SurveyResultsSection'

export default function App() {
  return (
    <div className="relative min-h-[100dvh] grain">
      <WorkshopPopup />
      
      <main>
        <HeroSection />
        <ServerConfigSection />
        <MemoryGame />
        <CreatorSection />
        <SurveyResultsSection />
      </main>
    </div>
  )
}
