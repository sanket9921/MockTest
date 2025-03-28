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
        <h2 className="my-4">Test Analytics</h2>

        {/* Bootstrap Grid: Two Charts Side by Side */}
        <div className="row">
          <div className="col-md-6 col-12 mb-4">
            <DonutChart />
          </div>
          <div className="col-md-6 col-12 mb-4">
            <BarChart />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-12 mb-4 p-2">
            <RadarChart />
          </div>
          <div className="col-md-6 col-12 mb-4">
            <LineChart />
          </div>
        </div>
      </div>
    </div>
  );
}
