import React, { useState } from 'react';
import { User, Page } from '../types/orca';
import { DEMO_USERS } from '../data/orcaConstants';
import { OrcaLogo, IsroBadge, IncoisBadge, CoastGuardBadge } from './BrandingLogos';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User, redirectPage?: Page) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  currentUser,
  onLogout
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'fisherman' | 'admin' | 'officer'>('fisherman');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: 'usr_' + Date.now().toString(36),
      name: name.trim() || (email ? email.split('@')[0] : 'Naval Officer'),
      email: email.trim() || 'demo@isro-orca.gov.in',
      role: role,
      designation: role === 'admin' ? 'Chief Ocean Scientist' : role === 'officer' ? 'Operations Officer' : 'Vessel Master',
      organization: organization.trim() || (role === 'admin' ? 'ISRO SAC' : role === 'officer' ? 'Indian Coast Guard' : 'Fisheries Cooperative'),
      harbour: role === 'fisherman' ? 'Kochi Marine Port' : 'National Command',
      avatar: role === 'fisherman' ? '⚓' : role === 'admin' ? '🛰️' : '🛡️'
    };

    const targetPage: Page = role === 'admin' || role === 'officer' ? 'admin' : 'gis';
    onLogin(newUser, targetPage);
    onClose();
  };

  const handleQuickLogin = (demoUser: User) => {
    const targetPage: Page = (demoUser.role === 'admin' || demoUser.role === 'officer') ? 'admin' : 'gis';
    onLogin(demoUser, targetPage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-marine-950 border border-marine-700/80 rounded-2xl shadow-2xl shadow-cyan-950/80 overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Header */}
        <div className="bg-gradient-to-r from-marine-900 via-marine-800 to-marine-900 px-6 py-5 border-b border-marine-700/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <OrcaLogo size={36} />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-display font-bold text-white text-lg tracking-wider">PROJECT ORCA AUTHENTICATION</h3>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-mono px-2 py-0.5 rounded border border-cyan-500/30">
                  ISRO SIH-26176
                </span>
              </div>
              <p className="text-xs text-gray-400">Multi-Role Marine Access Control & HITL Authority Gateway</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-marine-800 text-gray-400 hover:text-white hover:bg-marine-700 transition"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {currentUser ? (
            /* Current User Active Profile */
            <div className="bg-marine-900/80 border border-cyan-500/40 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl p-2 bg-marine-950 rounded-xl border border-marine-700">
                    {currentUser.avatar || '👤'}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-display text-lg font-bold text-white">{currentUser.name}</h4>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                        currentUser.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                        currentUser.role === 'officer' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      }`}>
                        {currentUser.role}
                      </span>
                    </div>
                    <p className="text-xs text-cyan-400 font-mono">{currentUser.designation} • {currentUser.organization}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{currentUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => { onLogout(); }}
                  className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-mono font-medium transition"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : null}

          {/* Quick 1-Click Demo Profiles for Evaluators */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-cyan-400 text-sm">⚡</span>
                <h4 className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-semibold">
                  1-Click Evaluator Demo Portals
                </h4>
              </div>
              <span className="text-[11px] text-gray-400">Instant role-based authorization</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {DEMO_USERS.map((usr) => (
                <button
                  key={usr.id}
                  onClick={() => handleQuickLogin(usr)}
                  className={`p-3.5 rounded-xl border text-left transition transform hover:-translate-y-0.5 hover:shadow-lg flex flex-col justify-between group ${
                    usr.role === 'fisherman' 
                      ? 'bg-marine-900/60 hover:bg-marine-900 border-cyan-500/30 hover:border-cyan-400' 
                      : usr.role === 'admin'
                      ? 'bg-marine-900/60 hover:bg-marine-900 border-purple-500/30 hover:border-purple-400'
                      : 'bg-marine-900/60 hover:bg-marine-900 border-amber-500/30 hover:border-amber-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{usr.avatar}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        usr.role === 'admin' ? 'bg-purple-900/50 text-purple-300' :
                        usr.role === 'officer' ? 'bg-amber-900/50 text-amber-300' :
                        'bg-cyan-900/50 text-cyan-300'
                      }`}>
                        {usr.role.toUpperCase()}
                      </span>
                    </div>
                    <div className="font-display font-semibold text-white text-sm group-hover:text-cyan-300 transition">
                      {usr.name}
                    </div>
                    <div className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                      {usr.designation}
                    </div>
                    <div className="text-[10px] text-cyan-400/80 font-mono mt-1">
                      {usr.organization}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-marine-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-gray-400">Launch Portal</span>
                    <span className="text-cyan-400 group-hover:translate-x-0.5 transition font-mono">→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-marine-800"></div>
            <span className="flex-shrink mx-4 text-xs font-mono text-gray-500 uppercase">Or Custom Credentials</span>
            <div className="flex-grow border-t border-marine-800"></div>
          </div>

          {/* Custom Credentials Form */}
          <form onSubmit={handleCustomSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Official Email / ID</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@nic.in or vessel-reg@fish.in"
                  className="w-full bg-marine-900 border border-marine-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Security Token / Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-marine-900 border border-marine-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Commander K. Sharma"
                  className="w-full bg-marine-900 border border-marine-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Access Role & Jurisdiction</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-marine-900 border border-marine-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="fisherman">Fisherman / Vessel Master (Navigation View)</option>
                  <option value="admin">ISRO / INCOIS Scientist (Admin & Telemetry)</option>
                  <option value="officer">Coast Guard Officer (HITL & Border Guard)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">Organization / Port / Base (Optional)</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Kochi Fisheries Harbour or ICG Western Command"
                className="w-full bg-marine-900 border border-marine-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <IsroBadge size={22} />
                <IncoisBadge size={22} />
                <CoastGuardBadge size={22} />
                <span className="text-[11px] text-gray-400 font-mono hidden sm:inline">Encrypted Gov Security Layer</span>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-mono text-gray-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-semibold rounded-lg shadow-lg shadow-cyan-900/50 transition transform active:scale-95"
                >
                  Authenticate & Enter →
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
