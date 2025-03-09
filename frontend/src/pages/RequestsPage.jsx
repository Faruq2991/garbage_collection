import { useEffect, useState } from "react";
import axios from "axios";

function RequestsPage() {
  const [requests, setRequests] = useState([]);

  // Replace with your actual token logic
  const token = localStorage.getItem("token") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqYW5lZG9lQGV4YW1wbGUuY29tIiwicm9sZSI6ImNvbGxlY3RvciIsImV4cCI6MTc0MTQ3OTU5NX0._k7RKQqdXDKT3OXZ--LXbm9Zrt3qPtQzFrUARltT6XE";

  useEffect(() => {
    axios.get("/api/requests/", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => setRequests(response.data))
    .catch(error => console.error("Error fetching requests:", error));
  }, [token]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pickup Requests</h1>
      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <ul>
          {requests.map((req) => (
            <li key={req.id} className="border p-2 my-2">
              <p>ID: {req.id}</p>
              <p>Location: {req.location}</p>
              <p>Status: {req.status}</p>
              <p>Created At: {new Date(req.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RequestsPage;
