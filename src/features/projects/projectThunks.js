import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc
} from "firebase/firestore";
import { toast } from "react-toastify"; // ✅ Import toast

// Helper to convert Firestore timestamp to JS Date
const convertTimestamps = (docData) => ({
  ...docData,
  createdAt: docData.createdAt ? docData.createdAt.toDate() : null,
  lists:
    docData.lists?.map((list) => ({
      ...list,
      tasks: list.tasks?.map((task) => ({ ...task }))
    })) || []
});

// ✅ Fetch all projects or current user's projects
export const fetchProjects = createAsyncThunk(
  "projects/fetch",
  async (userId = null, { rejectWithValue }) => {
    try {
      let q = collection(db, "projects");
      if (userId) q = query(q, where("createdBy", "==", userId));
      const snapshot = await getDocs(q);
      toast.info("Projects loaded successfully"); // ✅ Info toast
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      }));
    } catch (error) {
      toast.error("Failed to load projects"); // ❌ Error toast
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Add new project
export const addProject = createAsyncThunk(
  "projects/add",
  async ({ userId, title }, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, "projects"), {
        title,
        createdBy: userId,
        createdAt: new Date(),
        lists: []
      });
      toast.success("Project created successfully 🎉"); // ✅ Success toast
      return {
        id: docRef.id,
        title,
        createdBy: userId,
        createdAt: new Date(),
        lists: []
      };
    } catch (error) {
      toast.error("Failed to create project ❌");
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Fetch single project by ID
export const fetchProjectById = createAsyncThunk(
  "projects/fetchById",
  async (projectId, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "projects", projectId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error("Project not found");
      toast.info("Project details loaded");
      return { id: docSnap.id, ...convertTimestamps(docSnap.data()) };
    } catch (error) {
      toast.error("Failed to load project details ❌");
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Delete project
export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (projectId, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "projects", projectId));
      toast.success("Project deleted successfully 🗑️");
      return projectId;
    } catch (error) {
      toast.error("Failed to delete project ❌");
      return rejectWithValue(error.message);
    }
  }
);
