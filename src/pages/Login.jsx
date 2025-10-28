import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authThunks";
import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLogIn } from "react-icons/fi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="flex justify-center items-center h-screen bg-[#0f172a] text-white px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gray-800/70 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-700"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <FiLogIn className="text-2xl text-blue-400" />
          <h2 className="text-2xl font-bold text-blue-400">Welcome Back</h2>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-900/30 p-2 rounded mb-4 text-center">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 block mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 text-white rounded-md border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500/20 outline-none"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 text-white rounded-md border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500/20 outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition text-white font-semibold py-2 rounded-lg shadow-lg"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-sm text-gray-400 text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
