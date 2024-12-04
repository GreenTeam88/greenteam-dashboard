'use client';
import EmailModel from "@/components/emailModel/EmailModel";
import withPublicAccess from "@/hoc/withPublicAccess"
import { useEffect, useState } from "react";


function NewsletterPage() {
    //THIS DATAS OBJECT IS  TO SIMULATE HOW THE NEWSLETTER RECEIVE DATAS . 
    const datas = {
        code: "CP",
        subject: "Collaboration proposal X",
        body: "We are excited to let you know that john dwe has accepted to collaborate with you on project my project.",
        receiver: "Dear Team", 
        status : "DECLINED", //DECLINED , ACCEPTED ,
        declinedMessage : "",
        project: {
            projectNumber: 100,
            projectName: "my project",
            projectDate: "20 DEC 2010 - 20 DEC 2030",
            projectCategory: "Construction",
            projectDescription: "lorim ipsum ttt",
            projectClientPref: "CL001",
            location: {
                street: "street name ",
                number: "street number",
                pc: "2000",
                city: "Agadir",
                country: "Maroc",
                parts: 'part of the house',
                floorNumber: 200
            },
            subcontractor: {
                name : "John Chadow"
            }
        }
    }
    const [data, setData] = useState(datas);
    useEffect(() => {
        setData((data) => datas);
    }, [])

    return (<>

        <EmailModel data={data} />
    </>)
}

export default (NewsletterPage)