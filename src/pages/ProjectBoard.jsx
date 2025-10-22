import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects } from "../features/projects/projectThunks";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProjectBoard() {
  const { user } = useSelector((state) => state.auth);
  const { projects, loading, error } = useSelector((state) => state.projects);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) dispatch(fetchProjects());
  }, [user]);

  const goToProjectDetail = (projectId) => navigate(`/project/${projectId}`);

  // Framer Motion Variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1, // cards animate one after another
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-gray-900">
      <h1 className="text-3xl font-bold mb-6">All Projects</h1>

      {loading && <p>Loading projects...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {projects.map((project) => (
          <motion.div
            key={project.id}
            variants={cardVariants}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-5 rounded-lg shadow hover:shadow-lg cursor-pointer"
            onClick={() => goToProjectDetail(project.id)}
          >
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p className="text-gray-500 mt-1 text-sm">
              Created by: {project.createdBy === user.uid ? "You" : project.createdBy}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
