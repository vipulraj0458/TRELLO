import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Bell, Info, Menu, X } from 'react-feather';
import Logo from './Logo';
import UserProfile from './UserProfile';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav
      className="flex h-[60px] w-full shrink-0 items-center justify-between border-b border-white/5 bg-[#0f172a] px-3 md:px-6 z-50 shadow-md relative"
      aria-label="Primary"
    >
      <div className="flex min-w-0 items-center gap-1 md:gap-4">
        <Logo />

        {/* Desktop Menu */}
        <div className="hidden items-center text-sm font-semibold text-[#b6c2cf] lg:flex">
          <button type="button" className="h-8 rounded px-3 transition-colors hover:bg-[#a6c5e229]">
            Workspaces
          </button>
          <button type="button" className="h-8 rounded px-3 transition-colors hover:bg-[#a6c5e229]">
            Recent
          </button>
          <button type="button" className="h-8 rounded px-3 transition-colors hover:bg-[#a6c5e229]">
            Starred
          </button>
          <button type="button" className="h-8 rounded px-3 transition-colors hover:bg-[#a6c5e229]">
            Templates
          </button>
          <Link
            to="/"
            className="ml-2 flex h-8 items-center gap-1 rounded bg-[#579dff] px-3 font-semibold text-[#1d2125] transition-colors hover:bg-[#85b8ff]"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Create
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-[#b6c2cf] hover:bg-white/10 lg:hidden"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
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
            className="h-9 w-[140px] md:w-[200px] rounded-md border border-slate-600 bg-slate-800/80 py-1 pl-8 pr-3 text-sm text-slate-200 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-inner"
            autoComplete="off"
          />
        </div>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#9fadbc] transition-colors hover:bg-[#a6c5e229]"
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="hidden h-8 w-8 items-center justify-center rounded-full text-[#9fadbc] transition-colors hover:bg-[#a6c5e229] md:flex"
        >
          <Info className="h-4 w-4" />
        </button>
        <div className="ml-1 items-center flex">
          <UserProfile name="Vipul Raj" />
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 top-[60px] z-50 w-full border-b border-white/10 bg-[#1d2125] p-4 lg:hidden animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-2">
            <button className="flex h-10 items-center px-3 text-sm font-semibold text-[#b6c2cf] hover:bg-white/5 rounded-md">Workspaces</button>
            <button className="flex h-10 items-center px-3 text-sm font-semibold text-[#b6c2cf] hover:bg-white/5 rounded-md">Recent</button>
            <button className="flex h-10 items-center px-3 text-sm font-semibold text-[#b6c2cf] hover:bg-white/5 rounded-md">Starred</button>
            <button className="flex h-10 items-center px-3 text-sm font-semibold text-[#b6c2cf] hover:bg-white/5 rounded-md">Templates</button>
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-2 flex h-10 items-center justify-center gap-2 rounded-md bg-[#579dff] font-semibold text-[#1d2125]"
            >
              <Plus size={18} />
              Create Board
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
