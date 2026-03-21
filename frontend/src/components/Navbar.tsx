 "use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, LayoutGrid, Bell, ChevronDown, Menu } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileNavItems = [
    { name: "Home", href: "/" },
    { name: "My Groups", href: "/groups" },
    { name: "Assignments", href: "/assignment" },
    { name: "AI Teacher's Toolkit", href: "/toolkit" },
    { name: "My Library", href: "/library" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between rounded-full bg-[#F6F6F6] px-3 py-2 md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#2f3032] text-[18px] font-bold text-white">
            v
          </div>
          <h1 className="text-[19px] font-semibold tracking-[-0.02em] text-[#2f2f2f]">
            VedaAI
          </h1>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/notifications"
            className="relative grid h-10 w-10 place-items-center rounded-full bg-[#EFEFEF] text-[#2f2f2f]"
            aria-label="Notifications"
          >
            <Bell size={22} strokeWidth={2} />
            <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-[#f26a32]" />
          </Link>

          <Link
            href="/profile"
            className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#f3c67f] to-[#d68554] text-[10px] font-semibold text-[#2b2b2b]"
            aria-label="Profile"
          >
            JD
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className={`grid h-10 w-10 place-items-center rounded-full text-[#222227] transition ${
              isMobileMenuOpen ? "bg-[#E9E9E9]" : "hover:bg-[#ECECEC]"
            }`}
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu size={28} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="mt-2 rounded-2xl bg-[#F6F6F6] p-3 md:hidden">
          <Link
            href="/assignment/new"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mb-2 flex h-10 items-center justify-center rounded-full bg-[#2f3032] text-[13px] font-medium text-white"
          >
            Create Assignment
          </Link>
          <div className="space-y-1">
            {mobileNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-xl px-3 py-2 text-[14px] font-medium text-[#2f2f2f] transition hover:bg-[#ECECEC]"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <div className="hidden items-center justify-between rounded-full bg-[#F6F6F6] px-5 py-2.5 md:flex">
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="grid h-8 w-8 place-items-center rounded-full text-[#202020] transition hover:bg-[#ececec]"
            aria-label="Go back"
          >
            <ArrowLeft size={16} />
          </Link>

          <Link href="/assignment" className="flex items-center gap-2 text-[#979797]">
            <LayoutGrid size={13} />
            <span className="text-[14px] font-medium">Assignment</span>
          </Link>
        </div>

        <div className="flex items-center gap-3.5">
          <Link
            href="/notifications"
            className="relative grid h-8 w-8 place-items-center rounded-full text-[#3f3f3f] transition hover:bg-[#ececec]"
            aria-label="Notifications"
          >
            <Bell size={16} />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#ff6b2c]" />
          </Link>

          <div className="hidden h-5 w-px bg-[#e2e2e2] sm:block" />

          <Link
            href="/profile"
            className="flex items-center gap-2 rounded-full py-0.5 pr-1 transition hover:bg-[#ececec]"
          >
            <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#f3c67f] to-[#d68554] text-[10px] font-semibold text-[#2b2b2b]">
              JD
            </div>
            <span className="hidden text-[14px] font-semibold text-[#2f2f2f] sm:block">
              John Doe
            </span>
            <ChevronDown size={14} className="text-[#8a8a8a]" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
