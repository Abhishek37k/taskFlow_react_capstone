import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProjectById, deleteProject } from "../features/projects/projectThunks";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import TaskCard from "../components/TaskCard";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectDetail() {
  const { user } = useSelector((state) => state.auth);
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("pending");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      const result = await dispatch(fetchProjectById(projectId)).unwrap();
      setProject(result);

      const tasksRef = collection(db, "projects", projectId, "tasks");
      const tasksSnap = await getDocs(tasksRef);
      const tasksData = tasksSnap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setTasks(tasksData);
    } catch (err) {
      toast.error("Failed to load project. ❌");
      console.error(err);
    }
  };

  const canEdit = project?.createdBy === user?.uid;

  // ✅ Add task
  const handleAddTask = async () => {
    if (!canEdit || !newTaskTitle.trim()) return;
    try {
      const tasksRef = collection(db, "projects", projectId, "tasks");
      await addDoc(tasksRef, { title: newTaskTitle, status: newTaskStatus });
      setNewTaskTitle("");
      setNewTaskStatus("pending");
      toast.success("Task added successfully! ✅");
      loadProjectData();
    } catch (err) {
      toast.error("Failed to add task ❌");
      console.error(err);
    }
  };

  // ✅ Edit project title
  const handleEditTitle = async () => {
    if (!canEdit) return;
    if (isEditingTitle && editedTitle.trim()) {
      try {
        const projectRef = doc(db, "projects", projectId);
        await updateDoc(projectRef, { title: editedTitle });
        setProject((prev) => ({ ...prev, title: editedTitle }));
        setIsEditingTitle(false);
        toast.success("Project title updated! ✅");
      } catch (err) {
        toast.error("Failed to update project title ❌");
        console.error(err);
      }
    } else {
      setEditedTitle(project.title);
      setIsEditingTitle(true);
    }
  };

  // ✅ Delete project
  const handleDeleteProject = async () => {
    if (!canEdit) return;
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await dispatch(deleteProject(projectId)).unwrap();
        toast.success("Project deleted successfully! ✅");
        navigate("/dashboard");
      } catch (err) {
        toast.error("Failed to delete project ❌");
        console.error(err);
      }
    }
  };

  if (!project) return <p className="text-center mt-10">Loading project...</p>;

  return (
    <div className="p-6 bg-gradient-to-br from-slate-950 via-gray-900 to-gray-800 min-h-screen text-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        {isEditingTitle ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="border border-gray-600 bg-gray-800 rounded-lg px-3 py-2 w-1/2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        ) : (
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {project.title}
          </h1>
        )}
        {canEdit && (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleEditTitle}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:opacity-90"
            >
              {isEditingTitle ? "Save" : "Edit"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleDeleteProject}
              className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-lg shadow hover:opacity-90"
            >
              Delete
            </motion.button>
          </div>
        )}
      </div>

      <p className="text-sm mb-6 text-gray-400">
        Created by:{" "}
        {canEdit ? (
          <span className="text-green-400">You</span>
        ) : (
          <span
            className="text-gray-300 truncate max-w-[200px] inline-block"
            title={project.createdBy}
          >
            {project.createdBy}
          </span>
        )}
      </p>

      {!canEdit && (
        <p className="mb-6 text-yellow-400 bg-yellow-900/20 border border-yellow-700 px-4 py-2 rounded-md inline-block">
          ⚠️ You can only view tasks. Editing is restricted to the owner.
        </p>
      )}

      {/* Add task */}
      {canEdit && (
        <div className="flex flex-wrap gap-3 mb-10 bg-gray-900/50 p-4 rounded-xl shadow-lg backdrop-blur-sm border border-gray-800">
          <input
            type="text"
            placeholder="Enter task title..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="border border-gray-700 bg-gray-800 text-gray-100 rounded-lg px-4 py-2 flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <select
            value={newTaskStatus}
            onChange={(e) => setNewTaskStatus(e.target.value)}
            className="border border-gray-700 bg-gray-800 text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleAddTask}
            className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-5 py-2 rounded-lg shadow hover:opacity-90"
          >
            + Add Task
          </motion.button>
        </div>
      )}

      {/* Task list with animation */}
      <div className="space-y-4">
        <AnimatePresence>
          {tasks.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-400 text-center"
            >
              No tasks available.
            </motion.p>
          ) : (
            tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900/60 border border-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <TaskCard
                  task={task}
                  canEdit={canEdit}
                  projectId={projectId}
                  reload={loadProjectData}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
