import React from 'react';

function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="relative w-full">
      <input
        type="search"
        placeholder="Search cards…"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full rounded-md border border-[#dfe1e6] bg-white py-2 pl-3 pr-9 text-sm text-[#172b4d] shadow-sm placeholder:text-[#626f86] focus:border-[#388bff] focus:outline-none focus:ring-2 focus:ring-[#388bff]/30"
        autoComplete="off"
      />
      {searchQuery ? (
        <button
          type="button"
          onClick={() => setSearchQuery('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-[#626f86] hover:bg-black/5 hover:text-[#172b4d]"
          aria-label="Clear search"
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}

export default React.memo(SearchBar);
