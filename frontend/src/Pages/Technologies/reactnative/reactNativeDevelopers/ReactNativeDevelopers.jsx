import React from 'react'

const ReactNativeDevelopers = () => {
    const SoftwareDesignData = [{ title: "IOS mobile apps", points: ["-------"] }, { title: "Android mobile apps", points: ["-------"] }, { title: "Web apps", points: ["-------"] }, { title: "Smart TV app", points: ["-------"] }, { title: "VR apps", points: ["-------"] }, { title: "AR apps", points: ["-------"] }]
    return (
        <div className='w-[85vw] mx-[110px] md:w-[90vw] md:mx-[20px] pt-[60px] pb-[30px]'>
            <div className='w-[100%] mb-[30px]'>
                <h1 className='font-bold text-3xl md:text-[24px]'>Software Our React Native Developers Build</h1>
                <p className='text-[14px] font-semibold mt-[20px] md:text-[16px]'>We cover the implementation of all core functionality modules of operations management software.</p>
            </div>
            <div className='w-[100%] flex flex-wrap justify-between'>
                {
                    SoftwareDesignData.map((item, index) => {
                        return (
                            <div className='w-[32.5%] h-[180px] md:w-[49%] md:h-auto md:pb-[20px] border border-[#fffff] mt-[20px] shadow-[4px] flex flex-col gap-[10px] pt-[15px] px-[15px] box-border' key={index}>
                                <h2 className='text-xl font-bold pl-[10px] md:text-[24px]'>{item.title}</h2>
                                <ul className='list-disc text-[12px] pl-[20px] md:text-[16px]'>
                                    {
                                        item.points.map((point, i) => {
                                            return (
                                                <li key={i}>{point}</li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default ReactNativeDevelopers