'use client'

import { memo } from 'react'

import { AboutPreview } from '@/widgets/about-preview'
import { CategoriesSection } from '@/widgets/categories-section'
import { CtaBanner } from '@/widgets/cta-banner'
import { FeaturedBooks } from '@/widgets/featured-books'
import { Hero } from '@/widgets/hero'
import { QuoteBanner } from '@/widgets/quote-banner'

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
