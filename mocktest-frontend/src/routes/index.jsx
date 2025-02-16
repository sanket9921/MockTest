import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TestGroupsPage from "../pages/TestGroupsPage";
import TestsPage from "../pages/TestsPage";
import TestDetailsPage from "../pages/TestDetailsPage";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/test-groups" element={<TestGroupsPage />} />
        <Route path="/tests/:groupId" element={<TestsPage />} />
        <Route path="/addquestions" element={<TestDetailsPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
