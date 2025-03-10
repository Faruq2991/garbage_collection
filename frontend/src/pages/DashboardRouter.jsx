import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import UserDashboard from "./UserDashboard";
import CollectorDashboard from "./CollectorDashboard";

function DashboardRouter() {
  const user = useAuthStore((state) => state.user);
  
  // If user data is not available yet, you could show a loading state
  if (!user) {
    return <div className="p-4">Loading dashboard...</div>;
  }
  
  return (
    <>
      {user.role === "user" ? <UserDashboard /> : <CollectorDashboard />}
    </>
  );
}

export default DashboardRouter;