/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { OrganicBackground } from './components/OrganicBackground';
import { AutoCarousel } from './components/AutoCarousel';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from "motion/react";
import { 
  Terminal, 
  Cpu, 
  Database, 
  Layers, 
  Code2, 
  Table, 
  FileText, 
  Github, 
  Linkedin, 
  Download,
  ChevronRight,
  Activity,
  Box,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  ShieldCheck,
  Hammer,
  Play,
  Zap,
  Maximize2,
  Monitor,
  MonitorPlay,
  Globe,
  Award,
  ExternalLink,
  ArrowUp,
  Component,
  Camera,
  Crosshair,
  Network,
  Hexagon,
  Code,
  Workflow,
  GitMerge
} from "lucide-react";


import { playVDCHoverSound, playVDCClickSound } from './utils/audio';

const SoftwareStack = ({ isArch }: { isArch: boolean }) => {
  const archTools = [
    { name: "Rhino / Grasshopper", category: "Computational", icon: Activity },
    { name: "Autodesk Revit", category: "BIM", icon: Layers },
    { name: "D5 Render / Enscape", category: "Visualization", icon: MonitorPlay },
    { name: "Adobe Creative Suite", category: "Design", icon: Component },
    { name: "Midjourney / Stable Diffusion", category: "AI Imagery", icon: Globe },
    { name: "Physical Prototyping", category: "Fabrication", icon: Hammer },
  ];

  const bimTools = [
    { name: "Autodesk Revit", category: "Modeling", icon: Layers },
    { name: "Navisworks Manage", category: "Coordination", icon: GitMerge },
    { name: "Dynamo / Python", category: "Automation", icon: Workflow },
    { name: "Excel / SQL", category: "Data", icon: Database },
    { name: "Rhino / Grasshopper", category: "Computational", icon: Activity },
    { name: "ISO 19650 Standards", category: "Management", icon: ShieldCheck },
  ];

  const tools = isArch ? archTools : bimTools;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      key={isArch ? 'arch' : 'bim'}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="flex flex-wrap justify-center lg:justify-start gap-2.5"
    >
      {tools.map((tool, idx) => {
        const Icon = tool.icon;
        return (
          <motion.div 
            key={`${isArch ? 'arch' : 'bim'}-${tool.name}-${idx}`}
            variants={item}
            className={`group flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-mono tracking-wider transition-all duration-300 cursor-default ${
              isArch 
              ? "bg-gray-50/50 border-gray-200 text-gray-600 hover:border-black hover:text-black hover:bg-white"
              : "bg-[#0a0a0c]/80 border-white/5 text-zinc-500 hover:border-white/20 hover:text-white"
            }`}
          >
            {Icon && (
              <Icon className={`w-3.5 h-3.5 transition-colors duration-300 ${
                isArch ? "text-gray-400 group-hover:text-black" : "text-blue-400/70 group-hover:text-[#6366F1]"
              }`} />
            )}
            <span>{tool.name}</span>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

const getWsrvGifUrl = (src: string): string => {
  if (!src) return "";
  if (src.includes('lh3.googleusercontent.com/d/')) {
    const id = src.split('/').pop()?.split('#')[0];
    const driveThumb = `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
    return `https://wsrv.nl/?url=${encodeURIComponent(driveThumb)}&output=gif&n=-1`;
  }
  if (src.includes('giphy.com/media/')) {
    return src;
  }
  return `https://wsrv.nl/?url=${encodeURIComponent(src)}&output=gif&n=-1`;
};

const getDriveId = (url: string) => {
  if (!url) return null;
  const clean = url.split('#')[0];
  
  if (clean.includes('lh3.googleusercontent.com/d/')) {
    const parts = clean.split('lh3.googleusercontent.com/d/');
    if (parts.length > 1) {
      return parts[1].split('/')[0].split('?')[0];
    }
  }
  
  if (clean.includes('drive.google.com/thumbnail')) {
    const match = clean.match(/[?&]id=([^&]+)/);
    if (match) {
      return match[1];
    }
  }

  if (clean.includes('drive.google.com/file/d/')) {
    const parts = clean.split('/file/d/');
    if (parts.length > 1) {
      return parts[1].split('/')[0].split('?')[0];
    }
  }

  return null;
};

const getYoutubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const getGalleryItemType = (imgUrl: string, idx: number, projectId: string): "render" | "drawing" | "video" => {
  const urlLower = imgUrl.toLowerCase();
  
  // 1. Explicit Anchors check (absolute precedence)
  const anchor = imgUrl.includes("#") ? imgUrl.split("#")[1].toLowerCase() : "";
  if (anchor === "video" || urlLower.endsWith(".mp4") || urlLower.endsWith(".mov") || imgUrl.includes("1h89DNz0NAtQeH_rtLlNxXqN0ZI_9FXuk") || !!getYoutubeId(imgUrl)) {
    return "video";
  }
  if (anchor === "drawing" || anchor === "sheet" || anchor === "tech" || anchor === "blueprint" || anchor === "cad" || anchor === "detail" || anchor === "draft") {
    return "drawing";
  }
  if (anchor === "render" || anchor === "image" || anchor === "visual" || anchor === "scene") {
    return "render";
  }

  // 2. Keyword check on URL
  if (
    urlLower.includes("plan") || 
    urlLower.includes("detail") || 
    urlLower.includes("drawing") || 
    urlLower.includes("sheet") || 
    urlLower.includes("vector") || 
    urlLower.includes("cad") || 
    urlLower.includes("blueprint") || 
    urlLower.includes("section") || 
    urlLower.includes("elevation") || 
    urlLower.includes("diagram") ||
    urlLower.includes("layout") ||
    urlLower.includes("draft") ||
    urlLower.includes("dwg") ||
    urlLower.includes("pdf") ||
    urlLower.includes("unrolled") ||
    urlLower.includes("workflow") ||
    urlLower.includes("code") ||
    urlLower.includes("script") ||
    urlLower.includes("chart")
  ) {
    return "drawing";
  }
  
  // 3. Project-Specific Overrides for implicit URLs
  if (projectId === "ARCH_01") {
    if ([2, 3, 4, 5].includes(idx)) return "drawing";
    return "render";
  }
  
  if (projectId === "ARCH_02") {
    if (idx >= 5) return "drawing"; 
    return "render";
  }
  
  if (projectId === "ARCH_04") {
    if (idx >= 4) return "drawing";
    return "render";
  }
  
  if (projectId === "ARCH_05") {
    if (idx >= 4) return "drawing";
    return "render";
  }
  
  if (projectId === "ARCH_06") {
    if (idx >= 6) return "drawing";
    return "render";
  }
  
  if (projectId === "ARCH_07") {
    if ([3, 4, 5].includes(idx)) return "drawing";
    return "render";
  }
  
  if (projectId === "ARCH_08") {
    if (idx === 3) return "drawing";
    return "render";
  }
  
  if (projectId === "ARCH_09") {
    if (idx >= 3 && idx !== 10) return "drawing";
    return "render";
  }

  // 4. Default by category prefix
  if (projectId.startsWith("BIM_")) {
    return "drawing"; // BIM tools, charts, workflows, calculations, and Dynamo code screenshots
  }
  
  return "render";
};

const getStaticThumbnailUrl = (src: string) => {
  if (!src) return "";
  const clean = src.split('#')[0];
  
  if (clean.includes('drive.google.com/file/d/')) {
    const parts = clean.split('/file/d/');
    if (parts.length > 1) {
      const id = parts[1].split('/')[0].split('?')[0];
      return `https://drive.google.com/thumbnail?id=${id}&sz=w800`;
    }
  }

  if (clean.includes('lh3.googleusercontent.com/d/')) {
    const parts = clean.split('lh3.googleusercontent.com/d/');
    if (parts.length > 1) {
      const id = parts[1].split('/')[0].split('?')[0];
      return `https://drive.google.com/thumbnail?id=${id}&sz=w800`;
    }
  }

  if (clean.includes('drive.google.com/thumbnail')) {
    const match = clean.match(/[?&]id=([^&]+)/);
    if (match) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
    }
  }

  if (clean.includes('giphy.com/media/')) {
    return clean.replace('/giphy.gif', '/giphy_s.gif');
  }

  const ytId = getYoutubeId(clean);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/0.jpg`;
  }

  return clean;
};

const getPlayableVideoUrl = (url: string) => {
  if (!url) return "";
  const clean = url.split('#')[0];
  
  if (clean.includes('lh3.googleusercontent.com/d/')) {
    const parts = clean.split('lh3.googleusercontent.com/d/');
    if (parts.length > 1) {
      const id = parts[1].split('/')[0].split('?')[0];
      return `https://drive.google.com/uc?export=download&id=${id}`;
    }
  }
  
  if (clean.includes('drive.google.com/thumbnail')) {
    const match = clean.match(/[?&]id=([^&]+)/);
    if (match) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
  }

  if (clean.includes('drive.google.com/file/d/')) {
    const parts = clean.split('/file/d/');
    if (parts.length > 1) {
      const id = parts[1].split('/')[0].split('?')[0];
      return `https://drive.google.com/uc?export=download&id=${id}`;
    }
  }
  
  return clean;
};

const getSimLogsForProject = (id: string, stepIdx: number) => {
  switch (id) {
    case "BIM_01":
      return [
        ">> Authenticating handshake with Google Vertex AI / Gemini API...\n>> [SUCCESS] Token established. Payload: 4,096 tokens max.\n>> Streaming neural panelization geometry parameters...",
        ">> Received JSON geometry schema (128KB payload).\n>> Validating 5,000 vertices constraints with structural integrity boundaries.\n>> JSON parsed successfully.",
        ">> Initiating Grasshopper spatial solver...\n>> Mapping mathematical bezier surfaces to parametric NURBS curves.\n>> Sub-division tessellation factor: 0.85.",
        ">> Projecting complex geometry onto flat plane (unrolling NURBS).\n>> Auto-nesting 2D CNC cut-sheets...\n>> Cut-sheets populated in /output/cut_sheets/."
      ][stepIdx];
    case "BIM_02":
      return [
        ">> Parsing excel datasheet matrices...\n>> Mapping 450 views to standard template viewports.\n>> Initiating coordinate alignment parameters.",
        ">> Calculating layout viewport spacing parameters.\n>> Aligning floor-plans, sections, and elevation views cleanly inside sheet grids.",
        ">> Fetching project metadata indexes...\n>> Overwriting 10 fields across all linked dynamic legends.\n>> DB state synchronized.",
        ">> Commencing automated batch drawing export...\n>> Compiling 350 PDF sheets with structured custom tag names.\n>> Saved 32.5 working hours this run."
      ][stepIdx];
    case "BIM_03":
      return [
        ">> Scanning active Revit master project database elements...\n>> Indexing 24,500 instance elements across active worksets.",
        ">> Executing regex filter and nomenclature compliance tests.\n>> Corrected 85 mismatched parameter fields dynamically.",
        ">> Establishing direct JDBC connection with financial spreadsheet catalogs.\n>> Recalculating material cost vs volume tolerances.",
        ">> Packaging verified material takeoffs with ERP payload.\n>> Exporting data streams to ERP database system (Oracle/SAP link).\n>> Completed with 0 exceptions."
      ][stepIdx];
    case "BIM_04":
      return [
        ">> Loading federated Structural and MEP models into memory...\n>> Initiating hard clash test iterations (tolerance: 5.0mm).",
        ">> Detected 412 raw intersections. Distilling results...\n>> Grouped clashes by physical zone and priority tags (High priority: 12).",
        ">> Applying automated neon override colors to clash points.\n>> Injecting target viewpoints into coordinates tracking dataset.",
        ">> Compiling coordination review dataset report.\n>> Exporting HTML/BCF compatibility charts for review team."
      ][stepIdx];
    case "BIM_05":
      return [
        ">> Extracting dimensional clearances guidelines for structural grid systems.",
        ">> Executing Vectorworks custom placement script model.\n>> Generated 2,400 parametric terminal pipe items.",
        ">> Verifying structural MEP pipe joins consistency inline.",
        ">> Exporting bill of materials schedules and verification audits."
      ][stepIdx];
    case "BIM_06":
      return [
        ">> Parsing complete Project schedule file data structures.",
        ">> Integrating timelines elements with Navisworks API data matrices.",
        ">> Setting material installation and phase profile overlays.",
        ">> Running multi-scenario schedule conflict analyses."
      ][stepIdx];
    case "BIM_07":
      return [
        ">> Formulating parametric louver definitions and active sun vectors inside Rhino.\n>> Setting independent variable bounds: rotAngle [0-90°], louvDepth [100-400mm], spacing [150-500mm].",
        ">> Running Galapagos evolutionary engine (Single-weighted objective score)...\n>> Gen 20 reached. Best weighted fitness score: 0.812 (Convergence locked).",
        ">> Dispatching Wallacei Pareto optimization (Independent dual targets)...\n>> Generation 50 computed. Mapping non-dominated design spaces.\n>> Pareto Front generated with 34 distinct optimal candidate structures.",
        ">> Benchmarking solvers. Wallacei selection achieved further 18% weight savings vs Galapagos at same solar shade rating.\n>> Pipeline complete. Data charts synchronized successfully."
      ][stepIdx];
    case "BIM_10":
      return [
        ">> Defining dynamic building footprint, height, and setback variables as genes within Grasshopper...",
        ">> Calculating solar exposure vector scores alongside real-time FAR/volume indices in parallel using custom Python and Grasshopper logic.",
        ">> Running the Cyclops evolutionary engine across 9 generations to map the trade-off Pareto front.",
        ">> Extracting the winning Pareto-optimal massing state directly into native Revit and Vectorworks geometry containers."
      ][stepIdx];
    case "BIM_09":
      return [
        ">> Voronoi algorithm executing on point clouds.\n>> Generating Biomimetic Space Frame shell.\n>> Total count: 5,124 nodes processed.",
        ">> Extracting pure geometric topological vertices and axes matrices.\n>> Distilled: 4,500 linear struts (Lines) and 1,200 joints (Points). Ready for stream.",
        ">> Packaging node data into JSON format.\n>> Dispatching 12MB serialized asset metadata payload via Raven AI serialization bridge.",
        ">> Revit custom listener active on socket.\n>> Stream received: instantiating 4,500 native Parametric Structural Struts instantly.\n>> Bypassed legacy imports. Pipeline complete."
      ][stepIdx];
    default:
      return [
        ">> Fetching workflow node parameters.",
        ">> Executing topological math matrix computation.",
        ">> Resolving external references & dependencies.",
        ">> Stream flushed successfully."
      ][stepIdx] || ">> Step execution finished.";
  }
};


const WorkloadGif = ({ 
  src, 
  alt, 
  className, 
  isArch,
  forcePlay = false,
  play,
  isInModal = false
}: { 
  src: string; 
  alt: string; 
  className?: string; 
  isArch: boolean;
  forcePlay?: boolean;
  play?: boolean;
  isInModal?: boolean;
}) => {
  if (!src) {
    return <div className={`flex items-center justify-center ${className || 'w-full h-full'}`} />;
  }
  const [isInternalHovered, setIsInternalHovered] = useState(false);
  const active = play !== undefined ? play : (forcePlay || isInternalHovered);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const isVideo = React.useMemo(() => {
    if (!src) return false;
    return src.includes("#video") || src.toLowerCase().endsWith(".mp4") || src.toLowerCase().endsWith(".mov") || src.includes("1h89DNz0NAtQeH_rtLlNxXqN0ZI_9FXuk");
  }, [src]);

  const staticUrl = React.useMemo(() => {
    if (!src) return "";
    if (src.includes('lh3.googleusercontent.com/d/')) {
      const id = src.split('/').pop()?.split('#')[0];
      const driveThumb = `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
      if (isVideo) return driveThumb;
      return `https://wsrv.nl/?url=${encodeURIComponent(driveThumb)}&output=jpg`;
    }
    if (src.includes('giphy.com/media/')) {
      return src.replace('/giphy.gif', '/giphy_s.gif');
    }
    if (isVideo) return src;
    return `https://wsrv.nl/?url=${encodeURIComponent(src)}&output=jpg`;
  }, [src, isVideo]);

  const animatedUrl = React.useMemo(() => {
    if (isVideo) return src;
    return getWsrvGifUrl(src);
  }, [src, isVideo]);

  React.useEffect(() => {
    if (isVideo && videoRef.current) {
      if (active) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [active, isVideo]);

  if (isVideo) {
    if (isInModal) {
      const googleDriveId = getDriveId(src);
      if (googleDriveId) {
        return (
          <div 
            className="w-full h-full relative"
            onMouseEnter={() => setIsInternalHovered(true)}
            onMouseLeave={() => setIsInternalHovered(false)}
          >
            {active ? (
              <iframe
                src={`https://drive.google.com/file/d/${googleDriveId}/preview?autoplay=1&mute=1`}
                className={`${className} border-0 pointer-events-auto`}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <img loading="lazy" 
                src={staticUrl} 
                alt={alt}
                referrerPolicy="no-referrer"
                className={className}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
            )}
          </div>
        );
      }
    }
    
    const cleanSrc = getPlayableVideoUrl(src);
    return (
      <div 
        className="w-full h-full relative overflow-hidden"
        onMouseEnter={() => setIsInternalHovered(true)}
        onMouseLeave={() => setIsInternalHovered(false)}
      >
        <video 
          ref={videoRef}
          src={cleanSrc} 
          loop 
          muted 
          playsInline
          className={className?.includes('object-contain') ? `${className} object-contain` : `${className} object-cover`}
          poster={staticUrl}
          style={{ pointerEvents: 'none' }}
        />
      </div>
    );
  }

  const fitClass = className?.includes('object-contain') ? 'object-contain' : 'object-cover';
  
  // We force a key update to restart the GIF from the beginning on hover
  const gifKey = React.useMemo(() => active ? Date.now() : 0, [active]);

  return (
    <div 
      className={`relative overflow-hidden cursor-pointer ${className || 'w-full h-full'}`}
      onMouseEnter={() => setIsInternalHovered(true)}
      onMouseLeave={() => setIsInternalHovered(false)}
    >
      {/* Background static image to hide any decoding flash */}
      <img loading="lazy" 
        src={staticUrl} 
        alt={alt}
        referrerPolicy="no-referrer"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        className={`absolute inset-0 w-full h-full ${fitClass}`}
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Animated GIF overlay */}
      {active && (
        <img 
          key={gifKey}
          src={animatedUrl} 
          alt={alt}
          referrerPolicy="no-referrer"
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          className={`absolute inset-0 w-full h-full ${fitClass}`}
          style={{ pointerEvents: 'none', backgroundColor: 'transparent' }}
        />
      )}
      <MobileDesktopToast />
    </div>
  );
};

const ProjectCard = ({ 
  item, 
  isArch, 
  onClick,
  onShowScript,
  onShowVideo
}: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  return (
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`group relative rounded-2xl overflow-hidden border transition-all duration-700 cursor-pointer flex flex-col h-full ${
        isArch 
        ? "border-gray-200 bg-white hover:border-black hover:shadow-2xl hover:shadow-black/5" 
        : "border-white/5 bg-[#111113] hover:border-white/20 hover:shadow-2xl hover:shadow-black/50"
      }`}
    >
      <div className="aspect-[16/11] overflow-hidden relative">
        <WorkloadGif 
          src={item.gifUrl} 
          alt={item.title}
          isArch={isArch}
          play={isHovered}
          className={`w-full h-full object-cover transition-all duration-1000 scale-100 group-hover:scale-105 pointer-events-none select-none ${
            isArch 
            ? "grayscale group-hover:grayscale-0" 
            : "opacity-40 group-hover:opacity-80"
          }`}
        />

        
        <div className={`absolute inset-0 transition-opacity duration-700 bg-black/0 group-hover:bg-black/10`} />
        
        {(item.title === "Net-Zero Worker Housing" || item.title === "Recycled Bus Pavilion") && (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-full border border-yellow-500/30 text-yellow-500 shadow-lg group-hover:border-yellow-400 group-hover:bg-black transition-all duration-500">
            <Award className="w-4 h-4" />
            <span className="text-[9px] font-mono tracking-widest font-bold uppercase">{item.title === "Net-Zero Worker Housing" ? "Grand Winner" : "National Citation"}</span>
          </div>
        )}

        {item.scriptUrl && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onShowScript) {
                onShowScript(item.scriptUrl, item.title);
              }
            }}
            className={`absolute bottom-3 left-3 px-3 py-1.5 text-[9px] font-mono tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 z-30 pointer-events-auto shadow-md ${
              isArch 
                ? "bg-white text-black hover:bg-black hover:text-white border border-gray-200" 
                : "bg-black/95 text-neon-cyan hover:bg-neon-cyan hover:text-black border border-white/10/35"
            }`}
          >
            <Code2 className="w-3.5 h-3.5 animate-pulse" />
            Show Script
          </button>
        )}

        <div className={`absolute top-4 right-4 p-3 rounded-full border transition-all duration-700 bg-black/80 backdrop-blur-md z-20 ${
          isArch 
          ? "border-gray-200 text-black hidden" 
          : `border-${item.color}/30 text-${item.color} scale-90 group-hover:scale-100`
        }`}>
          {item.icon}
        </div>
      </div>

      <div className="p-6 md:p-8 flex-grow">
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-3">
            <h4 className={`text-xl md:text-2xl font-medium tracking-tight transition-colors duration-700 ${isArch ? "text-black font-serif italic" : "text-white font-sans"}`}>
              {item.title}
            </h4>
            
            <div className="flex flex-col gap-1.5">
              {item.role && (
                <div className={`text-[10px] font-mono tracking-widest uppercase transition-colors duration-700 ${isArch ? "text-gray-500" : "text-gray-400"}`}>
                  {item.role}
                </div>
              )}
              {item.metric && !isArch && (
                <div className={`text-[10px] font-mono tracking-widest uppercase transition-colors duration-700 ${isArch ? "text-gray-500" : "text-neon-cyan"}`}>
                  {item.metric}
                </div>
              )}
            </div>
          </div>
          {item.category && (
            <div className="flex items-center gap-2 shrink-0 ml-4">
              <span className={`text-[8px] md:text-[9px] font-mono px-2 py-1 border transition-colors duration-700 ${isArch ? "border-black text-black" : "border-white/10 text-neon-cyan"}`}>
                {item.category}
              </span>
            </div>
          )}
        </div>

        <div className="hidden md:block">
          {item.problem && item.solution ? (
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col gap-1.5">
                <span className={`text-[9px] font-mono tracking-widest uppercase ${isArch ? "text-gray-400" : "text-[#3B82F6]"}`}>Problem</span>
                <p className={`text-sm leading-relaxed ${isArch ? "text-gray-600 italic font-serif" : "text-gray-300 font-sans"}`}>{item.problem}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className={`text-[9px] font-mono tracking-widest uppercase ${isArch ? "text-gray-400" : "text-[#00f2ff]"}`}>Solution</span>
                <p className={`text-sm leading-relaxed ${isArch ? "text-gray-600 italic font-serif" : "text-gray-300 font-sans"}`}>{item.solution}</p>
              </div>
            </div>
          ) : (
            <>
              {item.hook && (
                <div className={`text-[10px] md:text-[11px] font-mono mb-4 py-2 border-y transition-colors duration-700 border-dashed ${isArch ? "text-gray-600 italic border-gray-100" : "text-neon-cyan border-white/5"}`}>
                  {`// ${item.hook}`}
                </div>
              )}
                 
              <p className={`text-sm md:text-base mb-8 line-clamp-3 leading-relaxed transition-colors duration-700 ${isArch ? "text-gray-500 italic" : "text-gray-400 font-mono"}`}>
                {item.description}
              </p>
            </>
          )}
        </div>

        <div className="md:hidden flex flex-col mb-6">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}
            className={`text-[10px] font-mono tracking-widest uppercase w-full text-left py-3 border-y border-dashed ${isArch ? "text-gray-600 border-gray-200" : "text-neon-cyan border-white/10"} transition-colors`}
          >
            {showDetails ? "[ HIDE DETAILS ]" : (isArch ? "[ VIEW PROJECT DETAILS ]" : "[ VIEW PIPELINE DETAILS ]")}
          </button>
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4">
                  {item.problem && item.solution ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <span className={`text-[9px] font-mono tracking-widest uppercase ${isArch ? "text-gray-400" : "text-[#3B82F6]"}`}>Problem</span>
                        <p className={`text-sm leading-relaxed ${isArch ? "text-gray-600 italic font-serif" : "text-gray-300 font-sans"}`}>{item.problem}</p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className={`text-[9px] font-mono tracking-widest uppercase ${isArch ? "text-gray-400" : "text-[#00f2ff]"}`}>Solution</span>
                        <p className={`text-sm leading-relaxed ${isArch ? "text-gray-600 italic font-serif" : "text-gray-300 font-sans"}`}>{item.solution}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {item.hook && (
                        <div className={`text-[10px] font-mono mb-4 py-2 border-y transition-colors duration-700 border-dashed ${isArch ? "text-gray-600 italic border-gray-100" : "text-neon-cyan border-white/5"}`}>
                          {`// ${item.hook}`}
                        </div>
                      )}
                         
                      <p className={`text-sm mb-4 leading-relaxed transition-colors duration-700 ${isArch ? "text-gray-500 italic" : "text-gray-400 font-mono"}`}>
                        {item.description}
                      </p>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-auto">
          <div className="flex flex-wrap gap-2 mb-6">
            {item.tags.map((tag, idx) => {
              const isProfessional = tag === "Professional Experience" || tag === "IMK Internship" || tag === "Freelance";
              const isCompetition = tag === "Competition";
              
              let TagIcon = null;
              const tagLower = tag.toLowerCase();
              if (tagLower.includes('revit')) TagIcon = Layers;
              else if (tagLower.includes('navisworks')) TagIcon = GitMerge;
              else if (tagLower.includes('dynamo') || tagLower.includes('python')) TagIcon = Workflow;
              else if (tagLower.includes('excel') || tagLower.includes('sql') || tagLower.includes('json')) TagIcon = Database;
              else if (tagLower.includes('rhino') || tagLower.includes('grasshopper')) TagIcon = Activity;
              else if (tagLower.includes('iso')) TagIcon = ShieldCheck;
              else if (tagLower.includes('api') || tagLower.includes('c#')) TagIcon = Code2;

              if (isProfessional || isCompetition) {
                 return (
                  <span key={`${item.id}-${tag}-${idx}`} className={`text-[10px] md:text-[9px] px-2 py-0.5 font-mono border transition-colors duration-700 ${
                    isArch 
                      ? isProfessional ? "bg-black text-white border-black font-bold" 
                        : isCompetition ? "bg-amber-100 text-amber-800 border-amber-400 font-bold"
                        : "border-gray-100 text-gray-400" 
                      : isProfessional ? "bg-neon-cyan/20 text-neon-cyan border-white/10 font-bold" 
                        : isCompetition ? "bg-amber-500/20 text-amber-400 border-amber-500/50 font-bold"
                        : "border-white/10 text-gray-500 group-hover:text-[#6366F1]/70 group-hover:border-white/10"
                  }`}>
                    {tag}
                  </span>
                 );
              }
              
              return (
                <div key={`${item.id}-${tag}-${idx}`} 
                  className={`flex items-center gap-1.5 px-2 py-0.5 md:px-2.5 md:py-1 rounded-full border text-[10px] md:text-[9px] font-mono tracking-wider transition-all duration-300 ${
                    isArch 
                      ? "bg-gray-50/50 border-gray-200 text-gray-600 hover:border-black hover:text-black hover:bg-white"
                      : "bg-[#0a0a0c]/80 border-white/5 text-zinc-500 group-hover:border-white/20 group-hover:text-white"
                  }`}
                >
                  {TagIcon && (
                    <TagIcon className={`w-3 h-3 transition-colors duration-300 ${
                      isArch ? "text-gray-400 group-hover:text-black" : "text-blue-400/70 group-hover:text-[#6366F1]"
                    }`} />
                  )}
                  {tag}
                </div>
              );
            })}
          </div>


        </div>
      </div>
    </motion.div>
  );
};

const CodeSnippet = () => (
  <div className="bg-black p-4 rounded border border-white/5 font-mono text-xs text-neon-cyan overflow-hidden">
    <div className="flex gap-2 mb-2 opacity-50">
      <div className="w-2 h-2 rounded-full bg-red-500" />
      <div className="w-2 h-2 rounded-full bg-yellow-500" />
      <div className="w-2 h-2 rounded-full bg-green-500" />
    </div>
    <pre className="overflow-x-auto text-[10px] md:text-xs whitespace-pre-wrap break-words">
      {`def generate_geometry(params):
    # Algorithmic spatial generation
    mesh = Revit.CreateMesh(params)
    for face in mesh.faces:
        if face.area > threshold:
            optimize_topology(face)
    return mesh.deploy()`}
    </pre>
  </div>
);

const HeroTerminal = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const logPool = [
    "ATTACHING_REVIT_DATABASE...",
    "PARSING_ISO_19650_SCHEMA",
    "MAPPING_SPATIAL_PARAMETERS",
    "OPTIMIZING_COMPONENT_PLACEMENT",
    "VERIFYING_CLEARANCE_CLASHES",
    "SYNCING_COBIE_METADATA",
    "GENERATING_AUTOMATION_NODES",
    "VALIDATING_LOD_400_GEOMETRY",
    "PUSHING_DATA_TO_EXCEL",
    "CALCULATING_VOLUME_M3",
    "DETECTION_LATENCY: 12ms",
    "SYSTEM_STATUS: NOMINAL"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => {
        const next = [...prev, logPool[Math.floor(Math.random() * logPool.length)]];
        if (next.length > 8) return next.slice(1);
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-[9px] text-neon-cyan/60 p-4 space-y-1">
      {logs.map((log, i) => (
        <motion.div 
          key={`${log}-${i}`}
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <span className="text-neon-orange opacity-50">{">"}</span> {log}
        </motion.div>
      ))}
      <div className="w-1 h-3 bg-neon-cyan/50 animate-pulse inline-block ml-1" />
      <MobileDesktopToast />
    </div>
  );
};

const DataTable = () => (
  <div className="bg-black rounded border border-white/5 font-sans text-[11px] font-medium tracking-wide overflow-hidden">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-bottom border-white/5 bg-terminal-border/30">
          <th className="p-2 text-neon-orange">ID_TAG</th>
          <th className="p-2 text-neon-orange">VOLUME_M3</th>
          <th className="p-2 text-neon-orange">COST_EST</th>
        </tr>
      </thead>
      <tbody>
        {[
          ["VDC_001", "124.5", "$12,450"],
          ["VDC_002", "89.2", "$8,920"],
          ["VDC_003", "210.7", "$21,070"],
          ["VDC_004", "15.4", "$1,540"],
        ].map(([id, vol, cost], i) => (
          <tr key={`cost-${i}`} className="border-bottom border-white/10">
            <td className="p-2 text-gray-400">{id}</td>
            <td className="p-2 text-neon-cyan">{vol}</td>
            <td className="p-2 text-white">{cost}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const SECTIONS = ["hero", "arsenal", "fabrication", "experience", "terminal"];

interface ArsenalItem {
  id: string;
  domain?: string;
  problem?: string;
  solution?: string;
  intel?: string;
  title: string;
  role?: string;
  hook?: string;
  description?: string;
  icon: React.ReactNode;
  color: string;
  metric: string;
  content?: React.ReactNode;
  gifUrl: string;
  tags: string[];
  category?: string;
  isVerified?: boolean;
  scriptUrl?: string;
  ledger?: {
    inputs: string;
    engine: string;
    outputs: string;
  };
  workflow?: {
    screenshotUrl: string;
    steps: string[];
  };
  details?: {
    overview: string;
    challenge: string;
    solution: string;
    images?: string[];
    captions?: string[];
    slideDecks?: { title: string; images: string[] }[];
    presentationGrids?: { title: string; buttonLabel: string; images: string[]; externalUrl?: string; }[];
    autoCarousels?: { title: string; images: string[]; titles?: string[]; folderUrl?: string; }[];
    reportUrl?: string;
    reportLabel?: string;
    videoUrl?: string;
    githubUrl?: string;
    sheetsUrl?: string;
    publication?: string;
    comparisonTable?: {
      headers: string[];
      rows: string[][];
    };
  };
}

interface ExperienceData {
  year: string;
  company: string;
  role: string;
  description: string;
}

const AmbientBackground = ({ isArch }: { isArch: boolean }) => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 0.6, 0.6, 0.3]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Ambient Gradients */}
      <motion.div 
        style={{ y: y1, opacity }}
        className={`absolute -top-1/2 -left-1/4 w-[150%] h-[150%] rounded-full blur-[120px] transition-colors duration-1000 ${
          isArch ? "bg-gray-100/30" : "bg-neon-cyan/5"
        }`}
      />
      <motion.div 
        style={{ y: y2, rotate, opacity }}
        className={`absolute -bottom-1/2 -right-1/4 w-[150%] h-[150%] rounded-full blur-[120px] transition-colors duration-1000 ${
          isArch ? "bg-gray-200/20" : "bg-neon-orange/5"
        }`}
      />
      
      {/* Grid Overlay */}
      <div className={`absolute inset-0 opacity-[0.03] transition-colors duration-700 ${isArch ? "text-black" : "text-white"}`}>
        <div className="w-full h-full grid grid-cols-[repeat(40,1fr)] grid-rows-[repeat(40,1fr)]">
          {Array.from({ length: 1600 }).map((_, i) => (
            <div key={`grid-bg-${i}`} className="border-[0.5px] border-current" />
          ))}
        </div>
      </div>
      <MobileDesktopToast />
    </div>
  );
};

const ParallaxSection = ({ children, id, index, setActiveSection }: { children: React.ReactNode, id: string, index: number, setActiveSection: (i: number) => void }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [index === 0 ? 1 : 0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [index === 0 ? 1 : 0.8, 1, 1, 0.8]);

  const isInView = useInView(ref, { amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      setActiveSection(index);
    }
  }, [isInView, index, setActiveSection]);

  return (
    <section 
      ref={ref} 
      id={id} 
      className="min-h-[60vh] md:min-h-[85vh] w-full flex items-center justify-center relative py-10 md:py-12 px-6 overflow-hidden"
    >
      <motion.div 
        style={{ y, opacity, scale }}
        className="w-full max-w-7xl z-10"
      >
        {children}
      </motion.div>
    </section>
  );
};


const VDCSection = React.lazy(() => import('./components/VDCSection'));
const ArchSection = React.lazy(() => import('./components/ArchSection'));

import MobileDesktopToast from "./components/MobileDesktopToast";

export default function App() {
  const [activeSection, setActiveSection] = useState(0);
  const [isSkillsActive, setIsSkillsActive] = useState(false);
  const [isAppsActive, setIsAppsActive] = useState(false);
  const [isWorkflowsActive, setIsWorkflowsActive] = useState(false);
  const [isArchWorksActive, setIsArchWorksActive] = useState(false);
  const [isPrototypingActive, setIsPrototypingActive] = useState(false);
  const [selectedArsenalItem, setSelectedArsenalItem] = useState<ArsenalItem | null>(null);
  const [expandedMedia, setExpandedMedia] = useState<{ src: string; isVideo: boolean; isGif?: boolean; googleDriveId: string | null; alt: string } | null>(null);
  const [expandedGrid, setExpandedGrid] = useState<{ title: string; images: string[] } | null>(null);




  const [mode, setMode] = useState<'bim' | 'arch'>('bim');
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // VDC Core Workflow Logic Processor States
  const [simulatingWorkflowId, setSimulatingWorkflowId] = useState<string | null>(null);
  const [activeSimStep, setActiveSimStep] = useState<number>(-1);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [isSimRunning, setIsSimRunning] = useState<boolean>(false);
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'render' | 'drawing' | 'video' | 'sheets'>('all');

  // Clear simulator on selection change
  useEffect(() => {
    setSimulatingWorkflowId(null);
    setActiveSimStep(-1);
    setSimulationLogs([]);
    setIsSimRunning(false);
    setGalleryFilter('all');
  }, [selectedArsenalItem]);

  // Lock body scroll when modals are open
  useEffect(() => {
    if (selectedArsenalItem || expandedMedia || isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedArsenalItem, expandedMedia, isMenuOpen]);

  // Comprehensive Visual Protection Layer (Block Saving, Copying, and Downloading of Media)
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // Completely block right clicks across the page to secure source layers
      e.preventDefault();
    };

    const handleDragStart = (e: DragEvent) => {
      // Prevent any image, video, canvas, or iframe from being dragged out of the window coordinates
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'IMG' || target.tagName === 'VIDEO' || target.tagName === 'IFRAME' || target.tagName === 'CANVAS')) {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      
      // Ctrl+S / Cmd+S (Prevent saving page / assets compile)
      if (isCmdOrCtrl && e.key.toLowerCase() === 's') {
        e.preventDefault();
      }
      
      // Ctrl+U / Cmd+Option+U (Prevent View Source)
      if ((isCmdOrCtrl && e.key.toLowerCase() === 'u') || (isMac && isCmdOrCtrl && e.altKey && e.key.toLowerCase() === 'u')) {
        e.preventDefault();
      }

      // Ctrl+Shift+I / Cmd+Option+I (Prevent Inspect inspector)
      if ((isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'i') || (isMac && isCmdOrCtrl && e.altKey && e.key.toLowerCase() === 'i')) {
        e.preventDefault();
      }

      // Ctrl+Shift+C / Cmd+Option+C / Inspect visual trigger
      if ((isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'c') || (isMac && isCmdOrCtrl && e.altKey && e.key.toLowerCase() === 'c')) {
        e.preventDefault();
      }

      // Ctrl+Shift+J / Cmd+Option+J (Prevent Console drawer)
      if ((isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'j') || (isMac && isCmdOrCtrl && e.altKey && e.key.toLowerCase() === 'j')) {
        e.preventDefault();
      }

      // F12 (Inspect Developer console key)
      if (e.key === 'F12') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // VDC Terminal Hover & Click Sounds
  useEffect(() => {
    if (mode === 'arch') return;

    let hoverTimeout: any;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, [role="button"], .cursor-pointer')) {
        // Debounce hover to prevent too much noise
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
          playVDCHoverSound();
        }, 50);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, [role="button"], .cursor-pointer')) {
        playVDCClickSound();
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('click', handleClick);

    return () => {
      clearTimeout(hoverTimeout);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('click', handleClick);
    };
  }, [mode]);

  const runWorkflowSimulation = (projectId: string, steps: string[]) => {
    if (isSimRunning) return;
    setIsSimRunning(true);
    setSimulatingWorkflowId(projectId);
    setActiveSimStep(0);
    
    const initLogs = [
      `>> Handshaking secure listener endpoint for workflow assembly [${projectId}]...`,
      `>> Loading computational schema variables in local sandbox...`,
      `[STEP 01]: Running...`,
      getSimLogsForProject(projectId, 0)
    ];
    setSimulationLogs(initLogs);

    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep += 1;
      if (currentStep < steps.length) {
        setActiveSimStep(currentStep);
        const nextLog = getSimLogsForProject(projectId, currentStep);
        setSimulationLogs(prev => [
          ...prev, 
          `[STEP 0${currentStep + 1}]: Running...`, 
          nextLog
        ]);
      } else {
        clearInterval(interval);
        setActiveSimStep(steps.length);
        setSimulationLogs(prev => [
          ...prev, 
          `[SUCCESS]: PIPELINE FULLY SERIALIZED, COMPILED, AND INJECTED SUCESSFULLY. ENTIRE CALCULATION EXECUTED IN 42ms.`,
          `>> Dynamic system updates synced to parent portfolio dashboard.`
        ]);
        setIsSimRunning(false);
      }
    }, 1500);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setFormError(null);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to transmit message');
        }
        setIsSent(true);
        setFormState({ name: '', email: '', message: '' });
        setTimeout(() => setIsSent(false), 5000);
      } else {
        // Handle non-JSON responses (like 404 HTML pages)
        const text = await response.text();
        console.error('Non-JSON response:', text);
        if (response.status === 404) {
          throw new Error('API_NOT_FOUND: The backend server is not responding to this route.');
        }
        throw new Error(`SERVER_ERROR: Received unexpected response format (${response.status})`);
      }
    } catch (err) {
      console.error('Transmission error:', err);
      setFormError(err instanceof Error ? err.message : 'CONNECTION_ERROR: UNABLE_TO_REACH_VDC_CORE');
    } finally {
      setIsSending(false);
    }
  };

  const isArch = mode === 'arch';
  const [terminalMode, setTerminalMode] = useState<'bim' | 'arch'>('bim');
  const [activeTelemetry, setActiveTelemetry] = useState<number | null>(null);
  const telemetryDomains = [
    {
      id: 1,
      title: "BIM DATA & COORDINATION",
      icon: <Layers className="w-4 h-4" />,
      summary: "Structuring multi-disciplinary BIM models up to LOD 400, setting up ISO 19650 Common Data Environments (CDE), and automating 5D quantity takeoffs.",
      core: ['Revit', 'Navisworks Manage', 'Autodesk Construction Cloud (ACC)', 'BIM Collaborate Pro', 'Vectorworks', 'Excel'],
      methods: ['ISO 19650 Standards', 'Cloud CDE Setup & Governance', '5D Quantity Harvesting', 'Clash Coordination Matrix']
    },
    {
      id: 2,
      title: "AUTOMATION & RUNTIME API",
      icon: <Terminal className="w-4 h-4" />,
      summary: "Developing custom automation scripts and extracting metadata via Revit APIs to drastically reduce manual repetitive drafting.",
      core: ['Python', 'pyRevit', 'Revit API', 'Dynamo', 'Vectorworks Marionette', 'Rhino.Inside.Revit'],
      methods: ['Custom C#/Python Add-ins', 'UI/UX Ribbon Extension', 'Automated QA/QC Auditing', 'Data Serialization (JSON)']
    },
    {
      id: 3,
      title: "COMPUTATIONAL DESIGN & SIMULATION",
      icon: <Component className="w-4 h-4" />,
      summary: "Utilizing algorithmic design and evolutionary solvers to generate, analyze, and optimize complex spatial geometries.",
      core: ['Rhino 3D', 'Grasshopper', 'Ladybug Tools', 'DesignBuilder', 'Autodesk Forma', 'Rhino.Inside.Revit'],
      methods: ['Evolutionary Solvers (Wallacei)', 'Parametric Optimization', 'Computational Fluid Dynamics (CFD)', 'Building Performance Simulation (BPS)']
    },
    {
      id: 4,
      title: "DISTRIBUTED WEB APPLICATIONS",
      icon: <Cpu className="w-4 h-4" />,
      summary: "Building scalable full-stack web applications and custom AEC dashboards with modern frontend frameworks.",
      core: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js REST APIs', 'Three.js / WebGL'],
      methods: ['Cloud Databases (Firestore)', 'Vercel Deployment', 'Serverless Functions', 'Real-time BIM Telemetry']
    },
    {
      id: 5,
      title: "REALITY CAPTURE & RENDERING",
      icon: <Monitor className="w-4 h-4" />,
      summary: "Transforming 3D models into immersive visual experiences and utilizing generative AI for rapid conceptual imagery.",
      core: ['D5 Render', 'Twinmotion', 'Enscape', 'Adobe Creative Cloud', 'Meshroom'],
      methods: ['Photogrammetry & 3D Mesh Reconstruction', 'Photorealistic Visualization', 'Generative AI Workflows', 'Post-Production & Compositing']
    }
  ];
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | null>(null);

  const visibleSections = ["landing", "vdc-section", "arch-section", "terminal"];

  const menuItems = [
    { id: "landing", label: "Home", isSection: true, index: 0, elementId: "landing" },
    { id: "skills", label: "Skills", isSection: false, elementId: "skills" },
    { id: "vdc-section", label: "Workflows", isSection: true, index: 1, elementId: "vdc-section" },
    { id: "vdc-apps", label: "Apps / Web", isSection: false, elementId: "vdc-apps" },
    { id: "arch-section", label: "Design Projects", isSection: true, index: 2, elementId: "arch-section" },
    { id: "arch-prototyping", label: "Prototyping", isSection: false, elementId: "arch-prototyping" },
    { id: "terminal", label: "Contact & Bio", isSection: true, index: 3, elementId: "terminal" },
  ];

  const desktopMenuItems = [
    { id: "landing", label: "Gateway", isSection: true, index: 0, elementId: "landing" },
    { id: "skills", label: "Skills", isSection: false, elementId: "skills" },
    { id: "vdc-section", label: "Workflows", isSection: true, index: 1, elementId: "vdc-section" },
    { id: "vdc-apps", label: "Apps / Web", isSection: false, elementId: "vdc-apps" },
    { id: "arch-section", label: "Design Projects", isSection: true, index: 2, elementId: "arch-section" },
    { id: "arch-prototyping", label: "Prototyping", isSection: false, elementId: "arch-prototyping" },
    { id: "terminal", label: "Contact & Bio", isSection: true, index: 3, elementId: "terminal" },
  ];

  const archArsenal: ArsenalItem[] = [
    {
      id: "ARCH_08",
      title: "Luxury Villas Development in Alibaug",
      role: "Architectural Intern (IMK Architects)",
      hook: "GFC documentation, MEP coordination, and data-driven delivery for high-end residential villas.",
      description: "Digital delivery and interior detailing for 5 units, with custom Vectorworks automation scripts.",
      icon: <Box className="w-6 h-6 text-gray-400" />,
      color: "gray-400",
      metric: "5 Residential Units",
      gifUrl: "https://lh3.googleusercontent.com/d/1lgLSUtlU9cliUbR-J28iGFmNpBAgwDHL",
      tags: ["Professional Experience", "Vectorworks", "Marionette Scripts", "MEP Coordination", "GFC Documentation", "BOQ Extraction"],
      category: "Professional",
      ledger: {
        inputs: "Schematic CAD Programs, Structural Layouts, MEP Plans",
        engine: "Vectorworks BIM, Marionette Parametric Automation",
        outputs: "GFC Documentation, FF&E Schedules, BOQ Data, Coordinated 2D Overlays"
      },
      workflow: {
        screenshotUrl: "https://lh3.googleusercontent.com/d/1szg4o6fK4gooWlBDS4d9qGr9EmG7QoRA",
        steps: [
          "Generated dynamic design variants and parametric massing models to optimize spatial layouts.",
          "Conducted comprehensive 2D spatial overlays between architectural, structural, and MEP layouts to resolve conflicts.",
          "Produced GFC detailing for toilets, kitchens, interior wall elevations, and joinery.",
          "Programmatically extracted BOQs and FF&E schedules directly from 3D assets.",
          "Developed Vectorworks Marionette scripts to automate repetitive drafting tasks and maintain standards."
        ]
      },
      details: {
        overview: "This professional project involved comprehensive GFC documentation and digital delivery for a high-end luxury villa development spread across two exclusive sites in Zirad and Saral, Alibaug. The scope included precise interior detailing, FF&E schedules, and MEP coordination for 5 bespoke residential units, significantly streamlining the construction process using custom Vectorworks Marionette automation scripts.",
        challenge: "Managing extensive detailing while ensuring strict cross-disciplinary coordination and accurate procurement extraction.",
        solution: "Utilized Vectorworks BIM to conduct spatial overlays, resolving MEP conflicts before GFC issuance. Leveraged Marionette scripts for drafting automation and directly extracted precise BOQs to streamline procurement workflows.",
        images: [
          "https://lh3.googleusercontent.com/d/1TtzJzZzzXzgpikF3K0nivFd_KmCcFNx3#drawing",
          "https://lh3.googleusercontent.com/d/1mA39MVAtn305IGJ3IYh2RDaxLNRMQvqL#drawing",
          "https://lh3.googleusercontent.com/d/1Kgg8kanN3n7YtRVUlXhoANt9aVpjzUnS#drawing",
          "https://lh3.googleusercontent.com/d/1UMVhYpqsmqFOMX3eElK8ph6bIKfB039l#drawing",
          "https://lh3.googleusercontent.com/d/1U2bYPIXgXbMn3n7wlAanLSb1zg8iPJhV#drawing"
        ],
        captions: [
          "1. GFC Sheet: Kitchen Section Detailing",
          "2. Villa 04 - Wifi/CCTV Integrated Layout",
          "3. GFC Sheet - Flooring Layout",
          "4. Auto Tile Placer Plugin - Saving Manual Drafting Time and Generating Iterations quickly",
          "5. Procurement/ BOQs List & Estimate"
        ],
        autoCarousels: [
          {
            title: "Interior & Furniture Drawings",
            folderUrl: "https://drive.google.com/drive/folders/1HbGADolqwIpNgNhrnckg2GuF8mZW_pKI",
            images: [
              "https://lh3.googleusercontent.com/d/1G5BTk-sb5d7oLGpmd4XorJbnBn4qljzW",
              "https://lh3.googleusercontent.com/d/1ShgLr1N6pCrhMCqNLvAg64qbAaMU071R",
              "https://lh3.googleusercontent.com/d/1Jz90SM98_Vnnf_5yqSiqD7pwch_6u-ql",
              "https://lh3.googleusercontent.com/d/1scJv7FULra2Ex_oP9rbv_MyLGSIW8tKr",
              "https://lh3.googleusercontent.com/d/1HKTRsbq4MvgCi_6LgMMU64botdoaWca1",
              "https://lh3.googleusercontent.com/d/1BPH4KjFOtLQnJY5rjJVQXB3ZaYZoBiZ5",
              "https://lh3.googleusercontent.com/d/18ce0mKs0REZgsjFtQJoysyPWoYLBVITt",
              "https://lh3.googleusercontent.com/d/17XZ9XjqMv4KhCJpEJsEpmWW26cD_r2d3",
              "https://lh3.googleusercontent.com/d/1pEpkFokNcWmor1uwtQscgA5QZPKvbiMZ",
              "https://lh3.googleusercontent.com/d/1-draVzh0OdpOwltODME92uQjLRkXfhfL",
              "https://lh3.googleusercontent.com/d/1dxg65WuFAJnS6J4nVVcH13xdgoQoqcf4",
              "https://lh3.googleusercontent.com/d/1ogiC2qal0b9AyupRXDKVhXk4bREhDTcr",
              "https://lh3.googleusercontent.com/d/1ao9bf6ywwuzZXz90CfmbqrH05AYHyEro",
              "https://lh3.googleusercontent.com/d/1D1nEk_TiUS2gaomj3RWZe7EaPvn017z8",
              "https://lh3.googleusercontent.com/d/1CMbNxS9Zciogij6iX8hqlZGeH-QuUvzM",
              "https://lh3.googleusercontent.com/d/13xTtDteSgBS0MfmLYude3WKeyDCdi7_7"
            ],
            titles: [
              "Aman's Bedroom Details",
              "Villa 04 - Sana's Bedroom",
              "Den Cabinet & TV Console Detail",
              "Villa 04 - Den Elevations",
              "Dining Table w Top Plans & Section",
              "V4 Aman's Study Table",
              "V4 SJK Study Table Details",
              "Sana's Bookshelf Elev w Light",
              "SJK Bookshelf Elev",
              "Villa 04 - Railing - Room Elev",
              "Villa 04 - RKSJK Room Elevs",
              "Villa 04 - Wardrobes Revised",
              "Villa 04 - Aman's Wardrobe",
              "Villa 04 - Guest's Wardrobe",
              "Villa 04 - RK's Wardrobe",
              "Villa 04 - SJK Wardrobe"
            ]
          }
        ],
        presentationGrids: [
          {
            title: "Staff Block GFC Drawings",
            buttonLabel: "View Staff Block GFC Drawings",
            images: [
              "https://lh3.googleusercontent.com/d/1awAYvNP0s9IWy5zaVlQiFUyPDoCfQS-j#drawing",
              "https://lh3.googleusercontent.com/d/1zqIbP5B3wKPo75rBJTDjtYxofHO0RrgF#drawing",
              "https://lh3.googleusercontent.com/d/16G1t6BuJj7I0u0Uk3jIzRrxmrdlpRTqn#drawing",
              "https://lh3.googleusercontent.com/d/1DFZMeNzu9J9y0POOhowo98LExxZmWuyV#drawing",
              "https://lh3.googleusercontent.com/d/1ySNtn8Gp_ipZP6xYXzl8VttpTpiXUIPf#drawing",
              "https://lh3.googleusercontent.com/d/1-LAA8vHeCzX2j415FL2F4Y2h0kZ3JaEq#drawing",
              "https://lh3.googleusercontent.com/d/1tfAttcwIr1UcaJBkvh38bqyR6smV1kR0#drawing",
              "https://lh3.googleusercontent.com/d/1J3Tt8DdhMZPUzslFIW59cgJNymXF-lJd#drawing",
              "https://lh3.googleusercontent.com/d/1J0HrgFjxIFEsnBT0Suewm4hWJqbi5itH#drawing",
              "https://lh3.googleusercontent.com/d/1uhANYvjGx0AHXxEyrvylrDdDewNwhNDb#drawing"
            ]
          },
          {
            title: "Hotel Glazing and Facade Details",
            buttonLabel: "Hotel Glazing and Facade Details",
            images: [],
            externalUrl: "https://drive.google.com/drive/folders/1MBSVWR9e3bNbTOKGnAb6FyDmag4emUCU?usp=sharing"
          }
        ],
        slideDecks: [
          { 
            title: "Villa 04 - Site Exterior Photos", 
            images: [
              "https://lh3.googleusercontent.com/d/1-KEprrp28b0MIuvrkDDcXiukpSBY8HEj",
              "https://lh3.googleusercontent.com/d/1KLcXDgJhTYvG5mNCHyPJzHJNzqGCh5an",
              "https://lh3.googleusercontent.com/d/1ANtibq_t464j8HC87R-NArZn3SagF84p",
              "https://lh3.googleusercontent.com/d/1c_3JisppeczT3DNbX_t5Qo4D_aZmOLn0",
              "https://lh3.googleusercontent.com/d/1_ZNoFaRKGWDYBj9WUtpabtVE8XHCzoxg",
              "https://lh3.googleusercontent.com/d/1ZSatViEd0jwhj5Z9R2zwCBzF-oq7vdCH",
              "https://lh3.googleusercontent.com/d/1vdnCJ3cyOOZy7C8QWqOXXx2y9vwrmk9q",
              "https://lh3.googleusercontent.com/d/1iCX2o2-NOfJoztCXhu_TUx3kAXnlhZdI",
              "https://lh3.googleusercontent.com/d/1mK_xPH4iCZgv7uHjuG92vRbIjKtqXZyZ",
              "https://lh3.googleusercontent.com/d/1bkm2ZyAHtRAwCDISOPBe7546YLzclyWg",
              "https://lh3.googleusercontent.com/d/10g4_T98Qsn7Q80XGgfhi_BKVVYa13xwi",
              "https://lh3.googleusercontent.com/d/1bfeu8-cJ44rJuFN-xmNZZNsshC-jNBdT"
            ]
          },
          { 
            title: "Villa 04 - Staff Quarters Photos", 
            images: [
              "https://lh3.googleusercontent.com/d/1GS-4cN_QIa7nHp3KHf3DUHfCtDFK3oZ7",
              "https://lh3.googleusercontent.com/d/1qH-YGfDIhRyP4Fcl-lJDTwc9nSXmTN0A",
              "https://lh3.googleusercontent.com/d/19pWG3kOqXGLazD5bI_OFrkX-6cXh2QJL",
              "https://lh3.googleusercontent.com/d/1cPEX-5oacR_2GPRc5t2RDY_LjBdwwI8H",
              "https://lh3.googleusercontent.com/d/1F6AOq9R0te6svzJRCeqaMVi4heYotsyX",
              "https://lh3.googleusercontent.com/d/1m3viU08VSXFDd7Jii0VtGTwB6PCExTck"
            ]
          },
          { 
            title: "Villa 03 Site Visit", 
            images: [
              "https://lh3.googleusercontent.com/d/1bdzxZywBnUXBrE2q-KNWFnUuRfaXJ0nB",
              "https://lh3.googleusercontent.com/d/1HNkDwVrPwzPGn51yCQhosXp85GIvEe3p",
              "https://lh3.googleusercontent.com/d/1OMT-R1zJrDRFfij8Z_gvTIXGyeYp9jX-",
              "https://lh3.googleusercontent.com/d/1HCIGP7pOTbEmDFkeeuVeR-V7qyn5z3q6",
              "https://lh3.googleusercontent.com/d/1VmFoq_Zd9E_meTqL5kmrvTw2GLWWkm1Z",
              "https://lh3.googleusercontent.com/d/19OwuMyoxNAsITOXK-VPwSXWmNCRDKUQB",
              "https://lh3.googleusercontent.com/d/1dnqKfUMYcKWliBCBOAay9zP626L9Yygl",
              "https://lh3.googleusercontent.com/d/1kFx2ajSW1mGa5lTWL3XOxRzBXIzCHGeO",
              "https://lh3.googleusercontent.com/d/10YRCOnTa-nns1EnKVtlgfayUeYvt5uFj",
              "https://lh3.googleusercontent.com/d/120lag0hMgBB9RiqxBMvSMa_6HCu32xXf",
              "https://lh3.googleusercontent.com/d/1o8STJ3dEH2u5jGxTxFcuXsO8QEmnVc1W"
            ]
          },
          { 
            title: "Villa 02 Site Visit", 
            images: [
              "https://lh3.googleusercontent.com/d/1ae0gmnfgtyMAtrDBGiDGukLBmTnCkybX",
              "https://lh3.googleusercontent.com/d/1RpAoTWbYMlDxTJhVQmpDri7lp5qFd3s6",
              "https://lh3.googleusercontent.com/d/189Ig7nmGaZK8qTCWYGZsZuVoBgvOVFi_",
              "https://lh3.googleusercontent.com/d/1rUx5dj4i-NPJPTSfyqeCDZtPzKatoSzZ",
              "https://lh3.googleusercontent.com/d/17kwhweaNDQ5TCOzAGU4iFrdbY9Sk2S5H",
              "https://lh3.googleusercontent.com/d/12yW_5zeHiBhtS7YBjCW_ZHBLQ7c4MJzT",
              "https://lh3.googleusercontent.com/d/1lgLSUtlU9cliUbR-J28iGFmNpBAgwDHL",
              "https://lh3.googleusercontent.com/d/1WtpqypRND4d3dhZZ8nVFYyxLXEQJ_XVy",
              "https://lh3.googleusercontent.com/d/1_iHeigLcbKo6Es3ycWzCb6K8kS0BNbOl",
              "https://lh3.googleusercontent.com/d/1yvvo4R-GZggtqvJ_bmVbEhjy-cObIUoD",
              "https://lh3.googleusercontent.com/d/1xNdPkxcrMk0kbTQtgCOryAtvLwlzqa_E",
              "https://lh3.googleusercontent.com/d/1UteJxXj2ePIOKIou39LMhHiAOZ98MLAM",
              "https://lh3.googleusercontent.com/d/1FPzYfLwKOVt7osbLqqMJMjO3p_JW5Hp6"
            ]
          }
        ]
      }
    },
    {
      id: "ARCH_01",
      title: "Net-Zero Worker Housing",
      role: "Simulation Lead",
      hook: "National Grand Winner (Solar Decathlon India).",
      description: "Solar, thermal, and wind simulations for optimizing resource-efficient architecture.",
      icon: <ShieldCheck className="w-6 h-6 text-gray-400" />,
      color: "gray-400",
      metric: "Net-Zero",
      gifUrl: "https://lh3.googleusercontent.com/d/1-BhZKRQJEpkQhE8Kuq6BURh0UYO7qYrH",
      tags: ["Performance Simulation", "DesignBuilder", "IESVE", "Competition"],
      category: "Exterior",
      ledger: {
        inputs: "Local Climate Records, Basic Building Shape",
        engine: "Energy & Wind Simulation software (DesignBuilder, EnergyPlus)",
        outputs: "Smart Building Facade, Natural Light & Sound Maps"
      },
      workflow: {
        screenshotUrl: "https://lh3.googleusercontent.com/d/1P0FpPB-A9-Cs0bz1cywCumsfNBZyCA6j",
        steps: [
          "Run full-scale sun, heat, and air ventilation simulations.",
          "Optimize window panels, shading, and natural airflow paths.",
          "Verify passive geo-cooling cooling loops.",
          "Present technical data to the grand prize jury."
        ]
      },
      details: {
        overview: "An award-winning, net-zero housing framework aimed at providing ultra-affordable and energy-efficient living conditions for construction workers in India. By utilizing advanced environmental simulations for solar, thermal, and wind performance, the project successfully minimizes reliance on artificial cooling while ensuring a dignified and sustainable habitat.",
        challenge: "Keeping the building naturally cool in hot, humid weather without expensive air conditioning.",
        solution: "Designed natural cooling tunnels and strategic facade shading. Virtual simulations proved this lowered energy costs by 40%.",
        images: [
          "https://lh3.googleusercontent.com/d/1Wx7tBpY9ZGnVQmq5gRMamwawbmuLsenm#drawing",
          "https://lh3.googleusercontent.com/d/1P0FpPB-A9-Cs0bz1cywCumsfNBZyCA6j#render",
          "https://lh3.googleusercontent.com/d/1PSV1JocI5rfTI7YN3pJTuZfHfC7VrErr#render",
          "https://lh3.googleusercontent.com/d/1Cva8sA6rByHMMdrSopwZ9nExSzl7tua2#drawing",
          "https://lh3.googleusercontent.com/d/1F7hEXo7cFfefXcQZkAtw8VD1ORVlbUF5#drawing",
          "https://lh3.googleusercontent.com/d/1VsF-1b3fSI0iGVvb5gw7YUcfE1bwk8v6#drawing",
          "https://lh3.googleusercontent.com/d/1T6NhY_HzNaA5KmDZ8gGQwsL7Q4VgAwDt#drawing",
          "https://lh3.googleusercontent.com/d/1_uB4eu_Sdt_0MJNhG5vjkc9qqWocySVb#video",
          "https://lh3.googleusercontent.com/d/1lP5dsWK4keZJ-mVAUGqbfzbCTjTECsyB#video",
          "https://lh3.googleusercontent.com/d/1HGwlS9XXgMU6SRxc6KdCuYKbJffCh3-r#video",
          "https://lh3.googleusercontent.com/d/1dB5qahGlL_OdCbpCnj0zgwUxDsLn_Xa1#video",
          "https://lh3.googleusercontent.com/d/1x3k1iHMCjOgRUqC4u8oy97EonAP1Gi56#video",
          "https://lh3.googleusercontent.com/d/1op-zIIk9ZTYHpaqFzP1jlqkWUBet1u8V#video",
          "https://lh3.googleusercontent.com/d/1NZ5bClvC2fRsykZkFubZosvNEPCWZiof#video",
          "https://lh3.googleusercontent.com/d/1tZkbfwAA5Al8zqCDQAPOIu1DmZKL_axo#video",
          "https://lh3.googleusercontent.com/d/1IJbgeznNn0qwVKCBzD--ZleqbjowBO7k#video",
          "https://lh3.googleusercontent.com/d/1pIA11NoDFafX6hNuXCDvp6XaoLvVVa9d#video",
          "https://lh3.googleusercontent.com/d/1N93o2rnSNbHFxC524i330sgD4Y2YqmMO#video"
        ],
        reportUrl: "https://drive.google.com/file/d/1CqV2ZUK7VDxh0zOxQze9lkTSIEavsr12/view?usp=sharing",
        videoUrl: "https://youtu.be/g0VIh64HiT8?si=hyFN6JXnnG_pqM5A"
      }
    },
    {
      id: "ARCH_02",
      title: "Sadhu Nivas Residence",
      role: "Architectural Designer & BIM Modeler",
      hook: "Modular prefabrication meeting minimalistic, tranquil spiritual living.",
      description: "A modular residential community featuring precise parametric Revit families and tranquil garden renders.",
      icon: <Layers className="w-6 h-6 text-gray-400" />,
      color: "gray-400",
      metric: "Prefab Modules",
      gifUrl: "https://lh3.googleusercontent.com/d/10bE7vtwgn9WTlx-7E85wnqciWxuwP_M9",
      tags: ["Professional Experience", "Revit", "Twinmotion", "Snaptrude", "Prefabricated Modules", "Modular Design"],
      category: "Contract",
      ledger: {
        inputs: "Module dimensions, tranquil zoning needs",
        engine: "3D CAD modeling & natural rendering software",
        outputs: "Detailed Modular Precast Families, Spiritual Landscape Visualization"
      },
      workflow: {
        screenshotUrl: "https://lh3.googleusercontent.com/d/10bE7vtwgn9WTlx-7E85wnqciWxuwP_M9",
        steps: [
          "Determine minimal room sizes and modular grid alignments.",
          "Build parametric Revit families for prefabricated concrete wall/slab units.",
          "Test layout designs for structural alignment.",
          "Create immersive quiet garden views and natural lighting setups in Twinmotion."
        ]
      },
      details: {
        sheetsUrl: "https://drive.google.com/file/d/1ByKEytkeQRIW7cLqqtOtRko69qBClDDt/view?usp=sharing",
        overview: "A prefabricated modular housing neighborhood thoughtfully conceptualized to support the minimalistic lifestyles and meditative tranquility of spiritual practitioners. Through the rigorous use of precise parametric Revit families, the project merges rapid, efficient off-site assembly with the creation of deeply serene, naturally integrated living spaces.",
        challenge: "Creating cozy, warm, and highly peaceful spaces using concrete panels while maintaining strict modular grids for low-cost prefabrication.",
        solution: "Engineered structural precast Revit families spanning a repeating 3m x 3m module shell. Designed smart layout groupings arranged around hidden courtyard thresholds to block outer noises and ensure visual peace.",
        images: [
          "https://lh3.googleusercontent.com/d/1wTF4ThR7toYkbOtAQS_bQ226Ou_NIAM2",
          "https://lh3.googleusercontent.com/d/1Ds1UzgVlSWSDZu2sLBM8VJ7RR3k4ks5c",
          "https://lh3.googleusercontent.com/d/1tz7_0qKj9O7gMb9Y_9LRu1Nwm2kzzIYg",
          "https://lh3.googleusercontent.com/d/1Di8ozi0jUXqKojYWEaZ-KM3EYMsBVHep",
          "https://lh3.googleusercontent.com/d/1GsP_RnRX4wjf2BPgk93AzGhAxbzsbvyp",
          "https://lh3.googleusercontent.com/d/1W1shkPhmOT2Y-nhdv1_-D6hbkm-Sc8gx",
          "https://lh3.googleusercontent.com/d/16UI9YEMQHAphksfgTeCE6sBbBgC-jg0U",
          "https://lh3.googleusercontent.com/d/1KI8zKEskTYvEeUbJUo87o86QdEdA9_m1",
          "https://lh3.googleusercontent.com/d/1J3j_7LYpiKy8qrM9SZu7dc_vAECn4z2i",
          "https://lh3.googleusercontent.com/d/1cm0tohPLT8u_WnCNwzvoqi46rwLeCHsO",
          "https://lh3.googleusercontent.com/d/15wp51CpGqduNTeQLAXVpk7dBN9vS99Ku",
          "https://lh3.googleusercontent.com/d/1c4xsY78BVQDV2jomVFD8aeMzM_s-3uGU",
          "https://lh3.googleusercontent.com/d/1BpGCi_vwo8EG9yCysuWydBhmudsMEl8l",
          "https://lh3.googleusercontent.com/d/1gMFMRcdBS6DYQN7ZN5WRX8HGB_ELZhVJ",
          "https://lh3.googleusercontent.com/d/1lsUqSn-K-O5hI56tiHRXObaJwX_xeadE",
          "https://lh3.googleusercontent.com/d/1aV_9MlRN_LWOAUA-bFk0i82I119RBRMD",
          "https://lh3.googleusercontent.com/d/1v3uwvGvv0nB4Dx0KahIp3X47xKVCWxff",
          "https://lh3.googleusercontent.com/d/12YaZiM-2dt8hQbGtk_VQd2rewL44zXsS"
        ]
      }
    },
    {
      id: "ARCH_05",
      title: "Karunya Hospice and Palliative Care Center",
      role: "Lead Architect (Thesis)",
      hook: "Designing for dignity, nature, and the final transition.",
      description: "A 50-bed palliative care campus providing a warm, nature-integrated space for patients.",
      icon: <Activity className="w-6 h-6 text-gray-400" />,
      color: "gray-400",
      metric: "Biophilic",
      gifUrl: "https://lh3.googleusercontent.com/d/1cEY_3KZExGtCPAO_BJLjaEXJW2yUMLlM",
      tags: ["Healthcare Design", "Biophilic Architecture", "Thesis", "Pratibimbh Journal"],
      category: "Exterior",
      ledger: {
        inputs: "Patient care needs, local forest topography",
        engine: "Biophilic design and health-support layouts",
        outputs: "Healing garden floorplans, organic village walkways"
      },
      details: {
        publication: "Published in 'Pratibimbh', the official annual architecture publication of BMS College of Architecture, Design and Planning, celebrating exemplary student design research and execution.",
        sheetsUrl: "https://drive.google.com/file/d/1G2zBH44ll0Yq8nb-djHHUwc14fW4jXAp/view?usp=sharing",
        reportUrl: "https://drive.google.com/file/d/1PvSO63GmlC2z-dUPCPA57tCswDiUP9dB/view?usp=drive_link",
        overview: "A compassionate 50-bed palliative care and hospice campus that reimagines end-of-life care by trading sterile, clinical hospital corridors for natural, cozy wooden pavilions. The design focuses heavily on biophilic principles, ensuring that patients and their families are constantly connected to healing gardens and soothing natural light.",
        challenge: "Ensuring medical utilities are highly accessible while keeping the layout looking like a quiet forest retreat.",
        solution: "Separated the facility into smaller house pavilions connected by plants and dynamic sensory gardens. Every room overlooks trees, keeping families beautifully connected to nature.",
        images: [
          "https://lh3.googleusercontent.com/d/1_Gcehq-yN--25n8qKIkSLTGIleQGQqve",
          "https://lh3.googleusercontent.com/d/1wPuVIXSD99yWsCg5AcQxJCC07R3VT3Bi",
          "https://lh3.googleusercontent.com/d/10eT2Y5ITVC2rjeHDXCh-yPD0Af-pk14j",
          "https://lh3.googleusercontent.com/d/12TPa10Mxy8wJ9Da9DOFD48-xJM4t3uiY",
          "https://lh3.googleusercontent.com/d/1KclgbyOUEM5eTVfDpOocFjSuVom3Xr_B",
          "https://lh3.googleusercontent.com/d/1cOskWjIzbsqhV1jlYbwSRFUgCJI14n2U",
          "https://lh3.googleusercontent.com/d/1wGJdJN6ZXf2WK28EafESDcnviVNcKF-p",
          "https://lh3.googleusercontent.com/d/13KSTSMy3wsQBVQJFRsasLFePVawzWjIR",
          "https://lh3.googleusercontent.com/d/1DGOkd7MY8sSAgzt0TzWYzW0ahkriXY7_",
          "https://lh3.googleusercontent.com/d/1L6LOgUmekOk3XJK2rji7DtpdAkReZ8_b",
          "https://lh3.googleusercontent.com/d/1znclz2rFpl0BS2zJfp9w7nrHm2QCgAFk",
          "https://lh3.googleusercontent.com/d/1zfEJf3Tm6qnhkQPXa4saAn0MZTtu_iii",
          "https://lh3.googleusercontent.com/d/1-qHLRSlDroUqLxAvqcYv14LNOM1vulwd",
          "https://lh3.googleusercontent.com/d/1V3yL6NdCiARmGbKN4b80j2h9fRx3gN0M",
          "https://lh3.googleusercontent.com/d/1vk8Blck2gZZrDQDAxt-OEU9oJFQF1IBq",
          "https://lh3.googleusercontent.com/d/1uZE-A0Cy92pzz7gWfdFr5vdeaa7TBMEc",
          "https://lh3.googleusercontent.com/d/1uKUbCflYtDqzWmYiSwtsjbL95Uxfw0q6",
          "https://lh3.googleusercontent.com/d/1La6OD3SJ0vYjtlG8GseC5b6iHqDwtgIW",
          
          "https://lh3.googleusercontent.com/d/1EwxzT95gIriGk_KPSlspFuGd0dxOJQqw",
          "https://lh3.googleusercontent.com/d/1Btke20IAGtI8itws0GujFR2-nvKGDpgs",
          "https://lh3.googleusercontent.com/d/1vtmSPO5cY0bEyPfHB6q-8TK_N-EWR0Bw",
          "https://lh3.googleusercontent.com/d/1M5toemwPLORhUg-EygnGVp5G2zPyYqpH"
        ]
      }
    },
    {
      id: "ARCH_06",
      title: "Recycled Bus Pavilion",
      role: "Design & Build Lead",
      hook: "National Citation for functional adaptive reuse.",
      description: "Award-winning community pavilion crafted from a decommissioned scrap bus and reclaimed materials.",
      icon: <Hammer className="w-6 h-6 text-gray-400" />,
      color: "gray-400",
      metric: "Upcycled",
      gifUrl: "https://lh3.googleusercontent.com/d/1UueeMY09uP6M6tZWtjhFKjzENJhUIpEs",
      tags: ["Fabrication", "Materiality", "On-Site Assembly"],
      category: "Fabrication",
      ledger: {
        inputs: "Scrapped public transit bus, local wood and metal waste logs",
        engine: "Adaptive reuse modeling and hands-on metal welding",
        outputs: "National Design Citation, completed community gathering hub"
      },
      details: {
        overview: "A hands-on, award-winning community design-build initiative focused on functional adaptive reuse. By transforming a decommissioned scrap bus and utilizing locally sourced reclaimed materials, the project proves how discarded urban artifacts can be successfully recycled into vibrant, highly functional public gathering spaces.",
        challenge: "Upcycling a metal bus frame into an open, secure, and lightweight shelter.",
        solution: "Stripped the bus down to its structural chassis, welded supporting steel columns, and installed recycled roof panels to create a bright, airy open-air pavilion.",
        images: [
          "https://lh3.googleusercontent.com/d/1UueeMY09uP6M6tZWtjhFKjzENJhUIpEs",
          "https://lh3.googleusercontent.com/d/1BEgKY95IEr5g9vbVArBGeUGZe8lnuU53#video",
          "https://lh3.googleusercontent.com/d/1KZwCamzNHbMIJW9zjc__BPriQxhLQold#video",
          "https://lh3.googleusercontent.com/d/1XgZsHYRfq3RkWR-FSGAd9tEdbRK2aSAK#video",
          "https://lh3.googleusercontent.com/d/1Nqeb36k13kD_g49etHZ38_or4WD_icIG#video",
          "https://lh3.googleusercontent.com/d/1AsSVINu4uc7BdGmYxWBPvlA0Fed4Z_se#video",
          "https://drive.google.com/thumbnail?id=1RmOX0EQAvEfpyMT2BvwEKyJCvsyrDaiw&sz=w1600#image",
          "https://drive.google.com/thumbnail?id=1c47f6sBJ3JMR6g8IwiECxdT3ZTS01HPO&sz=w1600#image",
          "https://drive.google.com/thumbnail?id=1cnzuWz90XbBcYdk50dSv31Uwh4fT5QYo&sz=w1600#image",
          "https://drive.google.com/thumbnail?id=17VGEDYhfZh7FtjveivJ2fo2aleEOh26s&sz=w1600#image",
          "https://drive.google.com/thumbnail?id=1c0-tHAs0wqzvkj-d1OkutYU9OG-zot5j&sz=w1600#image",
          "https://drive.google.com/thumbnail?id=1gEbLBx6NJpVI2DF4m0dI6nn4FX47SAq3&sz=w1600#image",
          "https://drive.google.com/thumbnail?id=1oqomgOTfwlPTFn0exM3TTItAFF-a1xbi&sz=w1600#image",
          "https://drive.google.com/thumbnail?id=1EMMDNaPpprvKI0BsZs4bBxm-pvKKQtiu&sz=w1600#image"
        ],
        reportUrl: "https://drive.google.com/file/d/1AWBJs4XvGkUiEFGJieSWM8milptVdicH/view?usp=sharing",
        sheetsUrl: "https://drive.google.com/file/d/1t0PizcvO4hwx5g5Uye9kqVQv4B9mGvtR/view?usp=sharing",
        videoUrl: "https://www.youtube.com/watch?v=BOTCKXvGRNY"
      }
    },
    {
      id: "ARCH_07",
      title: "Bamboo Pavilion",
      role: "Fabrication Lead",
      hook: "Exploring parametric joinery in organic materials.",
      description: "A lightweight bamboo pavilion featuring sustainable nodes, assembled in under 48 hours.",
      icon: <Hammer className="w-6 h-6 text-gray-400" />,
      color: "gray-400",
      metric: "Sustainable",
      gifUrl: "https://lh3.googleusercontent.com/d/1h89DNz0NAtQeH_rtLlNxXqN0ZI_9FXuk",
      tags: ["Bamboo", "Parametric Design", "Hands-on"],
      category: "Fabrication",
      ledger: {
        inputs: "Natural bamboo poles, 3D printed steel connector templates",
        engine: "3D simulation and physical structural joint tests",
        outputs: "Fast on-site assembly system, self-supporting natural grid structure"
      },
      details: {
        overview: "An experimental, lightweight screen pavilion designed to bridge the gap between traditional bamboo craftsmanship and modern parametric 3D design workflows. The structure features sustainable, custom-designed structural nodes that allowed the entire architectural installation to be efficiently assembled on-site in under 48 hours.",
        challenge: "Natural bamboo poles have uneven sizes and strengths, making perfectly standardized connectors difficult to design.",
        solution: "Developed a flexible, self-adjusting metal connector system. We prefabricated the units in a workshop and assembled the canopy on-site in 48 hours.",
        images: [
          "https://lh3.googleusercontent.com/d/1Bmav4R81p33aN0dg1aKeX6VBJ9aGkeVY#image",
          "https://lh3.googleusercontent.com/d/1EodFSHDesqz-0X1meS0jtxiG0LEnCoSL#image",
          "https://lh3.googleusercontent.com/d/1D3I9CqpZmVTto_OYqQD2YWHZhzF-KeXO#image",
          "https://drive.google.com/thumbnail?id=1NBbn76DHD2EhFslwUl9ePKT-e5dLQGg2&sz=w1600#image",
          "https://drive.google.com/thumbnail?id=1DNk35mYcu532xHIBGXCkzYuJNmTeypSl&sz=w1600#image",
          "https://drive.google.com/thumbnail?id=1142oZ-CPY8KvshZShnowDzb3M_weMLuA&sz=w1600#image",
          "https://lh3.googleusercontent.com/d/1UJHea_8A_tBCrKK8W0L9PFHvMtC57euo#video",
          "https://lh3.googleusercontent.com/d/1CTH0xsGyd1tFl__3V7rZDWXjmv7qmJVY#video",
          "https://lh3.googleusercontent.com/d/14V_8GGVsARfhPVS8es_QddTrvQBCxifw#video",
          "https://lh3.googleusercontent.com/d/1PJ5Fki5jFwaJOIjAmFjBmaXKXW3iXtsp#video",
          "https://lh3.googleusercontent.com/d/1jgjEnmP-41gyoudomhwtHAgpY9v36V5m#video",
          "https://lh3.googleusercontent.com/d/1w_oKE_o4wsF2vz-R4VoCb8yIWcZDEQst#video",
          "https://lh3.googleusercontent.com/d/12OIBjZ9IUXwNKrr47oZms-cRkXu8bH0G#video",
          "https://lh3.googleusercontent.com/d/17bRW4JZ7LvQ6JgA0VvGYBhm4oUe-k256#video",
          "https://lh3.googleusercontent.com/d/1a08B1mG9J6AyX_5kN00pree_QeFeMHo6#video",
          
          "https://lh3.googleusercontent.com/d/1h89DNz0NAtQeH_rtLlNxXqN0ZI_9FXuk#video"
        ]
      }
    },
    {
      id: "ARCH_09",
      title: "Aura One office - Academic",
      role: "Lead Student Architect",
      hook: "High-performance ecological commercial tower with a self-shading double skin.",
      description: "An academic thesis proposing a high-performance, premium office tower centered on ecological worker wellness. Rejecting standard monolithic glass, the design features a computational dynamic kinetic facade paired with stacked, open-air green pocket terraces to actively mitigate solar heat gain and eliminate interior glare.",
      icon: <Layers className="w-6 h-6 text-gray-400" />,
      color: "gray-400",
      metric: "Academic Core",
      gifUrl: "https://lh3.googleusercontent.com/d/1-13UZk0cblRjpTkrX_fwUGymHhEtcTYW",
      tags: ["Grasshopper", "Ladybug Analysis", "Dynamic Kinetic Facade", "Parametric Optimization", "Commercial Architecture"],
      category: "Exterior",
      ledger: {
        inputs: "Office spatial requirements, Mangaluru yearly climate records",
        engine: "3D shading simulation and daylight quality calculation tools",
        outputs: "Sensor-responsive dynamic kinetic facade panels, optimized sky-gardens, and glare reduction metrics."
      },
      workflow: {
        screenshotUrl: "https://lh3.googleusercontent.com/d/1hG1dISPuq8c91Xk-BLArl32al89adqXa",
        steps: [
          "Establish column spacing grids and workspaces for modern offices.",
          "Write simple scripts to align glass shade angles with yearly sun paths.",
          "Run simulations to check natural interior daylight and glare levels.",
          "Draft structural details showing how the double glass panel system mounts."
        ]
      },
      details: {
        overview: "An academic thesis proposing a high-performance, premium office tower centered on ecological worker wellness. Rejecting standard monolithic glass, the design features a computational dynamic kinetic facade paired with stacked, open-air green pocket terraces to actively mitigate solar heat gain and eliminate interior glare.",
        challenge: "Mitigating intense tropical solar radiation and glare without resorting to permanently tinted glass or static shading devices that block natural light and exterior views.",
        solution: "Developed a sensor-responsive, dynamic facade powered by parametric Grasshopper algorithms and Ladybug environmental simulations. The kinetic louvers dynamically adjust their tilt relative to live solar angles, protecting workspace interiors from harsh glare while reducing overall cooling loads by 24%.",
        images: [
          "https://lh3.googleusercontent.com/d/1J8LFl6eA-Y2cUSSrwCO1Gqom_ABPS9yL",
          "https://lh3.googleusercontent.com/d/1_PI1qIU5K80hSqPvxvmVok-Je7HtJ0BK",
          "https://lh3.googleusercontent.com/d/1qe771x3P1_-J9rPqr6EKyKIO8Sn10h_U",
          "https://lh3.googleusercontent.com/d/1zqzgQq6FCJ9REyhh3JqsZN9-gaBD6tIp",
          "https://lh3.googleusercontent.com/d/1_t21ROExAPN-LgzrucRXE4X7Kej7M213",
          "https://lh3.googleusercontent.com/d/19fTGQagul-Bh_0TclKU-BOSVlaTtgTfw",
          "https://lh3.googleusercontent.com/d/1581Brz6nZrc053tWYmMUtbHiu-UUJa2n",
          "https://lh3.googleusercontent.com/d/1mwr6jAV-xBsp8xb0HmL2vX4Z1_4egzcp",
          "https://lh3.googleusercontent.com/d/1kqP--ijCQry4owJqse1-e2Xbse6Pbs24",
          "https://lh3.googleusercontent.com/d/1hG1dISPuq8c91Xk-BLArl32al89adqXa",
          "https://lh3.googleusercontent.com/d/1fEyhMZY41Wuyc4_9yPdsWdQC4R07lfHe#video",
          "https://lh3.googleusercontent.com/d/1R8NTkmalwYDmrUqX43hW-8un9nkDYD6G",
          "https://lh3.googleusercontent.com/d/1M5E67OFU8072ZB8nEW93bxNv4H2n7AKP",
          "https://lh3.googleusercontent.com/d/1gE8L7uXdB4AdOLcaOlPSp67XqDR3Y-CE",
          "https://lh3.googleusercontent.com/d/1idP_OHCVF7PUxrscYPqms53g3COkbyQM",
          "https://lh3.googleusercontent.com/d/1VYpZ0k2exBkERJotymz3BkTsPfKneVwe",
          "https://lh3.googleusercontent.com/d/1a1yxLTXN2c_h8cikVHPFW_4B8tqREk9d",
          "https://lh3.googleusercontent.com/d/1aSDa36ogz5AIxmFFNso7mKOnHOjlED8U",
          "https://lh3.googleusercontent.com/d/1s4YrypXR0ECMfMbqkYBbK6BJCh0hcevg",
          "https://lh3.googleusercontent.com/d/1JrQCaLKYu6gz-jx97bkCBN9IT66Iqz7t",
          "https://lh3.googleusercontent.com/d/1w4xMU7JuhLuiDK87oJ6wRgdjWrClJaRg",
          "https://lh3.googleusercontent.com/d/1GKGxoVfMSALH9uVTptNtIMokcmbNBzQu",
          "https://lh3.googleusercontent.com/d/1TBeTL0ZMJSw8pJHZPyKCABrVBFtksAVp",
          "https://lh3.googleusercontent.com/d/1KZczMWj_PuuDu75q6pksqJePr41OHGtz",
          "https://lh3.googleusercontent.com/d/1uGbrj_Lno6yqSiJrI-jtnIJL2kPkzvDc"
        ]
      }
    },
    {
      id: "ARCH_04",
      title: "The Caffeine Lab",
      role: "Interior Designer",
      hook: "A sensory experience defined by materiality and light.",
      description: "Modern brick-and-wood coffee house interior focused on tactile warmth and natural skylighting.",
      icon: <Cpu className="w-6 h-6 text-gray-400" />,
      color: "gray-400",
      metric: "Atmospheric",
      gifUrl: "https://lh3.googleusercontent.com/d/1Ub86NTdcIwZLE58Cy0Ev5Zy1hYTF--ne",
      tags: ["Interior Design", "Materiality", "Lighting Design", "Professional Experience", "Freelance"],
      category: "Interior",
      ledger: {
        inputs: "Raw concrete shop bounds, barista brewing layout needs",
        engine: "Strategic point lighting and raw wood textures",
        outputs: "Completed coffee house environment, precise material spec sheets"
      },
      details: {
        overview: "A boutique interior architecture project for a modern coffee house, designed to serve as an inviting urban hub bridging the gap between home and the workplace. The design emphasizes tactile warmth through a sophisticated palette of exposed brick and natural wood, dramatically enhanced by strategic skylighting and shadow play.",
        challenge: "Welcoming customers into a narrow commercial slot with limited front windows.",
        solution: "Installed deep skylights and mirror angles to pool natural sunlight. Used exposed bricks, restored wood, and brass accents to make the environment cozy.",
        images: [
          "https://lh3.googleusercontent.com/d/18Rc73l485-6jt6jQ-mz3lmv8lhe_uX3G",
          "https://lh3.googleusercontent.com/d/1wJxO8h7b4A6IzYVI8EEb5jJXyeIZgucl",
          "https://lh3.googleusercontent.com/d/1E-dMneOtLIUghE4uBpNibLrO6X3VYWfE",
          "https://lh3.googleusercontent.com/d/1Ub86NTdcIwZLE58Cy0Ev5Zy1hYTF--ne",
          "https://lh3.googleusercontent.com/d/10y2165C4vd8zanDADmq0-G2_QGnSjcQV",
          "https://lh3.googleusercontent.com/d/1wfnsQ87DBOiZwghYvPcCcq7GGzmu5Itr",
          "https://lh3.googleusercontent.com/d/1Iw_O4cMCPSFnQERK25agt88qj8jySHcb",
          "https://lh3.googleusercontent.com/d/1tmAzBTbdJ5bV7EK-kZcv7fJXfjfxqZy5",
          "https://lh3.googleusercontent.com/d/1EDB2yaMs74pxZ15dvY3DSqRv0ZcabRxU",
          "https://lh3.googleusercontent.com/d/1rTdEEaAGJgyhweJcCYPDhf-VH3UzPJbu"
        ]
      }
    }
  ];

  const bimArsenal: ArsenalItem[] = [
    {
      id: "BIM_08",
      title: "Agent-Based Space Planning & Structural Solver",
      domain: "GENERATIVE LOGIC // PYRHINO & GEOMETRY API",
      intel: "Self-resolving architectural space adjacencies using localized vector repulsion and structural grid matching.",
      icon: <Cpu className="w-6 h-6 text-neon-blue" />,
      color: "neon-blue",
      metric: "Agentic AI",
      gifUrl: "https://lh3.googleusercontent.com/d/1b3a1AWoEjz9P2K3TuKbwL8vXT3rAlGjW",
      tags: ["Python", "Agent-Based Modeling", "Rhino 8", "Physics Simulation", "Generative Design"],
      ledger: {
        inputs: "Irregular site boundaries, room lists, adjacency matrices, terrain mesh",
        engine: "Rhino CPython 3 physics solver with multi-objective agent steerage",
        outputs: "Grid-snapped rooms, spanning corridors, structural beam lattice, JSON BIM export"
      },
      workflow: {
        screenshotUrl: "https://picsum.photos/seed/workflow-agent-2/800/450?grayscale",
        steps: [
          "Initialize spaces as physical agents governed by adjacency attraction and repulsion forces.",
          "Apply environmental steering, damping reentrant corner trapping on concave boundaries.",
          "Calculate circumscribed collision physics and snap centroids to structural sub-grids.",
          "Stack levels dynamically, insert structural cores, and generate Minimum Spanning Tree corridors.",
          "Export a structured JSON schema of rooms, beams, and columns directly into Revit via Dynamo."
        ]
      },
      details: {
        videoUrl: "https://drive.google.com/file/d/1Va-mCgkDqe9AiYcGr8YBxvUyJhi_dwi2/view?usp=sharing",
        overview: "An experimental generative design engine that revolutionizes early-stage architectural programming by treating programmatic spaces as intelligent, physical agents. Operating as a dynamic physics simulation rather than a manual drafting task, it leverages multi-objective vectors to automatically resolve complex adjacency requirements, structural grids, and multi-storey stacking within highly constrained, non-convex site boundaries.",
        challenge: "Geometric assumptions break on real-world lots: concavity traps agents, equivalent-area circular proxies fail for rectangular rooms, and unguided view-seeking forces pull rooms into narrow site pinch-points.",
        solution: "Engineered local geometry probing to cull reflex vertices, implemented circumscribed half-diagonal collisions with grid-snapping, and mapped structural/corridor networks using Prim's algorithm for robust multi-storey generation.",
        images: [
          "https://lh3.googleusercontent.com/d/15PC8VWAy4JFodE0-KTaP30Ia9E1eTuYq",
          "https://lh3.googleusercontent.com/d/1B7h-ILSYXZPvks0bRpi5gNrx4P4bDqAF",
          "https://lh3.googleusercontent.com/d/1DtpG-KYGPcAip9_ur36zRRCqGrizYzIz",
          "https://lh3.googleusercontent.com/d/1GiDevLRVc7XvQ4fM069fYI0Qnhn1fxTQ",
          
          
          
          
          
          "https://lh3.googleusercontent.com/d/1tD9Mn4t6fnxL_HhmlBBH8IUka-og-RJE",
          "https://lh3.googleusercontent.com/d/1Tr8vZlSXrsEa7LiN4-Y3DNvBFq_n-hxY",
          "https://lh3.googleusercontent.com/d/1vSOTIYB045RMebKu-dYVgODfRVHDBD4s"
        ]
      }
    },
    {
      id: "BIM_10",
      title: "Morpho-Performance | Generative Masterplanning Engine",
      domain: "COMPUTATIONAL RESEARCH // PYTHON, GRASSHOPPER & WALLACEI",
      intel: "Engineered a multi-objective evolutionary optimization engine using Python, Grasshopper, and Wallacei to evaluate 99 urban configurations across 9 generations—extracting the optimal Pareto front balancing solar exposure against FAR/density.",
      role: "COMPUTATIONAL RESEARCH // PYTHON, GRASSHOPPER & WALLACEI",
      problem: "Masterplanners often make early massing decisions based on intuition, locking in a neighborhood's energy performance and density limits without quantitative analysis.",
      solution: "Engineered a multi-objective evolutionary optimization engine using Python, Grasshopper, and Wallacei to evaluate 99 urban configurations across 9 generations—extracting the optimal Pareto front balancing solar exposure against FAR/density.",
      icon: <Layers className="w-6 h-6 text-neon-purple" />,
      color: "neon-purple",
      metric: "Generative",
      gifUrl: "https://lh3.googleusercontent.com/d/1Kw93jB1df5JVmr6SKjNQLP5ZoHnV1pzw#video",
      tags: ["Python", "Grasshopper", "Wallacei", "Cyclops Tools", "Revit Interop"],
      ledger: {
        inputs: "Urban site boundary polygons, target FAR/density constraints, solar vectors/epw solar parameters.",
        engine: "Grasshopper, Python, Cyclops Multi-Objective Evolutionary Solver.",
        outputs: "Pareto-optimal 3D massing geometry, solar exposure score matrix, direct Revit/Vectorworks BIM geometry export."
      },
      workflow: {
        screenshotUrl: "https://picsum.photos/seed/workflow-masterplan/800/450?grayscale",
        steps: [
          "Define dynamic building footprint, height, and setback variables as genes within Grasshopper.",
          "Calculate solar exposure vector scores alongside real-time FAR/volume indices in parallel using custom Python and Grasshopper logic.",
          "Run the Cyclops evolutionary engine across 9 generations to map the trade-off Pareto front.",
          "Extract the winning Pareto-optimal massing state directly into native Revit and Vectorworks geometry containers."
        ]
      },
      details: {
        images: [
          "https://lh3.googleusercontent.com/d/1XQ54NM5a801h0RrDCpUEBGYNkuXd0VdN",
          "https://lh3.googleusercontent.com/d/1hp0NV0r48IdvUdXpO4qNepric6MzXK2a",
          "https://lh3.googleusercontent.com/d/1OpG-luSajdW_lODfTcnm1gxynjCDB2kH",
          "https://lh3.googleusercontent.com/d/1Za7I3xjTrkEFyotAlMvGYeU75aaUS9Qb",
          "https://lh3.googleusercontent.com/d/1J_7DIfI41wqagxnPkM2LMqsq6kjy3b4t",
          "https://lh3.googleusercontent.com/d/1rXtskRHI0_t2NSokSWPVnX2NSyT2ywVa",
          "https://lh3.googleusercontent.com/d/132HIqxOov5auLlab8dpe3mfbEv-ucUrR",
          "https://lh3.googleusercontent.com/d/17gMWOD6far_NoGobHOm6FCzr2WCytTgP"
        ],
        videoUrl: "https://drive.google.com/file/d/1xF7X47XL1Im3vkymiHef56dotjYGV-Ub/view?usp=sharing",

        overview: "A multi-objective generative masterplanning engine designed to eliminate intuition-based early-stage massing decisions. By framing urban massing as a computational optimization problem, the system balances two fundamentally competing performance metrics—maximizing total solar radiation across facades while simultaneously maximizing floor area ratio (FAR)—to discover mathematically optimal urban forms.",
        challenge: "In conventional masterplanning, massing decisions made during initial design phases permanently lock in a neighborhood's microclimate, daylight potential, and operational energy performance for decades. Furthermore, daylight performance and urban density inherently conflict: maximizing FAR usually creates mutual shading, while maximizing solar exposure flattens density.",
        solution: "Configured an evolutionary optimization workflow using Python, Grasshopper, and the Cyclops solver to evaluate 99 urban configurations across 9 generations. By executing a Pareto front search, the system identified the optimal trade-off solution (Generation 9, Individual 5), achieving a balanced Solar Exposure Score of 296,956 alongside a high-density FAR of 9.1, complete with direct interoperability to downstream BIM environments (Revit and Vectorworks)."
      }
    },
    {
      id: "BIM_07",
      title: "The Multi-Objective Eco-Parametric Solver",
      domain: "ENVIRONMENTAL SIMULATION // EVOLUTIONARY SOLVERS",
      intel: "Benchmarking genetic algorithms (Galapagos vs. Wallacei) to automate complex solar shading geometry.",
      icon: <ShieldCheck className="w-6 h-6 text-neon-blue" />,
      color: "neon-blue",
      metric: "Comparative",
      gifUrl: "https://lh3.googleusercontent.com/d/1MrB6VdmorBcdtuSIq1eLdV1FTylWXOyN",
      tags: ["Galapagos", "Wallacei", "Ladybug", "Grasshopper", "Multi-Objective", "Pareto Front"],
      ledger: {
        inputs: "3D window curves, regional weather data files",
        engine: "Single-goal fitness solver, multi-target evolutionary calculator",
        outputs: "Interactive balance graph, optimal shade designs"
      },
      workflow: {
        screenshotUrl: "https://lh3.googleusercontent.com/d/1MrB6VdmorBcdtuSIq1eLdV1FTylWXOyN",
        steps: [
          "Model basic shade shapes and configure weather data paths.",
          "Run single-goal search loop to find the single lightest shade.",
          "Run multi-goal balance loop evaluating weight, cost, and sun blocking.",
          "Compare options on a dynamic chart to choose the best overall balance."
        ]
      },
      details: {
        overview: "A rigorous computational research study contrasting simple automated design algorithms (Galapagos) against complex, multi-objective genetic solvers (Wallacei). The study focused on optimizing high-performance solar window shades, ultimately establishing a parallel solving methodology that successfully reduced structural weight while maximizing interior sun protection.",
        challenge: "Simple search tools often force you to combine random targets (like price and weight) into a single, confusing score, which hides smart options.",
        solution: "Set up a parallel multi-goal solver that tested and output a menu of 30+ balanced shade models. This reduced structural weight by 18% while keeping interiors beautifully shaded.",
        images: [
          "https://lh3.googleusercontent.com/d/1mgPjVlBewtASBfKFyV7X_FBv8g7OX1-2#render",
          "https://lh3.googleusercontent.com/d/1c4AkPuVu4ExF-Cl4TjvjmTZN7PTVFWi6#render",
          "https://lh3.googleusercontent.com/d/1imbn5IFvIz1OCsZxDdYXjRMDEw0UFmSk#render",
          "https://lh3.googleusercontent.com/d/1bre_RmRkdlnRIW9WkSAPH3fEY_IvrcbG#render",
          "https://lh3.googleusercontent.com/d/1LDX9tMnC_NsYZP_SEYYWxYKxkvV-FGe1#drawing",
          
          "https://lh3.googleusercontent.com/d/1l7G5k7xURcKj4y7yRy9hL0TBSc0C8uNW#drawing",
          "https://lh3.googleusercontent.com/d/1eZOhpIrBn_S7CJ2Gad8nb33Z3nXngbip#drawing"
        ],
        videoUrl: "https://drive.google.com/file/d/1UCf5m6QoSRNmMOqwPUVvYqjNRzg7rIJG/view?usp=sharing",
        reportUrl: "https://drive.google.com/file/d/1A--_4MoByx_xFHQw_vwLqknOPNOUbI_i/view?usp=sharing",
        reportLabel: "Using Wallacei over Galapagos",
        comparisonTable: {
          headers: ["Feature", "Galapagos (Single Goal)", "Wallacei (Multi Goal)"],
          rows: [
            ["Search Goal", "Solves for one simple combined number (e.g., Shading x 0.7 - Weight x 0.3)", "Tracks multiple goals independently (Shading, cost, and weight)"],
            ["Search Speed", "7-12 passes (Fast but misses creative options)", "40-60 passes (Uncovers a wider variety of balanced fits)"],
            ["Steel Weight", "Heavy; makes sacrifices on support shapes to meet the single score", "Balanced; matches individual loads for light, safe configurations"],
            ["Final Choice", "Outputs a single rigid style as the 'winner'", "Presents a cloud of 30+ balanced designs for you to pick from"],
            ["Stakeholder Value", "Provides limited variety; hard to contrast trade-offs", "Provides clear balance charts to explain choice parameters simply"]
          ]
        }
      }
    },
    {
      id: "BIM_01",
      title: "The LLM Fabrication Engine",
      domain: "AI INTEGRATION // PYTHON & CNC RUNTIMES",
      intel: "Headless web API bridge linking Gemini models to automatically generate clean fabrication cut sheets from raw text prompts.",
      icon: <Cpu className="w-6 h-6 text-neon-cyan" />,
      color: "neon-cyan",
      metric: "Generative API",
      gifUrl: "https://lh3.googleusercontent.com/d/11sFI5d1bszNSdrgzSsTwC6NF1POaMzv1",
      tags: ["Python API", "Grasshopper", "Digital Fabrication", "JSON"],
      ledger: {
        inputs: "3D CAD curves, Gemini chatbot session",
        engine: "Python scripts and 3D modeling curves",
        outputs: "Optimized building panel shapes, 2D laser-cut patterns"
      },
      workflow: {
        screenshotUrl: "https://picsum.photos/seed/workflow-llm/800/450?grayscale",
        steps: [
          "Connect the 3D design workspace to the Gemini API.",
          "Receive panel sizes and spacing directly from AI chat logic.",
          "Apply the dimensions to complex curved surfaces.",
          "Flatten the 3D surfaces into ready-to-run 2D layouts."
        ]
      },
      details: {
        overview: "A cutting-edge digital fabrication workflow that establishes a direct API bridge connecting Gemini live language models with CNC and laser machinery. This pipeline translates natural language text requests directly into precise, physical architectural components, automatically unfolding and nesting the generated 3D surfaces into ready-to-cut 2D flat sheets.",
        challenge: "Getting clean, precise, and buildable machine parts from unpredictable AI chat answers.",
        solution: "Wrote custom Python parser scripts that force the AI model to output verified numbers. The script then builds, rotates, and flattens the pieces perfectly.",
        images: [
          "https://lh3.googleusercontent.com/d/1U50XtgxeuNMeUKTCtTcUIjKMBy06z7Cw",
          "https://lh3.googleusercontent.com/d/12OMyHxHu87uIA87fmB3QJI-tMzHIi-yP",
          "https://lh3.googleusercontent.com/d/1OcgT2rCg6SVvVPYAgdgDyYfOwD2FybaL",
          "https://lh3.googleusercontent.com/d/1IUveGylPhmxyzS9J_zx8uIraB55FaoF2",
          "https://lh3.googleusercontent.com/d/1dyxHja4d3dCKcpRFqSjX2eCH8K4ETuqW",
          "https://lh3.googleusercontent.com/d/13DjBQVbIlicd12rixmddFV8VlEfY8nHy",
          "https://lh3.googleusercontent.com/d/16ElVn3XPrb32whEeHODV-F-qKOKaHDKG",
          "https://lh3.googleusercontent.com/d/1qVkvKXWhYvBXgHevFDyVhxJJ4YUvt28t"
        ],
        videoUrl: "https://drive.google.com/file/d/1fDtI938u2nmjRT0IjXtdQlvTGsM5LdAS/view?usp=sharing"
      }
    },
    {
      id: "BIM_09",
      title: "Rhino-to-Revit API Interoperability Pipeline",
      role: "WORKFLOW AUTOMATION & COMPUTATIONAL RESEARCH",
      problem: "Traditional IFC/geometry exchanges cause major data degradation and layout latency between teams.",
      solution: "Built a custom Python data bridge to serialize high-fidelity topological coordinates out of Rhino and compile them directly through the native Revit API.",
      icon: <Cpu className="w-6 h-6 text-neon-orange" />,
      color: "neon-orange",
      metric: "LOD 400 TOPOLOGY COMPILATION",
      gifUrl: "https://lh3.googleusercontent.com/d/1gApYb78g5bpNXO0OLes5ymrUk9mEV1i8",
      tags: ["Grasshopper 3D", "Revit API", "JSON", "Python"],
      ledger: {
        inputs: "Rhino 3DM NURBS, JSON Topology maps",
        engine: "Revit API, Dynamo Node Compiler, Raven AI API Serialization",
        outputs: "LOD 400 Revit Conceptual Massing, Parameter-Synced Direct Shapes"
      },
      workflow: {
        screenshotUrl: "https://lh3.googleusercontent.com/d/1gApYb78g5bpNXO0OLes5ymrUk9mEV1i8",
        steps: [
          "Generate a complex spaceframe structure using a Voronoi algorithm in Rhino 3D.",
          "Extract mathematical and topological coordinates, bypassing heavy geometric file exports.",
          "Package the coordinate matrices into a lightweight serialized JSON payload.",
          "Listen to the API payload within Revit, redrawing native LOD 400 elements instantly."
        ]
      },
      details: {
        overview: "A highly specialized data-bridge solution addressing a critical AEC industry bottleneck: the persistent loss of parametric data integrity when migrating complex geometries from Rhino into Revit. By streaming lightweight, serialized topological coordinate matrices, this automated tool instantly redraws thousands of fully editable, native LOD 400 direct-shape elements without relying on heavy, broken meshes.",
        challenge: "Converting complex shapes typically results in heavy, broken 'dead' meshes or un-editable 3D blocks that cannot be annotated or scheduled.",
        solution: "Instead of converting full meshes, this script sends raw topological data. A custom Revit API listener reads these coordinate points and compiles 5,000 fully editable, native LOD 400 direct-shape elements in 45 seconds.",
        images: [
          "https://lh3.googleusercontent.com/d/1ySj-S4Cu5uqlWjv6UhVHQXj67Q9Cp7zI",
          "https://lh3.googleusercontent.com/d/1sPPimcIWeztPLW6ClSUCM3XRLvQ_ZEY_",
          "https://lh3.googleusercontent.com/d/1UuKn3FCJ0VMBINEO5lnmmAnt66mHlG5H",
          "https://lh3.googleusercontent.com/d/1IEq87jiytcp-kmovxKTB06Mx0MgIeej2",
          "https://lh3.googleusercontent.com/d/19NIG86AOjoITlBvUJ6MauwYXAbpCf3Hs",
          "https://lh3.googleusercontent.com/d/17hced_pgHNJQoYY1fGrdpY1btoQyBIMO",
          "https://lh3.googleusercontent.com/d/1RQGFTa_pYMWC32QYx1uTJdFHZajkzgld",
          "https://lh3.googleusercontent.com/d/1BbpHEAEukpRAOjkjetrVYiH74h2f5p6x",
          "https://lh3.googleusercontent.com/d/1fE6fOeTeXnLfYv_FcF-V42KX3MYVH0Zq",
          "https://lh3.googleusercontent.com/d/1KwFfnUiN1-mXyk2aLf3IuscjpmUzHY2k",
          "https://lh3.googleusercontent.com/d/1bAsk7xTDzf3u3tUyAPMfvibnHxuCc8mV",
          "https://lh3.googleusercontent.com/d/1dNSoBn_mPFNXdPjBtReXrptMrMCyaNT7",
          "https://lh3.googleusercontent.com/d/16LSgJrKuY8L6ckAAv2D4MDEKfhT9PgE6",
          "https://lh3.googleusercontent.com/d/10kH71GxRRO92OOBFbNj3k2SA9fhePPfx"
        ],
        comparisonTable: {
          headers: ["Metric", "Traditional Workflow", "Automated API Pipeline"],
          rows: [
            ["Translation Time", "~3 Weeks (Manual modeling/clunky mesh cleanup)", "45 Seconds"],
            ["Geometry Quality", "'Dead' static meshes, loss of metadata", "100% Native BIM Elements"],
            ["Downstream Utility", "Poor; requires manual scheduling and reconstruction", "Automated CNC Cut-List & Ready"]
          ]
        }
      }
    },
    {
      id: "BIM_02",
      title: "The Generative Documentation Engine",
      role: "BIM AUTOMATION LEAD",
      problem: "Manual creation and formatting of documentation sheets in Revit consumes massive amounts of unbillable production hours.",
      solution: "Engineered a Python/Dynamo pipeline that bypasses the Revit UI, reading directly from Excel to generate, format, and place views on hundreds of sheets instantly.",
      icon: <Code2 className="w-6 h-6 text-neon-cyan" />,
      color: "neon-cyan",
      metric: "FIRM-WIDE SCALE",
      content: <CodeSnippet />,
      gifUrl: "https://lh3.googleusercontent.com/d/1SHXNrFYWzgw8f6hMYNzF4I9BQfdF5Xor",
      tags: ["Revit API", "Dynamo", "Python", "Excel"],
      ledger: {
        inputs: "3D Revit building models, Excel sheet list schedule",
        engine: "Revit MCP and Python document scripts",
        outputs: "Completed, labeled blueprint rolls, PDF/DWG files"
      },
      workflow: {
        screenshotUrl: "https://picsum.photos/seed/workflow-1/800/450?grayscale",
        steps: [
          "Select the building sections and title pages to bundle.",
          "Run the layout spacing and image scaling script.",
          "Sync file names, project titles, and issue dates automatically.",
          "Export organized blueprints to standard formats."
        ]
      },
      details: {
        overview: "A robust business automation utility that drastically accelerates architectural documentation. By reading structured spreadsheet data, this Dynamo-powered script instantly generates hundreds of fully formatted, client-ready blueprints and drawing sheets in Revit, effectively eliminating weeks of manual drafting and mitigating human error.",
        challenge: "Creating thousands of drawing views and sheet lists manually consumes entire work weeks and breeds typos.",
        solution: "Coded a Dynamo scripting tool which reads spreadsheet lists and maps them straight into Revit, handling scaling and label alignment in seconds.",
        videoUrl: "https://drive.google.com/file/d/1qFTWKJWqE4zKuuKalI5X7WSVZlWd4bUl/view?usp=sharing"
      }
    },
    {
      id: "BIM_03",
      title: "The 5D Data Harvester",
      role: "VDC DATA ENGINEER",
      problem: "Extracting exact facility parameters and material quantities manually is error-prone and labor-intensive.",
      solution: "Developed a Dynamo script that scrubs massive Revit models to extract and format precise material quantities directly into analytical Excel logs.",
      icon: <Database className="w-6 h-6 text-neon-orange" />,
      color: "neon-orange",
      metric: "100% ACCURACY",
      content: <DataTable />,
      gifUrl: "https://lh3.googleusercontent.com/d/1o1McRNTDM1fwtEzORfJEz21-9udMX1CN",
      tags: ["Dynamo", "Excel", "Data Extraction"],
      ledger: {
        inputs: "Combined architectural and plumbing BIM models",
        engine: "Dynamo data harvesting scripts",
        outputs: "Formatted build spreadsheets, parameter checklist tables"
      },
      workflow: {
        screenshotUrl: "https://picsum.photos/seed/workflow-2/800/450?grayscale",
        steps: [
          "Scan the entire building database for empty attributes.",
          "Clean up wrong label formats using text search patterns.",
          "Compare elements against standard price lists.",
          "Export verified cost spreadsheets to the system."
        ]
      },
      details: {
        overview: "An automated 5D BIM data-mining solution designed to extract exact material volumes, component counts, and catalog items directly from complex 3D building geometries. This Python-driven script actively scans the model's background database to compile structured, error-free Excel budget logs for highly accurate cost estimations.",
        challenge: "Manually counting thousands of doors, pipes, and beams from 3D models typically leaves crucial items behind.",
        solution: "Created Python data miners that scan the model's background catalog and write clean, structured checklists into excel for accurate cost estimates.",
        videoUrl: "https://drive.google.com/file/d/1AiHanx4MA9nFEWaQotQpyHroxkHZcOuo/view?usp=sharing"
      }
    },
    {
      id: "BIM_05",
      title: "Spatial Centroid Component Automator",
      domain: "BIM PRODUCTION // VECTORWORKS MARIONETTE",
      intel: "An automated Vectorworks Marionette script designed to instantly locate space boundaries and place a designated BIM component at the exact centroid of every room across the model.",
      icon: <Cpu className="w-6 h-6 text-neon-orange" />,
      color: "neon-orange",
      metric: "Automation",
      gifUrl: "https://lh3.googleusercontent.com/d/1dR5ajQdvGdR3YJOvScsAu_uteRfCiuVt",
      tags: ["Vectorworks", "Marionette", "BIM Model"],
      ledger: {
        inputs: "Vectorworks Space/Room Objects, Selected BIM Symbol (e.g., Light Fixture, Smoke Detector, Ceiling Diffuser)",
        engine: "Vectorworks Marionette Visual Scripting",
        outputs: "Centroid-aligned BIM symbols instanced dynamically across all room objects"
      },
      workflow: {
        screenshotUrl: "https://picsum.photos/seed/workflow-5/800/450?grayscale",
        steps: [
          "Select the target component/symbol and define active room layers or space criteria.",
          "Run the Marionette script to parse room boundaries and calculate spatial centroids.",
          "Automatically instantiate and center the selected symbol across all rooms.",
          "Verify component counts and coordinate placement across the BIM model."
        ]
      },
      details: {
        overview: "An automated Vectorworks Marionette script designed to instantly locate space boundaries and place a designated BIM component at the exact centroid of every room across the model.",
        challenge: "Manually locating room centers, referencing space boundaries, and placing repetitive ceiling or floor components (e.g., light fixtures, smoke detectors, supply diffusers, furniture) across large floor plans is tedious and prone to human error.",
        solution: "Developed a custom visual programming workflow in Vectorworks Marionette that extracts room polygon data, calculates each space's geometric center, and automatically instantiates and aligns the chosen symbol into every room instantly.",
        videoUrl: "https://drive.google.com/file/d/10JAIqWYDsFVJFuBhUsFo730E31IfPLFe/view?usp=sharing"
      }
    },
    {
      id: "BIM_04",
      title: "The Clash Matrix Pipeline",
      role: "BIM COORDINATOR",
      problem: "Raw clash detection across multi-disciplinary models generates thousands of non-actionable errors, overwhelming trade engineers.",
      solution: "Architected a multi-layered clash matrix that groups conflicts by trade and tolerance, routing only high-priority issues to leads.",
      icon: <Activity className="w-6 h-6 text-neon-cyan" />,
      color: "neon-cyan",
      metric: "ZERO ERRORS",
      gifUrl: "https://lh3.googleusercontent.com/d/1G_5-CuXFQuIf9mft1d6CauX29EmntKOE",
      tags: ["Navisworks", "Revit", "Clash Detection"],
      ledger: {
        inputs: "Multi-disciplinary federated models (Structural steel/concrete, MEP trade models), custom search sets, clash matrix rule sets",
        engine: "Navisworks Manage Clash Detective & XML Search Set Automation",
        outputs: "Filtered clash groups, prioritized coordination matrix logs, trade-specific HTML/BCF clash reports"
      },
      workflow: {
        screenshotUrl: "https://picsum.photos/seed/workflow-4/800/450?grayscale",
        steps: [
          "Import structural, architectural, and MEP NWD/NWC models into a unified CDE coordination space.",
          "Apply predefined search sets and clash rules to isolate specific trade intersections (e.g., Structure vs. HVAC).",
          "Run automated clash tests using strict clearance tolerances, automatically grouping micro-clashes by level and grid sector.",
          "Generate actionable BCF/HTML coordination reports with assigned responsibility tags for trade resolution meetings."
        ]
      },
      details: {
        overview: "A structured virtual design and construction (VDC) coordination pipeline engineered to manage and resolve multi-disciplinary geometric hard and soft clashes across federated models. By establishing automated search sets and a structured clash matrix in Navisworks Manage, the workflow replaces chaotic raw collision detection with a streamlined, noise-free coordination hierarchy.",
        challenge: "Unfiltered collision detection across complex structural and MEP models generates thousands of raw clash alerts—most of which are minor clearance noise, modeling overlaps, or non-actionable errors that overwhelm trade engineers and stall project coordination.",
        solution: "Architected a multi-layered clash matrix and rule-based filtering system. By grouping clashes by trade, zone, and element tolerance (e.g., clearance around ductwork vs. major structural steel penetrations), the pipeline filters out background noise and routes high-priority constructability issues directly to responsible trade leads.",
        reportUrl: "https://drive.google.com/file/d/1LetvlyhbGmUM-43bKoJR2OVGJQCNutWJ/view?usp=sharing",
        videoUrl: "https://drive.google.com/file/d/18k015r2LpCsmPb_POW3cQBtCoSXsIQ27/view?usp=sharing"
      }
    },
    {
      id: "BIM_06",
      title: "The 4D Matrix (TimeLiner)",
      role: "SIMULATION LEAD",
      problem: "Detecting spatial bottlenecks and trade congestion is nearly impossible using flat spreadsheets and static 2D phasing drawings.",
      solution: "Engineered a 4D parameter-mapping pipeline linking MS Project tasks to 3D geometry for dynamic, time-linked site simulation.",
      icon: <ShieldCheck className="w-6 h-6 text-neon-blue" />,
      color: "neon-blue",
      metric: "4D SIMULATION",
      gifUrl: "https://lh3.googleusercontent.com/d/1qpMsNkw8HaPhf97qubs7GEV1BkZKsydz",
      tags: ["Navisworks", "TimeLiner", "MS Project"],
      ledger: {
        inputs: "Multi-disciplinary federated 3D models (Revit/NWD), CPM construction schedule data (MS Project / Primavera P6 CSV)",
        engine: "Navisworks TimeLiner, Task Rules Engine, Selection/Search Set Automation",
        outputs: "Phased 4D simulation video sequences, site logistics logs, spatial trade-stacking reports"
      },
      workflow: {
        screenshotUrl: "https://picsum.photos/seed/workflow-6/800/450?grayscale",
        steps: [
          "Import and normalize CPM schedule hierarchies from MS Project/P6 into the CDE.",
          "Map structural and MEP search sets to specific schedule WBS task IDs via rule-based linking.",
          "Apply appearance profiles (e.g., active build, planned, late) to visualize daily site installation phases.",
          "Run timeline playback to identify spatial trade stacking, crane reach conflicts, and staging room constraints."
        ]
      },
      details: {
        overview: "A Virtual Design & Construction (VDC) simulation pipeline that integrates critical path scheduling parameters into federated 3D geometry to construct a dynamic, time-linked 4D visual environment. The workflow transforms static Gantt chart data into an interactive construction sequence model for analyzing site logistics, crane coverage, and temporal trade conflicts.",
        challenge: "Detecting temporal logic errors and spatial bottlenecks—such as site access obstruction, concurrent trade congestion, or premature concrete pour sequencing—is nearly impossible when reviewing flat spreadsheet schedules and 2D phasing drawings in isolation.",
        solution: "Configured an automated 4D parameter-mapping framework linking MS Project tasks directly to Navisworks search sets using defined rule configurations. The pipeline dynamically simulates phased assembly, visually categorizing elements by construction state (Construct, Demolish, Temporary) to validate constructability before site mobilization.",
        videoUrl: "https://drive.google.com/file/d/1lEe6jypAKbT_Fe0CXXVDaV3yXgarNeeF/view?usp=sharing"
      }
    }
  ];

  const arsenal = isArch ? archArsenal : bimArsenal;

  // Background sequential preloader to warm cache with heavy dynamic portfolio GIFs
  useEffect(() => {
    if (isLoading) return;

    const urlsToPreload: string[] = [];
    bimArsenal.forEach(item => {
      if (item.gifUrl && !item.gifUrl.includes('#image') && !item.gifUrl.includes('#video')) {
        urlsToPreload.push(item.gifUrl);
      }
    });
    archArsenal.forEach(item => {
      if (item.gifUrl && !item.gifUrl.includes('#image') && !item.gifUrl.includes('#video')) {
        urlsToPreload.push(item.gifUrl);
      }
    });

    const uniqueUrls = Array.from(new Set(urlsToPreload));
    let isCancelled = false;

    const runPreload = async () => {
      // Cooldown for 3.5 seconds to let initial animations and high-resolution layout thumbnails load cleanly first
      await new Promise(resolve => setTimeout(resolve, 3500));
      if (isCancelled) return;

      for (const url of uniqueUrls) {
        if (isCancelled) break;

        const preloadSingle = (src: string): Promise<void> => {
          return new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.referrerPolicy = "no-referrer";
            img.src = getWsrvGifUrl(src);
          });
        };

        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
          await new Promise<void>((resolve) => {
            (window as any).requestIdleCallback(async () => {
              if (!isCancelled) {
                await preloadSingle(url);
              }
              resolve();
            }, { timeout: 5000 });
          });
        } else {
          await preloadSingle(url);
          // Small cooldown between requests to keep the main event loop smooth and responsiveness crisp
          await new Promise(resolve => setTimeout(resolve, 1800));
        }
      }
    };

    runPreload();

    return () => {
      isCancelled = true;
    };
  }, [isLoading]);

  const GlitchText = ({ text }: { text: string }) => {
    if (isArch) return <>{text}</>;
    return (
      <span className="relative inline-block overflow-hidden">
        <motion.span
          initial={{ x: 0 }}
          animate={{ x: [-1, 1, -1, 0], opacity: [1, 0.8, 1] }}
          transition={{ duration: 0.2, repeat: Infinity, repeatDelay: Math.random() * 5 + 2 }}
          className="relative z-10"
        >
          {text}
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0], x: [-2, 2, -2] }}
          transition={{ duration: 0.1, repeat: Infinity, repeatDelay: Math.random() * 5 + 2 }}
          className="absolute inset-0 z-0 text-neon-cyan/30 translate-x-[1px]"
        >
          {text}
        </motion.span>
      </span>
    );
  };

  const experience: ExperienceData[] = [
    {
      year: "Dec 2025 - June 2026",
      company: "IMK Architects, Mumbai",
      role: "Architectural Intern",
      description: "Coordinating architectural GFC sets and MEP layouts for high-end residential villas. Creating custom automation scripts for drawing production while managing detailed interior and furniture documentation."
    },
    {
      year: "Jan 2025 - Present",
      company: "Self-Employed",
      role: "3D Visualizer",
      description: "Modeling and rendering detailed, photorealistic 3D spaces for client projects using Twinmotion, D5, and Enscape."
    },
    {
      year: "July 2025 - Sept 2025",
      company: "E.D.P Consultants, Bangalore",
      role: "Architectural Intern",
      description: "Created construction drawing sets, layouts, and high-quality 3D renders for residential client presentations."
    },
    {
      year: "Sept 2024 - May 2025",
      company: "Solar Decathlon India",
      role: "Simulation Lead",
      description: "Managed energy-efficiency simulations and environmental studies for construction worker housing designs."
    },
    {
      year: "Dec 2021 - July 2026",
      company: "BMS College of Architecture, Design and Planning",
      role: "Bachelor of Architecture (B.Arch)",
      description: "Completing core architectural design, structural engineering, and sustainable design coursework with a strong focus on computational design and VDC integration."
    }
  ];

  const handleSectionChange = (index: number) => {
    if (index >= 0 && index < visibleSections.length) {
      const sectionId = visibleSections[index];
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      setShowBackToTop(window.scrollY > 400);
      
      visibleSections.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && scrollPosition >= el.offsetTop && scrollPosition < el.offsetTop + el.offsetHeight) {
          setActiveSection(i);
          // Sync modes based on active scroll section
          if (id === "vdc-section") {
            setMode('bim');
          } else if (id === "arch-section") {
            setMode('arch');
          }
        }
      });

      // Track sub-sections
      const vdcSecEl = document.getElementById("vdc-section");
      const skillsEl = document.getElementById("skills");
      const workflowsEl = document.getElementById("vdc-workflows");
      const appsEl = document.getElementById("vdc-apps");

      const archSecEl = document.getElementById("arch-section");
      const worksEl = document.getElementById("arch-works");
      const prototypingEl = document.getElementById("arch-prototyping");
      const terminalEl = document.getElementById("terminal");

      if (vdcSecEl) {
        const skillsTop = skillsEl ? (vdcSecEl.offsetTop + skillsEl.offsetTop) : vdcSecEl.offsetTop;
        const workflowsTop = workflowsEl ? (vdcSecEl.offsetTop + workflowsEl.offsetTop) : vdcSecEl.offsetTop;
        const appsTop = appsEl ? (vdcSecEl.offsetTop + appsEl.offsetTop) : vdcSecEl.offsetTop;
        const archTop = archSecEl ? archSecEl.offsetTop : vdcSecEl.offsetTop + vdcSecEl.offsetHeight;

        if (scrollPosition >= skillsTop && scrollPosition < workflowsTop) {
          setIsSkillsActive(true);
        } else {
          setIsSkillsActive(false);
        }

        // vdc-workflows is active between workflowsTop and appsTop
        if (scrollPosition >= workflowsTop && scrollPosition < appsTop) {
          setIsWorkflowsActive(true);
        } else {
          setIsWorkflowsActive(false);
        }

        // vdc-apps is active between appsTop and archTop
        if (scrollPosition >= appsTop && scrollPosition < archTop) {
          setIsAppsActive(true);
        } else {
          setIsAppsActive(false);
        }
      } else {
        setIsSkillsActive(false);
        setIsWorkflowsActive(false);
        setIsAppsActive(false);
      }

      if (archSecEl) {
        const worksTop = worksEl ? (archSecEl.offsetTop + worksEl.offsetTop) : archSecEl.offsetTop;
        const prototypingTop = prototypingEl ? (archSecEl.offsetTop + prototypingEl.offsetTop) : archSecEl.offsetTop;
        const terminalTop = terminalEl ? terminalEl.offsetTop : archSecEl.offsetTop + archSecEl.offsetHeight;

        if (scrollPosition >= worksTop && scrollPosition < prototypingTop) {
          setIsArchWorksActive(true);
        } else {
          setIsArchWorksActive(false);
        }

        if (scrollPosition >= prototypingTop && scrollPosition < terminalTop) {
          setIsPrototypingActive(true);
        } else {
          setIsPrototypingActive(false);
        }
      } else {
        setIsArchWorksActive(false);
        setIsPrototypingActive(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Simulate initial system check for BIM mode feel
    const timer = setTimeout(() => setIsLoading(false), 2000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const loadingVariants = {
    initial: { opacity: 1 },
    exit: { 
      opacity: 0,
      transition: { duration: 0.8, ease: "circOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const isModalArch = selectedArsenalItem ? (selectedArsenalItem.id.startsWith("ARCH") || selectedArsenalItem.category === "Fabrication") : false;
  const isHeaderArch = isArch;

  return (
    <div className={`min-h-screen w-full transition-colors duration-700 ${isArch ? "bg-white text-gray-900 font-serif" : "bg-[#0a0a0c] text-gray-400 font-sans"} relative overflow-x-hidden`}>
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            variants={loadingVariants}
            initial="initial"
            exit="exit"
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0c]"
          >
            <div className="w-12 h-12 relative mb-6">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-white/10 rounded-full"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-1 border-2 border-neon-orange/40 rounded-full border-t-transparent"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Box className="w-4 h-4 text-neon-cyan" />
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="font-sans text-[11px] font-medium tracking-wide text-neon-cyan tracking-[0.4em] uppercase"
            >
              System_Initializing...
            </motion.div>
            <div className="absolute bottom-12 w-48 h-[1px] bg-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                className="h-full bg-neon-cyan shadow-[0_0_10px_rgba(0,255,255,0.5)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AmbientBackground isArch={isArch} />
      
      {/* Header / Nav */}
      <header className={`fixed top-0 w-full z-[60] backdrop-blur-xl border-b transition-colors duration-700 ${
        isHeaderArch 
          ? "border-stone-200 bg-white/80 text-stone-900" 
          : "border-white/5 bg-[#0a0a0c]/80 text-white"
      }`}>
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 py-4 flex justify-between items-center relative">
          <div className="flex items-center gap-6">
            <div className={`flex items-center font-serif text-[11px] sm:text-[14px] xl:text-lg font-bold tracking-tight uppercase transition-colors duration-700 ${isHeaderArch ? "text-stone-900" : "text-white"}`}>
              <span className={`font-mono font-light text-xl opacity-70 transition-colors duration-700 ${isHeaderArch ? "text-[#3B82F6]" : "text-[#00f2ff]"}`}>{`>`}</span>
              <span className={`font-mono font-light text-xl -ml-0.5 mt-2 opacity-70 transition-colors duration-700 ${isHeaderArch ? "text-[#3B82F6]" : "text-[#00f2ff]"}`}>{`_`}</span>
              <span className="ml-3 tracking-wide">KARTHIKRAJ_<span className="text-[#3B82F6]">NADAR</span></span>
            </div>
          </div>
        
        <div className="hidden xl:flex flex-1 justify-center gap-6 xl:gap-10">
          <button onClick={() => document.getElementById("landing")?.scrollIntoView({ behavior: "smooth" })} className={`relative group font-serif text-sm font-medium transition-colors duration-300 ${isHeaderArch ? "text-stone-500 hover:text-black" : "text-gray-400 hover:text-white"}`}>
            Home
          </button>
          
          <button onClick={() => document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" })} className={`relative group font-serif text-sm font-medium transition-colors duration-300 ${isHeaderArch ? "text-stone-500 hover:text-black" : "text-gray-400 hover:text-white"}`}>
            Skills
          </button>

          <div className="relative group flex items-center h-full py-4">
            <button onClick={() => document.getElementById("vdc-section")?.scrollIntoView({ behavior: "smooth" })} className={`relative font-serif text-sm font-medium transition-colors duration-300 ${isHeaderArch ? "text-stone-500 hover:text-[#3B82F6]" : "text-gray-400 hover:text-[#00f2ff]"}`}>
              Workflows
              <span className={`absolute -bottom-1 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${isHeaderArch ? "bg-[#3B82F6]" : "bg-[#00f2ff]"}`}></span>
            </button>
            <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-[-10px] pt-4 hidden group-hover:flex flex-col gap-2 min-w-[140px]`}>
              <div className={`p-3 rounded-lg shadow-xl border backdrop-blur-xl transition-all flex flex-col gap-2 ${isHeaderArch ? "bg-white/95 border-gray-200" : "bg-[#0a0a0c]/95 border-white/10"}`}>
                <button onClick={() => document.getElementById("vdc-apps")?.scrollIntoView({ behavior: "smooth" })} className={`text-left whitespace-nowrap font-serif text-xs font-medium transition-colors duration-300 ${isHeaderArch ? "text-stone-600 hover:text-[#3B82F6]" : "text-gray-400 hover:text-[#00f2ff]"}`}>
                  Apps / Web
                </button>
              </div>
            </div>
          </div>

          <div className="relative group flex items-center h-full py-4">
            <button onClick={() => document.getElementById("arch-section")?.scrollIntoView({ behavior: "smooth" })} className={`relative font-serif text-sm font-medium transition-colors duration-300 ${isHeaderArch ? "text-stone-500 hover:text-[#3B82F6]" : "text-gray-400 hover:text-[#3B82F6]"}`}>
              Design Projects
              <span className={`absolute -bottom-1 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${isHeaderArch ? "bg-[#3B82F6]" : "bg-[#3B82F6]"}`}></span>
            </button>
            <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-[-10px] pt-4 hidden group-hover:flex flex-col gap-2 min-w-[140px]`}>
              <div className={`p-3 rounded-lg shadow-xl border backdrop-blur-xl transition-all flex flex-col gap-2 ${isHeaderArch ? "bg-white/95 border-gray-200" : "bg-[#0a0a0c]/95 border-white/10"}`}>
                <button onClick={() => document.getElementById("arch-prototyping")?.scrollIntoView({ behavior: "smooth" })} className={`text-left whitespace-nowrap font-serif text-xs font-medium transition-colors duration-300 ${isHeaderArch ? "text-stone-600 hover:text-[#3B82F6]" : "text-gray-400 hover:text-[#3B82F6]"}`}>
                  Prototyping
                </button>
              </div>
            </div>
          </div>

          <button onClick={() => document.getElementById("terminal")?.scrollIntoView({ behavior: "smooth" })} className={`relative group font-serif text-sm font-medium transition-colors duration-300 ${isHeaderArch ? "text-stone-500 hover:text-black" : "text-gray-400 hover:text-white"}`}>
            Contact & Bio
          </button>
        </div>
        
        <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 xl:hidden">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className={`p-2 transition-colors duration-700 flex items-center justify-center focus:outline-none ${
                isHeaderArch 
                  ? "text-stone-800 hover:text-black" 
                  : "text-white hover:text-[#00f2ff]"
              }`}
            >
              <Box className="w-6 h-6 transition-transform hover:scale-110 active:scale-95" />
            </button>
        </div>
        <div className="hidden xl:block w-[180px]"></div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className={`fixed inset-0 z-[70] block p-6 transition-colors duration-700 overflow-y-auto overscroll-contain ${
              isHeaderArch ? "bg-white text-black" : "bg-[#0a0a0c] text-neon-cyan"
            }`}
          >
            <div className="min-h-full flex flex-col justify-between items-center w-full max-w-sm mx-auto">
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="self-end p-2 mt-2 mr-2 hover:scale-110 transition-transform text-current"
              >
                <Box className="w-8 h-8 rotate-45" />
              </button>

              <div className="flex flex-col items-stretch gap-1 py-4 font-mono text-xs uppercase tracking-[0.15em] w-full max-w-[260px] my-auto">
                {menuItems.map((item) => {
                  const isActive = 
                    item.id === "landing" ? activeSection === 0 :
                    item.id === "skills" ? isSkillsActive :
                    item.id === "vdc-section" ? (activeSection === 1 && !isWorkflowsActive && !isAppsActive && !isSkillsActive) :
                    item.id === "vdc-workflows" ? isWorkflowsActive :
                    item.id === "vdc-apps" ? isAppsActive :
                    item.id === "arch-section" ? (activeSection === 2 && !isArchWorksActive && !isPrototypingActive) :
                    item.id === "arch-works" ? isArchWorksActive :
                    item.id === "arch-prototyping" ? isPrototypingActive :
                    item.id === "terminal" ? activeSection === 3 :
                    false;

                  if (item.isSection) {
                    return (
                      <button 
                        key={`mobile-menu-${item.id}`}
                        onClick={() => {
                          handleSectionChange(item.index!);
                          setIsMenuOpen(false);
                        }}
                        className={`hover:translate-x-1 hover:text-[#6366F1] py-2 text-left w-full border-b flex justify-between items-center transition-all duration-300 ${
                          isHeaderArch ? "border-gray-100" : "border-white/5"
                        } ${isActive ? "font-bold text-sm" : "opacity-80 text-[11px]"}`}
                      >
                        <span>{item.label}</span>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                      </button>
                    );
                  } else {
                    return (
                      <button 
                        key={`mobile-menu-${item.id}`}
                        onClick={() => {
                          const el = document.getElementById(item.elementId);
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                          setIsMenuOpen(false);
                        }}
                        className={`hover:translate-x-1 hover:text-[#6366F1] transition-all text-left py-1.5 pl-5 text-[10px] flex items-center gap-1.5 ${
                          isActive 
                            ? (isHeaderArch ? "text-black font-semibold" : "text-neon-cyan font-semibold") 
                            : "opacity-50 hover:opacity-90"
                        }`}
                      >
                        <span className="opacity-30 font-sans">└─</span>
                        <span>{item.label}</span>
                      </button>
                    );
                  }
                })}
              </div>


            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Mode Selector */}
      <div className={`fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center p-1.5 rounded-full backdrop-blur-xl border shadow-2xl transition-all duration-700 ${
        isArch ? "bg-white/80 border-gray-300" : "bg-[#0a0a0c]/80 border-white/10"
      }`}>
        <button 
          onClick={() => {
            const el = document.getElementById("vdc-section");
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`relative flex items-center justify-center px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[9px] md:text-[10px] font-mono font-bold tracking-[0.15em] transition-all duration-500 z-10 ${
            !isArch ? "text-black" : "text-gray-500 hover:text-black"
          }`}
        >
          {!isArch && (
            <motion.div 
              layoutId="mode-pill"
              className="absolute inset-0 bg-neon-cyan rounded-full -z-10 shadow-[0_0_15px_rgba(0,242,255,0.4)]"
            />
          )}
          <Terminal className="w-3.5 h-3.5 mr-2" />
          VDC_DASHBOARD
        </button>
        
        <div className={`w-[1px] h-4 md:h-5 transition-colors duration-700 mx-1 ${isArch ? "bg-gray-300" : "bg-white/20"}`} />
        
        <button 
          onClick={() => {
            const el = document.getElementById("arch-section");
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`relative flex items-center justify-center px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[9px] md:text-[10px] font-mono font-bold tracking-[0.15em] transition-all duration-500 z-10 ${
            isArch ? "text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          {isArch && (
            <motion.div 
              layoutId="mode-pill"
              className="absolute inset-0 bg-black rounded-full -z-10 shadow-lg"
            />
          )}
          <Box className="w-3.5 h-3.5 mr-2" />
          ARCH_STUDIO
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 hidden sm:flex flex-col gap-4 items-center">
        {/* Scroll Progress Bar */}
        <div className={`absolute -right-4 top-0 bottom-0 w-1 transition-colors duration-700 rounded-full ${isHeaderArch ? "bg-gray-100" : "bg-terminal-border/40"}`}>
          <motion.div 
            style={{ scaleY: useScroll().scrollYProgress }}
            className={`absolute top-0 left-0 w-full origin-top transition-colors duration-700 rounded-full ${isHeaderArch ? "bg-black" : "bg-neon-cyan shadow-[0_0_15px_rgba(0,242,255,0.6)]"}`}
          />
        </div>

        <button 
          onClick={() => handleSectionChange(activeSection - 1)}
          disabled={activeSection === 0}
          className={`p-2 border transition-colors ${
            isHeaderArch 
            ? "border-gray-200 hover:bg-black hover:text-white" 
            : "brutalist-border rounded-2xl overflow-hidden hover:bg-neon-cyan hover:text-black"
          } disabled:opacity-20`}
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <div className="flex flex-col gap-2 relative">
          {visibleSections.map((_, i) => (<button key={`vis-sec-${i}`}
              onClick={() => handleSectionChange(i)}
              className={`w-1 h-8 rounded-full transition-all duration-500 z-10 ${
                activeSection === i 
                ? (isHeaderArch ? "bg-black h-12" : "bg-neon-cyan h-12 shadow-[0_0_10px_rgba(0,255,255,0.8)]") 
                : (isHeaderArch ? "bg-gray-100" : "bg-terminal-border")
              }`}
            />
          ))}
        </div>
        <button 
          onClick={() => handleSectionChange(activeSection + 1)}
          disabled={activeSection === visibleSections.length - 1}
          className={`p-2 border transition-colors ${
            isHeaderArch 
            ? "border-gray-200 hover:bg-black hover:text-white" 
            : "brutalist-border rounded-2xl overflow-hidden hover:bg-neon-cyan hover:text-black"
          } disabled:opacity-20`}
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <main className="relative z-10">
        {/* STAGE 1: Vertical Split landing Gateway */}
                {/* STAGE 1: Premium Unified Hero */}
                <section id="landing" className={`min-h-screen w-full relative flex flex-col justify-center bg-[#0a0a0c]`}>
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_60%)] pointer-events-none" />
          <OrganicBackground />
          
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center min-h-screen pt-36 md:pt-48 pb-12">
            <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-sans font-black tracking-tighter text-white leading-[1.1] mb-6">
              Automating Architecture.<br/>
              <span className="text-gray-400">Engineering Compliant</span><br/>
              <span className="text-[#3B82F6]">BIM Pipelines.</span>
            </h1>
            
            <p className="text-gray-400 font-sans text-base md:text-xl font-medium max-w-2xl leading-relaxed mb-12">
              Developing custom Python and Dynamo workflows to streamline database extraction, model validation, and scalable ISO 19650 compliance.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mb-16">
              <button 
                onClick={() => {
                  const el = document.getElementById("vdc-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-8 py-4 bg-[#3B82F6] text-white rounded-full font-bold font-sans hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(59,130,246,0.3)] text-sm md:text-base"
              >
                View Automation Tools
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById("arch-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-6 py-3 bg-transparent border border-white/10 text-zinc-300 rounded-full font-bold font-sans hover:border-indigo-500 hover:text-white transition-colors duration-300 text-sm md:text-base"
              >
                View Design Projects
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById("terminal");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-6 py-3 bg-transparent border border-white/10 text-zinc-300 rounded-full font-bold font-sans hover:border-indigo-500 hover:text-white transition-colors duration-300 text-sm md:text-base"
              >
                View Contact & Bio
              </button>
              <a 
                href="https://drive.google.com/file/d/1NedDKu8KdPfHPTFxYKGncsrrbla5c5Hc/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 bg-transparent border border-white/10 text-zinc-300 rounded-full font-bold font-sans hover:border-indigo-500 hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">Download Resume</span>
              </a>
            </div>
            
            {/* HARDWARE & SOFTWARE TELEMETRY */}
            <div id="skills" className="pt-16 mt-16 md:mt-24 border-t border-white/10 w-full mb-6">
              <h2 className="text-[10px] md:text-xs font-mono tracking-[0.2em] text-[#3B82F6] mb-4 uppercase">
                // TECHNICAL ARCHITECTURE & STACK
              </h2>
              
              <div className="hidden md:flex flex-wrap gap-2 mb-8 pb-3 md:pb-0">
                {['Python', 'Dynamo', 'Revit API', 'Rhino.Inside', 'React', 'TypeScript', 'Node.js', 'Vectorworks'].map((tech, idx) => (
                  <span key={`${tech}-${idx}`} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-gray-400">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="md:hidden overflow-hidden w-full mb-8 relative" style={{ WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)" }}>
                <div className="carousel-track flex gap-2 w-max" style={{ animationDuration: "15s" }}>
                  {[...['Python', 'Dynamo', 'Revit API', 'Rhino.Inside', 'React', 'TypeScript', 'Node.js', 'Vectorworks'], ...['Python', 'Dynamo', 'Revit API', 'Rhino.Inside', 'React', 'TypeScript', 'Node.js', 'Vectorworks']].map((tech, idx) => (
                    <span key={`mobile-${tech}-${idx}`} className="shrink-0 px-2.5 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-gray-400">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 md:pb-20">
                            {/* Left Column: Domain List */}
                <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-2 relative">
                  <div className="text-[10px] text-gray-500 font-mono mb-2 uppercase tracking-widest pl-4 hidden md:block">
                    Select a domain to view stack
                  </div>
                  {telemetryDomains.map((domain, idx) => {
                    const isActive = activeTelemetry === idx;
                    return (
                      <div key={domain.id} className="flex flex-col">
                        <button
                          onClick={() => setActiveTelemetry(activeTelemetry === idx ? null : idx)}
                          className={`group w-full flex items-center justify-between p-4 text-left transition-all duration-300 border-l-2 ${
                            isActive 
                              ? "bg-[#3B82F6]/10 border-[#3B82F6] text-white" 
                              : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5 hover:border-white/20"
                          }`}
                        >
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-3">
                              <span className={`transition-colors ${isActive ? "text-[#3B82F6]" : "text-gray-600 group-hover:text-gray-400"}`}>
                                {domain.icon}
                              </span>
                              <span className="font-mono text-[11px] md:text-xs tracking-wider uppercase">
                                0{domain.id} // {domain.title}
                              </span>
                            </div>
                            {/* Visibility cue for top technologies inside */}
                            {!isActive && (
                              <div className="pl-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[9px] font-mono text-gray-500 truncate max-w-[200px]">
                                {domain.core.slice(0, 3).join(', ')}...
                              </div>
                            )}
                          </div>
                          {isActive ? (
                             <ChevronRight className="w-4 h-4 text-[#3B82F6] md:rotate-0 rotate-90 transition-transform" />
                          ) : (
                             <ChevronRight className="w-4 h-4 text-gray-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          )}
                        </button>
                        
                        {/* Mobile Accordion Content */}
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="md:hidden overflow-hidden"
                            >
                              <div className="p-4 pt-2 border-l-2 border-[#3B82F6] bg-[#3B82F6]/[0.02]">
                                <p className="text-gray-400 text-[13px] mb-5 leading-relaxed font-sans">
                                  {domain.summary}
                                </p>
                                <div className="space-y-5">
                                  <div>
                                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2.5">Core Software</div>
                                    <div className="flex flex-wrap gap-2">
                                      {domain.core.map((t, i) => (
                                        <span key={`${t}-${i}`} className="px-2.5 py-1 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-md text-xs font-mono text-blue-300 shadow-sm whitespace-nowrap">
                                          {t}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2.5">Deliverables</div>
                                    <div className="flex flex-wrap gap-2">
                                      {domain.methods.map((t, i) => (
                                        <span key={`${t}-${i}`} className="px-2.5 py-1 bg-black/40 border border-white/10 rounded-md text-xs font-mono text-gray-400 whitespace-nowrap">
                                          {t}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                {/* Right Column: Active Domain Data */}
                <div className="hidden md:flex md:col-span-7 lg:col-span-8 items-center">
                  <AnimatePresence mode="wait">
                    {activeTelemetry !== null ? (
                      <motion.div
                        key={activeTelemetry}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="w-full border border-white/5 bg-zinc-900/30 p-8 md:p-12 rounded-xl backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-4 mb-4">
                           <div className="p-3 bg-[#3B82F6]/10 text-[#3B82F6] rounded-lg">
                             {telemetryDomains[activeTelemetry].icon}
                           </div>
                           <h3 className="font-sans font-bold text-gray-200 text-lg md:text-xl tracking-wide">
                             {telemetryDomains[activeTelemetry].title}
                           </h3>
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-8 leading-relaxed font-sans max-w-2xl">
                          {telemetryDomains[activeTelemetry].summary}
                        </p>
                            
                        <div className="space-y-6">
                          <div>
                            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">Core Software & Languages</div>
                            <div className="flex flex-wrap gap-2">
                              {telemetryDomains[activeTelemetry].core.map((t, idx) => (
                                <span key={`${t}-${idx}`} className="px-2.5 py-1 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-md text-xs font-mono text-blue-300 shadow-sm">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                            
                          <div>
                            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">Standards & Deliverables</div>
                            <div className="flex flex-wrap gap-2">
                              {telemetryDomains[activeTelemetry].methods.map((t, idx) => (
                                <span key={`${t}-${idx}`} className="px-2.5 py-1 bg-black/40 border border-white/10 rounded-md text-xs font-mono text-gray-400">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty-telemetry"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full min-h-[300px] border border-white/5 bg-zinc-900/30 border-dashed rounded-xl flex items-center justify-center"
                      >
                        <div className="text-gray-500 font-mono text-sm tracking-widest uppercase">
                          Select a domain to view stack
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-8 mt-8 md:mt-12 border-t border-white/10">
              <div>
                <div className="text-3xl md:text-5xl font-black text-[#3B82F6] tracking-tighter mb-1">11+</div>
                <div className="text-[10px] md:text-xs font-bold tracking-widest text-gray-400 uppercase">PyRevit & Dynamo Scripts</div>
                <div className="text-[9px] md:text-[10px] font-mono text-gray-500 mt-1">Saved ~40+ hours/project</div>
              </div>
              <div>
                <div className="text-3xl md:text-5xl font-black text-[#3B82F6] tracking-tighter mb-1">100%</div>
                <div className="text-[10px] md:text-xs font-bold tracking-widest text-gray-400 uppercase">ISO 19650 Compliant</div>
                <div className="text-[9px] md:text-[10px] font-mono text-gray-500 mt-1">Zero-clash model coordination</div>
              </div>
              <div>
                <div className="text-3xl md:text-5xl font-black text-[#3B82F6] tracking-tighter mb-1">Python</div>
                <div className="text-[10px] md:text-xs font-bold tracking-widest text-gray-400 uppercase">Data Pipelines</div>
                <div className="text-[9px] md:text-[10px] font-mono text-gray-500 mt-1">Automated JSON metadata extraction</div>
              </div>
              <div>
                <div className="text-3xl md:text-5xl font-black text-[#3B82F6] tracking-tighter mb-1">LOD 350</div>
                <div className="text-[10px] md:text-xs font-bold tracking-widest text-gray-400 uppercase">Modeling Precision</div>
                <div className="text-[9px] md:text-[10px] font-mono text-gray-500 mt-1">High-fidelity 5D quantity takeoffs</div>
              </div>
            </div>

          </div>
        </section>
        <React.Suspense fallback={<div className="h-[50vh] flex items-center justify-center bg-[#0f1115] text-neon-cyan font-mono text-xs">Loading VDC Environment...</div>}>
          <VDCSection 
            bimArsenal={bimArsenal} 
            experience={experience} 
            setSelectedArsenalItem={setSelectedArsenalItem} 
            ProjectCard={ProjectCard} 
            SoftwareStack={SoftwareStack} 
            setExpandedMedia={setExpandedMedia}
            getDriveId={getDriveId}
          />
        </React.Suspense>
        <React.Suspense fallback={<div className="h-[50vh] flex items-center justify-center bg-white text-black font-serif text-sm">Loading Architecture Portfolio...</div>}>
          <ArchSection 
            archArsenal={archArsenal} 
            experience={experience} 
            setSelectedArsenalItem={setSelectedArsenalItem} 
            ProjectCard={ProjectCard} 
            SoftwareStack={SoftwareStack} 
            setExpandedMedia={setExpandedMedia}
            getDriveId={getDriveId}
          />
        </React.Suspense>

        <ParallaxSection id="terminal" index={visibleSections.indexOf('terminal')} setActiveSection={setActiveSection}>
          <motion.div
            className="w-full py-4 md:py-12 px-0 md:px-6 max-w-7xl mx-auto" 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.05 }}
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            >
            <div className={`border p-6 md:p-8 font-mono text-xs relative overflow-hidden transition-all duration-700 ${
              isArch 
              ? "border-gray-100 bg-white" 
              : "brutalist-border rounded-2xl overflow-hidden bg-[#0a0a0c]"
            }`}>
              <div className={`flex items-center gap-2 mb-4 md:mb-6 border-b pb-4 transition-colors duration-700 ${isArch ? "border-gray-100" : "border-white/5"}`}>
                <div className={`w-2 h-2 rounded-full ${isArch ? "bg-gray-200" : "bg-red-500/50"}`} />
                <div className={`w-2 h-2 rounded-full ${isArch ? "bg-gray-200" : "bg-yellow-500/50"}`} />
                <div className={`w-2 h-2 rounded-full ${isArch ? "bg-gray-200" : "bg-green-500/50"}`} />
                <span className="ml-2 text-gray-500 text-[8px] md:text-[10px]">{isArch ? "about_me_session" : "vdc_terminal_session"}</span>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className={`text-xs uppercase tracking-widest font-bold ${isArch ? "text-black" : "text-neon-cyan"}`}>About</div>
                  <div className={`text-sm leading-relaxed ${isArch ? "text-gray-600" : "text-gray-400"}`}>
                    {isArch 
                      ? "Karthikraj Nadar. Computational Designer & Automation Specialist." 
                      : "BIM/VDC & ISO 19650. Computational Design. Dynamo • Python."}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className={`text-xs uppercase tracking-widest font-bold ${isArch ? "text-black" : "text-neon-cyan"}`}>Certification</div>
                  <div className={`p-4 border border-dashed transition-colors duration-700 ${isArch ? "border-gray-200 bg-gray-50/50" : "border-white/10 bg-neon-cyan/5"}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded border flex items-center justify-center shrink-0 ${isArch ? "border-gray-200 bg-white" : "border-white/10/50 bg-black"}`}>
                        <img loading="lazy" 
                          src="https://lh3.googleusercontent.com/d/1szL-O1_LuUqLzzsL3lJqB2JzX4K39dnt" 
                          alt="Badge" 
                          onContextMenu={(e) => e.preventDefault()}
                          onDragStart={(e) => e.preventDefault()}
                          className="w-8 h-8 object-contain pointer-events-none select-none"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <div className={`text-sm ${isArch ? "text-black font-bold" : "text-neon-cyan"}`}>ISO 19650 EXPERT - LEVEL 3</div>
                        <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Information Manager Certification</div>
                        <div className="text-xs text-gray-400 mt-2 leading-relaxed">
                          Verified expertise in global digital delivery standards, Common Data Environments (CDE), and information management protocols for large-scale infrastructure.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className={`text-xs uppercase tracking-widest font-bold ${isArch ? "text-black" : "text-neon-cyan"}`}>Contact</div>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-6">
                    <a href="mailto:karthikraj.v.nadar@gmail.com" className={`flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 hover:underline transition-all duration-700 text-sm p-3 sm:p-0 w-full sm:w-auto rounded-xl sm:rounded-none border sm:border-0 sm:border-transparent sm:bg-transparent ${isArch ? "text-gray-700 bg-gray-50 border-gray-200" : "text-gray-400 hover:text-[#6366F1] bg-neutral-900/60 border-white/10"}`}>
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-bold sm:font-normal">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                        <span className="sm:hidden tracking-wider uppercase text-[10px]">Email Me</span>
                      </div>
                      <span className="text-xs sm:text-sm truncate break-all sm:break-normal opacity-80 sm:opacity-100 pl-6 sm:pl-0">karthikraj.v.nadar@gmail.com</span>
                    </a>
                    
                    <div className={`flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 transition-all duration-700 text-sm p-3 sm:p-0 w-full sm:w-auto rounded-xl sm:rounded-none border sm:border-0 sm:border-transparent sm:bg-transparent ${isArch ? "text-gray-700 bg-gray-50 border-gray-200" : "text-gray-400 bg-neutral-900/60 border-white/10"}`}>
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-bold sm:font-normal">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                        <span className="sm:hidden tracking-wider uppercase text-[10px]">Phone</span>
                      </div>
                      <span className="text-xs sm:text-sm truncate break-all sm:break-normal opacity-80 sm:opacity-100 pl-6 sm:pl-0">8779228622</span>
                    </div>

                    <a href="https://www.linkedin.com/in/karthikraj-nadar-07083526a" target="_blank" rel="noopener noreferrer" className={`flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 hover:underline transition-all duration-700 text-sm p-3 sm:p-0 w-full sm:w-auto rounded-xl sm:rounded-none border sm:border-0 sm:border-transparent sm:bg-transparent ${isArch ? "text-gray-700 bg-gray-50 border-gray-200" : "text-gray-400 hover:text-[#6366F1] bg-neutral-900/60 border-white/10"}`}>
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-bold sm:font-normal">
                        <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                        <span className="sm:hidden tracking-wider uppercase text-[10px]">LinkedIn Profile</span>
                      </div>
                      <span className="text-xs sm:text-sm truncate break-all sm:break-normal opacity-80 sm:opacity-100 pl-6 sm:pl-0">linkedin.com/in/karthikraj-nadar-07083526a</span>
                    </a>

                    <a href="https://github.com/k-android" target="_blank" rel="noopener noreferrer" className={`flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 hover:underline transition-all duration-700 text-sm p-3 sm:p-0 w-full sm:w-auto rounded-xl sm:rounded-none border sm:border-0 sm:border-transparent sm:bg-transparent ${isArch ? "text-gray-700 bg-gray-50 border-gray-200" : "text-gray-400 hover:text-[#6366F1] bg-neutral-900/60 border-white/10"}`}>
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-bold sm:font-normal">
                        <Github className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                        <span className="sm:hidden tracking-wider uppercase text-[10px]">GitHub Portfolio</span>
                      </div>
                      <span className="text-xs sm:text-sm truncate break-all sm:break-normal opacity-80 sm:opacity-100 pl-6 sm:pl-0">github.com/k-android</span>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">


                  <div className="space-y-2">
                    <div className={`text-xs uppercase tracking-widest font-bold ${isArch ? "text-black" : "text-neon-cyan"}`}>Languages</div>
                    <div className={`text-sm flex flex-wrap gap-x-4 gap-y-2 ${isArch ? "text-gray-600" : "text-gray-400"}`}>
                      <span>English [Full]</span>
                      <span>Hindi [Native]</span>
                      <span>Tamil [Native]</span>
                      <span>Marathi [Limited]</span>
                      <span>Kannada [Limited]</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className={`text-xs uppercase tracking-widest font-bold ${isArch ? "text-black" : "text-neon-cyan"}`}>Achievements</div>
                  <div className={`text-sm space-y-2 ${isArch ? "text-gray-600" : "text-gray-400"}`}>
                    <div>• Grand Winner | Solar Decathlon India (2024–2025)</div>
                    <div>• Citation | 66th Annual NASA Design Competition</div>
                    <div>• ISO 19650 Information Management Expert</div>
                    <div>• Net Zero Energy and Water Buildings Certified</div>
                  </div>
                </div>

                <div className={`text-xs pt-4 ${isArch ? "text-black" : "text-white"}`}>
                  Based in Mumbai. Available for corporate VDC, Computational Design, BIM roles starting as soon as possible.
                </div>

                <div className={`mt-8 p-6 border transition-all duration-700 ${isArch ? "border-gray-200 bg-gray-50/50" : "border-white/10 bg-[#0a0a0c]/80"}`}>
                  {isSent ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="py-8 text-center space-y-4"
                    >
                      <div className={`text-2xl ${isArch ? "text-black" : "text-neon-cyan"}`}>✓</div>
                      <div className={`font-mono text-xs uppercase tracking-widest ${isArch ? "text-black" : "text-white"}`}>
                        Message Sent
                      </div>
                    </motion.div>
                  ) : (
                    <form className="space-y-6" onSubmit={handleFormSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative pt-4">
                          <input 
                            type="text"
                            id="contactName" 
                            required
                            value={formState.name}
                            onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                            placeholder=" "
                            className={`peer w-full bg-transparent border-b px-0 py-2 outline-none transition-all duration-700 text-xs ${
                              isArch ? "border-gray-300 focus:border-black text-black" : "border-white/5 focus:border-white/10 text-white"
                            }`}
                          />
                          <label 
                            htmlFor="contactName"
                            className={`absolute left-0 transition-all duration-300 pointer-events-none uppercase tracking-widest
                            ${formState.name ? "-top-1 text-[10px]" : "top-6 text-xs peer-focus:-top-1 peer-focus:text-[10px]"}
                            ${isArch ? "text-gray-500 peer-focus:text-black" : "text-gray-500 peer-focus:text-neon-cyan/80"}`}
                          >
                            Name
                          </label>
                        </div>
                        <div className="relative pt-4">
                          <input 
                            type="email"
                            id="contactEmail" 
                            required
                            value={formState.email}
                            onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                            placeholder=" "
                            className={`peer w-full bg-transparent border-b px-0 py-2 outline-none transition-all duration-700 text-xs ${
                              isArch ? "border-gray-300 focus:border-black text-black" : "border-white/5 focus:border-white/10 text-white"
                            }`}
                          />
                          <label 
                            htmlFor="contactEmail"
                            className={`absolute left-0 transition-all duration-300 pointer-events-none uppercase tracking-widest
                            ${formState.email ? "-top-1 text-[10px]" : "top-6 text-xs peer-focus:-top-1 peer-focus:text-[10px]"}
                            ${isArch ? "text-gray-500 peer-focus:text-black" : "text-gray-500 peer-focus:text-neon-cyan/80"}`}
                          >
                            Email
                          </label>
                        </div>
                      </div>
                      <div className="relative pt-4">
                        <textarea 
                          id="contactMessage"
                          rows={3}
                          required
                          value={formState.message}
                          onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
                          placeholder=" "
                          className={`peer w-full bg-transparent border-b px-0 py-2 outline-none transition-all duration-700 text-xs resize-none ${
                            isArch ? "border-gray-300 focus:border-black text-black" : "border-white/5 focus:border-white/10 text-white"
                          }`}
                        />
                        <label 
                          htmlFor="contactMessage"
                          className={`absolute left-0 transition-all duration-300 pointer-events-none uppercase tracking-widest
                          ${formState.message ? "-top-1 text-[10px]" : "top-6 text-xs peer-focus:-top-1 peer-focus:text-[10px]"}
                          ${isArch ? "text-gray-500 peer-focus:text-black" : "text-gray-500 peer-focus:text-neon-cyan/80"}`}
                        >
                          Message
                        </label>
                      </div>
                      <button 
                        type="submit"
                        disabled={isSending}
                        className={`w-full py-3 border font-sans text-[11px] font-medium tracking-wide uppercase tracking-widest transition-all duration-700 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 ${
                          isSending ? "opacity-50 cursor-not-allowed" : ""
                        } ${
                          isArch 
                           ? "bg-black text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-black/20" 
                           : "bg-neon-cyan/10 text-neon-cyan border-white/10 hover:bg-neon-cyan hover:text-black hover:shadow-[0_0_15px_rgba(0,243,255,0.4)]"
                        }`}
                      >
                        {isSending ? (
                          <>
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-3 h-3 border-2 border-current border-t-transparent rounded-full"
                            />
                            Sending...
                          </>
                        ) : "Send Message"}
                      </button>
                      {formError && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-[10px] font-mono text-red-500 uppercase tracking-widest text-center mt-2"
                        >
                          ERROR: {formError}
                        </motion.div>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </div>
            
            <footer className={`mt-12 md:mt-20 pt-8 border-t transition-colors duration-700 ${isArch ? "border-gray-100" : "border-white/5"}`}>
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-gray-400 font-sans text-[11px] font-medium tracking-wide uppercase tracking-widest">
                <div className="flex flex-col items-center md:items-start gap-2">
                  <div className={isArch ? "text-black font-bold" : "text-white"}>© 2026 {isArch ? "KARTHIKRAJ NADAR ARCHITECTURE" : "VDC_CORE_ENGINEERING"}</div>
                  <div className="text-[8px] opacity-60">ALL RIGHTS RESERVED // MUMBAI, INDIA</div>
                </div>

                <div className="flex items-center gap-6">
                  <a href="https://github.com/k-android" target="_blank" rel="noopener noreferrer" className={`transition-colors ${isArch ? "hover:text-black" : "hover:text-[#6366F1]"}`}>
                    <Github className="w-4 h-4" />
                  </a>
                  <a href="https://www.linkedin.com/in/karthikraj-nadar-07083526a" target="_blank" rel="noopener noreferrer" className={`transition-colors ${isArch ? "hover:text-black" : "hover:text-[#6366F1]"}`}>
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="mailto:karthikraj.v.nadar@gmail.com" className={`transition-colors ${isArch ? "hover:text-black" : "hover:text-[#6366F1]"}`}>
                    <Mail className="w-5 h-5" />
                  </a>
                </div>

                <div className="flex gap-4 md:gap-8 text-[8px] opacity-60">
                  <span>STATUS: {isArch ? "ACTIVE" : "OPTIMIZED"}</span>
                  <span>UPTIME: 99.99%</span>
                </div>
              </div>
            </footer>
          </motion.div>
        </ParallaxSection>
      </main>

      {/* Workflows Detail Modal */}
      <AnimatePresence>
        {selectedArsenalItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`w-full max-w-7xl border overflow-hidden flex flex-col max-h-[85vh] md:max-h-[92vh] transition-all duration-700 ${
                isModalArch ? "bg-white border-gray-200 shadow-2xl" : "bg-[#0a0a0c] border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
              }`}
            >
              {/* Modal Header */}
              <div className={`p-4 md:p-6 border-b flex justify-between items-center transition-all duration-700 ${isModalArch ? "bg-gray-50 border-gray-100" : "bg-[#0a0a0c]/90 border-white/5"}`}>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={`p-2 rounded border transition-all duration-700 ${
                    isModalArch ? "bg-white border-gray-200 text-black" : `bg-${selectedArsenalItem.color}/10 border-${selectedArsenalItem.color}/20 text-${selectedArsenalItem.color}`
                  }`}>
                    {selectedArsenalItem.icon}
                  </div>
                  <div>
                    <h4 className={`text-sm md:text-xl font-semibold uppercase tracking-tighter transition-colors duration-700 ${isModalArch ? "text-black font-serif italic" : "text-white font-sans"}`}>
                      {selectedArsenalItem.title}
                    </h4>
                    <div className="text-[8px] md:text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                      {isArch ? "Workflow_Record_v1.0" : "VDC_Workflow_Data"} // {selectedArsenalItem.id}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedArsenalItem(null)}
                  className={`p-2 transition-colors border ${isArch ? "border-gray-200 hover:bg-black hover:text-white pointer-events-auto cursor-pointer" : "brutalist-border rounded-2xl overflow-hidden hover:bg-white hover:text-black pointer-events-auto cursor-pointer"}`}
                >
                  <Box className="w-4 h-4 md:w-5 md:h-5 rotate-45" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-grow overflow-y-auto overscroll-contain p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-8 md:gap-12">
                  {/* Left: Media & Workflow */}
                  <div className="space-y-8">
                    {selectedArsenalItem.id === "BIM_07" ? (
                      <div className="space-y-4">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-[#00f3ff] flex items-center justify-between">
                          <span>// 01 . COMPARATIVE PROCESS VISUALIZATION</span>
                          <span className="text-[8px] text-gray-500">[Galapagos vs. Wallacei]</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Option A: Galapagos (Single-Objective) */}
                          <div className="space-y-2 group/pvizg">
                            <div className="flex justify-between items-center bg-black/45 p-2 border border-white/10 font-mono text-[9px] uppercase">
                              <span className="text-[#00f3ff] font-semibold">Option A: Galapagos</span>
                              <span className="text-gray-500">[Single-Objective]</span>
                            </div>
                            
                            <div className="w-full h-[220px] sm:h-[300px] md:h-[350px] border border-white/10 bg-[#020304] relative overflow-hidden flex items-center justify-center rounded transition-all duration-300">
                              <WorkloadGif 
                                src="https://lh3.googleusercontent.com/d/1PHbRg6P6mh3Hmmw3yBPfp98sg0ihzO7F" 
                                alt="Galapagos Loop"
                                isArch={false}
                                forcePlay={false}
                                isInModal={true}
                                className="w-full h-full object-contain p-1 pointer-events-none select-none opacity-90 transition-all duration-700"
                              />
                              
                              {/* Direct overlay blocking and status watermark */}
                              <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/85 backdrop-blur font-mono text-[7px] text-[#00f3ff] border border-white/10 select-none pointer-events-none">
                                GALAPAGOS_WEIGHTED_RUN: ACTIVE
                              </div>

                              {/* Transparent Absolute Overlay Shield preventing direct interactions */}
                              <div 
                                className="absolute inset-0 z-20 bg-transparent select-none pointer-events-auto" 
                                onContextMenu={(e) => e.preventDefault()}
                                onDragStart={(e) => e.preventDefault()}
                              />
                              
                              {/* Click to expand hover */}
                              <div 
                                onClick={() => {
                                  setExpandedMedia({
                                    src: "https://lh3.googleusercontent.com/d/1PHbRg6P6mh3Hmmw3yBPfp98sg0ihzO7F",
                                    isVideo: false,
                                    isGif: true,
                                    googleDriveId: getDriveId("https://lh3.googleusercontent.com/d/1PHbRg6P6mh3Hmmw3yBPfp98sg0ihzO7F"),
                                    alt: "Galapagos Single-Objective Evolutionary Study"
                                  });
                                }}
                                className="absolute inset-0 bg-[#0a0a0c]/80 opacity-0 group-hover/pvizg:opacity-100 flex items-center justify-center transition-all duration-300 cursor-zoom-in z-30 pointer-events-auto"
                              >
                                <div className="flex items-center gap-1.5 px-2 py-1 border border-[#00f3ff] bg-black/95 text-[#00f3ff] font-mono text-[8px] tracking-wider uppercase shadow-lg">
                                  <Maximize2 className="w-3 h-3" />
                                  Expand Galapagos
                                </div>
                              </div>
                            </div>
                            <p className="text-[10px] font-mono text-gray-400 leading-relaxed bg-[#020304] p-2 border border-white/10 rounded">
                              Calibrates a single weighted equation index. Galapagos achieves rapid local convergence but lacks the ability to explore independent Pareto-front trade-offs.
                            </p>
                          </div>

                          {/* Option B: Wallacei (Multi-Objective) */}
                          <div className="space-y-2 group/pvizw">
                            <div className="flex justify-between items-center bg-black/45 p-2 border border-white/10 font-mono text-[9px] uppercase">
                              <span className="text-[#00f3ff] font-semibold">Option B: Wallacei</span>
                              <span className="text-neon-cyan/80">[Multi-Objective]</span>
                            </div>
                            
                            <div className="w-full h-[220px] sm:h-[300px] md:h-[350px] border border-white/10 bg-[#020304] relative overflow-hidden flex items-center justify-center rounded transition-all duration-300">
                              <WorkloadGif 
                                src="https://lh3.googleusercontent.com/d/1MrB6VdmorBcdtuSIq1eLdV1FTylWXOyN" 
                                alt="Wallacei Engine"
                                isArch={false}
                                forcePlay={false}
                                isInModal={true}
                                className="w-full h-full object-contain p-1 pointer-events-none select-none opacity-90 transition-all duration-700"
                              />
                              
                              {/* Direct overlay blocking and status watermark */}
                              <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/85 backdrop-blur font-mono text-[7px] text-neon-cyan border border-white/10 select-none pointer-events-none">
                                WALLACEI_PARETO_CLOUD: ACTIVE
                              </div>

                              {/* Transparent Absolute Overlay Shield preventing direct interactions */}
                              <div 
                                className="absolute inset-0 z-20 bg-transparent select-none pointer-events-auto" 
                                onContextMenu={(e) => e.preventDefault()}
                                onDragStart={(e) => e.preventDefault()}
                              />
                              
                              {/* Click to expand hover */}
                              <div 
                                onClick={() => {
                                  setExpandedMedia({
                                    src: "https://lh3.googleusercontent.com/d/1MrB6VdmorBcdtuSIq1eLdV1FTylWXOyN",
                                    isVideo: false,
                                    isGif: true,
                                    googleDriveId: getDriveId("https://lh3.googleusercontent.com/d/1MrB6VdmorBcdtuSIq1eLdV1FTylWXOyN"),
                                    alt: "Wallacei Multi-Objective Evolutionary Study"
                                  });
                                }}
                                className="absolute inset-0 bg-[#0a0a0c]/80 opacity-0 group-hover/pvizw:opacity-100 flex items-center justify-center transition-all duration-300 cursor-zoom-in z-30 pointer-events-auto"
                              >
                                <div className="flex items-center gap-1.5 px-2 py-1 border border-white/10 bg-black/95 text-neon-cyan font-mono text-[8px] tracking-wider uppercase shadow-lg">
                                  <Maximize2 className="w-3 h-3" />
                                  Expand Wallacei
                                </div>
                              </div>
                            </div>
                            <p className="text-[10px] font-mono text-gray-400 leading-relaxed bg-[#020304] p-2 border border-white/10 rounded">
                              Independently loops shading performance, structural mass, and cost factors, dynamically graphing a multi-dimensional Pareto non-dominated solution set.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className={`text-[10px] font-mono uppercase tracking-widest transition-colors duration-700 ${isArch ? "text-gray-400" : "text-neon-cyan"}`}>
                          // 01 . {isArch ? "VISUAL NARRATIVE" : "PROCESS VISUALIZATION"}
                        </div>
                        <div className={`w-full h-[300px] sm:h-[420px] md:h-[520px] lg:h-[580px] xl:h-[640px] border relative overflow-hidden flex items-center group/pviz justify-center transition-all duration-700 ${isArch ? "border-gray-100 bg-[#f7f8f9]" : "brutalist-border rounded-2xl overflow-hidden bg-[#020304]"}`}>
                          <WorkloadGif 
                            src={selectedArsenalItem.gifUrl} 
                            alt="Workflow GIF"
                            isArch={isArch}
                            forcePlay={false}
                            isInModal={true}
                            className={`w-full h-full object-contain p-1 transition-all duration-700 pointer-events-none select-none ${isArch ? "opacity-100" : "opacity-95"}`}
                          />
                          {!isArch && (
                            <div className="absolute top-3 left-3 px-2 py-1 bg-black/55 backdrop-blur font-mono text-[8px] text-neon-cyan border border-white/10/25">
                              RAW_FEED_STREAMING...
                            </div>
                          )}
                          {selectedArsenalItem.scriptUrl && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedMedia({
                                  src: selectedArsenalItem.scriptUrl!,
                                  isVideo: false,
                                  googleDriveId: getDriveId(selectedArsenalItem.scriptUrl!),
                                  alt: `Grasshopper Script - ${selectedArsenalItem.title}`
                                });
                              }}
                              className={`absolute bottom-3 left-3 px-3 py-1.5 text-[9px] font-mono tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 z-[30] pointer-events-auto shadow-md ${
                                isArch 
                                  ? "bg-white text-black hover:bg-black hover:text-white border border-gray-200" 
                                  : "bg-black/95 text-neon-cyan hover:bg-neon-cyan hover:text-black border border-white/10/35"
                              }`}
                            >
                              <Code2 className="w-3.5 h-3.5 animate-pulse" />
                              Show Script
                            </button>
                          )}
                          {/* Hover overlay to expand */}
                          <div 
                            onClick={() => {
                              const isVid = selectedArsenalItem.gifUrl.includes("#video") || selectedArsenalItem.gifUrl.toLowerCase().endsWith(".mp4") || selectedArsenalItem.gifUrl.toLowerCase().endsWith(".mov") || selectedArsenalItem.gifUrl.includes("1h89DNz0NAtQeH_rtLlNxXqN0ZI_9FXuk");
                              const gdId = getDriveId(selectedArsenalItem.gifUrl);
                              setExpandedMedia({
                                src: selectedArsenalItem.gifUrl,
                                isVideo: isVid,
                                isGif: !isVid,
                                googleDriveId: gdId,
                                alt: "Process Visualization"
                              });
                            }}
                            className="absolute inset-0 bg-[#0a0a0c]/80 opacity-0 group-hover/pviz:opacity-100 flex items-center justify-center transition-all duration-300 cursor-zoom-in z-20 pointer-events-auto"
                          >
                            <div className={`flex items-center gap-2 px-3 py-1.5 border font-sans text-[11px] font-medium tracking-wide tracking-widest uppercase transition-all duration-500 transform scale-95 group-hover/pviz:scale-100 ${
                              isArch 
                                ? "border-black bg-white text-black font-bold shadow-lg" 
                                : "border-white/10 bg-black/90 text-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.25)]"
                            }`}>
                              <Maximize2 className="w-3.5 h-3.5" />
                              Expand View
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {!isArch && selectedArsenalItem.content && (
                      <div className="space-y-4">
                        <div className={`text-[10px] font-mono uppercase tracking-widest border-b pb-2 transition-colors duration-700 ${isArch ? "text-black border-gray-100" : "text-white border-white/5"}`}>
                          // 02 . SYSTEM OUTPUT
                        </div>
                        {selectedArsenalItem.content}
                      </div>
                    )}


                  </div>

                  {/* Right: Detailed Content */}
                  <div className="space-y-10">
                    {!isArch && selectedArsenalItem.ledger && (
                      <div className="space-y-3">
                        <div className={`text-[10px] font-mono uppercase tracking-widest transition-colors duration-700 ${isArch ? "text-gray-500" : "text-neon-cyan"}`}>
                          // 03 . {isArch ? "PROJECT LEDGER" : "TECHNICAL LEDGER"}
                        </div>
                        <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 p-4 border transition-all duration-700 rounded-xl ${
                          isArch 
                            ? "bg-stone-50/70 border-stone-200 text-stone-800" 
                            : "bg-black/90 border-[#00f3ff]/20 text-gray-400 shadow-[0_0_15px_rgba(0,243,255,0.02)]"
                        }`}>
                          {/* Inputs */}
                          <div className={`flex flex-col space-y-1 pr-2 ${
                            isArch ? "border-stone-200" : "border-white/10"
                          } border-b md:border-b-0 border-r-0 md:border-r border-dashed pb-3 md:pb-0 mb-3 md:mb-0 last:border-0 last:pb-0 last:mb-0`}>
                            <span className={`text-[8px] font-mono font-bold tracking-widest uppercase ${isArch ? "text-stone-500" : "text-neon-cyan"}`}>
                              INPUTS
                            </span>
                            <span className={`text-[10.5px] leading-relaxed font-semibold ${isArch ? "font-sans text-stone-700" : "font-mono text-gray-400"}`}>
                              {selectedArsenalItem.ledger.inputs}
                            </span>
                          </div>

                          {/* Engine / Process */}
                          <div className={`flex flex-col space-y-1 pr-2 ${
                            isArch ? "border-stone-200" : "border-white/10"
                          } border-b md:border-b-0 border-r-0 md:border-r border-dashed pb-3 md:pb-0 mb-3 md:mb-0 last:border-0 last:pb-0 last:mb-0`}>
                            <span className={`text-[8px] font-mono font-bold tracking-widest uppercase ${isArch ? "text-stone-500" : "text-neon-orange"}`}>
                              {isArch ? "PROCESS" : "ENGINE"}
                            </span>
                            <span className={`text-[10.5px] leading-relaxed font-semibold ${isArch ? "font-sans text-stone-700" : "font-mono text-gray-400"}`}>
                              {selectedArsenalItem.ledger.engine}
                            </span>
                          </div>

                          {/* Outputs */}
                          <div className="flex flex-col space-y-1">
                            <span className={`text-[8px] font-mono font-bold tracking-widest uppercase ${isArch ? "text-stone-500" : "text-emerald-400"}`}>
                              OUTPUTS
                            </span>
                            <span className={`text-[10.5px] leading-relaxed font-semibold ${isArch ? "font-sans text-stone-700" : "font-mono text-gray-400"}`}>
                              {selectedArsenalItem.ledger.outputs}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}



                    {isArch && selectedArsenalItem.details && (
                      <div className="space-y-10">
                        {/* 01. KEY SPATIAL & DESIGN SPECS */}
                        <div className="space-y-4">
                          <div className="text-[10px] font-mono uppercase tracking-widest text-black font-bold border-b border-gray-200 pb-2">
                            // 01 . KEY SPATIAL & DESIGN SPECS
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-50 border border-stone-200 p-4 rounded-xl">
                            <div>
                              <span className="block text-[9px] font-mono text-stone-500 uppercase tracking-widest mb-1">Role / Scope</span>
                              <span className="text-xs font-sans text-stone-800 font-semibold">{selectedArsenalItem.role || "Lead Designer"}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] font-mono text-stone-500 uppercase tracking-widest mb-1">Project Typology</span>
                              <span className="text-xs font-sans text-stone-800 font-semibold">{selectedArsenalItem.category || "Architecture"} {selectedArsenalItem.metric ? `• ${selectedArsenalItem.metric}` : ""}</span>
                            </div>
                          </div>
                        </div>

                        {/* 02. SOFTWARE & DELIVERY BADGES */}
                        <div className="space-y-4">
                          <div className="text-[10px] font-mono uppercase tracking-widest text-black font-bold border-b border-gray-200 pb-2">
                            // 02 . SOFTWARE & DELIVERY BADGES
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedArsenalItem.tags?.map((tag: string, idx: number) => (
                               <span key={`arch-tag-${idx}`} className="bg-white text-stone-800 border border-stone-300 shadow-sm px-2.5 py-1 text-[10px] font-mono rounded-md font-semibold">
                                 {tag}
                               </span>
                            ))}
                          </div>
                        </div>

                        {/* 03. PROJECT STORY / NARRATIVE */}
                        <div className="space-y-4">
                          <div className="text-[10px] font-mono uppercase tracking-widest text-black font-bold border-b border-gray-200 pb-2">
                            // 03 . PROJECT STORY / NARRATIVE
                          </div>
                          <div className="space-y-5">
                            {selectedArsenalItem.details.overview && (
                              <p className="text-xs tracking-wide leading-relaxed text-gray-700 font-sans">
                                {selectedArsenalItem.details.overview}
                              </p>
                            )}
                            {selectedArsenalItem.details.challenge && (
                              <div>
                                 <strong className="block text-[10px] font-mono text-stone-500 uppercase tracking-widest mb-1">The Challenge</strong>
                                 <p className="text-xs tracking-wide leading-relaxed text-gray-700 font-sans">
                                   {selectedArsenalItem.details.challenge}
                                 </p>
                              </div>
                            )}
                            {selectedArsenalItem.details.solution && (
                              <div>
                                 <strong className="block text-[10px] font-mono text-stone-500 uppercase tracking-widest mb-1">The Solution & Execution</strong>
                                 <p className="text-xs tracking-wide leading-relaxed text-gray-700 font-sans">
                                   {selectedArsenalItem.details.solution}
                                 </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {!isArch && selectedArsenalItem.details && (
                      <>
                        {selectedArsenalItem.details.publication && (
                          <div className={`p-4 border rounded-md flex items-start gap-3 transition-colors duration-700 bg-[#00f3ff]/5 border-[#00f3ff]/20 text-[#00f3ff]`}>
                            <Award className="w-5 h-5 shrink-0 mt-0.5 animate-pulse" />
                            <div className="space-y-1">
                              <div className="text-[10px] font-mono uppercase tracking-wider opacity-75">
                                Publication Record
                              </div>
                              <p className={`text-xs leading-relaxed font-mono`}>
                                {selectedArsenalItem.details.publication}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="space-y-4">
                          <div className={`text-[10px] font-mono uppercase tracking-widest transition-colors duration-700 text-neon-cyan`}>
                            // 04 . PROJECT OVERVIEW
                          </div>
                          <p className={`text-xs tracking-wide leading-relaxed transition-colors duration-700 text-zinc-400 font-mono`}>
                            {selectedArsenalItem.details.overview}
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className={`text-[10px] font-mono uppercase tracking-widest transition-colors duration-700 text-neon-orange`}>
                            // 05 . THE CHALLENGE
                          </div>
                          <p className={`text-xs tracking-wide leading-relaxed transition-colors duration-700 text-zinc-400 font-mono`}>
                            {selectedArsenalItem.details.challenge}
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className={`text-[10px] font-mono uppercase tracking-widest transition-colors duration-700 text-neon-cyan`}>
                            // 06 . THE SOLUTION
                          </div>
                          <p className={`text-xs tracking-wide leading-relaxed transition-colors duration-700 text-zinc-400 font-mono`}>
                            {selectedArsenalItem.details.solution}
                          </p>
                        </div>
                        {selectedArsenalItem.details.githubUrl && (
                          <div className="pt-4 mt-4">
                            <a href={selectedArsenalItem.details.githubUrl} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest border transition-all duration-300 rounded ${isArch ? "border-black text-black hover:bg-black hover:text-white" : "border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black"}`}>
                              View Source Code
                            </a>
                          </div>
                        )}

                        {((selectedArsenalItem.details && (selectedArsenalItem.details.reportUrl || selectedArsenalItem.details.sheetsUrl || selectedArsenalItem.details.videoUrl)) || selectedArsenalItem.scriptUrl) && (
                          <div className="space-y-4 pt-4">
                            <div className={`text-[10px] font-mono uppercase tracking-widest transition-colors duration-700 ${isArch ? "text-black" : "text-neon-cyan"}`}>
                              // 07 . DOCUMENTATION
                            </div>
                            <div className="flex flex-wrap gap-4">
                                {selectedArsenalItem.details?.reportUrl && (
                                  <a 
                                    href={selectedArsenalItem.details.reportUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-2 px-4 py-2 border text-[10px] font-mono uppercase tracking-widest transition-all duration-700 ${
                                      isArch 
                                      ? "border-black bg-black text-white hover:bg-white hover:text-black" 
                                      : "brutalist-border rounded-2xl overflow-hidden bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan hover:text-black"
                                    }`}
                                  >
                                    <FileText className="w-3 h-3" />
                                    {selectedArsenalItem.details.reportLabel || "View Full Report"}
                                  </a>
                                )}

                              {selectedArsenalItem.details?.sheetsUrl && (
                                <a 
                                  href={selectedArsenalItem.details.sheetsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`inline-flex items-center gap-2 px-4 py-2 border text-[10px] font-mono uppercase tracking-widest transition-all duration-700 ${
                                    isArch 
                                    ? "border-black bg-white text-black hover:bg-black hover:text-white" 
                                    : "brutalist-border rounded-2xl overflow-hidden bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan hover:text-black"
                                  }`}
                                >
                                  <Layers className="w-3 h-3" />
                                  View Sheets
                                </a>
                              )}

                              {selectedArsenalItem.details?.videoUrl && (
                                <button 
                                  onClick={() => {
                                    setExpandedMedia({
                                      src: selectedArsenalItem.details!.videoUrl!,
                                      isVideo: true,
                                      googleDriveId: getDriveId(selectedArsenalItem.details!.videoUrl!),
                                      alt: "Full Presentation Movie"
                                    });
                                  }}
                                  className={`inline-flex items-center gap-2 px-4 py-2 border text-[10px] font-mono uppercase tracking-widest transition-all duration-700 pointer-events-auto cursor-pointer ${
                                    isArch 
                                    ? "border-black bg-white text-black hover:bg-black hover:text-white" 
                                    : "brutalist-border rounded-2xl overflow-hidden bg-neon-orange/10 text-neon-orange hover:bg-neon-orange hover:text-black"
                                  }`}
                                >
                                  <Play className="w-3 h-3 animate-pulse" />
                                  Watch Full Movie
                                </button>
                              )}

                              {selectedArsenalItem.scriptUrl && (
                                <button 
                                  onClick={() => {
                                    setExpandedMedia({
                                      src: selectedArsenalItem.scriptUrl!,
                                      isVideo: false,
                                      googleDriveId: getDriveId(selectedArsenalItem.scriptUrl!),
                                      alt: "Grasshopper Script"
                                    });
                                  }}
                                  className={`inline-flex items-center gap-2 px-4 py-2 border text-[10px] font-mono uppercase tracking-widest transition-all duration-700 pointer-events-auto cursor-pointer ${
                                    isArch 
                                    ? "border-black bg-black text-white hover:bg-white hover:text-black" 
                                    : "brutalist-border rounded-2xl overflow-hidden bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan hover:text-black"
                                  }`}
                                >
                                  <Code2 className="w-3 h-3 animate-pulse" />
                                  Show Script
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {selectedArsenalItem.details.comparisonTable && (
                          <div className="space-y-4 pt-4">
                            <div className={`text-[10px] font-mono uppercase tracking-widest transition-colors duration-700 ${isArch ? "text-black" : "text-neon-cyan"}`}>
                              // 08 . KEY METRICS & PERFORMANCE IMPACT
                            </div>
                            <div className="hidden md:block overflow-x-auto border brutalist-border rounded-2xl overflow-hidden bg-[#0a0a0c]/80">
                              <table className={`w-full text-left font-mono text-xs border-collapse ${isArch ? "border-gray-200" : "border-white/10"}`}>
                                <thead>
                                  <tr className={isArch ? "bg-gray-100/80 border-b border-gray-200" : "bg-[#0a0a0c]/95 border-b border-white/10"}>
                                    {selectedArsenalItem.details.comparisonTable.headers.map((hdr, idx) => (
                                      <th key={`hdr-${idx}`} className={`p-3 font-bold uppercase tracking-wider text-[10px] ${isArch ? "text-gray-700 font-sans" : "text-neon-cyan"}`}>
                                        {hdr}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className={`divide-y ${isArch ? "divide-gray-100" : "divide-terminal-border/10"}`}>
                                  {selectedArsenalItem.details.comparisonTable.rows.map((row, rIdx) => (
                                    <tr key={`row-${rIdx}`} className={`transition-colors duration-500 ${isArch ? "hover:bg-gray-50/50" : "hover:bg-white/[0.01]"}`}>
                                      {row.map((cell, cIdx) => {
                                        const isAutomatedCol = cIdx === 2;
                                        return (
                                          <td key={`cell-${cIdx}`} 
                                            className={`p-3 align-middle text-[11px] ${
                                              isAutomatedCol
                                                ? (isArch ? "text-emerald-600 font-bold bg-emerald-50/15" : "text-neon-orange font-bold bg-neon-orange/[0.02]")
                                                : (cIdx === 0 ? (isArch ? "text-black font-semibold font-sans" : "text-white font-semibold") : (isArch ? "text-gray-500 font-sans" : "text-gray-400"))
                                            }`}
                                          >
                                            {cell}
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div className="md:hidden flex flex-col gap-3">
                              {selectedArsenalItem.details.comparisonTable.rows.map((row, rIdx) => (
                                <div key={`mob-row-${rIdx}`} className={`p-3 rounded-lg border flex flex-col gap-2 ${isArch ? "bg-white border-gray-200" : "bg-[#0a0a0c]/80 border-white/10"}`}>
                                  <div className={`font-bold font-mono text-xs ${isArch ? "text-black" : "text-white"}`}>{row[0]}</div>
                                  <div className="flex flex-col gap-1.5 text-[10px] font-mono">
                                    <div className="flex flex-col gap-1 pb-2 border-b border-gray-500/20">
                                      <span className="text-gray-500">{selectedArsenalItem.details.comparisonTable.headers[1]}</span>
                                      <span className={isArch ? "text-gray-700" : "text-gray-300"}>{row[1]}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 pt-1">
                                      <span className="text-gray-500">{selectedArsenalItem.details.comparisonTable.headers[2]}</span>
                                      <span className={isArch ? "text-emerald-600 font-bold" : "text-neon-orange font-bold"}>{row[2]}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}


                      </>
                    )}

                    {/* Removed Performance/Impact Metric box */}
                  </div>
                </div>

                {/* Full-width Workflow section (Methodology / Execution Logic) */}
                {selectedArsenalItem.workflow && (
                  <div className={`space-y-4 md:space-y-6 pt-10 mt-10 border-t transition-all duration-700 ${isArch ? "border-gray-200" : "border-white/10"}`}>
                    <div className={`text-[10px] font-mono uppercase tracking-widest border-b pb-2 transition-colors duration-700 ${isArch ? "text-black border-gray-100 font-bold" : "text-neon-cyan border-white/5"}`}>
                      // 09 . {isArch ? "METHODOLOGY" : "EXECUTION LOGIC"}
                    </div>
                    
                    <div className={`relative p-5 md:p-6 rounded-lg overflow-x-auto scrollbar-thin ${
                      isArch 
                        ? "bg-gray-50/50 border border-gray-150 scrollbar-thumb-gray-300" 
                        : "bg-[#04070a] border border-white/10 scrollbar-thumb-white/10"
                    }`}>
                      <div className="min-w-max relative flex items-center py-2">
                        {/* Glowing horizontal line running behind the cards */}
                        <div className={`absolute top-1/2 left-0 right-0 h-[1px] -translate-y-1/2 z-0 ${
                          isArch 
                            ? "border-t border-stone-300 border-dashed" 
                            : "border-t border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                        }`} />
                        
                        <div className="flex items-center gap-3 relative z-10 w-full">
                          {selectedArsenalItem.workflow.steps.map((step, i) => (
                            <React.Fragment key={`step-${i}`}>
                              <div className="relative flex items-center justify-center shrink-0 group">
                                {/* Glowing Pill Badge */}
                                <div className={`absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full border flex items-center justify-center font-mono text-[10px] font-bold transition-all duration-300 ${
                                  isArch 
                                    ? "bg-white border-black text-black shadow-sm" 
                                    : "bg-[#04070a] border-emerald-500/80 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.8)] group-hover:bg-emerald-950/30"
                                }`}>
                                  0{i + 1}
                                </div>
                                
                                {/* Step Card */}
                                <div className={`relative z-10 ml-4 w-52 p-4 pl-6 border rounded-lg flex items-center min-h-[90px] transition-all duration-300 ${
                                  isArch 
                                    ? "bg-white border-gray-200 shadow-sm hover:border-black" 
                                    : "bg-[#0a0a0c] border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.8)] hover:border-emerald-500/40"
                                }`}>
                                  <p className={`text-[11px] leading-relaxed ${
                                    isArch ? "text-stone-700 font-sans" : "text-gray-300 font-mono"
                                  }`}>
                                    {step}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Directional Arrow */}
                              {i < selectedArsenalItem.workflow.steps.length - 1 && (
                                <div className="relative z-10 shrink-0 flex items-center justify-center w-6">
                                   <span className={`text-[15px] font-bold px-1 ${
                                     isArch 
                                       ? "text-stone-400 bg-gray-50/50" 
                                       : "text-emerald-500/70 bg-[#04070a] drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]"
                                   }`}>→</span>
                                </div>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Full-width Thesis Presentation Sheets */}
                {selectedArsenalItem.id === "ARCH_05" && (() => {
                  const sheetsUrl = selectedArsenalItem.details?.sheetsUrl || "https://drive.google.com/file/d/1G2zBH44ll0Yq8nb-djHHUwc14fW4jXAp/view?usp=sharing";
                  const isFolder = sheetsUrl.includes('/folders/') || sheetsUrl.includes('embeddedfolderview');
                  const sheetDriveId = getDriveId(sheetsUrl);
                  const embedSrc = isFolder 
                    ? `https://drive.google.com/embeddedfolderview?id=${sheetDriveId || "1ow-E8p-3WvpReBLDsSdUR5DnheaNVJ4M"}#grid`
                    : `https://drive.google.com/file/d/${sheetDriveId || "1G2zBH44ll0Yq8nb-djHHUwc14fW4jXAp"}/preview`;

                  return (
                    <div className={`space-y-6 pt-10 mt-10 border-t transition-all duration-700 ${isArch ? "border-gray-200" : "border-white/10"}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                        <div className={`text-[10px] font-mono uppercase tracking-widest transition-colors duration-700 ${isArch ? "text-stone-900 font-bold" : "text-neon-cyan"}`}>
                          // 10 . THESIS PRESENTATION SHEETS
                        </div>
                        
                        <a
                          href={sheetsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`shrink-0 px-3 py-1 font-mono text-[9px] uppercase tracking-wider rounded transition-all flex items-center justify-center gap-1.5 shadow ${
                            isArch 
                              ? "border-black bg-black text-white hover:bg-white hover:text-black" 
                              : "border-white/10 bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan hover:text-black"
                          }`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Open Full View
                        </a>
                      </div>

                      <div className={`p-4 border rounded transition-colors duration-700 ${
                        isArch 
                          ? "bg-amber-50/50 border-amber-200/60" 
                          : "bg-[#04070a] border-white/10 text-gray-400"
                      }`}>
                        <h4 className={`text-xs font-bold uppercase tracking-wider ${isArch ? "text-stone-900 font-sans" : "text-neon-cyan font-mono"}`}>
                          Academic Presentation Boards
                        </h4>
                        <p className={`text-[11px] leading-relaxed max-w-4xl mt-1 ${isArch ? "text-stone-600 font-sans" : "text-gray-400 font-mono"}`}>
                          Natively browse the structural masterplans, section elevations, biophilic layout boards, and detailed execution design sheets.
                        </p>
                      </div>
                      
                      <div className={`w-full h-[580px] sm:h-[680px] xl:h-[780px] border shadow-inner relative overflow-hidden rounded ${
                        isArch ? "border-gray-200 bg-white" : "border-white/10 bg-[#020304]"
                      }`}>
                        <iframe
                          src={`https://drive.google.com/embeddedfolderview?id=1ow-E8p-3WvpReBLDsSdUR5DnheaNVJ4M#grid`}
                          className="w-full h-full border-0"
                          title="Karunya Hospice and Palliative Care Center Thesis Sheets Viewer Layout"
                          allow="autoplay"
                        ></iframe>
                      </div>
                    </div>
                  );
                })()}

                {/* Full-width Technical Gallery */}
                {selectedArsenalItem.id !== "ARCH_05" && selectedArsenalItem.details?.images && selectedArsenalItem.details.images.length > 0 && (
                  <div className={`space-y-6 pt-10 mt-10 border-t transition-all duration-700 ${isArch ? "border-gray-200" : "border-white/10"}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                      <div className={`text-[10px] font-mono uppercase tracking-widest transition-colors duration-700 ${isArch ? "text-stone-900 font-bold" : "text-neon-cyan"}`}>
                        // {isArch ? "04 . HIGH-RES GALLERY & AUTO CAROUSEL" : "11 . SYSTEM DRAWINGS & ANALYTICS"}
                      </div>
                      
                      {/* Gallery Navigation Tabs (Renders vs. Drawings) */}
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => setGalleryFilter('all')}
                          className={`px-2.5 py-1 text-[8px] font-mono uppercase tracking-wider border rounded transition-all cursor-pointer ${
                            galleryFilter === 'all'
                              ? isArch
                                ? "bg-black text-white border-black font-bold"
                                : "bg-neon-cyan/25 text-neon-cyan border-white/10 font-bold shadow-[0_0_6px_rgba(1,242,255,0.2)]"
                              : isArch
                                ? "border-gray-200 text-gray-500 hover:text-black hover:border-black bg-white"
                                : "border-white/10 text-gray-400 hover:text-[#6366F1] hover:border-white/10 bg-[#0a0a0c]/80"
                          }`}
                        >
                          All ({selectedArsenalItem.details.images.length})
                        </button>
                        {selectedArsenalItem.details.images.some((img, idx) => getGalleryItemType(img, idx, selectedArsenalItem.id) === 'render') && (
                          <button
                            type="button"
                            onClick={() => setGalleryFilter('render')}
                            className={`px-2.5 py-1 text-[8px] font-mono uppercase tracking-wider border rounded transition-all cursor-pointer ${
                              galleryFilter === 'render'
                                ? isArch
                                  ? "bg-black text-white border-black font-bold"
                                  : "bg-neon-cyan/25 text-neon-cyan border-white/10 font-bold shadow-[0_0_6px_rgba(1,242,255,0.2)]"
                                : isArch
                                  ? "border-gray-200 text-gray-500 hover:text-black hover:border-black bg-white"
                                  : "border-white/10 text-gray-400 hover:text-[#6366F1] hover:border-white/10 bg-[#0a0a0c]/80"
                            }`}
                          >
                            Renders ({
                              selectedArsenalItem.details.images.filter((img, idx) => getGalleryItemType(img, idx, selectedArsenalItem.id) === 'render').length
                            })
                          </button>
                        )}
                        
                        {selectedArsenalItem.details.images.some((img, idx) => getGalleryItemType(img, idx, selectedArsenalItem.id) === 'drawing') && (
                          <button
                            type="button"
                            onClick={() => setGalleryFilter('drawing')}
                            className={`px-2.5 py-1 text-[8px] font-mono uppercase tracking-wider border rounded transition-all cursor-pointer ${
                              galleryFilter === 'drawing'
                                ? isArch
                                  ? "bg-black text-white border-black font-bold"
                                  : "bg-neon-cyan/25 text-neon-cyan border-white/10 font-bold shadow-[0_0_6px_rgba(1,242,255,0.2)]"
                                : isArch
                                  ? "border-gray-200 text-gray-500 hover:text-black hover:border-black bg-white"
                                  : "border-white/10 text-gray-400 hover:text-[#6366F1] hover:border-white/10 bg-[#0a0a0c]/80"
                            }`}
                          >
                            Drawings ({
                              selectedArsenalItem.details.images.filter((img, idx) => getGalleryItemType(img, idx, selectedArsenalItem.id) === 'drawing').length
                            })
                          </button>
                        )}
                        {selectedArsenalItem.details.images.some((img, idx) => getGalleryItemType(img, idx, selectedArsenalItem.id) === 'video') && (
                          <button
                            type="button"
                            onClick={() => setGalleryFilter('video')}
                            className={`px-2.5 py-1 text-[8px] font-mono uppercase tracking-wider border rounded transition-all cursor-pointer ${
                              galleryFilter === 'video'
                                ? isArch
                                  ? "bg-black text-white border-black font-bold"
                                  : "bg-neon-cyan/25 text-neon-cyan border-white/10 font-bold shadow-[0_0_6px_rgba(1,242,255,0.2)]"
                                : isArch
                                  ? "border-gray-200 text-gray-500 hover:text-black hover:border-black bg-white"
                                  : "border-white/10 text-gray-400 hover:text-[#6366F1] hover:border-white/10 bg-[#0a0a0c]/80"
                            }`}
                          >
                            Videos ({
                              selectedArsenalItem.details.images.filter((img, idx) => getGalleryItemType(img, idx, selectedArsenalItem.id) === 'video').length
                            })
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="overflow-hidden relative w-full">
                      <div className="carousel-track flex gap-6">
                        {/* Duplicate the array to create an infinite loop effect */}
                        {[...selectedArsenalItem.details.images, ...selectedArsenalItem.details.images]
                        .map((img, idx) => ({ 
                          img, 
                          idx: idx % selectedArsenalItem.details.images.length, 
                          type: getGalleryItemType(img, idx % selectedArsenalItem.details.images.length, selectedArsenalItem.id) 
                        }))
                        .filter(item => galleryFilter === 'all' || item.type === galleryFilter)
                        .map(({ img, idx, type }, uniqueIdx) => {
                          const isVideo = type === 'video';
                          const googleDriveId = getDriveId(img);
                          const thumbSrc = getStaticThumbnailUrl(img);
                          return (
                            <div key={`gallery-${selectedArsenalItem.id}-${uniqueIdx}`} className="flex flex-col gap-3 group/gal carousel-item">
                              <div 
                                onClick={() => {
                                  setExpandedMedia({
                                    src: img,
                                    isVideo,
                                    googleDriveId,
                                    alt: selectedArsenalItem.details?.captions?.[idx] || (type === 'drawing' ? `Technical Drawing Details ${idx + 1}` : `High Quality Render ${idx + 1}`)
                                  });
                                }}
                                className={`aspect-video border relative overflow-hidden transition-all duration-700 cursor-zoom-in rounded ${
                                  isArch ? "border-gray-150 bg-gray-50 hover:border-black shadow-sm" : "brutalist-border rounded-2xl overflow-hidden bg-black hover:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                                }`}
                              >
                                {/* Thumbnail Image */}
                                <img loading="lazy" 
                                  src={thumbSrc} 
                                  alt={selectedArsenalItem.details?.captions?.[idx] || (type === 'drawing' ? `Technical Drawing details ${idx + 1}` : `Rendering ${idx + 1}`)}
                                  onContextMenu={(e) => e.preventDefault()}
                                  onDragStart={(e) => e.preventDefault()}
                                  className={`w-full h-full object-cover transition-all duration-700 select-none pointer-events-none ${
                                    isArch ? "opacity-100 group-hover/gal:scale-105" : "opacity-70 group-hover/gal:opacity-100 group-hover/gal:scale-105"
                                  }`}
                                  referrerPolicy="no-referrer"
                                />

                                {/* Subtle Overlay Badge */}
                                <div className={`absolute top-2 left-2 px-1.5 py-0.5 font-mono text-[7px] border transition-colors duration-700 tracking-wider ${
                                  isArch 
                                    ? "bg-white/90 backdrop-blur text-black border-gray-200 font-bold" 
                                    : "bg-black/90 backdrop-blur text-gray-400 border-gray-850"
                                }`}>
                                  {type === 'video' 
                                    ? "VIDEO_FEED" 
                                    : type === 'drawing' 
                                      ? "TECHNICAL_DRAWING" 
                                      : "RENDER_VISUAL"}
                                </div>

                                {/* Play / Expand Overlay */}
                                <div className="absolute inset-0 bg-[#0a0a0c]/80 opacity-0 group-hover/gal:opacity-100 flex items-center justify-center transition-all duration-300">
                                  <div className={`p-2.5 rounded-full border transition-all duration-500 transform scale-95 group-hover/gal:scale-100 ${
                                    isArch 
                                      ? "bg-white border-black text-black shadow-lg" 
                                      : "bg-black/90 border-white/10 text-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.25)]"
                                  }`}>
                                    {isVideo ? <Play className="w-4 h-4 fill-current ml-0.5" /> : <Maximize2 className="w-4 h-4" />}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Optional Caption */}
                              {selectedArsenalItem.details?.captions && selectedArsenalItem.details.captions[idx] && (
                                <div className={`text-[10px] md:text-xs font-serif ${isArch ? "text-gray-600" : "text-gray-400 font-mono"} text-center px-2 pb-2 leading-tight`}>
                                  {selectedArsenalItem.details.captions[idx]}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Embedded Folders Section */}
                {selectedArsenalItem.details?.embeddedFolders && selectedArsenalItem.details.embeddedFolders.length > 0 && (
                  <div className={`space-y-6 pt-10 mt-10 border-t transition-all duration-700 ${isArch ? "border-gray-200" : "border-white/10"}`}>
                    <div className={`text-[10px] font-mono uppercase tracking-widest transition-colors duration-700 border-b pb-3 ${isArch ? "text-stone-900 font-bold" : "text-neon-cyan"}`}>
                      // 11.5 . {isArch ? "DOCUMENTATION FOLDERS" : "DATA REPOSITORIES"}
                    </div>
                    <div className="space-y-8">
                      {selectedArsenalItem.details.embeddedFolders.map((folder, idx) => (
                        <div key={"folder-" + idx} className="space-y-3">
                          <h4 className={`text-xs font-bold ${isArch ? "text-stone-800" : "text-gray-200"}`}>
                            {folder.title}
                          </h4>
                          <div className={`w-full overflow-hidden rounded-xl border ${isArch ? "border-gray-300" : "border-white/10"}`}>
                            <iframe 
                              src={`https://drive.google.com/embeddedfolderview?id=${folder.folderId}#grid`} 
                              style={{ width: '100%', height: '500px', border: 0 }} 
                              title={folder.title}
                              allow="autoplay"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Auto Carousels Section */}
                {selectedArsenalItem.details?.autoCarousels && selectedArsenalItem.details.autoCarousels.length > 0 && (
                  <div className={`space-y-6 pt-10 mt-10 border-t transition-all duration-700 ${isArch ? "border-gray-200" : "border-white/10"}`}>
                    <div className={`text-[10px] font-mono uppercase tracking-widest transition-colors duration-700 border-b pb-3 ${isArch ? "text-stone-900 font-bold" : "text-neon-cyan"}`}>
                      // 11.6 . {isArch ? "DRAWINGS CAROUSEL" : "DATA CAROUSEL"}
                    </div>
                    <div className="space-y-8">
                      {selectedArsenalItem.details.autoCarousels.map((carousel, idx) => (
                        <div key={"carousel-" + idx} className="space-y-3">
                          <h4 className={`text-xs font-bold ${isArch ? "text-stone-800" : "text-gray-200"}`}>
                            {carousel.title}
                          </h4>
                          <AutoCarousel 
                            images={carousel.images} 
                            titles={carousel.titles} 
                            folderUrl={carousel.folderUrl} 
                            isArch={isArch} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Presentation Grids Section */}
                {selectedArsenalItem.details?.presentationGrids && selectedArsenalItem.details.presentationGrids.length > 0 && (
                  <div className={"space-y-4 pt-10 mt-10 border-t transition-all duration-700 " + (isArch ? "border-gray-200" : "border-white/10")}>
                    <div className={"text-[10px] font-mono uppercase tracking-widest border-b pb-3 transition-colors duration-700 " + (isArch ? "text-stone-900 font-bold" : "text-neon-cyan")}>
                      // 12 . {isArch ? "DETAILED DRAWINGS & PRESENTATIONS" : "EXECUTIVE BRIEFINGS"}
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {selectedArsenalItem.details.presentationGrids.map((grid, idx) => (
                        grid.externalUrl ? (
                          <a
                            key={"grid-" + idx}
                            href={grid.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={"px-4 py-2 text-xs font-mono uppercase tracking-widest border rounded transition-all inline-block " + (isArch ? "border-black text-black hover:bg-black hover:text-white" : "border-white/10 text-neon-cyan hover:bg-neon-cyan/10")}
                          >
                            {grid.buttonLabel}
                          </a>
                        ) : (
                          <button
                            key={"grid-" + idx}
                            onClick={() => setExpandedGrid(grid)}
                            className={"px-4 py-2 text-xs font-mono uppercase tracking-widest border rounded transition-all " + (isArch ? "border-black text-black hover:bg-black hover:text-white" : "border-white/10 text-neon-cyan hover:bg-neon-cyan/10")}
                          >
                            {grid.buttonLabel}
                          </button>
                        )
                      ))}
                    </div>
                  </div>
                )}

                {/* Slide Decks Section */}
                {selectedArsenalItem.details?.slideDecks && selectedArsenalItem.details.slideDecks.length > 0 && (
                  <div className={"space-y-8 pt-10 mt-10 border-t transition-all duration-700 " + (isArch ? "border-gray-200" : "border-white/10")}>
                    <div className={"text-[10px] font-mono uppercase tracking-widest border-b pb-3 transition-colors duration-700 " + (isArch ? "text-stone-900 font-bold" : "text-neon-cyan")}>
                      // 13 . {isArch ? "SITE VISITS & PROGRESS" : "EXECUTIVE BRIEFINGS"}
                    </div>
                    <div className="space-y-8">
                      {selectedArsenalItem.details.slideDecks.map((deck, idx) => (
                        <div key={"deck-" + idx} className="space-y-3">
                          <h4 className={"text-xs font-bold " + (isArch ? "text-stone-800" : "text-gray-200")}>
                            {deck.title}
                          </h4>
                          <div className={"flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 " + (isArch ? "scrollbar-thin scrollbar-thumb-gray-300" : "scrollbar-thin scrollbar-thumb-terminal-border/50")}>
                            {deck.images.map((img, imgIdx) => (<div key={`deck-img-${imgIdx}`} className="min-w-[85%] sm:min-w-[60%] md:min-w-[45%] lg:min-w-[35%] snap-center shrink-0">
                                <img loading="lazy"
                                  src={img}
                                  alt={deck.title + " - " + (imgIdx + 1)}
                                  className={"w-full h-48 md:h-56 object-cover rounded shadow-sm border " + (isArch ? "border-gray-200" : "border-white/10")}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className={`p-4 border-t flex justify-between items-center font-sans text-[11px] font-medium tracking-wide text-gray-600 transition-all duration-700 ${isArch ? "bg-gray-50 border-gray-100" : "bg-black/30 border-white/5"}`}>
                <div>{isArch ? "ARCH_REF: " : "VDC_REF: "}{selectedArsenalItem.id}</div>
                <div className="flex gap-4">
                  <span className={isArch ? "text-black" : "text-neon-cyan"}>{isArch ? "DOCUMENTATION_COMPLETE" : "DATA_INTEGRITY_VERIFIED"}</span>
                  <span>STATUS: READY</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {expandedGrid && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedGrid(null)}
            className="fixed inset-0 z-[110] flex flex-col items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-2xl cursor-zoom-out"
          >
            {/* Elegant Header Info bar */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center text-white/70 font-mono text-xs z-10 pointer-events-none">
              <div className="flex items-center gap-4">
                <span className="text-neon-cyan">GFC_DRAWINGS</span>
                <span>{expandedGrid.title}</span>
              </div>
              <div className="flex items-center gap-4">
                <span>{expandedGrid.images.length} IMAGES</span>
                <span className="px-2 py-1 border border-white/20 rounded">ESC TO CLOSE</span>
              </div>
            </div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-7xl max-h-[80vh] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {expandedGrid.images.map((img, idx) => (<div key={`exp-grid-img-${idx}`} className="relative aspect-video group cursor-zoom-in" onClick={() => {
                    setExpandedMedia({
                      src: img,
                      isVideo: false,
                      googleDriveId: getDriveId(img),
                      alt: expandedGrid.title + " - Image " + (idx + 1)
                    });
                  }}>
                    <img loading="lazy"
                      src={img}
                      alt={expandedGrid.title + " - Image " + (idx + 1)}
                      className="w-full h-full object-cover border border-white/10 rounded"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0c]/90 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {expandedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedMedia(null)}
            className="fixed inset-0 z-[110] flex flex-col items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-2xl cursor-zoom-out"
          >
            {/* Elegant Header Info bar */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none z-10 font-mono text-[9px] md:text-[10px] tracking-widest text-gray-500 uppercase">
              <div className="flex items-center gap-2">
                <span className={isArch ? "text-white" : "text-neon-cyan animate-pulse"}>●</span>
                <span>{expandedMedia.alt}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline">CLICK OUTSIDE OR BUTTON TO CLOSE</span>
                <Box className="w-3.5 h-3.5 rotate-45 text-gray-400" />
              </div>
            </div>

            {/* Media Canvas Box */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-5xl max-h-[82vh] aspect-video overflow-hidden flex items-center justify-center shadow-2xl pointer-events-auto border transition-all duration-700 ${
                isArch ? "border-gray-800 bg-black shadow-[0_30px_100px_rgba(0,0,0,0.9)]" : "border-white/5 bg-black shadow-[0_0_80px_rgba(0,243,255,0.15)]"
              }`}
            >
              {expandedMedia.isVideo ? (
                (() => {
                  const ytId = getYoutubeId(expandedMedia.src);
                  if (ytId) {
                    return (
                      <iframe
                        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                        className="w-full h-full border-0 absolute inset-0"
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                      />
                    );
                  }
                  if (expandedMedia.googleDriveId) {
                    return (
                      <iframe
                        src={`https://drive.google.com/file/d/${expandedMedia.googleDriveId}/preview?autoplay=1`}
                        className="w-full h-full border-0 absolute inset-0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                      />
                    );
                  }
                  const cleanPlayable = getPlayableVideoUrl(expandedMedia.src);
                  return (
                    <video 
                      src={cleanPlayable}
                      controls
                      controlsList="nodownload"
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-full object-contain absolute inset-0 select-none"
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                    />
                  );
                })()
              ) : (
                (() => {
                  const googleDriveId = getDriveId(expandedMedia.src);
                  let fullSrc = googleDriveId 
                    ? `https://lh3.googleusercontent.com/d/${googleDriveId}` 
                    : expandedMedia.src.split('#')[0];
                    
                  if (expandedMedia.isGif) {
                    fullSrc = getWsrvGifUrl(expandedMedia.src);
                  }
                  
                  return (
                    <div className="w-full h-full relative select-none">
                      <img loading="lazy" 
                        src={fullSrc} 
                        alt={expandedMedia.alt}
                        className="w-full h-full object-contain select-none pointer-events-none absolute inset-0"
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                        referrerPolicy="no-referrer"
                      />
                      {/* Transparent Absolute Overlay Shield preventing direct interactions */}
                      <div 
                        className="absolute inset-0 z-20 bg-transparent select-none pointer-events-auto" 
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                      />
                    </div>
                  );
                })()
              )}

              {/* Close Button overlay */}
              <button
                onClick={() => setExpandedMedia(null)}
                className={`absolute top-4 right-4 p-2 transition-all z-25 border text-white ${
                  isArch 
                    ? "bg-white/10 hover:bg-white hover:text-black border-white/20" 
                    : "bg-black/80 hover:bg-white hover:text-black border-white/5 hover:border-white"
                }`}
              >
                <Box className="w-4 h-4 rotate-45" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`hidden md:flex items-center justify-center fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 p-3 md:p-4 rounded-full shadow-lg border transition-all duration-300 ${
              isArch 
                ? "bg-white text-black border-gray-200 hover:shadow-2xl hover:-translate-y-1" 
                : "bg-[#0a0a0c]/95 text-neon-cyan border-white/10 hover:border-white/10 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:-translate-y-1 backdrop-blur-sm"
            }`}
          >
            <ArrowUp className="w-5 h-5 md:w-6 md:h-6" />
          </motion.button>
        )}
      </AnimatePresence>
      <MobileDesktopToast />
    </div>
  );
}
