import React from "react";
import { useSelector } from "react-redux";
import { FaUser } from "react-icons/fa";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="bg-gray-800 text-white h-16 flex items-center justify-center shadow-md px-6">
      <h2 className="text-lg font-semibold flex items-center gap-2 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
        <FaUser className="text-blue-400" />
        <span className="truncate max-w-[220px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px]">
          Welcome, {user?.email || "Guest"}
        </span>
      </h2>
    </div>
  );
};

export default Navbar;
