interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  actionLabel,
}: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {actionLabel && <button className="ghost-button">{actionLabel}</button>}
    </div>
  );
}
