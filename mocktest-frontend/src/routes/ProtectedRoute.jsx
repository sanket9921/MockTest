import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import Loader from "../components/common/Loader";

const ProtectedRoute = ({ element, adminOnly }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = "https://college.bytrait.com/"; // Redirects only after authentication check
    }
  }, [loading, isAuthenticated]);

  // ✅ Prevent redirecting while loading
  if (loading) {
    return <Loader />; // Replace with a loading spinner if needed
  }

  if (!isAuthenticated) {
    return null; // Avoid rendering anything while redirecting
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/not-found" replace />;
  }

  return element;
};

export default ProtectedRoute;
