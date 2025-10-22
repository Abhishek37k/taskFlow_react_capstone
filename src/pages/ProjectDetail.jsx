import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProjectById, deleteProject } from "../features/projects/projectThunks";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import TaskCard from "../components/TaskCard";
import { toast } from "react-toastify"; // ✅ Import toast

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
      await addDoc(tasksRef, {
        title: newTaskTitle,
        status: newTaskStatus,
      });
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
    <div className="p-6 bg-gray-100 min-h-screen text-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        {isEditingTitle ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="border border-gray-400 rounded px-2 py-1 w-1/2"
          />
        ) : (
          <h1 className="text-3xl font-bold">{project.title}</h1>
        )}
        {canEdit && (
          <div className="flex gap-2">
            <button
              onClick={handleEditTitle}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isEditingTitle ? "Save" : "Edit"}
            </button>
            <button
              onClick={handleDeleteProject}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <p className="text-sm mb-6 text-gray-600">
        Created by: {canEdit ? "You" : project.createdBy}
      </p>

      {!canEdit && (
        <p className="mb-4 text-red-500">
          You can only view tasks. Editing is restricted to the owner.
        </p>
      )}

      {/* Add task */}
      {canEdit && (
        <div className="flex gap-3 mb-8 bg-white p-4 rounded-lg shadow">
          <input
            type="text"
            placeholder="Enter task title..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 flex-1"
          />
          <select
            value={newTaskStatus}
            onChange={(e) => setNewTaskStatus(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={handleAddTask}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Add Task
          </button>
        </div>
      )}

      {/* Task list */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              canEdit={canEdit}
              projectId={projectId}
              reload={loadProjectData}
            />
          ))
        )}
      </div>
    </div>
  );
}
