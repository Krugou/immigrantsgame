'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import PolicySelector from '../../components/admin/PolicySelector';
import TechSelector from '../../components/admin/TechSelector';
import EventTable, { EventTemplate } from '../../components/admin/EventTable';
import EventForm from '../../components/admin/EventForm';
import ConfigEditor from '../../components/admin/ConfigEditor';

import { useGame } from '../../context/GameContext';

const AdminPage = () => {
  const { t } = useTranslation();
  const { gameState, togglePolicy, toggleTech, simulateTicks } = useGame();
  const [events, setEvents] = useState<EventTemplate[]>([]);
  const [editing, setEditing] = useState<EventTemplate | null>(null);
  const [form, setForm] = useState<Partial<EventTemplate>>({});
  const [notification, setNotification] = useState<string | null>(null);
  const [isServerOffline, setIsServerOffline] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/events');
      if (!res.ok) {
        setIsServerOffline(true);
        return;
      }
      const data = await res.json();
      setEvents(data);
      setIsServerOffline(false);
    } catch {
      setIsServerOffline(true);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchEvents();
    };
    init();
  }, [fetchEvents]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name.startsWith('title_') || name.startsWith('description_')) {
      const [field, lang] = name.split('_');
      setForm((f) => {
        const current = (f[field as keyof EventTemplate] as Record<string, string> | string) || {
          en: '',
          fi: '',
        };
        // Handle case where it might be a string from legacy data
        const base = typeof current === 'string' ? { en: current, fi: '' } : current;
        return {
          ...f,
          [field]: { ...base, [lang]: value },
        };
      });
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const startEdit = (event: EventTemplate) => {
    setEditing(event);
    setForm({ ...event });
  };

  const resetForm = () => {
    setEditing(null);
    setForm({});
  };

  const save = async () => {
    const url = '/api/admin/events';
    const method = editing ? 'PUT' : 'POST';
    const body = {
      event: form,
      territoryType: form.territoryType || '',
    };
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setNotification(editing ? 'Event updated successfully' : 'Event created successfully');
        setTimeout(() => setNotification(null), 3000);
        await fetchEvents();
        resetForm();
      }
    } catch {
      setIsServerOffline(true);
    }
  };

  const remove = async (event: EventTemplate) => {
    try {
      const res = await fetch('/api/admin/events', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          territoryType: event.territoryType,
        }),
      });
      if (res.ok) {
        setNotification('Event removed');
        setTimeout(() => setNotification(null), 3000);
        await fetchEvents();
      }
    } catch {
      setIsServerOffline(true);
    }
  };

  const handleSimulateHour = () => {
    simulateTicks(720);
    setNotification(t('admin.simulated', { hours: 1 }));
    setTimeout(() => setNotification(null), 3000);
  };

  const forceSyncEvents = async () => {
    try {
      setNotification('Synchronizing with cloud...');
      await fetchEvents();
      setNotification('Synchronization complete');
      setTimeout(() => setNotification(null), 3000);
    } catch {
      setNotification('Sync failed');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-mono relative overflow-hidden">
      {/* Background grain/noise overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('/noise.png')] mix-blend-overlay"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-blue-900/40 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse"></div>
              <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
                {t('admin.title')}
              </h1>
            </div>
            <p className="text-slate-500 text-sm uppercase tracking-widest">
              System Architecture Control v1.3.0
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={forceSyncEvents}
              className="px-4 py-2 bg-blue-900/20 border border-blue-700/50 rounded hover:bg-blue-900/40 transition-all text-blue-300 text-xs flex items-center gap-2"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>
              SYNC CLOUD
            </button>
            <button
              onClick={handleSimulateHour}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded hover:bg-slate-700 transition-all text-xs"
            >
              {t('admin.simulateHour')}
            </button>
            <Link
              href="/"
              className="px-4 py-2 bg-slate-100 text-slate-900 rounded font-bold hover:bg-white transition-all text-xs"
            >
              {t('admin.back')}
            </Link>
          </div>
        </header>

        {notification && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4">
            <div className="bg-blue-600/90 text-white px-6 py-3 rounded-lg shadow-2xl backdrop-blur-md border border-blue-400/30 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
              <span className="font-semibold text-sm">{notification}</span>
            </div>
          </div>
        )}

        {isServerOffline && (
          <div className="mb-6 p-4 rounded-lg border border-red-500/40 bg-red-950/30 text-red-300 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold text-red-200">No local admin server online</p>
              <p className="text-sm mt-1 text-red-400">
                Start the backend with{' '}
                <code className="bg-red-900/40 px-1 rounded">npm run server</code> to manage events.
              </p>
            </div>
            <button
              className="ml-auto bg-slate-800 hover:bg-slate-700 text-xs px-3 py-1 rounded border border-slate-600"
              onClick={() => fetchEvents()}
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <PolicySelector activePolicies={gameState.policies} togglePolicy={togglePolicy} />
          <TechSelector unlockedTechs={gameState.techs} toggleTech={toggleTech} />
        </div>

        <div className="mb-12">
          <ConfigEditor />
        </div>

        <section className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
          <div className="p-6 border-b border-slate-800 bg-slate-900/80">
            <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                ></path>
              </svg>
              Event Database
            </h2>
          </div>

          <div className="p-6">
            {!isServerOffline && (
              <EventTable events={events} startEdit={startEdit} remove={remove} />
            )}

            <div className="mt-12 pt-12 border-t border-slate-800">
              <EventForm
                editing={editing}
                form={form}
                handleChange={handleChange}
                save={save}
                resetForm={resetForm}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPage;
