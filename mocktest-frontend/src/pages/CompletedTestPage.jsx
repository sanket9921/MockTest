import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Header";
import image from "../assets/image.png";
import { getCompletedTests } from "../services/testAttemptService"; // API call to fetch completed tests

const CompletedTestsPage = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    loadCompletedTests(page);
  }, [page]); // Reloads when `page` changes

  const loadCompletedTests = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const { data, totalPages } = await getCompletedTests(pageNumber, 8);
      setTests(data);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching completed tests:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-3">
      <div className="container-fluid mt-4">
        <h1 className="mb-3">Completed Tests</h1>
        <p>Check the results of your completed tests.</p>

        {loading ? (
          <p className="text-center text-blue-500">Loading tests...</p>
        ) : tests.length === 0 ? (
          <p className="text-center text-gray-500">No completed tests found.</p>
        ) : (
          <div className="custom-border p-3">
            {tests.map((test) => (
              <div key={test.id} className="row align-items-center mb-3">
                {/* Image + Test Name & Details */}
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
                      <span className="m-0">
                        <i className="bi bi-clipboard-check"></i> Marks:{" "}
                        {test.final_score} / {test.total_marks}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Button - Navigates to Result Page */}
                <div className="col-12 col-md-3 text-md-end mt-2 mt-md-0">
                  <button
                    className="btn btn-success w-100"
                    onClick={() => navigate(`/result/${test.id}`)}
                  >
                    Get Result
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-3">
            <button
              className="btn btn-outline-primary me-2"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span className="align-self-center">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-outline-primary ms-2"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedTestsPage;
