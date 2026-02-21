import React from 'react';
import { TechId } from '../../models/types';
import { useTranslation } from 'react-i18next';

interface Props {
  unlockedTechs: TechId[];
  toggleTech: (id: TechId) => void;
}

const TechSelector: React.FC<Props> = ({ unlockedTechs, toggleTech }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-2">{t('admin.techTree')}</h2>
      <div className="flex gap-4 flex-wrap">
        {Object.values(TechId).map((tid) => {
          const unlocked = unlockedTechs.includes(tid);
          return (
            <label key={tid} className="flex items-center gap-1">
              <input type="checkbox" checked={unlocked} onChange={() => toggleTech(tid)} />
              <span className="text-sm">{t(`tech.${tid}`)}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default TechSelector;
