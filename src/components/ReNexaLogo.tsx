interface ReNexaLogoProps {
  variant?: 'default' | 'inverted';
  size?: 'sm' | 'md' | 'lg';
}

export function ReNexaLogo({ variant = 'default', size = 'md' }: ReNexaLogoProps) {
  const iconSize = size === 'sm' ? 26 : size === 'lg' ? 38 : 30;
  const textSize =
    size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-[1.25rem]';

  const primaryStroke = variant === 'inverted' ? '#FFFFFF' : '#0F172A';
  const accentStroke = variant === 'inverted' ? '#34D399' : '#059669';
  const forestFill = variant === 'inverted' ? '#10B981' : '#0D3B2E';

  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 select-none">
      {/* Abstract interlocking R / N precision circulation emblem */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          x="1.5"
          y="1.5"
          width="33"
          height="33"
          rx="8"
          fill={variant === 'inverted' ? 'rgba(255,255,255,0.06)' : '#0D3B2E'}
          stroke={variant === 'inverted' ? 'rgba(255,255,255,0.18)' : '#0D3B2E'}
          strokeWidth="1.5"
        />
        {/* Left R stem + upper loop transitioning into N diagonal conduit */}
        <path
          d="M10.5 26V10.5H16.2C18.85 10.5 20.5 11.95 20.5 14.25C20.5 16.55 18.85 18 16.2 18H13.5L22.5 25.5"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Interlocking N right vertical conduit & emerald directional node */}
        <path
          d="M25.5 10.5V25.5"
          stroke={accentStroke}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M22.2 13.4L25.5 10.1L28.8 13.4"
          stroke={accentStroke}
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10.5" cy="26" r="1.6" fill={accentStroke} />
      </svg>

      <span
        className={`font-display font-bold tracking-tight leading-none ${textSize}`}
        style={{ color: primaryStroke }}
      >
        Re<span style={{ color: forestFill }}>Nexa</span>
      </span>
    </span>
  );
}
