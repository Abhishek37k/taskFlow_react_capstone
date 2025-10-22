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
    <div className="bg-gray-900 text-white h-screen w-64 flex flex-col p-5 fixed">
      <h1 className="text-2xl font-bold mb-8 text-center">Project Hub</h1>
      <nav className="flex flex-col gap-4">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-lg ${
              isActive ? "bg-gray-700" : "hover:bg-gray-800"
            }`
          }
        >
          <FiHome />Your Dashboard
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-lg ${
              isActive ? "bg-gray-700" : "hover:bg-gray-800"
            }`
          }
        >
          <FiFolder />All Users Projects
        </NavLink>

       
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-2 p-2 rounded-lg hover:bg-red-600"
      >
        <FiLogOut /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
