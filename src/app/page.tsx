'use client';

import { useRouter } from 'next/navigation';
import { useLayoutEffect } from 'react';

export default function Home() {
  const router = useRouter();
  useLayoutEffect(() => {
    router.push('/dashboard/projects');
  }, [router]);
  return (
    <div className={'bg-bgLightGreen w-full h-full p-5'}>
      <h1>
        Redirecting to <a href={'/dashboard/projects'}>dashboard</a>
      </h1>
    </div>
  );
}

// to modify after and do the loading screen instead of the redirecting to

// use router for redirecting instead of href for better ux
