import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'product',
  initialState: {
    allProducts: [],
    pagination: {
      totalProducts: 0,
      totalPages: 1,
      currentPage: 1,
      limit: 10,
    },
    isLoading: false,
    error: null,
  },
  reducers: {
    ProductsStart: (state) => {
      state.isLoading = true;
    },
    ProductsSuccess: (state, action) => {
      state.isLoading = false;
      state.allProducts = action.payload.products;
      state.pagination = action.payload.pagination || {
        totalProducts: 0,
        totalPages: 1,
        currentPage: 1,
        limit: 10,
      };
    },
    ProductsFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { ProductsStart, ProductsSuccess, ProductsFailed } = productSlice.actions;
export default productSlice.reducer;






