import BodyEmailModel from "./BodyEmailModel";
import FooterEmailModel from "./FooterEmailModel";
import HeaderEmailModel from "./HeaderEmailModel";

const EmailModel = (props: any) => {

    return (
        <>
        <div className="w-[100%] h-full bg-slate-50">
        <div className="w-[50%] min-w-96 m-auto bg-white">
            <HeaderEmailModel data = {props.data}/>
            <BodyEmailModel data = {props.data}/>
            <FooterEmailModel />
        </div>
        </div>
        </>
    )
}

export default EmailModel;