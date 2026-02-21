'use client';

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Clock, Medal, Users, Earth, Star } from 'lucide-react';
import Link from 'next/link';
import AuthModal from '../../components/AuthModal';
import { PopulationService } from '../../services/PopulationService';

const Profile = () => {
  const { gameState } = useGame();
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  // Derive useful stats
  const totalPopulation = Math.floor(PopulationService.totalPopulation(gameState.territories));

  const territoryCount = gameState.territories.length;
  const playTimeMinutes = Math.floor(gameState.playTime / 60);

  if (!user) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-20 flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in">
        <h2 className="text-3xl font-bold mb-4">Command Authorization Required</h2>
        <p className="text-slate-400 mb-8 max-w-md">
          You must be linked to the network database to view your historical command statistics.
        </p>
        <button className="btn btn-primary px-8 py-3" onClick={() => setShowAuth(true)}>
          Initialize Link
        </button>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 animate-fade-in max-w-5xl py-12">
      {/* Header */}
      <div className="mb-10">
        <Link
          href="/"
          className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Return to Command Center
        </Link>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-white">
          Commander Profile
        </h1>
        <p className="text-brand-primary m-0 text-xl font-medium tracking-wide">
          {user.displayName || user.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Core Stats */}
        <div className="cinematic-card flex items-center gap-6">
          <div className="p-4 bg-brand-primary/10 rounded-full border border-brand-primary/30 text-brand-primary">
            <Users size={32} />
          </div>
          <div>
            <div className="text-sm text-slate-400 font-medium mb-1 tracking-wider uppercase">
              Current Population
            </div>
            <div className="text-4xl font-bold text-white">{totalPopulation.toLocaleString()}</div>
          </div>
        </div>

        <div className="cinematic-card flex items-center gap-6">
          <div className="p-4 bg-brand-success/10 rounded-full border border-brand-success/30 text-brand-success">
            <Earth size={32} />
          </div>
          <div>
            <div className="text-sm text-slate-400 font-medium mb-1 tracking-wider uppercase">
              Total Immigrants Assisted
            </div>
            <div className="text-4xl font-bold text-slate-200">
              {gameState.totalImmigrants.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="cinematic-card flex items-center gap-6">
          <div className="p-4 bg-brand-warning/10 rounded-full border border-brand-warning/30 text-brand-warning">
            <Medal size={32} />
          </div>
          <div>
            <div className="text-sm text-slate-400 font-medium mb-1 tracking-wider uppercase">
              Territories Subjugated
            </div>
            <div className="text-4xl font-bold text-slate-200">
              {territoryCount} <span className="text-lg text-slate-500 font-normal">/ 14</span>
            </div>
          </div>
        </div>

        <div className="cinematic-card flex items-center gap-6">
          <div className="p-4 bg-slate-800 rounded-full border border-slate-600 text-slate-300">
            <Clock size={32} />
          </div>
          <div>
            <div className="text-sm text-slate-400 font-medium mb-1 tracking-wider uppercase">
              Command Duration
            </div>
            <div className="text-4xl font-bold text-slate-200">
              {playTimeMinutes}{' '}
              <span className="text-lg text-slate-500 font-normal uppercase tracking-wide">
                Min
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <Medal className="text-brand-warning" /> Tactical Milestones
      </h2>

      {gameState.achievedMilestones.length === 0 ? (
        <div className="cinematic-card border-dashed py-12 text-center text-slate-500 italic">
          No tactical milestones achieved yet. Keep expanding your influence.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gameState.achievedMilestones.map((milestone, idx) => (
            <div
              key={idx}
              className="cinematic-card p-4 flex gap-4 items-center ring-1 ring-brand-warning/20"
            >
              <Star size={24} className="text-brand-warning fill-brand-warning/20" />
              <span className="font-bold tracking-wide">{milestone}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
