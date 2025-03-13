// UserDashboard.jsx
import API from "../api/api"; 
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

  const [userLocation, setUserLocation] = useState(null);
  const [collectors, setCollectors] = useState([]);

useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => console.error("Error getting location:", error),
      { enableHighAccuracy: true }
    );
  }
}, []);

const fetchNearbyCollectors = async () => {
  if (!userLocation) return;
  
  try {
    const response = await API.get("/collectors/nearby/", {
      params: {
        user_lat: userLocation.latitude,
        user_lon: userLocation.longitude,
      },
    });

    console.log("Nearby Collectors Response:", response.data);
    setCollectors(response.data.nearby_collectors);
  } catch (error) {
    console.error("Error fetching nearby collectors:", error);
  }
};


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
            <p><strong>Waste Type:</strong> {req.wasteType}</p>
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

    <div className="mt-6">
      <h2 className="text-xl font-bold">Nearby Collectors</h2>
      <button 
        onClick={fetchNearbyCollectors} 
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Find Nearby Collectors
      </button>
      <ul className="mt-4">
        {collectors.map((collector) => (
          <li key={collector.id} className="border p-2 bg-gray-100 rounded shadow">
            {collector.name} - {collector.distance} km away
          </li>
        ))}
      </ul>
    </div>
  </div>
);

}

export default UserDashboard;
