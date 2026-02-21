import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../context/GameContext';
import { techCatalog } from '../services/TechService';

const TechTree: React.FC = () => {
  const { t } = useTranslation();
  const { gameState, toggleTech } = useGame();

  const unlocked = new Set(gameState.techs);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{t('ui.techTree')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.values(techCatalog).map((tech) => {
          const researched = unlocked.has(tech.id);
          return (
            <div
              key={tech.id}
              className={`cinematic-card p-4 border border-cinematic-border flex flex-col justify-between ${
                researched ? 'bg-brand-success/10' : ''
              }`}
            >
              <div>
                <h2 className="text-xl font-semibold">{tech.name}</h2>
                <p className="text-sm mt-1">{tech.description}</p>
              </div>
              <button
                className={`btn mt-4 ${researched ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => toggleTech(tech.id)}
              >
                {researched ? t('ui.unresearch') : t('ui.research')}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TechTree;
