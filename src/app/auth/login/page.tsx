'use client';

import React from 'react';

import LoginForm from '@/components/auth/LoginForm';
import withPublicAccess from '@/hoc/withPublicAccess'; // Adjust the import path according to your project structure

function LoginPage() {
  return (
    <div className={'flex h-full'}>
      <div className={'bg-bgPrimaryGreen flex-1 flex justify-center items-center'}>
        {/* Possibly place a logo here */}
      </div>
      <div className={'bg-white flex-[2] flex justify-center items-center'}>
        <LoginForm />
      </div>
    </div>
  );
}

export default withPublicAccess(LoginPage);
