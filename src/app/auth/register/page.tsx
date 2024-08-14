import { ReactComponent as LogoWhite } from '@/assets/icons/LogoWhite.svg';
import RegisterForm from "@/components/auth/RegisterForm";

export default async function Home() {
  return (
    <div className={'flex h-full'}>
      <div className={'bg-bgPrimaryGreen flex-1 flex justify-center items-center'}>
        <LogoWhite />
      </div>
      <div className={'bg-white overflow-y-scroll h-full flex-[2] flex justify-center items-center'}>
        <RegisterForm />
      </div>
    </div>
  );
}
