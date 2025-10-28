import React from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiUser, FiLogOut, FiFolder } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/authThunks";

const Sidebar = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white h-screen w-64 flex flex-col p-5 fixed border-r border-gray-700 shadow-xl ">
      <h1 className="text-2xl font-bold mb-10 text-center tracking-wide text-blue-400 drop-shadow-lg">
        Project Hub
      </h1>

      <nav className="flex flex-col gap-3">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-blue-600/20 text-blue-400 shadow-md"
                : "hover:bg-gray-800 hover:text-blue-300"
            }`
          }
        >
          <FiHome className="text-lg" /> Your Dashboard
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-blue-600/20 text-blue-400 shadow-md"
                : "hover:bg-gray-800 hover:text-blue-300"
            }`
          }
        >
          <FiFolder className="text-lg" /> All Users Projects
        </NavLink>

        
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center justify-center gap-2 p-3 rounded-xl bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white transition-all duration-200"
      >
        <FiLogOut className="text-lg" /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
