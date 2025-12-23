import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    assessmentDetails: []
}

const assessmentDetailSlice = createSlice({
    name: "assessment_detail",
    initialState,
    reducers: {
        addAssessmentDetail(state, action) {
            state.assessmentDetails.push(action.payload);
        },
        setAssessmentDetails(state, action) {
            state.assessmentDetails = action.payload;
        },
        updateAssessmentDetail(state, action) {
            const { id } = action.payload;
            const findIndex = state.assessmentDetails.findIndex(ad => ad.id === id);
            if (findIndex > -1) {
                state.assessmentDetails[findIndex] = action.payload;
            }
        },
        deleteAssessmentDetail(state, action) {
            const id = action.payload;
            state.assessmentDetails = state.assessmentDetails.filter(ad => ad.id !== id);
        }
    }
});

export const { addAssessmentDetail, setAssessmentDetails, updateAssessmentDetail, deleteAssessmentDetail } = assessmentDetailSlice.actions;
export default assessmentDetailSlice.reducer;