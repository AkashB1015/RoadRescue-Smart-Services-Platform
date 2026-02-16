import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Tabs, Tab, Badge, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { API_ENDPOINTS } from '../../constants/APIConstants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [services, setServices] = useState([]);
    const [requests, setRequests] = useState([]);
    const [providerEarnings, setProviderEarnings] = useState([]);
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [serviceFormData, setServiceFormData] = useState({ title: '', description: '', price: '', icon: 'bi-gear-fill' });
    const [loading, setLoading] = useState(true);
    const [key, setKey] = useState('users'); // Tab state

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchUsers();
        fetchServices();
        fetchRequests();
        fetchProviderEarnings();
    }, [navigate]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_ENDPOINTS.USERS.ALL, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchServices = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.SERVICES.ALL);
            if (response.ok) {
                setServices(await response.json());
            }
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_ENDPOINTS.CONTACT.ALL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setRequests(await response.json());
            }
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    };

    const fetchProviderEarnings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_ENDPOINTS.BOOKINGS.ALL}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const bookings = await response.json();
                const paidBookings = bookings.filter(b => b.isPaid && b.serviceProviderId);

                const earningsMap = {};
                paidBookings.forEach(booking => {
                    const providerId = booking.serviceProviderId;
                    const amount = 500; // Fixed amount per completed job

                    if (!earningsMap[providerId]) {
                        earningsMap[providerId] = {
                            providerId,
                            providerName: booking.providerName || `Provider ${providerId}`,
                            totalEarnings: 0,
                            jobCount: 0,
                            bookings: []
                        };
                    }

                    earningsMap[providerId].totalEarnings += amount;
                    earningsMap[providerId].jobCount += 1;
                    earningsMap[providerId].bookings.push(booking);
                });

                setProviderEarnings(Object.values(earningsMap));
            }
        } catch (error) {
            console.error("Error fetching provider earnings:", error);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_ENDPOINTS.USERS.BY_ID(id), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setUsers(users.filter(u => u.userId !== id));
                toast.success("User deleted successfully.");
            } else {
                toast.error("Failed to delete user.");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Error deleting user.");
        }
    };

    const handleDeleteService = async (id) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_ENDPOINTS.SERVICES.BY_ID(id), {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setServices(services.filter(s => s.serviceId !== id));
                toast.success("Service deleted successfully.");
            } else {
                toast.error("Failed to delete service.");
            }
        } catch (error) {
            console.error("Error deleting service:", error);
            toast.error("Error deleting service.");
        }
    };

    const handleSaveService = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const method = editingService ? 'PUT' : 'POST';
            const url = editingService
                ? API_ENDPOINTS.SERVICES.BY_ID(editingService.serviceId)
                : API_ENDPOINTS.SERVICES.ALL;

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(editingService ? { ...serviceFormData, serviceId: editingService.serviceId } : serviceFormData)
            });

            if (response.ok) {
                fetchServices();
                setShowServiceModal(false);
                setEditingService(null);
                setServiceFormData({ title: '', description: '', price: '', icon: 'bi-gear-fill' });
                toast.success("Service saved successfully.");
            } else {
                toast.error("Failed to save service.");
            }
        } catch (error) {
            console.error("Error saving service:", error);
            toast.error("Error saving service.");
        }
    };

    const handleDeleteRequest = async (id) => {
        if (!window.confirm("Are you sure you want to delete this request?")) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_ENDPOINTS.CONTACT.BY_ID(id), {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setRequests(requests.filter(r => r.id !== id));
                toast.success("Request deleted successfully.");
            } else {
                toast.error("Failed to delete request.");
            }
        } catch (error) {
            console.error("Error deleting request:", error);
            toast.error("Error deleting request.");
        }
    };

    const handleUpdateRequestStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_ENDPOINTS.CONTACT.BY_ID(id), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status })
            });
            if (response.ok) {
                fetchRequests();
            }
        } catch (error) { console.error("Error updating request status:", error); }
    };

    const openServiceModal = (service = null) => {
        if (service) {
            setEditingService(service);
            setServiceFormData({ title: service.title, description: service.description, price: service.price, icon: service.icon });
        } else {
            setEditingService(null);
            setServiceFormData({ title: '', description: '', price: '', icon: 'bi-gear-fill' });
        }
        setShowServiceModal(true);
    };

    const filteredUsers = users.filter(u => u.role === 'USER');
    const filteredProviders = users.filter(u => u.role === 'SERVICE_PROVIDER');
    const admins = users.filter(u => u.role === 'ADMIN');

    const renderTable = (list, type) => (
        <Table hover responsive className="mt-3">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {list.length === 0 ? (
                    <tr><td colSpan="6" className="text-center">No {type} found.</td></tr>
                ) : (
                    list.map(user => (
                        <tr key={user.userId}>
                            <td>{user.userId}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td><Badge bg={user.role === 'ADMIN' ? 'danger' : user.role === 'SERVICE_PROVIDER' ? 'info' : 'secondary'}>{user.role}</Badge></td>
                            <td>
                                {user.role !== 'ADMIN' && (
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user.userId)}>
                                        Delete
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </Table>
    );

    const renderServiceTable = () => (
        <Table hover responsive className="mt-3">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {services.length === 0 ? (
                    <tr><td colSpan="4" className="text-center">No services found.</td></tr>
                ) : (
                    services.map(service => (
                        <tr key={service.serviceId}>
                            <td>{service.serviceId}</td>
                            <td>{service.title}</td>
                            <td>{service.price}</td>
                            <td>
                                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => openServiceModal(service)}>Edit</Button>
                                <Button variant="danger" size="sm" onClick={() => handleDeleteService(service.serviceId)}>Delete</Button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </Table>
    );

    const renderEarningsTable = () => (
        <Table hover responsive className="mt-3">
            <thead>
                <tr>
                    <th>Provider ID</th>
                    <th>Provider Name</th>
                    <th>Total Jobs</th>
                    <th>Total Earnings</th>
                    <th>Avg per Job</th>
                </tr>
            </thead>
            <tbody>
                {providerEarnings.length === 0 ? (
                    <tr><td colSpan="5" className="text-center">No earnings data found.</td></tr>
                ) : (
                    providerEarnings.map(provider => (
                        <tr key={provider.providerId}>
                            <td>{provider.providerId}</td>
                            <td>{provider.providerName}</td>
                            <td>{provider.jobCount}</td>
                            <td>₹{provider.totalEarnings}</td>
                            <td>₹{(provider.totalEarnings / provider.jobCount).toFixed(2)}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </Table>
    );

    const renderRequestsTable = () => (
        <Table hover responsive className="mt-3">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {requests.length === 0 ? (
                    <tr><td colSpan="6" className="text-center">No requests found.</td></tr>
                ) : (
                    requests.map(req => (
                        <tr key={req.id}>
                            <td>{req.id}</td>
                            <td>{req.name}</td>
                            <td>{req.email}</td>
                            <td title={req.message}>
                                {req.message?.length > 50 ? `${req.message.substring(0, 50)}...` : req.message}
                            </td>
                            <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                            <td>
                                <Badge bg={req.status === 'Resolved' ? 'success' : 'warning'}>{req.status}</Badge>
                            </td>
                            <td>
                                {req.status !== 'Resolved' && (
                                    <Button variant="success" size="sm" className="me-2" onClick={() => handleUpdateRequestStatus(req.id, 'Resolved')}>Mark Resolved</Button>
                                )}
                                <Button variant="danger" size="sm" onClick={() => handleDeleteRequest(req.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </Table>
    );

    return (
        <Container className="py-5 mt-5">
            <Row className="mb-4">
                <Col>
                    <h2 className="mb-4 text-primary">Admin Dashboard</h2>
                    <p className="lead">Manage users, service providers, and platform settings.</p>
                </Col>
            </Row>

            <Row className="mb-4">

                <Col md={3}>
                    <Card className="text-center shadow-sm p-3 mb-3 border-info">
                        <h3>{filteredProviders.length}</h3>
                        <p>Service Providers</p>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center shadow-sm p-3 mb-3 border-secondary">
                        <h3>{filteredUsers.length}</h3>
                        <p>Regular Users</p>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center shadow-sm p-3 mb-3 border-success">
                        <h3>{services.length}</h3>
                        <p>Services</p>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center shadow-sm p-3 mb-3 border-warning">
                        <h3>{requests.length}</h3>
                        <p>Requests</p>
                    </Card>
                </Col>
            </Row>

            <Card className="shadow-sm p-4">
                <Tabs
                    id="admin-tabs"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3"
                >
                    <Tab eventKey="users" title="Users">
                        {loading ? <LoadingSpinner message="Loading users..." /> : renderTable(filteredUsers, "Users")}
                    </Tab>
                    <Tab eventKey="providers" title="Service Providers">
                        {loading ? <LoadingSpinner message="Loading providers..." /> : renderTable(filteredProviders, "Service Providers")}
                    </Tab>
                    <Tab eventKey="admins" title="Admins">
                        <div className="d-flex justify-content-end mb-3">
                            <Button variant="success" onClick={() => navigate('/admin/add-admin')}>+ Add New Admin</Button>
                        </div>
                        {loading ? <LoadingSpinner message="Loading admins..." /> : renderTable(admins, "Admins")}
                    </Tab>
                    <Tab eventKey="services" title="Services">
                        <div className="d-flex justify-content-end mb-3">
                            <Button variant="success" onClick={() => openServiceModal()}>+ Add New Service</Button>
                        </div>
                        {loading ? <LoadingSpinner message="Loading services..." /> : renderServiceTable()}
                    </Tab>
                    <Tab eventKey="requests" title="Requests">
                        {loading ? <LoadingSpinner message="Loading requests..." /> : renderRequestsTable()}
                    </Tab>
                    <Tab eventKey="earnings" title="Provider Earnings">
                        {loading ? <LoadingSpinner message="Loading earnings..." /> : renderEarningsTable()}
                    </Tab>
                </Tabs>
            </Card>

            <Modal show={showServiceModal} onHide={() => setShowServiceModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingService ? 'Edit Service' : 'Add New Service'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSaveService}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" value={serviceFormData.title} onChange={(e) => setServiceFormData({ ...serviceFormData, title: e.target.value })} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} value={serviceFormData.description} onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="text" value={serviceFormData.price} onChange={(e) => setServiceFormData({ ...serviceFormData, price: e.target.value })} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Icon (Bootstrap Icon Class)</Form.Label>
                            <Form.Control type="text" value={serviceFormData.icon} onChange={(e) => setServiceFormData({ ...serviceFormData, icon: e.target.value })} />
                        </Form.Group>
                        <Button variant="primary" type="submit">Save Service</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default AdminDashboard;
