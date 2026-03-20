import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="flex min-h-[68vh] flex-col items-center justify-center px-4 pb-6 text-center">
      <div className="relative mb-7">
        <div className="absolute -left-5 -top-5 -z-10 h-44 w-44 rounded-full bg-[#EDEDED]" />

        <svg
          width="220"
          height="180"
          viewBox="0 0 270 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto h-[180px] w-[220px]"
        >
          <path
            d="M58 90C80 80 93 66 107 45"
            stroke="#1C2A3A"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <circle cx="76" cy="84" r="9" stroke="#1C2A3A" strokeWidth="2" />

          <rect x="108" y="55" width="95" height="120" rx="16" fill="white" />
          <rect
            x="108"
            y="55"
            width="95"
            height="120"
            rx="16"
            stroke="#ECECEC"
            strokeWidth="2"
          />
          <rect x="121" y="73" width="41" height="8" rx="4" fill="#0A1D2E" />
          <rect x="121" y="95" width="70" height="7" rx="3.5" fill="#D4D4D4" />
          <rect x="121" y="115" width="70" height="7" rx="3.5" fill="#D4D4D4" />
          <rect x="121" y="135" width="42" height="7" rx="3.5" fill="#D4D4D4" />

          <circle cx="176" cy="132" r="47" stroke="#C7C2D7" strokeWidth="9" fill="#F7F7FB" />
          <line
            x1="206"
            y1="163"
            x2="235"
            y2="191"
            stroke="#C7C2D7"
            strokeWidth="14"
            strokeLinecap="round"
          />

          <path d="M163 118L190 146" stroke="#F35A4B" strokeWidth="8" strokeLinecap="round" />
          <path d="M190 118L163 146" stroke="#F35A4B" strokeWidth="8" strokeLinecap="round" />

          <rect x="210" y="75" width="60" height="35" rx="6" fill="white" stroke="#E8E8E8" strokeWidth="2" />
          <circle cx="224" cy="93" r="5" fill="#C8C5D4" />
          <rect x="237" y="87" width="25" height="10" rx="5" fill="#CCCCCC" />
          <path d="M103 159L109 165L103 171L97 165L103 159Z" fill="#5A88B8" />
          <circle cx="256" cy="145" r="5" fill="#5A88B8" />
        </svg>
      </div>

      <h2 className="mb-3 text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-[#2D2D2D]">
        No assignments yet
      </h2>
      <p className="mb-8 max-w-[620px] text-[14px] leading-[1.5] text-[#6F6F6F]">
        Create your first assignment to start collecting and grading student
        submissions. You can set up rubrics, define marking criteria, and let AI
        assist with grading.
      </p>

      <Link
        href="/assignment/new"
        className="group relative inline-flex h-10 items-center gap-2 rounded-full bg-[#18191B] px-6 text-white shadow-[0_10px_25px_-15px_rgba(0,0,0,0.8)] transition hover:brightness-110"
      >
        <span className="absolute inset-0 rounded-full border-2 border-[#D65F36] opacity-80" />
        <Plus size={16} className="relative" />
        <span className="relative text-[14px] font-semibold leading-none">
          Create Your First Assignment
        </span>
      </Link>
    </div>
  );
};

export default EmptyState;
