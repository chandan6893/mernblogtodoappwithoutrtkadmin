// src/slice/blogSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for adding a blog
export const addBlog = createAsyncThunk(
  "blogs/addBlog",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:4001/todo/api/additems",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while adding the blog."
      );
    }
  }
);

// Async thunk for fetching paginated blog data
export const getAllData = createAsyncThunk(
  "blogs/getAllData",
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:4001/todo/api/gettodoitems?page=${page}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while fetching data."
      );
    }
  }
);

  
export const getItemToEdit = createAsyncThunk(
  "blogs/getItemToEdit",
  async(productEditId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:4001/todo/api/editItem/${productEditId}`
      );
      console.log("RESPONSE======>",response)
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while editing the data."
      );
    }
  }
)

export const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async ({ formData, productEditId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:4001/todo/api/updateitems/${productEditId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
      // return { ...response.data, productEditId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while updating the data."
      );
    }
  }
);

// Blog slice
const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    data: [],
    isLoading: false,
    isError: false,
    itemToEdit:null,
    // itemToEdit: JSON.parse(sessionStorage.getItem("itemToEdit")) || null, // Retrieve from sessionStorage
    totalPages: 1, // For pagination
    currentPage: 1,
    // currentPage: parseInt(sessionStorage.getItem("currentPage")) || 1, // Retrieve from sessionStorage
  },
  reducers: {}, // Add reducers if needed
  extraReducers: (builder) => {
    // Add Blog
    builder
      .addCase(addBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data.push(action.payload); // Add new blog to the state
      })
      .addCase(addBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });

    // Get All Data
    builder
      .addCase(getAllData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.getAllTodoItems; // Update state with fetched data
        state.totalPages = action.payload.totalPages; // Update total pages
        state.currentPage = action.payload.currentPage; // Update current page
        // sessionStorage.setItem("currentPage", action.payload.currentPage); // Save to sessionStorage
      })
      .addCase(getAllData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });

      // editItem
    builder.addCase(getItemToEdit.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getItemToEdit.fulfilled, (state, action) => {
      state.isLoading = false;
      state.itemToEdit = action.payload; 
      // sessionStorage.setItem("itemToEdit", JSON.stringify(action.payload)); // Save to sessionStorage
    })
    .addCase(getItemToEdit.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = action.payload;
    });
    // update Blog
    builder
      .addCase(updateBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedBlog = action.payload;
        const index = state.data.findIndex(
          (blog) => blog.id === updatedBlog.productEditId
        );
        if (index !== -1) {
          state.data[index] = { ...state.data[index], ...updatedBlog };
        }
        // sessionStorage.removeItem("itemToEdit"); // Clear after update
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });
  },
});

export default blogSlice.reducer;


