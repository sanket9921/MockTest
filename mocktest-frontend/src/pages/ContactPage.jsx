import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <h1 className="mb-4">
            Welcome to <span className="text-primary">ByTrait!</span>
          </h1>
          <p className="lead">For any queries, reach out to us at:</p>
          <p className="fw-bold text-primary">enquire@bytrait.com</p>
          <hr />
          <h3 className="mt-4">Get in Touch</h3>
          <p>
            We would love to hear from you! Whether you have feedback,
            suggestions, or collaboration opportunities, don't hesitate to
            connect with us.
          </p>
          <p>
            Follow us on social media to stay updated with our latest features,
            news, and insights into career planning.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <a href="#" className="btn btn-primary">
              <FaFacebook /> Facebook
            </a>
            <a href="#" className="btn btn-info">
              <FaTwitter /> Twitter
            </a>
            <a href="#" className="btn btn-danger">
              <FaInstagram /> Instagram
            </a>
            <a href="#" className="btn btn-secondary">
              <FaLinkedin /> LinkedIn
            </a>
          </div>
          <hr />
          <h4 className="mt-4">Our Address</h4>
          <p className="fw-bold">Baner, Pune – 411045</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
