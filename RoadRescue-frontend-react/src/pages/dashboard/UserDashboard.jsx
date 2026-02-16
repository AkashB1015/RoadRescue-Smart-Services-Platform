import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Table, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import RoadRescueSection from '../../components/sections/RoadRescueSection';
import Services from '../../components/sections/Services';
import Testimonials from '../../components/sections/Testimonials';

const UserDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        
        const token = localStorage.getItem('token');

        if (!token) {

            navigate('/login');
            return;

        }

        window.scrollTo(0, 0);

    }, [navigate]);

    const scrollToDashboard = () => {

        const element = document.getElementById('dashboard-operations');

        if (element) {

            element.scrollIntoView({ behavior: 'smooth' });

        }

    };

    return (

        <div className="home-page fade-in">

            <RoadRescueSection>

                <Button
                    variant="danger"
                    size="lg"
                    className="px-5 rounded-pill fw-bold"
                    href="/services"
                >
                    Request Help
                </Button>

            </RoadRescueSection>

            <Services />
            <Testimonials />
            
        </div>
    );
};

export default UserDashboard;
