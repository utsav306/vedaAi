"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, LayoutGrid, LibraryBig, Sparkles } from "lucide-react";
import type { ComponentType } from "react";

type MobileNavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  isActive: (pathname: string) => boolean;
};

const navItems: MobileNavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: LayoutGrid,
    isActive: (pathname) => pathname === "/",
  },
  {
    label: "Assignments",
    href: "/assignment",
    icon: Briefcase,
    isActive: (pathname) => pathname.startsWith("/assignment"),
  },
  {
    label: "Library",
    href: "/library",
    icon: LibraryBig,
    isActive: (pathname) => pathname.startsWith("/library"),
  },
  {
    label: "AI Toolkit",
    href: "/toolkit",
    icon: Sparkles,
    isActive: (pathname) => pathname.startsWith("/toolkit"),
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-5 z-[60] px-2 md:hidden">
      <div className="mx-auto flex w-full max-w-[400px] items-center justify-between rounded-[26px] bg-[#121315] px-3 py-2 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.7)]">
        {navItems.map((item) => {
          const active = item.isActive(pathname);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1.5 py-1 text-center transition ${
                active ? "text-white" : "text-[#646567]"
              }`}
            >
              <item.icon size={16} />
              <span className="truncate text-[11px] font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
