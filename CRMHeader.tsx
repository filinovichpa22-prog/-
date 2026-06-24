"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CRMHeader() {
  const pathname = usePathname();

  const nav = [
    { href: "/manager", label: "Сделки" },
    { href: "#", label: "Товары и Склады" },
    { href: "/manager/clients", label: "Клиенты" },
    { href: "/production", label: "Производство" },
    { href: "#", label: "Продажи" },
    { href: "#", label: "Аналитика" },
    { href: "#", label: "Ещё" },
  ];

  return (
    <header
      className="flex items-center justify-between px-4 h-12 z-50 sticky top-0"
      style={{ backgroundColor: "#1e3a5f" }}
    >
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 mr-4">
          <div className="w-7 h-7 bg-orange-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">К</span>
          </div>
          <span className="text-white font-semibold text-sm">КухниПро</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                pathname === item.href
                  ? "bg-white/20 text-white"
                  : "text-blue-200 hover:text-white hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск..."
            className="bg-white/10 text-white placeholder-blue-300 text-xs px-3 py-1.5 rounded border border-white/20 w-40 focus:outline-none focus:border-white/40"
          />
          <svg className="absolute right-2 top-1.5 w-4 h-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <button className="text-blue-200 hover:text-white p-1.5 rounded hover:bg-white/10">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        <span className="text-blue-200 text-xs">15:34</span>

        <div className="w-7 h-7 rounded-full bg-blue-400 flex items-center justify-center cursor-pointer">
          <span className="text-white text-xs font-semibold">МА</span>
        </div>
      </div>
    </header>
  );
}
