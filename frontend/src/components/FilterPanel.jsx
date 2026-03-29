import React from 'react';

// Hardcoded labels as present in the CardModal component
const availableLabels = [
  { color: "#ef4444", name: "Red" },
  { color: "#22c55e", name: "Green" },
  { color: "#3b82f6", name: "Blue" },
  { color: "#eab308", name: "Yellow" }
];

const FilterPanel = ({ filters, setFilters, clearFilters, availableMembers }) => {

  const toggleLabel = (color) => {
    setFilters(prev => ({
      ...prev,
      labels: prev.labels.includes(color)
        ? prev.labels.filter(c => c !== color)
        : [...prev.labels, color]
    }));
  };

  const toggleMember = (member) => {
    setFilters(prev => ({
      ...prev,
      members: prev.members.includes(member)
        ? prev.members.filter(m => m !== member)
        : [...prev.members, member]
    }));
  };

  const setDueDate = (value) => {
    setFilters(prev => ({
      ...prev,
      dueDate: prev.dueDate === value ? null : value
    }));
  };

  const hasActiveFilters = filters.labels.length > 0 || filters.members.length > 0 || filters.dueDate;

  return (
    <div className="filter-panel w-[min(100vw-2rem,20rem)] rounded-lg border border-gray-200 bg-white p-4 text-black shadow-xl sm:w-80">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700">Filter Cards</h3>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-xs font-semibold text-blue-500 hover:text-blue-700 hover:underline">
            Clear all
          </button>
        )}
      </div>

      {/* Labels Filter */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Labels</h4>
        {availableLabels.map(label => (
          <label key={label.color} className="flex items-center space-x-2 mb-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.labels.includes(label.color)}
              onChange={() => toggleLabel(label.color)}
              className="rounded cursor-pointer"
            />
            <div className="w-8 h-4 rounded" style={{ backgroundColor: label.color }}></div>
          </label>
        ))}
      </div>

      {/* Members Filter */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Members</h4>
        {availableMembers.length === 0 && <p className="text-sm text-gray-400">No members assigned on board</p>}
        {availableMembers.map(member => (
          <label key={member} className="flex items-center space-x-2 mb-1 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.members.includes(member)}
              onChange={() => toggleMember(member)}
              className="rounded cursor-pointer"
            />
            <span className="text-sm text-gray-700">{member}</span>
          </label>
        ))}
      </div>

      {/* Due Date Filter */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Due Date</h4>
        {['overdue', 'today', 'upcoming'].map(dateOption => (
          <label key={dateOption} className="flex items-center space-x-2 mb-1 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.dueDate === dateOption}
              onChange={() => setDueDate(dateOption)}
              className="rounded cursor-pointer"
            />
            <span className="text-sm text-gray-700 capitalize">{dateOption}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterPanel;
