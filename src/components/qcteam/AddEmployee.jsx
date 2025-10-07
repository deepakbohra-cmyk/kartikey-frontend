import React, { useState } from "react";
import { CheckCircle, Eye, EyeOff } from "lucide-react";

const L1Form = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role: "",
    location: "",
    tlemail: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // <-- new

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.username ||
      !formData.password ||
      !formData.email ||
      !formData.role ||
      !formData.location ||
      !formData.tlemail
    ) {
      alert("Please fill all required fields.");
      return;
    }

    console.log("Form submitted:", formData);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        username: "",
        password: "",
        email: "",
        role: "",
        location: "",
        tlemail: "",
      });
      setShowPassword(false);
    }, 4000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Added Employee Successfully
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white-50">
      <div className="max-w-2xl mx-auto mt-12 bg-white rounded-lg border-t-4 border-purple-600 shadow-sm">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <h1 className="text-3xl font-normal text-gray-800 mb-6">Add Employee</h1>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username *
            </label>
            <input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter Username"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          {/* Password field with show/hide toggle */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="w-full p-3 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-600" /> : <Eye className="w-5 h-5 text-gray-600" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none appearance-none"
              required
            >
              <option value="" disabled>
                -- Select Role --
              </option>
              <option value="ADMIN">ADMIN</option>
              <option value="L1">L1</option>
              <option value="QA">QA</option>
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none appearance-none"
              required
            >
              <option value="" disabled>
                -- Select Location --
              </option>
              <option value="Meerut">Meerut</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>
          </div>

          <div>
            <label htmlFor="tlemail" className="block text-sm font-medium text-gray-700 mb-2">
              TL-Email *
            </label>
            <input
              id="tlemail"
              name="tlemail"
              type="email"
              value={formData.tlemail}
              onChange={handleChange}
              placeholder="Enter TL's Email"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-center pt-6">
            <button type="submit" className="flex items-center px-8 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default L1Form;
