import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import AdminNavbar from './Components/AdminNavbar/AdminNavbar';
import ProNavbar from './Components/ProNavbar/ProNavbar';
import Footer from './Components/footer/footer';
import Home from './Components/Home/Home';
import Login from './Components/Login/Login';
import NewPage from './Components/NewPage/NewPage';
import CustomerProfile from './Components/Profile/CustomerProfile';
import ProviderProfile from './Components/Profile/ProviderProfile';
import AdminPanel from './Components/Admin/AdminPanel';
import AdminDashboard from './Components/Admin/AdminDashboard';
import VerifyEmail from './Components/VerifyEmail/VerifyEmail';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import ServiceProviderForgotPassword from './Components/ForgotPassword/ServiceProviderForgotPassword';
import ServiceProviderResetPassword from './Components/ResetPassword/ServiceProviderResetPassword';
import CertificationDisplay from './Components/CertificationDisplay/CertificationDisplay';
import Services from './Components/Services/Services';
import AdminRegister from './Components/AdminRegisterandLogin/AdminRegister';
import AdminLogin from './Components/AdminRegisterandLogin/AdminLogin';
import AdminCustomerManagement from './Components/Admin/AdminCustomerManagement';
import ServiceDetail from './Components/ServiceDetail/ServiceDetail';
import BookingForm from './Components/BookingForm/BookingForm';
import AboutUs from './Components/AboutUs/AboutUs';
import ContactUs from './Components/ContactUs/ContactUs';
import AdminBookings from './Components/Admin/AdminBookings';
import ComplaintManagement from './Components/Admin/ComplaintManagement';
import ProviderDashboard from './Components/ProviderDashboard/ProviderDashboard';
import ProviderBookings from './Components/ProviderBookings/ProviderBookings';
import BookingHistory from './Components/BookingHistory/BookingHistory';
import ReviewForm from './Components/ReviewForm/ReviewForm';
import ComplaintForm from './Components/ComplaintForm/ComplaintForm';


function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function AdminLayout({ children }) {
  return (
    <>
      <AdminNavbar />
      {children}
      <Footer />
    </>
  );
}

function ProviderLayout({ children }) {
  return (
    <>
      <ProNavbar />
      {children}
      <Footer />
    </>
  );
}

function App() {
  const userType = localStorage.getItem('userType');

  return (
    <div>
      <BrowserRouter>
        <Routes>

          {/* Main Layout Pages */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
          <Route path="/newpage" element={<MainLayout><NewPage /></MainLayout>} />
          <Route path="/services" element={<MainLayout><Services /></MainLayout>} />
          <Route path="/services/:serviceType" element={<MainLayout><ServiceDetail /></MainLayout>} />
          <Route path="/booking-form" element={<MainLayout><BookingForm /></MainLayout>} />
          <Route path="/AboutUs" element={<MainLayout><AboutUs /></MainLayout>} />
          <Route path="/ContactUs" element={<MainLayout><ContactUs /></MainLayout>} />
          <Route path="/certifications" element={<MainLayout><CertificationDisplay /></MainLayout>} />
          <Route path="/profile" element={<MainLayout><CustomerProfile /></MainLayout>} />
          <Route path="/review" element={<MainLayout><ReviewForm /></MainLayout>} />
          <Route path="/booking-history" element={<MainLayout><BookingHistory /></MainLayout>} />
          <Route path="/verifyEmail" element={<MainLayout><VerifyEmail /></MainLayout>} />
          <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
          <Route path="/reset-password" element={<MainLayout><ResetPassword /></MainLayout>} />
          <Route path="/addcomplaint" element={<MainLayout><ComplaintForm /></MainLayout>} />
          <Route path="/service-provider-forgot-password" element={<MainLayout><ServiceProviderForgotPassword /></MainLayout>} />
          <Route path="/service-provider-reset-password" element={<MainLayout><ServiceProviderResetPassword /></MainLayout>} />

          {/* Admin Layout Pages */}
          <Route path="/admin/providers" element={<AdminLayout><AdminPanel /></AdminLayout>} />
          <Route path="/admin/customers" element={<AdminLayout><AdminCustomerManagement /></AdminLayout>} />
          <Route path="/admin/complaints" element={<AdminLayout><ComplaintManagement /></AdminLayout>} />
          <Route path="/admin/bookings" element={<AdminLayout><AdminBookings /></AdminLayout>} />
          <Route path="/admin/register" element={<AdminLayout><AdminRegister /></AdminLayout>} />
          <Route path="/admin/login" element={<AdminLayout><AdminLogin /></AdminLayout>} />
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />


          {/* Provider Layout Pages */}
          <Route path="/provider-dashboard" element={<ProviderLayout><ProviderDashboard /></ProviderLayout>} />
          <Route path="/provider-bookings" element={<ProviderLayout><ProviderBookings /></ProviderLayout>} />
          <Route path="/provider-about" element={<ProviderLayout><AboutUs /></ProviderLayout>} />
          <Route path="/provider-contact" element={<ProviderLayout><ContactUs /></ProviderLayout>} />
          <Route path="/provider-profile" element={<ProviderLayout><ProviderProfile /></ProviderLayout>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
