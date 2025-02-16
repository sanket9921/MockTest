import { useState } from "react";
import { createTestGroup } from "../services/testGroupService";

const TestGroupForm = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createTestGroup({ name });
      setName("");
      onSuccess(); // Refresh parent component or show success message
    } catch (err) {
      setError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
      <label className="block mb-2 font-semibold">Test Group Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2 border rounded"
        required
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <button
        type="submit"
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Test Group"}
      </button>
    </form>
  );
};

export default TestGroupForm;
