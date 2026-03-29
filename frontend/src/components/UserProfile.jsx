import React from 'react';

// Dynamically extracts initials from a given name string
const getInitials = (name) => {
  if (!name) return '?';
  const nameParts = name.trim().split(/\s+/);
  
  if (nameParts.length === 1) {
    return nameParts[0].substring(0, 2).toUpperCase();
  }
  
  return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
};

export default function UserProfile({ name }) {
  const initials = getInitials(name);

  return (
    <div className="flex shrink-0 cursor-pointer items-center gap-2 transition-opacity hover:opacity-80">
      <span className="hidden truncate text-sm font-semibold text-[#b6c2cf] sm:block">
        {name}
      </span>
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#579dff] text-sm font-bold text-[#1d2125] ring-1 ring-[#579dff]/50"
        title={name}
        aria-hidden="true"
      >
        {initials}
      </div>
    </div>
  );
}
