import React from 'react';
import { useTranslation } from 'react-i18next';

export interface EventTemplate {
  id: string;
  title: string | { en: string; fi: string };
  description: string | { en: string; fi: string };
  type: string;
  territoryType: string;
  populationChange: number;
  probability: number;
  category: string;
  threshold?: number;
  timestamp?: number;
  createdAt?: number;
  updatedAt?: number;
  createdBy?: string;
  source?: string;
}

interface Props {
  events: EventTemplate[];
  startEdit: (evt: EventTemplate) => void;
  remove: (evt: EventTemplate) => void;
}

const fmtDate = (ms?: number) => (ms ? new Date(ms).toLocaleDateString() : '—');

const EventTable: React.FC<Props> = ({ events, startEdit, remove }) => {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto mb-8 bg-cinematic-card rounded-xl border border-cinematic-border p-4">
      <div className="mb-3 text-sm text-slate-400">
        {events.length} event{events.length !== 1 ? 's' : ''} loaded
      </div>
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wider text-slate-400">
            <th className="p-2">{t('admin.id')}</th>
            <th className="p-2">{t('admin.titleCol')}</th>
            <th className="p-2">{t('admin.type')}</th>
            <th className="p-2">{t('admin.territory')}</th>
            <th className="p-2">{t('admin.population')}</th>
            <th className="p-2">{t('admin.probability')}</th>
            <th className="p-2">{t('admin.category')}</th>
            <th className="p-2">{t('admin.threshold')}</th>
            <th className="p-2">Added</th>
            <th className="p-2">By</th>
            <th className="p-2">{t('admin.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr
              key={`${e.id}-${e.territoryType}`}
              className="border-t border-cinematic-border hover:bg-cinematic-surface transition-colors"
            >
              <td className="p-2 font-mono text-xs">{e.id}</td>
              <td className="p-2">
                {typeof e.title === 'object' ? e.title.en : e.title}
              </td>
              <td className="p-2">
                <span
                  className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                    e.type === 'immigration'
                      ? 'bg-green-900/40 text-green-300'
                      : e.type === 'emigration'
                        ? 'bg-red-900/40 text-red-300'
                        : e.type === 'disaster'
                          ? 'bg-orange-900/40 text-orange-300'
                          : 'bg-blue-900/40 text-blue-300'
                  }`}
                >
                  {e.type}
                </span>
              </td>
              <td className="p-2">{e.territoryType}</td>
              <td className="p-2 tabular-nums">
                <span className={e.populationChange >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {e.populationChange > 0 ? '+' : ''}
                  {e.populationChange}
                </span>
              </td>
              <td className="p-2 tabular-nums">{e.probability}</td>
              <td className="p-2">{e.category}</td>
              <td className="p-2">{e.threshold ?? '—'}</td>
              <td className="p-2 text-xs text-slate-400">{fmtDate(e.timestamp)}</td>
              <td className="p-2 text-xs text-slate-400">{e.createdBy ?? '—'}</td>
              <td className="p-2 flex gap-2">
                <button
                  className="text-brand-primary hover:underline text-xs"
                  onClick={() => startEdit(e)}
                >
                  {t('admin.editEvent')}
                </button>
                <button
                  className="text-brand-danger hover:underline text-xs"
                  onClick={() => remove(e)}
                >
                  {t('admin.delete')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;
