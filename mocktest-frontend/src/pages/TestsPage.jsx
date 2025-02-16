import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createTest, fetchTestsByGroup } from "../services/testService.";

const TestsPage = () => {
  const { groupId } = useParams(); // Get test_group_id from URL
  const [tests, setTests] = useState([]);
  const [newTestName, setNewTestName] = useState("");

  useEffect(() => {
    loadTests();
  }, [groupId]);

  const loadTests = async () => {
    try {
      const testsData = await fetchTestsByGroup(groupId);
      setTests(testsData);
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };

  const handleCreateTest = async () => {
    if (!newTestName) return alert("Enter test name");

    try {
      await createTest({ name: newTestName, group_id: groupId });
      setNewTestName("");
      loadTests();
    } catch (error) {
      console.error("Error creating test:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Tests in Group {groupId}</h2>

      {/* Create Test */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="New Test Name"
          value={newTestName}
          onChange={(e) => setNewTestName(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={handleCreateTest}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Create Test
        </button>
      </div>

      {/* List of Tests */}
      <ul>
        {tests.map((test) => (
          <li key={test.id} className="mb-2">
            {test.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestsPage;
