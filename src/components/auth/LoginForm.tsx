'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { loginAction } from '@/app/actions/loginAction';
import RememberFor from '@/components/auth/RememberFor';
import CreateButton from '@/components/custom/CreateButton';
import FormInputDataGetter from '@/components/custom/FormInputDataGetter';
import { Form } from '@/components/ui/form';

const loginFormSchema = z.object({
  email: z.string({ message: 'Email is required' }).email({ message: 'Email is not valid' }),
  password: z.string({ message: 'Password is required' }),
  rememberMe: z.boolean(),
});

export default function LoginForm() {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });
  const onInvalid = (errors: any) => console.error(errors);
  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    await loginAction(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className={'w-[450px] max-w-[90%] flex flex-col gap-y-16'}
      >
        <div className={'flex flex-col gap-y-4 items-center'}>
          <h2 className={'font-semibold text-[2rem] leading-[3rem]'}>Sign in</h2>
          <h5 className={'text-textBlack80 text-base'}>Welcome back! please enter your details</h5>
        </div>
        <div>
          <div className={'flex flex-col gap-y-4'}>
            <FormInputDataGetter form={form} name={'email'} label={'Email'} placeholder={'Input email'} />
            <FormInputDataGetter
              isPassword={true}
              form={form}
              name={'password'}
              label={'Password'}
              placeholder={'Input password'}
            />
            <RememberFor
              value={form.getValues('rememberMe')}
              onChange={(value) => form.setValue('rememberMe', value)}
            />
            <CreateButton type={'submit'}>Login</CreateButton>
          </div>
        </div>

        <h5 className={'text-center text-base text-textBlack80'}>
          Don’t have an account?
          <Link className={'font-semibold ml-1 text-textSecondaryOrange'} href={'/auth/login'}>
            Sign up
          </Link>
        </h5>
      </form>
    </Form>
  );
}
