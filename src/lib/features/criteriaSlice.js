import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    criterias: []
}

const criteriaSlice = createSlice({
    name: "criteria",
    initialState,
    reducers: {
        setCriterias(state, action) {
            state.criterias = action.payload;
        },
        addCriteria(state, action) {
            state.criterias.push(action.payload);
        },
        updateCriteria(state, action) {
            const id = action.payload.id;
            const findIndex = state.criterias.findIndex(c => c.id === id);
            if (findIndex > -1) {
                state.criterias[findIndex] = action.payload;
            }
        },
        deleteCriteria(state, action) {
            const id = action.payload;
            state.criterias = state.criterias.filter(c => c.id !== id);
        }
    }
});

export const { setCriterias, addCriteria, updateCriteria, deleteCriteria } = criteriaSlice.actions;
export default criteriaSlice.reducer;
