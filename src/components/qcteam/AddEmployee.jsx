import React, { useState, useEffect } from "react";
import { CheckCircle, Eye, EyeOff } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { userAPI } from "../../api/userAPI";

const AddEmployee = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const existingUser = location.state?.user || null;

  const isEditMode = !!existingUser;

  const [formData, setFormData] = useState({
    username: "",
    password: "vbsllp",
    email: "",
    role: "",
    location: "",
    tlemail: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Prefill data when editing
  useEffect(() => {
    if (existingUser) {
      setFormData({
        username: existingUser.username || "",
        password: "",
        email: existingUser.email || "",
        role: existingUser.role || "",
        location: existingUser.location || "",
        tlemail: existingUser.tlEmail || "",
      });
    }
  }, [existingUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //Reset Password
  const handleResetPassword = async () => {
    if (!formData.email) return alert("User email not found!");

    try {
      await userAPI.resetPassword({ email: formData.email });
      alert("Password has been reset successfully!");
      setFormData((prev) => ({ ...prev, password: "vbsllp" }));
    } catch (err) {
      console.error("Failed to reset password:", err);
      alert("Failed to reset password. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.username ||
      !formData.email ||
      !formData.role ||
      !formData.location ||
      (!isEditMode && !formData.password)
    ) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        location: formData.location,
        tlEmail: formData.tlemail || "",
      };

      if (!isEditMode) {
        // Add new user
        payload.password = formData.password;
        await userAPI.addUser(payload);
      } else {
        // Edit existing user
        await userAPI.editUser(existingUser.id, payload);
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        navigate("/team");
      }, 2500);
    } catch (err) {
      console.error(
        isEditMode ? "Failed to edit user:" : "Failed to add user:",
        err
      );
      alert(`Failed to ${isEditMode ? "edit" : "add"} user. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEditMode
              ? "Employee Updated Successfully"
              : "Added Employee Successfully"}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white-50">
      <div className="max-w-2xl mx-auto mt-12 bg-white rounded-lg border-t-4 border-purple-600 shadow-sm">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-normal text-gray-800 mb-4">
              {isEditMode ? "Edit Employee" : "Add Employee"}
            </h1>
            {isEditMode && (
              <button
                type="button"
                className="px-4 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700"
                onClick={handleResetPassword} // or your reset logic
              >
                Reset Password
              </button>
            )}
          </div>

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
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

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
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

          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
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
              <option value="L1TEAM">L1</option>
              <option value="QCTEAM">QCTEAM</option>
              <option value="L1TL">L1 TL</option>
              <option value="LCTL">QC TL</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
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

          {/* TL Email */}
          <div>
            <label
              htmlFor="tlemail"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              TL Email
            </label>
            <input
              id="tlemail"
              name="tlemail"
              type="email"
              value={formData.tlemail}
              onChange={handleChange}
              placeholder="Enter TL's Email"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-8 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400"
            >
              {loading
                ? "Processing..."
                : isEditMode
                ? "Update Employee"
                : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
