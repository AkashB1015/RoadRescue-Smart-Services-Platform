import React, { useEffect } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';

const AboutUs = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="pt-5 mt-5">
            <Container className="py-5">
                <Row className="align-items-center mb-5">
                    <Col lg={6}>
                        <h1 className="display-4 fw-bold mb-4 text-primary">About Us</h1>
                        <p className="lead text-muted mb-4">
                            We are a dedicated team of automotive experts passionate about road safety and quick assistance.
                            Founded in 2025, RoadRescue has helped over 10,000 drivers get back on the road safely.
                        </p>
                        <p className="text-muted">
                            Our mission is to provide reliable, transparent, and fast roadside support through technology.
                            Whether you drive a classic car or a modern EV, our network of certified professionals is ready to help 24/7.
                        </p>
                    </Col>
                    <Col lg={6}>
                        <Image
                            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop"
                            alt="Team at work"
                            fluid
                            className="rounded-4 shadow-lg"
                        />
                    </Col>
                </Row>

                <Row className="text-center mt-5 mb-5 g-4">
                    <Col md={4}>
                        <div className="p-4 bg-light rounded-3 h-100">
                            <h3 className="fw-bold text-primary display-4">10k+</h3>
                            <p className="text-uppercase fw-bold text-secondary">Assisted Drivers</p>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="p-4 bg-light rounded-3 h-100">
                            <h3 className="fw-bold text-primary display-4">30m</h3>
                            <p className="text-uppercase fw-bold text-secondary">Avg. Arrival Time</p>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="p-4 bg-light rounded-3 h-100">
                            <h3 className="fw-bold text-primary display-4">50+</h3>
                            <p className="text-uppercase fw-bold text-secondary">Cities Covered</p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AboutUs;
