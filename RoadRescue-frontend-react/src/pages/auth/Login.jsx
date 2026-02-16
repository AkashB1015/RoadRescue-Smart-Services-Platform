import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useFormik } from "formik";
import * as Yup from "yup";
import { API_ENDPOINTS } from "../../constants/APIConstants";

const Login = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    useEffect(() => {

        window.scrollTo(0, 0);

    }, []);


    const validationSchema = Yup.object({

        email: Yup.string().matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|gov|co|io)$/i,
                "Enter a valid email address (xyz@gmail.com)"
            )
            .required("Email is required"),


        password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .matches(/[A-Z]/, "Must contain at least one uppercase letter")
            .matches(/[a-z]/, "Must contain at least one lowercase letter")
            .matches(/[0-9]/, "Must contain at least one number")
            .required("Password is required"),

    });

  
    const formik = useFormik({   // formik libary used for form handling.

        initialValues: {
            email: "",
            password: "",
        },
        validationSchema,

        onSubmit: async (values) => {

            setServerError("");
            setLoading(true);

            try {

                const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {

                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),

                });

                const data = await response.json();

                if (!response.ok) {

                    throw new Error(data.message || "Login failed");

                }

                localStorage.setItem("token", data.token);
                window.dispatchEvent(new Event("auth-change"));
                toast.success("Login Successful!");

                const decoded = jwtDecode(data.token);
                const role =
                    decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
                    decoded.role;

                if (role === "ADMIN"){

                     navigate("/admin-dashboard");

                }
                else if (role === "SERVICE_PROVIDER"){

                    navigate("/provider-dashboard");

                }
                else {

                    navigate("/user-dashboard");

                }

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
                    <Col md={6} lg={5}>
                        <Card className="shadow-lg border-0 rounded-4">
                            <Card.Body className="p-5">
                                <div className="text-center mb-4">
                                    <h2 className="fw-bold text-primary">Welcome Back</h2>
                                    <p className="text-muted">Login to access your services.</p>
                                </div>

                                {serverError && <Alert variant="danger">{serverError}</Alert>}

                                <Form noValidate onSubmit={formik.handleSubmit}>


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


                                    {/* PASSWORD */}
                                    <Form.Group className="mb-4">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isInvalid={formik.touched.password && !!formik.errors.password}
                                            placeholder="Enter your password"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.password}
                                        </Form.Control.Feedback>
                                    </Form.Group>


                                    <div className="d-flex justify-content-between mb-4">
                                        <Form.Check type="checkbox" label="Remember me" />
                                        <Link to="/forgot-password" className="text-decoration-none small">
                                            Forgot Password?
                                        </Link>
                                    </div>

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
                                                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                                                    Logging in...
                                                </>

                                            ) : (

                                                "Log In"

                                            )}

                                        </Button>

                                    </div>

                                    <div className="text-center">
                                        <p className="text-muted">
                                            Don&apos;t have an account?{" "}
                                            <Link to="/register" className="fw-bold text-primary text-decoration-none">
                                                Sign Up
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

export default Login;
