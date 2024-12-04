import { ReactComponent as LogoWhite } from '@/assets/icons/LogoWhite.svg';
import { ReactComponent as LogoMailWhite } from '@/assets/icons/logoMailWhite.svg';
import { ReactComponent as EmailHeader } from '@/assets/icons/EmailHeader.svg';
import { url } from 'inspector';
const HeaderEmailModel = (props : any) => {
    const {subject , project} = props.data;
    // console.log(props);
    
    return (
        <>
            <div className={'flex flex-row w-full bg-[url("/EmailHeader.svg")]' }>
                <div className={' flex flex-col  justify-center items-start p-5'}>
                    {/* <LogoWhite /> */}
                    <figcaption className="  font-medium mb-2">
                        <div className="text-white font-light">
                            Subject
                        </div>
                        <div className="text-white font-bold">
                            {subject}
                        </div>
                    </figcaption>
                    <figcaption className="font-medium">
                        <div className="text-white font-light">
                            Project number
                        </div>
                        <div className="text-white font-bold">
                            {project.projectNumber}
                        </div>
                    </figcaption>
                </div>  
                <div className={' flex-1 flex justify-end items-center p-5'}>
                    <div className="w-50"><LogoMailWhite  /></div>
                </div>
               
            </div> 
        </>
    )
}

export default HeaderEmailModel;