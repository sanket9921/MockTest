import React from "react";
import bytraitlogo from "../assets/bytrait_logo.png";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Navbar = () => {
  const { isAdmin } = useAuth();

  const onLogOut = () => {
    console.log("Logged out");
  };

  return (
    <>
      <nav className="container navbar navbar-expand-lg navbar-light bg-white px-3 rounded-pill">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          {/* Logo */}
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src={bytraitlogo} width="150" alt="Logo" />
          </Link>

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
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Mock Test
                </a>
                <ul
                  className="dropdown-menu custom-border"
                  aria-labelledby="navbarDropdown"
                >
                  <li>
                    <Link className="dropdown-item" to="/">
                      New Test
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/resume-test">
                      Resume Test
                    </Link>
                  </li>

                  <li>
                    <Link className="dropdown-item" to="/test-completed">
                      Completed Test
                    </Link>
                  </li>
                </ul>
              </li>
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

              {isAdmin && ( // Show Test Category only for admins
                <li className="nav-item">
                  <Link className="nav-link" to="/test-groups">
                    Test Category
                  </Link>
                </li>
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
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src={bytraitlogo} width="150" alt="Logo" />
          </Link>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body d-flex flex-column align-items-center">
          <ul className="navbar-nav text-center">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="mobileDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Mock Test
              </a>
              <ul
                className="dropdown-menu text-center custom-border"
                aria-labelledby="mobileDropdown"
              >
                <li>
                  <Link className="dropdown-item" to="/">
                    New Test
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/resume-test">
                    Resume Test
                  </Link>
                </li>

                <li>
                  <Link className="dropdown-item" to="/test-completed">
                    Completed Test
                  </Link>
                </li>
              </ul>
            </li>
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
            {isAdmin && ( // Show Test Category only for admins
              <li className="nav-item">
                <Link className="nav-link" to="/test-groups">
                  Test Category
                </Link>
              </li>
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
