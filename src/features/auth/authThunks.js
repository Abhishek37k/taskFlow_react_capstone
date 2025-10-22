import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify"; // ✅ Import toast

// ✅ Signup thunk with toasts
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      toast.success("Signup successful! 🎉"); // ✅ Success toast
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
      };
    } catch (error) {
      toast.error(error.message); // ❌ Error toast
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Login thunk with toasts
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;
      toast.success("Login successful! ✅"); // ✅ Success toast
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
      };
    } catch (error) {
      toast.error(error.message); // ❌ Error toast
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Logout thunk with toast
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      toast.info("Logged out successfully 👋"); // ✅ Info toast
      return null; // clear user state
    } catch (error) {
      toast.error("Logout failed ❌");
      return rejectWithValue(error.message);
    }
  }
);
