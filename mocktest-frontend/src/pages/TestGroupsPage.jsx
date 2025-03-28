import { useState, useEffect } from "react";
import { data, useNavigate } from "react-router-dom";
import {
  createTestGroup,
  fetchTestGroups,
  updateTestGroup,
  togglePublishTestGroup,
} from "../services/testGroupService";
import TestGroupForm from "../components/Forms/TestGroupForm";
import Navbar from "../components/Header";

const TestCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const limit = 9; // Fixed limit of 9 items per page

  const getTestGroups = async (pageNumber = 1) => {
    try {
      const { data, totalPages } = await fetchTestGroups(pageNumber, limit); // Pass limit
      setCategories(data);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching test groups:", error);
    }
  };
  useEffect(() => {
    setLoading(true);
    getTestGroups(page);
    setLoading(false);
  }, [page]);

  const handleSave = async (formData) => {
    if (formData.id) {
      await updateTestGroup(formData.id, formData);
    } else {
      await createTestGroup(formData);
    }
    getTestGroups(page);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
    setShowModal(false);
  };

  const handleSelectedCategory = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleTogglePublish = async (id, currentStatus) => {
    await togglePublishTestGroup(id, !currentStatus);
    getTestGroups(page);
  };

  return (
    <div className="container px-0 mt-4">
      <div className="px-2 mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="mb-2">Mock Test</h1>
          <button
            className="btn btn-success"
            onClick={() => setShowModal(true)}
          >
            + Add Category
          </button>
        </div>

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
                    style={{ height: "180px" }}
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
                      <div>
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => navigate(`/tests/${category.id}`)}
                        >
                          View Tests
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-sm me-2"
                          onClick={() => handleSelectedCategory(category)}
                        >
                          Edit
                        </button>
                        <button
                          className={`btn btn-sm ${
                            category.publish ? "btn-danger" : "btn-success"
                          }`}
                          onClick={() =>
                            handleTogglePublish(category.id, category.publish)
                          }
                        >
                          {category.publish ? "Unpublish" : "Publish"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-3">
                <button
                  className="btn btn-outline-primary me-2"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </button>
                <span className="align-self-center">
                  Page {page} of {totalPages}
                </span>
                <button
                  className="btn btn-outline-primary ms-2"
                  disabled={page === totalPages}
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  Next
                </button>
              </div>
            )}

            {/* Form Modal */}
            <TestGroupForm
              show={showModal}
              onClose={handleCloseModal}
              onSubmit={handleSave}
              initialData={selectedCategory}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TestCategories;
