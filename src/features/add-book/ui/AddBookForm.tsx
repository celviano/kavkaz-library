'use client'

import { memo } from 'react'
import { Container } from '@/shared/ui/Container'
import { useAddBookForm } from '../model/useAddBookForm'
import { BasicInfoSection } from './sections/BasicInfoSection'
import { PublicationSection } from './sections/PublicationSection'
import { SaleSection } from './sections/SaleSection'
import { PhotosSection } from './sections/PhotosSection'

export const AddBookForm = memo(() => {
  const form = useAddBookForm()

  return (
    <main id="main-content">
      <section className="py-12">
        <Container>
          <div className="max-w-2xl mx-auto">

            <header className="mb-10">
              <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-2">Каталог</p>
              <h1
                className="font-display font-semibold text-ink leading-tight mb-2"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}
              >
                Добавить книгу
              </h1>
              <p className="text-ash text-sm">
                Поля отмеченные <span className="text-red-400">*</span> обязательны.
              </p>
            </header>

            <form onSubmit={form.handleSubmit} noValidate className="flex flex-col gap-8">

              <BasicInfoSection
                values={form.values}
                selects={form.selects}
                getError={form.getFieldError}
                onChange={form.handleChange}
                onSelect={form.handleSelectChange}
                categoryError={form.categoryError}
              />

              <PublicationSection
                values={form.values}
                onChange={form.handleChange}
              />

              <SaleSection
                values={form.values}
                selects={form.selects}
                getError={form.getFieldError}
                onChange={form.handleChange}
                onSelect={form.handleSelectChange}
              />

              <PhotosSection
                coverUpload={form.coverUpload}
                imagesUpload={form.imagesUpload}
              />

              {form.submitError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {form.submitError}
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={form.cancel}
                  className="h-11 px-6 rounded-xl text-sm font-medium border border-surface2 text-ash hover:text-ink hover:bg-surface transition-all cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={form.submitting}
                  className="h-11 px-8 rounded-xl text-sm font-medium bg-accent text-bg border border-accent hover:bg-accent2 shadow-accent-sm hover:shadow-accent transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                >
                  {form.submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-bg/30 border-t-bg animate-spin" />
                      Публикуем...
                    </span>
                  ) : 'Добавить книгу'}
                </button>
              </div>

            </form>
          </div>
        </Container>
      </section>
    </main>
  )
})

AddBookForm.displayName = 'AddBookForm'
