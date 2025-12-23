"use client";
import { Bell, SquareChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header({ size, sidebarActive, actionSidebar }) {
    const [scrolled, setScrolled] = useState(false);

    function handleScroll() {
         setScrolled(window.scrollY > 20);
    }
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, []);
    return (
        <header className={`flex items-center justify-center fixed transition-all duration-200 ${size > 800 ? 'w-[calc(100%-270px)]' : 'w-full'} z-20 ml-2 p-2 gap-3 ${scrolled ? 'bg-gray-50': ''}`}>
            {size < 800 && <div className="p-1">
                <button onClick={() => actionSidebar()} className="text-gray-400"><SquareChevronRight size={25} /></button>
            </div>}
            <form className="w-full px-4">
                <div className="w-xl"><input type="text" className="border-2 border-gray-300 p-2 rounded-full px-4 w-full" placeholder="search" /></div>
            </form>
            <div className="w-10">
                <Bell size={25} />
            </div>
            <div className="p-2 shrink-0">20 Desember 2025</div>
        </header>
    );
}