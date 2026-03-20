import React from "react";
import Link from "next/link";
import {
  LayoutGrid,
  Users,
  FileText,
  BookOpen,
  Clock3,
  Settings,
  Sparkles,
} from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { name: "Home", icon: LayoutGrid, active: false, href: "/" },
    { name: "My Groups", icon: Users, active: false, href: "/groups" },
    { name: "Assignments", icon: FileText, active: true, href: "/assignment" },
    {
      name: "AI Teacher's Toolkit",
      icon: BookOpen,
      active: false,
      href: "/toolkit",
    },
    { name: "My Library", icon: Clock3, active: false, href: "/library" },
  ];

  return (
    <aside className="hidden shrink-0 lg:flex lg:w-[270px]">
      <div className="flex h-full w-full flex-col rounded-2xl bg-[#f5f5f5] px-5 py-6">
        <Link
          href="/"
          className="mb-8 flex items-center gap-2.5 rounded-xl p-1 transition hover:bg-[#ECECEC]"
        >
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#E9A96A] via-[#B34C31] to-[#52261F] text-base font-bold text-white">
            v
          </div>
          <h1 className="text-[24px] leading-none font-semibold tracking-[-0.02em] text-[#2f2f2f]">
            VedaAI
          </h1>
        </Link>

        <Link
          href="/assignment/new"
          className="mb-8 flex h-11 items-center justify-center gap-2 rounded-full border-2 border-[#B05935] bg-[#2f3032] text-[14px] font-medium text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] transition hover:brightness-110"
        >
          <Sparkles size={14} />
          <span>Create Assignment</span>
        </Link>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left transition ${
                item.active
                  ? "bg-[#EAEAEA] text-[#242424]"
                  : "text-[#7A7A7A] hover:bg-[#ECECEC]"
              }`}
            >
              <item.icon size={15} />
              <span className="text-[14px] font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-2.5 pt-7">
          <Link
            href="/settings"
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-[14px] font-medium text-[#767676] transition hover:bg-[#ECECEC]"
          >
            <Settings size={15} />
            <span>Settings</span>
          </Link>

          <Link
            href="/school-profile"
            className="flex items-center gap-3 rounded-2xl bg-[#E8E8E8] p-3 transition hover:bg-[#E1E1E1]"
          >
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#f7b267] to-[#cf6a41] text-xs font-semibold text-[#2a2a2a]">
              DS
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-[#303030]">
                Delhi Public School
              </p>
              <p className="truncate text-[12px] text-[#6f6f6f]">
                Bokaro Steel City
              </p>
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
