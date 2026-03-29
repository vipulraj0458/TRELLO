import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Bell, Info } from 'react-feather';

export default function Navbar() {
  return (
    <nav
      className="flex h-12 w-full shrink-0 items-center justify-between border-b border-[#9fadbc29] bg-[#1d2125] px-3 md:px-6"
      aria-label="Primary"
    >
      <div className="flex min-w-0 items-center gap-1 md:gap-4">
        <Link
          to="/"
          className="flex h-8 shrink-0 items-center gap-2 rounded px-2 text-[#9fadbc] transition-colors hover:bg-[#a6c5e229]"
        >
          <span className="flex space-x-0.5" aria-hidden>
            <span className="h-3 w-1.5 rounded-sm bg-[#0c66e4]" />
            <span className="h-4 w-1.5 rounded-sm bg-[#0c66e4]" />
          </span>
          <span className="text-lg font-bold tracking-tight">Trello</span>
        </Link>

        <div className="hidden items-center text-sm font-semibold text-[#b6c2cf] md:flex">
          <button
            type="button"
            className="h-8 rounded px-3 transition-colors hover:bg-[#a6c5e229]"
          >
            Workspaces
          </button>
          <button
            type="button"
            className="h-8 rounded px-3 transition-colors hover:bg-[#a6c5e229]"
          >
            Recent
          </button>
          <button
            type="button"
            className="h-8 rounded px-3 transition-colors hover:bg-[#a6c5e229]"
          >
            Starred
          </button>
          <button
            type="button"
            className="h-8 rounded px-3 transition-colors hover:bg-[#a6c5e229]"
          >
            Templates
          </button>
          <Link
            to="/board"
            className="ml-2 flex h-8 items-center gap-1 rounded bg-[#579dff] px-3 font-semibold text-[#1d2125] transition-colors hover:bg-[#85b8ff]"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Create
          </Link>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <div className="relative hidden sm:block">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9fadbc]"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search"
            className="h-8 w-[min(200px,28vw)] rounded border border-[#738496] bg-[#22272b] py-1 pl-8 pr-3 text-sm text-[#b6c2cf] placeholder:text-[#738496] transition-all focus:border-[#579dff] focus:outline-none focus:ring-1 focus:ring-[#579dff]"
            autoComplete="off"
            aria-label="Search"
          />
        </div>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#9fadbc] transition-colors hover:bg-[#a6c5e229]"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="hidden h-8 w-8 items-center justify-center rounded-full text-[#9fadbc] transition-colors hover:bg-[#a6c5e229] md:flex"
          aria-label="Help"
        >
          <Info className="h-4 w-4" />
        </button>
        <div
          className="ml-0.5 flex h-8 w-8 cursor-default items-center justify-center rounded-full bg-[#579dff] text-sm font-bold text-[#1d2125]"
          aria-hidden
        >
          VR
        </div>
      </div>
    </nav>
  );
}
