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

const App = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      {user ? (
        <div className="flex">
          <Sidebar />
          <div className="ml-64 w-full">
            <Navbar />
            <div className="p-6">
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
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
            <ToastContainer position="bottom-right" autoClose={4000} />
    </>
  );
};

export default App;
