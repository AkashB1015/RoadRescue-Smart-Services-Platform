import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import 'bootstrap-icons/font/bootstrap-icons.css';

const NavigationBar = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = React.useState(!!localStorage.getItem('token'));

    const [userName, setUserName] = React.useState('');
    const [homeLink, setHomeLink] = React.useState('/');
    const [userRole, setUserRole] = React.useState(null);

    const determineAuthDetails = () => {
        const token = localStorage.getItem('token');

        if (!token) return { link: '/', role: null, name: '' };

        try {

            const decoded = jwtDecode(token);
            const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded["role"];

            const name = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || decoded["unique_name"] || decoded["name"] || "User";

            let link = '/';
            
            if (role === 'ADMIN'){

                 link = '/admin-dashboard';

            }
            else if (role === 'SERVICE_PROVIDER'){

                link = '/provider-dashboard';

            }
            else {

                link = '/user-dashboard';

            }

            return { link, role, name };

        } catch (e) {

            console.error("Token decode error:", e);

            return { 

                link: '/', role: null, name: '' 

            };
        }
    };

    React.useEffect(() => {

        const handleAuthChange = () => {

            const loggedIn = !!localStorage.getItem('token');
            setIsLoggedIn(loggedIn);
            const { link, role, name } = determineAuthDetails();
            setHomeLink(link);
            setUserRole(role);
            setUserName(name);
            
        };

        // Initial check
        handleAuthChange();

        window.addEventListener('auth-change', handleAuthChange);
        return () => window.removeEventListener('auth-change', handleAuthChange);

    }, []);

    const handleLogout = () => {

        localStorage.removeItem('token');
        window.dispatchEvent(new Event('auth-change'));
        toast.info("Logout Successful");
        navigate('/login');

    };

    return (

        <Navbar bg="white" expand="lg" fixed="top" className="main-navbar shadow-sm" >

            <Container>
                <Navbar.Brand
                    as={Link}
                    to={homeLink}
                    className="roadrescue-brand d-flex align-items-center"
                >
                    <i className="bi bi-shield-fill-check me-2"></i>
                    Road<span>Rescue</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">

                    <Nav className="mx-auto align-items-center">

                        {userRole === 'ADMIN' ? (

                            <Nav.Link as={Link} to="/admin-dashboard" className="custom-nav-link" active={location.pathname === '/admin-dashboard'}>Admin Dashboard</Nav.Link>

                        ) : (

                            <>
                                <Nav.Link as={Link} to={homeLink} className="custom-nav-link" active={location.pathname === '/' || location.pathname === homeLink}>Home</Nav.Link>
                                <Nav.Link as={Link} to="/services" className="custom-nav-link" active={location.pathname === '/services'}>Services</Nav.Link>

                                {userRole === 'SERVICE_PROVIDER' && (
                                    <Nav.Link as={Link} to="/my-services" className="custom-nav-link" active={location.pathname === '/my-services'}>My Services</Nav.Link>
                                )}

                                {userRole === 'USER' && (
                                    <Nav.Link as={Link} to="/history" className="custom-nav-link">History</Nav.Link>
                                )}
                                {userRole !== 'SERVICE_PROVIDER' && (
                                    <Nav.Link as={Link} to="/about" className="custom-nav-link" active={location.pathname === '/about'}>About Us</Nav.Link>
                                )}
                                <Nav.Link as={Link} to="/contact" className="custom-nav-link" active={location.pathname === '/contact'}>Contact Us</Nav.Link>

                            </>
                        )}
                    </Nav>

                    <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">

                        {isLoggedIn ? (

                            <>
                                <span className="fw-semibold text-primary me-2">Hi, {userName}</span>
                                <Button variant="outline-danger" size="sm" className="px-3 rounded-pill" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>

                        ) : (
                            <>

                                <Link to="/register">
                                    <Button variant="outline-primary" size="sm" className="px-3 rounded-pill">Register</Button>
                                </Link>
                                <Link to="/login">
                                    <Button variant="primary" size="sm" className="px-3 rounded-pill">Login</Button>
                                </Link>

                            </>
                        )}
                        
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
