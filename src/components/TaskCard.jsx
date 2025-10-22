import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function TaskCard({ task, canEdit, projectId, reload }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedStatus, setEditedStatus] = useState(task.status);

  // ✅ Update task
  const handleSave = async () => {
    const taskRef = doc(db, "projects", projectId, "tasks", task.id);
    await updateDoc(taskRef, {
      title: editedTitle,
      status: editedStatus,
    });
    setIsEditing(false);
    reload();
  };

  // ✅ Delete task
  const handleDelete = async () => {
    if (!canEdit) return;
    if (window.confirm("Delete this task?")) {
      const taskRef = doc(db, "projects", projectId, "tasks", task.id);
      await deleteDoc(taskRef);
      reload();
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow flex justify-between items-center">
      {isEditing ? (
        <div className="flex flex-1 gap-3">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="border px-2 py-1 rounded flex-1"
          />
          <select
            value={editedStatus}
            onChange={(e) => setEditedStatus(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      ) : (
        <div className="flex-1">
          <p className="font-medium text-lg">{task.title}</p>
          <p
            className={`text-sm ${
              task.status === "completed"
                ? "text-green-600"
                : task.status === "in progress"
                ? "text-blue-600"
                : "text-yellow-600"
            }`}
          >
            {task.status}
          </p>
        </div>
      )}

      {canEdit && (
        <div className="flex gap-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Edit
            </button>
          )}
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
