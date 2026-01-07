import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    priodes: [],
}

const priodeSlince = createSlice({
    name: "priode",
    initialState,
    reducers: {
        setPriodes(state, action) {
            state.priodes = action.payload;
        },
        addPriode(state, action) {
            state.priodes.push(action.payload);
        },
        updatePriode(state, action) {
            const { id } = action.payload;
            const findIndex = state.priodes.findIndex(p => p.id === id);
            if (findIndex > -1) {
                state.priodes[findIndex] = action.payload;
            }
        },
        deletePriode(state, action) {
            const id = action.payload;
            state.priodes = state.priodes.filter(p => p.id !== id);
        }
    }
});

export const { updatePriode, setPriodes, deletePriode, addPriode } = priodeSlince.actions;
export default priodeSlince.reducer;