import React from "react";

type ImageProps = {
  imageSrc: string;
  imageAlt: string;
  imageClassName?: string;
};

const Image: React.FC<ImageProps> = ({
  imageSrc,
  imageAlt,
  imageClassName,
}) => {
  return (
    <img
      src={imageSrc}
      alt={imageAlt}
      className={`w-full h-auto object-cover ${imageClassName}`}
      // Add additional Tailwind CSS classes as default, e.g., `w-full h-auto object-cover`
      // You can override these by passing `className` prop
    />
  );
};

export default Image;
