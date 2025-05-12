'use client'

import * as Icon from '@phosphor-icons/react';

const Backdrop = () => {
  return (
    <div className='flex items-center justify-center w-full h-full bg-white dark:bg-black'>
      <Icon.CircleNotch 
        className="animate-spin text-black dark:text-white text-4xl" 
        weight='bold' 
      />
    </div>
  );
}

export default Backdrop;
