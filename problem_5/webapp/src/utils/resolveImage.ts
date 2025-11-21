import React from 'react';

export default function resolveImage(image: string) {
  // normalize image path:
  // - if user passed '../public/images/xxx.jpg' or '../images/xxx.jpg' convert to '/images/xxx.jpg'
  // - if user passed 'images/xxx.jpg' -> '/images/xxx.jpg'
  // - if already absolute '/...' keep as is
  return React.useMemo(() => {
    if (!image) return '/images/auth-left.jpg';
    if (image.startsWith('/')) return image;
    // remove any leading ../ or ./ and remove any leading "public" segment
    const cleaned = image
      .replace(/^(\.\/|\/)?/, '')
      .replace(/^(\.\.\/)+/, '')
      .replace(/^public\//, '');
    return cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
  }, [image]);
}
