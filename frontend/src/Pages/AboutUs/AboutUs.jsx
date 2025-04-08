import React from 'react'
import AllHeader from '../RepeatedComponents/haeder/AllHeader'
import OurPartener from '../HomePage/Component/OurPartener/OurPartener'
import SubNavBar from './Component/subNavbar/SubNavBar'
import AboutUsDesc from './Component/AboutUsDesc/AboutUsDesc'
import OurStory from './Component/OurStory/OurStory'
import OurMission from './Component/OurMission/OurMission'
import OurCoreValues from './Component/OurCoreValue/OurCoreValues'
import ProudExistence from './Component/ProudExistence/ProudExistence'
import MeetOurClient from '../HomePage/Component/MeetOurClient/MeetOurClient'
import BookFreeConsultation from '../HomePage/Component/BookFreeConsultation/BookFreeConsultation'
import Footer from '../HomePage/Component/Footer/Footer'
import OurPeople from './Component/OurPeople/OurPeople'
import PartnerEcoSystem from './Component/PartnerEcosystem/PartnerEcoSystem'
import ServiceWeProvide from './Component/serviceWeProvide/ServiceWeProvide'
import Header from './Component/aboutUsHeader/AboutUsHeader'
const AboutUs = ({ setHideNavbar, setActiveSubNav }) => {
    return (
        <div>
            <Header/>
            <OurPartener />
            <SubNavBar setHideNavbar={setHideNavbar} setActiveSubNav={setActiveSubNav} />
            <AboutUsDesc />
            <OurStory />
            <OurPeople />
            <OurCoreValues />
            <ProudExistence />
            <PartnerEcoSystem />
            <ServiceWeProvide/>
            <MeetOurClient />
            <BookFreeConsultation />
            <Footer />
        </div>
    )
}

export default AboutUs
