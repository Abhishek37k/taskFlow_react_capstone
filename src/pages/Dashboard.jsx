import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects, addProject } from "../features/projects/projectThunks";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const { projects, loading, error } = useSelector((state) => state.projects);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [newProject, setNewProject] = useState("");

  useEffect(() => {
    if (user) dispatch(fetchProjects(user.uid));
  }, [user, dispatch]);

  const handleAddProject = () => {
    if (!newProject.trim()) {
      alert("Please enter a project name before adding!");
      return;
    }
    dispatch(addProject({ userId: user.uid, title: newProject }));
    setNewProject("");
  };

  const goToProject = (projectId) => navigate(`/project/${projectId}`);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9 },
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8 text-center tracking-wide">
        Your Projects
      </h1>

      {/* Add new project input */}
      <div className="mb-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
        <input
          type="text"
          placeholder="Enter new project name..."
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
          className="p-3 rounded-lg border border-gray-700 bg-gray-800 text-white w-full sm:w-2/3 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <Button
          onClick={handleAddProject}
          disabled={!newProject.trim()}
          className={`font-semibold px-6 py-3 rounded-lg transition-all duration-300 ${
            newProject.trim()
              ? "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          + Add Project
        </Button>
      </div>

      {loading && <p className="text-center text-gray-300">Loading projects...</p>}
      {error && <p className="text-center text-red-400">{error}</p>}

      {/* Projects Grid */}
      <AnimatePresence>
        {projects.length === 0 && !loading ? (
          <div className="text-center mt-20 text-gray-400">
            <p className="text-xl mb-3">No projects yet.</p>
            <p>Start by adding your first project above.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  className="relative bg-white/10 backdrop-blur-lg border border-white/20 
                  text-white rounded-2xl shadow-lg transition-all duration-300 
                  hover:scale-105 hover:shadow-2xl hover:border-purple-400/40
                  hover:bg-gradient-to-br hover:from-purple-700/40 hover:to-indigo-700/30"
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold truncate">
                      {project.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-300 text-sm mb-6">
                      Created by:{" "}
                      <span className="font-medium">
                        {project.createdBy === user.uid ? "You" : project.createdBy}
                      </span>
                    </p>

                    <p className="text-xs text-gray-400 mb-6">
                      Created at:{" "}
                      {project.createdAt
                        ? new Date(project.createdAt).toLocaleString()
                        : "Unknown"}
                    </p>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => goToProject(project.id)}
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300"
                      >
                        View Details →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
