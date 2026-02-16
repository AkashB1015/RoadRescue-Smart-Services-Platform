import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { API_ENDPOINTS } from "../../constants/APIConstants";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  
  const emailSchema = Yup.object({
    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|gov|co|io)$/i,
        "Enter a valid email address (example: name@gmail.com)"
      )
      .required("Email is required"),
  });

  const resetSchema = Yup.object({
    otp: Yup.string()
      .matches(/^[0-9]{6}$/, "OTP must be a 6-digit number")
      .required("OTP is required"),

    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/[0-9]/, "Must contain at least one number")
      .required("New password is required"),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords do not match")
      .required("Confirm password is required"),
  });

 
    // FORMIK – STEP 1 (EMAIL)

  const emailFormik = useFormik({
    initialValues: { email: "" },
    validationSchema: emailSchema,
    onSubmit: async (values) => {
      setError("");
      setSuccess("");
      setLoading(true);

      try {
        const response = await fetch(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to send OTP");

        setSuccess("OTP sent successfully to your email.");
        setStep(2);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
  });


    // FORMIK – STEP 2 (RESET)
 
  const resetFormik = useFormik({
    initialValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: resetSchema,
    onSubmit: async (values) => {
      setError("");
      setSuccess("");
      setLoading(true);

      try {
        const response = await fetch(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailFormik.values.email,
            otp: values.otp,
            newPassword: values.newPassword,
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to reset password");

        setSuccess("Password reset successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } catch (err) {
        setError(err.message);
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
                  <h3 className="fw-bold text-primary">Forgot Password</h3>
                  <p className="text-muted">
                    {step === 1
                      ? "Enter your registered email address"
                      : "Enter OTP and new password"}
                  </p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                {/* STEP 1 */}
                {step === 1 && (
                  <Form onSubmit={emailFormik.handleSubmit} noValidate>
                    <Form.Group className="mb-4">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={emailFormik.values.email}
                        onChange={emailFormik.handleChange}
                        onBlur={emailFormik.handleBlur}
                        isInvalid={emailFormik.touched.email && !!emailFormik.errors.email}
                        placeholder="name@example.com"
                      />
                      <Form.Control.Feedback type="invalid">
                        {emailFormik.errors.email}
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
                        {loading ? "Sending OTP..." : "Send OTP"}
                      </Button>
                    </div>
                  </Form>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <Form onSubmit={resetFormik.handleSubmit} noValidate>
                    <Form.Group className="mb-3">
                      <Form.Label>Enter OTP</Form.Label>
                      <Form.Control
                        type="text"
                        name="otp"
                        value={resetFormik.values.otp}
                        onChange={resetFormik.handleChange}
                        onBlur={resetFormik.handleBlur}
                        isInvalid={resetFormik.touched.otp && !!resetFormik.errors.otp}
                        placeholder="Enter 6-digit OTP"
                      />
                      <Form.Control.Feedback type="invalid">
                        {resetFormik.errors.otp}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        value={resetFormik.values.newPassword}
                        onChange={resetFormik.handleChange}
                        onBlur={resetFormik.handleBlur}
                        isInvalid={
                          resetFormik.touched.newPassword &&
                          !!resetFormik.errors.newPassword
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {resetFormik.errors.newPassword}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={resetFormik.values.confirmPassword}
                        onChange={resetFormik.handleChange}
                        onBlur={resetFormik.handleBlur}
                        isInvalid={
                          resetFormik.touched.confirmPassword &&
                          !!resetFormik.errors.confirmPassword
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {resetFormik.errors.confirmPassword}
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
                        {loading ? "Resetting..." : "Reset Password"}
                      </Button>
                    </div>

                    <div className="text-center">
                      <Button
                        variant="link"
                        onClick={() => setStep(1)}
                      >
                        Resend OTP / Change Email
                      </Button>
                    </div>
                  </Form>
                )}

                <div className="text-center mt-3">
                  <Button
                    variant="link"
                    className="text-muted text-decoration-none"
                    onClick={() => navigate("/login")}
                  >
                    Back to Login
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPassword;
