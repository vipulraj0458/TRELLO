import React from 'react';
import { Link } from 'react-router-dom';
import BoardMenu from './BoardMenu';

export default function BoardCard({ id, title, gradient, onEdit, onDelete, onArchive }) {
  return (
    <div className="group relative flex min-h-[120px] w-full min-w-[200px] max-w-[250px] flex-col overflow-hidden rounded-lg shadow-sm ring-1 ring-white/5 transition-all duration-300 animate-fade-in-up hover:shadow-xl hover:ring-white/10">
      <Link
        to={`/board/${id}`}
        className="absolute inset-0 z-0"
        aria-label={`Open board ${title}`}
      >
        <div
          className={`absolute inset-0 ${gradient} transition-transform duration-500 group-hover:scale-105`}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/10"
          aria-hidden
        />
      </Link>

      <div className="relative flex h-full min-h-[120px] flex-col p-3 pointer-events-none">
        <div className="min-h-0 flex-1">
          <h3 className="line-clamp-2 text-base font-bold leading-snug text-white">
            {title}
          </h3>
        </div>
      </div>

      {/* Action Menu - handles its own clicks and stopPropagation */}
      <div className="absolute top-2 right-2 z-10">
        <BoardMenu 
          boardId={id} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          onArchive={onArchive} 
        />
      </div>
    </div>
  );
}
