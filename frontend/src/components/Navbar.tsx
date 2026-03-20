import React from "react";
import Link from "next/link";
import { ArrowLeft, LayoutGrid, Bell, ChevronDown } from "lucide-react";

const Navbar = () => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between rounded-2xl bg-[#F6F6F6] px-5 py-2.5">
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
