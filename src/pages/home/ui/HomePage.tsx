'use client'

import { memo } from 'react'
import { Hero } from '@/widgets/hero'
import { AboutPreview } from '@/widgets/about-preview'
import { QuoteBanner } from '@/widgets/quote-banner'
import { FeaturedBooks } from '@/widgets/featured-books'
import { CategoriesSection } from '@/widgets/categories-section'
import { CtaBanner } from '@/widgets/cta-banner'

export const HomePage = memo(() => (
  <main id="main-content">
    <Hero />
    <AboutPreview />
    <QuoteBanner />
    <FeaturedBooks />
    <CategoriesSection />
    <CtaBanner />
  </main>
))

HomePage.displayName = 'HomePage'
