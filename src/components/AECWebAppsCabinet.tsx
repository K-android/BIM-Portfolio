import React, { useState, useEffect } from "react";
import { 
  Globe, 
  ExternalLink, 
  Database, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  Zap, 
  ArrowRight, 
  Activity, 
  Terminal, 
  Layers, 
  Workflow, 
  RefreshCw,
  FolderOpen,
  Github
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AECWorkflowHub } from "./AECWorkflowHub.tsx";

export const AECWebAppsCabinet: React.FC = () => {
  const [currentTab1, setCurrentTab1] = useState<"desc" | "features" | "process">("desc");
  const [currentTab2, setCurrentTab2] = useState<"desc" | "features" | "process">("desc");
  const [currentTab3, setCurrentTab3] = useState<"desc" | "features" | "process">("desc");
  
  // Real-time animation states for the BIM Metric Portal visualizer
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    "SYS_INIT: Initializing Webhook listener on port 3000...",
    "DB_CONN: Firestore server cluster live. Active channel: #vdc-telemetry",
    "LISTENER: Awaiting incoming local Revit desktop webhook streams..."
  ]);
  const [takeoffsCount, setTakeoffsCount] = useState(1480);
  const [lastUpdated, setLastUpdated] = useState("Just Now");
  
  // Simulate incoming Webhook telemetry stream logs for BIM Metric Portal
  useEffect(() => {
    const interval = setInterval(() => {
      const entities = ["Wall_Family_Interior", "Structural_Column_HSS", "Floor_Slab_Reinforced", "Cable_Tray_Egress_Route", "Conduit_Run_MEP_Shielded"];
      const randomEntity = entities[Math.floor(Math.random() * entities.length)];
      const randomVolume = (Math.random() * 45 + 5).toFixed(2);
      const uuid = Math.floor(Math.random() * 900000 + 100000);
      
      const newLog = `WEBHOOK_RECV [0.01h]: Extracted parameters for Element_${uuid} (${randomEntity}) // Vol: ${randomVolume}m³ // ISO-19650_OK`;
      
      setTelemetryLogs(prev => {
        const next = [...prev, newLog];
        if (next.length > 5) next.shift();
        return next;
      });
      setTakeoffsCount(prev => prev + 1);
      
      // Update timer stamp
      const seconds = Math.floor(Math.random() * 4) + 1;
      setLastUpdated(`${seconds}s ago`);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-16">
      {/* 2-COLUMN STACKED HIGH-TECH APPS CABINET */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        
        {/* APP 1: AEC AUTOMATOR HUB */}
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ 
            y: -10, 
            scale: 1.015,
            transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
          }}
          className="flex flex-col border border-white/10 bg-black/80 hover:border-neon-orange hover:shadow-[0_0_30px_rgba(249,115,22,0.05)] transition-all duration-700 overflow-hidden relative group"
        >
          <div className="h-1.5 w-full transition-all duration-700 bg-neon-orange opacity-20 group-hover:opacity-100" />
          
          <div className="p-5 flex flex-col relative z-10">
            <div className="flex justify-end items-start mb-3">
              <span className="text-xs font-sans tracking-widest text-gray-500">
                DESK_APP_01
              </span>
            </div>
            
            <h3 className="text-base md:text-lg font-bold mb-4 font-sans text-white group-hover:text-neon-orange transition-colors duration-700">
              AEC Automator Hub
            </h3>
          </div>

          {/* Interactive Screen Layout Mockup / Hero Image Column */}
          <div className="relative max-h-[180px] md:max-h-none aspect-video md:aspect-[16/8] overflow-hidden group border-b border-white/10 bg-black/95">
            {/* Visual Engineering Grid Background */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.06] pointer-events-none z-10" />
            


            {/* Actual Google Drive Hero Image */}
            <img loading="lazy" 
              src="https://drive.google.com/thumbnail?id=1uD54l3GD2t-ul_kan00c_rV124uxlOa8&sz=w1000"
              alt="AEC Automator Hub Preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700 filter saturate-[0.85] pointer-events-none select-none"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />
            
            {/* Dark gradient mapping overlays matches dashboard design cleanly */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none" />
            <div className="absolute top-3 left-3 z-20 bg-black/80 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded text-[9.5px] font-sans text-gray-300  tracking-wider flex items-center gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 bg-neon-orange rounded-full animate-pulse" />
              Live System Preview
            </div>
          </div>

          {/* Description & Actionable Tabs */}
          <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
            <div>
              {/* App Navigation Tab Buttons */}
              <div className="flex w-full md:inline-flex md:w-auto bg-black/90 border border-white/10 p-1 rounded font-sans text-xs mb-6 font-bold leading-none">
                <button
                  onClick={() => setCurrentTab1("desc")}
                  className={`flex-1 md:flex-none text-center px-2 md:px-3 py-1.5 transition-all text-xs rounded  font-bold tracking-wider ${
                    currentTab1 === "desc" ? "bg-neon-orange/15 text-neon-orange border border-neon-orange/20" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Desc
                </button>
                <button
                  onClick={() => setCurrentTab1("features")}
                  className={`flex-1 md:flex-none text-center px-2 md:px-3 py-1.5 transition-all text-xs rounded  font-bold tracking-wider ${
                    currentTab1 === "features" ? "bg-neon-orange/15 text-neon-orange border border-neon-orange/20" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Highlights
                </button>
                <button
                  onClick={() => setCurrentTab1("process")}
                  className={`flex-1 md:flex-none text-center px-2 md:px-3 py-1.5 transition-all text-xs rounded  font-bold tracking-wider ${
                    currentTab1 === "process" ? "bg-neon-orange/15 text-neon-orange border border-neon-orange/20" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Process
                </button>
              </div>

              {/* Tab Contents */}
              <div className="min-h-[140px] font-sans">
                <AnimatePresence mode="wait">
                  {currentTab1 === "desc" && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-3"
                    >
                      <p className="text-gray-300 text-sm leading-relaxed font-sans font-medium">
                        A centralized cloud-based command center developed to discover, rank, and track computational design automation pipelines—bridging the gap between software engineering, AI, and sustainable building performance.
                      </p>
                      <div className="text-[#3B82F6] text-[10.5px] border-l-2 border-neon-orange pl-3 py-1 bg-neon-orange/[0.01]">
                        // AEC Automator Hub: An AI-Driven Workflow Optimization & Lifecycle Dashboard.
                      </div>
                    </motion.div>
                  )}

                  {currentTab1 === "features" && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-2.5 text-xs text-gray-300"
                    >
                      <div className="flex gap-2 items-start">
                        <CheckCircle2 className="w-4 h-4 text-neon-orange shrink-0 mt-0.5" />
                        <div>
                          <strong>Algorithmic ROI Ranking</strong>: Developed a telemetry dashboard that categorizes tasks (Architecture, BIM, Structural, MEP) and ranks their automation potential based on corporate time-saving metrics.
                        </div>
                      </div>
                      <div className="flex gap-2 items-start">
                        <CheckCircle2 className="w-4 h-4 text-neon-orange shrink-0 mt-0.5" />
                        <div>
                          <strong>AI-Agentic System Frameworks</strong>: Conceptualized and mapped out next-generation integration pipelines, including autonomous regulatory code compliance engines using LLMs and live generative carbon tracking.
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentTab1 === "process" && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-3 font-sans text-[11px] text-gray-400"
                    >
                      <div className="flex gap-3 items-center">
                        <span className="w-5 h-5 rounded-full bg-neon-orange/15 border border-neon-orange/35 text-neon-orange flex items-center justify-center font-bold text-xs">01</span>
                        <span>Track active computational design automation pipelines securely.</span>
                      </div>
                      <div className="flex gap-3 items-center">
                        <span className="w-5 h-5 rounded-full bg-neon-orange/15 border border-neon-orange/35 text-neon-orange flex items-center justify-center font-bold text-xs">02</span>
                        <span>Formulate regulatory compliance routines and live carbon lifecycle estimates.</span>
                      </div>
                      <div className="flex gap-3 items-center">
                        <span className="w-5 h-5 rounded-full bg-neon-orange/15 border border-neon-orange/35 text-neon-orange flex items-center justify-center font-bold text-xs">03</span>
                        <span>Deliver on-demand PyRevit/Dynamo strategies with the LLM code sandbox.</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Stack tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                {["React", "Tailwind CSS", "Vercel Deployment", "VDC Strategy", "Generative Design Logic", "LLM API Integration (Gemini)", "Carbon Analytics (LCA) Frameworks"].map((tag, idx) => (
                  <span key={`${tag}-${idx}`} className="text-[10px] font-sans px-2 py-1 flex-shrink-0 border border-white/5 text-gray-500 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Glowing Interactive Portal & Vercel Launcher Buttons */}
            <div className="mt-8 pt-4 border-t border-white/10 flex flex-col xl:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon-orange animate-pulse" />
                <span className="font-sans text-xs text-gray-400  tracking-widest">Status: Production Live</span>
              </div>
              <div className="flex gap-2 w-full xl:w-auto mt-4 md:mt-0">
                <a
                  href="https://github.com/K-android/AEC-Auto-Hub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none font-sans text-xs px-2 md:px-3 py-2 bg-gray-800/50 hover:bg-gray-700 border border-white/10 text-white rounded font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Repo</span>
                </a>
                <a
                  href="https://aec-auto-hub.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none font-sans text-xs px-2 md:px-3 py-2 bg-neon-orange/15 hover:bg-neon-orange border border-neon-orange/30 text-neon-orange hover:text-black rounded font-bold transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(249,115,22,0.1)] active:scale-95"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Live App</span>
                  
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* APP 2: BIM METRIC PORTAL & WEBHOOK API GATEWAY */}
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ 
            y: -10, 
            scale: 1.015,
            transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
          }}
          className="flex flex-col border border-white/10 bg-black/80 hover:border-white/10 hover:shadow-[0_0_30px_rgba(0,255,255,0.05)] transition-all duration-700 overflow-hidden relative group"
        >
          <div className="h-1.5 w-full transition-all duration-700 bg-neon-cyan opacity-20 group-hover:opacity-100" />
          
          <div className="p-5 flex flex-col relative z-10">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] md:text-xs font-sans font-bold px-2 py-1 rounded tracking-widest transition-colors duration-700 flex-wrap break-words text-amber-400 bg-amber-400/10 border border-amber-400/20">
                  [ PROOF OF CONCEPT ]
                </span>
              </div>
              <span className="text-xs font-sans tracking-widest text-gray-500">
                DESK_APP_02
              </span>
            </div>
            
            <h3 className="text-base md:text-lg font-bold mb-4 font-sans text-white group-hover:text-[#6366F1] transition-colors duration-700">
              BIM Metric Portal & API Gateway
            </h3>
          </div>

          {/* Real-time Telemetry Screen Mockup / Hero Image Column */}
          <div className="relative max-h-[180px] md:max-h-none aspect-video md:aspect-[16/8] overflow-hidden group border-b border-white/10 bg-black/95">
            {/* Visual Engineering Grid Background */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.06] pointer-events-none z-10" />
            
            {/* Actual Google Drive Hero Image */}
            <img loading="lazy" 
              src="https://drive.google.com/thumbnail?id=13Rvm3c9bgRm3vDWsufo4b4pvnWvIoCDo&sz=w1000"
              alt="BIM Metric Portal Preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700 filter saturate-[0.85] pointer-events-none select-none"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />
            
            {/* Dark gradient mapping overlays matches dashboard design cleanly */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none" />
            <div className="absolute top-3 left-3 z-20 bg-black/80 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded text-[9.5px] font-sans text-gray-300  tracking-wider flex items-center gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 bg-[#6366F1] rounded-full animate-pulse" />
              Live System Preview
            </div>
          </div>

          {/* Description & Actionable Tabs */}
          <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
            <div>
              {/* App Navigation Tab Buttons */}
              <div className="flex w-full md:inline-flex md:w-auto bg-black/90 border border-white/10 p-1 rounded font-sans text-xs mb-6 font-bold leading-none">
                <button
                  onClick={() => setCurrentTab2("desc")}
                  className={`flex-1 md:flex-none text-center px-2 md:px-3 py-1.5 transition-all text-xs rounded  font-bold tracking-wider ${
                    currentTab2 === "desc" ? "bg-[#6366F1]/15 text-[#6366F1] border border-[#6366F1]/30" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Desc
                </button>
                <button
                  onClick={() => setCurrentTab2("features")}
                  className={`flex-1 md:flex-none text-center px-2 md:px-3 py-1.5 transition-all text-xs rounded  font-bold tracking-wider ${
                    currentTab2 === "features" ? "bg-[#6366F1]/15 text-[#6366F1] border border-[#6366F1]/30" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Highlights
                </button>
                <button
                  onClick={() => setCurrentTab2("process")}
                  className={`flex-1 md:flex-none text-center px-2 md:px-3 py-1.5 transition-all text-xs rounded  font-bold tracking-wider ${
                    currentTab2 === "process" ? "bg-[#6366F1]/15 text-[#6366F1] border border-[#6366F1]/30" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Process
                </button>
              </div>

              {/* Tab Contents */}
              <div className="min-h-[140px] font-sans">
                <AnimatePresence mode="wait">
                  {currentTab2 === "desc" && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-3"
                    >
                      <p className="text-gray-300 text-sm leading-relaxed font-sans font-medium">
                        An R&amp;D prototype built to validate real-time ISO 19650 metadata streaming and cloud telemetry workflows. A live connected Virtual Design &amp; Construction (VDC) data hub designed to eliminate the traditional wait time for drawing coordination and cost takeoffs.
                      </p>
                      <div className="text-[#3B82F6] text-[10.5px] border-l-2 border-white/10 pl-3 py-1 bg-neon-cyan/[0.01]">
                        // Cutting data extraction latency down to absolute zero — synchronizing quantities straight from building design saved states to server nodes.
                      </div>
                    </motion.div>
                  )}

                  {currentTab2 === "features" && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-2.5 text-xs text-gray-300"
                    >
                      <div className="flex gap-2 items-start">
                        <CheckCircle2 className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                        <div>
                          <strong>Real-Time Data Streaming</strong>: Replaced manual spreadsheet compilation with a custom Webhook API, cutting data latency down to absolute zero (<strong>0.01 Hours</strong>).
                        </div>
                      </div>
                      <div className="flex gap-2 items-start">
                        <CheckCircle2 className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                        <div>
                          <strong>ISO-19650 Automated Standardizer</strong>: An algorithmic staging area that parses messy element parameters, formatting them automatically to globally compliant BIM structures.
                        </div>
                      </div>
                      <div className="flex gap-2 items-start">
                        <CheckCircle2 className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                        <div>
                          <strong>Fault-Tolerant Cache Architecture</strong>: Built local fallback configurations that preserve structural data integrity during network drops or Revit/Dynamo application crashes.
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentTab2 === "process" && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-3 font-sans text-[11px] text-gray-400"
                    >
                      <div className="flex gap-3 items-center">
                        <span className="w-5 h-5 rounded-full bg-neon-cyan/15 border border-white/10/35 text-[#3B82F6] flex items-center justify-center font-bold text-xs">01</span>
                        <span>Stream BIM local save metadata to server via custom Dynamo Webhook.</span>
                      </div>
                      <div className="flex gap-3 items-center">
                        <span className="w-5 h-5 rounded-full bg-neon-cyan/15 border border-white/10/35 text-[#3B82F6] flex items-center justify-center font-bold text-xs">02</span>
                        <span>Parse messy parameter values & auto-format to standard ISO-19650 requirements.</span>
                      </div>
                      <div className="flex gap-3 items-center">
                        <span className="w-5 h-5 rounded-full bg-neon-cyan/15 border border-white/10/35 text-[#3B82F6] flex items-center justify-center font-bold text-xs">03</span>
                        <span>Update Firestore collections to stream live quantities straight to the Dashboard.</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Stack tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                {["Node.js API", "Firestore", "React Interface", "Revit & Dynamo Integration", "ISO-19650 Compliance"].map((tag, idx) => (
                  <span key={`${tag}-${idx}`} className="text-[10px] font-sans px-2 py-1 flex-shrink-0 border border-white/5 text-gray-500 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Glowing Website Launcher Button */}
            <div className="mt-8 pt-4 border-t border-white/10 flex flex-col xl:flex-row gap-4 items-center justify-between">
              <span className="text-xs text-gray-500 font-sans tracking-wider">// CLOUD RUN</span>
              <div className="flex gap-2 w-full xl:w-auto mt-4 md:mt-0">
                <a
                  href="https://github.com/K-android/BIM-MetricPortal--Automated-Takeoff"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none font-sans text-xs px-2 md:px-3 py-2 bg-gray-800/50 hover:bg-gray-700 border border-white/10 text-white rounded font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Repo</span>
                </a>
                <a
                  href="https://bim-metric-portal-boqs-tracker-111136556527.asia-southeast1.run.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none font-sans text-xs px-2 md:px-3 py-2 bg-neon-cyan/15 hover:bg-neon-cyan border border-white/10/30 text-[#3B82F6] hover:text-black rounded font-bold transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,242,255,0.1)] active:scale-95"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Live App</span>
                  
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* APP 3: RHINO SYNC WEB CONSOLE */}
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ 
            y: -10, 
            scale: 1.015,
            transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
          }}
          className="flex flex-col border border-white/10 bg-black/80 hover:border-[#b4ff39] hover:shadow-[0_0_30px_rgba(180,255,57,0.05)] transition-all duration-700 overflow-hidden relative group"
        >
          <div className="h-1.5 w-full transition-all duration-700 bg-[#b4ff39] opacity-20 group-hover:opacity-100" />
          
          <div className="p-5 flex flex-col relative z-10">
            <div className="flex justify-end items-start mb-3">
              <span className="text-xs font-sans tracking-widest text-gray-500">
                DESK_APP_03
              </span>
            </div>
            
            <h3 className="text-base md:text-lg font-bold mb-4 font-sans text-white group-hover:text-[#b4ff39] transition-colors duration-700">
              Rhino Sync Web Console
            </h3>
          </div>

          {/* Hero Image Column */}
          <div className="relative max-h-[180px] md:max-h-none aspect-video md:aspect-[16/8] overflow-hidden group border-b border-white/10 bg-black/95">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.06] pointer-events-none z-10" />
            <img loading="lazy" 
              src="https://lh3.googleusercontent.com/d/1eQ88zcWYH9cjK0eHaem8THzK3w1_o83Y"
              alt="Rhino Sync Web Console Preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700 filter saturate-[0.85] pointer-events-none select-none"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none" />
            <div className="absolute top-3 left-3 z-20 bg-black/80 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded text-[9.5px] font-sans text-gray-300  tracking-wider flex items-center gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 bg-[#b4ff39] rounded-full animate-pulse" />
              Local Server Connection
            </div>
          </div>

          {/* Description & Actionable Tabs */}
          <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
            <div>
              {/* App Navigation Tab Buttons */}
              <div className="flex w-full md:inline-flex md:w-auto bg-black/90 border border-white/10 p-1 rounded font-sans text-xs mb-6 font-bold leading-none">
                <button
                  onClick={() => setCurrentTab3("desc")}
                  className={`flex-1 md:flex-none text-center px-2 md:px-3 py-1.5 transition-all text-xs rounded  font-bold tracking-wider ${
                    currentTab3 === "desc" ? "bg-[#b4ff39]/15 text-[#b4ff39] border border-[#b4ff39]/20" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Desc
                </button>
                <button
                  onClick={() => setCurrentTab3("features")}
                  className={`flex-1 md:flex-none text-center px-2 md:px-3 py-1.5 transition-all text-xs rounded  font-bold tracking-wider ${
                    currentTab3 === "features" ? "bg-[#b4ff39]/15 text-[#b4ff39] border border-[#b4ff39]/20" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Highlights
                </button>
                <button
                  onClick={() => setCurrentTab3("process")}
                  className={`flex-1 md:flex-none text-center px-2 md:px-3 py-1.5 transition-all text-xs rounded  font-bold tracking-wider ${
                    currentTab3 === "process" ? "bg-[#b4ff39]/15 text-[#b4ff39] border border-[#b4ff39]/20" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Process
                </button>
              </div>

              {/* Tab Contents */}
              <div className="min-h-[140px] font-sans">
                <AnimatePresence mode="wait">
                  {currentTab3 === "desc" && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-3"
                    >
                      <p className="text-gray-300 text-sm leading-relaxed font-sans font-medium">
                        A self-hosted parametric web console connecting Grasshopper scripts to a browser interface via Rhino.Compute and a persistent ngrok tunnel, enabling real-time geometry manipulation and solar analysis without Rhino/GH installation on the client.
                      </p>
                      <div className="text-[#b4ff39] text-[10.5px] border-l-2 border-[#b4ff39] pl-3 py-1 bg-[#b4ff39]/[0.01]">
                        // Bridging desktop parametric models to the web using headless Rhino servers.
                      </div>
                    </motion.div>
                  )}

                  {currentTab3 === "features" && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-2.5 text-xs text-gray-300"
                    >
                      <div className="flex gap-2 items-start">
                        <CheckCircle2 className="w-4 h-4 text-[#b4ff39] shrink-0 mt-0.5" />
                        <div>
                          <strong>Rhino.Compute Headless Backend</strong>: Exposes Grasshopper logic through a REST API to let users solve parametric algorithms without opening the desktop software.
                        </div>
                      </div>
                      <div className="flex gap-2 items-start">
                        <CheckCircle2 className="w-4 h-4 text-[#b4ff39] shrink-0 mt-0.5" />
                        <div>
                          <strong>Ngrok Tunneling</strong>: Facilitates secure and persistent external access to the local simulation server, overcoming network firewall limitations.
                        </div>
                      </div>
                      <div className="flex gap-2 items-start">
                        <CheckCircle2 className="w-4 h-4 text-[#b4ff39] shrink-0 mt-0.5" />
                        <div>
                          <strong>Real-Time Solar Analysis</strong>: Drives geometry manipulation and Ladybug environmental analytics directly from simple web sliders.
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentTab3 === "process" && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-3 font-sans text-[11px] text-gray-400"
                    >
                      <div className="flex gap-3 items-center">
                        <span className="w-5 h-5 rounded-full bg-[#b4ff39]/15 border border-[#b4ff39]/35 text-[#b4ff39] flex items-center justify-center font-bold text-xs">01</span>
                        <span>Boot local Rhino.Compute headless server linked to target Grasshopper files.</span>
                      </div>
                      <div className="flex gap-3 items-center">
                        <span className="w-5 h-5 rounded-full bg-[#b4ff39]/15 border border-[#b4ff39]/35 text-[#b4ff39] flex items-center justify-center font-bold text-xs">02</span>
                        <span>Establish secure public endpoint via persistent ngrok tunneling.</span>
                      </div>
                      <div className="flex gap-3 items-center">
                        <span className="w-5 h-5 rounded-full bg-[#b4ff39]/15 border border-[#b4ff39]/35 text-[#b4ff39] flex items-center justify-center font-bold text-xs">03</span>
                        <span>Parse web UI slider changes as JSON payload and return updated geometry meshes.</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Stack tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                {["Rhino.Compute", "Grasshopper", "REST API", "ngrok", "React Web UI", "Parametric Models"].map((tag, idx) => (
                  <span key={`${tag}-${idx}`} className="text-[10px] font-sans px-2 py-1 flex-shrink-0 border border-white/5 text-gray-500 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Glowing Website Launcher Button */}
            <div className="mt-8 pt-4 border-t border-white/10 flex flex-col xl:flex-row gap-4 items-center justify-between">
              <span className="text-xs text-gray-500 font-sans tracking-wider">// VERCEL HOSTED</span>
              <div className="flex gap-2 w-full xl:w-auto">
                <a
                  href="https://github.com/K-android/Rhino.GH-Sync-Web-Console"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none font-sans text-xs px-2 md:px-3 py-2 bg-gray-800/50 hover:bg-gray-700 border border-white/10 text-white rounded font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Repo</span>
                </a>
                <a
                  href="https://rhino-gh-sync-web-console.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none font-sans text-xs px-2 md:px-3 py-2 bg-[#b4ff39]/15 hover:bg-[#b4ff39] border border-[#b4ff39]/30 text-[#b4ff39] hover:text-black rounded font-bold transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(180,255,57,0.1)] active:scale-95"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Live App</span>
                  
                </a>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      
    </div>
  );
};
