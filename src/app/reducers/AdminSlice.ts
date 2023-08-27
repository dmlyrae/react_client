import { PayloadAction, createSlice } from "@reduxjs/toolkit"

const initialState = {
    tab: -1,
}

export const adminSlice = createSlice({
	name: 'admin',
	initialState,
	reducers: { 
        changeTab: (state, action:PayloadAction<number>) => {
           state.tab = action.payload;
        }
    }
})

export default adminSlice.reducer