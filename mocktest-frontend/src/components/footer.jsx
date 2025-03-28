import React from "react";

const Footer = () => {
  return (
    <footer className=" text-dark text-center py-3 mt-5  border-top">
      <p className="mb-0">
        © {new Date().getFullYear()} ByTrait. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
