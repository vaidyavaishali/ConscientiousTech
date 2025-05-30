import React, { useEffect, useState, useRef } from 'react';
import aboutUsHeader from '../../../assets/AboutUs/ctAboutUs.png';

const Header = () => {
    const [isInView, setIsInView] = useState(false);
    const headerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.unobserve(headerRef.current); // Stop observing once the image is loaded
                }
            },
            { rootMargin: '0px', threshold: 0.1 }
        );

        if (headerRef.current) {
            observer.observe(headerRef.current);
        }

        return () => {
            if (headerRef.current) {
                observer.unobserve(headerRef.current);
            }
        };
    }, []);

    return (
        <div ref={headerRef} className="w-[100vw] h-[100vh]">
            <div className="w-screen h-[100vh]">
                <div
                    className="w-full h-full relative"
                    style={{
                        backgroundImage: isInView ? `url(${aboutUsHeader})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="w-[100%] h-[100%] absolute top-0 left-0 bg-black opacity-[0.6] flex flex-col lg:justify-center lg:items-start box-border px-3 gap-[50px] justify-evenly items:center">
                        <div className="h-fit flex flex-col gap-[40px] justify-center w-[100%]">
                            <h2
                                className="lg:text-3xl font-semibold text-white lg:w-[80%] w-[90%] leading-10 text-xl xl:text-3xl 2xl:text-5xl lg:ms-[110px] ms-[0px]"
                                style={{ fontFamily: 'Montserrat' }}
                            >
                                Conscientious Technology
                            </h2>
                            <p
                                className="lg:text-xl 2xl:text-2xl text-[16px] text-white text-left lg:ms-[110px] ms-0 lg:w-[60%] w-[90%] mx-auto lg:mx-0"
                                style={{ fontFamily: 'Poppins' }}
                            >
                                Discover how ValueCoders partnered with a visionary client to revolutionize the traditional retail and wholesale landscape with a groundbreaking Flutter-based mobile application. This innovative solution empowers retailers and wholesalers to establish a robust online presence with minimal cost.
                            </p>
                        </div>
                        <button className="relative overflow-hidden text-white border border-current w-[fit-content] lg:px-3 py-1 lg:ms-[110px] group border-b-2 lg:text-xl px-4 ms-0 text-base">
                            <span className="absolute inset-0 bg-gradient-to-r from-[#7CE0FF] via-[#A598FF] to-[#C462FF] transition-width duration-300 ease-in-out transform -translate-x-full group-hover:translate-x-0"></span>
                            <span className="relative z-10">Connect With Our Experts<span className="font-bold">&rarr;</span></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
