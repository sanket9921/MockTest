import React from "react";
import TestCategories from "./TestCategories";
import Navbar from "../components/Header";

function HomePage() {
  return (
    <div className="container my-3">
      <Navbar />
      <TestCategories />
    </div>
  );
}

export default HomePage;
