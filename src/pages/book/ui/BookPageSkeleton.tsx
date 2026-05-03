import { Container } from '@/shared/ui'

export function BookPageSkeleton() {
  return (
    <main id="main-content">
      <section className="py-10">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 xl:gap-20">
            <div className="aspect-3/4 rounded-2xl bg-surface animate-pulse" />
            <div className="flex flex-col gap-5">
              <div className="h-5 w-24 bg-surface rounded-full animate-pulse" />
              <div className="h-10 w-3/4 bg-surface rounded-xl animate-pulse" />
              <div className="h-5 w-1/2 bg-surface rounded-full animate-pulse" />
              <div className="h-px bg-surface2" />
              <div className="grid grid-cols-3 gap-px bg-surface2 rounded-2xl overflow-hidden">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-bg px-4 py-3.5 h-16 animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}
