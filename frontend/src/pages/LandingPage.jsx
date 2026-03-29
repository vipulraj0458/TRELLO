import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Layout, Clock, X } from 'react-feather';
import Navbar from '../components/Navbar';
import TemplateCard from '../components/landing/TemplateCard';
import BoardCard from '../components/landing/BoardCard';
import { fetchBoards, createBoard, updateBoard, deleteBoard } from '../api/api';

const POPULAR_TEMPLATES = [
  { id: 1, title: 'Project Management', col: 'bg-gradient-to-r from-cyan-500 to-blue-500' },
  { id: 2, title: 'Kanban Template', col: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { id: 3, title: 'Simple Project Board', col: 'bg-gradient-to-r from-orange-400 to-red-500' },
  { id: 4, title: 'Remote Team Hub', col: 'bg-gradient-to-r from-green-400 to-emerald-600' },
];

const PREDEFINED_COLORS = [
  'bg-[#0079bf]', 'bg-[#d29034]', 'bg-[#519839]', 'bg-[#b04632]', 
  'bg-[#89609e]', 'bg-[#cd5a91]', 'bg-[#4bbf6b]', 'bg-[#00aecc]'
];

export default function LandingPage() {
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [editingBoard, setEditingBoard] = useState(null);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState(PREDEFINED_COLORS[0]);

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      setIsLoading(true);
      const data = await fetchBoards();
      setBoards(data);
    } catch (err) {
      console.error('Failed to load boards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setEditingBoard(null);
    setNewBoardTitle('');
    setSelectedColor(PREDEFINED_COLORS[0]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (boardId) => {
    const board = boards.find(b => b.id === boardId);
    if (board) {
      setModalMode('edit');
      setEditingBoard(board);
      setNewBoardTitle(board.name);
      setSelectedColor(board.bgcolor);
      setIsModalOpen(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;

    try {
      if (modalMode === 'create') {
        const board = await createBoard({ name: newBoardTitle, bgcolor: selectedColor });
        setBoards([...boards, board]);
      } else {
        const updated = await updateBoard(editingBoard.id, { name: newBoardTitle, bgcolor: selectedColor });
        setBoards(boards.map(b => b.id === editingBoard.id ? updated : b));
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Operation failed:', err);
    }
  };

  const handleArchive = async (boardId) => {
    try {
      await updateBoard(boardId, { is_archived: true });
      setBoards(boards.filter(b => b.id !== boardId));
    } catch (err) {
      console.error('Archive failed:', err);
    }
  };

  const handleDelete = async (boardId) => {
    if (!window.confirm('Are you sure you want to permanently delete this board? This action cannot be undone.')) return;
    try {
      await deleteBoard(boardId);
      setBoards(boards.filter(b => b.id !== boardId));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="flex h-screen min-h-0 w-full flex-col overflow-hidden bg-[#1d2125] text-[#b6c2cf]">
      <Navbar />

      <main className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          
          {/* Header */}
          <header className="mb-10 border-b border-white/10 pb-8">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Your Workspace
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[#9fadbc]">
              Manage your projects, templates, and team workflows.
            </p>
          </header>

          {/* Templates Section */}
          <section className="mb-12">
            <div className="mb-5 flex items-center gap-2 text-[#dfe1e6]">
              <Layout size={20} />
              <h2 className="text-lg font-bold">Popular templates</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {POPULAR_TEMPLATES.map((tmpl) => (
                <TemplateCard key={tmpl.id} title={tmpl.title} gradient={tmpl.col} />
              ))}
            </div>
          </section>

          {/* Boards Grid */}
          <section className="pb-12">
            <div className="mb-5 flex items-center gap-2 text-[#dfe1e6]">
              <Clock size={20} />
              <h2 className="text-lg font-bold">Your Boards</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {isLoading ? (
                <div className="col-span-full py-10 text-center text-[#9fadbc]">Loading boards...</div>
              ) : (
                <>
                  {boards.map((board) => (
                    <BoardCard 
                      key={board.id}
                      id={board.id}
                      title={board.name}
                      gradient={board.bgcolor}
                      onEdit={handleOpenEditModal}
                      onArchive={handleArchive}
                      onDelete={handleDelete}
                    />
                  ))}
                  
                  <button
                    onClick={handleOpenCreateModal}
                    className="flex min-h-[100px] sm:min-h-[120px] flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-[#a6c5e229] p-4 transition-all hover:border-white/30 hover:bg-[#a6c5e23d]"
                  >
                    <Plus size={24} className="text-[#dfe1e6]" />
                    <span className="mt-2 text-center text-xs sm:text-sm font-semibold text-[#dfe1e6]">Create new board</span>
                  </button>
                </>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-lg bg-[#282e33] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {modalMode === 'create' ? 'Create board' : 'Edit board'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#9fadbc] hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9fadbc]">
                  Board Title
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  placeholder="Enter board title"
                  className="w-full rounded-md border border-white/10 bg-[#1d2125] px-3 py-2 text-white placeholder:text-[#9fadbc] focus:border-[#579dff] focus:outline-none focus:ring-1 focus:ring-[#579dff]"
                />
              </div>

              <div className="mb-8">
                <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-[#9fadbc]">
                  Background
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {PREDEFINED_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`h-10 rounded-md transition-all ${color} ${selectedColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#282e33]' : 'hover:opacity-80'}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-md bg-[#579dff] py-2.5 text-sm font-semibold text-[#1d2125] transition-colors hover:bg-[#85b8ff]"
                >
                  {modalMode === 'create' ? 'Create' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-md bg-white/5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
