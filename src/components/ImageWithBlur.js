import Image from 'next/image';
import { useState } from 'react';

const ImageWithBlur = ({ src, alt, width, height, className, ...props }) => {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className="relative overflow-hidden">
      <Image
        src={src}
        alt={alt || ''}
        width={width}
        height={height}
        className={`${className} transition-all duration-300 ease-in-out ${
          isLoading ? 'scale-110 blur-sm grayscale' : 'scale-100 blur-0 grayscale-0'
        }`}
        onLoadingComplete={() => setLoading(false)}
        {...props}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
    </div>
  );
};

export default ImageWithBlur;