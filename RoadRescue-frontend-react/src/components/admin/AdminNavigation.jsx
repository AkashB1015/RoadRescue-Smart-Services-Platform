import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AdminNavigation = () => {
    const navigate = useNavigate();

    return (
        <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                    <i className="bi bi-gear-fill me-2"></i>
                    Admin Actions
                </h5>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md={6} lg={4} className="mb-3">
                        <Button 
                            variant="outline-primary" 
                            className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                            onClick={() => navigate('/admin/add-admin')}
                        >
                            <i className="bi bi-person-plus-fill fs-2 mb-2"></i>
                            <span>Add New Admin</span>
                        </Button>
                    </Col>
                    <Col md={6} lg={4} className="mb-3">
                        <Button 
                            variant="outline-success" 
                            className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                            onClick={() => navigate('/admin-dashboard')}
                        >
                            <i className="bi bi-speedometer2 fs-2 mb-2"></i>
                            <span>Dashboard</span>
                        </Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default AdminNavigation;