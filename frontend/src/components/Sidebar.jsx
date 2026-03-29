import React from 'react';
import { Inbox, Filter, MoreHorizontal, Plus, AlignLeft, CheckSquare } from 'react-feather';

function Sidebar() {
  return (
    <aside className="flex h-full w-full shrink-0 flex-col rounded-r-2xl bg-gradient-to-b from-[#0f172a] to-[#1e293b] p-4 text-white shadow-xl z-10">
      
      {/* Top section */}
      <div className="flex items-center justify-between mb-8 mt-2">
        <div className="flex items-center gap-2">
          <Inbox size={20} className="text-white" strokeWidth={2.5} />
          <h2 className="text-lg font-bold tracking-wide">Inbox</h2>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <Filter size={16} className="cursor-pointer hover:text-white transition-colors" />
          <MoreHorizontal size={16} className="cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Add a card button */}
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-700/60 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-colors shadow-sm">
          <Plus size={16} strokeWidth={3} />
          Add a card
        </button>

        {/* Card preview box */}
        <div className="flex w-full cursor-pointer flex-col gap-3 rounded-lg bg-slate-800 p-3 shadow-md border border-slate-700/50 hover:bg-slate-700/80 transition-colors">
          <p className="text-sm font-medium leading-snug text-slate-200 pr-2">
            See it, send it, save it for later
          </p>
          <div className="flex items-center gap-3 text-slate-400 mt-1">
            <AlignLeft size={14} />
            <CheckSquare size={14} />
          </div>
        </div>
      </div>
    </aside>
  );
}

export default React.memo(Sidebar);
