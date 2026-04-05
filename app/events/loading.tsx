import { Container } from '@/shared/ui/Container'

export default function Loading() {
  return (
    <main className="flex-1 py-12" aria-busy="true" aria-label="Загрузка событий...">
      <Container>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div className="h-3 w-24 bg-surface rounded-full animate-pulse" />
            <div className="h-9 w-40 bg-surface rounded-xl animate-pulse" />
          </div>
          <div className="h-32 bg-surface border border-surface2 rounded-2xl animate-pulse" />
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-surface border border-surface2 overflow-hidden animate-pulse">
                <div className="h-44 bg-surface2" />
                <div className="p-5 flex flex-col gap-3">
                  <div className="h-3 w-24 bg-surface2 rounded-full" />
                  <div className="h-5 w-3/4 bg-surface2 rounded-lg" />
                  <div className="h-3 w-full bg-surface2 rounded-full" />
                  <div className="h-3 w-2/3 bg-surface2 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </main>
  )
}
