import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects } from "../features/projects/projectThunks";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProjectBoard() {
  const { user } = useSelector((state) => state.auth);
  const { projects, loading, error } = useSelector((state) => state.projects);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) dispatch(fetchProjects());
  }, [user, dispatch]);

  const goToProjectDetail = (projectId) => navigate(`/project/${projectId}`);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9 },
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-center mb-10 tracking-wide">
        All Projects
      </h1>

      {loading && <p className="text-center text-gray-300">Loading projects...</p>}
      {error && <p className="text-center text-red-400">{error}</p>}

      <AnimatePresence>
        {projects.length === 0 && !loading ? (
          <div className="text-center mt-20 text-gray-400">
            <p className="text-xl mb-3">No projects available.</p>
            <p>Projects will appear here once created.</p>
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
                 <span className=" py-1 text-xs text-gray-300 rounded-md truncate max-w-[150px]" title={user.id}>

                        {project.createdBy === user.uid ? "You" : project.createdBy}
                      </span>
                    </p>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => goToProjectDetail(project.id)}
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 
                          hover:from-indigo-500 hover:to-purple-500
                          text-white font-medium px-4 py-2 rounded-lg transition-all duration-300"
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
