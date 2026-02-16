import React, { useEffect, useState } from 'react';
import { Container, Table, Alert, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { API_ENDPOINTS } from '../../constants/APIConstants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const BookingHistory = () => {

    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {

        const token = localStorage.getItem('token');

        if (!token) {

            navigate('/login');
            return;

        }

        const fetchHistory = async () => {

            try {

                const response = await fetch(API_ENDPOINTS.BOOKINGS.USER_BOOKINGS, {

                    headers: {
                        'Authorization': `Bearer ${token}`

                    }

                });

                if (!response.ok) {

                    throw new Error('Failed to fetch bookings');
                    
                }

                const data = await response.json();
                setBookings(data);

            } catch (err) {

                setError(err.message || "Could not load history.");

            } finally {

                setLoading(false);

            }

        };

        fetchHistory();

    }, [navigate]);

    const loadRazorpayScript = () => {

        return new Promise((resolve) => {

            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);

        });
    };

    const [showReceipt, setShowReceipt] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState(null);

   
    const [activeRateModal, setActiveRateModal] = useState(false);
    const [selectedForRating, setSelectedForRating] = useState(null);

    const handleReceiptClose = () => setShowReceipt(false);

    const handleReceiptShow = (booking) => {

        setSelectedReceipt(booking);
        setShowReceipt(true);

    };

    const handleRateShow = (booking) => {

        setSelectedForRating(booking);
        setActiveRateModal(true);

    }

    const handlePayment = async (booking) => {

        const res = await loadRazorpayScript();

        if (!res) {

            alert('Razorpay SDK failed to load. Are you online?');
            return;

        }

        const token = localStorage.getItem('token');
        try {

            // 1. Create Order
            const orderResponse = await fetch(API_ENDPOINTS.PAYMENT.CREATE_ORDER, {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    bookingId: booking.bookingId,
                    amount: 500 // Fixed amount for now
                })
            });

            if (!orderResponse.ok) {

                const errText = await orderResponse.text();
                alert(`Error creating order: ${errText}`);
                return;

            }

            const { orderId, key } = await orderResponse.json();

            // 2. Open Razorpay Modal
            const options = {

                key: key,
                amount: 500 * 100,
                currency: "INR",
                name: "Smart Emergency Platform",
                description: `Payment for ${booking.serviceType}`,
                order_id: orderId,
                handler: async function (response) {
                    try {
                        const verifyResponse = await fetch(API_ENDPOINTS.PAYMENT.VERIFY, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                bookingId: booking.bookingId,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpayOrderId: response.razorpay_order_id,
                                razorpaySignature: response.razorpay_signature
                            })
                        });

                        if (verifyResponse.ok) {
                            toast.success("Payment Successful!");
                            window.location.reload(); // Refresh to show updated status
                        } else {
                            toast.error("Payment verification failed.");
                        }
                        
                    } catch (e) {
                        toast.error("Error verifying payment.");
                    }
                },
                prefill: {
                    name: "User Name",
                    contact: "9999999999",
                    email: "user@example.com"
                },
                theme: {
                    color: "#0d6efd"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                toast.error(`Payment Failed: ${response.error.description}`);
            });
            rzp1.open();

        } catch (err) {
            console.error(err);
            toast.error("Something went wrong handling the payment.");
        }
    };

    return (
        <Container className="py-5 mt-5">
            <h2 className="mb-4 fw-bold text-primary">Your Request History</h2>

            {loading && <LoadingSpinner message="Loading your request history..." />}

            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && bookings.length === 0 && (
                <div className="text-center py-5">
                    <p className="lead text-muted">No booking history found.</p>
                    <Button variant="primary" onClick={() => navigate('/services')}>Book a Service</Button>
                </div>
            )}

            {!loading && !error && bookings.length > 0 && (
                <div className="table-responsive shadow-sm rounded">
                    <Table striped hover className="mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th>#</th>
                                <th>Service</th>
                                <th>Location</th>
                                <th>Scheduled For</th>
                                <th>Status</th>
                                <th>Payment</th>
                                <th>Notes</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking, index) => (
                                <tr key={booking.bookingId || index}>
                                    <td>{index + 1}</td>
                                    <td>{booking.serviceType}</td>
                                    <td>{booking.location || '-'}</td>
                                    <td>{new Date(booking.bookingDate).toLocaleString()}</td>
                                    <td>
                                        <Badge bg={booking.status === 'Resolved' ? 'success' : booking.status === 'Pending' ? 'warning' : 'primary'}>
                                            {booking.status || 'Pending'}
                                        </Badge>
                                    </td>
                                    <td>
                                        {booking.isPaid ? (
                                            <Badge bg="success">PAID</Badge>
                                        ) : (
                                            <Badge bg="secondary">UNPAID</Badge>
                                        )}
                                    </td>
                                    <td>{booking.notes || '-'}</td>
                                    <td>
                                        {booking.status === 'Resolved' && !booking.isPaid && (
                                            <Button size="sm" variant="outline-success" onClick={() => handlePayment(booking)}>
                                                Pay Now
                                            </Button>
                                        )}
                                        {booking.isPaid && (
                                            <>
                                                <Button size="sm" variant="outline-info" className="me-2" onClick={() => handleReceiptShow(booking)}>
                                                    Receipt
                                                </Button>
                                                {!booking.rating ? (
                                                    <Button size="sm" variant="warning" onClick={() => handleRateShow(booking)}>
                                                        Rate ★
                                                    </Button>
                                                ) : (
                                                    <span className="text-warning fw-bold">
                                                        {booking.rating} ★
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

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

            {/* Rating Modal */}
            <RateModal
                show={activeRateModal}
                onHide={() => setActiveRateModal(false)}
                booking={selectedForRating}
                onSuccess={() => {
                    setActiveRateModal(false);
                    window.location.reload();
                }}
            />
        </Container>
    );
};

const RateModal = ({ show, onHide, booking, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [hover, setHover] = useState(0);

    if (!show || !booking) return null;

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(API_ENDPOINTS.BOOKINGS.RATE(booking.bookingId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rating, review })
            });

            if (res.ok) {
                toast.success('Thank you for your feedback!');
                onSuccess();
            } else {
                toast.error('Failed to submit rating.');
            }
        } catch (e) {
            console.error(e);
            toast.error('Error submitting feedback.');
        }
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Rate Service Provider</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <div className="modal-body text-center">
                        <p className="text-muted">How was your {booking.serviceType} service?</p>
                        <div className="mb-3">
                            {[...Array(5)].map((star, index) => {
                                const indexRating = index + 1;
                                return (
                                    <span
                                        key={indexRating}
                                        style={{ cursor: 'pointer', fontSize: '2rem', color: indexRating <= (hover || rating) ? '#ffc107' : '#e4e5e9' }}
                                        onClick={() => setRating(indexRating)}
                                        onMouseEnter={() => setHover(indexRating)}
                                        onMouseLeave={() => setHover(rating)}
                                    >
                                        ★
                                    </span>
                                );
                            })}
                        </div>
                        <textarea
                            className="form-control"
                            rows="3"
                            placeholder="Write your experience..."
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="modal-footer">
                        <Button variant="secondary" onClick={onHide}>Close</Button>
                        <Button variant="primary" onClick={handleSubmit} disabled={rating === 0}>Submit Feedback</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingHistory;
