'use client';

import * as Progress from '@radix-ui/react-progress';
import React, { useEffect, useState } from 'react';

const LoadingPageWithSpinner: React.FC<{ message?: string; minLoadingTime?: number }> = ({
  message = '',
  minLoadingTime = 2000,
}) => {
  const [isDelayed, setIsDelayed] = useState(true);

  useEffect(() => {
    // Set a timeout to disable the delay after the specified minimum loading time :)
    const timer = setTimeout(() => setIsDelayed(false), minLoadingTime);

    return () => clearTimeout(timer); // Clear the timer on component unmount
  }, [minLoadingTime]);

  if (!isDelayed) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-4">
        <Progress.Root
          className="relative w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"
          style={{ animationDuration: '0.4s' }}
        />
        <p className="text-lg font-medium text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default LoadingPageWithSpinner;
