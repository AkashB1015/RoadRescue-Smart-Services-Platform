import React, { useEffect } from 'react';
import RoadRescueSection from '../../components/sections/RoadRescueSection';
import Services from '../../components/sections/Services';
import Testimonials from '../../components/sections/Testimonials';

const Home = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="home-page fade-in">
            <RoadRescueSection />
            <Services />
            <Testimonials />
        </div>
    );
};

export default Home;
