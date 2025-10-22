import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects, addProject } from "../features/projects/projectThunks";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const { projects, loading, error } = useSelector((state) => state.projects);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [newProject, setNewProject] = useState("");

  useEffect(() => {
    if (user) dispatch(fetchProjects(user.uid));
  }, [user]);

  const handleAddProject = () => {
    if (!newProject.trim()) return;
    dispatch(addProject({ userId: user.uid, title: newProject }));
    setNewProject("");
  };

  const goToProject = (projectId) => navigate(`/project/${projectId}`);

  // Framer Motion Variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Projects</h1>

      {/* Add new project input */}
      <div className="mb-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
        <input
          type="text"
          placeholder="New project name"
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
          className="p-3 border rounded w-full sm:w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddProject}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition w-full sm:w-auto"
        >
          + Add Project
        </button>
      </div>

      {loading && <p className="text-center">Loading projects...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* No projects message */}
      {projects.length === 0 && !loading ? (
        <div className="text-center mt-20">
          <p className="text-xl text-gray-600 mb-4">No projects yet.</p>
          <p className="text-gray-500">Start by adding your first project above.</p>
        </div>
      ) : (
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
              className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition cursor-pointer flex flex-col justify-between"
              onClick={() => goToProject(project.id)}
            >
              <div>
                <h2 className="font-bold text-xl mb-2 truncate">{project.title}</h2>
                <p className="text-sm text-gray-600">
                  Created by:{" "}
                  <span className="font-medium">
                    {project.createdBy === user.uid ? "You" : project.createdBy}
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Created at:{" "}
                  {project.createdAt
                    ? new Date(project.createdAt).toLocaleString()
                    : "Unknown"}
                </p>
              </div>

              <div className="mt-4 text-sm text-gray-700">
                Click on this card to add task list for the project
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
