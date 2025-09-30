import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { l1TeamAPI } from "../../api/l1TeamAPI";
import { useAuth } from "../../contexts/AuthContext";

const L1Form = () => {
  const { user } = useAuth();
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [formData, setFormData] = useState({
    workType: "",
    email: "",
    gid: "",
    decision: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (isChecked && isValidEmail(email)) {
      setFormData((prev) => ({ ...prev, email }));
    } else {
      setFormData((prev) => ({ ...prev, email: "" }));
    }
  }, [isChecked, email]);

  const decisions = [
    "Duplicate",
    "Not Duplicate",
    "Not Sure - Bad Data",
    "Combination of Duplicate & Not Duplicate",
    "Combination of Duplicate & Not Sure",
    "On HoldCombination of Not Duplicate & Not Sure",
    "Not Duplicate - Variant Data Not Available",
    "Not Duplicate - Different Compatibility",
    "Not Duplicate - Different Warranty",
    "Not Duplicate - Attribute Value Not Available",
    "Unpublish",
    "Combination of Duplicate, Not Duplicate & Not Sure",
  ];

  const handleCheckboxChange = (e) => setIsChecked(e.target.checked);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const isValidEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !isChecked ||
      !formData.workType ||
      !formData.gid ||
      !formData.decision ||
      !formData.email
    ) {
      alert(
        "Please fill all required fields and check the email confirmation box."
      );
      return;
    }

    try {
      setLoading(true);
      const res = await l1TeamAPI.createForm(formData); // ✅ direct send
      console.log("Form submitted:", res);
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setIsChecked(false);
        setFormData({
          workType: "",
          gid: "",
          decision: "",
          email: email,
        });
      }, 2000);
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
      alert(
        `Submission failed: ${error.response?.data?.message || error.message}`
      );
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
            Response Recorded
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg border-t-4 border-purple-600 shadow-sm">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <h1 className="text-3xl font-normal text-gray-800 mb-6">L1 Form</h1>

          {/* Email Confirmation Checkbox */}
          <label className="flex items-start space-x-2">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <span className="text-gray-700">
              Record <span className="font-medium text-black">{email}</span> as
              the email to be included with my response.
            </span>
          </label>

          {/* Work Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work type *
            </label>
            <select
              name="workType"
              value={formData.workType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none appearance-none"
              required
            >
              <option value="">Select work type</option>
              <option value="NORMAL">Normal</option>
              <option value="REWORK">Rework</option>
            </select>
          </div>

          {/* GID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GID *
            </label>
            <input
              name="gid"
              value={formData.gid}
              onChange={handleChange}
              placeholder="Enter GID"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          {/* Decision */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Decision *
            </label>
            <select
              name="decision"
              value={formData.decision}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none appearance-none"
              required
            >
              <option value="">Select a decision</option>
              {decisions.map((d, i) => (
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className={`flex items-center px-8 py-2 rounded-md text-white cursor-pointer ${
                isChecked
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!isChecked || loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default L1Form;
