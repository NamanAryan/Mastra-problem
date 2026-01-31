import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function AuthCallback() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // If authentication is complete and user exists, redirect to dashboard
    if (!loading && user) {
      navigate("/");
    }
    // If authentication is complete and no user, redirect to login
    else if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-[#00ff88] text-lg mb-4">
          Processing authentication...
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ff88] mx-auto"></div>
      </div>
    </div>
  );
}
