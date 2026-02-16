import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const servicesData = [
    {
        id: 1,
        title: 'Flat Tyre Assistance',
        description: 'Quick tyre change or puncture repair at your location. We carry spares for all major models.',
        icon: 'bi-vinyl',
        color: 'text-primary'
    },
    {
        id: 2,
        title: 'Engine Breakdown',
        description: 'Expert diagnostics and on-spot repairs for engine failure, overheating, or starting issues.',
        icon: 'bi-gear-wide-connected',
        color: 'text-danger'
    },
    {
        id: 3,
        title: 'EV Bike Support',
        description: 'Specialized support for electric vehicles including battery jumpstart and charging assistance.',
        icon: 'bi-lightning-charge-fill',
        color: 'text-success'
    },
    {
        id: 4,
        title: '24/7 Emergency',
        description: 'Round-the-clock support for any roadside emergency. We reach you within 30 minutes.',
        icon: 'bi-clock-history',
        color: 'text-warning'
    }
];

const Services = () => {
    return (
        <section className="py-5 bg-light">
            <Container>
                <div className="text-center mb-5">
                    <h2 className="fw-bold mb-3">What We Provide</h2>
                    <p className="text-muted col-md-8 mx-auto lead">
                        Comprehensive vehicle support services designed to get you back on the road quickly and safely.
                    </p>
                </div>

                <Row className="g-4">
                    {servicesData.map((service) => (
                        <Col md={6} lg={3} key={service.id}>
                            <Card className="h-100 shadow-sm border-0 transition-hover text-center p-3">
                                <Card.Body>
                                    <div className={`mb-4 fs-1 ${service.color}`}>
                                        <i className={`bi ${service.icon}`}></i>
                                    </div>
                                    <Card.Title className="fw-bold mb-3">{service.title}</Card.Title>
                                    <Card.Text className="text-muted">
                                        {service.description}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </section>
    );
};

export default Services;
