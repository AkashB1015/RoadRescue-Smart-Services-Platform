import React from "react";
import { Container, Carousel, Card, Row, Col } from "react-bootstrap";

import shubham from "../../assets/Profiles/shubham.jpg";
import ruttik from "../../assets/profiles/ruttik.jpg";
import nidhi from "../../assets/profiles/nidhi.jpg";
import akash from "../../assets/profiles/akash.jpg";
import akanksha from "../../assets/profiles/akanksha.jpg";

const teamMembers = [
    {
        id: 1,
        name: "Shubham Thakur",
        role: "Project Lead",
        description:
            "Leading the RoadRescue platform architecture, planning, and coordination to deliver reliable emergency services.",
        image: shubham
    },
    {
        id: 2,
        name: "Ruttik Hiwase",
        role: "Backend Developer",
        description:
            "Responsible for backend APIs, authentication, and secure data handling for the platform.",
        image: ruttik
    },
    {
        id: 3,
        name: "Nidhi Kumari",
        role: "Frontend Developer",
        description:
            "Focused on building a clean, responsive, and user-friendly interface for RoadRescue.",
        image: nidhi
    },
    {
        id: 4,
        name: "Akash Bhadane",
        role: "Full Stack Developer",
        description:
            "Worked on frontend-backend integration, UI logic, and performance optimization.",
        image: akash
    },
    {
        id: 5,
        name: "Akanksha Puri",
        role: "UI / UX Designer",
        description:
            "Designed intuitive layouts and ensured a consistent and professional user experience.",
        image: akanksha
    }
];

const TeamCarousel = () => {
    return (
        <section className="py-5 bg-white">
            <Container>

                <div className="text-center mb-5">
                    <h2 className="fw-bold text-primary">Meet Our Team</h2>
                    <p className="text-muted">
                        The people behind RoadRescue who make emergency help possible.
                    </p>
                </div>

                <Row className="justify-content-center">
                    <Col lg={8}>
                        <Carousel
                            indicators
                            controls={false}
                            interval={2000}
                            pause="hover"
                            className="pb-5"
                        >
                            {teamMembers.map((member) => (
                                <Carousel.Item key={member.id}>
                                    <Card className="text-center border-0 p-4">

                                        {/* Profile Image */}
                                        <div className="d-flex justify-content-center mb-4">
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="rounded-circle shadow-sm"
                                                width="150"
                                                height="150"
                                                style={{ objectFit: "cover" }}
                                            />
                                        </div>

                                        <Card.Body>

                                            <Card.Text
                                                className="fs-5 fst-italic mb-4 text-dark position-relative text-center"
                                                style={{
                                                    padding: "0 3.5rem",
                                                    lineHeight: "1.9",
                                                    maxWidth: "720px",
                                                    margin: "0 auto"
                                                }}
                                            >
                                                {/* Left Quote */}
                                                <span
                                                    style={{
                                                        position: "absolute",
                                                        top: "0",
                                                        left: "0",
                                                        fontSize: "2.2rem",
                                                        color: "#000",
                                                        opacity: 0.18
                                                    }}
                                                >
                                                    “
                                                </span>

                                                {member.description}

                                                {/* Right Quote */}
                                                <span
                                                    style={{
                                                        position: "absolute",
                                                        bottom: "0",
                                                        right: "0",
                                                        fontSize: "2.2rem",
                                                        color: "#000",
                                                        opacity: 0.18
                                                    }}
                                                >
                                                    ”
                                                </span>
                                            </Card.Text>

                                            {/* Name & Role */}
                                            <h5 className="fw-bold mb-1">{member.name}</h5>
                                            <small className="text-muted">{member.role}</small>
                                        </Card.Body>

                                    </Card>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default TeamCarousel;
