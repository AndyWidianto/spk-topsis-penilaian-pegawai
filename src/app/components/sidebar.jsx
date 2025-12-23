"use client";
import {  CalendarCheck, Layout, LogOut, Star, Users2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar({ size, sidebarActive, actionSidebar, refSidebar }) {
    const [sidebars, setSidebars] = useState([
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
    ]);
    const pathname = usePathname();

    const isActive = (path) => {
        return `transition-all ease duration-300 ${path === pathname ? "bg-blue-500 text-white p-3" : "p-2"}`;
    }
    const handleSidebar = (id) => {
        const newSidebars = sidebars.map(side => {
            if (side.id === id) {
                side.status = !side.status;
            }
            return { ...side };
        })
        setSidebars(newSidebars);
    }

    const firtsActive = () => {
        const path = pathname.split("/")[2];
        if (path) {
            const newSidebars = sidebars.map(bar => {
                if (bar.name.toLowerCase() === path) {
                    bar.status = true;
                }
                return { ...bar };
            });
            setSidebars(newSidebars);
        }
    }
    useEffect(() => {
        firtsActive();
    }, [])

    return (
        <div ref={refSidebar} className={`fixed m-1 h-full bg-gray-800 rounded-md overflow-hidden transition-all duration-300 ease text-white z-50 ${ size > 800 ? 'w-[270px]' : sidebarActive ? 'w-[270px]' : 'w-0' }`}>
            <div className="grid grid-cols-1 pt-2">
                <div className="flex items-center gap-2 p-2">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX0pWSh3K9Ib9VoX64vTM_Pbu4GW0SYYoU1g&s" alt="" className="w-[50px] h-[50px] rounded-md bg-white" />
                    <div>
                        <h2 className="p-0 m-0 text-xl">Perusahaan</h2>
                        <p className="text-sm">Lorem ipsum dolor</p>
                    </div>
                </div>
                <div className="border border-gray-600 w-full border-b-tranparent border-r-transparent border-l-transparent"></div>
                <div className="mt-4"></div>
                <nav className="w-full p-2 h-[420px] overflow-y-scroll scroll-hidden">
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
                <div className="border border-gray-600"></div>
                <div className="p-2 w-full">
                    <button className="flex items-center justify-center gap-2 p-3 rounded-md bg-red-500 text-white w-full">
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}