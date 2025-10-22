import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc, doc, getDoc, getDocs, query, where, deleteDoc } from "firebase/firestore";

// Helper to convert Firestore timestamp to JS Date
const convertTimestamps = (docData) => ({
  ...docData,
  createdAt: docData.createdAt ? docData.createdAt.toDate() : null,
  lists: docData.lists?.map(list => ({
    ...list,
    tasks: list.tasks?.map(task => ({ ...task }))
  })) || []
});

// Fetch all projects or current user's projects
export const fetchProjects = createAsyncThunk(
  "projects/fetch",
  async (userId = null) => {
    let q = collection(db, "projects");
    if (userId) q = query(q, where("createdBy", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) }));
  }
);

// Add new project
export const addProject = createAsyncThunk(
  "projects/add",
  async ({ userId, title }) => {
    const docRef = await addDoc(collection(db, "projects"), {
      title,
      createdBy: userId,
      createdAt: new Date(),
      lists: []
    });
    return { id: docRef.id, title, createdBy: userId, createdAt: new Date(), lists: [] };
  }
);

// Fetch single project by ID
export const fetchProjectById = createAsyncThunk(
  "projects/fetchById",
  async (projectId) => {
    const docRef = doc(db, "projects", projectId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw "Project not found";
    return { id: docSnap.id, ...convertTimestamps(docSnap.data()) };
  }
);

// Delete project
export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (projectId) => {
    await deleteDoc(doc(db, "projects", projectId));
    return projectId;
  }
);
