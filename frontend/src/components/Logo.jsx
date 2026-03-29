import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link
      to="/"
      className="flex h-8 shrink-0 items-center gap-2 rounded px-2 text-[#9fadbc] transition-colors hover:bg-[#a6c5e229]"
    >
      <span className="flex space-x-0.5" aria-hidden="true">
        <span className="h-3 w-1.5 rounded-sm bg-[#0c66e4]" />
        <span className="h-4 w-1.5 rounded-sm bg-[#0c66e4]" />
      </span>
      <span className="text-lg font-bold tracking-tight text-[#dfe1e6]">Trello Clone</span>
    </Link>
  );
}
