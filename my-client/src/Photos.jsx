import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

export default function PhotoForm() {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [photos, setPhotos] = useState([]);

  // Load photos on mount
  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/photos");
      setPhotos(res.data);
    } catch (err) {
      console.error("Load error:", err.response?.data || err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/api/photos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setName("");
      setFile(null);
      e.target.reset(); // clears file input
      loadPhotos(); // reload grid
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/photos/${id}`);
      loadPhotos();
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
    }
  };

  return (
    <div>
      <Navbar />
      {/* Upload Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white shadow rounded space-y-4 max-w-md mx-auto"
      >
        <input
          type="text"
          placeholder="Photo Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded w-full"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </form>

      {/* Photo Grid */}
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Photo Gallery</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Thumbnail</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Extension</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {photos.map((p) => (
              <tr key={p.id}>
                <td className="border p-2 text-center">
                  <img
                    src={`http://localhost:5000/Photos/${p.name}${p.extension}`}
                    alt={p.name}
                    width="50"
                    height="50"
                    className="object-cover"
                  />
                </td>
                <td className="border p-2">{p.name}</td>
                <td className="border p-2">{p.extension}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
