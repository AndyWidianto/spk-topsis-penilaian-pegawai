import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sidebars: [
            {
                id: 1,
                name: "Dashboard",
                type: "individu",
                url: "/dashboard"
            },
            {
                id: 2,
                status: false,
                type: "group",
                name: "Employees",
                url: [
                    {
                        name: "Employees",
                        url: "/dashboard/employees"
                    },
                    {
                        name: "Add Employee",
                        url: "/dashboard/employees/create-employee"
                    }
                ]
            },
            {
                id: 3,
                status: false,
                type: "group",
                name: "Criterias",
                url: [
                    {
                        name: "Criterias",
                        url: "/dashboard/criterias"
                    },
                    {
                        name: "Create Criteria",
                        url: "/dashboard/criterias/create-criteria"
                    }
                ]
            },
            {
                id: 4,
                status: false,
                type: "group",
                name: "Assessments",
                url: [
                    {
                        name: "Assessments",
                        url: "/dashboard/assessments"
                    },
                    {
                        name: "Create Assessment",
                        url: "/dashboard/assessments/create-assessment"
                    },
                ]
            },
            {
                id: 5,
                status: false,
                type: "group",
                name: "Priodes",
                url: [
                    {
                        name: "Priodes",
                        url: "/dashboard/priodes"
                    },
                    {
                        name: "Create Priode",
                        url: "/dashboard/priodes/create-priode"
                    },
                ]
            },
            {
                id: 6,
                name: "Calculate Topsis",
                type: "individu",
                url: "/dashboard/topsis-calculate"
            },
            {
                id: 7,
                name: "Rankings",
                type: "individu",
                url: "/rankings"
            },
        ]
}

const sidebarSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        updateSidebar(state, action) {
            const name = action.payload;
            const findIndex = state.sidebars.findIndex(side => side.name.toLowerCase() === name.toLowerCase());
            if (findIndex > -1) {
                state.sidebars[findIndex].status = !state.sidebars[findIndex].status;
            }
        }
    }
});

export const { updateSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;