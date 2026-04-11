export function AuthDivider({ label = 'или' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px bg-surface2" />
      <span className="text-xs text-dim">{label}</span>
      <div className="flex-1 h-px bg-surface2" />
    </div>
  )
}