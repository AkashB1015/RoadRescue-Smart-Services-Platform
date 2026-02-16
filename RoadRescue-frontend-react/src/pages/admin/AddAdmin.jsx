import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../constants/APIConstants';
import { toast } from 'react-toastify';

const AddAdmin = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        phone: Yup.string().matches(/^[1-9][0-9]{9}$/, 'Phone must be 10 digits and not start with 0').required('Phone is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm password is required')
    });

    const handleSubmit = async (values, { resetForm }) => {
        setLoading(true);
        try {
            const adminData = {
                name: values.name,
                email: values.email,
                phone: values.phone,
                password: values.password,
                role: 'ADMIN'
            };

            const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(adminData)
            });

            if (response.ok) {
                toast.success('Admin user created successfully!');
                resetForm();
            } else {
                const error = await response.text();
                toast.error(error || 'Failed to create admin user');
            }
        } catch (error) {
            console.error('Error creating admin:', error);
            toast.error('Failed to create admin user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5 mt-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow">
                        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">
                                <i className="bi bi-person-plus-fill me-2"></i>
                                Add New Admin
                            </h4>
                            <Button 
                                variant="outline-light" 
                                size="sm"
                                onClick={() => navigate('/admin-dashboard')}
                            >
                                <i className="bi bi-arrow-left me-1"></i>
                                Back
                            </Button>
                        </Card.Header>
                        <Card.Body>
                            <Formik
                                initialValues={{
                                    name: '',
                                    email: '',
                                    phone: '',
                                    password: '',
                                    confirmPassword: ''
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Full Name *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={values.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.name && errors.name}
                                                placeholder="Enter full name"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.name}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Email Address *</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={values.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.email && errors.email}
                                                placeholder="Enter email address"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.email}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Phone Number *</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                name="phone"
                                                value={values.phone}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.phone && errors.phone}
                                                placeholder="Enter 10-digit phone number"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.phone}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Password *</Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        name="password"
                                                        value={values.password}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={touched.password && errors.password}
                                                        placeholder="Enter password"
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.password}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Confirm Password *</Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        name="confirmPassword"
                                                        value={values.confirmPassword}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={touched.confirmPassword && errors.confirmPassword}
                                                        placeholder="Confirm password"
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.confirmPassword}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Alert variant="info" className="mb-3">
                                            <i className="bi bi-info-circle me-2"></i>
                                            This will create a new admin user with full administrative privileges.
                                        </Alert>

                                        <div className="d-grid">
                                            <Button 
                                                variant="primary" 
                                                type="submit" 
                                                disabled={loading}
                                                size="lg"
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        Creating Admin...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-person-plus-fill me-2"></i>
                                                        Create Admin User
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AddAdmin;