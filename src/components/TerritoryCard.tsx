import React from 'react';
import { Territory, TerritoryType } from '../models/types';
import {
  Building2,
  Home,
  Trees,
  Waves,
  Mountain,
  Sun,
  Snowflake,
  Moon,
  Rocket,
  AlertCircle,
  Tent,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Text from './common/Text';

interface Props {
  territory: Territory;
}

const getIconForType = (type: TerritoryType) => {
  switch (type) {
    case TerritoryType.rural:
      return <Trees size={20} className="text-brand-success" />;
    case TerritoryType.suburbs:
      return <Home size={20} className="text-brand-primary" />;
    case TerritoryType.urban:
      return <Building2 size={20} className="text-brand-primary" />;
    case TerritoryType.metropolis:
      return <Building2 size={20} className="text-brand-warning" />;
    case TerritoryType.border:
      return <AlertCircle size={20} className="text-brand-danger" />;
    case TerritoryType.coastal:
      return <Waves size={20} className="text-brand-primary" />;
    case TerritoryType.caves:
      return <Tent size={20} className="text-slate-400" />;
    case TerritoryType.underground:
      return <Tent size={20} className="text-brand-warning" />;
    case TerritoryType.mountains:
      return <Mountain size={20} className="text-slate-300" />;
    case TerritoryType.desert:
      return <Sun size={20} className="text-brand-warning" />;
    case TerritoryType.arctic:
      return <Snowflake size={20} className="text-brand-primary" />;
    case TerritoryType.moon:
      return (
        <Moon size={20} className="text-slate-200 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
      );
    case TerritoryType.orbital:
      return <Rocket size={20} className="text-brand-primary" />;
    case TerritoryType.spaceStation:
      return <Rocket size={20} className="text-brand-success" />;
    case TerritoryType.interstellar:
      return <Rocket size={20} className="text-brand-warning shadow-md" />;
    default:
      return <Home size={20} className="text-slate-400" />;
  }
};

const TerritoryCard = React.memo(({ territory }: Props) => {
  const { t } = useTranslation();
  const percentage = Math.min(100, (territory.population / territory.capacity) * 100);
  const isDanger = percentage >= 90;

  return (
    <div
      className="cinematic-card flex flex-col gap-4 group"
      role="article"
      aria-label={`Territory: ${territory.name}`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors border border-cinematic-border">
            {getIconForType(territory.type)}
          </div>
          <h3 className="text-lg font-bold text-white tracking-wide m-0 leading-none">
            {territory.name}
          </h3>
        </div>
      </div>

      <Text variant="muted" className="text-sm min-h-[48px] m-0 leading-relaxed">
        {t(`territory.${territory.id}.description`)}
      </Text>

      <div className="mt-auto pt-2 border-t border-cinematic-border/50">
        <div className="flex justify-between items-center text-xs text-slate-300 mb-2">
          <Text as="span" className="font-medium tracking-wide">
            {t('ui.population')}
          </Text>
          <Text
            as="span"
            variant="base"
            className="font-bold bg-slate-800 px-2 py-0.5 rounded-md border border-cinematic-border"
          >
            {Math.floor(territory.population).toLocaleString()}{' '}
            <Text as="span" variant="muted" className="mx-1">
              /
            </Text>{' '}
            {territory.capacity.toLocaleString()}
          </Text>
        </div>
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden shadow-inner border border-cinematic-bg">
          <div
            className={`h-full transition-all duration-500 ease-out ${isDanger ? 'bg-brand-danger shadow-[0_0_10px_rgba(248,81,73,0.6)]' : 'bg-brand-primary shadow-[0_0_10px_rgba(88,166,255,0.4)]'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
});

TerritoryCard.displayName = 'TerritoryCard';

export default TerritoryCard;
