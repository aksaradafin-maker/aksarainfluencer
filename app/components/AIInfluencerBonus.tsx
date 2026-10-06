function BonusIcon({
  type
}: {
  type: "influencer" | "ugc" | "product" | "short" | "ads" | "talking";
}) {
  const common = {
    width: 30,
    height: 30,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.65,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true
  };

  if (type === "influencer") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="m12 5 1.3 4.2L17.5 11l-4.2 1.3L12 16.5l-1.3-4.2L6.5 11l4.2-1.8L12 5Z" />
      </svg>
    );
  }

  if (type === "ugc") {
    return (
      <svg {...common}>
        <rect x="3.5" y="4" width="17" height="16" rx="3" />
        <path d="m10 8.5 5 3.5-5 3.5v-7Z" />
      </svg>
    );
  }

  if (type === "product") {
    return (
      <svg {...common}>
        <path d="m12 3 7 4v10l-7 4-7-4V7l7-4Z" />
        <path d="m5 7 7 4 7-4" />
        <path d="M12 11v10" />
      </svg>
    );
  }

  if (type === "short") {
    return (
      <svg {...common}>
        <rect x="6" y="2.8" width="12" height="18.4" rx="2.5" />
        <path d="m10 8 5 3.5-5 3.5V8Z" />
      </svg>
    );
  }

  if (type === "ads") {
    return (
      <svg {...common}>
        <path d="M4 10v4" />
        <path d="m6 9 10-4v14L6 15V9Z" />
        <path d="M6 15v4" />
        <path d="M19 9c1.2 1 1.8 2 1.8 3s-.6 2-1.8 3" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="7" y="3" width="10" height="14" rx="5" />
      <path d="M4 12a8 8 0 0 0 16 0" />
      <path d="M12 20v2" />
      <path d="M9 22h6" />
    </svg>
  );
}

const outputs = [
  {
    icon: "ugc" as const,
    name: "AI UGC Video",
    description: "Konten ala creator tanpa harus selalu tampil sendiri.",
    value: "Rp199K"
  },
  {
    icon: "product" as const,
    name: "AI Product Video",
    description: "Visual produk yang lebih siap dipakai untuk konten.",
    value: "Rp149K"
  },
  {
    icon: "short" as const,
    name: "AI Short Video",
    description: "Format pendek untuk kebutuhan social media.",
    value: "Rp99K"
  },
  {
    icon: "ads" as const,
    name: "AI Ad Creative",
    description: "Konsep visual yang bisa dikembangkan untuk iklan.",
    value: "Rp149K"
  },
  {
    icon: "talking" as const,
    name: "Talking AI",
    description: "Voice, lip sync, dan talking video.",
    value: "Rp199K"
  }
];

export default function AIInfluencerBonus() {
  return (
    <section className="ai-bonus-section">
      <div className="ai-bonus-orb" />

      <div className="container">
        <div className="ai-bonus-header">
          <div className="bonus-kicker">
            BONUS CONCEPT
          </div>

          <h2>
            Nggak pede tampil?
            <span> Sekarang talent-nya bisa AI.</span>
          </h2>

          <p>
            Kenalan dengan konsep <strong>AI Influencer Super Realistis</strong> —
            lalu lihat bagaimana satu konsep bisa dikembangkan menjadi
            beberapa jenis output konten.
          </p>
        </div>

        <div className="ai-influencer-stage">
          <div className="ai-stage-ring ring-one" />
          <div className="ai-stage-ring ring-two" />

          <div className="ai-influencer-card">
            <div className="ai-influencer-icon">
              <BonusIcon type="influencer" />
            </div>

            <span className="ai-stage-label">AI INFLUENCER</span>

            <h3>
              SUPER
              <br />
              REALISTIS
            </h3>

            <p>
              Satu virtual talent.
              <br />
              Banyak kemungkinan konten.
            </p>

            <div className="ai-stage-tags">
              <span>UGC</span>
              <span>PRODUCT</span>
              <span>ADS</span>
            </div>
          </div>
        </div>

        <div className="output-heading">
          <span>HASIL YANG BISA DIKEMBANGKAN</span>
          <strong>Bukan satu output doang.</strong>
        </div>

        <div className="output-grid">
          {outputs.map((item) => (
            <article className="output-card" key={item.name}>
              <div className="output-icon">
                <BonusIcon type={item.icon} />
              </div>

              <div className="output-copy">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>

              <div className="output-value">
                <span>ESTIMATED VALUE</span>
                <strong>{item.value}</strong>
              </div>
            </article>
          ))}
        </div>

        <div className="bonus-total">
          <div>
            <span>TOTAL ESTIMATED VALUE</span>
            <strong>Rp795.000</strong>
          </div>

          <p>
            Nilai di atas adalah estimasi value per output,
            bukan harga jual terpisah.
          </p>
        </div>
      </div>
    </section>
  );
}