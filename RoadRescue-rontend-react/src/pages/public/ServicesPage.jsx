import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../constants/APIConstants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const ServicesPage = () => {
    const navigate = useNavigate();
    const [servicesList, setServicesList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [bookingDate, setBookingDate] = useState('');
    const [location, setLocation] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.SERVICES.ALL);
            if (response.ok) {
                const data = await response.json();
                setServicesList(data);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    const handleBookClick = (service) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.warning("Please login to book a service.");
            navigate('/login');
            return;
        }
        setSelectedService(service);
        // Default to current time + 1 hour approx
        // Default to current time, formatted as local ISO string for datetime-local input
        const now = new Date();
        const localIsoString = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
        setBookingDate(localIsoString);
        setLocation('');
        setNotes('');
        setShowModal(true);
        setError('');
        setSuccess('');
    };

    const handleClose = () => setShowModal(false);

    const [loadingLocation, setLoadingLocation] = useState(false);

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }

        setLoadingLocation(true);
        setError('');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // Using OpenStreetMap Nominatim for Reverse Geocoding (Free, no key required for demo)
                // If you have a Google Maps API Key, you can replace this URL with:
                // `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_API_KEY`
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data && data.display_name) {
                            setLocation(data.display_name);
                        } else {
                            setLocation(`${latitude}, ${longitude}`);
                        }
                        setLoadingLocation(false);
                    })
                    .catch(err => {
                        console.error("Geocoding error:", err);
                        setLocation(`${latitude}, ${longitude}`); // Fallback to coordinates
                        setLoadingLocation(false);
                    });
            },
            (error) => {
                console.error("Geolocation error:", error);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setError("User denied the request for Geolocation.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setError("Location information is unavailable.");
                        break;
                    case error.TIMEOUT:
                        setError("The request to get user location timed out.");
                        break;
                    default:
                        setError("An unknown error occurred.");
                }
                setLoadingLocation(false);
            }
        );
    };

    const handleConfirmBooking = async () => {
        if (!location) {
            setError("Please enter your current location.");
            return;
        }

        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_ENDPOINTS.BOOKINGS.CREATE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    serviceType: selectedService.title,
                    bookingDate: bookingDate,
                    location: location,
                    notes: notes
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Booking failed.');
            }

            toast.success(`Booking confirmed for ${selectedService.title}!`);
            setShowModal(false);
            setSuccess('');
            navigate('/user-dashboard');

        } catch (err) {
            const errorMessage = err.message || 'An error occurred while booking.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-5 mt-5">
            <div className="bg-primary text-white py-5 mb-5 text-center" style={{
                background: 'linear-gradient(135deg, #0B5ED7, #38BDF8)',
                color: '#FFFFFF'
            }}
            >
                <Container>
                    <h1 className="display-4 fw-bold">Our Services</h1>
                    <p className="lead opacity-75">Professional roadside assistance for every situation.</p>
                </Container>
            </div>

            <Container className="mb-5">
                <Row className="g-4">
                    {loading ? (
                        <Col xs={12}>
                            <LoadingSpinner message="Loading services..." />
                        </Col>
                    ) : servicesList.length === 0 ? (
                        <Col xs={12} className="text-center">
                            <p className="lead text-muted">No services available at the moment.</p>
                        </Col>
                    ) : (
                        servicesList.map(service => (
                            <Col md={6} lg={4} key={service.serviceId}>
                                <Card className="h-100 shadow-sm border-0 hover-lift">
                                    <Card.Body className="p-4 d-flex flex-column">
                                        <div className="d-flex align-items-center mb-3">
                                            <i className={`bi ${service.icon} fs-1 me-3`}></i>
                                            <div>
                                                <h4 className="fw-bold mb-0">{service.title}</h4>
                                                <span className="badge bg-light text-dark border mt-1">Starts at {service.price}</span>
                                            </div>
                                        </div>
                                        <Card.Text className="text-muted mb-4 flex-grow-1">
                                            {service.description}
                                        </Card.Text>
                                        <Button
                                            variant="outline-primary"
                                            className="w-100 rounded-pill mt-auto"
                                            onClick={() => handleBookClick(service)}
                                        >
                                            Book Now
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )))}
                </Row>

                <div className="text-center mt-5 p-5 bg-light rounded-4">
                    <h3>Need something not listed here?</h3>
                    <p className="text-muted">Contact our support team for custom inquiries.</p>
                    <Button as={Link} to="/contact" variant="dark" size="lg" className="rounded-pill px-5">Contact Us</Button>
                </div>
            </Container>

            {/* Booking Modal */}
            <Modal show={showModal} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Book Service: {selectedService?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Service Type</Form.Label>
                            <Form.Control type="text" value={selectedService?.title} readOnly disabled />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Preferred Schedule Time</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={bookingDate}
                                min={new Date().toISOString().slice(0, 16)}
                                onChange={(e) => setBookingDate(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Current Location <span className="text-danger">*</span></Form.Label>
                            <div className="input-group">
                                <Form.Control
                                    type="text"
                                    placeholder="e.g. 19 mumbai, maharashtra"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={handleUseCurrentLocation}
                                    disabled={loadingLocation}
                                    title="Use my current location"
                                >
                                    {loadingLocation ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                        <i className="bi bi-geo-alt-fill"></i>
                                    )}
                                </Button>
                            </div>
                            <Form.Text className="text-muted">
                                Click the icon to detect your location automatically.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Problem Description (Notes)</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Describe the issue (e.g. car won't start, flat tyre)"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Text className="text-muted">
                            Help us come prepared with the right tools.
                        </Form.Text>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleConfirmBooking} disabled={loading || success}>
                        {loading ? 'Confirming...' : 'Confirm Booking'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ServicesPage;
