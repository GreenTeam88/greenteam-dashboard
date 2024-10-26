'use client';

import React from 'react';

import LoginForm from '@/components/auth/LoginForm';
import withPublicAccess from '@/hoc/withPublicAccess';

function LoginPage() {
  return (
    <div className={'flex h-full'}>
      <div className={'bg-bgPrimaryGreen flex-1 flex justify-center items-center'}></div>
      <div className={'bg-white flex-[2] flex justify-center items-center'}>
        <LoginForm />
      </div>
    </div>
  );
}

export default withPublicAccess(LoginPage);
