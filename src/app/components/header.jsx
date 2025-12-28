"use client";
import { Bell, Search, SquareChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Header({ size, sidebarActive, actionSidebar }) {
    const [scrolled, setScrolled] = useState(false);
    const [query, setQuery] = useState("");
    const [show, setShow] = useState(false);
    const sidebars = useSelector((state) => state.sidebar.sidebars);
    const filteredSidebars = sidebars.filter(side => query.trim() && side.name.toLowerCase().includes(query.toLowerCase()));

    function handleScroll() {
        setScrolled(window.scrollY > 20);
    }
    function DateNow() {
        const now = new Date();
        const formated = now.toLocaleDateString("US", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
        return formated;
    }
    function handleChange(e) {
        const { value } = e.target;
        setQuery(value);
        if (!value.trim()) {
            return setShow(false);
        }
        setShow(true);
    }
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, []);
    return (
        <header className={`flex items-center fixed transition-all duration-200 ${size > 800 ? 'w-[calc(100%-270px)]' : 'w-full'} z-20 ml-2 p-2 gap-3 bg-gray-50`}>
            {size < 800 && <div className="p-1">
                <button onClick={() => actionSidebar()} className="text-gray-400"><SquareChevronRight size={25} /></button>
            </div>}
            <div className="relative w-xl px-4">
                <div className="w-full relative flex items-center h-full">
                    <div className="absolute flex items-center text-gray-600 pl-4 h-full"><Search size={20} /></div>
                    <input type="text" onChange={handleChange} className="pl-10 p-2 rounded-full px-4 w-full bg-white" placeholder="search" />
                </div>
                <div className={`absolute top-15 w-full overflow-hidden`} style={{ maxHeight: `${show ? 300 : 0}px`}}>
                    <ul className="w-full overflow-y-scroll scroll-hidden h-full rounded-sm bg-white p-2">
                        {filteredSidebars.map(side => (
                            side.url.map((url, index) => (
                                <li key={index}>
                                    <Link href={url.url} className="block w-full p-2 hover:bg-gray-100">{url.name}</Link>
                                </li>
                            ))
                        ))}
                    </ul>
                </div>
            </div>
            <div className="ml-auto w-10">
                <Bell size={25} />
            </div>
            <div className="p-2 shrink-0">{DateNow()}</div>
        </header>
    );
}