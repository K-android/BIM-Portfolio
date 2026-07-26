import React, { useState, useEffect, useRef } from "react";
import { 
  Brain, 
  Trash2, 
  Play, 
  Terminal, 
  Clock, 
  Sparkles, 
  FolderGit2, 
  Database, 
  TrendingUp, 
  CheckCircle2, 
  Compass, 
  HelpCircle, 
  Send, 
  ArrowRight, 
  Activity, 
  ArrowRightLeft,
  AlertTriangle,
  Lightbulb,
  Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PipelineItem {
  id: string;
  name: string;
  category: "Architecture" | "BIM" | "Structural" | "MEP" | "Construction";
  complexity: "Low" | "Medium" | "High";
  roi: number; // Percentage
  hoursSaved: number; // hours/wk
  status: "Ready" | "Testing" | "Duplicate";
}

const INITIAL_PIPELINES: PipelineItem[] = [
  { id: "P_01", name: "Auto_WallFloor_Join.py", category: "Architecture", complexity: "High", roi: 95, hoursSaved: 6.5, status: "Ready" },
  { id: "P_02", name: "Revit_Excel_Exporter.dyn", category: "BIM", complexity: "Low", roi: 90, hoursSaved: 4.0, status: "Ready" },
  { id: "P_03", name: "Clash_Detector_Duplicate.gh", category: "Structural", complexity: "Medium", roi: 30, hoursSaved: 2.0, status: "Duplicate" },
  { id: "P_04", name: "Auto_CableTray_Clearance.cs", category: "MEP", complexity: "Medium", roi: 85, hoursSaved: 5.0, status: "Ready" },
  { id: "P_05", name: "Site_BIM_Aligner.py", category: "Construction", complexity: "High", roi: 92, hoursSaved: 8.0, status: "Testing" },
  { id: "P_06", name: "Revit_Model_Duplicate_Checker.dyn", category: "BIM", complexity: "Low", roi: 20, hoursSaved: 1.0, status: "Duplicate" },
];

const CATEGORY_POTENTIALS = {
  BIM: {
    hours: 15,
    rank: "#1 Highest Saving",
    feasibility: "94%",
    priority: "CRITICAL",
    desc: "BIM Management routines (family cleaning, index updates, schedules export) remove redundant manual overhead.",
    color: "neon-cyan"
  },
  Architecture: {
    hours: 12,
    rank: "#2 Highly Viable",
    feasibility: "88%",
    priority: "HIGH",
    desc: "Automating layout cleaning, wall joints, and sheet placements speeds up drawing deliverables.",
    color: "neon-blue"
  },
  MEP: {
    hours: 9,
    rank: "#3 High Technical ROI",
    feasibility: "82%",
    priority: "HIGH",
    desc: "Routing scripts for cable trays, conduit splits, and mechanical system clashes save countless late-stage manual checks.",
    color: "neon-orange"
  },
  Construction: {
    hours: 8,
    rank: "#4 Emerging Field",
    feasibility: "75%",
    priority: "MEDIUM",
    desc: "Connecting schedule updates with daily reality captures automates progression and avoids structural mismatches.",
    color: "neon-green"
  },
  Structural: {
    hours: 6,
    rank: "#5 Complex Logic",
    feasibility: "70%",
    priority: "MEDIUM",
    desc: "Linking spatial models directly with computation packages eliminates double-modeling key components.",
    color: "neon-purple"
  }
};

const CONCEPT_IDEAS = [
  {
    id: "embodied_carbon",
    title: "Real-time Embodied Carbon Feedback",
    subtitle: "Revit & Grasshopper Material Analytics Plugin",
    description: "BIM plugins that dynamically calculate carbon footprints and suggest sustainable, local material alternatives as you model.",
    tech: ["Revit API", "Grasshopper", "Python", "SQLite"],
    nodes: ["3D Geometry Input", "Volume Parameter API", "Carbon Lookup SQL", "Material Substitution Recommendation", "Ladybug Carbon Dashboard"],
    simulation: {
      initialState: { carbon: 450, cost: 220, material: "Reinforced Concrete Base (30MPa)", offsetPercentage: 0 },
      steps: [
        { label: "Querying active volumetric solid profiles...", carbon: 450, cost: 220, material: "Reinforced Concrete Base", offsetPercentage: 0 },
        { label: "Identifying local alternatives from SQLite database...", carbon: 380, cost: 245, material: "Low-Carbon Fly-ash Concrete", offsetPercentage: 15 },
        { label: "Evaluating engineered timber composites...", carbon: 180, cost: 260, material: "Glulam Timber Framing", offsetPercentage: 60 },
        { label: "Integrating CLT carbon-sink offsets...", carbon: 98, cost: 215, material: "CLT + Local Spruce Timber", offsetPercentage: 78 }
      ]
    }
  },
  {
    id: "compliance_auditor",
    title: "Autonomous Regulatory Compliance Auditor",
    subtitle: "AI Model (NeuroCode) + Speckle Code Checker",
    description: "Tools like NeuroCode that use Large Language Models (LLMs) and NLP to read local building codes and automatically flag non-compliant design elements in a live Revit or Speckle environment.",
    tech: ["Gemini AI", "Speckle API", "NLP Parser", "Revit API Client"],
    nodes: ["Active Drawing Sync", "Speckle Stream JSON", "NLP Code Read", "Token Matching & Constraints Checker", "Live Warning Injection"],
    simulation: {
      initialState: { doorsChecked: 0, violations: [], complianceRate: 100 },
      steps: [
        { label: "Compiling Speckle active layer models...", doorsChecked: 12, violations: [], complianceRate: 100 },
        { label: "Parsing Local IBC Building Code Chapter 11.2 (Access)...", doorsChecked: 24, violations: [], complianceRate: 100 },
        { label: "FLAG_VIOLATION: Door ID 883A has width 900mm (Code requires min 950mm for accessibility clearance)", doorsChecked: 36, violations: ["Door 883A width mismatch"], complianceRate: 92 },
        { label: "FLAG_VIOLATION: Corridor Width 'Zone-C' reduces to 1100mm (Code requires min 1200mm egress limits)", doorsChecked: 58, violations: ["Door 883A width mismatch", "Corridor Zone-C width mismatch"], complianceRate: 85 }
      ]
    }
  },
  {
    id: "site_to_bim",
    title: "Site-to-BIM Synchronization",
    subtitle: "Computer Vision & 4D Progress Analytics",
    description: "Pipelines using computer vision to compare daily site reality capture photos against 4D BIM models for autonomous progress tracking and safety geofencing.",
    tech: ["Computer Vision", "Point Cloud XML", "Navisworks API", "4D Scheduling"],
    nodes: ["Site Reality Capture (Drone/360)", "Reality Model Point Cloud", "4D Navisworks Schedule Link", "Sequential Feature Matching", "Progress Drift Analysis Update"],
    simulation: {
      initialState: { scanCoverage: 0, matchingPoints: 0, status: "Synchronizing..." },
      steps: [
        { label: "Loading drone orthomosaic reality model raw sheets...", scanCoverage: 20, matchingPoints: 500, status: "Indexing images..." },
        { label: "Generating matching coordinate anchor markers...", scanCoverage: 55, matchingPoints: 4800, status: "Comparing reality to 4D model..." },
        { label: "Analyzing spatial structural updates in column grid 'F'...", scanCoverage: 88, matchingPoints: 12400, status: "Evaluating scheduling tolerances..." },
        { label: "SYNCHRONIZED: Concrete columns grid F poured. Steel schedule drift: -1.2 days (Ahead of schedule).", scanCoverage: 100, matchingPoints: 18920, status: "COMPLETED" }
      ]
    }
  }
];

export const AECWorkflowHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"pipelines" | "discovery" | "advisor">("pipelines");

  // Pipeline State
  const [pipelines, setPipelines] = useState<PipelineItem[]>(INITIAL_PIPELINES);
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanLog, setCleanLog] = useState<string[]>([]);
  const [selectedCat, setSelectedCat] = useState<keyof typeof CATEGORY_POTENTIALS>("BIM");

  // Discovery State
  const [selectedConcept, setSelectedConcept] = useState(CONCEPT_IDEAS[0]);
  const [simStepIdx, setSimStepIdx] = useState(-1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simLog, setSimLog] = useState<string[]>([]);

  // Advisor State
  const [userInput, setUserInput] = useState("");
  const [advisorOutput, setAdvisorOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Quick Templates for Advisor
  const templates = [
    "How can I automate wall-to-floor join cleanup in Revit?",
    "How do I build a real-time carbon tracking plugin in Rhino?",
    "How can I automate MEP cable tray clearances based on building codes?"
  ];

  // Run Duplicate Cleaner Automation
  const handleCleanDuplicates = () => {
    if (isCleaning) return;
    setIsCleaning(true);
    setCleanLog([]);

    const messages = [
      ">> Initiating complete AEC workspace audit...",
      ">> Checking workspace models: Revit, Grasshopper, Speckle streams...",
      ">> Scanning file system metadata and syntax mappings...",
      ">> ALERT: Found 2 duplicated scripts in current workspace registries! Ready to purge.",
      ">> Purging: Clash_Detector_Duplicate.gh from pipeline database...",
      ">> Purging: Revit_Model_Duplicate_Checker.dyn from pipeline database...",
      ">> [SUCCESS] Duplicates purged. Restructured automation catalog with absolute unique indexes."
    ];

    messages.forEach((msg, idx) => {
      setTimeout(() => {
        setCleanLog(prev => [...prev, msg]);
        if (idx === messages.length - 1) {
          setIsCleaning(false);
          setPipelines(prev => prev.filter(p => p.status !== "Duplicate"));
        }
      }, idx * 600);
    });
  };

  // Run Discovery Concept Simulator
  const handleTriggerSimulation = (concept: typeof CONCEPT_IDEAS[0]) => {
    setIsSimulating(true);
    setSimStepIdx(0);
    setSimLog([`[SYS]: Initializing ${concept.title} Simulation Pipeline...`]);

    const steps = concept.simulation.steps;
    steps.forEach((step, idx) => {
      setTimeout(() => {
        setSimStepIdx(idx);
        setSimLog(prev => [...prev, `[STEP ${idx + 1}]: ${step.label}`]);
        if (idx === steps.length - 1) {
          setIsSimulating(false);
          setSimLog(prev => [...prev, `[SUCCESS]: Simulation pipeline completed securely. Metrics streamed to parent dashboard.`]);
        }
      }, (idx + 1) * 1200);
    });
  };

  // Run Advisor API
  const handleAskAdvisor = async (overridePrompt?: string) => {
    const promptToSubmit = overridePrompt || userInput;
    if (!promptToSubmit.trim() || isLoading) return;

    setIsLoading(true);
    setAdvisorOutput("");

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: promptToSubmit })
      });
      const data = await res.json();
      setAdvisorOutput(data.response || "No response received.");
    } catch (err: any) {
      console.error(err);
      setAdvisorOutput("An error occurred while connecting with the computational design advisor: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick helper to render marked response manually so we don't need heavyweight MD dependencies
  const formatMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("###")) {
        return <h4 key={idx} className="text-sm font-semibold tracking-wide text-neon-orange mt-6 mb-2 font-sans  pb-1 border-b border-white/10">{line.replace("###", "").trim()}</h4>;
      }
      if (line.startsWith("##")) {
        return <h3 key={idx} className="text-base font-bold tracking-widest text-[#3B82F6] mt-6 mb-2 font-sans  pb-1 border-b border-white/10">{line.replace("##", "").trim()}</h3>;
      }
      if (line.startsWith("- ")) {
        return (
          <div key={idx} className="flex gap-2 items-start py-0.5 pl-2">
            <span className="text-neon-orange font-sans mt-1 text-xs">•</span>
            <span className="text-xs text-gray-400 font-sans">{line.replace("- ", "").trim()}</span>
          </div>
        );
      }
      if (line.match(/^\d+\./)) {
        return (
          <div key={idx} className="flex gap-2 items-start py-1 pl-2">
            <span className="text-[#3B82F6] font-sans text-xs font-bold">{line.match(/^\d+\./)?.[0]}</span>
            <span className="text-xs text-gray-400 font-sans">{line.replace(/^\d+\./, "").trim()}</span>
          </div>
        );
      }
      if (line.startsWith("```")) {
        // Just bypass code block lines
        return null;
      }
      // Detect inline backticks
      if (line.includes("`")) {
        const parts = line.split("`");
        return (
          <p key={idx} className="text-xs font-sans text-gray-300 leading-relaxed py-0.5">
            {parts.map((part, pIdx) => (
              pIdx % 2 === 1 
                ? <code key={pIdx} className="bg-terminal-block/80 border border-white/10 px-1 py-0.5 rounded font-sans text-[11px] text-[#3B82F6]">{part}</code>
                : part
            ))}
          </p>
        );
      }
      return <p key={idx} className="text-xs font-sans text-gray-400 leading-relaxed py-0.5">{line}</p>;
    });
  };

  return (
    <div className="w-full bg-terminal-block/10 border border-white/10 rounded-lg overflow-hidden flex flex-col min-h-[600px] text-left">
      {/* Title Bar */}
      <div className="bg-terminal-header py-3.5 px-5 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-neon-orange/10 border border-neon-orange/30 rounded">
            <Brain className="w-5 h-5 text-neon-orange" />
          </div>
          <div>
            <h4 className="text-sm font-bold font-sans tracking-wider text-white ">
              AEC_Workflow_Hub_v1.2 // Centralized Automation Dashboard
            </h4>
            <p className="text-xs font-sans text-gray-400">
              Computational Design, Autopilot Pipings & AI Script Orchestrator
            </p>
          </div>
        </div>

        {/* Workspace Hub Navigator Tabs */}
        <div className="flex bg-black/80 border border-white/10 p-1 rounded font-sans text-xs gap-1">
          <button
            onClick={() => setActiveTab("pipelines")}
            className={`px-3 py-1.5 transition-all flex items-center gap-2 rounded ${
              activeTab === "pipelines"
                ? "bg-neon-orange/15 text-neon-orange border border-neon-orange/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Pipelines & Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab("discovery")}
            className={`px-3 py-1.5 transition-all flex items-center gap-2 rounded ${
              activeTab === "discovery"
                ? "bg-[#6366F1]/15 text-[#6366F1] border border-[#6366F1]/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Live Discovery (AI Workflows)</span>
          </button>
          <button
            onClick={() => setActiveTab("advisor")}
            className={`px-3 py-1.5 transition-all flex items-center gap-2 rounded ${
              activeTab === "advisor"
                ? "bg-neon-blue/15 text-neon-blue border border-neon-blue/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Automation Advisor</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="p-6 bg-[#0a0d10] flex-grow">
        <AnimatePresence mode="wait">
          {/* TAB 1: WORKFLOW TRACKING & MANAGEMENT */}
          {activeTab === "pipelines" && (
            <motion.div
              key="pipelines"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-6"
            >
              {/* Left Column: Pipelines Table */}
              <div className="xl:col-span-2 space-y-6">
                <div className="bg-black/35 border border-white/10 rounded p-4 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h5 className="font-sans text-xs text-white  font-bold flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5 text-neon-orange animate-pulse" />
                          Live Pipelines Registry
                        </h5>
                        <p className="text-xs text-gray-400 font-sans mt-0.5">
                          Active operational design scripts running across localized and cloud networks.
                        </p>
                      </div>
                      <button
                        onClick={handleCleanDuplicates}
                        disabled={isCleaning || pipelines.filter(p => p.status === "Duplicate").length === 0}
                        className="font-sans text-xs px-3 py-1.5 bg-red-950/20 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all rounded flex items-center gap-2 disabled:opacity-40 disabled:hover:bg-transparent"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{isCleaning ? "Purging..." : "Purge Duplicates"}</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-sans text-[11px] border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 text-gray-400 text-xs ">
                            <th className="py-2.5 px-2">Script Name</th>
                            <th className="py-2.5 px-2">AEC Scope</th>
                            <th className="py-2.5 px-2">Complexity</th>
                            <th className="py-2.5 px-2">Estimated ROI</th>
                            <th className="py-2.5 px-2">Weekly Savings</th>
                            <th className="py-2.5 px-2 text-right">Registry Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <AnimatePresence>
                            {pipelines.map((item) => (
                              <motion.tr
                                key={item.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, x: -50 }}
                                className={`border-b border-white/10 hover:bg-white/5 transition-colors ${
                                  item.status === "Duplicate" ? "bg-red-950/10 text-red-300" : "text-gray-300"
                                }`}
                              >
                                <td className="py-2.5 px-2 font-semibold flex items-center gap-1.5 text-white">
                                  {item.status === "Duplicate" ? (
                                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                                  ) : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-neon-orange" />
                                  )}
                                  {item.name}
                                </td>
                                <td className="py-2.5 px-2 text-gray-400">{item.category}</td>
                                <td className="py-2.5 px-2">
                                  <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                                    item.complexity === "High" ? "bg-red-900/20 text-red-400 border border-red-500/15" :
                                    item.complexity === "Medium" ? "bg-amber-900/20 text-amber-400 border border-amber-500/15" :
                                    "bg-emerald-900/20 text-emerald-400 border border-emerald-500/15"
                                  }`}>
                                    {item.complexity}
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 text-[#3B82F6] font-bold">{item.roi}%</td>
                                <td className="py-2.5 px-2 text-white">{item.hoursSaved} hrs</td>
                                <td className="py-2.5 px-2 text-right">
                                  <span className={`px-1.5 py-0.5 rounded text-[9px]  tracking-wider ${
                                    item.status === "Ready" ? "text-[#3B82F6]" :
                                    item.status === "Testing" ? "text-neon-orange animate-pulse" :
                                    "text-red-400 line-through font-bold"
                                  }`}>
                                    {item.status}
                                  </span>
                                </td>
                              </motion.tr>
                            ))}
                          </AnimatePresence>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Duplicate Scruber Mini Logger */}
                  {cleanLog.length > 0 && (
                    <div className="font-sans text-xs mt-4 p-3 bg-black/95 rounded border border-white/10 space-y-1 max-h-[110px] overflow-y-auto">
                      {cleanLog.map((log, i) => (
                        <p key={i} className={log.includes("SUCCESS") ? "text-[#3B82F6]" : log.includes("ALERT") ? "text-red-400" : "text-gray-400"}>
                          {log}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Automation Potential Ranking */}
              <div className="space-y-6">
                <div className="bg-black/35 border border-white/10 rounded p-4 h-full flex flex-col justify-between">
                  <div>
                    <h5 className="font-sans text-xs text-white  font-bold flex items-center gap-2 mb-2">
                      <TrendingUp className="w-3.5 h-3.5 text-[#3B82F6]" />
                      Automation Potential Ranking
                    </h5>
                    <p className="text-xs text-gray-400 font-sans mb-4">
                      Tap specific discipline modules to review diagnostic statistics and feasibility rankings.
                    </p>

                    <div className="grid grid-cols-2 gap-2 mb-4 font-sans text-xs">
                      {Object.keys(CATEGORY_POTENTIALS).map((cat) => {
                        const active = selectedCat === cat;
                        const data = CATEGORY_POTENTIALS[cat as keyof typeof CATEGORY_POTENTIALS];
                        return (
                          <button
                            key={cat}
                            onClick={() => setSelectedCat(cat as any)}
                            className={`p-2.5 rounded text-left border transition-all flex flex-col justify-between ${
                              active
                                ? "bg-[#6366F1]/15 border-[#6366F1]/30 text-white"
                                : "bg-black/30 border-white/10 text-gray-400 hover:bg-white/5"
                            }`}
                          >
                            <span className="font-bold">{cat}</span>
                            <span className="text-[9px] text-[#3B82F6] mt-1 font-semibold">
                              {data.hours} hrs/wk saving
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Potential Ranking Results Block */}
                    <div className="bg-black/90 p-4 rounded border border-white/10 font-sans">
                      <div className="flex justify-between items-center pb-2.5 border-b border-white/10 mb-3">
                        <span className="text-gray-400 text-[9px]   tracking-wider">
                          Efficiency Level:
                        </span>
                        <span className="text-[#3B82F6] text-xs font-bold ">
                          {CATEGORY_POTENTIALS[selectedCat].priority}
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-xs">Save Capacity:</span>
                          <span className="text-white text-xs font-bold">
                            {CATEGORY_POTENTIALS[selectedCat].hours} Hours / Project Week
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-xs">Feasibility Index:</span>
                          <span className="text-white text-xs font-bold">
                            {CATEGORY_POTENTIALS[selectedCat].feasibility}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-xs">Rank Position:</span>
                          <span className="text-[#3B82F6] text-xs font-bold ">
                            {CATEGORY_POTENTIALS[selectedCat].rank}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 font-sans leading-relaxed pt-2 border-t border-white/10">
                          {CATEGORY_POTENTIALS[selectedCat].desc}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-sans text-gray-400 mt-4 leading-relaxed pt-3 border-t border-white/10 flex items-start gap-2 bg-neon-cyan/[0.02] p-2.5 rounded">
                    <Lightbulb className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                    <span>
                      <strong>Optimization Strategy:</strong> Standardizing BIM templates combined with custom computational scripts scales structural delivery times by up to <strong>35%</strong>.
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: LIVE AUTOMATION DISCOVERY */}
          {activeTab === "discovery" && (
            <motion.div
              key="discovery"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-6"
            >
              {/* Left Selector Panel */}
              <div className="xl:col-span-1 space-y-3">
                <div className="text-xs font-sans  tracking-wider text-[#3B82F6] font-bold mb-1">
                  High-ROI Computational Concepts
                </div>
                {CONCEPT_IDEAS.map((concept) => (
                  <button
                    key={concept.id}
                    onClick={() => {
                      setSelectedConcept(concept);
                      setSimStepIdx(-1);
                      setSimLog([]);
                    }}
                    className={`p-4 rounded text-left border transition-all flex flex-col gap-1 w-full relative overflow-hidden ${
                      selectedConcept.id === concept.id
                        ? "bg-[#6366F1]/15 border-[#6366F1]/30 text-white shadow-[0_0_15px_rgba(0,242,255,0.08)]"
                        : "bg-black/30 border-white/10 text-gray-400 hover:bg-white/5"
                    }`}
                  >
                    {selectedConcept.id === concept.id && (
                      <div className="absolute right-3 top-3 w-1.5 h-1.5 bg-[#6366F1] rounded-full animate-pulse" />
                    )}
                    <span className="font-bold text-xs font-sans tracking-wide text-white ">
                      {concept.title}
                    </span>
                    <span className="text-xs text-gray-400 font-sans tracking-tight font-medium">
                      {concept.subtitle}
                    </span>
                    <p className="text-xs text-gray-400 line-clamp-2 mt-1.5 font-sans leading-relaxed">
                      {concept.description}
                    </p>
                  </button>
                ))}
              </div>

              {/* Right Simulation and Flow Workspace */}
              <div className="xl:col-span-2 space-y-6">
                <div className="bg-black/35 border border-white/10 rounded p-5 flex flex-col h-full justify-between">
                  <div>
                    {/* Header and description */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-sans text-sm  text-white font-bold flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-[#3B82F6]" />
                          {selectedConcept.title}
                        </h4>
                        <p className="text-xs text-gray-400 font-sans mt-0.5">
                          {selectedConcept.description}
                        </p>
                      </div>

                      <button
                        onClick={() => handleTriggerSimulation(selectedConcept)}
                        disabled={isSimulating}
                        className="font-sans text-xs px-3 py-1.5 bg-[#6366F1]/20 border border-[#6366F1]/30 text-[#6366F1] hover:bg-[#6366F1] hover:text-black transition-all rounded font-bold flex items-center gap-2 disabled:opacity-40 shrink-0"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>{isSimulating ? "Simulating..." : "Trigger Simulation"}</span>
                      </button>
                    </div>

                    {/* Node Pathway Map */}
                    <div className="mb-6">
                      <div className="text-[9px] font-sans text-gray-400  tracking-widest mb-3">
                        Automation Pipeline Nodes:
                      </div>
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 flex-wrap">
                        {selectedConcept.nodes.map((node, nIdx) => (
                          <div key={nIdx} className="flex items-center gap-2 md:gap-3">
                            <div className={`px-2.5 py-1.5 border rounded font-sans text-xs tracking-tight ${
                              nIdx <= simStepIdx 
                                ? "bg-[#6366F1]/25 border-[#6366F1]/40 text-white shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                                : "bg-black/45 border-white/10 text-gray-400"
                            }`}>
                              {node}
                            </div>
                            {nIdx < selectedConcept.nodes.length - 1 && (
                              <ArrowRight className={`w-3.5 h-3.5 shrink-0 hidden md:block ${
                                nIdx < simStepIdx ? "text-[#3B82F6]" : "text-gray-600"
                              }`} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Technology Badge listing */}
                    <div className="flex flex-wrap gap-2 mb-6 font-sans text-[9px] text-gray-400">
                      <span>Stack Profile:</span>
                      {selectedConcept.tech.map((tech, idx) => (
                        <span key={`${tech}-${idx}`} className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-gray-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Terminal / Simulator Logs */}
                  <div className="bg-[#030608] border border-white/10 rounded p-4 flex flex-col justify-between select-none">
                    <div className="flex justify-between items-center pb-2 border-b border-white/10 mb-3 font-sans text-[9px] text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Terminal className="w-3 h-3 text-[#3B82F6]" />
                        AEC_SIMULATOR_LOGS.log
                      </span>
                      <span>ACTIVE VIEWPORT</span>
                    </div>

                    {/* Stream Logs */}
                    <div className="font-sans text-[11px] h-[140px] overflow-y-auto space-y-1.5 text-left mb-4">
                      {simLog.length === 0 ? (
                        <div className="text-gray-500 text-xs italic flex flex-col items-center justify-center h-full gap-2">
                          <Compass className="w-6 h-6 text-gray-600 animate-spin" />
                          <span>Tap "Trigger Simulation" to compile and stream live workflow data.</span>
                        </div>
                      ) : (
                        simLog.map((log, i) => {
                          let color = "text-gray-400";
                          if (log.includes("[SUCCESS]")) color = "text-emerald-400 font-semibold";
                          if (log.includes("[SYS]")) color = "text-gray-300 font-bold";
                          if (log.includes("FLAG_VIOLATION")) color = "text-red-400 font-semibold animate-pulse";
                          if (log.includes("SYNCHRONIZED")) color = "text-[#3B82F6] font-bold";
                          return (
                            <p key={i} className={color}>
                              {log}
                            </p>
                          );
                        })
                      )}
                    </div>

                    {/* Simulated Results Indicators */}
                    {simStepIdx >= 0 && (
                      <div className="border-t border-white/10 pt-3 font-sans text-xs grid grid-cols-3 gap-2 text-center">
                        {selectedConcept.id === "embodied_carbon" && (
                          <>
                            <div className="bg-black/35 p-2 rounded">
                              <span className="text-gray-500 block text-[9px] mb-0.5">CURRENT MATERIAL</span>
                              <span className="text-white font-bold tracking-tight text-[11px]">
                                {selectedConcept.simulation.steps[simStepIdx].material}
                              </span>
                            </div>
                            <div className="bg-black/35 p-2 rounded">
                              <span className="text-gray-500 block text-[9px] mb-0.5">ESTIMATED CO₂ kg</span>
                              <span className="text-[#3B82F6] font-bold block text-[11px]">
                                {selectedConcept.simulation.steps[simStepIdx].carbon} kgCO2e
                              </span>
                            </div>
                            <div className="bg-black/35 p-2 rounded">
                              <span className="text-gray-500 block text-[9px] mb-0.5">CARBON OFFSET</span>
                              <span className="text-neon-orange font-bold block text-[11px]">
                                {selectedConcept.simulation.steps[simStepIdx].offsetPercentage}% Reduced
                              </span>
                            </div>
                          </>
                        )}

                        {selectedConcept.id === "compliance_auditor" && (
                          <>
                            <div className="bg-black/35 p-2 rounded">
                              <span className="text-gray-500 block text-[9px] mb-0.5">BIM DOORS EVALUATED</span>
                              <span className="text-white font-bold block text-[11px]">
                                {selectedConcept.simulation.steps[simStepIdx].doorsChecked} elements
                              </span>
                            </div>
                            <div className="bg-black/35 p-2 rounded">
                              <span className="text-gray-500 block text-[9px] mb-0.5">CODE DEVIATIONS</span>
                              <span className="text-red-400 font-bold block text-[11px] animate-pulse">
                                {selectedConcept.simulation.steps[simStepIdx].violations.length} warnings
                              </span>
                            </div>
                            <div className="bg-black/35 p-2 rounded">
                              <span className="text-gray-500 block text-[9px] mb-0.5">COMPLIANCE INDEX</span>
                              <span className="text-[#3B82F6] font-bold block text-[11px]">
                                {selectedConcept.simulation.steps[simStepIdx].complianceRate}% Compliant
                              </span>
                            </div>
                          </>
                        )}

                        {selectedConcept.id === "site_to_bim" && (
                          <>
                            <div className="bg-black/35 p-2 rounded">
                              <span className="text-gray-500 block text-[9px] mb-0.5">SCAN STREAM COVERAGE</span>
                              <span className="text-white font-bold block text-[11px]">
                                {selectedConcept.simulation.steps[simStepIdx].scanCoverage}%
                              </span>
                            </div>
                            <div className="bg-black/35 p-2 rounded">
                              <span className="text-gray-500 block text-[9px] mb-0.5">CV MATCH POINTS</span>
                              <span className="text-[#3B82F6] font-bold block text-[11px]">
                                {selectedConcept.simulation.steps[simStepIdx].matchingPoints} pts
                              </span>
                            </div>
                            <div className="bg-black/35 p-2 rounded">
                              <span className="text-gray-500 block text-[9px] mb-0.5">INTEGRATION STATE</span>
                              <span className="text-neon-orange font-bold  block text-xs truncate">
                                {selectedConcept.simulation.steps[simStepIdx].status}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: INTERACTIVE AUTOMATION ADVISOR */}
          {activeTab === "advisor" && (
            <motion.div
              key="advisor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-6"
            >
              {/* Left Form Panel */}
              <div className="xl:col-span-1 space-y-6">
                <div className="bg-black/35 border border-white/10 rounded p-4 h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-sans text-xs text-white  font-bold flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-neon-blue animate-pulse" />
                        Advisor Command Console
                      </h5>
                      <p className="text-xs text-gray-400 font-sans mt-0.5">
                        Describe any manual, repetitive AEC design drafting, scheduling, structural task, or parameter check to generate a bespoke computational script model.
                      </p>
                    </div>

                    {/* Pre-built prompts */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-sans text-gray-500  tracking-widest block font-bold">
                        Choose Template Task:
                      </span>
                      {templates.map((tmpl, idx) => (
                        <button
                          key={`${tmpl}-${idx}`}
                          onClick={() => {
                            setUserInput(tmpl);
                            handleAskAdvisor(tmpl);
                          }}
                          className="w-full text-left p-3 rounded font-sans text-xs bg-black/45 border border-white/10 hover:border-neon-blue/30 text-gray-300 hover:text-white transition-all text-xs"
                        >
                          {tmpl}
                        </button>
                      ))}
                    </div>

                    {/* Custom Input */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-sans text-gray-500  tracking-widest block font-bold">
                        Describe Custom Design Obstacle:
                      </span>
                      <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="E.g., How can I automate exporting Revit room ceiling heights directly into an excel sheet using Python?"
                        rows={5}
                        className="w-full bg-[#05080a] border border-white/10 hover:border-white/10 focus:border-neon-blue/50 text-xs font-sans text-gray-200 p-3 rounded outline-none resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleAskAdvisor()}
                    disabled={isLoading || !userInput.trim()}
                    className="w-full font-sans text-xs py-3 bg-neon-blue/20 hover:bg-neon-blue text-neon-blue hover:text-white border border-neon-blue/35 rounded font-bold transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    {isLoading ? (
                      <>
                        <Activity className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating Actionable Blueprint...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Query Gemini Design Broker</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Output Panels */}
              <div className="xl:col-span-2 space-y-6">
                <div className="bg-black/35 border border-white/10 rounded p-5 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center pb-2.5 border-b border-white/10 mb-4 text-xs font-sans">
                      <span className="text-gray-400 font-bold  tracking-wider flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-neon-blue" />
                        Actionable Solution Blueprint
                      </span>
                      <span className="text-xs bg-neon-blue/15 text-neon-blue/80 border border-neon-blue/20 px-1.5 py-0.5 rounded font-bold">
                        GEMINI COGNITIVE LAYER
                      </span>
                    </div>

                    <div className="font-sans text-xs max-h-[460px] overflow-y-auto pr-2 space-y-4 py-1">
                      {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-[300px] gap-3">
                          <Cpu className="w-8 h-8 text-neon-blue animate-spin" />
                          <p className="text-xs text-gray-400 font-sans tracking-wide animate-pulse">
                            [THINKING] Formulating step-by-step computational routine...
                          </p>
                        </div>
                      ) : advisorOutput ? (
                        <div className="text-left space-y-3">
                          {formatMarkdown(advisorOutput)}
                        </div>
                      ) : (
                        <div className="text-gray-500 italic text-xs h-[300px] flex flex-col items-center justify-center gap-2">
                          <HelpCircle className="w-8 h-8 text-gray-600" />
                          <span>Awaiting automation query input... Load a template or type your challenge.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="font-sans text-xs text-gray-500 border-t border-white/10 pt-3 leading-relaxed">
                    <strong>Note:</strong> Strategies generated compile compliant API guidelines across standard models. Review assemblies in localized sandbox folders before executing Revit database transactions.
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
