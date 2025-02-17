import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TestGroupsPage from "../pages/TestGroupsPage";
import TestsPage from "../pages/TestsPage";
import AddQuestion from "../pages/AddQuestion";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/test-groups" element={<TestGroupsPage />} />
        <Route path="/tests/:groupId" element={<TestsPage />} />
        <Route path="/addquestions/:testid" element={<AddQuestion />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
