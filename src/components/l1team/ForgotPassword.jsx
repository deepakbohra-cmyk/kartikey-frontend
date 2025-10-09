import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { userAPI } from "../../api/userAPI";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const { user } = useAuth(); // user should have email & id
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    setLoading(true);

    try {
      await userAPI.changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });
      alert("Password changed successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Password update failed:", err);
      alert(
        err?.response?.data?.message ||
          "Failed to update password. Please check your old password and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md rounded-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Change Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          {/* Old Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
            <div className="relative">
              <input
                type={showOld ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                className="w-full p-3 pr-12 border border-gray-300 rounded-md"
                placeholder="Enter old password"
                required
              />
              <button
                type="button"
                onClick={() => setShowOld((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
              >
                {showOld ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full p-3 pr-12 border border-gray-300 rounded-md"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
              >
                {showNew ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 pr-12 border border-gray-300 rounded-md"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
              >
                {showConfirm ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
