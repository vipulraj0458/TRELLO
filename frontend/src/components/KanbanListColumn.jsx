import React from 'react';
import { MoreHorizontal } from 'react-feather';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import CardAdd from './CardAdd';
import Card from './Card';

function KanbanListColumn({
  list,
  listInnerRef,
  listDraggableProps,
  listDragHandleProps,
  editListId,
  editText,
  setEditText,
  onSaveListTitle,
  onCancelListEdit,
  menuListId,
  onToggleListMenu,
  onEditList,
  onDeleteList,
  onArchiveList,
  filteredItems,
  isCardDragDisabled,
  onSelectCard,
  onAddCard,
  listMenuRef,
  listIndex,
}) {
  const getListTheme = (index) => {
    if (index === 0) return 'bg-[#7c5c00] text-[#fef08a]';
    if (index === 1) return 'bg-[#14532d] text-white';
    if (index === 2) return 'bg-[#000000] text-white';
    return 'bg-[#000000] text-white';
  };
  const theme = getListTheme(listIndex);

  const isEditing =
    editListId != null && String(editListId) === String(list.id);
  const menuOpen =
    menuListId != null && String(menuListId) === String(list.id);

  return (
    <div
      ref={listInnerRef}
      {...listDraggableProps}
      className={`flex w-[85vw] md:w-[272px] shrink-0 scroll-ml-6 snap-start flex-col rounded-xl p-4 shadow-sm ${theme}`}
    >
      <div
        {...listDragHandleProps}
        className="flex cursor-grab items-start justify-between gap-2 mb-3 active:cursor-grabbing"
      >
        {isEditing ? (
          <input
            autoFocus
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={() => onSaveListTitle(list.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSaveListTitle(list.id);
              }
              if (e.key === 'Escape') {
                e.preventDefault();
                onCancelListEdit();
              }
            }}
            className="min-w-0 flex-1 rounded border border-[#388bff] bg-white px-2 py-1 text-sm font-semibold text-[#172b4d] outline-none"
          />
        ) : (
          <h3 className="min-w-0 flex-1 truncate text-md font-semibold tracking-wide">
            {list.title}
          </h3>
        )}

        <div className="relative shrink-0" ref={listMenuRef || undefined}>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onToggleListMenu(list.id)}
            className="rounded p-1 text-[#44546f] hover:bg-black/10"
            aria-expanded={menuOpen}
            aria-label="List actions"
          >
            <MoreHorizontal size={16} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-lg border border-black/10 bg-white py-1 text-[#172b4d] shadow-lg">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onEditList(list.id, list.title)}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-[#f1f2f4]"
              >
                Edit title
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onDeleteList(list.id)}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-[#f1f2f4]"
              >
                Delete list
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onArchiveList(list.id)}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-[#f1f2f4]"
              >
                Archive list
              </button>
            </div>
          )}
        </div>
      </div>

      <Droppable droppableId={String(list.id)}>
        {(dropProvided) => (
          <div
            ref={dropProvided.innerRef}
            {...dropProvided.droppableProps}
            className="flex max-h-[min(65vh,calc(100vh-12rem))] flex-col gap-2 overflow-y-auto overflow-x-hidden px-2 pb-2 pt-1"
          >
            {filteredItems.map((item, index) => (
              <Draggable
                key={String(item.id)}
                draggableId={String(item.id)}
                index={index}
                isDragDisabled={isCardDragDisabled}
              >
                {(cardProvided, snapshot) => (
                  <Card
                    item={item}
                    cardProvided={cardProvided}
                    snapshot={snapshot}
                    onSelectCard={onSelectCard}
                    listId={list.id}
                  />
                )}
              </Draggable>
            ))}
            {dropProvided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="mt-2 text-inherit">
        <CardAdd onAdd={(title) => onAddCard(list.id, title)} />
      </div>
    </div>
  );
}

export default React.memo(KanbanListColumn);
