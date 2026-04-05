import { Container } from '@/shared/ui/Container'
import { AboutHero } from './AboutHero'
import { AboutMission } from './AboutMission'
import { AboutHow } from './AboutHow'
import { AboutForWhom } from './AboutForWhom'
import { AboutCta } from './AboutCta'


export function AboutPage() {
  return (
    <main id="main-content">
      <AboutHero />
      <AboutMission />
      <AboutHow />
      <AboutForWhom />
      <AboutCta />
    </main>
  )
}
