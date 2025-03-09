import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function Navbar() {
  const { token, clearAuth } = useAuthStore();

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <div className="flex space-x-4">
        <Link to="/">Home</Link>
        {token ? (
          <>
            <Link to="/request">Request Pickup</Link>
            <Link to="/dashboard">Dashboard</Link>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
      {token && (
        <button
          onClick={clearAuth}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      )}
    </nav>
  );
}

export default Navbar;
