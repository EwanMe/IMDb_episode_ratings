import React from 'react';

export default function Loader({ size }) {
  let classList = ['loader'];
  const validSizes = ['small', 'medium', 'large'];

  if (validSizes.includes(size)) {
    classList.push(size);
  } else {
    classList.push(validSizes[0]);
  }

  return <div className={classList.join(' ')} />;
}
