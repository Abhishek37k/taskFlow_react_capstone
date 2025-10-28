import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function TaskCard({ task, canEdit, projectId, reload }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedStatus, setEditedStatus] = useState(task.status);

  // ✅ Update task
  const handleSave = async () => {
    try {
      const taskRef = doc(db, "projects", projectId, "tasks", task.id);
      await updateDoc(taskRef, { title: editedTitle, status: editedStatus });
      setIsEditing(false);
      toast.success("Task updated successfully! ✅");
      reload();
    } catch (err) {
      toast.error("Failed to update task ❌");
      console.error(err);
    }
  };

  // ✅ Delete task
  const handleDelete = async () => {
    if (!canEdit) return;
    if (window.confirm("Delete this task?")) {
      try {
        const taskRef = doc(db, "projects", projectId, "tasks", task.id);
        await deleteDoc(taskRef);
        toast.success("Task deleted successfully! 🗑️");
        reload();
      } catch (err) {
        toast.error("Failed to delete task ❌");
        console.error(err);
      }
    }
  };

  // ✅ Status color badge styles
  const statusColor = {
    completed: "bg-green-600/20 text-green-400 border border-green-500/50",
    "in progress": "bg-blue-600/20 text-blue-400 border border-blue-500/50",
    pending: "bg-yellow-600/20 text-yellow-400 border border-yellow-500/50",
  }[task.status];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="flex justify-between items-center bg-gray-900/60 border border-gray-800 rounded-xl shadow-lg px-5 py-4 hover:shadow-blue-800/20"
    >
      {/* Left side (task info or edit mode) */}
      {isEditing ? (
        <div className="flex flex-1 flex-wrap gap-3">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="border border-gray-700 bg-gray-800 text-gray-100 rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <select
            value={editedStatus}
            onChange={(e) => setEditedStatus(e.target.value)}
            className="border border-gray-700 bg-gray-800 text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      ) : (
        <div className="flex-1">
          <p className="font-semibold text-lg text-gray-100 mb-1">{task.title}</p>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor}`}
          >
            {task.status}
          </span>
        </div>
      )}

      {/* Action buttons */}
      {canEdit && (
        <div className="flex gap-2 ml-4">
          {isEditing ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleSave}
              className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-3 py-1.5 rounded-lg shadow hover:opacity-90"
            >
              Save
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg shadow hover:opacity-90"
            >
              Edit
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleDelete}
            className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-3 py-1.5 rounded-lg shadow hover:opacity-90"
          >
            Delete
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
