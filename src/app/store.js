import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import projectReducer from "../features/projects/projectSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore dates from Firestore
        ignoredPaths: ["projects.projects"],
        ignoredActions: ["projects/fetch/fulfilled", "projects/add/fulfilled"],
      },
    }),
});
