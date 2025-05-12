'use client'

import * as React from 'react';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

export interface AvatarProps {
  text?: string;
  src?: string;
  className?: string;
}

export function Avatar({ text = '', src, className }: AvatarProps) {
  function getLabelAvatar() {
    const textArray = text.split(' ');

    const firstText = textArray.shift() ?? '';
    const lastText = textArray.pop() ?? '';

    const firstLetterFirstText = firstText.substring(0, 1).toUpperCase();
    const firstLetterLastText = lastText.substring(0, 1).toUpperCase();

    return firstLetterFirstText + firstLetterLastText;
  }

  const labelAvatar = getLabelAvatar();

  if (!src && text) {
    return (
      <div
        className={twMerge(
          'flex items-center justify-center text-xs rounded-full text-white font-semibold bg-black w-9 h-9',
          className
        )}
        aria-label={`Avatar for ${text}`}
      >
        {labelAvatar}
      </div>
    );
  }

  if (src) {
    return (
      <div className="relative w-9 h-9">
        <Image
          layout="fill"
          src={src}
          alt={text ?? 'Avatar'}
          className={twMerge('rounded-full', className)}
        />
      </div>
    );
  }

  return (
    <div
      className={twMerge('bg-black w-9 h-9 rounded-full', className)}
      aria-label="Default avatar"
    />
  );
}
