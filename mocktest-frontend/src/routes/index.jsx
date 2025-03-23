import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { AuthProvider } from "../context/AuthProvider";

import TestGroupsPage from "../pages/TestGroupsPage";
import TestsPage from "../pages/TestsPage";
import AddQuestion from "../pages/AddQuestion";
import HomePage from "../pages/HomePage";
import TestsList from "../pages/TestsList";
import RulesPage from "../pages/RulesPage";
import TestAttemptPage from "../pages/TestAttemptPage";
import ResultPage from "../pages/ResultPage";
import RichTextEditor from "../components/common/RichTextEditor";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../pages/NotFound";
import Loader from "../components/common/Loader";
import ResumePage from "../pages/ResumePage";
import CompletedTestPage from "../pages/CompletedTestPage";
const AppRouter = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute element={<HomePage />} />} />

          <Route
            path="/test-groups"
            element={<ProtectedRoute element={<TestGroupsPage />} adminOnly />}
          />
          <Route
            path="/tests/:groupId"
            element={<ProtectedRoute element={<TestsPage />} adminOnly />}
          />

          <Route
            path="/testslist/:categoryId"
            element={<ProtectedRoute element={<TestsList />} />}
          />
          <Route
            path="/rules/:testId"
            element={<ProtectedRoute element={<RulesPage />} />}
          />
          <Route
            path="/attempt/:attemptId"
            element={<ProtectedRoute element={<TestAttemptPage />} />}
          />

          <Route
            path="/addquestions/:testid"
            element={<ProtectedRoute element={<AddQuestion />} adminOnly />}
          />
          <Route
            path="/result/:attemptId"
            element={<ProtectedRoute element={<ResultPage />} />}
          />
          <Route
            path="/resume-test"
            element={<ProtectedRoute element={<ResumePage />} />}
          />
          <Route
            path="/test-completed"
            element={<ProtectedRoute element={<CompletedTestPage />} />}
          />
          <Route path="*" element={<ProtectedRoute element={<NotFound />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRouter;
