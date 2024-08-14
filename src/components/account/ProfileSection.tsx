'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import ProfilePhoto from '@/assets/userAvatar.png';
import FormInputDataGetter from '@/components/custom/FormInputDataGetter';
import { Button } from '@/components/ui/button';

interface ProfileSectionProps {
  form: any;
}

export default function ProfileSection({ form }: ProfileSectionProps) {
  return (
    <div className={'p-6 flex flex-col gap-y-6'}>
      <div className={'flex items-center gap-x-6'}>
        <div className={'size-16'}>
          <img src={ProfilePhoto.src} alt={'Profile Photo'} className={'w-full h-full rounded-full'} />
        </div>
        <div className={'flex items-center gap-x-4'}>
          <Button className={'py-2.5 px-5 rounded-lg h-auto bg-bgPrimaryGreen text-sm text-white'} type={'button'}>
            Change picture
          </Button>
          <Button
            className={'py-2.5 px-5 h-auto border border-statusDanger rounded-lg text-sm text-statusRed'}
            type={'button'}
          >
            Delete picture
          </Button>
        </div>
      </div>
      <div className={'flex flex-col gap-y-4'}>
        <FormInputDataGetter
          form={form}
          label={'Profile name'}
          placeholder={'Input your profile name'}
          name={'profileName'}
        />
        <FormInputDataGetter form={form} label={'E-mail'} placeholder={'Input your e-mail'} name={'email'} />
        <FormInputDataGetter form={form} label={'Telephone'} placeholder={'Input your telephone'} name={'telephone'} />
      </div>
    </div>
  );
}
