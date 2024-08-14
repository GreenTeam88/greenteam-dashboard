import FormInputDataGetter from '@/components/custom/FormInputDataGetter';

interface PasswordSectionProps {
  form: any;
}
export default function PasswordSection({ form }: PasswordSectionProps) {
  return (
    <div className={'p-6'}>
      <div className={'flex flex-col gap-y-4'}>
        <FormInputDataGetter
          form={form}
          type={'password'}
          isPassword={true}
          label={'Old Password'}
          placeholder={'Input your old password'}
          name={'oldPassword'}
        />
        <FormInputDataGetter
          form={form}
          type={'password'}
          isPassword={true}
          label={'New Password'}
          placeholder={'Input your new password'}
          name={'newPassword'}
        />
        <FormInputDataGetter
          form={form}
          type={'password'}
          isPassword={true}
          label={'Confirm Password'}
          placeholder={'Confirm Password'}
          name={'newPasswordConfirm'}
        />
      </div>
    </div>
  );
}
