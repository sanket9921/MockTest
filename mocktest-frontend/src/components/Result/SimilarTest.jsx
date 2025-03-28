import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import image from "../../assets/image.png";
import { fetchTestsByGroup } from "../../services/testService.";

const SimilarTest = ({ groupId }) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTests = async () => {
      try {
        const response = await fetchTestsByGroup(groupId);
        setTests(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching tests:", error);
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      loadTests();
    }
  }, [groupId]);

  if (loading)
    return <p className="text-center text-primary">Loading tests...</p>;
  if (!tests.length)
    return <p className="text-center text-muted">No tests available.</p>;

  return (
    <div className="p-2 bg-white custom-border">
      <h3 className="mb-3 ms-2 mt-2 ">Tests in this Category</h3>

      {tests.map((test) => (
        <div key={test.id} className="row align-items-center mb-3 p-2">
          {/* Image + Test Name & Duration in One Row */}
          <div className="col-12 col-md-12 d-flex flex-row align-items-center gap-2">
            <img
              src={image}
              width={40}
              height={40}
              alt="Test"
              className="rounded-circle border"
            />
            <div>
              <h4 className="my-1">{test.name}</h4>
              <div className="d-flex flex-wrap gap-2">
                <span>
                  <i className="bi bi-clock"></i>{" "}
                  {test.duration ? `${test.duration} min` : "No Limit"}
                </span>
                <span>
                  <i className="bi bi-bar-chart"></i> Difficulty:{" "}
                  {test.difficulty}
                </span>
                <span>
                  <i className="bi bi-clipboard-check"></i> Marks:{" "}
                  {test.totalMarks}
                </span>
              </div>
            </div>
          </div>

          {/* View Result Button */}
          <div className="col-12 col-md-12 text-md-end mt-2">
            <button
              className="btn btn-primary w-100"
              onClick={() => navigate(`/rules/${test.id}`)}
            >
              Attempt Test
            </button>
          </div>
        </div>
      ))}

      <div className="text-center text-primary">
        <Link to={"/testslist/" + groupId}>more</Link>
      </div>
    </div>
  );
};

export default SimilarTest;
