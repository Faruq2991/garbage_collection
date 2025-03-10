// UserDashboard.jsx
import { useEffect, useState } from "react";
import { getUserRequests } from "../api/api";
import { useAuthStore } from "../store/authStore";

function UserDashboard() {
  const [requests, setRequests] = useState([]);
  const token = useAuthStore((state) => state.token);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      console.warn("Token is missing. Skipping API call.");
      return;
    }
    const fetchData = async () => {
      try {
        const data = await getUserRequests(token);
        console.log("Fetched User Requests:", data);
        setRequests(data);
      } catch (err) {
        setError("Failed to fetch requests.");
      }
    };
    fetchData();
  }, [token]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Dashboard</h2>
      {error && <p className="text-red-500">{error}</p>}
      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li key={req.id} className="border p-4 bg-white rounded shadow">
              <p><strong>ID:</strong> {req.id}</p>
              <p><strong>Location:</strong> {req.location}</p>
              <p><strong>Status:</strong> {req.status}</p>
              <p><strong>Description:</strong> {req.description}</p>
              {req.status === "completed" && (
                <div className="mt-2 bg-green-100 p-2 rounded">
                  <p className="text-green-800">This request has been completed</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserDashboard;
