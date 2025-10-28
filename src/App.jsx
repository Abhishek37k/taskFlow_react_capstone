import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProjectBoard from "./pages/ProjectBoard";
import ProjectDetail from "./pages/ProjectDetail";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      {user ? (
        // Whole page unified dark background
        <div className="flex min-h-screen bg-[#0f172a] text-white">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Section */}
          <div className="ml-64 flex flex-col flex-1 min-h-screen">
            {/* Navbar */}
            <Navbar />

            {/* Page Content */}
            <div className="flex-1">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<ProjectBoard />} />
                <Route path="/project/:projectId" element={<ProjectDetail />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        // Auth pages (login/signup)
        <div className="flex items-center justify-center min-h-screen bg-[#0f172a] text-white">
          <div className="w-[90%]   bg-gray-800 rounded-xl shadow-lg">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        toastClassName="bg-gray-800 text-white rounded-md shadow"
      />
    </BrowserRouter>
  );
};

export default App;
