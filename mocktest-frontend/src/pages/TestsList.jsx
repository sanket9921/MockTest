import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchTestsByGroup } from "../services/testService.";
import Navbar from "../components/Header";
import image from "../assets/image.png";
const TestsList = () => {
  const { categoryId } = useParams();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTestsByGroup(categoryId)
      .then((data) => {
        setTests(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [categoryId]);

  return (
    <div className="container my-3">
      <Navbar />
      <div className="container-fluid mt-4">
        <h1 className="mb-3">Aptitude Test</h1>
        <p>
          Mock test is a practice exam designed to simulate the format, timing,
          and difficulty of a real test.
        </p>

        {loading ? (
          <p className="text-center text-blue-500">Loading tests...</p>
        ) : tests.length === 0 ? (
          <p className="text-center text-gray-500">
            No tests available in this category.
          </p>
        ) : (
          <div className="custom-border p-3">
            <h2>Computer Science / IT Engineering</h2>
            {tests.map((test) => (
              <div key={test.id} className="row align-items-center mb-3">
                {/* Image + Test Name & Duration in One Row */}
                <div className="col-12 col-md-9 d-flex flex-row align-items-center gap-2">
                  {/* Image */}
                  <img
                    src={image}
                    width={40}
                    height={40}
                    alt="img"
                    className="rounded-circle border"
                  />

                  {/* Test Name & Duration */}
                  <div className="mt-3">
                    <h4>{test.name}</h4>
                    <div className="d-flex flex-wrap gap-2">
                      <span className=" m-0">
                        <i className="bi bi-clock"></i>{" "}
                        {test.duration ? test.duration + " min" : "No Limit"}
                      </span>
                      <span className=" m-0">
                        <i className="bi bi-card-list"></i> {test.questions}{" "}
                        Questions
                      </span>
                      <span className=" m-0">
                        <i className="bi bi-bar-chart"></i> Difficulty{" "}
                        {test.level}{" "}
                      </span>
                      <span className=" m-0">
                        <i className="bi bi-x-circle"></i> Negative {test.level}{" "}
                      </span>
                      <span className=" m-0">
                        <i className="bi bi-clipboard-check"></i> Marks{" "}
                        {test.level}{" "}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Button - Moves Below in Small Screens */}
                <div className="col-12 col-md-3 text-md-end mt-2 mt-md-0">
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => navigate(`/rules/${test.id}`)}
                  >
                    Attempt Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestsList;
