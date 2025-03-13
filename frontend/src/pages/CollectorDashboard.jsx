import { useEffect, useState } from "react";
import API from "../api/api"; 
import { getPickupRequests, acceptRequest, completeRequest } from "../api/api";
import { useAuthStore } from "../store/authStore";

function CollectorDashboard() {
  const [requests, setRequests] = useState([]);
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) {
      console.warn("Token is missing. Skipping API call.");
      return;
    }

    const fetchData = async () => {
      try {
        const data = await getPickupRequests(token);
        console.log("Fetched Collector Requests:", data);
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
      console.log(`Request ${id} accepted.`);
    } catch (err) {
      console.error("Error accepting request:", err);
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
      console.log(`Request ${id} completed.`);
    } catch (err) {
      console.error("Error completing request:", err);
      setError("Failed to mark request as complete.");
    }
  };

  const updateLocation = () => {
    if (!navigator.geolocation) {
      setMessage("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        
        try {
          await API.put(
            "/collectors/update-location/",  
            { latitude, longitude },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json", 
              },
            }
          );
          setMessage("Location updated successfully!");
        } catch (error) {
          setMessage("Error updating location.");
          console.error(error);
        }
      },
      (error) => {
        setMessage("Failed to get location.");
        console.error(error);
      },
      { enableHighAccuracy: true }
    );
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
              <p><strong>Request Number:</strong> {req.request_number}</p>
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

      <div className="p-4 mt-6">
        <button onClick={updateLocation} className="bg-blue-500 text-white px-4 py-2 rounded">
          Set My Location
        </button>
        {message && <p className="mt-2 text-red-500">{message}</p>}
        {location && <p>Your location: {location.latitude}, {location.longitude}</p>}
      </div>
    </div>
  );
}

export default CollectorDashboard;
