import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "../context/AuthProvider";
import TestGroupsPage from "../pages/TestGroupsPage";
import TestsPage from "../pages/TestsPage";
import AddQuestion from "../pages/AddQuestion";
import HomePage from "../pages/HomePage";
import TestsList from "../pages/TestsList";
import RulesPage from "../pages/RulesPage";
import TestAttemptPage from "../pages/TestAttemptPage";
import ResultPage from "../pages/ResultPage";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../pages/NotFound";
import ResumePage from "../pages/ResumePage";
import CompletedTestPage from "../pages/CompletedTestPage";
import TestAnalyticsPage from "../pages/TestAnalyticsPage";
import Navbar from "../components/Header";
import About from "../pages/AboutPage";
import Contact from "../pages/ContactPage";
import Footer from "../components/footer";

const AppContent = () => {
  const location = useLocation();

  // Define pages where Navbar and Footer should NOT be shown
  const hiddenRoutes = ["/attempt/:attemptId"];

  // Check if the current path matches any hidden routes
  const hideNavAndFooter = hiddenRoutes.some((route) =>
    location.pathname.startsWith(
      route.replace(":attemptId", "").replace(":testId", "")
    )
  );

  return (
    <>
      {!hideNavAndFooter && <Navbar />}
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
        <Route
          path="/test-analytics"
          element={<ProtectedRoute element={<TestAnalyticsPage />} />}
        />
        <Route path="/about" element={<ProtectedRoute element={<About />} />} />
        <Route
          path="/contact"
          element={<ProtectedRoute element={<Contact />} />}
        />
        <Route path="*" element={<ProtectedRoute element={<NotFound />} />} />
      </Routes>
      {!hideNavAndFooter && <Footer />}
    </>
  );
};

const AppRouter = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default AppRouter;
