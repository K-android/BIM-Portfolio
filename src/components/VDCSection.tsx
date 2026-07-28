import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Activity, ChevronRight, Download, Terminal, Database, Code2, Layers, Workflow, CheckCircle2, ChevronDown, ShieldCheck } from 'lucide-react';
import { AECWebAppsCabinet } from './AECWebAppsCabinet';
import { PyRevitToolbar } from './PyRevitToolbar';

export default function VDCSection({ 
  bimArsenal, 
  experience, 
  setSelectedArsenalItem, 
  ProjectCard, 
  SoftwareStack,
  setExpandedMedia,
  getDriveId
}: any) {
  const vdcTimelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: vdcScroll } = useScroll({
    target: vdcTimelineRef,
    offset: ["start center", "end center"]
  });
  const vdcScaleY = useSpring(vdcScroll, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (<>
        {/* STAGE 2: VDC & Systems Architecture Continuous Section */}
        <section id="vdc-section" className="bg-[#0a0a0c] text-gray-400 font-sans w-full pt-24 md:pt-32 pb-32 px-6 md:px-12 relative">
          <div className="max-w-7xl mx-auto space-y-24 md:space-y-32">
            
            {/* VDC Sub Hero Header Grid */}
            <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
              <div className="flex flex-col text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10/30 bg-[#3B82F6]/5 text-[#3B82F6] text-[8px] md:text-xs font-sans  tracking-widest mb-4 w-fit whitespace-nowrap">
                  <Activity className="w-3 h-3 shrink-0" /> <span className="pr-1 font-sans">System Online: Data Engineering</span>
                </div>
                
                <div className="mb-2 font-sans text-xs md:text-sm  tracking-widest text-[#8fa4bc]">
                  KARTHIKRAJ NADAR // COMPUTATIONAL DESIGNER &amp; VDC ENGINEER
                </div>
                
                <h1 className="text-2xl md:text-5xl font-sans tracking-tight leading-[1.1] mb-4 text-white font-bold">
                  Automating <span className="text-[#3B82F6] font-medium">AEC workflows</span> and managing <span className="text-[#3B82F6] font-medium">ISO 19650</span> facility data.
                </h1>
                
                <p className="text-xs md:text-sm font-sans mb-6 max-w-xl text-gray-400">
                  Building automated workflows to expedite projects. Using reliable data models to ensure simple and scalable delivery.
                </p>
                
                <div className="mt-4 scroll-mt-32" id="vdc-skills">
                  <div className="font-sans text-[9px] text-[#3B82F6]/40 mb-2 tracking-[0.2em] ">
                    [STACK_COMPONENTS]
                  </div>
                  <SoftwareStack isArch={false} />
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => {
                      const el = document.getElementById("vdc-workflows");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="group px-6 py-3 font-sans font-semibold tracking-tight flex items-center justify-center gap-3 transition-all duration-300 border border-blue-500/30 bg-blue-500/[0.02] text-blue-400 hover:border-indigo-500 hover:text-indigo-400"
                  >
                    Initialize Workflows
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  
                </div>
              </div>

              {/* Hero Image Component for VDC */}
              <div className="relative aspect-video lg:aspect-square border border-white/10 bg-[#0a0a0c] overflow-hidden min-h-[350px] md:min-h-[450px] mx-auto w-full max-w-xl lg:max-w-none">
                <div className="absolute top-0 right-0 p-4 font-sans text-[8px] text-[#3B82F6]/20 text-right leading-tight z-0">
                  BIM_DATA_STREAM_8829<br/>
                  COORD_SYS: WGS84<br/>
                  LOD: 400
                </div>
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-neon-cyan/20 shadow-[0_0_15px_rgba(0,242,255,0.3)] animate-scan z-20 pointer-events-none" />
                
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  <div className="relative w-full h-full group">
                    <img loading="lazy" 
                      src="https://lh3.googleusercontent.com/d/1KWO0JcGakYmARq4aDTMo6BG7CoK1Kt33" 
                      alt="BIM Hero GIF"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-100 transition-all duration-1000 pointer-events-none select-none animate-fadeIn"
                    />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 font-sans text-xs text-[#3B82F6]/60 z-30">
                  [CORE_VD_v2.4_ENGINE]
                </div>
              </div>
            </div>

            {/* VDC WORKFLOWS / PORTFOLIO */}
            <div id="vdc-workflows" className="pt-16 border-t border-white/10 scroll-mt-24">
              <div className="mb-12">
                <h2 className="text-xs font-sans  tracking-[0.3em] mb-3 text-[#3B82F6]">
                  Section_01 // Automation_Stack
                </h2>
                <h3 className="text-lg md:text-xl font-sans  tracking-[0.1em] text-[#3B82F6]/80 font-bold">
                  <span className="opacity-40">{"["}</span> ACTIVE_WORKFLOWS <span className="opacity-40">{"]"}</span>
                </h3>
              </div>
            </div>

            <div className="space-y-16">
              {/* AEC Automator Toolbar */}
              <PyRevitToolbar onShowVideo={() => setExpandedMedia({ src: 'https://drive.google.com/file/d/1yOTNxsA3yW69wSv7pJrqGpYczqf3eO25/view?usp=sharing', isVideo: true, googleDriveId: '1yOTNxsA3yW69wSv7pJrqGpYczqf3eO25', alt: 'AEC Automator Video' })} />

              {/* Tier 1: Heavy Hitters */}
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                  {bimArsenal.filter((item: any) => ["BIM_09", "BIM_02"].includes(item.id)).map((item: any) => (
                    <ProjectCard key={`bim-${item.id}`} 
                      item={item} 
                      isArch={false} 
                      onClick={() => setSelectedArsenalItem(item)} 
                      onShowScript={(scriptUrl: string, title: string) => {
                        setExpandedMedia({ src: scriptUrl, isVideo: false, googleDriveId: getDriveId(scriptUrl), alt: `Script: ${title}` });
                      }}
                      onShowVideo={(gifUrl: string, title: string) => {
                        setExpandedMedia({ src: gifUrl, isVideo: true, googleDriveId: getDriveId(gifUrl), alt: `Video: ${title}` });
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Tier 2: Core Data Stack */}
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {bimArsenal.filter((item: any) => ["BIM_03", "BIM_04", "BIM_06"].includes(item.id)).map((item: any) => (
                    <ProjectCard key={`bim-${item.id}`} 
                      item={item} 
                      isArch={false} 
                      onClick={() => setSelectedArsenalItem(item)} 
                      onShowScript={(scriptUrl: string, title: string) => {
                        setExpandedMedia({ src: scriptUrl, isVideo: false, googleDriveId: getDriveId(scriptUrl), alt: `Script: ${title}` });
                      }}
                      onShowVideo={(gifUrl: string, title: string) => {
                        setExpandedMedia({ src: gifUrl, isVideo: true, googleDriveId: getDriveId(gifUrl), alt: `Video: ${title}` });
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Tier 3: Experimental Tools */}
              <div>
                <div className="text-[11px] font-mono tracking-widest text-gray-500 uppercase mb-4 border-b border-white/5 pb-2">
                  // EXPERIMENTAL AUTOMATION LAB
                </div>
                <div className="flex flex-col border border-white/10 rounded-xl bg-[#0a0a0c] overflow-hidden">
                  {bimArsenal.filter((item: any) => ["BIM_08", "BIM_10", "BIM_07", "BIM_01", "BIM_05"].includes(item.id)).map((item: any, index: number, arr: any[]) => (
                    <div 
                      key={`tier3-${item.id}`}
                      onClick={() => setSelectedArsenalItem(item)}
                      className={`group cursor-pointer p-5 flex items-start gap-4 hover:bg-white/5 transition-colors ${index !== arr.length - 1 ? 'border-b border-white/5' : ''}`}
                    >
                      <div className="mt-1">
                        <Code2 className="w-4 h-4 text-gray-500 group-hover:text-neon-cyan transition-colors" />
                      </div>
                      <div className="flex flex-col gap-1.5 flex-1">
                        <h4 className="font-sans font-bold text-sm text-gray-200 group-hover:text-white transition-colors">
                          {item.title}
                        </h4>
                        <div className="text-[9px] font-mono tracking-widest text-[#6366F1] uppercase">
                          {item.domain}
                        </div>
                        <p className="text-xs text-gray-400 font-mono leading-relaxed mt-1">
                          {item.intel}
                        </p>
                      </div>
                      <div>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          {/* VDC WEB APPS / TOOLS */}
          <div id="vdc-apps" className="pt-32 mt-24 border-t border-white/10 scroll-mt-24">
            <div className="mb-8">
              <h2 className="text-xs font-sans  tracking-[0.3em] mb-3 text-neon-orange">
                Section_02 // Custom_Web_Applications_&_Web_Tools
              </h2>
              <h3 className="text-lg md:text-xl font-sans  tracking-[0.1em] text-neon-orange/80 font-bold">
                <span className="opacity-40">{"["}</span> APPS_&_WEB_TOOLS <span className="opacity-40">{"]"}</span>
              </h3>
            </div>

            <AECWebAppsCabinet />
          </div>

          {/* VDC CAREER HISTORY */}
          <div className="pt-16 border-t border-white/10">
            <div className="mb-12 text-center">
              <h2 className="text-xs md:text-xs font-sans  tracking-[0.3em] mb-3 text-neon-blue">
                Section_03 // Professional_Journey
              </h2>
              <h3 className="text-lg md:text-xl font-sans  tracking-[0.1em] text-neon-blue font-bold">
                <span className="opacity-40">{"{"}</span> EXPERIENCE_LOG_03 <span className="opacity-40">{"}"}</span>
              </h3>
            </div>

            <div ref={vdcTimelineRef} className="max-w-3xl mx-auto relative px-4 md:px-0">
              {/* Background Line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-terminal-border/20" />
              {/* Glowing Interactive Scroll Line */}
              <motion.div 
                style={{ scaleY: vdcScaleY }} 
                className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-neon-cyan via-neon-blue to-neon-orange origin-top shadow-[0_0_10px_#00f2ff,0_0_20px_#00f2ff]" 
              />
              <div className="space-y-8 md:space-y-12 font-sans">
                {experience.map((exp, idx) => (
                  <div 
                    key={`exp-terminal-${idx}`} 
                    className={`relative flex flex-col md:flex-row gap-4 md:gap-8 ${idx % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                  >
                    <div className="absolute left-4 md:left-1/2 w-3 h-3 -translate-x-[6px] mt-1.5 border bg-[#0a0a0c] border-white/10 shadow-[0_0_10px_rgba(0,255,255,0.5)] z-10" />
                    <div className={`pl-10 md:pl-0 md:w-1/2 flex flex-col ${idx % 2 === 0 ? "md:pl-12" : "md:pr-12 text-left md:text-right"}`}>
                      <div className="flex flex-col gap-1 mb-2 md:mb-3">
                        <span className="text-xs md:text-xs font-sans text-neon-orange font-semibold tracking-wider">
                          {exp.year}
                        </span>
                        <h4 className="text-base md:text-lg font-sans font-bold text-white whitespace-normal break-words">
                          {exp.company}
                        </h4>
                        <div className="text-xs md:text-xs font-sans text-neon-blue whitespace-normal break-words">
                          {exp.role}
                        </div>
                      </div>
                      <p className="text-xs md:text-sm leading-relaxed text-gray-400 font-sans">
                        {exp.description}
                      </p>
                    </div>
                    <div className="hidden md:block md:w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
    
        </section>

                        {/* STAGE 3: Massive Transition Gate Banner */}
        <div id="transition-banner" className="w-full min-h-[600px] md:min-h-[700px] flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#0a0a0c] via-neutral-100 to-white border-b border-gray-100 py-24 px-4">
          
          {/* Base Layer: Blueprint Grid */}
          <div className="absolute inset-0 opacity-[0.04] z-0 pointer-events-none" 
               style={{ 
                 backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                 backgroundSize: '40px 40px' 
               }} 
          />

          {/* Base Layer: High-speed sweeping structural grid of thin vertical dark lines */}
          <div className="absolute inset-0 flex z-10 pointer-events-none">
            {[...Array(24)].map((_, i) => (
              <motion.div 
                key={i}
                className="flex-1 border-r border-black/[0.03] h-full"
                initial={{ scaleY: 0, x: "-100%" }}
                whileInView={{ scaleY: 1, x: "0%" }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: i * 0.03, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </div>

          {/* Content Layer (Revealed) */}
          <div className="text-center z-20 max-w-4xl w-full relative pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="inline-block font-sans text-[9px] md:text-xs text-center text-blue-600 tracking-[0.4em] mb-8 font-bold border border-blue-600/20 bg-blue-600/5 px-4 py-1.5 rounded-full"
            >
              --- MULTI-DISCIPLINARY COUPLING ---
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-medium text-black tracking-widest mb-6 leading-tight font-serif italic"
            >
              ARCHITECTURAL DESIGN <br />
              <span className="font-sans font-light bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 tracking-[0.25em] block mt-4 text-lg sm:text-xl md:text-3xl lg:text-4xl not-italic">PROJECT EXECUTION</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 1.0, duration: 1 }}
              className="text-xs md:text-sm font-sans text-gray-500 max-w-lg mx-auto leading-loose"
            >
              Where computation meets physical space. Connecting the power of automated drawings with sensible, real-world building design.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="mt-12 flex justify-center gap-4 items-center font-sans animate-pulse"
            >
              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-black/20" />
              <span className="text-[10px] font-sans tracking-[0.3em] text-black/40 font-bold">SCROLL DOWN TO STUDY</span>
              <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-black/20" />
            </motion.div>
          </div>

          {/* Top Dark Charcoal Layer that clips out vertically */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c] via-[#0a0a0c] to-neutral-900 z-30 flex flex-col items-center justify-center overflow-hidden pointer-events-none"
            initial={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
            whileInView={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.8, ease: [0.77, 0, 0.17, 1] }} 
          >
            {/* Ambient Background Glow (Dark) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-96 bg-[#3B82F6]/10 blur-[120px] rounded-full" />

            {/* High-speed sweeping structural grid of thin vertical lines (white/[0.02]) */}
            <div className="absolute inset-0 flex z-10 pointer-events-none">
              {[...Array(24)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="flex-1 border-r border-white/[0.02] h-full"
                  initial={{ scaleY: 0, x: "-100%" }}
                  whileInView={{ scaleY: 1, x: "0%" }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: i * 0.03, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />
              ))}
            </div>

            {/* Ghosted Outline Text inside the dark layer to show what it is transitioning from */}
            <div className="text-center z-20 max-w-4xl w-full relative px-4 opacity-70">
              <div className="inline-block font-sans text-[9px] md:text-xs text-center text-neon-cyan tracking-[0.4em] mb-8 font-bold border border-[#00f2ff]/20 bg-[#00f2ff]/5 px-4 py-1.5 rounded-full">
                --- MULTI-DISCIPLINARY COUPLING ---
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-medium text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 tracking-widest mb-6 leading-tight font-serif italic">
                COMPUTATIONAL CORE <br />
                <span className="font-sans font-light bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-blue-400 tracking-[0.25em] block mt-4 text-lg sm:text-xl md:text-3xl lg:text-4xl not-italic">VDC EXECUTION</span>
              </h2>

              <p className="text-xs md:text-sm font-sans text-gray-400 max-w-lg mx-auto leading-loose">
                Where automated scripts meet building modeling structures. Processing dynamic ISO metadata pipelines into pure interactive architecture.
              </p>
            </div>
          </motion.div>
        </div>
      </>
  );
}
