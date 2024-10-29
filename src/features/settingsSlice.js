import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        Draw:{
            isShowGrid:true,
            lineType:3
        }
    },
    reducers: {
        updateSettings: (state, action) => {
            Object.assign(state,action.payload)
        },
    },
});

export const { updateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
