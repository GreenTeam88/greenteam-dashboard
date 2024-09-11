'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import RememberFor from '@/components/auth/RememberFor';
import CreateButton from '@/components/custom/CreateButton';
import FormInputDataGetter from '@/components/custom/FormInputDataGetter';
import { Form } from '@/components/ui/form';
import { useAuth } from '@/queryHooks/auth';

const registerFormSchema = z.object({
  firstName: z.string({ message: 'First name is required' }),
  lastName: z.string({ message: 'Last name is required' }),
  email: z.string({ message: 'Email is required' }).email({ message: 'Email is not valid' }),
  password: z.string({ message: 'Password is required' }),
  confirmPassword: z.string({ message: 'Confirm password is required' }),
});

export default function RegisterForm() {
  const { register } = useAuth();
  const { mutate } = register;
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {},
  });
  const onInvalid = (errors: any) => console.error(errors);
  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    // await loginAction(values);
    mutate({
      email: values.email,
      password: values.password,
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className={'w-[450px] h-full max-w-[90%] flex flex-col gap-y-8'}
      >
        <div className={'flex flex-col gap-y-2 items-center'}>
          <h2 className={'font-semibold text-[2rem] leading-[3rem]'}>Register</h2>
          <h5 className={'text-textBlack80 text-base'}>Welcome to Greenteam! Please enter your details</h5>
        </div>
        <div>
          <div className={'flex flex-col gap-y-2'}>
            <FormInputDataGetter form={form} name={'firstName'} label={'First Name'} placeholder={'Input first name'} />
            <FormInputDataGetter form={form} name={'lastName'} label={'Last Name'} placeholder={'Input last name'} />
            <FormInputDataGetter
              form={form}
              type={'email'}
              name={'email'}
              label={'Email'}
              placeholder={'Input email'}
            />
            <FormInputDataGetter
              isPassword={true}
              form={form}
              name={'password'}
              label={'Password'}
              placeholder={'Input password'}
            />
            <FormInputDataGetter
              isPassword={true}
              form={form}
              name={'confirmPassword'}
              label={'Confirm Password'}
              placeholder={'Input password'}
            />
            <CreateButton type={'submit'}>Sign up</CreateButton>
          </div>
        </div>

        <h5 className={'text-center text-base text-textBlack80'}>
          Already have an account?
          <Link className={'font-semibold ml-1 text-textSecondaryOrange'} href={'/auth/login'}>
            Sign in here
          </Link>
        </h5>
      </form>
    </Form>
  );
}
