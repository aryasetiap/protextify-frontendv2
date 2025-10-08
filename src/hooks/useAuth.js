import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";

// Custom hook untuk menggunakan Auth Context
const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth hanya bisa digunakan di dalam AuthProvider");
  }

  return context;
};

export default useAuth;
