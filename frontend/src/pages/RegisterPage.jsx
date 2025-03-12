import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/api";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    country: "", 
    state: "",
    phone: ""
  });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Data:", formData); // Log request data
    
    try {
      await registerUser(formData);
      navigate("/login");
    } catch (error) {
      console.error("FastAPI Error Response:", error.response?.data);
      
      // Ensure errorMsg is always a string
      if (error.response?.data?.detail) {
        setErrorMsg(JSON.stringify(error.response.data.detail)); // Convert to string
      } else {
        setErrorMsg("Registration failed. Please try again.");
      }
    }
  };
  
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded shadow">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <input 
          type="text" 
          name="country"  // ✅ Added name attribute
          placeholder="Country" 
          value={formData.country} 
          onChange={handleChange} 
          className="w-full p-2 mb-4 border rounded"
          required 
        />

        <input 
          type="text" 
          name="state"  // ✅ Added name attribute
          placeholder="State" 
          value={formData.state} 
          onChange={handleChange} 
          className="w-full p-2 mb-4 border rounded"
          required 
        />

        <input 
          type="text" 
          name="phone"  // ✅ Added name attribute
          placeholder="Phone Number" 
          value={formData.phone} 
          onChange={handleChange} 
          className="w-full p-2 mb-4 border rounded"
          required 
        />

        {/* Role Dropdown */}
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        >
          <option value="user">User</option>
          <option value="collector">Collector</option>
        </select>
        
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
          Register
        </button>
        
        {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}
      </form>
    </div>
  );
}

export default RegisterPage;