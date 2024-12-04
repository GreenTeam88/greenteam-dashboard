const BodyEmailModel = (props : any) => {
    const {status, receiver, body, project} = props.data;
    
    return (
        <>
            <div className="flex flex-col gap-2  p-5 font-bold">
                <h2 className="font-bold">Dear {receiver}</h2>
                <p className=" text-base font-normal">{body}</p>
                {status == "DECLINED" && 
                <div className="projectDetail flex flex-col gap-2">
                    <span className="me-5 font-normal text-red-600 ">Reasons of declining </span>
                    {project.declinedMessage != null ? <span className="me-5 font-normal text-red-600 text-base ">{project.declinedMessage} </span> : <span className="font-normal text-base"> {project.subcontractor.name} did not enter any reason.</span>} 
                    </div>
                }
                <h3 className="font-bold">Project Details</h3>
                <div className="projectDetails bg-orange-100 border-orange-500 border-2 border-spacing-1 p-3 mb-3">
                {project.projectNumber != null && 
                <div className="projectDetail"><span className="me-5">Project Number : </span> {project.projectNumber}</div>
                }
                {project.projectName != null && 
                <div className="projectDetail"><span className="me-5">Project Name : </span> {project.projectName}</div>
                }
                {project.projectDate != null && 
                <div className="projectDetail"><span className="me-5">Project Date : </span> {project.projectDate}</div>
                }  

                </div>
                <div className="projectDetails bg-orange-100 border-orange-500 border-2 border-spacing-1 p-3 mb-3">
                {project.projectNumber != null && 
                <div className="projectDetail"><span className="me-5">Project Number : </span> {project.projectNumber}</div>
                }
                {project.projectName != null && 
                <div className="projectDetail"><span className="me-5">Project Name : </span> {project.projectName}</div>
                }
                {project.projectDate != null && 
                <div className="projectDetail"><span className="me-5">Project Date : </span> {project.projectDate}</div>
                }  

                </div>
                {   project.location != null && 
                    <>
                    <h3 className="font-bold">Project Location</h3>
                    <div className="projectLocation bg-orange-100 border-orange-500 border-2 border-spacing-1 p-3">
                    {project.location?.street != null && 
                    <div className="projectDetail"><span className="me-5">Street Name & Number: </span> {project.location.street} - {project.location.number}</div>
                    }
                    {project.location?.pc != null && 
                    <div className="projectDetail"><span className="me-5">Postal Code & City: </span> {project.location.pc} - {project.location.city}</div>
                    }
                    {project.location?.country != null && 
                    <div className="projectDetail"><span className="me-5">Country </span> {project.location?.country}</div>
                    }
                    {project.location?.floorNumber != null && 
                    <div className="projectDetail"><span className="me-5">Floor Number : </span> {project.location?.floorNumber}</div>
                    }</div>
                    </>
    
                    
                }


            </div> 
        </>
    )
}

export default BodyEmailModel;