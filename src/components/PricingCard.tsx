interface PricingCardProps {
  title: string;
  price: string;
  priceDetail?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  ctaLabel?: string;
}

export function PricingCard({
  title,
  price,
  priceDetail,
  description,
  features,
  highlighted = false,
  ctaLabel,
}: PricingCardProps) {
  return (
    <article className={highlighted ? "pricing-card highlighted" : "pricing-card"}>
      <p className="eyebrow">{title}</p>
      <h3>{price}</h3>
      {priceDetail && <p className="price-detail">{priceDetail}</p>}
      <p className="card-subtitle">{description}</p>
      <ul>
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <button className={highlighted ? "primary-button" : "ghost-button"}>
        {ctaLabel ?? (highlighted ? "Start free trial" : "Choose plan")}
      </button>
    </article>
  );
}
