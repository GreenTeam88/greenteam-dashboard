import { ReactComponent as LogoWhite } from '@/assets/icons/LogoWhite.svg';
import LoginForm from '@/components/auth/LoginForm';

export default async function Home() {
  return (
    <div className={'flex h-full'}>
      <div className={'bg-bgPrimaryGreen flex-1 flex justify-center items-center'}>
        <LogoWhite />
      </div>
      <div className={'bg-white flex-[2] flex justify-center items-center'}>
        <LoginForm />
      </div>
    </div>
  );
}
