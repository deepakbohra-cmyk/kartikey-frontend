import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { userAPI } from "../../api/userAPI";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const { user } = useAuth();
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
        email: user.email,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      alert("Password changed successfully!");
      navigate("/forgotpassword");
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

  const renderPasswordInput = (label, name, show, toggleShow) => (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={`Enter ${label.toLowerCase()}`}
          className="w-full p-3 pr-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          required
        />
        <button
          type="button"
          onClick={toggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Change Password</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {renderPasswordInput("Old Password", "oldPassword", showOld, () => setShowOld((p) => !p))}
          {renderPasswordInput("New Password", "newPassword", showNew, () => setShowNew((p) => !p))}
          {renderPasswordInput(
            "Confirm Password",
            "confirmPassword",
            showConfirm,
            () => setShowConfirm((p) => !p)
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
