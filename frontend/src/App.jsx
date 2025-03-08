import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./index.css";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome to Garbage Pickup System</h1>
      <Link to="/request" className="px-4 py-2 bg-blue-600 text-white rounded">Request Pickup</Link>
    </div>
  );
}

function RequestPickup() {
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/requests/", {
        location,
        description,
      }, {
        headers: {
          Authorization: `Bearer YOUR_ACCESS_TOKEN`,
          "Content-Type": "application/json"
        }
      });
      setMessage("Request submitted successfully!");
    } catch (error) {
      setMessage("Error submitting request.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Request Garbage Pickup</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <input 
          type="text" 
          placeholder="Location" 
          className="w-full p-2 mb-2 border rounded"
          value={location} 
          onChange={(e) => setLocation(e.target.value)} 
          required
        />
        <textarea 
          placeholder="Description" 
          className="w-full p-2 mb-2 border rounded"
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required
        />
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Submit</button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/request" element={<RequestPickup />} />
      </Routes>
    </Router>
  );
}