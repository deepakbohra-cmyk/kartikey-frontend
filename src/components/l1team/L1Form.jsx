import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { l1TeamAPI } from "../../api/l1TeamAPI";
import { qcTeamAPI } from "../../api/qcTeamAPI";
import { useAuth } from "../../contexts/AuthContext";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const L1Form = () => {
  const { id } = useParams(); // QC form ID (optional)
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const prefilledData = location.state?.formData || {};

  const [formData, setFormData] = useState({
    workType: prefilledData.workType || "",
    gid: prefilledData.gid || "",
    decision: prefilledData.decision || "",
    email: user?.email || "",
  });

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

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

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.workType || !formData.gid || !formData.decision || !formData.email) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      if (id) {
        // ✅ QC user submitting feedback
        const qcData = {
          formId: parseInt(id),
          workType: formData.workType,
          gid: formData.gid,
          decision: formData.decision,
          email: user.email,
        };

        await qcTeamAPI.saveQcForm(qcData);

        // Navigate immediately without showing overlay
        navigate("/qcsheetdata", { replace: true });
        return;
      }

      // ✅ L1 user creating a new form
      await l1TeamAPI.createForm(formData);

      // Show success overlay for L1
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          workType: "",
          gid: "",
          decision: "",
          email: user.email,
        });
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
      alert(`Submission failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // L1 submission overlay
  if (submitted) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">Response Recorded</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg border-t-4 border-purple-600 shadow-sm">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <h1 className="text-3xl font-normal text-gray-800 mb-6">
            {id ? "QC Review Form" : "L1 Submission Form"}
          </h1>

          {/* Work Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work Type *
            </label>
            <select
              name="workType"
              value={formData.workType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none appearance-none"
              required
            >
              <option value="">Select Work Type</option>
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
              <option value="">Select Decision</option>
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
              disabled={loading}
              className={`flex items-center px-8 py-2 rounded-md text-white ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {loading ? "Submitting..." : id ? "Save QC Response" : "Submit Form"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default L1Form;
