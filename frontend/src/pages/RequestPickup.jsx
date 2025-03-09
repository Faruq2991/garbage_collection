import { useState } from "react";
import { createPickupRequest } from "../api/api";
import { useAuthStore } from "../store/authStore";


function RequestPickup() {
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const token = useAuthStore((state) => state.token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPickupRequest({ location, description }, token);
      setMessage("Request submitted successfully!");
      setLocation("");
      setDescription("");
    } catch (error) {
      setMessage("Failed to submit request.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h2 className="text-2xl font-bold mb-4">Request Garbage Pickup</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded shadow">
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        ></textarea>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Submit Request
        </button>
      </form>
      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
}

export default RequestPickup;
