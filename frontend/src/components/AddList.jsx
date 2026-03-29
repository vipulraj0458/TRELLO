import React, { useState } from 'react';
import { X, Plus } from 'react-feather';

function AddList({ onAddList }) {
  const [list, setList] = useState('');
  const [show, setShow] = useState(false);

  const savelist = () => {
    if (!list.trim()) return;
    onAddList(list.trim());
    setList('');
    setShow(false);
  };

  const closeBtn = () => {
    setList('');
    setShow(false);
  };

  return (
    <div className="w-[272px] shrink-0 self-start">
      <div className="flex flex-col rounded-xl bg-[#f1f2f4]/95 p-2 shadow-sm ring-1 ring-black/5">
        {show && (
          <div className="w-full">
            <textarea
              value={list}
              onChange={(e) => setList(e.target.value)}
              className="w-full resize-none rounded-lg border border-[#dfe1e6] bg-white px-2 py-2 text-sm text-[#172b4d] shadow-sm placeholder:text-[#626f86] focus:border-[#388bff] focus:outline-none focus:ring-2 focus:ring-[#388bff]/30"
              rows={3}
              placeholder="Enter list title…"
              autoFocus
            />
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={savelist}
                className="rounded-md bg-[#0c66e4] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#0055cc]"
              >
                Add list
              </button>
              <button
                type="button"
                onClick={closeBtn}
                className="rounded-md p-1.5 text-[#626f86] hover:bg-black/10"
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
            className="flex w-full items-center justify-start gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#172b4d] hover:bg-[#dcdfe4]"
          >
            <Plus size={16} className="shrink-0" aria-hidden />
            Add another list
          </button>
        )}
      </div>
    </div>
  );
}

export default React.memo(AddList);
