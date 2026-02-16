import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RoadRescueSection = ({ children }) => {
    return (
        <div
            className="d-flex align-items-center text-white py-5"

            style={{

                background: `linear-gradient(rgba(0, 51, 102, 0.6), rgba(0, 51, 102, 0.6)), url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '80vh',
                marginTop: '56px' // Adjust if there's a fixed header

            }}
        >
            <Container>

                <Row className="justify-content-center text-center">

                    <Col md={10} lg={8}>

                        <h1 className="display-4 fw-bold mb-4 text-white">On-Road Help When You Need It Most</h1>

                        <p className="lead mb-5 opacity-90">
                            Professional vehicle assistance 24/7. From flat tyres to engine breakdowns,
                            we bring the workshop to your location immediately.
                        </p>

                        <div className="d-flex gap-3 justify-content-center flex-wrap">

                            {children ? children : (

                                <>
                                    <Button
                                        as={Link}
                                        to="/services"
                                        variant="warning"
                                        size="lg"
                                        className="px-5 rounded-pill fw-bold"
                                    >
                                        Book a Service
                                    </Button>
                                    
                                    <Button
                                        as={Link}
                                        to="/contact"
                                        variant="outline-light"
                                        size="lg"
                                        className="px-5 rounded-pill fw-bold"
                                    >
                                        Get Emergency Help
                                    </Button>
                                </>

                            )}

                        </div>

                    </Col>

                </Row>

            </Container>
        </div>
    );
};

export default RoadRescueSection;
