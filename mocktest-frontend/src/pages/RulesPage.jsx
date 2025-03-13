import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { startTestAttempt } from "../services/testAttemptService";
import { getTestDetails } from "../services/testService.";
import Navbar from "../components/Header";

const RulePage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [testDetails, setTestDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getTestDetails(testId);
        setTestDetails(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [testId]);

  const handleStartTest = async () => {
    try {
      const attemptId = await startTestAttempt(testId);
      navigate(`/attempt/${attemptId}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p className="text-center fs-5">Loading...</p>;

  return (
    <div className="container my-3">
      <Navbar />
      <div className="container-fluid custom-border mt-4">
        <h2 className="text-primary text-center mb-3">
          {testDetails.name} - Rules & Instructions
        </h2>

        {/* General Instructions */}
        <div className="mb-3">
          <p>
            <strong>📢 Important Instructions:</strong>
          </p>
          <ul>
            <li>
              ⚡ Read all instructions carefully before starting the test.
            </li>
            <li>
              ✅ Your answers are saved automatically, no need to submit each
              question.
            </li>
            <li>
              ⏳ If the time runs out, the test will be submitted automatically.
            </li>
            <li>
              📌 You can move between questions using the{" "}
              <strong>"Previous"</strong> and <strong>"Next"</strong> buttons.
            </li>
            <li>
              🔄 Use the <strong>"Clear"</strong> button to remove your selected
              answer.
            </li>
            <li>
              ⭐ Use the <strong>"Mark for Review"</strong> button if you want
              to check the question later.
            </li>
            <li>
              📍 The <strong>Navigation Panel</strong> helps you jump to any
              question directly.
            </li>
            <li>
              📊 The colors in the navigation panel indicate the status of each
              question:
            </li>
            <ul>
              <li>
                ⚪ <strong>Not Attempted</strong> - You have not answered this
                question.
              </li>
              <li>
                🟢 <strong>Attempted</strong> - You have selected an answer.
              </li>
              <li>
                🟡 <strong>Partially Answered</strong> - You have answered some
                parts (if applicable).
              </li>
              <li>
                🟣 <strong>Marked for Review</strong> - You have flagged this
                question to check later.
              </li>
            </ul>
            <li>
              ❌ If negative marking applies, wrong answers will reduce your
              score.
            </li>
            <li>🚫 Do not refresh or close the browser during the test.</li>
            <li>
              💡 Once you finish, click the <strong>"Submit Test"</strong>{" "}
              button to complete the test.
            </li>
          </ul>
        </div>

        {/* Test Details */}
        <ul className="list-group mb-4">
          <li className="list-group-item">
            📌 Total Questions: {testDetails.questionCount}
          </li>
          {testDetails.duration && (
            <li className="list-group-item">
              ⏳ Time Limit: {testDetails.duration} mins
            </li>
          )}
          <li className="list-group-item">
            🎯 Total Marks: {testDetails.totalMarks}
          </li>
        </ul>
        <div className="mt-3">
          <h4>🖱️ Button Guide:</h4>
          <div className="d-flex align-items-center mb-2">
            <button className="btn btn-secondary me-2">Previous</button>
            <span>Move to the previous question</span>
          </div>
          <div className="d-flex align-items-center mb-2">
            <button className="btn btn-primary me-2">Mark for Review</button>
            <span>Mark this question for review (Purple if marked)</span>
          </div>
          <div className="d-flex align-items-center mb-2">
            <button className="btn btn-primary me-2">Next</button>
            <span>Move to the next question</span>
          </div>
          <div className="d-flex align-items-center mb-2">
            <button className="btn btn-danger me-2">Submit Test</button>
            <span>Submit the test when finished</span>
          </div>
        </div>

        <button
          onClick={handleStartTest}
          className="btn btn-primary w-100 mt-4"
        >
          Start Test
        </button>
      </div>
    </div>
  );
};

export default RulePage;
