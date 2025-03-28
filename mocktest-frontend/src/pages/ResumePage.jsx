import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Header";
import image from "../assets/image.png";
import { getInProgressTests } from "../services/testAttemptService"; // API call to fetch in-progress tests

const ResumePage = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadInProgressTests();
  }, []);

  const loadInProgressTests = async () => {
    try {
      const testsData = await getInProgressTests();
      console.log(testsData);
      setTests(testsData);
    } catch (error) {
      console.error("Error fetching in-progress tests:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-3">
      <div className="container-fluid mt-4">
        <h1 className="mb-3">Resume Your Tests</h1>
        <p>Resume tests which you didn’t completed.</p>

        {loading ? (
          <p className="text-center text-blue-500">Loading tests...</p>
        ) : tests.length === 0 ? (
          <p className="text-center text-gray-500">
            No in-progress tests found.
          </p>
        ) : (
          <div className="custom-border p-3">
            {tests.map((test) => (
              <div key={test.id} className="row align-items-center mb-3">
                {/* Image + Test Name & Duration in One Row */}
                <div className="col-12 col-md-9 d-flex flex-row align-items-center gap-2">
                  <img
                    src={image}
                    width={40}
                    height={40}
                    alt="img"
                    className="rounded-circle border"
                  />
                  <div className="mt-3">
                    <h4>{test.Test.name}</h4>
                    <div className="d-flex flex-wrap gap-2">
                      <span>
                        <i className="bi bi-clock"></i>{" "}
                        {test.Test.duration
                          ? test.Test.duration + " min"
                          : "No Limit"}
                      </span>
                      <span>
                        <i className="bi bi-bar-chart"></i> Difficulty{" : "}
                        {test.Test.difficulty}
                      </span>
                      <span className=" m-0">
                        <i className="bi bi-clipboard-check"></i> Marks{" : "}
                        {test.Test.totalMarks}{" "}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Button - Moves Below in Small Screens */}
                <div className="col-12 col-md-3 text-md-end mt-2 mt-md-0">
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => navigate(`/attempt/${test.id}`)}
                  >
                    Resume Test
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

export default ResumePage;
