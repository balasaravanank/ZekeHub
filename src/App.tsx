import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { ServerConfigSection } from '@/components/sections/ServerConfigSection'
import { CreatorSection } from '@/components/sections/CreatorSection'
import { MemoryGame } from '@/components/sections/MemoryGame'

export default function App() {
  return (
    <div className="relative min-h-[100dvh] grain">
      <Navbar />
      <main>
        <HeroSection />
        <ServerConfigSection />
        <MemoryGame />
        <CreatorSection />
      </main>
      <Footer />
    </div>
  )
}
