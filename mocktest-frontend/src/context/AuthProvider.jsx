import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { getAdminIds } from "../services/adminService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [adminIds, setAdminIds] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Track loading state

  useEffect(() => {
    const fetchAdminIds = async () => {
      try {
        const response = await getAdminIds();
        setAdminIds(response.data.adminIds || []); // ✅ Ensure it's an array
      } catch (error) {
        setAdminIds([]); // ✅ Avoid undefined
      }
    };

    const fetchUser = () => {
      const token = Cookies.get("user-details");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUser(decoded.user);
        } catch (error) {
          console.error("Invalid token", error);
          setUser(null);
        }
      }
    };

    const initializeAuth = async () => {
      await fetchAdminIds();
      fetchUser();
      setLoading(false); // ✅ Mark as loaded
    };

    initializeAuth();
  }, []);

  const isAdmin = user && adminIds.map(String).includes(String(user.userId));

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isAdmin, adminIds, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
