import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    assessments: [],
    priode: null
}

const assessmentSlice = createSlice({
    name: "assessment",
    initialState,
    reducers: {
        setAssessments(state, action) {
            state.assessments = action.payload;
        },
        addAssessment(state, action) {
            const newAssessment = {};
            Object.entries(action.payload).forEach(([key, val]) => {
                if (key === "employee") {
                    newAssessment.employees = val;
                } else if (key === "priode") {
                    newAssessment.priodes = val;
                } else {
                    newAssessment[key] = val;
                }
            });
            state.assessments.push(newAssessment);
        },
        updateAssessment(state, action) {
            const { id } = action.payload;
            const findIndex = state.assessments.findIndex(a => a.id === id);
            if (findIndex > -1) {
                state.assessments[findIndex] = action.payload;
            }
        },
        deleteAssessment(state, action) {
            const id = action.payload;
            state.assessments = state.assessments.filter(a => a.id !== id);
        },
        setPriode(state, action) {
            state.priode = action.payload;
        },
        addAssessmentInPriode(state, action) {
            const id = action.payload.priode_id;
            if (state.priode && state.priode.id === id) {
                state.priode.assessments.push(action.payload);
            }
        },
        deleteAssessmentInPriode(state, action) {
            const id = action.payload;
            if (state.priode) {
                state.priode.assessments = state.priode.assessments.filter(a => a.id !== id);
            }
        },
        updateAssessmentInPriode(state, action) {
            const priodeId = action.payload.priode_id;
            const { id } = action.payload;
            if (state.priode) {
                const findIndex = state.priode.assessments.findIndex(a => a.id === id);
                console.log("Ini find Index: ", findIndex);
                if (findIndex > -1 && state.priode.id === priodeId) {
                    state.priode.assessments[findIndex] = action.payload;
                } else {
                    state.priode.assessments = state.priode.assessments.filter(a => a.id !== id);
                }
            }
        }
    }
});

export const { setAssessments, addAssessment, deleteAssessment, updateAssessment, setPriode, addAssessmentInPriode, deleteAssessmentInPriode, updateAssessmentInPriode } = assessmentSlice.actions;
export default assessmentSlice.reducer;