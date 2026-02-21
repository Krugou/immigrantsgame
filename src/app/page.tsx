'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { useHighContrast } from '../hooks/useHighContrast';
import { Users, LogOut, Save, Zap, UserCircle, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';
import AuthModal from '../components/AuthModal';
import TerritoryCard from '../components/TerritoryCard';
import EventLog from '../components/EventLog';
import { useTranslation } from 'react-i18next';
import LoadingScreen from '../components/common/LoadingScreen';
import Logo from '../components/common/Logo';
import EraOverlay from '../components/common/EraOverlay';
import StarField from '../components/common/StarField';
import OdometerCounter from '../components/common/OdometerCounter';
import { getNextUnlockConfig } from '../models/territoryConfig';
import { useSoundEngine } from '../hooks/useSoundEngine';
import { PopulationService } from '../services/PopulationService';
import { EventType } from '../models/types';

const Home = () => {
  const { t, i18n } = useTranslation();
  const { gameState, manualImmigration, activeEra, completeEra, latestEvent, tickCount } =
    useGame();
  const { user, signOut, saveGameStateToCloud } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { isMuted, toggleMute, playClick, playEraChime, playDisaster, playImmigration } =
    useSoundEngine();

  // HUD reactivity state
  const [hudEffect, setHudEffect] = useState<'glitch' | 'glow' | null>(null);
  const { toggle: toggleContrast } = useHighContrast();

  const totalPopulation = useMemo(
    () => Math.floor(PopulationService.totalPopulation(gameState.territories)),
    [gameState.territories],
  );
  const capacityPercentage = useMemo(
    () => PopulationService.capacityPercentage(gameState.territories),
    [gameState.territories],
  );
  const nextUnlock = useMemo(() => getNextUnlockConfig(totalPopulation), [totalPopulation]);
  const nextUnlockProgress = useMemo(
    () =>
      nextUnlock ? Math.min(100, Math.round((totalPopulation / nextUnlock.threshold) * 100)) : 100,
    [totalPopulation, nextUnlock],
  );

  // Keyboard shortcuts: Space -> manual immigration, Ctrl+H -> high-contrast
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        manualImmigration();
        playClick();
      }
      if (e.ctrlKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        toggleContrast();
      }
    },
    [manualImmigration, playClick, toggleContrast],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // ── HUD reactivity: respond to latest event ──────────────────────────
  useEffect(() => {
    // always return a cleanup function to satisfy consistent-return
    let timer: NodeJS.Timeout | undefined;
    if (latestEvent) {
      if (latestEvent.type === EventType.disaster || latestEvent.type === EventType.emigration) {
        queueMicrotask(() => setHudEffect('glitch'));
        playDisaster();
      } else if (
        latestEvent.type === EventType.immigration ||
        latestEvent.type === EventType.opportunity
      ) {
        queueMicrotask(() => setHudEffect('glow'));
        playImmigration();
      }
      timer = setTimeout(() => setHudEffect(null), 600);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [latestEvent, playDisaster, playImmigration]);

  // Build dynamic HUD classes — tickCount drives heartbeat via key-based re-mount
  const hudClasses = useMemo(() => {
    const base =
      'cinematic-card mb-8 flex flex-col md:flex-row justify-between items-center gap-8 bg-linear-to-br from-slate-800/80 to-slate-900 border-brand-primary/30 shadow-[0_0_20px_rgba(88,166,255,0.05)]';
    const effects: string[] = ['hud-heartbeat'];
    if (hudEffect === 'glitch') {
      effects.push('hud-glitch');
    }
    return `${base} ${effects.join(' ')}`;
  }, [hudEffect]);

  return (
    <div className="container mx-auto px-4 lg:px-8 animate-fade-in max-w-7xl relative pb-20">
      <StarField population={totalPopulation} territoryCount={gameState.territories.length} />
      {isInitialLoading && <LoadingScreen onFinished={() => setIsInitialLoading(false)} />}

      {activeEra && (
        <EraOverlay
          eraName={activeEra.name}
          quote={activeEra.quote}
          imagePath={activeEra.image}
          onFinished={() => {
            completeEra();
            playEraChime();
          }}
        />
      )}

      {/* Screen-reader heading */}
      <h1 className="sr-only">{t('appTitle')}</h1>

      {/* Header */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="mb-4 text-right flex flex-col gap-1">
          <Link
            href="/admin"
            className="text-xs text-brand-warning underline hover:text-brand-primary"
          >
            Admin Dashboard
          </Link>
          <Link
            href="/tech"
            className="text-xs text-brand-warning underline hover:text-brand-primary"
          >
            Tech Tree (dev)
          </Link>
        </div>
      )}
      <header className="glass flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-cinematic-border gap-4">
        <div>
          <Logo className="w-64 md:w-80 -ml-4" />
          <p className="text-slate-400 m-0 text-lg mt-1">{t('ui.subtitle')}</p>
        </div>

        <div className="flex gap-4 items-center">
          {user ? (
            <div className="flex gap-4 items-center flex-wrap">
              <Link
                href="/profile"
                className="flex items-center gap-2 group p-2 -ml-2 rounded-lg hover:bg-cinematic-surface transition-colors cursor-pointer text-sm text-slate-300 hover:text-white"
              >
                <UserCircle
                  size={18}
                  className="text-brand-primary group-hover:drop-shadow-[0_0_8px_rgba(88,166,255,0.8)] transition-all"
                />
                {t('ui.commander', { name: user.displayName || 'Unknown' })}
              </Link>
              <button
                className="btn btn-secondary px-4 py-2"
                onClick={() => saveGameStateToCloud(gameState)}
                title={t('ui.save')}
              >
                <Save size={16} /> {t('ui.save')}
              </button>
              <button className="btn btn-secondary px-3 py-2" onClick={signOut} title="Sign Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button className="btn btn-primary px-6 py-2" onClick={() => setShowAuth(true)}>
              {t('ui.signInUp')}
            </button>
          )}
          <select
            className="bg-cinematic-surface border border-cinematic-border text-white px-2 py-1 rounded"
            value={i18n.language}
            aria-label="Select Language"
            onChange={(e) => i18n.changeLanguage(e.target.value)}
          >
            <option value="en">EN</option>
            <option value="fi">FI</option>
          </select>
          <button
            onClick={toggleMute}
            className="btn btn-secondary px-2 py-2"
            aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button
            data-testid="contrast-toggle"
            onClick={toggleContrast}
            className="btn btn-secondary px-2 py-2 ml-2"
            aria-label="Toggle high contrast mode"
            title="High Contrast (Ctrl+H)"
          >
            HC
          </button>
        </div>
      </header>

      <div key={`hud-${tickCount}`} className={hudClasses}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full md:w-auto">
          <div>
            <div className="text-sm text-slate-400 flex items-center gap-2 mb-1">
              <Users size={16} /> {t('totalPopulation', { population: '' }).replace(':', '').trim()}
            </div>
            <div
              className={`text-5xl md:text-6xl font-extrabold leading-none hud-glow relative ${
                hudEffect === 'glow' ? 'text-brand-success' : 'text-brand-primary'
              }`}
              aria-live="polite"
              aria-atomic="true"
            >
              <OdometerCounter value={totalPopulation} />
            </div>
          </div>
          <div className="md:pl-8 md:border-l border-cinematic-border pt-4 md:pt-0 border-t md:border-t-0 w-full md:w-auto">
            <div className="text-sm text-slate-400 mb-1">{t('ui.totalImmigrants')}</div>
            <div className="text-3xl font-bold text-slate-200">
              {gameState.totalImmigrants.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center w-full md:w-72">
          <div className="flex flex-col w-full gap-2">
            <button
              className="btn btn-primary w-full p-4 text-lg animate-pulse hover:animate-none"
              onClick={() => {
                manualImmigration();
                playClick();
              }}
            >
              <Zap size={20} /> {t('ui.guideImmigrants')}
            </button>
            {process.env.NODE_ENV !== 'production' && (
              <button
                className="btn btn-secondary w-full p-2 text-sm border-dashed border-cinematic-border text-slate-400 hover:text-white bg-slate-800/50"
                onClick={() => {
                  // Trigger 10 manual immigration bursts for development testing
                  for (let i = 0; i < 10; i++) {
                    manualImmigration();
                  }
                }}
              >
                <Zap size={14} className="inline mr-1" /> [DEV] 10x Immigrants
              </button>
            )}
          </div>
          <div className="mt-4 w-full">
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>{t('ui.capacityUsage')}</span>
              <span>{capacityPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${capacityPercentage > 90 ? 'bg-brand-danger' : 'bg-brand-primary'}`}
                style={{ width: `${capacityPercentage}%` }}
              />
            </div>
          </div>

          {nextUnlock && (
            <div className="mt-3 w-full">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span className="font-mono tracking-wide">
                  Next: {nextUnlock.nameKey.split('.').pop()}
                </span>
                <span>{nextUnlockProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-warning/70 transition-all duration-500"
                  style={{ width: `${nextUnlockProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Territories */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {t('territories')}{' '}
              <span className="text-slate-400 text-lg font-normal">
                ({gameState.territories.length})
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 scanner-sweep relative">
            {gameState.territories.map((territory) => (
              <TerritoryCard key={territory.id} territory={territory} />
            ))}
          </div>
        </div>

        {/* Right Column: Event Log */}
        <div className="flex flex-col h-full">
          <h2 className="text-2xl font-bold text-white mb-6">{t('ui.eventLog')}</h2>
          <EventLog events={gameState.eventHistory} />
        </div>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
};

export default Home;
