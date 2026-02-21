import React from 'react';
import { PolicyId } from '../../models/types';
import { useTranslation } from 'react-i18next';

interface Props {
  activePolicies: PolicyId[];
  togglePolicy: (id: PolicyId) => void;
}

const PolicySelector: React.FC<Props> = ({ activePolicies, togglePolicy }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-2">{t('admin.policies')}</h2>
      <div className="flex gap-4">
        {Object.values(PolicyId).map((pid) => {
          const active = activePolicies.includes(pid);
          return (
            <label key={pid} className="flex items-center gap-1">
              <input type="checkbox" checked={active} onChange={() => togglePolicy(pid)} />
              <span className="text-sm">{t(`policies.${pid}`)}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default PolicySelector;
