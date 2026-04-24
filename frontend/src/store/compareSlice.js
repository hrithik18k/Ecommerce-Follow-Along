import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const compareSlice = createSlice({
    name: 'compare',
    initialState: {
        selectedProducts: [], // array of full product objects
    },
    reducers: {
        toggleCompareProduct: (state, action) => {
            const product = action.payload;
            const existsIndex = state.selectedProducts.findIndex(p => p._id === product._id);

            if (existsIndex >= 0) {
                state.selectedProducts.splice(existsIndex, 1);
            } else if (state.selectedProducts.length >= 3) {
                toast.error('You can only compare up to 3 products.');
            } else {
                state.selectedProducts.push(product);
            }
        },
        removeCompareProduct: (state, action) => {
            state.selectedProducts = state.selectedProducts.filter(p => p._id !== action.payload);
        },
        clearCompare: (state) => {
            state.selectedProducts = [];
        }
    }
});

export const { toggleCompareProduct, removeCompareProduct, clearCompare } = compareSlice.actions;
export default compareSlice.reducer;
