// client/src/components/ContactSection.js

import React, { useState } from 'react';
import api from '../utils/api'; // <-- 1. Import your central api file
import './ContactSection.css';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [statusMessage, setStatusMessage] = useState('');

  const { name, email, message } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('Sending...');

    try {
      // <-- 2. Use the 'api' instance and provide only the endpoint
      const res = await api.post('/contact', { name, email, message });
      
      setStatusMessage(res.data.msg || 'Message sent successfully!'); // Use the response message
      setFormData({ name: '', email: '', message: '' }); // Clear the form
    } catch (err) {
      console.error('Contact form submission error:', err);
      const errorMsg = err.response?.data?.msg || 'Sorry, something went wrong. Please try again.';
      setStatusMessage(errorMsg);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <h2>Contact Us</h2>
      <form className="contact-form" onSubmit={onSubmit}>
        <div className="form-row">
          <input
            type="text"
            placeholder="Your Name"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <textarea
          placeholder="Your Message"
          name="message"
          value={message}
          onChange={onChange}
          required
        ></textarea>
        <button type="submit" className="btn-send">
          Send Message
        </button>
      </form>
      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </section>
  );
};

export default ContactSection;