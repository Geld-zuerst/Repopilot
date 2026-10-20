import HeroSection from '../components/hero/HeroSection'
import Navbar from '../components/layout/Navbar'
import CodeExplorer from '../components/sections/CodeExplorer'
import Features from '../components/sections/Features'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CodeExplorer />
        <Features />
      </main>
    </>
  )
}
