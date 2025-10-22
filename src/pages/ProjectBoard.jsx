import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects } from "../features/projects/projectThunks";
import { useNavigate } from "react-router-dom";

export default function ProjectBoard() {
  const { user } = useSelector(state => state.auth);
  const { projects, loading, error } = useSelector(state => state.projects);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) dispatch(fetchProjects());
  }, [user]);

  const goToProjectDetail = (projectId) => navigate(`/project/${projectId}`);

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-gray-900">
      <h1 className="text-3xl font-bold mb-6">All Projects</h1>

      {loading && <p>Loading projects...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div
            key={project.id}
            className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => goToProjectDetail(project.id)}
          >
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p className="text-gray-500 mt-1 text-sm">
              Created by: {project.createdBy === user.uid ? "You" : project.createdBy}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
