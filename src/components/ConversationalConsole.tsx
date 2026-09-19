import { useState } from 'react';
import { Send, Volume2, Copy, Sparkles } from 'lucide-react';
import { Message } from '../types/orca';

interface ConversationalConsoleProps {
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (text: string) => void;
  onSpeak: (text: string) => void;
  speaking: boolean;
  selectedPoint: { lat: number; lon: number; name: string };
  metrics: { wave: string; wind: string; safety: string; status: string };
}

export default function ConversationalConsole({
  messages,
  isTyping,
  onSendMessage,
  onSpeak,
  speaking,
  selectedPoint,
  metrics
}: ConversationalConsoleProps) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="w-full h-full flex flex-col max-w-5xl mx-auto p-4 lg:p-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg lg:text-xl font-black text-gray-900">
              Aqua Guardian Conversational Console
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">
              LIA / NLU Active
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Language & Intent Layer extracting structured parameters for the LangGraph swarm.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden md:inline font-mono text-xs text-gray-500">
            Wave: <b>{metrics.wave}</b> | Wind: <b>{metrics.wind}</b> | Status: <b className={metrics.status === 'BLOCKED_BY_SAFETY_ENGINE' ? 'text-rose-600' : 'text-emerald-600'}>{metrics.status === 'BLOCKED_BY_SAFETY_ENGINE' ? 'BLOCKED' : 'CLEARED'}</b>
          </span>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online
          </span>
        </div>
      </div>

      {/* Suggested Flagship Queries */}
      <div className="py-2.5 flex gap-2 overflow-x-auto border-b border-gray-100">
        {[
          'Find a safe tuna fishing location within 30 km tomorrow morning.',
          'Check significant wave height and sea safety clearance off Kochi.',
          'Verify proximity to India-Sri Lanka IMBL border line.',
          'Where is the nearest sardine thermal front with +4x catch yield?'
        ].map((chip, idx) => (
          <button
            key={idx}
            onClick={() => { setInputText(chip); onSendMessage(chip); }}
            className="whitespace-nowrap px-3 py-1 bg-white hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-300 border border-gray-200 rounded-full text-xs font-medium text-gray-700 transition-all cursor-pointer shadow-2xs"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-center p-8 text-gray-500">
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 mb-3 shadow-sm">
              <Sparkles size={24} className="animate-pulse" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">Language & Intent Intelligence</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-md leading-relaxed">
              Ask any maritime query in English, Hindi, Malayalam, or Tamil. The system parses your intent, 
              evaluates vessel constraints, and runs deterministic safety checks.
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 text-xs lg:text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-gray-900 text-white rounded-br-sm shadow-md' 
                  : 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-sm'
              }`}>
                {/* Header for Agent Message */}
                {m.role === 'agent' && (
                  <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100 text-gray-400">
                    <span className="font-extrabold text-[10px] tracking-wider uppercase text-cyan-800">
                      AQUA GUARDIAN ADVISORY ({selectedPoint.name})
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onSpeak(m.content)}
                        className={`cursor-pointer hover:text-cyan-600 transition-colors ${speaking ? 'text-cyan-600 animate-bounce' : ''}`}
                        title="Listen in Vernacular Voice (TTS)"
                      >
                        <Volume2 size={15} />
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(m.content)}
                        className="cursor-pointer hover:text-gray-700 transition-colors"
                        title="Copy Advisory"
                      >
                        <Copy size={15} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="whitespace-pre-wrap">{m.content}</div>

                {/* Structured Intent Breakdown Card */}
                {m.structuredIntent && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-700 space-y-1.5 font-mono text-[11px]">
                    <div className="text-[10px] font-bold text-gray-400 uppercase">
                      STRUCTURED INTENT (NLU EXTRACTION):
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>Intent: <b>{m.structuredIntent.intent_type}</b></div>
                      <div>Species: <b>{m.structuredIntent.species}</b></div>
                      <div>Radius: <b>{m.structuredIntent.max_radius_km} km</b></div>
                      <div>Window: <b>{m.structuredIntent.time_window}</b></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-800 p-3 bg-cyan-50 border border-cyan-200 rounded-xl w-fit">
            <Sparkles size={14} className="animate-spin text-cyan-600" />
            <span>Parsing NLU intent & executing LangGraph Swarm...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="pt-3 border-t border-gray-200 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask in your language (e.g. Can artisanal boat fish tuna near Kochi tomorrow morning?)"
          className="flex-1 bg-white border border-gray-300 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs lg:text-sm focus:outline-none shadow-sm"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-300 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
        >
          <Send size={14} />
          <span>Dispatch</span>
        </button>
      </form>
    </div>
  );
}
