import React, { useEffect, useState } from 'react'
import Header from './components/Header';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import OurPartener from '../HomePage/Component/OurPartener/OurPartener';
import OverviewSection from './components/OverviewSection';
import GoalSection from './components/GoalSection';
import InsightSection from './components/InsightSection';
import Challages from './components/Challages';
import Execution from './components/Execution';
import Soluion from './components/Solution';
import Result from './components/Result';
import Technologies from './components/Technologies';
import MoreCaseStudies from './components/MoreCaseStudies';
import BookFreeConsultation from '../HomePage/Component/BookFreeConsultation/BookFreeConsultation';
import Footer from '../HomePage/Component/Footer/Footer';
import { Helmet } from 'react-helmet';

const CaseStudy = () => {
    const { id } = useParams()
    const [caseStudy, setCaseStudy] = useState([])
    const fetchCaseStudy = async () => {
        try {
            const response = await axios.get(`https://conscientious-technologies-backend.vercel.app/get-case-studies-by-id/${id}`)
            setCaseStudy(response.data)
        } catch (error) {
            console.log("Error fetching case study data:", error)
        }
    }
    useEffect(() => {
        fetchCaseStudy()
    }, [])
    return (

        <div>
            <div>
                <Helmet>
                    <title>Case study</title>
                    <meta
                        name="description"
                        content={``}
                    />
                    <meta name="keywords" content="CT, Technology, Industries, Benefits, Case study" />
                </Helmet>
                <Header
                    headerTagline={caseStudy.headerTagLine}
                    headerImage={caseStudy.headerImage}
                    headerdesc={caseStudy.headerdesc}
                />
                <OurPartener />
                <OverviewSection overviewtitle={caseStudy.overviewtitle} overviewdescription={caseStudy.overviewdescription} overviewimage={caseStudy.overviewimage} overviewservicesProvided={caseStudy.overviewservicesProvided} overviewindustryType={caseStudy.overviewindustryType} overviewbusinessType={caseStudy.overviewbusinessType} />
                <GoalSection goals={caseStudy.goals} />
                <InsightSection insights={caseStudy.insights} insightsImage={caseStudy.insightsImage} />
                <Challages challenges={caseStudy.challenges} />
                <Execution executionHeading1={caseStudy.executionHeading1} executionHeading2
                    ={caseStudy.executionHeading2} executionHeading3={caseStudy.executionHeading3} executionPoint1={caseStudy.executionPoint1} executionPoint2={caseStudy.executionPoint2} executionPoint3={caseStudy.executionPoint3} executionHeading4={caseStudy.executionHeading4} executionPoint4={caseStudy.executionPoint4} />
                <Soluion solutionImage={caseStudy.solutionImage} Soluion={caseStudy.solution} />
                <Result resultsImg1={caseStudy.resultsImg1} resultsImg2={caseStudy.resultsImg2} resultsImg3={caseStudy.resultsImg3} />
                <Technologies techTools={caseStudy.techTools} />
                <MoreCaseStudies />
                <BookFreeConsultation />
                <Footer />
            </div>
        </div>
    )


}

export default CaseStudy

