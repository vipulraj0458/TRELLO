import React, { useState, useEffect, useRef } from 'react';
import { MoreHorizontal, Edit2, Archive, Trash2, X } from 'react-feather';

export default function BoardMenu({ boardId, onEdit, onDelete, onArchive }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  const handleAction = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    action(boardId);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={toggleMenu}
        className="flex h-8 w-8 items-center justify-center rounded-md bg-black/10 text-white/80 opacity-0 transition-all hover:bg-black/20 group-hover:opacity-100 focus:outline-none"
        aria-label="Board actions"
      >
        <MoreHorizontal size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-9 z-50 w-48 rounded-md border border-white/5 bg-[#1d2125] py-1 shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between border-b border-white/5 px-3 py-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9fadbc]">
              Board Actions
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#9fadbc] hover:text-white"
            >
              <X size={14} />
            </button>
          </div>

          <div className="p-1">
            <button
              onClick={(e) => handleAction(e, onEdit)}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-[#dfe1e6] transition-colors hover:bg-white/5"
            >
              <Edit2 size={14} />
              Edit Board
            </button>
            <button
              onClick={(e) => handleAction(e, onArchive)}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-[#dfe1e6] transition-colors hover:bg-white/5"
            >
              <Archive size={14} />
              Archive Board
            </button>
            <div className="my-1 border-t border-white/5" />
            <button
              onClick={(e) => handleAction(e, onDelete)}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
            >
              <Trash2 size={14} />
              Delete Board
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
