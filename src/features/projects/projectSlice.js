import { createSlice } from "@reduxjs/toolkit";
import { fetchProjects, addProject } from "./projectThunks";

const initialState = {
  projects: [],
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Projects
    builder.addCase(fetchProjects.pending, (state) => { state.loading = true; state.error = null });
    builder.addCase(fetchProjects.fulfilled, (state, action) => { state.projects = action.payload; state.loading = false });
    builder.addCase(fetchProjects.rejected, (state, action) => { state.loading = false; state.error = action.payload });

    // Add Project
    builder.addCase(addProject.fulfilled, (state, action) => { state.projects.push(action.payload); });
  },
});

export default projectSlice.reducer;
