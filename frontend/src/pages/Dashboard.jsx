import { useEffect, useState } from "react";
import { getPickupRequests, acceptRequest, completeRequest } from "../api/api";

import { useAuthStore } from "../store/authStore";

function Dashboard() {
  const [requests, setRequests] = useState([]);
  const token = useAuthStore((state) => state.token);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRequests(token);
        setRequests(data);
      } catch (err) {
        setError("Failed to fetch requests.");
      }
    };
    fetchData();
  }, [token]);

  const handleAccept = async (id) => {
    try {
      await acceptRequest(id, token);
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: "accepted" } : req
        )
      );
    } catch (err) {
      setError("Failed to accept request.");
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeRequest(id, token);
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: "completed" } : req
        )
      );
    } catch (err) {
      setError("Failed to mark request as complete.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Collector Dashboard</h2>
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
              <div className="mt-2 space-x-2">
                {req.status === "pending" && (
                  <button
                    onClick={() => handleAccept(req.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Accept
                  </button>
                )}
                {req.status === "accepted" && (
                  <button
                    onClick={() => handleComplete(req.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Complete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
