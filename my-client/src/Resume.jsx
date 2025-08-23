import { useEffect, useState } from "react";
import axios from "axios";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

export default function Resume() {
  const [contacts, setContacts] = useState([]);
  const [contactId, setContactId] = useState("");
  const [description, setDescription] = useState("");

  // Load contacts
  useEffect(() => {
    axios.get("http://localhost:5000/api/resume/contacts")
      .then(res => setContacts(res.data))
      .catch(err => console.error("Error loading contacts:", err));
  }, []);

  // TipTap editor setup
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: true }),
      Image
    ],
    content: "",
    onUpdate: ({ editor }) => setDescription(editor.getHTML()),
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }
  
    console.log("Selected file:", file);
  
    const formData = new FormData();
    formData.append("file", file); // must match backend param name
  
    try {
      const res = await axios.post("http://localhost:5000/api/upload/uploadfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      console.log("Response from backend:", res.data);
  
      const fileUrl = res.data.url; // inside try, res exists
      const fileName = file.name;
      console.log("File uploaded successfully:", fileName, fileUrl);
  
      // Insert as a link in TipTap
      editor.chain().focus().insertContent(
        `<p><a href="${fileUrl}" target="_blank" rel="noopener noreferrer">${fileName}</a></p>`
      ).run();
  
    } catch (err) {
      if (err.response) {
        console.error("Backend responded with status:", err.response.status);
        console.error("Response data:", err.response.data);
      } else if (err.request) {
        console.error("No response received. Request:", err.request);
      } else {
        console.error("Axios error:", err.message);
      }
      alert("File upload failed");
    }
  };
  

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = res.data.url;
      editor.chain().focus().setImage({ src: imageUrl }).run();
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed");
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contactId) return alert("Please select a contact");

    try {
      await axios.post("http://localhost:5000/api/resume", {
        contactId,
        description,
      });
      alert("Resume saved!");
      setContactId("");
      setDescription("");
      editor?.commands.setContent("");
    } catch (err) {
      console.error(err);
      alert("Error saving resume");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add Resume</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contact Selection */}
        <div>
          <label className="block font-medium mb-1">Select Contact</label>
          <select
            className="border rounded p-2 w-full"
            value={contactId}
            onChange={(e) => setContactId(e.target.value)}
          >
            <option value="">-- Select Contact --</option>
            {contacts.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Editor with Toolbar */}
        <div>
          <label className="block font-medium mb-1">Resume Description</label>

          {editor && (
            <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-50 border rounded">
              {/* Bold */}
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`px-2 py-1 rounded ${editor.isActive("bold") ? "bg-blue-200" : "bg-white"}`}
              >
                Bold
              </button>

              {/* Italic */}
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`px-2 py-1 rounded ${editor.isActive("italic") ? "bg-blue-200" : "bg-white"}`}
              >
                Italic
              </button>

              {/* Image Upload */}
              <label className="px-2 py-1 bg-white border rounded cursor-pointer">
                Image…
                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
              </label>

              {/* Link Insert */}
              <button
                type="button"
                onClick={() => {
                  const url = prompt("Enter URL");
                  if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
                }}
                className="px-2 py-1 bg-white border rounded"
              >
                Link
              </button>

              {/* Link Remove */}
              <button
                type="button"
                onClick={() => editor.chain().focus().unsetLink().run()}
                className="px-2 py-1 bg-white border rounded"
              >
                Unlink
              </button>
              <label className="px-2 py-1 bg-white border rounded cursor-pointer">
  Upload File…
  <input
    type="file"
    name="file"
    hidden
    onChange={handleFileUpload}
  />
</label>

            </div>
          )}

          {/* Editor Content */}
          <div className="border rounded p-2 min-h-[200px]">
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Resume
        </button>
      </form>
    </div>
  );
}
