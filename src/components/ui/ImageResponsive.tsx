import Image, { ImageProps } from 'next/image';

interface ImageResponsiveProps extends Omit<ImageProps, 'fill'> {
  fill?: boolean;
  aspectRatio?: string;
}

export default function ImageResponsive({
  alt,
  fill,
  sizes,
  priority = false,
  placeholder = "blur",
  blurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bz6rt3/Z",
  quality = 85,
  aspectRatio,
  ...rest
}: ImageResponsiveProps) {
  // Default responsive sizes ottimizzate per mobile-first
  const defaultSizes = fill 
    ? "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
    : sizes || "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw";

  const imageProps = {
    alt,
    sizes: defaultSizes,
    placeholder: blurDataURL ? placeholder : undefined,
    blurDataURL: blurDataURL || undefined,
    priority,
    quality,
    ...rest
  };

  if (fill) {
    return (
      <div className="relative w-full h-full" style={{ aspectRatio }}>
        <Image {...imageProps} fill />
      </div>
    );
  }

  return <Image {...imageProps} />;
}