import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../assets/style.css'
const Footer = () => {
    return (
        <footer className="bg-dark text-light py-5 mt-auto">
            <Container>
                <Row className="gy-4">
                    <Col md={4}>
                        <h5 className="fw-bold text-white mb-3">
                            <i className="bi bi-shield-fill-check me-2"></i>RoadRescue
                        </h5>
                        <p className="text-secondary">
                            Providing 24/7 on-road emergency assistance and vehicle services. Reliable help when you need it most.
                        </p>
                    </Col>
                    <Col md={2}>
                        <h6 className="fw-bold text-white mb-3">Quick Links</h6>
                        <ul className="list-unstyled">
                            <li className="mb-2"><Link to="/" className="text-secondary text-decoration-none hover-white">Home</Link></li>
                            <li className="mb-2"><Link to="/services" className="text-secondary text-decoration-none hover-white">Services</Link></li>
                            <li className="mb-2"><Link to="/about" className="text-secondary text-decoration-none hover-white">About Us</Link></li>
                            <li className="mb-2"><Link to="/contact" className="text-secondary text-decoration-none hover-white">Contact</Link></li>
                        </ul>
                    </Col>
                    <Col md={3}>
                        <h6 className="fw-bold text-white mb-3">Contact Us</h6>
                        <ul className="list-unstyled text-secondary">
                            <li className="mb-2"><i className="bi bi-geo-alt me-2"></i> CDAC Kharghar, Mumbai</li>
                            <li className="mb-2"><i className="bi bi-telephone me-2"></i>+91 9657403821</li>
                            <li className="mb-2"><i className="bi bi-envelope me-2"></i> help.roadrescue@gmail.com</li>
                        </ul>
                    </Col>
                    <Col md={3}>
                        <h6 className="fw-bold text-white mb-3">Follow Us</h6>
                        <div className="d-flex gap-3">
                            <a href="#" className="text-white fs-5"><i className="bi bi-facebook"></i></a>
                            <a href="#" className="text-white fs-5"><i className="bi bi-twitter-x"></i></a>
                            <a href="#" className="text-white fs-5"><i className="bi bi-instagram"></i></a>
                            <a href="#" className="text-white fs-5"><i className="bi bi-linkedin"></i></a>
                        </div>
                    </Col>
                </Row>
                <hr className="border-secondary my-4" />
                <Row>
                    <Col className="text-center text-secondary small">
                        &copy; {new Date().getFullYear()} RoadRescue. All rights reserved.
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
