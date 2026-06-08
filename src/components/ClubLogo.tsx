import { useState } from 'react';
import { getClubMeta } from '../data/clubMeta';

interface ClubLogoProps {
  club: string | null;
  size?: number;
}

export default function ClubLogo({ club, size = 32 }: ClubLogoProps) {
  const [imgError, setImgError] = useState(false);
  const meta = getClubMeta(club);

  if (!club) {
    return (
      <span
        className="club-logo club-logo-empty"
        style={{ width: size, height: size }}
        aria-hidden
      >
        —
      </span>
    );
  }

  if (meta.logo && !imgError) {
    return (
      <img
        src={meta.logo}
        alt={`${club} logo`}
        className="club-logo club-logo-img"
        style={{ width: size, height: size }}
        onError={() => setImgError(true)}
        loading="lazy"
      />
    );
  }

  return (
    <span
      className="club-logo club-logo-fallback"
      style={{
        width: size,
        height: size,
        backgroundColor: meta.color,
        fontSize: size * 0.32,
      }}
      title={club}
    >
      {meta.shortName}
    </span>
  );
}
