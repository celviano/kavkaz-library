import { BookCardSkeleton } from './Skeleton'
import { Container } from './Container'

export function PageLoader() {
  return (
    <main className="flex-1 py-12" aria-busy="true" aria-label="Загрузка...">
      <Container>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div className="h-3 w-20 bg-surface rounded-full animate-pulse" />
            <div className="h-9 w-64 bg-surface rounded-xl animate-pulse" />
            <div className="h-4 w-48 bg-surface rounded-full animate-pulse" />
          </div>
          <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </Container>
    </main>
  )
}
