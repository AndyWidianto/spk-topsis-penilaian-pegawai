"use client";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import { useEffect, useRef, useState } from "react";
import { fetchWithAuth } from "@/lib/fetcher";
import { useRouter } from "next/navigation";
import { JWTDecode } from '@/lib/fetcher';
import Footer from "../components/footer";

export default function LayoutDashboard({ children }) {
    const [sidebarActive, setSidebarActive] = useState(false);
    const [user, setUser] = useState({
        username: "John Doe",
        email: "",
        role: "Administrator",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
    });
    const refSidebar = useRef(null);
    const router = useRouter();

    function handleResize() {
        setSidebarActive(window.innerWidth > 800);
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
    async function getUser() {
        try {
            const res = await JWTDecode();
            if (res) {
                setUser(res);
            }
        } catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        setSidebarActive(window.innerWidth > 800);
        getUser();
        window.addEventListener("resize", handleResize);
        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            window.removeEventListener("resize", handleResize);
        }
    }, []);
    return (
        <>
            <Sidebar user={user} sidebarActive={sidebarActive} actionSidebar={handleSidebar} refSidebar={refSidebar} handleLogout={handleLogout} />
            <div className={`transition-all duration-200 grid grid-cols-1 bg-gray-50 ${sidebarActive ? window.innerWidth > 800 ? 'ml-[270px]' : 'ml-0' : 'ml-0'}`}>
                <Header user={user} sidebarActive={sidebarActive} actionSidebar={handleSidebar} handleLogout={handleLogout} />
                <div className="mt-10"></div>
                <main>{children}</main>
                <Footer/>
            </div>
        </>
    )
}