import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';

const ConfigEditor: React.FC = () => {
  const { sysConfig } = useGame();
  const [localConfig, setLocalConfig] = useState(sysConfig);
  const [notification, setNotification] = useState<string | null>(null);

  const handleUpdate = async () => {
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localConfig),
      });
      if (res.ok) {
        setNotification('Configuration updated. Please refresh the page to apply changes.');
        setTimeout(() => setNotification(null), 5000);
      }
    } catch {
      setNotification('Failed to update configuration.');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const addItem = (key: keyof typeof localConfig) => {
    const newItem = prompt(`Add new ${key}:`);
    if (newItem) {
      setLocalConfig({
        ...localConfig,
        [key]: [...(localConfig[key] as string[]), newItem],
      });
    }
  };

  const removeItem = (key: keyof typeof localConfig, index: number) => {
    const newList = [...(localConfig[key] as string[])];
    newList.splice(index, 1);
    setLocalConfig({
      ...localConfig,
      [key]: newList,
    });
  };

  return (
    <div className="cinematic-card p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
      <h2 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
        </svg>
        System Configuration
      </h2>

      {notification && (
        <div className="mb-4 p-3 bg-blue-600/20 border border-blue-500/50 text-blue-200 text-sm rounded animate-in fade-in">
          {notification}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['territoryTypes', 'eventTypes', 'categories'] as const).map((key) => (
          <div key={key} className="flex flex-col gap-3">
            <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded border border-slate-700">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                {key}
              </span>
              <button
                onClick={() => addItem(key)}
                className="w-5 h-5 flex items-center justify-center bg-blue-600 rounded text-white hover:bg-blue-500 transition-colors"
                title="Add Item"
              >
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(localConfig[key] as string[]).map((item, idx) => (
                <div
                  key={idx}
                  className="group relative flex items-center bg-slate-800 border border-slate-700 px-2 py-1 rounded text-xs"
                >
                  <span>{item}</span>
                  <button
                    onClick={() => removeItem(key, idx)}
                    className="ml-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800">
        <button
          onClick={handleUpdate}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            ></path>
          </svg>
          SAVE SYSTEM CONFIGURATION
        </button>
        <p className="text-[10px] text-slate-500 mt-2 text-center uppercase tracking-widest">
          Warning: Changes affect all new events and territory generation.
        </p>
      </div>
    </div>
  );
};

export default ConfigEditor;
