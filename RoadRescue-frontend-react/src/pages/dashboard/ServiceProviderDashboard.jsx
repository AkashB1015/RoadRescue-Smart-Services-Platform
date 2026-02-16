import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Tabs, Tab, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { API_ENDPOINTS } from '../../constants/APIConstants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const ServiceProviderDashboard = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = React.useState([]);
    const [paymentHistory, setPaymentHistory] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedJob, setSelectedJob] = React.useState(null);
    const [showDetailsModal, setShowDetailsModal] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState('jobs');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchJobs = async () => {
            try {
                // Fetch ONLY available (unassigned) jobs
                const response = await fetch(API_ENDPOINTS.BOOKINGS.AVAILABLE, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    const mappedJobs = data.map(booking => ({
                        id: `#${booking.bookingId}`,
                        serviceType: booking.serviceType,
                        location: booking.location || 'N/A',
                        status: booking.status || 'Pending',
                        action: 'Accept', // Only Option for available jobs
                        customerName: booking.user?.fullName || 'Customer',
                        contact: booking.user?.email || 'N/A',
                        notes: booking.notes || 'No notes provided.'
                    }));
                    setJobs(mappedJobs);
                }
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
        fetchPaymentHistory();
    }, [navigate]);

    const fetchPaymentHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_ENDPOINTS.BOOKINGS.MY_BOOKINGS, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const paidBookings = data.filter(booking => booking.isPaid && booking.paymentId);
                setPaymentHistory(paidBookings);
            }
        } catch (error) {
            console.error("Error fetching payment history:", error);
        }
    };

    const handleAcceptJob = async (jobId) => {
        // Optimistic update
        const originalJobs = [...jobs];
        setJobs(jobs.map(job => {
            if (job.id === jobId) {
                return { ...job, status: 'Assigned', action: 'View Details' };
            }
            return job;
        }));

        try {
            const token = localStorage.getItem('token');
            const realId = jobId.replace('#', ''); // Extract number from '#123'
            const response = await fetch(API_ENDPOINTS.BOOKINGS.ACCEPT(realId), {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to accept job');
            }
            // Success - state already updated optimistically
        } catch (error) {
            console.error("Error accepting job:", error);
            toast.error("Failed to accept job. Please try again.");
            setJobs(originalJobs); // Revert on error
        }
    };

    const handleCompleteJob = async () => {
        if (!selectedJob) return;
        const jobId = selectedJob.id;

        // Optimistic update
        const originalJobs = [...jobs];
        setJobs(jobs.map(job => {
            if (job.id === jobId) {
                return { ...job, status: 'Resolved', action: 'View Details' };
            }
            return job;
        }));

        try {
            const token = localStorage.getItem('token');
            const realId = jobId.replace('#', '');
            const response = await fetch(API_ENDPOINTS.BOOKINGS.COMPLETE(realId), {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to complete job');
            }
            handleCloseModal();
            toast.success("Job marked as completed!");
        } catch (error) {
            console.error("Error completing job:", error);
            toast.error("Failed to complete job.");
            setJobs(originalJobs);
        }
    };

    const handleViewDetails = (job) => {
        setSelectedJob(job);
        setShowDetailsModal(true);
    };

    const totalEarnings = paymentHistory.reduce((total, booking) => {
        // Use a fixed amount per service for now, or extract from a price field
        const amount = 500; // Fixed amount per completed job
        return total + amount;
    }, 0);

    const renderPaymentHistory = () => (
        <Table hover responsive className="mt-3">
            <thead>
                <tr>
                    <th>Booking ID</th>
                    <th>Service</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Payment ID</th>
                </tr>
            </thead>
            <tbody>
                {paymentHistory.length === 0 ? (
                    <tr><td colSpan="6" className="text-center">No payment history found.</td></tr>
                ) : (
                    paymentHistory.map(booking => {
                        const amount = 500; // Fixed amount per completed job
                        return (
                            <tr key={booking.bookingId}>
                                <td>#{booking.bookingId}</td>
                                <td>{booking.serviceType}</td>
                                <td>{booking.user?.name || 'N/A'}</td>
                                <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                                <td>₹{amount}</td>
                                <td>{booking.paymentId}</td>
                            </tr>
                        );
                    })
                )}
            </tbody>
        </Table>
    );

    const handleCloseModal = () => {
        setShowDetailsModal(false);
        setSelectedJob(null);
    };

    return (
        <Container className="py-5 mt-5">
            <Row className="mb-4">
                <Col>
                    <h2 className="mb-4">Service Provider Dashboard</h2>
                    <p className="lead">Manage your assigned jobs and availability.</p>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={6} lg={4}>
                    <Card className="bg-success text-white h-100 shadow-sm">
                        <Card.Body>
                            <Card.Title>Available Requests</Card.Title>
                            <div className="display-4 fw-bold">{jobs.length}</div>
                            <Card.Text>Jobs open for acceptance</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={4}>
                    <Card className="bg-primary text-white h-100 shadow-sm">
                        <Card.Body>
                            <Card.Title>Total Earnings</Card.Title>
                            <div className="display-4 fw-bold">₹{totalEarnings}</div>
                            <Card.Text>From completed jobs</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
                <Tab eventKey="jobs" title="Available Jobs">
                    <Card className="shadow-sm mb-4">
                        <Card.Body>
                            {loading ? (
                                <LoadingSpinner message="Loading available jobs..." />
                            ) : jobs.length === 0 ? (
                                <p className="text-center">No jobs found.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Job ID</th>
                                                <th>Service Type</th>
                                                <th>Location</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jobs.map(job => (
                                                <tr key={job.id}>
                                                    <td>{job.id}</td>
                                                    <td>{job.serviceType}</td>
                                                    <td>
                                                        <div>{job.location}</div>
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            className="mt-1"
                                                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.location)}`, '_blank')}
                                                        >
                                                            <i className="bi bi-geo-alt-fill me-1"></i> Open Map
                                                        </Button>
                                                    </td>
                                                    <td>
                                                        <Badge bg={job.status === 'In Progress' ? 'warning' : job.status === 'Completed' ? 'success' : job.status === 'Assigned' ? 'primary' : 'secondary'}>
                                                            {job.status}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        {job.status === 'Pending' ? (
                                                            <Button size="sm" variant="success" onClick={() => handleAcceptJob(job.id)}>
                                                                Accept
                                                            </Button>
                                                        ) : (
                                                            <Button size="sm" variant="outline-primary" onClick={() => handleViewDetails(job)}>
                                                                View Details
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Tab>
                <Tab eventKey="payments" title="Payment History">
                    <Card className="shadow-sm mb-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5>Payment History</h5>
                                <Badge bg="success" className="fs-6">Total: ₹{totalEarnings}</Badge>
                            </div>
                            {loading ? (
                                <LoadingSpinner message="Loading payment history..." />
                            ) : (
                                renderPaymentHistory()
                            )}
                        </Card.Body>
                    </Card>
                </Tab>
            </Tabs>

            {/* Job Details Modal */}
            <Modal show={showDetailsModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Job Details: {selectedJob?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedJob && (
                        <div>
                            <p><strong>Service Type:</strong> {selectedJob.serviceType}</p>
                            <p><strong>Location:</strong> {selectedJob.location}</p>
                            <div className="mb-3">
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedJob.location)}`, '_blank')}
                                >
                                    <i className="bi bi-geo-alt-fill me-1"></i> Open Map
                                </Button>
                            </div>
                            <p><strong>Status:</strong> <Badge bg={selectedJob.status === 'In Progress' ? 'warning' : selectedJob.status === 'Resolved' ? 'success' : 'info'}>{selectedJob.status}</Badge></p>
                            <hr />
                            <h5>Customer Information</h5>
                            <p><strong>Name:</strong> {selectedJob.customerName}</p>
                            <p><strong>Contact:</strong> {selectedJob.contact}</p>
                            <p><strong>Notes:</strong> {selectedJob.notes}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ServiceProviderDashboard;
