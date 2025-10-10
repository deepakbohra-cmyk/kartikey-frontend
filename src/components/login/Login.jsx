// LoginPage.jsx
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login, error: authError, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    try {
      const userData = await login(email, password);
      
      if (!userData) {
        throw new Error("Invalid credentials");
      }
      if(userData.role === "L1TEAM"){
         navigate("/l1form"); 
      }
      else {
        navigate("/qcsheetdata"); 
      }
      
    } catch (err) {
      setLocalError(err.message || "Unexpected error");
    }
  };

  const startGoogleOAuth = () => {
    window.location.href = `${import.meta.env.BASEURL}/oauth2/authorization/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Sign in</h1>
        <p className="text-sm text-gray-500 mb-6">
          Welcome back — sign in to continue.
        </p>

        {/* Google OAuth */}
        <button
          onClick={startGoogleOAuth}
          className="w-full flex items-center justify-center gap-3 py-2 px-4 mb-4 border rounded-xl hover:shadow-sm transition-shadow"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 533.5 544.3"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-hidden
          >
            <path
              d="M533.5 278.4c0-17.7-1.6-35.1-4.7-51.8H272v98h147.4c-6.3 34-24.9 62.8-53 82.1v68h85.6c50.1-46.2 81.5-114.1 81.5-196.3z"
              fill="#4285F4"
            />
            <path
              d="M272 544.3c72.6 0 133.6-24.1 178-65.4l-85.6-68c-23.8 16-54.3 25.4-92.4 25.4-70.9 0-131-47.8-152.4-112.1H31.6v70.6C76.1 486.6 167.6 544.3 272 544.3z"
              fill="#34A853"
            />
            <path
              d="M119.6 322.2c-10.5-31.2-10.5-64.9 0-96.1V155.5H31.6c-41.7 81-41.7 176.6 0 257.6l88-70.9z"
              fill="#FBBC05"
            />
            <path
              d="M272 107.7c39.5-.6 77.6 14.1 106.5 40.7l79.5-79.5C402 24.7 341 0 272 0 167.6 0 76.1 57.7 31.6 155.5l88 70.6C141 155.5 201.1 107.7 272 107.7z"
              fill="#EA4335"
            />
          </svg>
          <span className="text-sm font-medium">Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center" aria-hidden>
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">
              or sign in with email
            </span>
          </div>
        </div>

        {/* Email Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Password</span>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Enter your password"
            />
          </label>

          {(localError || authError) && (
            <div className="text-sm text-red-600">
              {localError || authError}
            </div>
          )}

          <button
            type="submit"
            disabled={authLoading}
            className={`w-full py-2 px-4 rounded-xl text-white font-medium transition ${
              authLoading
                ? "opacity-70 cursor-not-allowed bg-indigo-400"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {authLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
