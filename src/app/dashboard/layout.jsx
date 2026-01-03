"use client";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import { useEffect, useRef, useState } from "react";
import { fetchWithAuth } from "@/lib/fetcher";
import { useRouter } from "next/navigation";

export default function LayoutDashboard({ children }) {
    const [sidebarActive, setSidebarActive] = useState(false);
    const refSidebar = useRef(null);
    const router = useRouter();
    
    function handleResize() {
        setSidebarActive(window.innerWidth > 800);
        console.log(size);
    }
    function handleSidebar() {
        setSidebarActive(!sidebarActive);
    }
    function handleClick(e) {
        if (window.innerWidth < 800) {
            if (refSidebar.current && !refSidebar.current.contains(e.target)) {
            setSidebarActive(false);
            }
        }
    }
    async function handleLogout() {
        if (!confirm("Are you sure to logout?")) return;
        try {
            const res = await fetchWithAuth("/api/auth/logout", { method: "POST" });
            if (res.ok) {
                const data = await res.json();
                alert(data.message);
                router.push("/login");
            }
        } catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        setSidebarActive(window.innerWidth > 800);
        window.addEventListener("resize", handleResize);
        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            window.removeEventListener("resize", handleResize);
        }
    }, []);
    return (
        <>
        <Sidebar sidebarActive={sidebarActive} actionSidebar={handleSidebar} refSidebar={refSidebar} handleLogout={handleLogout} />
        <div className={`transition-all duration-200 grid grid-cols-1 bg-gray-50 ${sidebarActive ? window.innerWidth > 800 ? 'ml-[270px]' : 'ml-0' : 'ml-0'}`}>
            <Header sidebarActive={sidebarActive} actionSidebar={handleSidebar} handleLogout={handleLogout} />
            <div className="mt-10"></div>
            <main>{children}</main>
            <footer></footer>
        </div>
        </>
    )
}