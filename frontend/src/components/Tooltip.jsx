import React, { useState } from 'react';

export default function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <div 
        className={`pointer-events-none absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#172b4d] px-2 py-1 flex items-center justify-center text-xs font-semibold text-white shadow-sm z-50 transition-all duration-200
          ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        {text}
      </div>
    </div>
  );
}
