import React, { useState } from "react";
import bytraitlogo from "../assets/bytrait_logo.png";

const Navbar = () => {
  const [isCounsellor, setIsCounsellor] = useState(false);

  const onLogOut = () => {
    console.log("Logged out");
  };

  return (
    <>
      <nav className="container navbar navbar-expand-lg navbar-light bg-white px-3 rounded-pill">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          {/* Logo */}
          <a className="navbar-brand d-flex align-items-center" href="#">
            <img src={bytraitlogo} width="150" alt="Logo" />
          </a>

          {/* Toggler Button - Visible Only on Small Screens */}
          <button
            className="navbar-toggler p-0 border rounded d-lg-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{
              width: "25px",
              height: "25px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Desktop Navbar - Only Visible on Large Screens */}
          <div className="collapse navbar-collapse justify-content-end d-none d-lg-flex">
            <ul className="navbar-nav d-flex align-items-center ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="#">
                  About Us
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Contact Us
                </a>
              </li>
              {!isCounsellor ? (
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    My Report
                  </a>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Student Reports
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Career Preference
                    </a>
                  </li>
                </>
              )}
              {/* Profile Dropdown */}
              <li className="nav-item dropdown ms-auto">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    style={{ width: "35px" }}
                    src="https://img.icons8.com/bubbles/100/000000/administrator-male.png"
                    className="img-sm rounded-circle"
                    alt="profile"
                  />
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a className="dropdown-item" href="#" onClick={onLogOut}>
                      Logout
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Offcanvas Menu for Mobile */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
            Menu
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="navbar-nav ms-auto align-items-start">
            <li className="nav-item">
              <a className="nav-link" href="#">
                About Us
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Contact Us
              </a>
            </li>
            {!isCounsellor ? (
              <li className="nav-item">
                <a className="nav-link" href="#">
                  My Report
                </a>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Student Reports
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Career Preference
                  </a>
                </li>
              </>
            )}
            <li>
              <a className="nav-link" href="#" onClick={onLogOut}>
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
