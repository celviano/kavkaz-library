import { AboutCta } from './AboutCta'
import { AboutForWhom } from './AboutForWhom'
import { AboutHero } from './AboutHero'
import { AboutHow } from './AboutHow'
import { AboutMission } from './AboutMission'

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
