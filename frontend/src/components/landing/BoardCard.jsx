import React from 'react';
import { Link } from 'react-router-dom';

export default function BoardCard({ title, gradient }) {
  return (
    <Link
      to="/board"
      className={`group relative flex min-h-[120px] w-full min-w-[200px] max-w-[250px] cursor-pointer flex-col overflow-hidden rounded-lg shadow-sm ring-1 ring-white/5 transition-all duration-300 animate-fade-in-up hover:shadow-xl hover:ring-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#579dff]`}
    >
      <div
        className={`absolute inset-0 ${gradient} transition-transform duration-500 group-hover:scale-105`}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/10"
        aria-hidden
      />

      <div className="relative flex h-full min-h-[120px] flex-col p-3">
        <div className="min-h-0 flex-1">
          <h3 className="line-clamp-2 text-base font-bold leading-snug text-white">
            {title}
          </h3>
        </div>
        <div className="flex justify-end opacity-0 transition-opacity group-hover:opacity-100">
          <span className="text-white/50" aria-hidden>
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
