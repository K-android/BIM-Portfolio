import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Activity, ChevronRight, Download, Code2, Terminal, Database, Layers, Workflow, CheckCircle2, ChevronDown, ShieldCheck , Hammer , Award } from 'lucide-react';

export default function ArchSection({ 
  archArsenal, 
  experience, 
  setSelectedArsenalItem, 
  ProjectCard, 
  SoftwareStack,
  setExpandedMedia,
  getDriveId
}: any) {
  const archTimelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: archScroll } = useScroll({
    target: archTimelineRef,
    offset: ["start center", "end center"]
  });
  const archScaleY = useSpring(archScroll, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (<>
<section id="arch-section" className="bg-white text-gray-900 font-serif w-full pt-48 pb-32 px-6 md:px-12 border-b border-gray-100 relative mt-0">
          <div className="max-w-7xl mx-auto space-y-24 md:space-y-32">
            
            {/* Arch Sub-Hero Header Grid */}
            <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center font-serif">
              <div className="flex flex-col text-left font-serif">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-gray-500 text-[8px] md:text-[10px] font-mono uppercase tracking-widest mb-4 w-fit whitespace-nowrap">
                  <Activity className="w-3 h-3 shrink-0 animate-pulse" /> <span className="pr-1 font-mono">Portfolio: Architectural Design</span>
                </div>
                
                <div className="mb-2 font-mono text-[10px] md:text-sm uppercase tracking-widest text-gray-400">
                  Karthikraj Nadar, Architect &amp; Spatial Visionary.
                </div>
                
                <h1 className="text-2xl md:text-5xl font-serif font-light tracking-tighter leading-[1.1] mb-4 text-black italic">
                  Sculpting <span className="text-gray-400 font-normal">Space</span>, Light, and the Human <span className="text-gray-300 font-normal">Experience</span>.
                </h1>
                
                <p className="text-xs md:text-sm font-sans mb-6 max-w-xl text-gray-500 leading-relaxed">
                  Designing layouts and buildings that put comfort and eco-friendly standards first. Creating spaces with a focus on natural light and structural simplicity.
                </p>
                
                <div className="mt-4">
                  <div className="font-mono text-[9px] text-gray-400 mb-2 tracking-[0.2em] uppercase font-bold">
                    [DESIGN_COMPLIANCE]
                  </div>
                  <SoftwareStack isArch={true} />
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4 font-sans">
                  <button 
                    onClick={() => {
                      const el = document.getElementById("arch-works");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="group px-6 py-3 font-semibold uppercase tracking-tighter flex items-center justify-center gap-3 transition-all duration-300 bg-black text-white hover:bg-gray-800"
                  >
                    Explore Works
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  
                </div>
              </div>

              {/* Hero Image Component for Arch */}
              <div className="relative aspect-video lg:aspect-square border border-gray-100 bg-gray-50 overflow-hidden min-h-[350px] md:min-h-[450px] mx-auto w-full max-w-xl lg:max-w-none">
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/10 z-20 pointer-events-none" />
                
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden group/hero">
                  <img loading="lazy" 
                    src="https://lh3.googleusercontent.com/d/13GmqWLU2dj4391dNM13FuLjcie7fDsKe" 
                    alt="Arch Hero GIF"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-100 transition-all duration-1000 pointer-events-none select-none animate-fadeIn"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/hero:bg-black/10 transition-all duration-300 flex items-end justify-end p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedMedia({
                          src: "https://lh3.googleusercontent.com/d/13L6_w4Eu0yGSNAaxq0zbR9dTiAjc95Df",
                          isVideo: false,
                          googleDriveId: getDriveId("https://lh3.googleusercontent.com/d/13L6_w4Eu0yGSNAaxq0zbR9dTiAjc95Df"),
                          alt: "Architectural Studio Grasshopper Script"
                        });
                      }}
                      className="px-4 py-2 bg-black text-white hover:bg-[#00f2ff] hover:text-black border border-white/20 hover:border-[#00f2ff] text-[10px] font-mono tracking-widest uppercase flex items-center gap-2 shadow-2xl transition-all duration-300 z-30 transform active:scale-95 pointer-events-auto cursor-pointer"
                    >
                      <Code2 className="w-4 h-4 animate-pulse" />
                      Show Script
                    </button>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 font-mono text-[10px] text-gray-500 z-30 font-bold">
                  [ARCH_STUDIO_v1.0]
                </div>
              </div>
            </div>

            {/* ARCH PROJECTS */}
            <div id="arch-works" className="pt-16 border-t border-gray-100 scroll-mt-24">
              <div className="mb-12">
                <h2 className="text-xs font-mono uppercase tracking-[0.3em] mb-4 text-gray-800 font-bold">
                  Section_01 // Projects
                </h2>
                <h3 className="text-lg md:text-xl font-mono uppercase tracking-[0.1em] text-black font-bold">
                  <span className="opacity-40 font-serif">{"{"}</span> CORE_FOLIO_V1.0 <span className="opacity-40 font-serif">{"}"}</span>
                </h3>
              </div>

              <div className="space-y-16">
                {/* Row 1: The Anchors */}
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {archArsenal.filter(item => ["ARCH_08", "ARCH_01"].includes(item.id)).map((item) => (<ProjectCard key={`arch-r1-${item.id}`} 
                        item={item} 
                        isArch={true} 
                        onClick={() => setSelectedArsenalItem(item)} 
                        onShowScript={(scriptUrl: string, title: string) => {
                          setExpandedMedia({
                            src: scriptUrl,
                            isVideo: false,
                            googleDriveId: getDriveId(scriptUrl),
                            alt: `Script: ${title}`
                          });
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Row 2: The Typology Matrix */}
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {archArsenal.filter(item => ["ARCH_05", "ARCH_09", "ARCH_02"].includes(item.id)).map((item) => (<ProjectCard key={`arch-r2-${item.id}`} 
                        item={item} 
                        isArch={true} 
                        onClick={() => setSelectedArsenalItem(item)} 
                        onShowScript={(scriptUrl: string, title: string) => {
                          setExpandedMedia({
                            src: scriptUrl,
                            isVideo: false,
                            googleDriveId: getDriveId(scriptUrl),
                            alt: `Script: ${title}`
                          });
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ARCH FABRICATION */}
            <div id="arch-prototyping" className="pt-16 border-t border-gray-100 font-serif">
              <div className="mb-12 font-serif">
                <h2 className="text-xs font-mono uppercase tracking-[0.3em] mb-4 text-gray-800 font-bold">
                  Section_02 // Fabrication &amp; Hands-on
                </h2>
                <h3 className="text-lg md:text-xl font-mono uppercase tracking-[0.1em] text-black italic font-bold">
                  <span className="opacity-40">{"<"}</span> PHYSICAL_PROTOTYPING <span className="opacity-40">{">"}</span>
                </h3>
              </div>

              <div className="flex flex-col border border-gray-200 rounded-xl bg-white overflow-hidden font-sans">
                {archArsenal.filter(item => ["ARCH_06", "ARCH_07", "ARCH_04"].includes(item.id) || item.category === 'Fabrication').map((item: any, index: number, arr: any[]) => (
                  <div 
                    key={`arch-fab-${item.id}`}
                    onClick={() => setSelectedArsenalItem(item)}
                    className={`group cursor-pointer p-5 flex items-start gap-4 hover:bg-gray-50 transition-colors ${index !== arr.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <div className="mt-1">
                      <Hammer className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1">
                      <h4 className="font-bold text-sm text-gray-800 group-hover:text-black transition-colors flex items-center gap-2">
                        {item.title}
                        {item.title === "Recycled Bus Pavilion" && (
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/10 text-yellow-600 rounded-full border border-yellow-500/20">
                            <Award className="w-3 h-3" />
                            <span className="text-[8px] font-mono tracking-widest font-bold uppercase">National Citation</span>
                          </div>
                        )}
                      </h4>
                      <div className="text-[9px] font-mono tracking-widest text-gray-500 uppercase">
                        {item.role || item.category}
                      </div>
                      <p className="text-xs text-gray-500 italic font-serif leading-relaxed mt-1 line-clamp-2">
                        {item.details?.overview || item.problem}
                      </p>
                    </div>
                    <div className="hidden sm:flex flex-wrap gap-2 justify-end max-w-[200px]">
                      {item.tags?.slice(0, 3).map((tag: string, i: number) => (
                        <span key={i} className="text-[8px] font-mono px-2 py-0.5 border border-gray-200 text-gray-500 rounded-sm bg-white">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ARCH CAREER PATH */}
            <div className="pt-16 border-t border-gray-100 font-serif">
              <div className="mb-12 text-center font-mono font-bold">
                <h2 className="text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4 text-gray-800 font-bold">
                  Section_03 // Professional_Journey
                </h2>
                <h3 className="text-lg md:text-xl uppercase tracking-[0.1em] text-black italic font-serif font-bold">
                  <span className="opacity-40">{"{"}</span> EXPERIENCE_LOG_03 <span className="opacity-40">{"}"}</span>
                </h3>
              </div>

              <div ref={archTimelineRef} className="max-w-3xl mx-auto relative px-4 md:px-0 font-serif">
                {/* Background Line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gray-100" />
                {/* Glowing Interactive Scroll Line */}
                <motion.div 
                  style={{ scaleY: archScaleY }} 
                  className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-black origin-top shadow-[0_0_10px_rgba(0,0,0,0.25)]" 
                />
                <div className="space-y-8 md:space-y-12">
                  {experience.map((exp, idx) => (
                    <div 
                      key={`exp-arch-${idx}`} 
                      className={`relative flex flex-col md:flex-row gap-4 md:gap-8 ${idx % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                    >
                      <div className="absolute left-4 md:left-1/2 w-3 h-3 -translate-x-[6px] mt-1.5 border bg-white border-black z-10" />
                      <div className={`pl-10 md:pl-0 md:w-1/2 flex flex-col ${idx % 2 === 0 ? "md:pl-12" : "md:pr-12 text-left md:text-right"}`}>
                        <div className="flex flex-col gap-1 mb-2 md:mb-3">
                          <span className="text-xs md:text-xs font-mono text-gray-400 font-bold tracking-wider">
                            {exp.year}
                          </span>
                          <h4 className="text-base md:text-lg font-bold text-black italic whitespace-normal break-words">
                            {exp.company}
                          </h4>
                          <div className="text-xs md:text-xs font-mono text-gray-500 font-sans whitespace-normal break-words">
                            {exp.role}
                          </div>
                        </div>
                        <p className="text-xs md:text-sm leading-relaxed text-gray-600 italic">
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
        </section></>);}
