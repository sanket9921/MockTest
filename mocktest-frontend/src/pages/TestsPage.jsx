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
} from "../services/testService.";

const TestsPage = () => {
  const { groupId } = useParams();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null);
  const [testCategory, setTestCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (groupId) {
      getCategoriesById();
      loadTests();
    }
  }, [groupId]);

  const getCategoriesById = async () => {
    try {
      const category = await getTestGroupById(groupId);
      console.log("Fetched Category:", category);
      setTestCategory(category.data || category); // Ensure correct data assignment
    } catch (error) {
      console.error("Error fetching test category:", error);
    }
  };

  const loadTests = async () => {
    try {
      const testsData = await fetchTestsByGroup(groupId);
      console.log(testsData);
      setTests(testsData);
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTest = async (testData) => {
    try {
      if (testData.id) {
        await updateTest(testData.id, testData);
      } else {
        await createTest({ ...testData, group_id: groupId }); // Call your create API
      }
      setModalData(null);
      loadTests();
    } catch (error) {
      console.error("Error saving test:", error);
    }
  };

  return (
    <div className="container my-3">
      <Navbar />
      <div className="container-fluid mt-4 z-0">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h1 className="mb-3">{testCategory?.name || "Loading..."}</h1>
            <p>{testCategory?.description || "No description available"}</p>
          </div>
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
          <div className="custom-border p-3 z-0">
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
                        <i className="bi bi-card-list"></i> {test.questions}{" "}
                        Questions
                      </span>
                      <span>
                        <i className="bi bi-bar-chart"></i> Difficulty{" : "}
                        {test.difficulty}
                      </span>
                      <span className=" m-0">
                        <i className="bi bi-x-circle"></i> Negative{" : "}
                        {test.negative}{" "}
                      </span>
                      <span className=" m-0">
                        <i className="bi bi-clipboard-check"></i> Marks{" : "}
                        {test.totalMarks}{" "}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-3 text-md-end mt-2 mt-md-0">
                  <button
                    className="btn btn-primary me-2"
                    onClick={() =>
                      setModalData({ ...test, action: "Edit Test" })
                    }
                  >
                    Edit Test
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(`/addquestions/${test.id}`)}
                  >
                    View Questions
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {modalData && (
          <TestFormModal
            data={modalData}
            onClose={() => setModalData(null)}
            onSave={handleSaveTest}
          />
        )}
      </div>
    </div>
  );
};

export default TestsPage;
