import React, { useState } from 'react';
import { Check, Edit2 } from 'react-feather';
import LabelBadge from './LabelBadge';

export default function Card({
  item,
  cardProvided,
  snapshot,
  onSelectCard,
  listId
}) {
  const [isCompleted, setIsCompleted] = useState(item.isCompleted || false);

  const toggleComplete = (e) => {
    e.stopPropagation();
    setIsCompleted(!isCompleted);
  };

  const handleCheckboxMouseDown = (e) => {
    // Ensures clicking the checkbox doesn't initiate a card drag via react-beautiful-dnd
    e.stopPropagation();
  };

  // Derive label logic ensuring legacy arrays correctly translate into standardized colors
  let labelType = item.label;
  if (!labelType && item.labels && item.labels.length > 0) {
    const col = item.labels[0].toLowerCase();
    if (col === '#ef4444' || col === 'red') labelType = 'red';
    else if (col === '#10b981' || col === 'green') labelType = 'green';
    else if (col === '#f59e0b' || col === 'yellow') labelType = 'yellow';
    else if (col === '#3b82f6' || col === 'blue' || col === '#0079bf') labelType = 'blue';
  }

  return (
    <div
      ref={cardProvided.innerRef}
      {...cardProvided.draggableProps}
      {...cardProvided.dragHandleProps}
      className={`group relative flex min-w-0 flex-col gap-2 rounded-md bg-white/10 p-3 shadow-sm hover:bg-white/20 transition-colors
        ${isCompleted && !snapshot?.isDragging ? 'opacity-60' : ''}`}
      style={{
        ...cardProvided.draggableProps.style,
        background: snapshot?.isDragging ? 'rgba(255,255,255,0.2)' : undefined,
        zIndex: snapshot?.isDragging ? 999 : undefined,
        boxShadow: snapshot?.isDragging
          ? '0 8px 16px rgba(0, 0, 0, 0.4)' 
          : '0 1px 3px rgba(0, 0, 0, 0.1)',
        ...(snapshot?.isDragging && cardProvided.draggableProps.style?.transform ? {
          transform: `${cardProvided.draggableProps.style.transform} scale(1.03)`
        } : {}),
        transition: cardProvided.draggableProps.style?.transition
          ? `${cardProvided.draggableProps.style.transition}, box-shadow 0.2s ease`
          : 'box-shadow 0.2s ease'
      }}
    >
      {/* Edit Icon (appears on hover) */}
      <button
        type="button"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onSelectCard(listId, item.id);
        }}
        className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded bg-black/20 text-white opacity-0 transition-opacity hover:bg-black/40 group-hover:opacity-100"
        aria-label="Edit card"
      >
        <Edit2 size={12} strokeWidth={2.5} />
      </button>

      {/* Label section */}
      {labelType && (
        <div className="flex">
          <LabelBadge type={labelType} />
        </div>
      )}

      {/* Main Content: Checkbox + Title */}
      <div className="flex items-start gap-2.5">
        <button
          onClick={toggleComplete}
          onMouseDown={handleCheckboxMouseDown}
          className={`mt-[2px] flex h-[16px] w-[16px] shrink-0 transition-colors focus:outline-none items-center justify-center rounded-[3px]
            ${isCompleted ? 'bg-[#10b981] text-white' : 'bg-white/20 hover:bg-white/30'}`}
          aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          {isCompleted && <Check size={12} strokeWidth={4} />}
        </button>

        <span
          className={`line-clamp-4 break-words text-sm font-medium leading-tight transition-all flex-1 pr-4
            ${isCompleted ? 'text-white/50 line-through' : 'text-white/90'}`}
        >
          {item.title}
        </span>
      </div>
    </div>
  );
}
