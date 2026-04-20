interface FeatureCardProps {
  id?: string;
  image: string;
  title: string;
  subtitle: string;
  meta: string;
  tags?: string[];
  reasonLabel?: string;
  layout?: "vertical" | "horizontal";
  primaryAction: string;
  onPrimaryAction?: () => void;
  primaryDisabled?: boolean;
  secondaryAction?: string;
  onSecondaryAction?: () => void;
  secondaryDisabled?: boolean;
}

export function FeatureCard({
  id,
  image,
  title,
  subtitle,
  meta,
  tags,
  reasonLabel,
  layout = "vertical",
  primaryAction,
  onPrimaryAction,
  primaryDisabled = false,
  secondaryAction = "Save",
  onSecondaryAction,
  secondaryDisabled = false,
}: FeatureCardProps) {
  return (
    <article
      className={`feature-card card-elev ${layout === "horizontal" ? "horizontal" : ""}`}
      data-item-id={id}
    >
      <div className="card-media">
        <img src={image} alt={title} className="card-cover" />
      </div>
      <div className="card-content">
        <p className="card-meta">{meta}</p>
        <h3>{title}</h3>
        <p className="card-subtitle">{subtitle}</p>
        {reasonLabel && <p className="reason-label">Shown because: {reasonLabel}</p>}
        {tags && (
          <div className="tag-row">
            {tags.map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="card-actions">
          <button
            className="primary-button"
            onClick={onPrimaryAction}
            disabled={primaryDisabled}
          >
            {primaryAction}
          </button>
          <button
            className="ghost-button"
            onClick={onSecondaryAction}
            disabled={secondaryDisabled}
          >
            {secondaryAction}
          </button>
        </div>
      </div>
    </article>
  );
}
