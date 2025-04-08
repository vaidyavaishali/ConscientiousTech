import React from 'react'

const FullScaleWebDevelopment = () => {
    const fullStackScaleDev = [{title:"Business analysis", desc:"Our business analysts focus on the needs of your target audience to perform requirements engineering and outline the scope of the solution. They also bridge the gap between business stakeholders and an IT team to keep all the involved parties aligned."}, {title:"UX and UI design", desc:"We start designing a web app with the analysis of target audience and planning convenient, quick and frictionless user journeys. Along the way, our UI designers join in to wrap the interface into a stylish cover."}, {title:"Architecture", desc:"Our solution architects will plan all functional components and select optimal techs for them to ensure that the business logic to be implemented is feasible and full. They will also map all API connections within the web solution and with outside systems."}, {title:"Front-end Development", desc:"Our front-end developers can implement any design idea and ensure all interface elements work properly. We work with all most-used JavaScript frameworks, such as Angular, React, Meteor, Vue, Next, Ember."}, {title:"Back-end Development", desc:"Our developers accurately implement the business logic of your web app on the back end. We rely on proven frameworks and ensure fast and quality coding in .Net, Java, Python, Node.js, PHP, Go."},{title:"Integration", desc:"We set up APIs to integrate your web app with corporate or third-party systems and services. App integration ensures immediate data synchronization across systems."}, {title:"QA and Testing", desc:"We guarantee that your web solution will function flawlessly, work fast, be user-friendly and secure. We have a team of skilled testing engineers to make promises like that."}, {title:"Help Desk", desc:"Providing L1, L2 and L3 support services, we deliver hot-fixes within 24 hours to prevent or resolve any issues in usage, technology and code that may arise. We help you provide high availability and trouble-free functionality of your web app."}, {title:"support", desc:"We advance your web-based software to keep it efficient, competitive on the market, and compliant with all your evolving business needs. Our well-established DevOps processes let us roll out urgent updates within 1-2 days and release new, planned functional modules every 2-6 weeks."}]
    return (
        <div className='w-[100vw] h-[auto] box-border pt-[40px] md:pt-[50px] pb-[30px] pb-[60px]'>
            <div className='w-[85%] mx-auto md:w-[90%]'>
                <h1 className='text-3xl font-bold md:text-[16px] md:text-[blue]'>Full-Scale Web Development by Conscientious Technology</h1>
                <p className='w-[95%] text-[14px] mt-2 md:w-[100%] md:text-[12px]'>Throughout all web development services, ScienceSoft adheres to aquality-first approach based on ISO 9001-certified quality management system. Our comprehensive security management program with robust security controls, policies and technologies is compliant with ISO 27001 regulations.</p>
            </div>
            <div className='w-[85%] flex mx-auto flex-wrap gap-x-[60px] gap-y-[30px] mt-8'>
                {fullStackScaleDev.map((item, index) => (
                    <div key={index} className='w-[300px] h-[220px] border border-gray-300 p-3'>
                        <h1 className='text-[18px] font-bold'>{item.title}</h1>
                        <p className='text-[13.5px] mt-2 font-medium'>{item.desc}</p>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default FullScaleWebDevelopment
