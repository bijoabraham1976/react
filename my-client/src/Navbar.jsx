import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Here you could also clear auth tokens from localStorage
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      {/* Left Menu */}
      <div className="flex space-x-4">
        <Link to="/users" className="hover:bg-blue-700 px-3 py-2 rounded">
          Users
        </Link>
        <Link to="/contact" className="hover:bg-blue-700 px-3 py-2 rounded">
          Contact
        </Link>
        <Link to="/resume" className="hover:bg-blue-700 px-3 py-2 rounded">
          Resume
        </Link>

        <Link to="/photo" className="hover:bg-blue-700 px-3 py-2 rounded">
          Photos
        </Link>
      </div>

      {/* Right Logout */}
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
      >
        Logout
      </button>
    </nav>
  );
}
