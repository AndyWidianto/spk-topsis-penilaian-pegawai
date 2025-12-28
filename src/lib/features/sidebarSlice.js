import { createSlice } from "@reduxjs/toolkit";
import {  CalendarCheck, Layout, LogOut, Star, Users2 } from "lucide-react";

const initialState = {
    sidebars: [
            {
                id: 1,
                status: false,
                icon: <Users2 size={20} />,
                name: "Employees",
                url: [
                    {
                        name: "Employees",
                        url: "/dashboard/employees"
                    },
                    {
                        name: "Create Users",
                        url: "/dashboard/employees/create-employee"
                    }
                ]
            },
            {
                id: 2,
                status: false,
                icon: <Users2 size={20} />,
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
                id: 3,
                status: false,
                icon: <Users2 size={20} />,
                name: "Assessments",
                url: [
                    {
                        name: "Assessments",
                        url: "/dashboard/assessments"
                    },
                    {
                        name: "Create Assement",
                        url: "/dashboard/assessments/create-assessment"
                    },
                    {
                        name: "Assessment detail",
                        url: "/dashboard/assessments/details"
                    },
                    {
                        name: "Create Detail",
                        url: "/dashboard/assessments/create-assessment-detail"
                    },
                ]
            },
            {
                id: 4,
                status: false,
                icon: <CalendarCheck size={20} />,
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
        ]
}

const sidebarSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        updateSidebar(state, action) {
            const id = action.payload;
            const findIndex = state.sidebars.findIndex(side => side.id === id);
            if (findIndex > -1) {
                state.sidebars[findIndex].status = !state.sidebars[findIndex].status;
            }
        }
    }
});

export const { updateSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;