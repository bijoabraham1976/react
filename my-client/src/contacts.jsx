import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ContactForm() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [contacts, setContacts] = useState([]);

  const [form, setForm] = useState({
    Id: null,
    Name: "",
    Email: "",
    CountryId: "",
    StateId: "",
    Sex: "",
    Address: "",
    Dob: null,
    Covid: false // <-- Added
  });

  // Load countries & contacts on mount
  useEffect(() => {
    axios.get("http://localhost:5000/api/countries")
      .then(res => setCountries(res.data))
      .catch(err => console.error("Error fetching countries:", err));

    loadContacts();
  }, []);

  const loadContacts = () => {
    axios.get("http://localhost:5000/api/contacts")
      .then(res => setContacts(res.data))
      .catch(err => console.error("Error fetching contacts:", err));
  };

  // Load states when country changes
  useEffect(() => {
    if (form.CountryId) {
      axios.get(`http://localhost:5000/api/states/${form.CountryId}`)
        .then(res => setStates(res.data));
    } else {
      setStates([]);
    }
  }, [form.CountryId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : (name === "CountryId" || name === "StateId"
              ? value === "" ? "" : parseInt(value, 10)
              : value)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: form.Name,
      email: form.Email,
      countryId: form.CountryId,
      stateId: form.StateId,
      countryName:
        countries.find(c => c.countryId === form.CountryId)?.countryName || "",
      stateName:
        states.find(s => s.stateId === form.StateId)?.stateName || "",
      sex: form.Sex,
      dob: form.Dob ? form.Dob.toISOString().split("T")[0] : null,
      address: form.Address,
      covid: form.Covid // <-- Added
    };

    console.log("Submitting payload:", payload);

    if (form.Id) {
      axios.put(`http://localhost:5000/api/contacts/${form.Id}`, { ...payload, id: form.Id })
        .then(res => {
          console.log("Updated:", res.data);
          loadContacts();
          resetForm();
        })
        .catch(err => {
          console.error("Update error:", err.response?.data || err);
        });
    } else {
      axios.post("http://localhost:5000/api/contacts/add", payload)
        .then(res => {
          console.log("Saved:", res.data);
          loadContacts();
          resetForm();
        })
        .catch(err => {
          console.error("Add error:", err.response?.data || err);
        });
    }
  };

  const handleEdit = (contact) => {
    setForm({
      Id: contact.id,
      Name: contact.name,
      Email: contact.email,
      CountryId: contact.countryId || "",
      StateId: contact.stateId || "",
      Sex: contact.sex,
      Address: contact.address,
      Dob: contact.dob ? new Date(contact.dob) : null,
      Covid: contact.covid ?? false // <-- Added
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;

    axios.delete(`http://localhost:5000/api/contacts/${id}`)
      .then(() => loadContacts())
      .catch(err => console.error("Delete contact error:", err.response?.data || err.message));
  };

  const resetForm = () => {
    setForm({
      Id: null,
      Name: "",
      Email: "",
      CountryId: "",
      StateId: "",
      Sex: "",
      Address: "",
      Dob: null,
      Covid: false
    });
  };

  return (
    <div>
      <Navbar />
      <div className="p-8 max-w-5xl mx-auto bg-white">
        <h2 className="text-2xl font-bold mb-4">{form.Id ? "Edit Contact" : "Add Contact"}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white shadow-md p-6 rounded-lg">

          <input
            type="text"           
            name="Name"
            placeholder="Name"
            value={form.Name}
            onChange={handleChange}
            className="border p-3 rounded w-full"
            required
          />

          <input
            type="email"
            name="Email"
            placeholder="Email"
            value={form.Email}
            onChange={handleChange}
            className="border p-3 rounded w-full"
            required
          />

          {/* Country Dropdown */}
          <select
            name="CountryId"
            value={form.CountryId}
            onChange={handleChange}
            className="border p-3 rounded w-full"
            required
          >
            <option value="">Select Country</option>
            {countries.map(c => (
              <option key={c.countryId} value={c.countryId}>
                {c.countryName}
              </option>
            ))}
          </select>

          {/* State Dropdown */}
          <select
            name="StateId"
            value={form.StateId}
            onChange={handleChange}
            className="border p-3 rounded w-full"
            required
          >
            <option value="">Select Province</option>
            {states.map(s => (
              <option key={s.stateId} value={s.stateId}>
                {s.stateName}
              </option>
            ))}
          </select>

          {/* Sex Radio */}
          <div className="flex items-center space-x-6 col-span-1 md:col-span-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="Sex"
                value="Male"
                checked={form.Sex === "Male"}
                onChange={handleChange}
                required
              />
              <span>Male</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="Sex"
                value="Female"
                checked={form.Sex === "Female"}
                onChange={handleChange}
                required
              />
              <span>Female</span>
            </label>
          </div>

          {/* Covid Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="Covid"
              checked={form.Covid}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <label className="font-semibold">Covid</label>
          </div>

          {/* Date of Birth */}
          <div  className="col-span-1 md:col-span-2">
            <label className="block mb-1 font-semibold">Date of Birth</label>
            <DatePicker
              selected={form.Dob ? new Date(form.Dob) : null}
              onChange={(date) => setForm({ ...form, Dob: date })}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select Date of Birth"
              className="border p-3 rounded w-full"
              maxDate={new Date()}
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
            />
          </div>

          {/* Address */}
          <textarea
            name="Address"
            placeholder="Address"
            value={form.Address}
            onChange={handleChange}
            className="border p-3 rounded w-full col-span-1 md:col-span-2" 
            rows="2"
          />

          {/* Save / Cancel Button */}
          <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-4">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
            >
              {form.Id ? "Update" : "Save"}
            </button>
            {form.Id && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 text-white py-2 px-6 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Contact List */}
        <h2 className="text-2xl font-bold mt-8 mb-4">Contact List</h2>
        <div className="overflow-x-auto">
  <table className="w-full border-collapse border border-gray-300 text-sm"></table>
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Country</th>
              <th className="border p-2">Province</th>
              <th className="border p-2">Sex</th>
              <th className="border p-2">Covid</th>
              <th className="border p-2">DOB</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(c => (
              <tr key={c.id}>
                <td className="border p-2">{c.name}</td>
                <td className="border p-2">{c.email}</td>
                <td className="border p-2">{c.countryName}</td>
                <td className="border p-2">{c.stateName}</td>
                <td className="border p-2">{c.sex}</td>
                <td className="border p-2">{c.covid ? "Yes" : "No"}</td>
                <td className="border p-2">{c.dob ? new Date(c.dob).toLocaleDateString() : ""}</td>
                <td className="border p-2">{c.address}</td>
                <td className="border p-2">
  <div className="flex space-x-2">
    <button
      onClick={() => handleEdit(c)}
      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
    >
      Edit
    </button>
    <button
      onClick={() => handleDelete(c.id)}
      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
    >
      Delete
    </button>
  </div>
</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
