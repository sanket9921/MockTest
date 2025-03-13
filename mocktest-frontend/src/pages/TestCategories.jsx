import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTestGroups } from "../services/testGroupService";

const TestCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTestGroups()
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="container-fluid px-0 mt-4">
      <div className="px-2">
        <h1 className="mb-2">Mock Test</h1>
        <p className="mb-3">
          Mock test is a practice exam designed to simulate the format, timing,
          and difficulty of a real test.
        </p>

        {loading ? (
          <p className="text-center text-primary">Loading categories...</p>
        ) : (
          <div className="custom-border rounded p-3">
            <h2 className="m-3">
              Live Tests & <span className="text-primary">Free</span> Quizzes
            </h2>
            <div className="row g-2 p-2">
              {categories.map((category) => (
                <div key={category.id} className="col-12 col-sm-6 col-md-4 p-2">
                  <div
                    className="custom-border p-3 shadow-sm h-100 d-flex flex-column"
                    style={{ height: "163px" }}
                  >
                    <h3 className="mb-2">
                      {category.name.length > 18
                        ? category.name.substring(0, 18) + "..."
                        : category.name}
                    </h3>
                    <span className="text-tertiary d-block mb-2 flex-grow-1">
                      {category.description}
                    </span>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-tertiary">
                        <i className="bi bi-card-checklist me-1"></i>
                        {category.testCount} Test
                      </span>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/testslist/${category.id}`)}
                      >
                        View Tests
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestCategories;
