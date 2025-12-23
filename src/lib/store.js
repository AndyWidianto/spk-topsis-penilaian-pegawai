import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "./features/employeeSlice";
import criteriaReducer from "./features/criteriaSlice";
import assessmentReducer from "./features/assessmentSlice";
import priodeReducer from "./features/priodeSlice";
import assessmentDetailReducer from "./features/assessmentDetailSlice";

export const store = configureStore({
    reducer: {
        employee: employeeReducer,
        criteria: criteriaReducer,
        assessment: assessmentReducer,
        priode: priodeReducer,
        assessment_detail: assessmentDetailReducer
    },
});

