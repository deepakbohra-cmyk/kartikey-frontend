import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../components/login/Login";
import Dashboard from "../components/qcteam/Dashboard";
import L1Form from "../components/l1team/L1Form";
import SheetData from "../components/qcteam/SheetData";
import FeedbackForm from "../components/l1team/FeedbackForm";
import GidSearch from "../components/qcteam/GidSearch";
import Team from "../components/qcteam/Team";
import OAuth2Redirect from "../components/login/OAuth2Redirect";
import FeedbackTable from "../components/l1team/FeedbackTable";
import ProtectedRoute from "../components/common/ProtectedRoute";

function AppRoutes() {
  const role = ["L1TEAM" , "QCTEAM" , "ADMIN"]
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={role}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gid"
          element={
            <ProtectedRoute allowedRoles={role}>
              <GidSearch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/l1form"
          element={
            <ProtectedRoute>
              <L1Form />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sheetdata"
          element={
            <ProtectedRoute>
              <SheetData />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedbackform"
          element={
            <ProtectedRoute>
              <FeedbackForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <FeedbackTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <Team />
            </ProtectedRoute>
          }
        />
        <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
        <Route
          path="/unauthorized"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="text-6xl text-red-500 mb-4">🚫</div>
                <h1 className="text-3xl font-bold text-red-600 mb-2">
                  Access Denied
                </h1>
                <p className="text-gray-600 mb-4">
                  You don't have permission to access this page.
                </p>
                <button
                  onClick={() => window.history.back()}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Go Back
                </button>
              </div>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default AppRoutes;
