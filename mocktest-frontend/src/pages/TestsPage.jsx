import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Header";
import image from "../assets/image.png";
import TestFormModal from "../components/Forms/TestFormModal";
import { getTestGroupById } from "../services/testGroupService";
import {
  createTest,
  fetchTestsByGroup,
  updateTest,
  toggleTestPublishStatus,
} from "../services/testService.";
import CategoryModal from "../components/CategoryModal";

const TestsPage = () => {
  const { groupId } = useParams();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null);
  const [testCategory, setTestCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryModal, setCategoryModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (groupId) {
      setLoading(true);
      getCategoryDetails();
      loadTests(page);
      setLoading(false);
    }
  }, [groupId, page]);

  const getCategoryDetails = async () => {
    try {
      const category = await getTestGroupById(groupId);
      setTestCategory(category.data || category);
    } catch (error) {
      console.error("Error fetching test category:", error);
    }
  };

  const loadTests = async (pageNumber = 1) => {
    try {
      const { data, totalPages } = await fetchTestsByGroup(
        groupId,
        pageNumber,
        9
      );
      setTests(data);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };

  const handleSaveTest = async (testData) => {
    try {
      if (testData.id) {
        await updateTest(testData.id, testData);
      } else {
        await createTest({ ...testData, group_id: groupId });
      }
      setModalData(null);
      loadTests(page);
    } catch (error) {
      console.error("Error saving test:", error);
    }
  };

  const handleTogglePublish = async (testId, currentStatus) => {
    try {
      await toggleTestPublishStatus(testId, !currentStatus);
      loadTests(page);
    } catch (error) {
      console.error("Error updating publish status:", error);
    }
  };

  return (
    <div className="container my-3">
      <div className="container-fluid mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h1 className="mb-3">{testCategory?.name || "Loading..."}</h1>
            <p>{testCategory?.description || "No description available"}</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setCategoryModal(true)}
          >
            Categories
          </button>
          <button
            className="btn btn-success"
            onClick={() => setModalData({ action: "Add New Test" })}
          >
            + Add Test
          </button>
        </div>

        {loading ? (
          <p className="text-center text-primary">Loading tests...</p>
        ) : tests.length === 0 ? (
          <p className="text-center text-muted">No tests available.</p>
        ) : (
          <div className="custom-border p-3">
            {tests.map((test) => (
              <div key={test.id} className="row align-items-center mb-3">
                <div className="col-12 col-md-8 d-flex flex-row align-items-center gap-2">
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
                <div className="col-12 col-md-4 text-md-end mt-2 mt-md-0">
                  <button
                    className={`btn btn-sm ${
                      test.publish ? "btn-danger" : "btn-success"
                    } me-2`}
                    onClick={() => handleTogglePublish(test.id, test.publish)}
                  >
                    {test.publish ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() =>
                      setModalData({ ...test, action: "Edit Test" })
                    }
                  >
                    Edit Test
                  </button>
                  <button
                    className="btn btn-outline-secondary me-2"
                    onClick={() => navigate(`/addquestions/${test.id}`)}
                  >
                    View Questions
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

        {modalData && (
          <TestFormModal
            data={modalData}
            onClose={() => setModalData(null)}
            onSave={handleSaveTest}
          />
        )}
        {categoryModal && (
          <CategoryModal onClose={() => setCategoryModal(false)} />
        )}
      </div>
    </div>
  );
};

export default TestsPage;
