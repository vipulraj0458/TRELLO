/**
 * Immutable updates for the active board's lists/cards.
 */

export function findCard(board, listId, cardId) {
  if (!board?.list) return null;
  const lid = String(listId);
  const cid = String(cardId);
  const list = board.list.find((l) => String(l.id) === lid);
  if (!list) return null;
  return list.items.find((c) => String(c.id) === cid) ?? null;
}

/**
 * Finds a card anywhere on the board by id (card ids must be unique across lists).
 * Used when listId in UI state may be stale after a drag.
 */
export function findCardLocation(board, cardId) {
  if (!board?.list || cardId == null) return null;
  const cid = String(cardId);
  for (const list of board.list) {
    const card = list.items.find((c) => String(c.id) === cid);
    if (card) return { list, card };
  }
  return null;
}

export function replaceCardInBoard(allboard, activeIndex, listId, cardId, nextCard) {
  const lid = String(listId);
  const cid = String(cardId);
  const boards = allboard.boards.map((b, bi) => {
    if (bi !== activeIndex) return b;
    const li = b.list.findIndex((l) => String(l.id) === lid);
    if (li === -1) return b;
    const list = b.list[li];
    const ci = list.items.findIndex((c) => String(c.id) === cid);
    if (ci === -1) return b;
    const items = list.items.map((c, j) => (j === ci ? { ...nextCard } : c));
    const nextList = [...b.list];
    nextList[li] = { ...list, items };
    return { ...b, list: nextList };
  });
  return { ...allboard, boards };
}

export function updateListTitle(allboard, activeIndex, listId, title) {
  const lid = String(listId);
  const boards = allboard.boards.map((b, bi) => {
    if (bi !== activeIndex) return b;
    const next = b.list.map((l) =>
      String(l.id) === lid ? { ...l, title } : l
    );
    return { ...b, list: next };
  });
  return { ...allboard, boards };
}

export function removeListById(allboard, activeIndex, listId) {
  const lid = String(listId);
  const boards = allboard.boards.map((b, bi) => {
    if (bi !== activeIndex) return b;
    return { ...b, list: b.list.filter((l) => String(l.id) !== lid) };
  });
  return { ...allboard, boards };
}

export function reorderLists(allboard, activeIndex, fromIndex, toIndex) {
  const board = allboard.boards[activeIndex];
  if (!board?.list) return allboard;
  const len = board.list.length;
  if (
    fromIndex < 0 ||
    fromIndex >= len ||
    toIndex < 0 ||
    toIndex >= len ||
    fromIndex === toIndex
  ) {
    return allboard;
  }
  const next = [...board.list];
  const [moved] = next.splice(fromIndex, 1);
  if (moved === undefined) return allboard;
  next.splice(toIndex, 0, moved);
  const boards = allboard.boards.map((b, i) =>
    i === activeIndex ? { ...b, list: next } : b
  );
  return { ...allboard, boards };
}

/**
 * Reorder cards using full (unfiltered) lists. destinationIndex is the index in the visible list;
 * when filters are off it matches full list. When filters are on, card drag is disabled.
 */
export function moveCardBetweenLists(
  allboard,
  activeIndex,
  sourceListId,
  destListId,
  draggableId,
  destinationIndex,
  visibleDestItems
) {
  const board = allboard.boards[activeIndex];
  if (!board) return allboard;

  const lists = board.list.map((l) => ({
    ...l,
    items: [...l.items],
  }));

  const sid = String(sourceListId);
  const did = String(destListId);
  const srcIdx = lists.findIndex((l) => String(l.id) === sid);
  const dstIdx = lists.findIndex((l) => String(l.id) === did);
  if (srcIdx === -1 || dstIdx === -1) return allboard;

  const movedIndex = lists[srcIdx].items.findIndex(
    (c) => String(c.id) === String(draggableId)
  );
  if (movedIndex === -1) return allboard;

  const [moved] = lists[srcIdx].items.splice(movedIndex, 1);

  const itemAtDest = visibleDestItems[destinationIndex];
  if (itemAtDest) {
    const insertIndex = lists[dstIdx].items.findIndex(
      (c) => String(c.id) === String(itemAtDest.id)
    );
    if (insertIndex >= 0) lists[dstIdx].items.splice(insertIndex, 0, moved);
    else lists[dstIdx].items.push(moved);
  } else {
    lists[dstIdx].items.push(moved);
  }

  const boards = allboard.boards.map((b, i) =>
    i === activeIndex ? { ...b, list: lists } : b
  );
  return { ...allboard, boards };
}

export function nextListId(existingLists) {
  const nums = existingLists
    .map((l) => parseInt(String(l.id), 10))
    .filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return String(max + 1);
}
