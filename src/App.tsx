import { useState, useEffect } from 'react';
import { 
  CandidateZone, 
  LanguageCode, 
  Message, 
  Page, 
  ScenarioMode, 
  VesselProfile,
  User 
} from './types/orca';
import { 
  CANDIDATE_ZONES, 
  VESSEL_PROFILES 
} from './data/orcaConstants';
import { 
  playVernacularTTS, 
  queryOrchestrator 
} from './services/orchestrationService';

import HeaderNav from './components/HeaderNav';
import HomePage from './components/HomePage';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import GisCommandCenter from './components/GisCommandCenter';
import DecisionMatrix from './components/DecisionMatrix';
import ExplainableAiShap from './components/ExplainableAiShap';
import AgentDagExplorer from './components/AgentDagExplorer';
import VesselIntelligence from './components/VesselIntelligence';
import ScenarioStudio from './components/ScenarioStudio';
import TrustProvenance from './components/TrustProvenance';
import ConversationalConsole from './components/ConversationalConsole';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [activeLang, setActiveLang] = useState<LanguageCode>('en');
  const [activeScenario, setActiveScenario] = useState<ScenarioMode>('normal');
  const [selectedVessel, setSelectedVessel] = useState<VesselProfile>(VESSEL_PROFILES[0]);
  const [selectedZone, setSelectedZone] = useState<CandidateZone>(CANDIDATE_ZONES[0]);
  const [edgeOffline, setEdgeOffline] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Selected Point on GIS Map
  const [selectedPoint, setSelectedPoint] = useState<{ lat: number; lon: number; name: string }>({
    lat: 9.75,
    lon: 75.55,
    name: 'Sector 9.75°N, 75.55°E (Off Kochi PFZ)'
  });

  // Live Ocean Metrics
  const [metrics, setMetrics] = useState({
    wave: '1.03m',
    wind: '14.9 kts',
    safety: '74.2/100',
    status: 'SAFE_FOR_VENTURE'
  });

  // Conversation history starts clean
  const [messages, setMessages] = useState<Message[]>([]);

  // Update metrics when scenario changes
  useEffect(() => {
    if (activeScenario === 'high_swell') {
      setMetrics({
        wave: '3.65m',
        wind: '28.4 kts',
        safety: '28.4/100 (BLOCKED)',
        status: 'BLOCKED_BY_SAFETY_ENGINE'
      });
    } else if (activeScenario === 'imbl_violation') {
      setMetrics({
        wave: '1.20m',
        wind: '16.0 kts',
        safety: '32.1/100 (BLOCKED)',
        status: 'BLOCKED_BY_SAFETY_ENGINE'
      });
    } else {
      setMetrics({
        wave: '1.03m',
        wind: '14.9 kts',
        safety: '74.2/100',
        status: 'SAFE_FOR_VENTURE'
      });
    }
  }, [activeScenario]);

  // Handle Speech TTS
  const handleSpeak = (text: string) => {
    if (speaking) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    playVernacularTTS(text, activeLang, () => setSpeaking(false));
  };

  // Send query to Orchestrator (Backend API or Gemini fallback)
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await queryOrchestrator(
        text,
        selectedPoint.lat,
        selectedPoint.lon,
        activeLang,
        activeScenario,
        selectedVessel
      );

      setMetrics({
        wave: res.wave,
        wind: res.wind,
        safety: res.safetyScore,
        status: res.verdict
      });

      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: res.answer,
        verdict: res.verdict,
        species: res.species,
        imbl: res.imbl,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, agentMsg]);
    } catch (err) {
      console.error('[ORCA App] Message query error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle map click
  const handleSelectPoint = (point: { lat: number; lon: number; name: string }) => {
    setSelectedPoint(point);
    const query = `Analyze ocean conditions, PFZ suitability, and IMBL border proximity at ${point.name}.`;
    handleSendMessage(query);
  };

  // Handle target candidate zone click from Decision Matrix or Scenario Studio
  const handleSelectZone = (zone: CandidateZone) => {
    setSelectedZone(zone);
    setSelectedPoint({
      lat: zone.lat,
      lon: zone.lon,
      name: zone.name
    });
    setCurrentPage('gis');
  };

  // Emergency SOS trigger
  const handleSos = () => {
    alert('🚨 EMERGENCY DISTRESS TRANSMISSION INITIATED\n\nVHF Channel 16 Broadcast Triggered.\nINCOIS Maritime Rescue Coordination Centre (MRCC - 1554) Notified.\nGPS Distress Coordinates: ' + selectedPoint.lat + '°N, ' + selectedPoint.lon + '°E');
  };

  // Handle Login
  const handleLogin = (user: User, targetPage?: Page) => {
    setCurrentUser(user);
    if (targetPage) {
      setCurrentPage(targetPage);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="flex flex-col h-screen w-full font-sans text-gray-800 bg-[#f4f6f9] overflow-hidden select-none">
      
      {/* Top Header Bar */}
      <HeaderNav
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        activeLang={activeLang}
        onLangChange={setActiveLang}
        activeScenario={activeScenario}
        onScenarioChange={setActiveScenario}
        selectedVessel={selectedVessel}
        onVesselChange={setSelectedVessel}
        onSosTrigger={handleSos}
        edgeOffline={edgeOffline}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Plane Workspace */}
      <main className="flex-1 relative overflow-hidden">
        {/* 0. Home / Landing Page */}
        {currentPage === 'home' && (
          <HomePage
            onNavigate={setCurrentPage}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {/* 1. Admin Control & Fleet Command Center */}
        {currentPage === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
            onNavigate={setCurrentPage}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {/* 2. GIS Command Center */}
        {currentPage === 'gis' && (
          <GisCommandCenter
            selectedPoint={selectedPoint}
            onSelectPoint={handleSelectPoint}
            metrics={metrics}
            messages={messages}
            isTyping={isTyping}
            onSendMessage={handleSendMessage}
            onSpeak={handleSpeak}
            speaking={speaking}
            activeScenario={activeScenario}
            selectedVessel={selectedVessel}
          />
        )}

        {/* 3. Multi-Objective Decision Matrix */}
        {currentPage === 'decision_matrix' && (
          <DecisionMatrix
            selectedVessel={selectedVessel}
            activeScenario={activeScenario}
            onSelectZoneOnMap={handleSelectZone}
          />
        )}

        {/* 4. Explainable AI & Conformal Uncertainty */}
        {currentPage === 'explainable_ai' && (
          <ExplainableAiShap
            selectedZone={selectedZone}
            onSelectZone={setSelectedZone}
          />
        )}

        {/* 5. LangGraph Multi-Agent Swarm DAG */}
        {currentPage === 'agent_dag' && (
          <AgentDagExplorer
            selectedPoint={selectedPoint}
            activeScenario={activeScenario}
            onRunDagQuery={async (q: string) => {
              return queryOrchestrator(
                q,
                selectedPoint.lat,
                selectedPoint.lon,
                activeLang,
                activeScenario,
                selectedVessel
              );
            }}
          />
        )}

        {/* 6. Vessel Reachability & Hydrodynamics Studio */}
        {currentPage === 'vessel_intel' && (
          <VesselIntelligence
            selectedVessel={selectedVessel}
            onSelectVessel={setSelectedVessel}
          />
        )}

        {/* 7. What-If Scenario Sandbox */}
        {currentPage === 'scenario_studio' && (
          <ScenarioStudio
            selectedVessel={selectedVessel}
            activeScenario={activeScenario}
            onScenarioChange={setActiveScenario}
            onSelectZone={handleSelectZone}
          />
        )}

        {/* 8. Trust, Provenance & HITL Escalation */}
        {currentPage === 'trust_provenance' && (
          <TrustProvenance
            selectedPoint={selectedPoint}
            activeScenario={activeScenario}
          />
        )}

        {/* 9. Conversational Console */}
        {currentPage === 'chatbot' && (
          <ConversationalConsole
            messages={messages}
            isTyping={isTyping}
            onSendMessage={handleSendMessage}
            onSpeak={handleSpeak}
            speaking={speaking}
            selectedPoint={selectedPoint}
            metrics={metrics}
          />
        )}
      </main>

      {/* Offline Edge Toggle in bottom right for demonstration */}
      {currentPage !== 'home' && (
        <div className="absolute bottom-2 right-4 z-40">
          <button
            onClick={() => setEdgeOffline(prev => !prev)}
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
              edgeOffline 
                ? 'bg-amber-600 text-white border-amber-500 shadow-md animate-pulse' 
                : 'bg-gray-800/80 hover:bg-gray-900 text-gray-300 border-gray-700'
            }`}
            title="Toggle Edge Offline Mode to test SQLite-WASM local cached rules"
          >
            {edgeOffline ? '⚡ Test Mode: OFFLINE CACHE (Active)' : '🌐 Test Mode: Edge Online'}
          </button>
        </div>
      )}

      {/* Authentication & Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

    </div>
  );
}
