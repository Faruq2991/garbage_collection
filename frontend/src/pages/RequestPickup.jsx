import { useState } from "react";
import { createPickupRequest } from "../api/api"; 
import { useAuthStore } from "../store/authStore";

function RequestPickup() {
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [wasteType, setWasteType] = useState(""); // ✅ New state for waste type
  const [error, setError] = useState("");
  const user = useAuthStore((state) => state.user); // Add this line
  const token = useAuthStore((state) => state.token);
  

  if (!user || user.role !== "user") {
    return <p className="text-red-500">Only users can request pickups.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPickupRequest({ location, description, waste_type: wasteType }, token); // ✅ Include wasteType
      setLocation("");
      setDescription("");
      setWasteType(""); // ✅ Reset wasteType after submission
    } catch (err) {
      setError("Failed to submit request.");
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Request Pickup</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Waste Type" // ✅ New input for waste type
          value={wasteType}
          onChange={(e) => setWasteType(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Submit Request
        </button>
      </form>
    </div>
  );
}

export default RequestPickup;
