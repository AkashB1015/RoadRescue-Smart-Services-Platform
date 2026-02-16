import React from 'react';
import { Container, Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ message = "Loading..." }) => {

    return (

      <Container className="loader-container d-flex flex-column justify-content-center align-items-center">


            <Spinner animation="border" role="status" variant="primary" style={{ width: '3rem', height: '3rem' }}>

                <span className="visually-hidden">Loading...</span>
                
            </Spinner>

            <p className="mt-3 text-muted lead">{message}</p>


        </Container>
    );
};

export default LoadingSpinner;
