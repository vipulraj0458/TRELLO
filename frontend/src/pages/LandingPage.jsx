import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TemplateCard from '../components/landing/TemplateCard';
import BoardCard from '../components/landing/BoardCard';

const POPULAR_TEMPLATES = [
  {
    id: 1,
    title: 'Project Management',
    col: 'bg-gradient-to-r from-cyan-500 to-blue-500',
  },
  {
    id: 2,
    title: 'Kanban Template',
    col: 'bg-gradient-to-r from-purple-500 to-pink-500',
  },
  {
    id: 3,
    title: 'Simple Project Board',
    col: 'bg-gradient-to-r from-orange-400 to-red-500',
  },
  {
    id: 4,
    title: 'Remote Team Hub',
    col: 'bg-gradient-to-r from-green-400 to-emerald-600',
  },
];

function SectionTitle({ id, icon, children }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/5 text-[#9fadbc]">
        {icon}
      </span>
      <h2
        id={id}
        className="text-lg font-bold tracking-tight text-[#dfe1e6] md:text-xl"
      >
        {children}
      </h2>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="flex h-screen min-h-0 w-full flex-col overflow-hidden bg-[#1d2125] text-[#b6c2cf]">
      <Navbar />

      <main className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          {/* Hero */}
          <header className="mb-10 border-b border-white/10 pb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#738496]">
              Home
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#9fadbc] sm:text-base">
              Jump into a board or start from a template. Your workspace stays
              in sync across devices.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/board"
                className="inline-flex items-center justify-center rounded-md bg-[#579dff] px-4 py-2.5 text-sm font-semibold text-[#1d2125] shadow-sm transition-colors hover:bg-[#85b8ff] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#85b8ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1d2125]"
              >
                Open your board
              </Link>
              <Link
                to="/board"
                className="inline-flex items-center justify-center rounded-md border border-white/20 bg-transparent px-4 py-2.5 text-sm font-semibold text-[#dfe1e6] transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1d2125]"
              >
                Create board
              </Link>
            </div>
          </header>

          {/* Templates */}
          <section className="mb-12" aria-labelledby="templates-heading">
            <SectionTitle
              id="templates-heading"
              icon={
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19.98 10L14 3H11H5.00696C3.89852 3 3 3.8966 3 5.00062V19.0066C3 20.1075 3.89945 21 5.00511 21H18.9949C20.1023 21 21 20.1008 21 19.0056V11V10H19.98ZM14.17 5.83L18.17 9.83L14.17 9.83V5.83ZM16 11L19 11L19 18C19 18.5523 18.5523 19 18 19L6 19C5.44772 19 5 18.5523 5 18L5 6C5 5.44772 5.4477 5 6 5L12 5V9.17004V10C12 10.5523 12.4477 11 13 11L16 11Z"
                  />
                </svg>
              }
            >
              Most popular templates
            </SectionTitle>

            <div className="custom-scrollbar flex gap-4 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible">
              {POPULAR_TEMPLATES.map((tmpl) => (
                <TemplateCard key={tmpl.id} title={tmpl.title} gradient={tmpl.col} />
              ))}
            </div>
          </section>

          {/* Recently viewed */}
          <section className="mb-12" aria-labelledby="recent-heading">
            <SectionTitle
              id="recent-heading"
              icon={
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 19C8.13401 19 5 15.866 5 12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12C19 15.866 15.866 19 12 19Z"
                  />
                  <path d="M11 7H13V12H16V14H11V7Z" fill="currentColor" />
                </svg>
              }
            >
              Recently viewed
            </SectionTitle>

            <div className="flex flex-wrap gap-4">
              <BoardCard title="My Trello Board" gradient="bg-[#0079bf]" />
            </div>
          </section>

          {/* Workspaces */}
          <section className="pb-8" aria-labelledby="workspaces-heading">
            <h2
              id="workspaces-heading"
              className="mb-5 ml-0.5 text-xs font-bold uppercase tracking-[0.12em] text-[#738496]"
            >
              Your workspaces
            </h2>

            <div className="mb-4 flex flex-col gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-sm font-bold text-white shadow-md"
                  aria-hidden
                >
                  T
                </div>
                <span className="font-semibold text-[#dfe1e6] transition-colors">
                  Trello Workspace
                </span>
              </div>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                {['Boards', 'Views', 'Members (1)', 'Settings'].map((label) => (
                  <button
                    key={label}
                    type="button"
                    className="rounded-md bg-[#3a444c] px-3 py-1.5 text-xs font-medium text-[#b6c2cf] transition-colors hover:bg-[#505f6b]"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="ml-0 flex flex-wrap gap-4 sm:ml-12 sm:pl-1">
              <BoardCard title="My Trello Board" gradient="bg-[#0079bf]" />
              <Link
                to="/board"
                className="flex min-h-[120px] min-w-[200px] max-w-[250px] flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-[#a6c5e229] px-4 text-center transition-colors hover:border-white/25 hover:bg-[#a6c5e23d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#579dff] sm:flex-none"
              >
                <span className="text-2xl font-light leading-none text-[#9fadbc]">
                  +
                </span>
                <span className="mt-2 text-sm font-semibold text-[#dfe1e6]">
                  Create new board
                </span>
                <span className="mt-1 text-xs text-[#738496]">
                  Opens the Kanban app
                </span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
