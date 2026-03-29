import React from 'react';
import { UserPlus, Filter, MoreHorizontal } from 'react-feather';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';

function BoardToolbar({
  boardName,
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  clearFilters,
  availableMembers,
  activeFilterCount,
  filterPanelRef,
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-white/10 bg-black/25 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <h2 className="min-w-0 shrink truncate text-lg font-semibold text-white md:text-xl">
        {boardName}
      </h2>

      <div className="flex min-w-0 flex-wrap items-center gap-2 sm:justify-end">
        <div className="min-w-0 flex-1 sm:flex-initial sm:max-w-[min(100%,20rem)]">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        <div className="relative" ref={filterPanelRef}>
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeFilterCount > 0
                ? 'bg-[#579dff] text-white hover:bg-[#4c8ce8]'
                : 'bg-white/10 text-[#b6c2cf] hover:bg-white/15'
            }`}
          >
            <Filter size={16} className="mr-2 shrink-0" aria-hidden />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 rounded bg-black/20 px-1.5 text-xs">{activeFilterCount}</span>
            )}
          </button>

          {showFilters && (
            <div className="absolute right-0 top-full z-[60] mt-2 max-h-[min(70vh,32rem)] overflow-y-auto">
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                clearFilters={clearFilters}
                availableMembers={availableMembers}
              />
            </div>
          )}
        </div>

        <button
          type="button"
          className="flex items-center rounded-md bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/15"
        >
          <UserPlus size={16} className="mr-1.5 shrink-0" aria-hidden />
          Share
        </button>
        <button
          type="button"
          className="rounded-md p-2 text-[#b6c2cf] hover:bg-white/10"
          aria-label="Board menu"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}

export default React.memo(BoardToolbar);
