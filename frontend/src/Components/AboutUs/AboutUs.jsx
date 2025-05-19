// AboutUs.js
import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Hero Banner Section */}
      <div className="hero-banner">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
          alt="Smart Home Care Banner"
        />
        <div className="hero-overlay">
          <h1 className="hero-title">
            Smart Home Care
          </h1>
        </div>
      </div>

      {/* About Content */}
      <div className="p-8">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-5xl mx-auto mt-8">
          
          {/* Introduction */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-blue-600 mb-4">About Us</h2>
            <p className="text-gray-700 text-lg">
              Your trusted partner for premium home services — Quality. Trust. Innovation.
            </p>
          </div>

          {/* Our Story */}
          <div className="mb-10">
            <p className="text-gray-600 text-lg leading-7">
              Founded with a passion to bring peace, comfort, and reliability to homeowners, 
              <strong> Smart Home Care </strong> has been setting industry standards for over 
              <strong> a decade</strong>. Our journey began with a simple vision: to make home maintenance and improvement 
              easy, accessible, and worry-free for everyone. 
            </p>
            <br/>
            <p className="text-gray-600 text-lg leading-7">
              Today, we are proud to serve thousands of happy customers across the region, 
              delivering excellence through a wide range of services. 
              Our team consists of <strong>highly skilled</strong> and <strong>certified professionals</strong> 
              who bring not only expertise but also a commitment to customer satisfaction.
            </p>
          </div>

          {/* Mission and Vision */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">Our Mission & Vision</h2>
            <p className="text-gray-600 text-lg leading-7">
              Our mission is to create smarter, safer, and happier homes through innovation, trust, and service excellence.
              We envision a future where every homeowner enjoys peace of mind, knowing that expert help is just a click away.
            </p>
          </div>

          {/* Services Section */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">Our Premium Services</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Service Cards */}
              {[
                {
                  title: "Cleaning Services",
                  desc: "Deep cleaning, sanitization, and eco-friendly treatments for a healthy and spotless home.",
                  img: "https://img.icons8.com/ios-filled/100/000000/cleaning-a-surface.png"
                },
                {
                  title: "Plumbing Services",
                  desc: "Reliable plumbing repairs, leak detection, and installation by licensed plumbers.",
                  img: "https://img.icons8.com/ios-filled/100/000000/plumbing.png"
                },
                {
                  title: "Painting Services",
                  desc: "Interior and exterior painting with premium materials, creative designs, and flawless finishes.",
                  img: "https://img.icons8.com/?size=100&id=ESaKxzIHmU81&format=png&color=000000"
                },
                {
                  title: "Electronics Repair",
                  desc: "Fast and precise repairs of home electronics, ensuring performance and durability.",
                  img: "https://img.icons8.com/ios-filled/100/000000/electronics.png"
                },
                {
                  title: "Home Repairing",
                  desc: "Comprehensive home repairs, carpentry, fixture upgrades, and general handyman services.",
                  img: "https://img.icons8.com/ios-filled/100/000000/maintenance.png"
                }
              ].map((service, idx) => (
                <div key={idx} className="flex items-start space-x-4">
                  <img src={service.img} alt={service.title} className="w-16 h-16" />
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-gray-600">{service.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies Section */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-blue-500 mb-4 text-center">Modern Technologies We Use</h2>
            <p className="text-gray-600 text-lg leading-7 text-center">
              To ensure efficiency and customer satisfaction, we leverage the latest technologies:
            </p>
            <ul className="text-gray-600 text-lg leading-7 list-disc pl-6 mt-4">
              <li>Smart Scheduling and Automated Reminders</li>
              <li>Real-Time Technician Tracking</li>
              <li>Digital Payment Gateways for Ease of Use</li>
              <li>Instant Customer Feedback Systems</li>
              <li>AI-powered Service Optimization</li>
            </ul>
          </div>

          {/* Trust Section */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-blue-500 mb-4 text-center">Why Trust Smart Home Care?</h2>
            <ul className="text-gray-600 text-lg leading-7 list-disc pl-6">
              <li>All staff are background-checked and certified experts</li>
              <li>On-time, reliable service with real-time status updates</li>
              <li>No hidden charges — clear and upfront pricing</li>
              <li>Emergency support available 24/7 for urgent needs</li>
              <li>Highest standards of safety, quality, and hygiene practices</li>
              <li>Thousands of positive customer testimonials and success stories</li>
            </ul>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Experience Excellence with Smart Home Care</h2>
            <p className="text-gray-700 text-lg mb-4">
              Ready to transform your home experience? Partner with Smart Home Care today and enjoy premium services tailored to your needs.
            </p>
            <p className="text-gray-700 text-lg">
              <strong>We are not just a service provider — we are your trusted partner in building a better, safer, and happier home.</strong>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutUs;
