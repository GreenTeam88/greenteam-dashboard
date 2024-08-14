'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import CreateButton from '@/components/custom/CreateButton';
import FormInputDataGetter from '@/components/custom/FormInputDataGetter';
import { Form } from '@/components/ui/form';
import Link from "next/link";

const forgotPasswordSchema = z.object({
  email: z.string({ message: 'Email is required' }).email({ message: 'Email is not valid' }),
});

export default function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {},
  });
  const onInvalid = (errors: any) => console.error(errors);
  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    console.log(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className={'w-[450px] max-w-[90%] flex flex-col gap-y-16'}
      >
        <div className={'flex flex-col gap-y-4 items-center'}>
          <h2 className={'font-semibold text-[2rem] leading-[3rem]'}>Forgot password</h2>
          <h5 className={'text-textBlack80 text-base'}>Welcome back! Please enter your details</h5>
        </div>
        <div className={'flex flex-col gap-y-4'}>
          <FormInputDataGetter form={form} name={'email'} label={'Email'} placeholder={'Input email'} />
          <CreateButton type={'submit'}>Send</CreateButton>
        </div>
        <h5 className={'text-center text-base text-textBlack80'}>
          Don’t have an account?
          <Link className={'font-semibold ml-1 text-textSecondaryOrange'} href={'/auth/register'}>
            Sign up
          </Link>
        </h5>
      </form>
    </Form>
  );
}
