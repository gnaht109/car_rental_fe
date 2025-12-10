import React from "react";

function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    // Form submission logic can be added here
    console.log("Form submitted:", data);
    alert("Thank you for your message! We'll get back to you within 24 hours.");
    e.target.reset();
  };
  /* Sửa lại code để đẹp hơn */
  return (
    <section className="contact-page">
      <div className="container">
        <h1 className="page-title">Get In Touch</h1>
        <p className="page-subtitle">
          Have questions or need assistance with a booking? We're here to help.
        </p>

        <div className="contact-content-layout">
          {/* Left Side: Contact Information */}
          <div className="contact-info">
            <h3>Contact Information</h3>
            <p>
              Fill out the form and our team will get back to you within 24
              hours.
            </p>

            <div className="info-item">
              <i className="fas fa-phone"></i>
              <span>+84 913 817 818</span>
            </div>
            <div className="info-item">
              <i className="fas fa-envelope"></i>
              <span>tanminhnguyen2004@gmail.com</span>
            </div>
            <div className="info-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>khu phố 6, TP Thủ Đức, Thành phố Hồ Chí Minh</span>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="contact-form-container">
            <form
              id="contact-form"
              className="contact-form"
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-accent btn-block">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactPage;
