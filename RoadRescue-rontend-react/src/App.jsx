import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavigationBar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/public/Home';
import ServicesPage from './pages/public/ServicesPage';
import AboutUs from './pages/public/AboutUs';
import ContactUs from './pages/public/ContactUs';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import UserDashboard from './pages/dashboard/UserDashboard';
import ServiceProviderDashboard from './pages/dashboard/ServiceProviderDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AddAdmin from './pages/admin/AddAdmin';
import MyServices from './pages/dashboard/MyServices';
import BookingHistory from './pages/dashboard/BookingHistory';
import ProtectedRoute from './components/common/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="page-container">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
        <NavigationBar />
        <div className="content-wrap">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes */}
            <Route
              path="/user-dashboard"
              element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider-dashboard"
              element={
                <ProtectedRoute allowedRoles={['SERVICE_PROVIDER']}>
                  <ServiceProviderDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-services"
              element={
                <ProtectedRoute allowedRoles={['SERVICE_PROVIDER']}>
                  <MyServices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add-admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AddAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <BookingHistory />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
