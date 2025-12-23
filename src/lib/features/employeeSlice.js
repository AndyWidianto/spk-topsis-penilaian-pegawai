import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    employees: [],
}
const employeeSlice = createSlice({
    name: "employee",
    initialState,
    reducers: { 
        addEmployee(state, action) {
            state.employees.push(action.payload);
        },
        setEmployees(state, action) {
            state.employees = action.payload;
        },
        updateEmployee(state, action) {
            const id = action.payload.id;
            const findIndex = state.employees.findIndex(employee => employee.id === id);
            if (findIndex > -1) {
                state.employees[findIndex] = action.payload;
                console.log(state.employees);
            }
        },
        deleteEmployee(state, action) {
            state.employees = state.employees.filter(employee => employee.id !== action.payload);
        }
    }
});

export const { setEmployees, addEmployee, updateEmployee, deleteEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;