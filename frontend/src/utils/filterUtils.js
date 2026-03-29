export const filterCards = (cards, searchQuery, filters) => {
  return cards.filter(card => {
    // 1. Search filter (Partial text match, case-insensitive)
    if (searchQuery) {
      const matchSearch = card.title?.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;
    }

    // 2. Labels filter
    if (filters.labels && filters.labels.length > 0) {
      // In this app, card.labels is an array of color strings
      const hasMatchingLabel = card.labels?.some(color => 
        filters.labels.includes(color)
      );
      if (!hasMatchingLabel) return false;
    }

    // 3. Members filter
    if (filters.members && filters.members.length > 0) {
      // In this app, card.members is an array of member names
      const hasMatchingMember = card.members?.some(member => 
        filters.members.includes(member)
      );
      if (!hasMatchingMember) return false;
    }

    // 4. Due Date filter
    if (filters.dueDate) {
      if (!card.dueDate) return false;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const dueDate = new Date(card.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      if (filters.dueDate === 'overdue' && dueDate >= today) return false;
      if (filters.dueDate === 'today' && dueDate.getTime() !== today.getTime()) return false;
      if (filters.dueDate === 'upcoming') {
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        if (dueDate <= today || dueDate > nextWeek) return false;
      }
    }

    return true;
  });
};
