import { useState } from 'react';
import { Layers } from 'lucide-react';
import { MaterialCategory } from '../types/marketplace';

interface MaterialImageProps {
  src?: string;
  alt: string;
  category?: MaterialCategory;
  className?: string;
}

export function MaterialImage({ src, alt, category, className = '' }: MaterialImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-[#0F172A] via-[#132A24] to-[#0D3B2E] text-white/90 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Layers className="w-8 h-8 text-emerald-400/80 mb-2.5" strokeWidth={1.5} />
        <span className="font-display text-sm font-semibold tracking-tight text-white line-clamp-2 max-w-[220px]">
          {alt}
        </span>
        {category && (
          <span className="mt-1 text-xs text-slate-300">{category}</span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
      loading="lazy"
    />
  );
}
