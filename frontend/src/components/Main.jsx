import React, { useContext, useState, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { BoardContext } from '../context/BoardContext';
import BoardToolbar from './BoardToolbar';
import KanbanListColumn from './KanbanListColumn';
import CardModal from './CardModal';
import AddList from './AddList';
import Utils from '../utils/Utils';
import { updateList } from '../api/api';
import { filterCards } from '../utils/filterUtils';
import {
  moveCardBetweenLists,
  nextListId,
  removeListById,
  reorderLists,
  updateListTitle,
} from '../utils/boardUtils';
import { useClickOutside } from '../hooks/useClickOutside';

function Main() {
  const { allboard, setAllBoard } = useContext(BoardContext);
  const bdata = allboard.boards[allboard.active];

  const [menuListId, setMenuListId] = useState(null);
  const [editListId, setEditListId] = useState(null);
  const [editText, setEditText] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    labels: [],
    members: [],
    dueDate: null,
  });
  const [showFilters, setShowFilters] = useState(false);

  /** Avoid persisting list title when Escape cancels edit (blur may still fire). */
  const cancelingListEditRef = useRef(false);

  const menuRef = useClickOutside(menuListId !== null, () => setMenuListId(null));
  const filterRef = useClickOutside(showFilters, () => setShowFilters(false));

  const availableMembers = useMemo(() => {
    const membersSet = new Set();
    bdata?.list?.forEach((list) => {
      list.items.forEach((item) => {
        item.members?.forEach((m) => membersSet.add(m));
      });
    });
    return Array.from(membersSet);
  }, [bdata]);

  const filteredLists = useMemo(() => {
    if (!bdata?.list) return [];
    return bdata.list.map((list) => ({
      ...list,
      items: filterCards(list.items, searchQuery, filters),
    }));
  }, [bdata, searchQuery, filters]);

  const activeFilterCount =
    filters.labels.length +
    filters.members.length +
    (filters.dueDate ? 1 : 0);
  const hasFilterOrSearch =
    Boolean(searchQuery.trim()) || activeFilterCount > 0;
  const isCardDragDisabled = hasFilterOrSearch;

  const clearFilters = useCallback(() => {
    setFilters({ labels: [], members: [], dueDate: null });
  }, []);

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;
      const { source, destination, type, draggableId } = result;

      if (type === 'list') {
        if (source.index === destination.index) return;
        setAllBoard((prev) =>
          reorderLists(prev, prev.active, source.index, destination.index)
        );
        return;
      }

      if (isCardDragDisabled) return;

      const sourceListId = source.droppableId;
      const destListId = destination.droppableId;

      if (String(sourceListId) === String(destListId)) {
        setAllBoard((prev) => {
          const board = prev.boards[prev.active];
          if (!board?.list) return prev;
          const list = board.list.find(
            (l) => String(l.id) === String(sourceListId)
          );
          if (!list) return prev;
          const items = [...list.items];
          const from = source.index;
          const to = destination.index;
          if (from === to) return prev;
          const [moved] = items.splice(from, 1);
          items.splice(to, 0, moved);
          return {
            ...prev,
            boards: prev.boards.map((b, i) =>
              i === prev.active
                ? {
                  ...b,
                  list: b.list.map((l) =>
                    String(l.id) === String(sourceListId)
                      ? { ...l, items }
                      : l
                  ),
                }
                : b
            ),
          };
        });
        return;
      }

      setAllBoard((prev) => {
        const board = prev.boards[prev.active];
        if (!board?.list) return prev;
        const filtered = board.list.map((list) => ({
          ...list,
          items: filterCards(list.items, searchQuery, filters),
        }));
        const destList = filtered.find(
          (l) => String(l.id) === String(destListId)
        );
        const visibleDestItems = destList ? destList.items : [];
        return moveCardBetweenLists(
          prev,
          prev.active,
          sourceListId,
          destListId,
          draggableId,
          destination.index,
          visibleDestItems
        );
      });
    },
    [filters, isCardDragDisabled, searchQuery, setAllBoard]
  );

  const onSelectCard = useCallback((listId, cardId) => {
    setSelectedCard({ listId, cardId });
  }, []);

  const onAddCard = useCallback((listId, title) => {
    setAllBoard((prev) => {
      const bi = prev.active;
      if (!prev.boards[bi]) return prev;
      const boards = prev.boards.map((b, i) => {
        if (i !== bi) return b;
        return {
          ...b,
          list: b.list.map((l) => {
            if (String(l.id) !== String(listId)) return l;
            return {
              ...l,
              items: [
                ...l.items,
                {
                  id: Utils.makeid(5),
                  title,
                  description: '',
                  labels: [],
                  dueDate: '',
                  checklist: [],
                  members: [],
                },
              ],
            };
          }),
        };
      });
      return { ...prev, boards };
    });
  }, [setAllBoard]);

  const listData = useCallback((title) => {
    if (!title.trim()) return;
    setAllBoard((prev) => {
      const bi = prev.active;
      const board = prev.boards[bi];
      if (!board) return prev;
      const id = nextListId(board.list);
      const boards = prev.boards.map((b, i) =>
        i === bi
          ? {
            ...b,
            list: [...b.list, { id, title: title.trim(), items: [] }],
          }
          : b
      );
      return { ...prev, boards };
    });
  }, [setAllBoard]);

  const saveListTitle = useCallback(
    async (listId) => {
      if (cancelingListEditRef.current) {
        cancelingListEditRef.current = false;
        return;
      }
      if (!bdata?.list) {
        setEditListId(null);
        return;
      }
      const list = bdata.list.find((l) => String(l.id) === String(listId));
      if (!list) {
        setEditListId(null);
        return;
      }
      const next = editText.trim() || list.title;
      setAllBoard((prev) => updateListTitle(prev, prev.active, listId, next));
      setEditListId(null);
      
      if (next !== list.title) {
        try {
          await updateList(listId, next);
        } catch (err) {
          console.error("Failed to update list title in backend", err);
          // Optional: handle rollback if required
        }
      }
    },
    [bdata, editText, setAllBoard]
  );

  const cancelListEdit = useCallback(() => {
    cancelingListEditRef.current = true;
    setEditListId(null);
  }, []);

  const onEditList = useCallback((listId, title) => {
    setEditListId(listId);
    setEditText(title);
    setMenuListId(null);
  }, []);

  const onToggleListMenu = useCallback((listId) => {
    setMenuListId((id) =>
      id != null && String(id) === String(listId) ? null : listId
    );
  }, []);

  const deleteList = useCallback(
    (listId) => {
      setAllBoard((prev) => removeListById(prev, prev.active, listId));
      setMenuListId(null);
      setEditListId(null);
      setSelectedCard((sel) =>
        sel && String(sel.listId) === String(listId) ? null : sel
      );
    },
    [setAllBoard]
  );

  const archiveList = useCallback(
    (listId) => {
      deleteList(listId);
    },
    [deleteList]
  );

  if (!bdata) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-6 text-center text-[#9fadbc]">
        <p className="text-sm">No board is available at this index.</p>
        <Link
          to="/"
          className="rounded-md bg-[#579dff] px-4 py-2 text-sm font-semibold text-[#1d2125] hover:bg-[#85b8ff]"
        >
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col p-6">
      <div className="mb-4">
        <h1 className="text-xl font-medium text-white">My Trello board</h1>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className="h-full overflow-x-auto overflow-y-hidden [-webkit-overflow-scrolling:touch]">
          <div className="flex h-full items-start gap-4 pb-4">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable
                droppableId="all-lists"
                direction="horizontal"
                type="list"
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-row items-start gap-4"
                  >
                    {filteredLists.map((list, ind) => (
                      <Draggable
                        key={String(list.id)}
                        draggableId={String(list.id)}
                        index={ind}
                      >
                        {(p) => (
                          <KanbanListColumn
                            list={list}
                            listIndex={ind}
                            listInnerRef={p.innerRef}
                            listDraggableProps={p.draggableProps}
                            listDragHandleProps={p.dragHandleProps}
                            editListId={editListId}
                            editText={editText}
                            setEditText={setEditText}
                            onSaveListTitle={saveListTitle}
                            onCancelListEdit={cancelListEdit}
                            menuListId={menuListId}
                            onToggleListMenu={onToggleListMenu}
                            onEditList={onEditList}
                            onDeleteList={deleteList}
                            onArchiveList={archiveList}
                            filteredItems={list.items}
                            isCardDragDisabled={isCardDragDisabled}
                            onSelectCard={onSelectCard}
                            onAddCard={onAddCard}
                            listMenuRef={
                              menuListId != null &&
                                String(menuListId) === String(list.id)
                                ? menuRef
                                : undefined
                            }
                          />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <AddList onAddList={listData} />
          </div>
        </div>
      </div>

      <CardModal
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
        allboard={allboard}
        setAllBoard={setAllBoard}
      />
    </div>
  );
}

export default React.memo(Main);
