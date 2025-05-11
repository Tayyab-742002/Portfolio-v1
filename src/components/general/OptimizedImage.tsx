import { useState, useEffect } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Reset states when src changes
    setLoading(true);
    setError(false);
  }, [src]);

  return (
    <div className={`relative ${className}`}>
      <Image
        src={error ? '/fallback-image.jpg' : src}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
      />
      {loading && (
        <div className="absolute inset-0 bg-dark-500 animate-pulse" />
      )}
    </div>
  );
};