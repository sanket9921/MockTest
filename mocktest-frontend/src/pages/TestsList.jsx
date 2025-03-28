import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Header";
import image from "../assets/image.png";
import { getTestGroupById } from "../services/testGroupService";
import { fetchTestsByGroup } from "../services/testService.";

const TestsList = () => {
  const { categoryId } = useParams();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testCategory, setTestCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    if (categoryId) {
      getCategoryDetails();
      loadTests(page);
    }
  }, [categoryId, page]); // Reload when categoryId or page changes

  const getCategoryDetails = async () => {
    try {
      const category = await getTestGroupById(categoryId);
      setTestCategory(category.data || category);
    } catch (error) {
      console.error("Error fetching test category:", error);
    }
  };

  const loadTests = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const { data, totalPages } = await fetchTestsByGroup(
        categoryId,
        pageNumber,
        9
      );
      setTests(data);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
    setLoading(false);
  };

  return (
    <div className="container my-3">
      <div className="container-fluid mt-4">
        <h1 className="mb-3">{testCategory?.name || "Loading..."}</h1>
        <p>{testCategory?.description || "No description available"}</p>

        {loading ? (
          <p className="text-center text-blue-500">Loading tests...</p>
        ) : tests.length === 0 ? (
          <p className="text-center text-gray-500">
            No tests available in this category.
          </p>
        ) : (
          <div className="custom-border p-3">
            {tests.map((test) => (
              <div key={test.id} className="row align-items-center mb-3">
                <div className="col-12 col-md-9 d-flex flex-row align-items-center gap-2">
                  <img
                    src={image}
                    width={40}
                    height={40}
                    alt="img"
                    className="rounded-circle border"
                  />
                  <div className="mt-3">
                    <h4>{test.name}</h4>
                    <div className="d-flex flex-wrap gap-2">
                      <span>
                        <i className="bi bi-clock"></i>{" "}
                        {test.duration ? test.duration + " min" : "No Limit"}
                      </span>
                      <span>
                        <i className="bi bi-card-list"></i>{" "}
                        {test.question_count} Questions
                      </span>
                      <span>
                        <i className="bi bi-bar-chart"></i> Difficulty:{" "}
                        {test.difficulty}
                      </span>
                      <span>
                        <i className="bi bi-x-circle"></i> Negative:{" "}
                        {test.negative}
                      </span>
                      <span>
                        <i className="bi bi-clipboard-check"></i> Marks:{" "}
                        {test.totalMarks}
                      </span>
                    </div>
                  </div>
                </div>
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

        {/* Pagination */}
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

export default TestsList;
