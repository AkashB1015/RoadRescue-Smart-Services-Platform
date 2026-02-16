import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Container, Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import { toast, Bounce } from "react-toastify";
import { FiUser, FiMail, FiPhone, FiMessageSquare, } from "react-icons/fi";
import img1 from "../../assets/images/Contact.png"
import "../../index.css";
import { API_ENDPOINTS } from "../../constants/APIConstants";

export default function Contact() {

  const validationSchema = Yup.object({

    name: Yup.string().trim().required("Name is required"),
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^[1-9][0-9]{9}$/, "Phone number must be 10 digits and not start with 0")
      .required("Phone number is required"),
    message: Yup.string()
      .min(10, "Message must be at least 10 characters")
      .required("Message is required"),

  });

  const handleSubmit = async (values, { resetForm }) => {

    console.log("Form data", values);

    try {
      const response = await fetch(API_ENDPOINTS.CONTACT.ALL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast.success("Message sent successfully!", {
          position: "top-right",
          autoClose: 3000,
          transition: Bounce,
        });
        resetForm();
      } else {
        toast.error("Failed to send message", {
          position: "top-right",
          autoClose: 3000,
          transition: Bounce,
        });
      }
    } catch (error) {

      toast.error("Failed to send message", {
        position: "top-right",
        autoClose: 3000,
        transition: Bounce,
      });
    }
  };

  return (
    <section className="contact-section">

      <Container>

        <div className="text-center mb-5">
          <h2 className="contact-title">Contact Us – We're Here to Help!
          </h2>
          <p className="text-muted">
            We're always here to help and answer your questions.
          </p>
        </div>

        <Row className="align-items-center">

          <Col lg={6} className="mb-4 mb-lg-0 text-center">
            <img
              src={img1}
              alt="Contact Support"
              className="contact-image"
            />
            <h5 className="mt-3 fw-semibold">
              24x7 Support | Trusted Services
            </h5>
            <p className="text-muted small">
              Reach out to us for emergency support, service requests, or queries.
            </p>
          </Col>


          <Col lg={6}>

            <Formik
              initialValues={{ name: "", email: "", phone: "", message: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              validateOnChange={true}
              validateOnBlur={true}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isValid,
                dirty,
              }) => (
                <Form
                  noValidate
                  onSubmit={handleSubmit}
                  className="contact-form shadow-sm"
                >

                  <Form.Group className="mb-3">

                    <InputGroup>
                      <InputGroup.Text><FiUser /></InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.name && !!errors.name}
                      />
                    </InputGroup>

                    {touched.name && errors.name && (
                      <div className="invalid-feedback d-block">
                        {errors.name}
                      </div>
                    )}
                  </Form.Group>


                  <Form.Group className="mb-3">
                    <InputGroup>

                      <InputGroup.Text><FiMail /></InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="example@gmail.com"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.email && !!errors.email}
                      />

                    </InputGroup>
                    {touched.email && errors.email && (
                      <div className="invalid-feedback d-block">
                        {errors.email}
                      </div>
                    )}

                  </Form.Group>


                  <Form.Group className="mb-3">
                    <InputGroup>
                      <InputGroup.Text><FiPhone /></InputGroup.Text>
                      <Form.Control
                        type="tel"
                        name="phone"
                        placeholder="9876543210"
                        value={values.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.phone && !!errors.phone}
                      />
                    </InputGroup>
                    {touched.phone && errors.phone && (
                      <div className="invalid-feedback d-block">
                        {errors.phone}
                      </div>
                    )}

                  </Form.Group>

                  <Form.Group className="mb-4">

                    <InputGroup>
                      <InputGroup.Text><FiMessageSquare /></InputGroup.Text>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="message"
                        placeholder="Type your message..."
                        value={values.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.message && !!errors.message}
                      />
                    </InputGroup>

                    {touched.message && errors.message && (
                      <div className="invalid-feedback d-block">
                        {errors.message}
                      </div>
                    )}
                  </Form.Group>


                  <div className="text-center">
                    <Button
                      type="submit"
                      className="contact-btn"
                      disabled={!isValid || !dirty}
                    >
                      Send Message
                    </Button>

                  </div>

                </Form>
              )}

            </Formik>

          </Col>

        </Row>

      </Container>

    </section>
  );
}
