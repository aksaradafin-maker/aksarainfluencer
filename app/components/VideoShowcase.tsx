"use client";

import { useEffect, useRef, useState } from "react";

type Video = {
  id: string;
  title: string;
};

const UGC: Video[] = [
  { id: "3HXHcmTPexM", title: "UGC 01" },
  { id: "i6OQeJKUjV4", title: "UGC 02" },
  { id: "WuQ4t8fpTPs", title: "UGC 03" },
  { id: "d7FBR6yQAt0", title: "UGC 04" },
];

const AI_INFLUENCER: Video[] = [
  { id: "WMnYShjaG90", title: "AI Influencer 01" },
  { id: "UGYwiOyNmZI", title: "AI Influencer 02" },
  { id: "8LbiSG_budg", title: "AI Influencer 03" },
];

const COMMERCIAL: Video[] = [
  { id: "s8WStO4O53k", title: "AI Commercial 01" },
  { id: "vGyT74YIZx4", title: "AI Commercial 02" },
  { id: "DgZ2g_ZwPvg", title: "AI Commercial 03" },
];

const VIRAL: Video[] = [
  { id: "Az_zwEykm5o", title: "AI Viral 01" },
  { id: "eh1CIh6_-yA", title: "AI Viral 02" },
  { id: "DpIDWYJbBUg", title: "AI Viral 03" },
];

const WORKFLOW: Video = {
  id: "tyNo-F3ON20",
  title: "AI Workflow Showcase",
};

const EMBED = "https://www.youtube-nocookie.com/embed/";
const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

function AutoVideo({ video }: { video: Video }) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setLive(entry.isIntersecting),
      { rootMargin: "200px" }
    );

    io.observe(el);

    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="yt-card">
      {live ? (
        <iframe
          src={
            EMBED +
            video.id +
            "?autoplay=1&mute=1&loop=1&playlist=" +
            video.id +
            "&controls=0&rel=0&modestbranding=1&playsinline=1"
          }
          title={video.title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <img src={thumb(video.id)} alt={video.title} loading="lazy" />
      )}

      <span className="yt-label">{video.title}</span>
    </div>
  );
}

function ClickVideo({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="yt-card">
        <iframe
          src={`${EMBED}${video.id}?autoplay=1&rel=0`}
          title={video.title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
        <span className="yt-label">{video.title}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="yt-card yt-button"
      onClick={() => setPlaying(true)}
    >
      <img src={thumb(video.id)} alt={video.title} loading="lazy" />
      <span className="yt-play">▶</span>
      <span className="yt-label">{video.title}</span>
    </button>
  );
}

function VideoRow({
  title,
  description,
  videos,
}: {
  title: string;
  description?: string;
  videos: Video[];
}) {
  return (
    <div className="video-group">
      <div className="video-group-head">
        <span className="eyebrow">AI CONTENT / {title}</span>
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>

      <div className="video-grid">
        {videos.map((video) => (
          <AutoVideo key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}

export default function VideoShowcase() {
  return (
    <div className="video-showcase">
      <VideoRow
        title="UGC"
        description="Contoh format konten yang terasa seperti creator content."
        videos={UGC}
      />

      <VideoRow
        title="AI INFLUENCER"
        description="Satu workflow bisa dikembangkan menjadi banyak format konten."
        videos={AI_INFLUENCER}
      />

      <VideoRow
        title="COMMERCIAL"
        description="Konten produk tanpa harus shooting ulang terus."
        videos={COMMERCIAL}
      />

      <VideoRow
        title="AI VIRAL"
        description="Eksplorasi short-form dan format konten lainnya."
        videos={VIRAL}
      />

      <div className="video-group workflow-video">
        <div className="video-group-head">
          <span className="eyebrow">THE WORKFLOW</span>
          <h3>Dari ide sampai video.</h3>
          <p>Lihat gambaran workflow secara keseluruhan.</p>
        </div>

        <div className="workflow-video-frame">
          <AutoVideo video={WORKFLOW} />
        </div>
      </div>
    </div>
  );
}