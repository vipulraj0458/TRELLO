import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import Main from '../components/Main';
import Navbar from '../components/Navbar';
import { BoardContext } from '../context/BoardContext';
import { fetchBoardDetails } from '../api/api';

function BoardPage() {
  const [allboard, setAllBoard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e) => {
    if (isResizing) {
      const newWidth = Math.min(Math.max(e.clientX, 200), 400);
      setSidebarWidth(newWidth);
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  useEffect(() => {
    const loadBoard = async () => {
      try {
        setIsLoading(true);
        const listsData = await fetchBoardDetails(1);
        const mappedLists = listsData.map((list) => ({
          id: `list-${list.id}`,
          title: list.title,
          items: list.cards ? list.cards.map((card) => ({
            id: `card-${card.id}`,
            title: card.title,
            list_id: card.list_id
          })) : []
        }));

        setAllBoard({
          active: 0,
          boards: [
            {
              id: '1',
              name: 'My Trello board',
              bgcolor: 'transparent',
              list: mappedLists,
            },
          ],
        });
      } catch (err) {
        console.error("API Fetch Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadBoard();
  }, []);

  const boardContextValue = useMemo(
    () => ({ allboard, setAllBoard }),
    [allboard]
  );

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-gradient-to-br from-[#5b3f8c] to-[#7c4d9e] font-sans antialiased text-[#b6c2cf]">
      <Navbar />
      {isLoading ? (
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <p className="text-xl font-bold text-white">Loading...</p>
        </div>
      ) : (
        <BoardContext.Provider value={boardContextValue}>
          <div className="flex flex-1 min-h-0 w-full overflow-hidden relative">
            {/* Resizable Sidebar Wrapper */}
            <div style={{ width: sidebarWidth }} className="h-full shrink-0">
              <Sidebar />
            </div>
            
            {/* Draggable Divider */}
            <div
              onMouseDown={startResizing}
              className={`w-[4px] cursor-col-resize shrink-0 z-20 transition-colors ${isResizing ? 'bg-gray-400 opacity-100' : 'bg-gray-600 opacity-50 hover:bg-gray-400 hover:opacity-100'}`}
            />
            
            <Main />
          </div>
        </BoardContext.Provider>
      )}
    </div>
  );
}

export default BoardPage;
