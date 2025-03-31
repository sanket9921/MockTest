import React from "react";
import DonutChart from "../components/charts/DonutChart";
import Navbar from "../components/Header";
import BarChart from "../components/charts/BarChart";
import RadarChart from "../components/charts/RadarChart";
import LineChart from "../components/charts/LineChart";

export default function TestAnalyticsPage() {
  return (
    <div className="mt-4">
      <div className="container">
        <h2 className="my-4 text-center">Test Analytics</h2>

        {/* First Row - DonutChart & BarChart */}
        <div className="row d-flex align-items-stretch gx-3 gy-3">
          <div className="col-md-6 col-12 d-flex">
            <div className="border rounded p-md-3 p-2 d-flex flex-column flex-fill w-100">
              <DonutChart className="flex-grow-1" />
            </div>
          </div>

          <div className="col-md-6 col-12 d-flex">
            <div className="border rounded p-md-3 p-2 d-flex flex-column flex-fill w-100">
              <BarChart className="flex-grow-1" />
            </div>
          </div>
        </div>

        {/* Second Row - RadarChart & LineChart */}
        <div className="row d-flex align-items-stretch gx-3 gy-3 mt-3">
          <div className="col-md-6 col-12 d-flex">
            <div className="border rounded p-md-3 p-2 d-flex flex-column flex-fill w-100">
              <RadarChart className="flex-grow-1" />
            </div>
          </div>

          <div className="col-md-6 col-12 d-flex">
            <div className="border rounded p-md-3 p-2 d-flex flex-column flex-fill w-100">
              <LineChart className="flex-grow-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
