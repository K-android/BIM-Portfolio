import React, { useState } from 'react';
import { Terminal, FileSearch, FileEdit, Eye, ClipboardCheck, Play, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const tools = [
  {
    id: 'finder',
    title: 'Finder & Auditor',
    icon: <FileSearch className="w-8 h-8" strokeWidth={1.5} />,
    description: 'A localized, read-only search engine for your Revit model.',
    function: 'Searches the model using natural language and highlights elements matching specific parameter queries, targeted names, levels, phases, or worksets. Fully unit-aware for dimensional filtering (e.g., "Find doors with Height > 7ft").',
    outputTitle: 'Output',
    output: 'Visually overrides elements in gold and silently generates temporary CSV reports for external database tracking and schedules.'
  },
  {
    id: 'editor',
    title: 'Parameter Editor',
    icon: <FileEdit className="w-8 h-8" strokeWidth={1.5} />,
    description: 'Translates text prompts into direct database edits with built-in unit conversion.',
    function: 'Securely handles string, double, and integer (Yes/No) modifications across multiple elements or types simultaneously.',
    outputTitle: 'Safety Checkpoint',
    output: 'Features a mandatory UI confirmation dialogue to verify transaction quantities, target parameters, active metric conversions, and exact values before committing changes to the Revit database.'
  },
  {
    id: 'manipulator',
    title: 'View Manipulator',
    icon: <Eye className="w-8 h-8" strokeWidth={1.5} />,
    description: 'An automated virtual camera operator for 3D views.',
    function: 'Automates Revit camera and visibility graphics. Instantly calculates collective element bounding boxes to generate precise 3D section boxes around specific target elements, or temporarily isolates specialized categories via text prompt.',
    outputTitle: 'Output',
    output: 'Isolates and creates precise 3D views for coordination and visualization instantly.'
  },
  {
    id: 'auditor',
    title: 'Data & Compliance Auditor',
    icon: <ClipboardCheck className="w-8 h-8" strokeWidth={1.5} />,
    description: 'A targeted QA/QC tool for validating architectural intent and schedule readiness.',
    function: 'Instantly flags missing model data (e.g., blank fire ratings) and dimensional code violations (e.g., minimum egress widths).',
    outputTitle: 'Output',
    output: 'Overrides offending geometry in bright red for immediate visual feedback, replacing tedious manual schedule reviews.'
  }
];

export const PyRevitToolbar = ({ onShowVideo }: { onShowVideo?: () => void }) => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  return (
    <div className="mb-16 border border-white/10 rounded-xl bg-[#0a0a0c]/90 backdrop-blur-xl overflow-hidden font-sans shadow-[0_20px_60px_-15px_rgba(0,0,0,1)] ring-1 ring-white/5 relative group/toolbar">
      {/* Decorative Header */}
      <div className="bg-[#12141a]/90 border-b border-white/5 px-4 py-3 flex flex-col md:flex-row items-start md:items-center justify-between relative gap-3 md:gap-0">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="flex items-center gap-3 relative z-10 shrink-0 w-full md:w-auto">
          <img 
            src="https://raw.githubusercontent.com/pyrevitlabs/pyRevit/master/docs/static/pyRevitLogo.svg" 
            alt="pyRevit" 
            className="w-5 h-5 drop-shadow-[0_0_8px_rgba(255,204,0,0.5)]" 
          />
          <h3 className="text-sm font-semibold tracking-wide text-gray-200 flex flex-wrap items-center gap-1.5 md:gap-2">
            <span>AEC Automator</span> <span className="text-gray-600 font-normal">|</span> <span>PyRevit AI Suite</span>
          </h3>
        </div>
        <div className="flex items-center gap-2 md:gap-3 shrink-0 w-full md:w-auto flex-wrap">
          {onShowVideo && (
            <button 
              onClick={onShowVideo}
              className="text-[10px] uppercase tracking-widest text-[#3B82F6] hover:text-white transition-colors px-3 py-1 rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 hover:bg-[#3B82F6]/30 flex items-center gap-1.5 whitespace-nowrap"
            >
              <Play className="w-3 h-3" /> Show Video
            </button>
          )}
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-neon-cyan transition-colors px-3 py-1 rounded-full border border-white/5 bg-white/5 hover:bg-neon-cyan/10 whitespace-nowrap"
          >
            {showInfo ? 'Hide Info' : 'Project Info'}
          </button>
          <a href="https://github.com/K-android/AEC-Automator-PyRevit-Suite" target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-neon-cyan transition-colors px-3 py-1 rounded-full border border-white/5 bg-white/5 hover:bg-neon-cyan/10 hidden md:block whitespace-nowrap">
            View Repository
          </a>
        </div>
      </div>

      <div className="p-6 md:p-8 flex flex-col items-center">
        
        {/* Project Info Section */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full max-w-5xl mb-12 space-y-8 overflow-hidden"
            >
              <div className="space-y-4 text-center md:text-left">
                 <p className="text-sm text-gray-400 leading-relaxed max-w-4xl mx-auto md:mx-0">
                   A robust, custom Revit extension built with PyRevit, Python, and the Revit API. This toolset leverages Google Gemini's Large Language Model (LLM) to translate natural language prompts into safe, precise, and predictable BIM workflows.
                 </p>
                 <p className="text-sm text-gray-400 leading-relaxed max-w-4xl mx-auto md:mx-0">
                   Designed for Design Technologists and BIM Coordinators, this suite accelerates day-to-day architectural modeling, enforces data integrity for strict ISO-compliant deliverables, and bridges the gap between conversational AI and hard-coded Revit API transactions.
                 </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 pt-6 relative">
                 <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                 <div className="space-y-3 bg-white/[0.02] p-6 rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]">
                    <div className="text-xs font-mono tracking-widest text-[#3B82F6] uppercase mb-4 flex items-center gap-2">
                      <span className="opacity-50">01.</span> Self-Diagnosing Engine
                    </div>
                    <p className="text-[13px] text-gray-400 leading-relaxed">Employs fuzzy-logic matching to auto-correct slight parameter misspellings (e.g., mapping "fire code" to "Fire Rating"). Generates diagnostic reports if a parameter doesn't exist.</p>
                 </div>
                 <div className="space-y-3 bg-white/[0.02] p-6 rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]">
                    <div className="text-xs font-mono tracking-widest text-[#10B981] uppercase mb-4 flex items-center gap-2">
                      <span className="opacity-50">02.</span> Dynamic Unit Math
                    </div>
                    <p className="text-[13px] text-gray-400 leading-relaxed">Automatically extracts units (mm, cm, m, in, ft) from prompts and dynamically converts them to Revit's internal Decimal Feet format on the fly, ensuring safe dimensional scaling.</p>
                 </div>
                 <div className="space-y-3 bg-white/[0.02] p-6 rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(0,243,255,0.3)]">
                    <div className="text-xs font-mono tracking-widest text-neon-cyan uppercase mb-4 flex items-center gap-2">
                      <span className="opacity-50">03.</span> Keyword Isolation
                    </div>
                    <p className="text-[13px] text-gray-400 leading-relaxed">Prevents accidental bulk-editing by isolating elements via Family Names, Type Names, Marks, and Comments prior to transaction execution.</p>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Toolbar UI to match the image */}
        <div className="w-full text-center mb-6">
           <h4 className="text-sm font-mono tracking-widest text-gray-200 uppercase flex items-center justify-center gap-2">
             <Settings className="w-4 h-4 text-neon-cyan" /> The Toolkit
           </h4>
           <p className="text-xs text-gray-500 mt-2">The suite consists of four specialized tools, structured for maximum predictability and model safety.</p>
        </div>

        <div className="bg-[#1e232b] bg-opacity-80 backdrop-blur-md border border-[#2d3436] rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] w-full max-w-4xl overflow-hidden flex flex-col items-center relative">
          {/* Subtle top glow */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          <div className="grid grid-cols-2 md:flex w-full gap-3 md:gap-0 md:divide-x divide-white/5 relative z-10 p-3 md:p-0">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
                className={`flex-1 flex flex-col items-center justify-center gap-2 md:gap-4 p-3 md:py-8 md:px-2 min-h-[90px] md:min-h-0 rounded-lg md:rounded-none transition-all duration-300 relative group overflow-hidden
                  ${activeTool === tool.id 
                    ? 'bg-gradient-to-b from-black/40 to-neon-cyan/5 text-white border border-neon-cyan/20 md:border-none' 
                    : 'bg-black/20 md:bg-transparent text-gray-400 hover:bg-white/5 hover:text-white border border-white/5 md:border-none md:border-transparent'
                  }
                `}
              >
                {/* Active Tool Glowing Indicator */}
                {activeTool === tool.id && (
                  <motion.div 
                    layoutId="activeToolGlow"
                    className="absolute top-0 left-0 w-full h-full bg-neon-cyan/5 pointer-events-none md:rounded-none rounded-lg"
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-neon-cyan shadow-[0_0_15px_2px_rgba(0,243,255,0.8)]"></div>
                  </motion.div>
                )}

                <div className={`transition-all duration-300 relative z-10 ${activeTool === tool.id ? 'scale-110 text-neon-cyan drop-shadow-[0_0_8px_rgba(0,243,255,0.6)]' : 'text-gray-500 group-hover:scale-105 group-hover:text-gray-300'}`}>
                  {tool.icon}
                </div>
                <span className={`text-xs break-words hyphens-auto w-full tracking-wide text-center leading-tight transition-all duration-300 relative z-10 ${activeTool === tool.id ? 'font-semibold text-neon-cyan' : 'font-medium'}`}>
                  {tool.title}
                </span>
              </button>
            ))}
          </div>
          
          <div className="w-full text-center pb-3 pt-4 relative bg-black/20 mt-auto border-t border-white/5">
            <span className="text-[10px] font-mono tracking-[0.2em] text-gray-500 uppercase">Smart_Tools</span>
          </div>
        </div>

        {/* Info Panel Animation */}
        <div className="w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {activeTool && (
            <motion.div
              key={activeTool}
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 overflow-hidden w-full"
            >
              <div className="p-6 md:p-8 bg-gradient-to-br from-[#12141a] to-[#0a0a0c] border border-white/5 shadow-2xl rounded-lg relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-neon-cyan shadow-[0_0_20px_rgba(0,243,255,0.8)]"></div>
                {/* Subtle top reflection */}
                <div className="absolute top-0 left-1 right-0 h-[1px] bg-gradient-to-r from-neon-cyan/40 via-white/10 to-transparent"></div>
                
                {(() => {
                  const activeData = tools.find(t => t.id === activeTool);
                  if (!activeData) return null;
                  
                  return (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-bold text-gray-200 mb-2 flex items-center gap-3">
                          {activeData.title}
                        </h4>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-4xl">
                          {activeData.description}
                        </p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                        <div className="space-y-2">
                          <div className="text-[10px] font-mono tracking-widest text-[#3B82F6] uppercase">Function</div>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            {activeData.function}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="text-[10px] font-mono tracking-widest text-[#10B981] uppercase">{activeData.outputTitle}</div>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            {activeData.output}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>

        {/* Technical Stack & Installation */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full max-w-5xl overflow-hidden"
            >
              <div className="mt-16 grid md:grid-cols-2 gap-8 border-t border-white/5 pt-12 relative">
                  <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  <div className="space-y-6 bg-white/[0.02] p-6 md:p-8 rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-colors">
                     <h4 className="text-sm font-bold text-gray-200 font-mono tracking-widest uppercase flex items-center gap-3">
                       <Terminal className="w-4 h-4 text-neon-cyan" /> Technical Stack
                     </h4>
                     <ul className="text-xs text-gray-400 space-y-4 font-mono">
                        <li className="flex items-start gap-3">
                          <span className="text-gray-600 mt-0.5">&gt;</span>
                          <div><span className="text-gray-300">Environment:</span><br/>Revit, PyRevit</div>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-gray-600 mt-0.5">&gt;</span>
                          <div><span className="text-gray-300">Languages:</span><br/>Python, C# (.NET Framework)</div>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-gray-600 mt-0.5">&gt;</span>
                          <div><span className="text-gray-300">API Integration:</span><br/>Autodesk Revit API, Google Gemini 2.5 Flash REST API</div>
                        </li>
                     </ul>
                  </div>
                  <div className="space-y-6 bg-white/[0.02] p-6 md:p-8 rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-colors">
                     <h4 className="text-sm font-bold text-gray-200 font-mono tracking-widest uppercase flex items-center gap-3">
                       <ClipboardCheck className="w-4 h-4 text-[#10B981]" /> Installation
                     </h4>
                     <ul className="text-[13px] text-gray-400 space-y-4">
                        <li className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-1.5 shrink-0" />
                          <p className="leading-relaxed">Install PyRevit and add the cloned extension folder via settings.</p>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan mt-1.5 shrink-0 shadow-[0_0_8px_rgba(0,243,255,0.5)]" />
                          <p className="leading-relaxed">Securely set <code className="bg-black/50 text-neon-cyan px-2 py-1 rounded border border-neon-cyan/20 font-mono text-[11px] shadow-inner">GEMINI_API_KEY</code> in Windows Environment Variables to authenticate the AI.</p>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-1.5 shrink-0" />
                          <p className="leading-relaxed">Reload PyRevit to initialize the ribbon.</p>
                        </li>
                     </ul>
                  </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
