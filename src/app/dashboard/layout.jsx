"use client";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import { useEffect, useRef, useState } from "react";

export default function LayoutDashboard({ children }) {
    const [size, setSize] = useState(null);
    const [sidebarActive, setSidebarActive] = useState(false);
    const refSidebar = useRef(null);
    
    function handleResize() {
        setSize(window.innerWidth);
        console.log(size);
    }
    function handleSidebar() {
        setSidebarActive(!sidebarActive);
    }
    function handleClick(e) {
        if (refSidebar.current && !refSidebar.current.contains(e.target)) {
            setSidebarActive(false);
        }
    }
    useEffect(() => {
        setSize(window.innerWidth);
        window.addEventListener("resize", handleResize);
        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            window.removeEventListener("resize", handleResize);
        }
    }, []);
    return (
        <>
        <Sidebar size={size} sidebarActive={sidebarActive} actionSidebar={() => handleSidebar()} refSidebar={refSidebar} />
        <div className={`transition-all duration-200 grid grid-cols-1 bg-gray-50 ${size > 800 ? 'ml-[270px]' : 'ml-0'}`}>
            <Header size={size} sidebarActive={sidebarActive} actionSidebar={() => handleSidebar()} />
            <div className="mt-10"></div>
            <main>{children}</main>
            <footer></footer>
        </div>
        </>
    )
}