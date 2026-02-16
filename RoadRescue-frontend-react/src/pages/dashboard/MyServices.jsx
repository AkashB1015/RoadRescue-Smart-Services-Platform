import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Modal, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { API_ENDPOINTS } from '../../constants/APIConstants';

const MyServices = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMyJobs();
    }, [navigate]);

    const fetchMyJobs = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(API_ENDPOINTS.BOOKINGS.MY_BOOKINGS, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setJobs(data);
            } else {
                setError("Failed to fetch jobs");
            }
        } catch (error) {
            console.error("Error fetching my jobs:", error);
            setError("An error occurred while fetching jobs");
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteJob = async () => {
        if (!selectedJob) return;
        const jobId = selectedJob.bookingId;

        // Optimistic update
        const originalJobs = [...jobs];
        setJobs(jobs.map(job => {
            if (job.bookingId === jobId) {
                return { ...job, status: 'Resolved' };
            }
            return job;
        }));

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_ENDPOINTS.BOOKINGS.COMPLETE(jobId), {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to complete job');
            }
            handleCloseModal();
            fetchMyJobs(); // Refresh to be sure
        } catch (error) {
            console.error("Error completing job:", error);
            alert("Failed to complete job.");
            setJobs(originalJobs);
        }
    };

    const handleViewDetails = (job) => {
        setSelectedJob(job);
        setShowDetailsModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailsModal(false);
        setSelectedJob(null);
    };

    const [showReceipt, setShowReceipt] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState(null);

    const handleReceiptClose = () => setShowReceipt(false);
    const handleReceiptShow = (job) => {
        setSelectedReceipt(job);
        setShowReceipt(true);
    };

    return (
        <Container className="py-5 mt-5">
            <h2 className="mb-4 text-primary">My Accepted Services</h2>
            <div className="mb-4">
                <Card className="bg-primary text-white h-100 shadow-sm" style={{ maxWidth: '300px' }}>
                    <Card.Body>
                        <Card.Title>Active Jobs</Card.Title>
                        <div className="display-4 fw-bold">
                            {jobs.filter(j => j.status === 'Assigned' || j.status === 'In Progress').length}
                        </div>
                        <Card.Text>Current active requests</Card.Text>
                    </Card.Body>
                </Card>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}

            <Card className="shadow-sm border-0">
                <Card.Body>
                    {loading ? (
                        <p className="text-center">Loading...</p>
                    ) : jobs.length === 0 ? (
                        <p className="text-center text-muted">You haven't accepted any jobs yet.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Job ID</th>
                                        <th>Service</th>
                                        <th>Location</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Payment</th>
                                        <th>Rating</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.map(job => (
                                        <tr key={job.bookingId}>
                                            <td>#{job.bookingId}</td>
                                            <td>{job.serviceType}</td>
                                            <td>
                                                <div>{job.location || 'N/A'}</div>
                                                {job.location && (
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="mt-1"
                                                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.location)}`, '_blank')}
                                                    >
                                                        <i className="bi bi-geo-alt-fill me-1"></i> Open Map
                                                    </Button>
                                                )}
                                            </td>
                                            <td>{new Date(job.bookingDate).toLocaleDateString()}</td>
                                            <td>
                                                <Badge bg={job.status === 'Resolved' ? 'success' : 'primary'}>
                                                    {job.status}
                                                </Badge>
                                            </td>
                                            <td>
                                                {job.isPaid ? (
                                                    <Badge bg="success">PAID</Badge>
                                                ) : (
                                                    <Badge bg="secondary">UNPAID</Badge>
                                                )}
                                            </td>
                                            <td>
                                                {job.rating ? (
                                                    <span title={job.review || 'No review text'} style={{ cursor: 'help' }}>
                                                        {job.rating} <span className="text-warning">★</span>
                                                    </span>
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                            <td>
                                                <Button size="sm" variant="outline-primary" onClick={() => handleViewDetails(job)} className="me-2">
                                                    View Details
                                                </Button>
                                                {job.status === 'Resolved' && job.isPaid && (
                                                    <Button size="sm" variant="outline-info" onClick={() => handleReceiptShow(job)}>
                                                        View Receipt
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

            {/* Job Details Modal */}
            <Modal show={showDetailsModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Job Details: #{selectedJob?.bookingId}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedJob && (
                        <div>
                            <p><strong>Service Type:</strong> {selectedJob.serviceType}</p>
                            <p><strong>Location:</strong> {selectedJob.location}</p>
                            {selectedJob.location && (
                                <div className="mb-3">
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedJob.location)}`, '_blank')}
                                    >
                                        <i className="bi bi-geo-alt-fill me-1"></i> Open Map
                                    </Button>
                                </div>
                            )}
                            <p><strong>Status:</strong> <Badge bg={selectedJob.status === 'Resolved' ? 'success' : 'primary'}>{selectedJob.status}</Badge></p>
                            <hr />
                            <h6 className="fw-bold">Client Details</h6>
                            <p><strong>Name:</strong> {selectedJob.user?.name || 'N/A'}</p>
                            <p><strong>Email:</strong> {selectedJob.user?.email || 'N/A'}</p>
                            <p><strong>Phone:</strong> {selectedJob.user?.phone || 'N/A'}</p>
                            <p><strong>Notes:</strong> {selectedJob.notes || 'No notes provided.'}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    {(selectedJob?.status === 'Assigned') && (
                        <Button variant="success" onClick={handleCompleteJob}>
                            Mark as Resolved
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            {/* Receipt Modal */}
            {selectedReceipt && (
                <div className={`modal fade ${showReceipt ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Payment Receipt</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={handleReceiptClose}></button>
                            </div>
                            <div className="modal-body">
                                <div className="text-center mb-4">
                                    <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
                                    <h4 className="mt-2 text-success">Payment Successful!</h4>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="fw-bold">Payment ID:</span>
                                    <span>{selectedReceipt.paymentId}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="fw-bold">Service:</span>
                                    <span>{selectedReceipt.serviceType}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="fw-bold">Amount Paid:</span>
                                    <span className="text-success fw-bold">₹500.00</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="fw-bold">Date:</span>
                                    <span>{new Date().toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <Button variant="secondary" onClick={handleReceiptClose}>Close</Button>
                                <Button variant="primary" onClick={() => window.print()}>Print</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Container>
    );
};

export default MyServices;
