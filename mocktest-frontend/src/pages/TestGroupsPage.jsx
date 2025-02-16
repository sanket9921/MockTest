import { useEffect, useState } from "react";
import { fetchTestGroups, createTestGroup } from "../services/testGroupService";
import { useNavigate } from "react-router-dom";

const TestGroupsPage = () => {
  const [testGroups, setTestGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadTestGroups();
  }, []);

  const loadTestGroups = async () => {
    try {
      const groups = await fetchTestGroups();
      setTestGroups(groups);
    } catch (error) {
      console.error("Error fetching test groups:", error);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName) return alert("Enter group name");

    try {
      await createTestGroup({ name: newGroupName });
      setNewGroupName("");
      loadTestGroups();
    } catch (error) {
      console.error("Error creating test group:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Test Groups</h2>

      {/* Create Test Group */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="New Test Group Name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={handleCreateGroup}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Create Group
        </button>
      </div>

      {/* List of Test Groups */}
      <ul>
        {testGroups.map((group) => (
          <li
            key={group.id}
            className="cursor-pointer text-blue-600 underline mb-2"
            onClick={() => navigate(`/tests/${group.id}`)}
          >
            {group.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestGroupsPage;
