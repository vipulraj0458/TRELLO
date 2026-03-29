import React, { useState } from 'react';
import { X, Plus } from 'react-feather';

function CardAdd({ onAdd }) {
  const [card, setCard] = useState('');
  const [show, setShow] = useState(false);

  const saveCard = () => {
    if (!card.trim()) return;
    onAdd(card.trim());
    setCard('');
    setShow(false);
  };

  const closeBtn = () => {
    setCard('');
    setShow(false);
  };

  return (
    <div className="w-full min-w-0">
      {show && (
        <div className="w-full">
          <textarea
            value={card}
            onChange={(e) => setCard(e.target.value)}
            className="w-full min-w-0 resize-none rounded-md border-0 bg-black/20 px-3 py-2 text-sm text-white shadow-inner placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
            rows={3}
            placeholder="Enter a title for this card…"
            autoFocus
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={saveCard}
              className="rounded-md bg-white/20 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/30 transition-colors"
            >
              Add card
            </button>
            <button
              type="button"
              onClick={closeBtn}
              className="rounded-md p-1.5 text-white/50 hover:bg-white/10"
              aria-label="Cancel"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
      {!show && (
        <button
          type="button"
          onClick={() => setShow(true)}
          className="flex w-full items-center justify-start gap-2 rounded-md px-2 py-2 text-sm font-medium text-inherit opacity-80 hover:bg-white/10 hover:opacity-100 transition-colors"
        >
          <Plus size={16} className="shrink-0" aria-hidden />
          Add a card
        </button>
      )}
    </div>
  );
}

export default React.memo(CardAdd);
