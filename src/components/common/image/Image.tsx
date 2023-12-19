import React from "react";

type ImageProps = {
  src: string;
  alt: string;
  className?: string;
};

const Image: React.FC<ImageProps> = ({ src, alt, className }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`w-full h-auto object-cover ${className}`}
      // Add additional Tailwind CSS classes as default, e.g., `w-full h-auto object-cover`
      // You can override these by passing `className` prop
    />
  );
};

export default Image;
