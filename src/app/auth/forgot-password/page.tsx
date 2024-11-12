'use client';

import React from 'react';

import { ReactComponent as LogoWhite } from '@/assets/icons/LogoWhite.svg';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import withPublicAccess from '@/hoc/withPublicAccess';

function ForgotPassword() {
  return (
    <div className={'flex h-full'}>
      <div className={'bg-bgPrimaryGreen flex-1 flex justify-center items-center'}>
        <LogoWhite />
      </div>
      <div className={'bg-white overflow-y-scroll h-full flex-[2] flex justify-center items-center'}>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}

export default withPublicAccess(ForgotPassword);
