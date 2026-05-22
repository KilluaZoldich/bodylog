// Illustrated empty state. A small glass medallion with an icon + editorial copy.

export default function EmptyState({ icon: Icon, title, hint }) {
  return (
    <div className="glass-regular rounded-glass-lg p-7 flex flex-col items-center text-center">
      <div
        className="h-14 w-14 rounded-full glass-prominent flex items-center justify-center mb-4"
        style={{
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.2), 0 8px 24px -8px rgba(201,169,97,0.3)',
        }}
      >
        {Icon && <Icon size={22} strokeWidth={1.4} className="text-accent" />}
      </div>
      <h3 className="font-editorial text-[18px] text-cream font-medium tracking-tight">
        {title}
      </h3>
      {hint && (
        <p className="text-[12px] text-muted mt-1.5 max-w-[220px] leading-relaxed tracking-wide">
          {hint}
        </p>
      )}
    </div>
  )
}
