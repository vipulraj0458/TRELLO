import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-[#9fadbc29] bg-[#1d2125] px-3 md:px-4">
      <div className="flex min-w-0 items-center gap-2">
        <Link
          to="/"
          className="truncate text-sm font-semibold tracking-tight text-slate-50 transition-colors hover:text-white md:text-base"
        >
          TRELLO CLONE
        </Link>
      </div>
      <div className="flex shrink-0 items-center gap-2 md:gap-4">
        <span className="hidden max-w-[8rem] truncate text-sm text-[#b6c2cf] sm:inline md:max-w-none">
          Vipul Raj
        </span>
        <img
          className="h-7 w-7 shrink-0 rounded-full ring-1 ring-white/10 md:h-8 md:w-8"
          src="https://placehold.co/32x32/png"
          alt=""
        />
      </div>
    </header>
  );
}

export default React.memo(Header);
