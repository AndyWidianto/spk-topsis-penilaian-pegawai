"use client";
import { updateSidebar } from "@/lib/features/sidebarSlice";
import {  CalendarCheck, Layout, LogOut, Star, Users2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Sidebar({ size, sidebarActive, refSidebar }) {
    const pathname = usePathname();
    const sidebars = useSelector((state) => state.sidebar.sidebars);
    const dispatch = useDispatch();

    const isActive = (path) => {
        return `transition-all ease duration-300 ${path === pathname ? "bg-blue-500 text-white p-3" : "p-2"}`;
    }
    const handleSidebar = (id) => {
        dispatch(updateSidebar(id));
    }

    const firtsActive = () => {
        const path = pathname.split("/")[2];
        if (path) {
            const sidebar = sidebars.find(bar => bar.name.toLowerCase() === path);
            dispatch(updateSidebar(sidebar.id));
        }
    }
    useEffect(() => {
        firtsActive();
    }, [])

    return (
        <div ref={refSidebar} className={`fixed m-1 h-screen bg-gray-800 rounded-md overflow-hidden transition-all duration-300 ease text-white z-50 ${ size > 800 ? 'w-[270px]' : sidebarActive ? 'w-[270px]' : 'w-0' }`}>
            <div className="grid grid-cols-1 grid-rows-5 h-full pt-2">
                <div className="relative p-2 row-span-5">
                <div className="absolute top-0 flex items-center w-full py-2 gap-2 bg-gray-800 border-b border-gray-600">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX0pWSh3K9Ib9VoX64vTM_Pbu4GW0SYYoU1g&s" alt="" className="w-[50px] h-[50px] rounded-md bg-white" />
                    <div>
                        <h2 className="p-0 m-0 text-xl">Perusahaan</h2>
                        <p className="text-sm">Lorem ipsum dolor</p>
                    </div>
                </div>
                <div className="w-full h-[70px]"></div>
                <nav className="row-span-4 w-full h-[85%] border-0 overflow-y-scroll scroll-hidden">
                    <Link href="/dashboard" className={`flex items-center gap-2 w-full rounded-md ${isActive('/dashboard')}`}>
                        <Layout size={20} />
                        dashboard
                    </Link>
                    {sidebars.map(bar => (
                        <div className="w-full" key={bar.id}>
                            <button onClick={() => handleSidebar(bar.id)} className="flex items-center gap-2 p-2 w-full">
                                <div className="flex w-full items-center gap-2">
                                    {bar.icon}
                                    {bar.name}
                                </div>
                                <img src="/arrow_right.svg" alt="" className={`fill-white transition duration-300 ease ${bar.status ? 'rotate-90' : 'rotate-0'}`} />
                            </button>
                            <div className={`w-full transition-all overflow-hidden duration-300 ease`} style={{ height: `${bar.status ? `${bar.url.length * 45}` : '0'}px` }}>
                                <ul className="pl-3">
                                    {bar.url.map(url => (
                                        <li key={url.name}>
                                            <Link href={url.url} className={`block rounded-md w-full text-start ${isActive(url.url)}`}>
                                                {url.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                    <Link href="/ranking" className={`flex items-center gap-2 p-2 rounded-full w-full text-start ${isActive('/ranking')}`}>
                        <Star size={20} />
                        Ranking
                    </Link>
                </nav>
                </div>
                <div className="p-2 w-full border-t border-gray-600">
                    <button className="flex items-center justify-center gap-2 p-3 rounded-md bg-red-500 text-white w-full">
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}