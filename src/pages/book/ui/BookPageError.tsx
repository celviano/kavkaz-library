import { Container } from '@/shared/ui/Container'
import { EmptyState } from '@/shared/ui/EmptyState'

const icon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#7D7060" strokeWidth="1.5" />
    <path
      d="M12 8v4M12 16h.01"
      stroke="#7D7060"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

export function BookPageError() {
  return (
    <main id="main-content" className="flex-1 flex items-center justify-center py-24">
      <Container>
        <EmptyState
          icon={icon}
          title="Книга не найдена"
          description="Возможно, она была удалена или перемещена."
          actionLabel="В каталог"
          actionHref="/catalog"
        />
      </Container>
    </main>
  )
}
