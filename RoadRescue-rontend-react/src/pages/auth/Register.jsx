import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { API_ENDPOINTS } from "../../constants/APIConstants";


const Register = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    useEffect(() => {

        window.scrollTo(0, 0);

    }, []);


    // VALIDATION SCHEMA

    const validationSchema = Yup.object({
        role: Yup.string().oneOf(["USER", "SERVICE_PROVIDER"]).required(),

       name: Yup.string()
  .trim()
  .matches(
    /^[A-Za-z]+( [A-Za-z]+)*$/,
    "Name must contain letters only with single spaces between words"
  )
  .min(3, "Name must be at least 3 characters")
  .required("Full name is required"),


        email: Yup.string()
            .matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|gov|co|io)$/i,
                "Enter a valid email address (Eg - xyz@gmail.com)"
            )
            .required("Email is required"),

        phone: Yup.string()
            .matches(/^[1-9][0-9]{9}$/, "Phone number must be 10 digits and not start with 0")
            .required("Phone number is required"),

        password: Yup.string()
            .min(8, "Minimum 8 characters")
            .matches(/[A-Z]/, "Must contain at least one uppercase letter")
            .matches(/[a-z]/, "Must contain at least one lowercase letter")
            .matches(/[0-9]/, "Must contain at least one number")
            .matches(/[@$!%*?&]/, "Must contain at least one special character")
            .required("Password is required"),

        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords do not match")
            .required("Confirm password is required"),
    });


    // FORMIK

    const formik = useFormik({

        initialValues: {

            role: "USER",
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",

        },
        validationSchema,
        onSubmit: async (values) => {
            setServerError("");
            setLoading(true);

            try {

                const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {

                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: values.name,
                        email: values.email,
                        phone: values.phone,
                        password: values.password,
                        role: values.role,
                    }),

                });

                const data = await response.json();

                if (!response.ok) {

                    throw new Error(data.message || "Registration failed");

                }

                toast.success("Registration successful! Please login.");
                navigate("/login");

            } catch (err) {

                setServerError(err.message);
                toast.error(err.message);

            } finally {

                setLoading(false);

            }
        },
    });

    return (
        <div className="pt-5 mt-5 d-flex align-items-center min-vh-100 bg-light">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="shadow-lg border-0 rounded-3" style={{marginBottom:'20px'}}>
                            <Card.Body className="p-5">
                                <div className="text-center mb-4">
                                    <h2 className="fw-bold text-primary">Create Account</h2>
                                    <p className="text-muted">
                                        Join us for reliable roadside assistance.
                                    </p>
                                </div>

                                {serverError && <Alert variant="danger">{serverError}</Alert>}

                                <Form noValidate onSubmit={formik.handleSubmit}>


                                    {/* ROLE */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>I am a:</Form.Label>
                                        <Form.Select
                                            name="role"
                                            value={formik.values.role}
                                            onChange={formik.handleChange}
                                        >
                                            <option value="USER">User</option>
                                            <option value="SERVICE_PROVIDER">Service Provider</option>
                                        </Form.Select>
                                    </Form.Group>


                                    {/* NAME */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Full Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isInvalid={formik.touched.name && !!formik.errors.name}
                                            placeholder="John Doe"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>


                                    {/* EMAIL */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isInvalid={formik.touched.email && !!formik.errors.email}
                                            placeholder="xyz@example.com"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>


                                    {/* PHONE */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control
                                            type="tel"
                                            name="phone"
                                            value={formik.values.phone}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isInvalid={formik.touched.phone && !!formik.errors.phone}
                                            placeholder="10 digit number"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.phone}
                                        </Form.Control.Feedback>
                                    </Form.Group>


                                    {/* PASSWORD */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isInvalid={formik.touched.password && !!formik.errors.password}
                                            placeholder="Strong password"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.password}
                                        </Form.Control.Feedback>
                                    </Form.Group>


                                    {/* CONFIRM PASSWORD */}
                                    <Form.Group className="mb-4">
                                        <Form.Label>Confirm Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="confirmPassword"
                                            value={formik.values.confirmPassword}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isInvalid={
                                                formik.touched.confirmPassword &&
                                                !!formik.errors.confirmPassword
                                            }
                                            placeholder="Re-enter password"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.confirmPassword}
                                        </Form.Control.Feedback>
                                    </Form.Group>


                                    <div className="d-grid mb-3">
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            size="lg"
                                            className="rounded-pill"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Spinner
                                                        as="span"
                                                        animation="border"
                                                        size="sm"
                                                        className="me-2"
                                                    />
                                                    Creating Account...
                                                </>
                                            ) : (
                                                "Sign Up"
                                            )}
                                        </Button>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-muted">
                                            Already have an account?{" "}
                                            <Link
                                                to="/login"
                                                className="text-primary fw-bold text-decoration-none"
                                            >
                                                Log In
                                            </Link>
                                        </p>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Register;
