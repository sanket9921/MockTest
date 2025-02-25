import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TestGroupsPage from "../pages/TestGroupsPage";
import TestsPage from "../pages/TestsPage";
import AddQuestion from "../pages/AddQuestion";
import HomePage from "../pages/HomePage";
import TestsList from "../pages/TestsList";
import RulesPage from "../pages/RulesPage";
import TestAttemptPage from "../pages/TestAttemptPage";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/test-groups" element={<TestGroupsPage />} />
        <Route path="/tests/:groupId" element={<TestsPage />} />
        <Route path="/testslist/:categoryId" element={<TestsList />} />
        <Route path="/rules/:testId" element={<RulesPage />} />
        <Route path="/attempt/:attemptId" element={<TestAttemptPage />} />

        <Route path="/addquestions/:testid" element={<AddQuestion />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
