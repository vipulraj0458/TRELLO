import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { X } from 'react-feather';
import { findCardLocation, replaceCardInBoard } from '../utils/boardUtils';
import { updateCard } from '../api/api';

const LABEL_COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#eab308'];

function cloneCard(card) {
  return {
    ...card,
    title: card.title ?? '',
    description: card.description ?? '',
    labels: [...(card.labels || [])],
    members: [...(card.members || [])],
    checklist: (card.checklist || []).map((item) => ({ ...item })),
    dueDate: card.dueDate || '',
  };
}

function CardModal({ selectedCard, setSelectedCard, allboard, setAllBoard }) {
  const [draft, setDraft] = useState(null);
  const [newChecklist, setNewChecklist] = useState('');
  const [newMember, setNewMember] = useState('');
  const [showLabelPopup, setShowLabelPopup] = useState(false);
  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [showDatePopup, setShowDatePopup] = useState(false);
  const [showChecklistPopup, setShowChecklistPopup] = useState(false);

  /** Card id uniquely identifies the card; listId can be stale after drag. */
  const selectionKey = useMemo(
    () => (selectedCard ? String(selectedCard.cardId) : ''),
    [selectedCard]
  );

  useEffect(() => {
    if (!selectedCard) {
      setDraft(null);
      return;
    }
    const board = allboard.boards[allboard.active];
    if (!board?.list) {
      setDraft(null);
      setSelectedCard(null);
      return;
    }
    const loc = findCardLocation(board, selectedCard.cardId);
    if (loc) setDraft(cloneCard(loc.card));
    else {
      setDraft(null);
      setSelectedCard(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when opening a different card
  }, [selectionKey]);

  useEffect(() => {
    if (!selectedCard) return;
    const board = allboard.boards[allboard.active];
    if (!board?.list || !findCardLocation(board, selectedCard.cardId)) {
      setSelectedCard(null);
    }
  }, [allboard, selectedCard, setSelectedCard]);

  useEffect(() => {
    setShowLabelPopup(false);
    setShowMemberPopup(false);
    setShowDatePopup(false);
    setShowChecklistPopup(false);
    setNewChecklist('');
    setNewMember('');
  }, [selectionKey]);

  const persistAndClose = useCallback(async () => {
    if (!selectedCard || !draft) {
      setSelectedCard(null);
      return;
    }
    const cardId = selectedCard.cardId;
    
    // Determine if title changed
    const board = allboard.boards[allboard.active];
    const loc = findCardLocation(board, cardId);
    const originalTitle = loc?.card?.title;
    const isTitleChanged = originalTitle && originalTitle !== draft.title;

    setAllBoard((prev) => {
      const prevBoard = prev.boards[prev.active];
      if (!prevBoard?.list) return prev;
      const prevLoc = findCardLocation(prevBoard, cardId);
      if (!prevLoc) return prev;
      return replaceCardInBoard(
        prev,
        prev.active,
        prevLoc.list.id,
        cardId,
        draft
      );
    });
    setSelectedCard(null);

    // Sync to backend if title changed
    if (isTitleChanged) {
      try {
        await updateCard(cardId, draft.title);
      } catch (err) {
        console.error("Failed to update card title in backend", err);
      }
    }
  }, [draft, selectedCard, setAllBoard, setSelectedCard, allboard]);

  const updateDraft = useCallback((patch) => {
    setDraft((d) => (d ? { ...d, ...patch } : d));
  }, []);

  const toggleLabel = useCallback((color) => {
    setDraft((d) => {
      if (!d) return d;
      const labels = d.labels || [];
      const next = labels.includes(color)
        ? labels.filter((c) => c !== color)
        : [...labels, color];
      return { ...d, labels: next };
    });
  }, []);

  const addMember = useCallback(() => {
    const name = newMember.trim();
    if (!name) return;
    setDraft((d) => {
      if (!d) return d;
      return { ...d, members: [...(d.members || []), name] };
    });
    setNewMember('');
  }, [newMember]);

  if (!selectedCard || !draft) return null;

  const setDueDate = (date) => updateDraft({ dueDate: date });

  const addChecklist = () => {
    const text = newChecklist.trim();
    if (!text) return;
    setDraft((d) => {
      if (!d) return d;
      return {
        ...d,
        checklist: [...(d.checklist || []), { text, done: false }],
      };
    });
    setNewChecklist('');
  };

  const toggleChecklist = (i) => {
    setDraft((d) => {
      if (!d) return d;
      const checklist = (d.checklist || []).map((item, j) =>
        j === i ? { ...item, done: !item.done } : item
      );
      return { ...d, checklist };
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="card-modal-title"
      onClick={persistAndClose}
    >
      <div
        className="relative mt-0 flex w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-[#f4f5f7] shadow-2xl ring-1 ring-black/10 md:max-h-[90vh] md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <input
            id="card-modal-title"
            className="mb-3 w-full border-b border-transparent bg-transparent text-xl font-semibold text-[#172b4d] outline-none placeholder:text-[#626f86] focus:border-[#388bff]"
            value={draft.title}
            onChange={(e) => updateDraft({ title: e.target.value })}
            placeholder="Card title"
          />

          <textarea
            className="mb-4 min-h-[120px] w-full resize-y rounded-lg border border-[#dfe1e6] bg-white p-3 text-sm text-[#172b4d] shadow-sm placeholder:text-[#626f86] focus:border-[#388bff] focus:outline-none focus:ring-2 focus:ring-[#388bff]/25"
            placeholder="Add a more detailed description…"
            value={draft.description}
            onChange={(e) => updateDraft({ description: e.target.value })}
          />

          {(draft.labels || []).length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {draft.labels.map((c) => (
                <div
                  key={c}
                  className="h-2 min-w-[3rem] rounded-sm"
                  style={{ background: c }}
                />
              ))}
            </div>
          )}

          {(draft.members || []).length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {draft.members.map((m) => (
                <span
                  key={m}
                  className="rounded-full bg-[#dfe1e6] px-2 py-0.5 text-xs font-medium text-[#172b4d]"
                >
                  {m}
                </span>
              ))}
            </div>
          )}

          {draft.dueDate && (
            <p className="mb-3 text-sm text-[#172b4d]">
              <span className="mr-1">Due</span>
              {draft.dueDate}
            </p>
          )}

          {(draft.checklist || []).length > 0 && (
            <div className="mb-4 space-y-2">
              <h4 className="text-sm font-semibold text-[#172b4d]">Checklist</h4>
              {(draft.checklist || []).map((item, i) => (
                <label
                  key={`${item.text}-${i}`}
                  className="flex cursor-pointer items-start gap-2 text-sm text-[#172b4d]"
                >
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleChecklist(i)}
                    className="mt-0.5"
                  />
                  <span className={item.done ? 'text-[#626f86] line-through' : ''}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={persistAndClose}
              className="rounded-md bg-[#0c66e4] px-4 py-2 text-sm font-medium text-white hover:bg-[#0055cc]"
            >
              Save & close
            </button>
          </div>
        </div>

        <aside className="w-full shrink-0 border-t border-[#dfe1e6] bg-[#f1f2f4] p-4 md:w-52 md:border-l md:border-t-0">
          <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#626f86]">
            Add to card
          </h5>
          <div className="relative space-y-2">
            <button
              type="button"
              onClick={() => setShowLabelPopup((v) => !v)}
              className="w-full rounded-md bg-[#dcdfe4] px-3 py-2 text-left text-sm font-medium text-[#172b4d] hover:bg-[#cfd4db]"
            >
              Labels
            </button>
            {showLabelPopup && (
              <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-[#dfe1e6] bg-white p-2 shadow-lg">
                <div className="flex flex-wrap gap-2">
                  {LABEL_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleLabel(c)}
                      className="h-8 w-10 rounded border border-black/10"
                      style={{ background: c }}
                      aria-label={`Toggle label ${c}`}
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowMemberPopup((v) => !v)}
              className="w-full rounded-md bg-[#dcdfe4] px-3 py-2 text-left text-sm font-medium text-[#172b4d] hover:bg-[#cfd4db]"
            >
              Members
            </button>
            {showMemberPopup && (
              <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-[#dfe1e6] bg-white p-2 shadow-lg">
                <input
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  placeholder="Name"
                  className="mb-2 w-full rounded border border-[#dfe1e6] px-2 py-1 text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && addMember()}
                />
                <button
                  type="button"
                  onClick={addMember}
                  className="w-full rounded bg-[#0c66e4] py-1 text-sm text-white hover:bg-[#0055cc]"
                >
                  Add
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowDatePopup((v) => !v)}
              className="w-full rounded-md bg-[#dcdfe4] px-3 py-2 text-left text-sm font-medium text-[#172b4d] hover:bg-[#cfd4db]"
            >
              Dates
            </button>
            {showDatePopup && (
              <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-[#dfe1e6] bg-white p-2 shadow-lg md:right-auto md:min-w-[12rem]">
                <input
                  type="date"
                  className="w-full rounded border border-[#dfe1e6] px-2 py-1 text-sm"
                  value={draft.dueDate || ''}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowChecklistPopup((v) => !v)}
              className="w-full rounded-md bg-[#dcdfe4] px-3 py-2 text-left text-sm font-medium text-[#172b4d] hover:bg-[#cfd4db]"
            >
              Checklist
            </button>
            {showChecklistPopup && (
              <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-[#dfe1e6] bg-white p-2 shadow-lg">
                <input
                  value={newChecklist}
                  onChange={(e) => setNewChecklist(e.target.value)}
                  placeholder="Item"
                  className="mb-2 w-full rounded border border-[#dfe1e6] px-2 py-1 text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && addChecklist()}
                />
                <button
                  type="button"
                  onClick={addChecklist}
                  className="w-full rounded bg-[#0c66e4] py-1 text-sm text-white hover:bg-[#0055cc]"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </aside>

        <button
          type="button"
          onClick={persistAndClose}
          className="absolute right-3 top-3 rounded-md p-1.5 text-[#626f86] hover:bg-black/10"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}

export default React.memo(CardModal);
