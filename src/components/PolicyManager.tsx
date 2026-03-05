import React from 'react';
import { useGame } from '../context/GameContext';
import { policyCatalog } from '../services/PolicyService';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

const PolicyManager: React.FC = () => {
  const { gameState, togglePolicy } = useGame();

  return (
    <div className="cinematic-card flex flex-col max-h-[400px]">
      <div className="flex items-center gap-2 mb-4 border-b border-cinematic-border pb-3">
        <Shield className="text-brand-warning" size={20} />
        <h3 className="text-xl font-bold">State Policies</h3>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto pr-2 pb-2">
        {Object.values(policyCatalog).map((policy) => {
          const isActive = gameState.policies.includes(policy.id);

          return (
            <div
              key={policy.id}
              className={`p-3 rounded-md border text-sm transition-all cursor-pointer flex flex-col gap-1 ${
                isActive
                  ? 'bg-brand-primary/20 border-brand-primary/50 hover:bg-brand-primary/30'
                  : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50'
              }`}
              onClick={() => togglePolicy(policy.id)}
            >
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-200 flex items-center gap-2">
                  {isActive ? <ShieldCheck size={16} className="text-brand-primary" /> : <ShieldAlert size={16} className="text-slate-500" />}
                  {policy.name}
                </div>
                <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-slate-300 uppercase tracking-widest">
                  {isActive ? 'ACTIVE' : 'INACTIVE'}
                </div>
              </div>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">{policy.description}</p>
              {policy.immigrationMultiplier !== 1 && (
                <div className="mt-2 text-xs font-mono font-bold">
                  <span className={policy.immigrationMultiplier > 1 ? 'text-brand-success' : 'text-brand-danger'}>
                    Immigration {policy.immigrationMultiplier > 1 ? '+' : '-'}{Math.abs(Math.round((policy.immigrationMultiplier - 1) * 100))}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PolicyManager;
