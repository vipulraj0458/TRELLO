import React from 'react';
import { Link } from 'react-router-dom';

export default function TemplateCard({ title, gradient }) {
  return (
    <Link
      to="/board"
      className="group relative flex min-h-[100px] w-[220px] shrink-0 cursor-pointer overflow-hidden rounded-lg shadow-sm ring-1 ring-white/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:ring-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#579dff] sm:w-[240px]"
    >
      <div
        className={`absolute inset-0 ${gradient} opacity-90 transition-opacity group-hover:opacity-100`}
        aria-hidden
      />
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-3">
        <h4 className="truncate text-sm font-bold text-white">{title}</h4>
        <p className="mt-0.5 text-xs text-white/70">Use template</p>
      </div>
      <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
        <span
          className="flex h-7 w-7 items-center justify-center rounded bg-white/25 text-white backdrop-blur-sm transition-colors hover:bg-white/35"
          aria-hidden
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
