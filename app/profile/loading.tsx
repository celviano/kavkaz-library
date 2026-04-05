import { Container } from '@/shared/ui/Container'

export default function Loading() {
  return (
    <main className="flex-1 py-12" aria-busy="true" aria-label="Загрузка профиля...">
      <Container>
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <div className="bg-surface border border-surface2 rounded-3xl overflow-hidden animate-pulse">
            <div className="h-32 bg-surface2" />
            <div className="px-6 pb-6">
              <div className="flex items-end justify-between -mt-12 mb-4">
                <div className="w-24 h-24 rounded-full bg-surface2 ring-4 ring-surface" />
              </div>
              <div className="flex flex-col gap-2 mb-5">
                <div className="h-7 w-48 bg-surface2 rounded-xl" />
                <div className="h-4 w-64 bg-surface2 rounded-full" />
              </div>
              <div className="grid grid-cols-3 gap-px bg-surface2 rounded-2xl overflow-hidden">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-bg px-4 py-4 h-20" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}
