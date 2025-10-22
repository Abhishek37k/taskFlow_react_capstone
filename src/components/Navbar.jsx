import React from "react";
import { useSelector } from "react-redux";
import { FaUser } from "react-icons/fa";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="bg-gray-800 text-white h-16 flex items-center justify-center shadow-md px-6">
      <h2 className="text-lg font-semibold flex items-center gap-2">
      <FaUser/>  Welcome, {user?.email}
      </h2>
    </div>
  );
};

export default Navbar;
