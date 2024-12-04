import { ReactComponent as LogoMailWhitePrimary } from '@/assets/icons/logo.svg';
const FooterEmailModel = () => {
    return (
        <>
                <div className={' flex flex-col gap-2  justify-center items-start p-3'}>
                    <h3 className='font-light'>Good Luck</h3>
                    <div className="w-50"><LogoMailWhitePrimary  /></div>
                </div>  
        </>
    )
}

export default FooterEmailModel;