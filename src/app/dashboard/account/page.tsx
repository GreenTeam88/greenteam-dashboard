'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import AccountSectionSelector from '@/components/account/AccountSectionSelector';
import PasswordSection from '@/components/account/PasswordSection';
import ProfileSection from '@/components/account/ProfileSection';
import CreateButton from '@/components/custom/CreateButton';
import { Form } from '@/components/ui/form';

// import { cn } from '@/lib/utils';

const accountProfileFormSchema = z.object({
  profileName: z.string(),
  email: z.string(),
  telephone: z.string(),
});
export default function Home() {
  const [activeSection, setActiveSection] = useState('Profile');
  const form = useForm<z.infer<typeof accountProfileFormSchema>>({
    resolver: zodResolver(accountProfileFormSchema),
  });
  const onInvalid = (errors: any) => console.log(errors);
  const onSubmit = (data: any) => console.log(data);
  return (
    <div className={'p-5 bg-bgLightGreen w-full h-full'}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className={'max-w-[650px] flex flex-col gap-y-6'}>
          <div className={'w-full flex items-center justify-between'}>
            <div>
              <h4 className={'font-semibold text-[24px] leading-6 text-textBlackNew'}>Password</h4>
            </div>
            <CreateButton type={'submit'}>Save</CreateButton>
          </div>
          <div className={'w-full bg-white border border-borderBlack10 rounded-lg'}>
            <AccountSectionSelector activeSection={activeSection} setActiveSection={setActiveSection} />
            {activeSection === 'Profile' && <ProfileSection form={form} />}
            {activeSection === 'Password' && <PasswordSection form={form} />}
          </div>
        </form>
      </Form>
    </div>
  );
}
