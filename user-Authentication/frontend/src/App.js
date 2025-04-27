import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/footer/footer';
import Home from './Components/Home/Home';
import Login from './Components/Login/Login';
import NewPage from './Components/NewPage/NewPage';
import Profile from './Components/Profile/Profile';
import AdminPanel from './Components/Admin/AdminPanel';
import VerifyEmail from './Components/VerifyEmail/VerifyEmail';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import ServiceProviderForgotPassword from './Components/ForgotPassword/ServiceProviderForgotPassword';
import ServiceProviderResetPassword from './Components/ResetPassword/ServiceProviderResetPassword';
import CertificationDisplay from './Components/CertificationDisplay/CertificationDisplay'; // New import
import AdminRegister from './Components/AdminRegisterandLogin/AdminRegister'; // New import
import AdminLogin from './Components/AdminRegisterandLogin/AdminLogin'; // New import
import BookingList from './Components/CusBookingList/BookingList'; // Correct import
import ServiceProviderBookingList from './Components/SPbookingList/ServiceProviderBookingList'; // Correct import

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/newpage" element={<NewPage />} />
          
          {/* Add certification display as a separate route */}
          <Route path="/certifications" element={<CertificationDisplay />} />
          
          {/* Or integrate it within the profile route */}
          <Route path="/profile" element={
            <div>
              <Profile />
              <CertificationDisplay /> {/* Display certifications below profile */}
            </div>
          } />
          
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/verifyEmail" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/service-provider-forgot-password" element={<ServiceProviderForgotPassword />} />
          <Route path="/service-provider-reset-password" element={<ServiceProviderResetPassword />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/bookings" element={<BookingList />} />
          <Route path="/serviceProviderBookings" element={<ServiceProviderBookingList />} />

        </Routes>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App; 