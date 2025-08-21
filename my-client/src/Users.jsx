import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ FirstName: "", LastName: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get("http://localhost:5000/api/user")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  };

  const saveUser = () => {
    if (!form.FirstName.trim() || !form.LastName.trim()) {
      alert("Both First Name and Last Name are required.");
      return;
    }

    if (editingId) {
      axios
        .put(`http://localhost:5000/api/user/${editingId}`, form, {
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
          setUsers(users.map((u) => (u.id === editingId ? res.data : u)));
          setForm({ FirstName: "", LastName: "" });
          setEditingId(null);
        })
        .catch((err) => console.error("Error updating:", err));
    } else {
      axios
        .post("http://localhost:5000/api/user", form, {
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
          setUsers([...users, res.data]);
          setForm({ FirstName: "", LastName: "" });
        })
        .catch((err) => console.error("Error adding:", err));
    }
  };

  const editUser = (user) => {
    setForm({
      FirstName: user.FirstName || user.firstName,
      LastName: user.LastName || user.lastName,
    });
    setEditingId(user.id);
  };

  const deleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`http://localhost:5000/api/user/${id}`)
        .then(() => {
          setUsers(users.filter((u) => u.id !== id));
        })
        .catch((err) => console.error("Error deleting:", err));
    }
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-red-800">Users</h1>

        {/* Form */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="First Name"
            value={form.FirstName}
            onChange={(e) =>
              setForm({ ...form, FirstName: e.target.value })
            }
            className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={form.LastName}
            onChange={(e) =>
              setForm({ ...form, LastName: e.target.value })
            }
            className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={saveUser}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition"
          >
            {editingId ? "Update" : "Add"}
          </button>
        </div>

        {/* Users List */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((u) => (
            <div
              key={u.id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {u.firstName || u.FirstName} {u.lastName || u.LastName}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => editUser(u)}
                  className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md text-sm font-medium transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteUser(u.id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
