/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Zap
} from "lucide-react";

const SoftwareStack = ({ isArch }: { isArch: boolean }) => {
  const archTools = [
    { name: "Rhino / Grasshopper", category: "Computational" },
    { name: "Autodesk Revit", category: "BIM" },
    { name: "D5 Render / Enscape", category: "Visualization" },
    { name: "Adobe Creative Suite", category: "Design" },
    { name: "Midjourney / Stable Diffusion", category: "AI Imagery" },
    { name: "Physical Prototyping", category: "Fabrication" },
  ];

  const bimTools = [
    { name: "Autodesk Revit", category: "Modeling" },
    { name: "Navisworks Manage", category: "Coordination" },
    { name: "Dynamo / Python", category: "Automation" },
    { name: "PowerBI / SQL", category: "Data" },
    { name: "Rhino / Grasshopper", category: "Computational" },
    { name: "ISO 19650 Standards", category: "Management" },
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
      className="flex flex-wrap justify-center lg:justify-start gap-3 mt-8"
    >
      {tools.map((tool) => (
        <motion.div 
          key={`${isArch ? 'arch' : 'bim'}-${tool.name}`}
          variants={item}
          className={`px-3 py-1 border text-[10px] font-mono transition-all duration-700 ${
            isArch 
            ? "border-gray-100 bg-gray-50 text-gray-500" 
            : "border-terminal-border bg-terminal-border/20 text-neon-cyan"
          }`}
        >
          {tool.name} <span className="opacity-30 ml-1">[{tool.category}]</span>
        </motion.div>
      ))}
    </motion.div>
  );
};

const CodeSnippet = () => (
  <div className="bg-black p-4 rounded border border-terminal-border font-mono text-xs text-neon-cyan overflow-hidden">
    <div className="flex gap-2 mb-2 opacity-50">
      <div className="w-2 h-2 rounded-full bg-red-500" />
      <div className="w-2 h-2 rounded-full bg-yellow-500" />
      <div className="w-2 h-2 rounded-full bg-green-500" />
    </div>
    <pre className="overflow-x-auto">
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

const DataTable = () => (
  <div className="bg-black rounded border border-terminal-border font-mono text-[10px] overflow-hidden">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-bottom border-terminal-border bg-terminal-border/30">
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
          <tr key={i} className="border-bottom border-terminal-border/50">
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
  title: string;
  role?: string;
  hook?: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  metric: string;
  content?: React.ReactNode;
  gifUrl: string;
  tags: string[];
  category?: string;
  isVerified?: boolean;
  workflow?: {
    screenshotUrl: string;
    steps: string[];
  };
  details?: {
    overview: string;
    challenge: string;
    solution: string;
    images?: string[];
    reportUrl?: string;
    videoUrl?: string;
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
            <div key={i} className="border-[0.5px] border-current" />
          ))}
        </div>
      </div>
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
      className="min-h-screen w-full flex items-center justify-center relative py-20 px-6 overflow-hidden"
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

export default function App() {
  const [activeSection, setActiveSection] = useState(0);
  const [selectedArsenalItem, setSelectedArsenalItem] = useState<ArsenalItem | null>(null);
  const [mode, setMode] = useState<'bim' | 'arch'>('bim');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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

  const archArsenal: ArsenalItem[] = [
    {
      id: "ARCH_01",
      title: "Net-Zero Worker Housing",
      role: "Simulation Lead",
      hook: "National Grand Winner (Solar Decathlon India).",
      description: "Simulation Lead for Health and Well-being. Optimized design outcomes for large-scale Construction Worker Housing through data storytelling.",
      icon: <ShieldCheck className="w-6 h-6 text-gray-400" />,
      color: "gray-400",
      metric: "Net-Zero",
      gifUrl: "https://lh3.googleusercontent.com/d/1-BhZKRQJEpkQhE8Kuq6BURh0UYO7qYrH",
      tags: ["Performance Simulation", "DesignBuilder", "IESVE"],
      category: "Exterior",
      workflow: {
        screenshotUrl: "https://lh3.googleusercontent.com/d/1P0FpPB-A9-Cs0bz1cywCumsfNBZyCA6j",
        steps: [
          "Model complex building geometry for thermal analysis.",
          "Extract and scrub simulation data for optimization.",
          "Validate passive cooling strategies (EAX, Radiant).",
          "Present technical data narrative to jury panels."
        ]
      },
      details: {
        overview: "This project addressed the critical need for dignified, sustainable housing for construction workers in India. Our team won the National Grand Prize for our holistic approach to net-zero energy and water.",
        challenge: "Achieving thermal comfort in a hot-humid climate without active cooling, while keeping construction costs extremely low for scalability.",
        solution: "We implemented passive cooling strategies including earth-air heat exchangers and radiant cooling. My role involved extensive performance simulation to validate these strategies, resulting in a 40% reduction in predicted energy use compared to the baseline.",
        images: [
          "https://lh3.googleusercontent.com/d/1P0FpPB-A9-Cs0bz1cywCumsfNBZyCA6j",
          "https://picsum.photos/seed/housing1/800/450?grayscale", 
          "https://picsum.photos/seed/housing2/800/450?grayscale"
        ],
        reportUrl: "https://drive.google.com/file/d/1CqV2ZUK7VDxh0zOxQze9lkTSIEavsr12/view?usp=sharing",
        videoUrl: "https://youtu.be/g0VIh64HiT8?si=hyFN6JXnnG_pqM5A"
      }
    },
    {
      id: "ARCH_02",
      title: "Spatial Phenomenology",
      description: "Designing spaces that evoke emotional responses through careful manipulation of scale, proportion, and sequence.",
      icon: <Layers className="w-6 h-6 text-gray-400" />,
      color: "gray-400",
      metric: "Experiential",
      gifUrl: "https://media.giphy.com/media/3o7TKMGpxXfQC9cc4o/giphy.gif",
      tags: ["Concept Design", "Human Scale", "Modeling"],
      category: "Conceptual",
      workflow: {
        screenshotUrl: "https://picsum.photos/seed/arch-workflow-1/800/450?grayscale",
        steps: [
          "Analyze site context and historical precedents.",
          "Develop conceptual massing based on human scale.",
          "Iterate through physical and digital models.",
          "Refine spatial sequences and transitions."
        ]
      }
    },
    {
      id: "ARCH_03",
      title: "Tectonic Assemblies",
      description: "Exploring the intersection of material, structure, and detail to create expressive architectural forms.",
      icon: <Box className="w-6 h-6 text-gray-400" />,
      color: "gray-400",
      metric: "Materiality",
      gifUrl: "https://media.giphy.com/media/l41lTfuxR4R8E/giphy.gif",
      tags: ["Fabrication", "Detailing", "Structure"],
      category: "Research",
      workflow: {
        screenshotUrl: "https://picsum.photos/seed/arch-workflow-2/800/450?grayscale",
        steps: [
          "Research material properties and fabrication methods.",
          "Develop structural systems that integrate with design intent.",
          "Create detailed construction drawings and prototypes.",
          "Coordinate with consultants for technical feasibility."
        ]
      }
    },
    {
      id: "ARCH_04",
      title: "The Caffeine Lab",
      role: "Interior Designer",
      hook: "A sensory experience defined by materiality and light.",
      description: "Contemporary cafe interior focusing on the tactile experience of materials. Uses raw concrete, warm wood, and strategic lighting.",
      icon: <Cpu className="w-6 h-6 text-gray-400" />,
      color: "gray-400",
      metric: "Atmospheric",
      gifUrl: "https://lh3.googleusercontent.com/d/1Ub86NTdcIwZLE58Cy0Ev5Zy1hYTF--ne",
      tags: ["Interior Design", "Materiality", "Lighting Design"],
      category: "Interior",
      details: {
        overview: "The Caffeine Lab is a boutique coffee house designed to be a sanctuary for urban dwellers. The project emphasizes the 'third space' concept—a place between home and work where community and creativity thrive.",
        challenge: "The primary challenge was to transform a narrow, deep commercial space with limited natural light into a vibrant and inviting environment without feeling claustrophobic.",
        solution: "We utilized a 'light-well' strategy, using reflective surfaces and a central skylight to pull light deep into the plan. A palette of raw, honest materials—exposed brick, reclaimed timber, and brushed brass—was used to create a layered, tactile experience.",
        images: ["https://picsum.photos/seed/cafe1/800/450?grayscale", "https://picsum.photos/seed/cafe2/800/450?grayscale"]
      }
    },
    {
      id: "ARCH_05",
      title: "Karunya Hospice",
      role: "Lead Architect (Thesis)",
      hook: "Designing for dignity, nature, and the final transition.",
      description: "Comprehensive hospice and palliative care facility designed to facilitate end-of-life care with dignity. Integrates nature into every space.",
      icon: <Activity className="w-6 h-6 text-gray-400" />,
      color: "gray-400",
      metric: "Biophilic",
      gifUrl: "https://lh3.googleusercontent.com/d/1cEY_3KZExGtCPAO_BJLjaEXJW2yUMLlM",
      tags: ["Healthcare Design", "Biophilic Architecture", "Thesis"],
      category: "Exterior",
      details: {
        overview: "Karunya Hospice is a 50-bed palliative care facility that redefines the environment of end-of-life care. It moves away from the clinical 'hospital' feel towards a domestic, nature-centric sanctuary.",
        challenge: "Balancing the high medical requirements of palliative care with a non-institutional, peaceful atmosphere that supports both patients and their grieving families.",
        solution: "The design uses a decentralized pavilion layout connected by sensory gardens. Each patient room has a private view of nature and direct access to outdoor terraces, ensuring that no patient is ever isolated from the natural world.",
        images: ["https://picsum.photos/seed/hospice1/800/450?grayscale", "https://picsum.photos/seed/hospice2/800/450?grayscale"]
      }
    },
    {
      id: "ARCH_06",
      title: "Recycled Bus Pavilion",
      role: "Design & Build Lead",
      hook: "National Citation for functional adaptive reuse.",
      description: "Competition-winning pavilion repurposed from a discarded bus using 100% recycled materials. Hands-on fabrication experience.",
      icon: <Hammer className="w-6 h-6 text-gray-400" />,
      color: "gray-400",
      metric: "Upcycled",
      gifUrl: "https://media.giphy.com/media/l41lTfuxR4R8E/giphy.gif",
      tags: ["Fabrication", "Materiality", "On-Site Assembly"],
      category: "Fabrication",
      details: {
        overview: "The Recycled Bus Pavilion was a live design-build project aimed at demonstrating the potential of 'upcycling' industrial waste into community infrastructure.",
        challenge: "Working with a rigid, pre-existing structural shell (the bus) and adapting it to a new, open-ended public function while ensuring structural safety.",
        solution: "We stripped the bus to its chassis and reinforced it with reclaimed steel sections. The design featured a modular seating system and a translucent roof made from recycled polycarbonate sheets, creating a lightweight, airy community hub.",
        images: ["https://picsum.photos/seed/bus1/800/450?grayscale", "https://picsum.photos/seed/bus2/800/450?grayscale"]
      }
    },
    {
      id: "ARCH_07",
      title: "Bamboo Grid Pavilion",
      role: "Fabrication Lead",
      hook: "Exploring parametric joinery in organic materials.",
      description: "A lightweight, modular pavilion constructed entirely from bamboo. Focuses on sustainable joinery and rapid on-site assembly.",
      icon: <Hammer className="w-6 h-6 text-gray-400" />,
      color: "gray-400",
      metric: "Sustainable",
      gifUrl: "https://media.giphy.com/media/l41lTfuxR4R8E/giphy.gif",
      tags: ["Bamboo", "Parametric Design", "Hands-on"],
      category: "Fabrication",
      details: {
        overview: "The Bamboo Grid Pavilion was an experimental structure that merged traditional bamboo construction with computational design logic.",
        challenge: "Bamboo is a non-standard material with varying diameters and strengths, making precise joinery difficult for a complex grid shell.",
        solution: "We developed a parametric joint system that could accommodate variations in bamboo culm size. The entire structure was prefabricated in modules and assembled on-site in less than 48 hours.",
        images: ["https://picsum.photos/seed/bamboo1/800/450?grayscale", "https://picsum.photos/seed/bamboo2/800/450?grayscale"]
      }
    }
  ];

  const bimArsenal: ArsenalItem[] = [
    {
      id: "BIM_01",
      title: "The Generative Documentation Engine",
      role: "BIM Automation Lead",
      hook: "Bypassing Revit UI limitations to automate large-scale sheet generation.",
      description: "A script that reads an Excel matrix and auto-generates hundreds of named, numbered sheets in Revit instantly. I proved I can eliminate manual drafting hours for an entire firm.",
      icon: <Code2 className="w-6 h-6 text-neon-cyan" />,
      color: "neon-cyan",
      metric: "Firm-Wide Scale",
      content: <CodeSnippet />,
      gifUrl: "https://media.giphy.com/media/3o7TKMGpxXfQC9cc4o/giphy.gif",
      tags: ["Revit API", "Dynamo", "Python"],
      workflow: {
        screenshotUrl: "https://picsum.photos/seed/workflow-1/800/450?grayscale",
        steps: [
          "Batch select viewports and sheet templates.",
          "Execute auto-alignment and scaling logic.",
          "Synchronize metadata across all documentation sets.",
          "Generate PDF/DWG exports with automated naming."
        ]
      }
    },
    {
      id: "BIM_02",
      title: "The 5D Data Harvester",
      role: "VDC Data Engineer",
      hook: "Scrubbing massive Revit models to extract exact facility parameters.",
      description: "A workflow that scrubs massive Revit models to extract exact facility parameters (furniture, doors, MEP) and writes clean, formatted Bill of Quantities (BOQ) data to Excel. I proved I handle construction data, not just pretty pictures.",
      icon: <Database className="w-6 h-6 text-neon-orange" />,
      color: "neon-orange",
      metric: "100% Accuracy",
      content: <DataTable />,
      gifUrl: "https://media.giphy.com/media/l41lTfuxR4R8E/giphy.gif",
      tags: ["Dynamo", "Excel"],
      workflow: {
        screenshotUrl: "https://picsum.photos/seed/workflow-2/800/450?grayscale",
        steps: [
          "Scan Revit database for non-compliant parameters.",
          "Apply regex-based scrubbing logic.",
          "Cross-reference with project financial spreadsheets.",
          "Export verified 5D data to Enterprise ERP."
        ]
      }
    },
    {
      id: "BIM_03",
      title: "The Parametric Geometry Framework",
      role: "Computational Designer",
      hook: "Automated massing and spatial generation.",
      description: "An algorithmic script that reads mathematical inputs to automatically generate complex spatial massing. I proved I understand computational logic and parametric relationships.",
      icon: <Layers className="w-6 h-6 text-neon-blue" />,
      color: "neon-blue",
      metric: "Computational",
      gifUrl: "https://media.giphy.com/media/3o7TKMGpxXfQC9cc4o/giphy.gif",
      tags: ["Rhino", "Grasshopper"],
      workflow: {
        screenshotUrl: "https://picsum.photos/seed/workflow-3/800/450?grayscale",
        steps: [
          "Initialize spatial parameters via mathematical inputs.",
          "Execute recursive subdivision algorithm.",
          "Map generated meshes to Revit native families.",
          "Validate topology and deploy to cloud database."
        ]
      }
    },
    {
      id: "BIM_04",
      title: "The Clash Matrix Pipeline",
      role: "BIM Coordinator",
      hook: "Streamlining multidisciplinary model coordination.",
      description: "A federated model hard-clash test. I rigged a structural model against an MEP plumbing model and captured the exact Red/Green intersections. I proved I can lead digital coordination and mitigate multi-million-dollar on-site errors.",
      icon: <Activity className="w-6 h-6 text-neon-cyan" />,
      color: "neon-cyan",
      metric: "Zero Errors",
      gifUrl: "https://lh3.googleusercontent.com/d/1G_5-CuXFQuIf9mft1d6CauX29EmntKOE",
      tags: ["Navisworks Manage", "Revit NWC Exporter"],
      workflow: {
        screenshotUrl: "https://picsum.photos/seed/workflow-4/800/450?grayscale",
        steps: [
          "Run hard clash tests between Structural and MEP federated models.",
          "Automate clash grouping by system and priority.",
          "Apply visual overrides for rapid identification.",
          "Generate coordination reports for site teams."
        ]
      },
      details: {
        overview: "Streamlining multidisciplinary model coordination through automated clash detection and resolution.",
        challenge: "Managing thousands of clashes across complex structural and MEP systems without manual oversight.",
        solution: "Implemented a federated model coordination pipeline in Navisworks that automated clash grouping and prioritized critical intersections for site teams.",
        reportUrl: "https://drive.google.com/file/d/1LetvlyhbGmUM-43bKoJR2OVGJQCNutWJ/view?usp=sharing"
      }
    },
    {
      id: "BIM_05",
      title: "Algorithmic Space Planning (Pending)",
      role: "VDC Engineer",
      hook: "Live demonstration of automated spatial data.",
      description: "(To be built) A live demonstration of automated spatial data (e.g., dragging a room boundary and watching the square footage and occupancy data update instantly).",
      icon: <Cpu className="w-6 h-6 text-neon-orange" />,
      color: "neon-orange",
      metric: "Dynamic",
      gifUrl: "https://media.giphy.com/media/3o7TKMGpxXfQC9cc4o/giphy.gif",
      tags: ["Vectorworks", "Marionette", "Space Tool"],
      workflow: {
        screenshotUrl: "https://picsum.photos/seed/workflow-5/800/450?grayscale",
        steps: [
          "Define room boundaries and circulation paths.",
          "Execute Marionette node for seating population.",
          "Optimize layouts based on daylight and proximity.",
          "Generate furniture schedules and installation plans."
        ]
      }
    },
    {
      id: "BIM_06",
      title: "The 4D Matrix (TimeLiner)",
      role: "Simulation Lead",
      hook: "Visualizing construction sequences over time.",
      description: "I integrated project schedules with 3D models to simulate construction sequences, identifying logistical bottlenecks before they happen on site.",
      icon: <ShieldCheck className="w-6 h-6 text-neon-blue" />,
      color: "neon-blue",
      metric: "4D Simulation",
      gifUrl: "https://lh3.googleusercontent.com/d/1qpMsNkw8HaPhf97qubs7GEV1BkZKsydz",
      tags: ["Navisworks Manage", "TimeLiner"],
      workflow: {
        screenshotUrl: "https://picsum.photos/seed/workflow-6/800/450?grayscale",
        steps: [
          "Import construction schedule into Navisworks.",
          "Link 3D model elements to schedule tasks.",
          "Configure appearance profiles for installation states.",
          "Execute 4D simulation to identify sequence conflicts."
        ]
      }
    },
    {
      id: "BIM_07",
      title: "Climate Automation",
      role: "Simulation Lead",
      hook: "Automating environmental and solar analysis.",
      description: "I automated environmental and solar analysis to achieve Net-Zero performance targets at the massing stage.",
      icon: <ShieldCheck className="w-6 h-6 text-neon-blue" />,
      color: "neon-blue",
      metric: "Net-Zero",
      gifUrl: "https://media.giphy.com/media/l41lTfuxR4R8E/giphy.gif",
      tags: ["Ladybug", "Honeybee", "Net-Zero"],
      workflow: {
        screenshotUrl: "https://picsum.photos/seed/workflow-7/800/450?grayscale",
        steps: [
          "Import massing geometry into Ladybug/Honeybee.",
          "Execute solar radiation and daylighting analysis.",
          "Iterate facade design based on heat map outputs.",
          "Validate performance against Net-Zero targets."
        ]
      }
    },
    {
      id: "BIM_08",
      title: "Corporate Data Standards",
      role: "Information Manager",
      hook: "ISO 19650 Information Management (Expert).",
      description: "I implemented ISO 19650 compliant workflows for large-scale corporate asset portfolios. I am a certified expert.",
      icon: <FileText className="w-6 h-6 text-neon-cyan" />,
      color: "neon-cyan",
      metric: "ISO 19650",
      gifUrl: "https://lh3.googleusercontent.com/d/1szL-O1_LuUqLzzsL3lJqB2JzX4K39dnt",
      tags: ["ISO 19650", "Information Management", "Expert"],
      isVerified: true,
      workflow: {
        screenshotUrl: "https://picsum.photos/seed/workflow-8/800/450?grayscale",
        steps: [
          "Define Organizational Information Requirements (OIR).",
          "Establish Common Data Environment (CDE) protocols.",
          "Audit project models for data naming and structure.",
          "Validate Asset Information Models (AIM) for handover."
        ]
      }
    },
    {
      id: "BIM_09",
      title: "Constructability Proof",
      role: "VDC Engineer",
      hook: "Bridging computational data with physical assembly.",
      description: "I bridged the gap between design and fabrication through detailed assembly modeling and site-ready shop drawings.",
      icon: <Hammer className="w-6 h-6 text-neon-orange" />,
      color: "neon-orange",
      metric: "Site-Ready",
      gifUrl: "https://lh3.googleusercontent.com/d/1P0FpPB-A9-Cs0bz1cywCumsfNBZyCA6j",
      tags: ["Solar Decathlon", "Fabrication", "Assembly"],
      workflow: {
        screenshotUrl: "https://picsum.photos/seed/workflow-9/800/450?grayscale",
        steps: [
          "Develop high-LOD assembly models (LOD 400).",
          "Extract precise cutting lists and fabrication data.",
          "Simulate assembly sequences for site logistics.",
          "Verify as-built conditions against design intent."
        ]
      },
      details: {
        overview: "Bridging computational data with physical assembly. Solar Decathlon Net-Zero Grand Winner & Hands-on fabrication.",
        challenge: "Translating complex simulation data into physical construction tolerances.",
        solution: "Developed a custom fabrication pipeline that mapped simulation outputs directly to CNC and manual assembly guides.",
        images: [
          "https://lh3.googleusercontent.com/d/1-BhZKRQJEpkQhE8Kuq6BURh0UYO7qYrH",
          "https://picsum.photos/seed/bamboo1/800/450?grayscale"
        ]
      }
    }
  ];

  const arsenal = isArch ? archArsenal : bimArsenal;

  const experience: ExperienceData[] = [
    {
      year: "Dec 2025 - Present",
      company: "IMK Architects",
      role: "Architectural Intern",
      description: "Navigating complex project coordination and assisting in large-scale architectural delivery. Managing digital 3D modeling pipelines and spatial coordination. Developed Python and Dynamo toolkits to automate repetitive data entry."
    },
    {
      year: "Jan 2025 - Present",
      company: "Self-Employed",
      role: "3D Visualizer",
      description: "Managed end-to-end digital delivery pipelines, translating complex client requirements into highly accurate 3D architectural models. Produced high-fidelity architectural visualizations and photorealistic renders using Enscape, D5 Render, and Twinmotion."
    },
    {
      year: "July 2025 - Sept 2025",
      company: "E.D.P Consultants",
      role: "Architectural Intern",
      description: "Prepared detailed working drawings and refined layouts for residential projects with a focus on accessibility and Vaastu compliance. Developed 3D models and high-quality renders for client presentations."
    },
    {
      year: "Sept 2024 - May 2025",
      company: "Anvaya",
      role: "Simulation Lead",
      description: "Directed building performance and environmental simulations for the Health and Well-being division of the Solar Decathlon India challenge. Optimized design outcomes for large-scale Construction Worker Housing."
    },
    {
      year: "Dec 2021 - March 2026",
      company: "BMS College of Architecture",
      role: "Bachelor of Architecture (B.Arch)",
      description: "Focusing on the intersection of traditional architecture and computational BIM workflows."
    }
  ];

  const handleSectionChange = (index: number) => {
    const visibleSections = SECTIONS.filter(s => isArch || s !== 'fabrication');
    if (index >= 0 && index < visibleSections.length) {
      const sectionId = visibleSections[index].toLowerCase();
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      const sectionElements = SECTIONS.map(s => document.getElementById(s.toLowerCase()));
      
      sectionElements.forEach((el, i) => {
        if (el && scrollPosition >= el.offsetTop && scrollPosition < el.offsetTop + el.offsetHeight) {
          setActiveSection(i);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen w-full transition-colors duration-700 ${isArch ? "bg-white text-gray-900 font-serif" : "bg-terminal-bg text-gray-300 font-sans"} relative overflow-x-hidden`}>
      <AmbientBackground isArch={isArch} />
      
      {/* Header / Nav */}
      <header className={`fixed top-0 w-full z-[60] backdrop-blur-md border-b px-4 md:px-6 py-3 md:py-4 flex justify-between items-center transition-all duration-700 ${isArch ? "bg-white/80 border-gray-100" : "bg-terminal-bg/80 border-terminal-border"}`}>
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2">
            <Terminal className={`w-4 h-4 md:w-5 md:h-5 ${isArch ? "text-gray-400" : "text-neon-cyan"}`} />
            <span className={`font-mono font-semibold tracking-tighter text-xs md:text-sm transition-colors duration-700 ${isArch ? "text-black" : "text-white"}`}>KARTHIKRAJ_NADAR</span>
          </div>
          
          {/* Mode Toggle */}
          <button 
            onClick={() => setMode(isArch ? 'bim' : 'arch')}
            className={`flex items-center gap-2 px-2 md:px-3 py-1 rounded-full border text-[8px] md:text-[10px] font-mono uppercase tracking-widest transition-all duration-500 ${
              isArch 
              ? "bg-black text-white border-black" 
              : "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30 hover:bg-neon-cyan/20"
            }`}
          >
            {isArch ? <Box className="w-3 h-3" /> : <Layers className="w-3 h-3" />}
            <span className="hidden sm:inline">Switch to </span>{isArch ? "BIM_MODE" : "ARCH_MODE"}
          </button>
        </div>

        {/* Desktop Nav */}
        <div className={`hidden md:flex gap-6 font-mono text-xs uppercase tracking-widest transition-colors duration-700 ${isArch ? "text-gray-600" : "text-gray-500"}`}>
          {SECTIONS.filter(s => isArch || s !== 'fabrication').map((s, i) => (
            <button 
              key={s}
              onClick={() => handleSectionChange(i)}
              className={`hover:text-neon-cyan transition-colors ${activeSection === i ? (isArch ? "text-black font-bold" : "text-neon-cyan") : ""}`}
            >
              {isArch ? (s === 'arsenal' ? 'projects' : s === 'terminal' ? 'about me' : s === 'fabrication' ? 'fabrication' : s) : (s === 'arsenal' ? 'workflows' : s)}
            </button>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`md:hidden p-2 transition-colors ${isArch ? "text-black" : "text-neon-cyan"}`}
        >
          {isMenuOpen ? <Box className="w-5 h-5 rotate-45" /> : <Layers className="w-5 h-5" />}
        </button>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              className={`fixed inset-0 z-[70] md:hidden flex flex-col items-center justify-center gap-8 font-mono text-lg uppercase tracking-[0.3em] transition-colors duration-700 ${
                isArch ? "bg-white text-black" : "bg-terminal-bg text-neon-cyan"
              }`}
            >
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-6 right-6 p-2"
              >
                <Box className="w-8 h-8 rotate-45" />
              </button>
              {SECTIONS.filter(s => isArch || s !== 'fabrication').map((s, i) => (
                <button 
                  key={s}
                  onClick={() => {
                    handleSectionChange(i);
                    setIsMenuOpen(false);
                  }}
                  className={`hover:scale-110 transition-transform ${activeSection === i ? "font-bold underline underline-offset-8" : ""}`}
                >
                  {isArch ? (s === 'arsenal' ? 'projects' : s === 'terminal' ? 'about me' : s === 'fabrication' ? 'fabrication' : s) : (s === 'arsenal' ? 'workflows' : s)}
                </button>
              ))}
              <div className="mt-8 flex flex-col items-center gap-4">
                <div className="text-[10px] opacity-40">Switch Environment</div>
                <button 
                  onClick={() => {
                    setMode(isArch ? 'bim' : 'arch');
                    setIsMenuOpen(false);
                  }}
                  className={`px-6 py-3 border font-mono text-xs uppercase tracking-widest transition-all duration-500 ${
                    isArch 
                    ? "bg-black text-white border-black" 
                    : "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30"
                  }`}
                >
                  {isArch ? "Initialize BIM_MODE" : "Initialize ARCH_MODE"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Progress Indicator */}
      <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 hidden sm:flex flex-col gap-4 items-center">
        <button 
          onClick={() => handleSectionChange(activeSection - 1)}
          disabled={activeSection === 0}
          className={`p-2 border transition-colors ${
            isArch 
            ? "border-gray-200 hover:bg-black hover:text-white" 
            : "brutalist-border hover:bg-neon-cyan hover:text-black"
          } disabled:opacity-20`}
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <div className="flex flex-col gap-2">
          {SECTIONS.map((_, i) => (
            <button 
              key={i}
              onClick={() => handleSectionChange(i)}
              className={`w-1 h-8 rounded-full transition-all duration-500 ${
                activeSection === i 
                ? (isArch ? "bg-black h-12" : "bg-neon-cyan h-12") 
                : (isArch ? "bg-gray-100" : "bg-terminal-border")
              }`}
            />
          ))}
        </div>
        <button 
          onClick={() => handleSectionChange(activeSection + 1)}
          disabled={activeSection === SECTIONS.length - 1}
          className={`p-2 border transition-colors ${
            isArch 
            ? "border-gray-200 hover:bg-black hover:text-white" 
            : "brutalist-border hover:bg-neon-cyan hover:text-black"
          } disabled:opacity-20`}
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <main className="relative z-10">
        <ParallaxSection id="hero" index={0} setActiveSection={setActiveSection}>
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
            <div className={`flex flex-col ${isArch ? "text-center lg:text-left" : "text-center lg:text-left"}`}>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[8px] md:text-[10px] font-mono uppercase tracking-widest mb-4 md:mb-6 mx-auto lg:mx-0 transition-all duration-700 ${
                isArch 
                ? "border-gray-200 bg-gray-50 text-gray-500" 
                : "border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan"
              }`}>
                <Activity className="w-3 h-3" /> {isArch ? "Portfolio: Architectural Design" : "System Online: Data Engineering"}
              </div>
              <div className={`mb-2 md:mb-4 font-mono text-[10px] md:text-sm uppercase tracking-widest transition-colors duration-700 ${isArch ? "text-gray-400" : "text-neon-cyan"}`}>
                Karthikraj V Nadar, {isArch ? "Architect & Spatial Visionary." : "Junior VDC Engineer & BIM Data Developer."}
              </div>
              <h1 className={`text-xl md:text-4xl font-medium tracking-tighter leading-tight mb-4 transition-colors duration-700 ${isArch ? "text-black font-serif italic" : "text-white font-sans"}`}>
                {isArch ? (
                  <>Sculpting <span className="text-gray-400">Space</span>, Light, and the Human <span className="text-gray-300">Experience</span>.</>
                ) : (
                  <>Automating <span className="text-neon-cyan">AEC workflows</span> and managing <span className="text-neon-orange">ISO 19650</span> facility data.</>
                )}
              </h1>
              <p className={`text-xs md:text-sm font-mono mb-6 max-w-xl mx-auto lg:mx-0 transition-colors duration-700 ${isArch ? "text-gray-500 italic" : "text-gray-400"}`}>
                {isArch ? "Exploring the intersection of tectonic form and phenomenological impact." : "Specializing in BIM Automation, Algorithmic Design, and Computational Workflows."}
              </p>
              
              <SoftwareStack isArch={isArch} />

              <div className="mt-8 md:mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <button 
                  onClick={() => handleSectionChange(1)}
                  className={`group relative w-full sm:w-auto px-8 py-4 font-semibold uppercase tracking-tighter flex items-center justify-center gap-3 transition-all duration-700 ${
                    isArch 
                    ? "bg-black text-white hover:bg-gray-800" 
                    : "bg-neon-cyan text-black hover:bg-white"
                  }`}
                >
                  {isArch ? "Explore Works" : "Initialize Workflows"}
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <a 
                  href="https://drive.google.com/uc?export=download&id=1GIU55YxLDgVJ1DJV1KY_Yyb9Q5RhnO4y" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative w-full sm:w-auto px-8 py-4 font-semibold uppercase tracking-tighter flex items-center justify-center gap-3 transition-all duration-700 ${
                    isArch 
                    ? "bg-white text-black hover:bg-black hover:text-white border-black border" 
                    : "bg-transparent text-neon-cyan hover:bg-neon-cyan/10 border-neon-cyan border"
                  }`}
                >
                  <Download className="w-5 h-5" />
                  Download Resume
                </a>
              </div>
            </div>
            
            <div className={`relative aspect-video lg:aspect-square border overflow-hidden block transition-all duration-700 min-h-[300px] mx-auto w-full max-w-2xl lg:max-w-none ${
              isArch 
              ? "border-gray-100 bg-gray-50/50" 
              : "brutalist-border bg-terminal-border/10"
            }`}>
              <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-700 ${isArch ? "opacity-5" : "opacity-20"}`}>
                <div className="w-full h-full grid grid-cols-12 grid-rows-12">
                  {Array.from({ length: 144 }).map((_, i) => (
                    <div key={i} className={`border-[0.5px] ${isArch ? "border-black" : "border-neon-cyan/20"}`} />
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-black/5">
                {isArch ? (
                  <img 
                    key="arch-hero-gif"
                    src="https://lh3.googleusercontent.com/d/1-BhZKRQJEpkQhE8Kuq6BURh0UYO7qYrH" 
                    alt="Arch Hero GIF"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-100 transition-all duration-1000 pointer-events-none select-none"
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                  />
                ) : (
                  <video 
                    key="bim-video"
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    preload="auto"
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-full h-full object-cover opacity-90 transition-all duration-1000 pointer-events-none select-none"
                  >
                    <source src="https://drive.google.com/uc?export=download&id=14J3YA_Cq_zr7A7m5rzQtmrLQflBX-bno" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              <div className={`absolute bottom-4 left-4 font-mono text-[10px] transition-colors duration-700 ${isArch ? "text-gray-300" : "text-neon-cyan/60"}`}>
                {isArch ? "[ARCH_STUDIO_v1.0]" : "[SYSTEM_RENDER_ID: 0x449031731270]"}
              </div>
            </div>
          </div>
        </ParallaxSection>

        <ParallaxSection id="arsenal" index={1} setActiveSection={setActiveSection}>
          <div>
            <div className="mb-12">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`text-xs font-mono uppercase tracking-[0.3em] mb-4 transition-colors duration-700 ${isArch ? "text-gray-800" : "text-neon-cyan"}`}
              >
                {isArch ? "Section_01 // Projects" : "Section_01 // Automation_Stack"}
              </motion.h2>
              {!isArch && (
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className={`text-xl md:text-2xl font-medium tracking-tighter transition-colors duration-700 ${isArch ? "text-black font-serif italic" : "text-white font-sans"}`}
                >
                  The Workflows
                </motion.h3>
              )}
            </div>

            <motion.div 
              key={`arsenal-${isArch}`}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.05 }}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {arsenal.filter(item => !isArch || item.category !== 'Fabrication').map((item) => (
                <motion.div 
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
                  }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedArsenalItem(item)}
                  className={`group relative overflow-hidden border transition-all duration-700 cursor-pointer ${
                    isArch 
                    ? "border-gray-100 bg-white hover:border-black" 
                    : "border-terminal-border bg-black/40 hover:border-neon-cyan"
                  }`}
                >
                  <div className="aspect-video md:aspect-square overflow-hidden relative">
                    <img 
                      src={item.gifUrl} 
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                      className={`w-full h-full object-cover transition-all duration-700 pointer-events-none select-none ${
                        isArch 
                        ? "grayscale group-hover:grayscale-0" 
                        : "opacity-40 group-hover:opacity-100"
                      }`}
                    />
                    <div className={`absolute inset-0 transition-opacity duration-700 ${isArch ? "bg-black/5 opacity-0 group-hover:opacity-100" : "bg-neon-cyan/10 opacity-0 group-hover:opacity-100"}`} />
                    <div className={`absolute top-2 right-2 px-2 py-1 font-mono text-[8px] transition-colors duration-700 ${isArch ? "bg-black text-white" : "bg-neon-orange text-black"}`}>
                      {item.id}
                    </div>
                    <div className={`absolute bottom-2 left-2 p-2 rounded border transition-all duration-700 ${
                      isArch 
                      ? "bg-white/80 border-gray-100 text-black" 
                      : `bg-black/80 border-${item.color}/20 text-${item.color}`
                    }`}>
                      {item.icon}
                    </div>
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={`text-base md:text-lg font-medium tracking-tight transition-colors duration-700 ${isArch ? "text-black font-serif italic" : "text-white font-sans"}`}>
                        {item.title}
                      </h4>
                      {item.category && (
                        <div className="flex items-center gap-1 md:gap-2">
                          {item.isVerified && (
                            <ShieldCheck className={`w-2.5 h-2.5 md:w-3 md:h-3 ${isArch ? "text-black" : "text-neon-cyan"}`} />
                          )}
                          <span className={`text-[7px] md:text-[8px] font-mono px-1.5 md:px-2 py-0.5 border transition-colors duration-700 ${isArch ? "border-black text-black" : "border-neon-cyan text-neon-cyan"}`}>
                            {item.category}
                          </span>
                        </div>
                      )}
                    </div>
                    {item.role && (
                      <div className={`text-[9px] md:text-[10px] font-mono mb-1 md:mb-2 transition-colors duration-700 ${isArch ? "text-gray-400" : "text-neon-orange"}`}>
                        {item.role}
                      </div>
                    )}
                    {item.hook && (
                      <div className={`text-[9px] md:text-[10px] font-mono mb-3 md:mb-4 transition-colors duration-700 ${isArch ? "text-gray-600 italic" : "text-neon-cyan"}`}>
                        {item.hook}
                      </div>
                    )}
                    <p className={`text-xs md:text-sm mb-4 md:mb-6 line-clamp-2 md:line-clamp-3 transition-colors duration-700 ${isArch ? "text-gray-500 italic" : "text-gray-400 font-mono"}`}>
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4">
                      {item.tags.map(tag => (
                        <span key={tag} className={`text-[7px] md:text-[8px] font-mono px-1.5 md:px-2 py-0.5 border transition-colors duration-700 ${isArch ? "border-gray-100 text-gray-400" : "border-terminal-border text-gray-500"}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className={`flex items-center gap-2 font-mono text-[9px] md:text-[10px] font-bold uppercase ${isArch ? "text-gray-400" : `text-${item.color}`}`}>
                      {item.metric}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </ParallaxSection>

        {isArch && (
          <ParallaxSection id="fabrication" index={2} setActiveSection={setActiveSection}>
            <div>
              <div className="mb-12">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`text-xs font-mono uppercase tracking-[0.3em] mb-4 transition-colors duration-700 ${isArch ? "text-gray-800" : "text-neon-cyan"}`}
              >
                Section_02 // Fabrication & Hands-on
              </motion.h2>
            </div>

            <motion.div 
              key={`fabrication-${isArch}`}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.05 }}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {arsenal.filter(item => item.category === 'Fabrication').map((item) => (
                <motion.div 
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
                  }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedArsenalItem(item)}
                  className={`group relative overflow-hidden border transition-all duration-700 cursor-pointer ${
                    isArch 
                    ? "border-gray-100 bg-white hover:border-black" 
                    : "border-terminal-border bg-black/40 hover:border-neon-cyan"
                  }`}
                >
                    <div className="aspect-video md:aspect-square overflow-hidden relative">
                      <img 
                        src={item.gifUrl} 
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                        className={`w-full h-full object-cover transition-all duration-700 pointer-events-none select-none ${
                          isArch 
                          ? "grayscale group-hover:grayscale-0" 
                          : "opacity-40 group-hover:opacity-100"
                        }`}
                      />
                      <div className={`absolute inset-0 transition-opacity duration-700 ${isArch ? "bg-black/5 opacity-0 group-hover:opacity-100" : "bg-neon-cyan/10 opacity-0 group-hover:opacity-100"}`} />
                      <div className={`absolute top-2 right-2 px-2 py-1 font-mono text-[8px] transition-colors duration-700 ${isArch ? "bg-black text-white" : "bg-neon-orange text-black"}`}>
                        {item.id}
                      </div>
                      <div className={`absolute bottom-2 left-2 p-2 rounded border transition-all duration-700 ${
                        isArch 
                        ? "bg-white/80 border-gray-100 text-black" 
                        : `bg-black/80 border-${item.color}/20 text-${item.color}`
                      }`}>
                        {item.icon}
                      </div>
                    </div>
                    <div className="p-4 md:p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`text-base md:text-lg font-medium tracking-tight transition-colors duration-700 ${isArch ? "text-black font-serif italic" : "text-white font-sans"}`}>
                          {item.title}
                        </h4>
                        {item.category && (
                          <div className="flex items-center gap-1 md:gap-2">
                            {item.isVerified && (
                              <ShieldCheck className={`w-2.5 h-2.5 md:w-3 md:h-3 ${isArch ? "text-black" : "text-neon-cyan"}`} />
                            )}
                            <span className={`text-[7px] md:text-[8px] font-mono px-1.5 md:px-2 py-0.5 border transition-colors duration-700 ${isArch ? "border-black text-black" : "border-neon-cyan text-neon-cyan"}`}>
                              {item.category}
                            </span>
                          </div>
                        )}
                      </div>
                      {item.role && (
                        <div className={`text-[9px] md:text-[10px] font-mono mb-1 md:mb-2 transition-colors duration-700 ${isArch ? "text-gray-400" : "text-neon-orange"}`}>
                          {item.role}
                        </div>
                      )}
                      {item.hook && (
                        <div className={`text-[9px] md:text-[10px] font-mono mb-3 md:mb-4 transition-colors duration-700 ${isArch ? "text-gray-600 italic" : "text-neon-cyan"}`}>
                          {item.hook}
                        </div>
                      )}
                      <p className={`text-xs md:text-sm mb-4 md:mb-6 line-clamp-2 md:line-clamp-3 transition-colors duration-700 ${isArch ? "text-gray-500 italic" : "text-gray-400 font-mono"}`}>
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4">
                        {item.tags.map(tag => (
                          <span key={tag} className={`text-[7px] md:text-[8px] font-mono px-1.5 md:px-2 py-0.5 border transition-colors duration-700 ${isArch ? "border-gray-100 text-gray-400" : "border-terminal-border text-gray-500"}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className={`flex items-center gap-2 font-mono text-[9px] md:text-[10px] font-bold uppercase ${isArch ? "text-gray-400" : `text-${item.color}`}`}>
                        {item.metric}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </ParallaxSection>
        )}

        <ParallaxSection id="experience" index={isArch ? 3 : 2} setActiveSection={setActiveSection}>
          <div className="w-full max-w-4xl mx-auto">
            <div className="mb-8 md:mb-12 text-center">
              <motion.h2 
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] mb-2 md:mb-4 transition-colors duration-700 ${isArch ? "text-gray-800" : "text-neon-blue"}`}
              >
                {isArch ? "Section_03 // Career_Path" : "Section_03 // Deployment_History"}
              </motion.h2>
              <motion.h3 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`text-lg md:text-2xl font-medium tracking-tighter transition-colors duration-700 ${isArch ? "text-black font-serif italic" : "text-white font-sans"}`}
              >
                Professional Experience
              </motion.h3>
            </div>

            <div className="max-w-3xl mx-auto relative px-4 md:px-0">
              {/* Timeline Line */}
              <div className={`absolute left-4 md:left-1/2 top-0 bottom-0 w-px transition-colors duration-700 ${isArch ? "bg-gray-100" : "bg-terminal-border"}`} />
              
              <motion.div 
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.05 }}
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05
                    }
                  }
                }}
                className="space-y-8 md:space-y-12"
              >
                {experience.map((exp, idx) => (
                  <motion.div 
                    key={idx} 
                    variants={{
                      hidden: { opacity: 0, x: idx % 2 === 0 ? 50 : -50 },
                      show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
                    }}
                    className={`relative flex flex-col md:flex-row gap-4 md:gap-8 ${idx % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                  >
                    {/* Timeline Dot */}
                    <div className={`absolute left-4 md:left-1/2 w-3 h-3 -translate-x-[6px] mt-1.5 border transition-all duration-700 z-10 ${
                      isArch 
                      ? "bg-white border-black" 
                      : "bg-black border-neon-cyan shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                    }`} />
                    
                    <div className={`pl-10 md:pl-0 md:w-1/2 ${idx % 2 === 0 ? "md:pl-12" : "md:pr-12 text-left md:text-right"}`}>
                      <span className={`text-[10px] md:text-xs font-mono mb-1 block transition-colors duration-700 ${isArch ? "text-gray-400" : "text-neon-orange"}`}>
                        {exp.year}
                      </span>
                      <h4 className={`text-base md:text-lg font-medium mb-1 transition-colors duration-700 ${isArch ? "text-black font-serif italic" : "text-white font-sans"}`}>
                        {exp.company}
                      </h4>
                      <div className={`text-[10px] md:text-xs font-mono mb-2 md:mb-3 transition-colors duration-700 ${isArch ? "text-gray-500" : "text-neon-blue"}`}>
                        {exp.role}
                      </div>
                      <p className={`text-xs md:text-sm leading-relaxed transition-colors duration-700 ${isArch ? "text-gray-400 italic" : "text-gray-400 font-mono"}`}>
                        {exp.description}
                      </p>
                    </div>
                    <div className="hidden md:block md:w-1/2" />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Certification Badge */}
            <div className="mt-12 md:mt-20 flex flex-col items-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`p-1 rounded-full ${isArch ? "bg-gray-50" : "bg-neon-cyan/10 shadow-[0_0_20px_rgba(0,255,255,0.1)]"}`}
              >
                <div className={`border-2 border-dashed p-3 md:p-4 rounded-full flex items-center justify-center ${isArch ? "border-gray-200" : "border-neon-cyan/30"}`}>
                  <img 
                    src="https://lh3.googleusercontent.com/d/1szL-O1_LuUqLzzsL3lJqB2JzX4K39dnt" 
                    alt="ISO 19650 Certification" 
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                    className={`w-16 h-16 md:w-24 md:h-24 object-contain pointer-events-none select-none ${isArch ? "grayscale opacity-80" : "brightness-110"}`}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>
              <div className="mt-4 text-center px-6">
                <div className={`text-[8px] md:text-[10px] font-mono uppercase tracking-[0.2em] mb-1 ${isArch ? "text-gray-400" : "text-neon-cyan"}`}>
                  Verified Credential
                </div>
                <div className={`text-xs md:text-sm font-medium ${isArch ? "text-black font-serif italic" : "text-white font-sans"}`}>
                  ISO 19650 Information Management Expert (Level 3)
                </div>
                <div className={`text-[8px] md:text-[10px] font-mono mt-1 ${isArch ? "text-gray-400" : "text-gray-500"}`}>
                  Powered by Plannerly
                </div>
              </div>
            </div>

            {/* Mode Switcher CTA */}
            <div className="mt-12 md:mt-20 flex flex-col items-center gap-6 px-6">
              <div className={`text-[8px] md:text-[10px] font-mono uppercase tracking-[0.3em] transition-colors duration-700 ${isArch ? "text-gray-300" : "text-neon-cyan/40"}`}>
                {isArch ? "Explore the VDC Core" : "Return to Arch Studio"}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setMode(isArch ? 'bim' : 'arch');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full sm:w-auto px-8 py-4 border font-mono text-xs uppercase tracking-[0.2em] transition-all duration-700 flex items-center justify-center gap-3 ${
                  isArch 
                  ? "border-black bg-black text-white hover:bg-white hover:text-black" 
                  : "brutalist-border bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan hover:text-black shadow-[0_0_20px_rgba(0,255,255,0.2)]"
                }`}
              >
                {isArch ? (
                  <>
                    <Zap className="w-4 h-4" />
                    Initialize BIM Mode
                  </>
                ) : (
                  <>
                    <Layers className="w-4 h-4" />
                    Initialize Arch Mode
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </ParallaxSection>

        <ParallaxSection id="terminal" index={isArch ? 4 : 3} setActiveSection={setActiveSection}>
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.05 }}
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="w-full"
          >
            <div className={`border p-4 md:p-6 font-mono text-xs relative overflow-hidden transition-all duration-700 ${
              isArch 
              ? "border-gray-100 bg-white" 
              : "brutalist-border bg-terminal-bg"
            }`}>
              <div className={`flex items-center gap-2 mb-4 md:mb-6 border-b pb-4 transition-colors duration-700 ${isArch ? "border-gray-100" : "border-terminal-border"}`}>
                <div className={`w-2 h-2 rounded-full ${isArch ? "bg-gray-200" : "bg-red-500/50"}`} />
                <div className={`w-2 h-2 rounded-full ${isArch ? "bg-gray-200" : "bg-yellow-500/50"}`} />
                <div className={`w-2 h-2 rounded-full ${isArch ? "bg-gray-200" : "bg-green-500/50"}`} />
                <span className="ml-2 text-gray-500 text-[8px] md:text-[10px]">{isArch ? "about_me_session" : "vdc_terminal_session"}</span>
              </div>
              
              <div className="space-y-4 overflow-x-auto">
                <div className="flex gap-2 min-w-max">
                  <span className={isArch ? "text-black font-bold" : "text-neon-cyan"}>{isArch ? "arch@studio:~$ " : "guest@vdc_core:~$"}</span>
                  <span className={isArch ? "text-gray-400" : "text-white"}>whoami</span>
                </div>
                <div className="text-gray-400 italic text-[10px] md:text-xs">
                  {isArch 
                    ? "Karthikraj V Nadar. Architectural Intern. AEC Workflow Automation." 
                    : "BIM/VDC & ISO 19650. Computational Design. Dynamo • Python."}
                </div>
                
                <div className="flex gap-2 min-w-max">
                  <span className={isArch ? "text-black font-bold" : "text-neon-cyan"}>{isArch ? "arch@studio:~$ " : "guest@vdc_core:~$"}</span>
                  <span className={isArch ? "text-gray-400" : "text-white"}>cat ./certifications/iso19650.txt</span>
                </div>
                <div className={`p-3 md:p-4 border border-dashed transition-colors duration-700 ${isArch ? "border-gray-100 bg-gray-50/50" : "border-neon-cyan/30 bg-neon-cyan/5"}`}>
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded border flex items-center justify-center shrink-0 ${isArch ? "border-gray-200 bg-white" : "border-neon-cyan/50 bg-black"}`}>
                      <img 
                        src="https://lh3.googleusercontent.com/d/1szL-O1_LuUqLzzsL3lJqB2JzX4K39dnt" 
                        alt="Badge" 
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                        className="w-6 h-6 md:w-8 md:h-8 object-contain pointer-events-none select-none"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <div className={`text-[10px] md:text-xs ${isArch ? "text-black font-bold" : "text-neon-cyan"}`}>ISO 19650 EXPERT - LEVEL 3</div>
                      <div className="text-[8px] md:text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Information Manager Certification</div>
                      <div className="text-[8px] md:text-[10px] text-gray-400 mt-2 leading-relaxed">
                        Verified expertise in global digital delivery standards, Common Data Environments (CDE), and information management protocols for large-scale infrastructure.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 min-w-max">
                  <span className={isArch ? "text-black font-bold" : "text-neon-cyan"}>{isArch ? "arch@studio:~$ " : "guest@vdc_core:~$"}</span>
                  <span className={isArch ? "text-gray-400" : "text-white"}>ls ./contact</span>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-6">
                  <a href="mailto:karthikraj.v.nadar@gmail.com" className={`flex items-center gap-2 hover:underline transition-colors duration-700 text-[10px] md:text-xs ${isArch ? "text-black" : "text-neon-cyan"}`}>
                    <Mail className="w-3 h-3" /> karthikraj.v.nadar@gmail.com
                  </a>
                  <div className={`flex items-center gap-2 transition-colors duration-700 text-[10px] md:text-xs ${isArch ? "text-black" : "text-neon-cyan"}`}>
                    <Phone className="w-3 h-3" /> 8779228622
                  </div>
                  <a href="https://www.linkedin.com/in/karthikraj-nadar-07083526a" className={`flex items-center gap-2 hover:underline transition-colors duration-700 text-[10px] md:text-xs ${isArch ? "text-black" : "text-neon-cyan"}`}>
                    <Linkedin className="w-3 h-3" /> linkedin.com/in/karthikraj-nadar-07083526a
                  </a>
                </div>

                <div className="flex gap-2 mt-4 min-w-max">
                  <span className={isArch ? "text-black font-bold" : "text-neon-cyan"}>{isArch ? "arch@studio:~$ " : "guest@vdc_core:~$"}</span>
                  <span className={isArch ? "text-gray-400" : "text-white"}>cat ./skills</span>
                </div>
                <div className="text-gray-400 text-[9px] md:text-[10px] space-y-1">
                  <div>• BIM: Revit, Navisworks, Dynamo, Python</div>
                  <div>• Design: Rhino, Grasshopper, D5 Render, AI Imagery</div>
                  <div>• VDC: Clash Detection, ISO 19650, 5D Data Harvesting</div>
                </div>

                <div className="flex gap-2 mt-4 min-w-max">
                  <span className={isArch ? "text-black font-bold" : "text-neon-cyan"}>{isArch ? "arch@studio:~$ " : "guest@vdc_core:~$"}</span>
                  <span className={isArch ? "text-gray-400" : "text-white"}>ls ./languages</span>
                </div>
                <div className="text-gray-400 text-[9px] md:text-[10px] flex flex-wrap gap-x-4 gap-y-1">
                  <span>English [Full]</span>
                  <span>Hindi [Native]</span>
                  <span>Tamil [Native]</span>
                  <span>Marathi [Limited]</span>
                  <span>Kannada [Limited]</span>
                </div>

                <div className="flex gap-2 mt-4 min-w-max">
                  <span className={isArch ? "text-black font-bold" : "text-neon-cyan"}>{isArch ? "arch@studio:~$ " : "guest@vdc_core:~$"}</span>
                  <span className={isArch ? "text-gray-400" : "text-white"}>cat ./achievements</span>
                </div>
                <div className="text-gray-400 text-[9px] md:text-[10px] space-y-1">
                  <div>• Grand Winner | Solar Decathlon India (2024–2025)</div>
                  <div>• Citation | 66th Annual NASA Design Competition</div>
                  <div>• ISO 19650 Information Management Expert</div>
                  <div>• Net Zero Energy and Water Buildings Certified</div>
                </div>

                <div className="flex gap-2 mt-6 md:mt-8 min-w-max">
                  <span className={isArch ? "text-black font-bold" : "text-neon-cyan"}>{isArch ? "arch@studio:~$ " : "guest@vdc_core:~$"}</span>
                  <span className={isArch ? "text-gray-400" : "text-white"}>echo "Based in Mumbai. Available for corporate VDC roles starting May 2026."</span>
                </div>

                <div className="flex gap-2 mt-4 min-w-max">
                  <span className={isArch ? "text-black font-bold" : "text-neon-cyan"}>{isArch ? "arch@studio:~$ " : "guest@vdc_core:~$"}</span>
                  <span className={isArch ? "text-gray-400" : "text-white"}>./send_message.sh</span>
                </div>

                <div className={`mt-4 p-4 md:p-6 border transition-all duration-700 ${isArch ? "border-gray-100 bg-gray-50/30" : "border-neon-cyan/20 bg-black/40"}`}>
                  {isSent ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="py-8 text-center space-y-4"
                    >
                      <div className={`text-2xl ${isArch ? "text-black" : "text-neon-cyan"}`}>✓</div>
                      <div className={`font-mono text-xs uppercase tracking-widest ${isArch ? "text-black" : "text-white"}`}>
                        MESSAGE_TRANSMITTED_SUCCESSFULLY
                      </div>
                      <p className={`text-[10px] font-mono ${isArch ? "text-gray-400" : "text-gray-500"}`}>
                        ACKNOWLEDGMENT_ID: {Math.random().toString(16).substring(2, 10).toUpperCase()}
                      </p>
                    </motion.div>
                  ) : (
                    <form className="space-y-4" onSubmit={handleFormSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className={`text-[8px] md:text-[10px] uppercase tracking-widest ${isArch ? "text-gray-400" : "text-neon-cyan/50"}`}>Name</label>
                          <input 
                            type="text" 
                            required
                            value={formState.name}
                            onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="ENTER_NAME"
                            className={`w-full bg-transparent border-b p-2 outline-none transition-all duration-700 text-[10px] md:text-xs ${
                              isArch ? "border-gray-200 focus:border-black text-black" : "border-terminal-border focus:border-neon-cyan text-white"
                            }`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className={`text-[8px] md:text-[10px] uppercase tracking-widest ${isArch ? "text-gray-400" : "text-neon-cyan/50"}`}>Email</label>
                          <input 
                            type="email" 
                            required
                            value={formState.email}
                            onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="ENTER_EMAIL"
                            className={`w-full bg-transparent border-b p-2 outline-none transition-all duration-700 text-[10px] md:text-xs ${
                              isArch ? "border-gray-200 focus:border-black text-black" : "border-terminal-border focus:border-neon-cyan text-white"
                            }`}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className={`text-[8px] md:text-[10px] uppercase tracking-widest ${isArch ? "text-gray-400" : "text-neon-cyan/50"}`}>Message</label>
                        <textarea 
                          rows={3}
                          required
                          value={formState.message}
                          onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
                          placeholder="ENTER_MESSAGE_CONTENT"
                          className={`w-full bg-transparent border-b p-2 outline-none transition-all duration-700 text-[10px] md:text-xs resize-none ${
                            isArch ? "border-gray-200 focus:border-black text-black" : "border-terminal-border focus:border-neon-cyan text-white"
                          }`}
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={isSending}
                        className={`w-full py-3 border font-mono text-[10px] md:text-xs uppercase tracking-widest transition-all duration-700 flex items-center justify-center gap-2 ${
                          isSending ? "opacity-50 cursor-not-allowed" : ""
                        } ${
                          isArch 
                          ? "bg-black text-white hover:bg-gray-800" 
                          : "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30 hover:bg-neon-cyan hover:text-black"
                        }`}
                      >
                        {isSending ? (
                          <>
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-3 h-3 border-2 border-current border-t-transparent rounded-full"
                            />
                            TRANSMITTING...
                          </>
                        ) : "Transmit_Message"}
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

                <div className="flex gap-2 mt-6">
                  <span className={isArch ? "text-black font-bold" : "text-neon-cyan"}>{isArch ? "arch@studio:~$ " : "guest@vdc_core:~$"}</span>
                  <span className={`${isArch ? "text-black" : "text-white"} animate-pulse`}>_</span>
                </div>
              </div>
            </div>
            
            <footer className={`mt-12 md:mt-20 pt-8 border-t transition-colors duration-700 ${isArch ? "border-gray-100" : "border-terminal-border"}`}>
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-gray-400 font-mono text-[10px] uppercase tracking-widest">
                <div className="flex flex-col items-center md:items-start gap-2">
                  <div className={isArch ? "text-black font-bold" : "text-white"}>© 2026 {isArch ? "KARTHIKRAJ NADAR ARCHITECTURE" : "VDC_CORE_ENGINEERING"}</div>
                  <div className="text-[8px] opacity-60">ALL RIGHTS RESERVED // MUMBAI, INDIA</div>
                </div>

                <div className="flex items-center gap-6">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={`transition-colors ${isArch ? "hover:text-black" : "hover:text-neon-cyan"}`}>
                    <Github className="w-4 h-4" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={`transition-colors ${isArch ? "hover:text-black" : "hover:text-neon-cyan"}`}>
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href="mailto:karthikraj.v.nadar@gmail.com" className={`transition-colors ${isArch ? "hover:text-black" : "hover:text-neon-cyan"}`}>
                    <Mail className="w-4 h-4" />
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`w-full max-w-5xl border overflow-hidden flex flex-col h-full md:max-h-[90vh] transition-all duration-700 ${
                isArch ? "bg-white border-gray-200" : "bg-terminal-bg border-terminal-border"
              }`}
            >
              {/* Modal Header */}
              <div className={`p-4 md:p-6 border-b flex justify-between items-center transition-all duration-700 ${isArch ? "bg-gray-50 border-gray-100" : "bg-black/50 border-terminal-border"}`}>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={`p-2 rounded border transition-all duration-700 ${
                    isArch ? "bg-white border-gray-200 text-black" : `bg-${selectedArsenalItem.color}/10 border-${selectedArsenalItem.color}/20 text-${selectedArsenalItem.color}`
                  }`}>
                    {selectedArsenalItem.icon}
                  </div>
                  <div>
                    <h4 className={`text-sm md:text-lg font-medium uppercase tracking-tighter transition-colors duration-700 ${isArch ? "text-black font-serif italic" : "text-white font-sans"}`}>
                      {selectedArsenalItem.title}
                    </h4>
                    <div className="text-[8px] md:text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                      {isArch ? "Workflow_Record_v1.0" : "VDC_Workflow_Data"} // {selectedArsenalItem.id}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedArsenalItem(null)}
                  className={`p-2 transition-colors border ${isArch ? "border-gray-200 hover:bg-black hover:text-white" : "brutalist-border hover:bg-white hover:text-black"}`}
                >
                  <Box className="w-4 h-4 md:w-5 md:h-5 rotate-45" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-grow overflow-y-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                  {/* Left: Media & Workflow */}
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <div className={`text-[10px] font-mono uppercase tracking-widest transition-colors duration-700 ${isArch ? "text-gray-400" : "text-neon-cyan"}`}>
                        01_{isArch ? "Visual_Narrative" : "Process_Visualization"}
                      </div>
                      <div className={`aspect-video border relative overflow-hidden transition-all duration-700 ${isArch ? "border-gray-100 bg-gray-50" : "brutalist-border bg-black"}`}>
                        <img 
                          src={selectedArsenalItem.gifUrl} 
                          alt="Workflow GIF"
                          onContextMenu={(e) => e.preventDefault()}
                          onDragStart={(e) => e.preventDefault()}
                          className={`w-full h-full object-cover transition-all duration-700 pointer-events-none select-none ${isArch ? "opacity-100" : "opacity-60"}`}
                          referrerPolicy="no-referrer"
                        />
                        {!isArch && (
                          <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur font-mono text-[8px] text-neon-cyan border border-neon-cyan/20">
                            RAW_FEED_STREAMING...
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedArsenalItem.workflow && (
                      <div className="space-y-4 md:space-y-6">
                        <div className={`text-[10px] font-mono uppercase tracking-widest border-b pb-2 transition-colors duration-700 ${isArch ? "text-black border-gray-100" : "text-white border-terminal-border"}`}>
                          02_{isArch ? "Methodology" : "Execution_Logic"}
                        </div>
                        <div className="space-y-3 md:space-y-4">
                          {selectedArsenalItem.workflow.steps.map((step, i) => (
                            <div key={i} className="flex gap-3 md:gap-4 items-start">
                              <div className={`font-mono text-[10px] md:text-xs pt-0.5 md:pt-1 ${isArch ? "text-black font-semibold" : "text-neon-cyan"}`}>0{i + 1}</div>
                              <div className={`text-xs md:text-sm font-mono leading-relaxed transition-colors duration-700 ${isArch ? "text-gray-500 italic" : "text-gray-400"}`}>
                                {step}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!isArch && selectedArsenalItem.content && (
                      <div className="space-y-4">
                        <div className={`text-[10px] font-mono uppercase tracking-widest border-b pb-2 transition-colors duration-700 ${isArch ? "text-black border-gray-100" : "text-white border-terminal-border"}`}>
                          03_System_Output
                        </div>
                        {selectedArsenalItem.content}
                      </div>
                    )}
                  </div>

                  {/* Right: Detailed Content */}
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <div className={`text-[10px] font-mono uppercase tracking-widest transition-colors duration-700 ${isArch ? "text-black" : "text-neon-cyan"}`}>
                        04_Description
                      </div>
                      <p className={`text-sm leading-relaxed transition-colors duration-700 ${isArch ? "text-gray-500 italic" : "text-gray-400 font-mono"}`}>
                        {selectedArsenalItem.description}
                      </p>
                    </div>

                    {selectedArsenalItem.details && (
                      <>
                        <div className="space-y-4">
                          <div className={`text-[10px] font-mono uppercase tracking-widest transition-colors duration-700 ${isArch ? "text-black" : "text-neon-cyan"}`}>
                            05_Project_Overview
                          </div>
                          <p className={`text-sm leading-relaxed transition-colors duration-700 ${isArch ? "text-gray-500 italic" : "text-gray-400 font-mono"}`}>
                            {selectedArsenalItem.details.overview}
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className={`text-[10px] font-mono uppercase tracking-widest transition-colors duration-700 ${isArch ? "text-black" : "text-neon-orange"}`}>
                            06_The_Challenge
                          </div>
                          <p className={`text-sm leading-relaxed transition-colors duration-700 ${isArch ? "text-gray-500 italic" : "text-gray-400 font-mono"}`}>
                            {selectedArsenalItem.details.challenge}
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className={`text-[10px] font-mono uppercase tracking-widest transition-colors duration-700 ${isArch ? "text-black" : "text-neon-cyan"}`}>
                            07_The_Solution
                          </div>
                          <p className={`text-sm leading-relaxed transition-colors duration-700 ${isArch ? "text-gray-500 italic" : "text-gray-400 font-mono"}`}>
                            {selectedArsenalItem.details.solution}
                          </p>
                        </div>

                        {selectedArsenalItem.details.reportUrl && (
                          <div className="space-y-4 pt-4">
                            <div className={`text-[10px] font-mono uppercase tracking-widest transition-colors duration-700 ${isArch ? "text-black" : "text-neon-cyan"}`}>
                              08_Documentation
                            </div>
                            <div className="flex flex-wrap gap-4">
                              <a 
                                href={selectedArsenalItem.details.reportUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-2 px-4 py-2 border text-[10px] font-mono uppercase tracking-widest transition-all duration-700 ${
                                  isArch 
                                  ? "border-black bg-black text-white hover:bg-white hover:text-black" 
                                  : "brutalist-border bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan hover:text-black"
                                }`}
                              >
                                <FileText className="w-3 h-3" />
                                View Full Report
                              </a>

                              {selectedArsenalItem.details.videoUrl && (
                                <a 
                                  href={selectedArsenalItem.details.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`inline-flex items-center gap-2 px-4 py-2 border text-[10px] font-mono uppercase tracking-widest transition-all duration-700 ${
                                    isArch 
                                    ? "border-black bg-white text-black hover:bg-black hover:text-white" 
                                    : "brutalist-border bg-neon-orange/10 text-neon-orange hover:bg-neon-orange hover:text-black"
                                  }`}
                                >
                                  <Play className="w-3 h-3" />
                                  Watch Full Movie
                                </a>
                              )}
                            </div>
                          </div>
                        )}

                        {selectedArsenalItem.details.images && selectedArsenalItem.details.images.length > 0 && (
                          <div className="space-y-4 pt-4">
                            <div className={`text-[10px] font-mono uppercase tracking-widest transition-colors duration-700 ${isArch ? "text-black" : "text-neon-cyan"}`}>
                              09_{isArch ? "Technical_Gallery" : "System_Drawings"}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {selectedArsenalItem.details.images.map((img, idx) => (
                                <div key={idx} className={`aspect-video border relative overflow-hidden transition-all duration-700 ${isArch ? "border-gray-100 bg-gray-50" : "brutalist-border bg-black"}`}>
                                  <img 
                                    src={img} 
                                    alt={`Gallery ${idx}`}
                                    onContextMenu={(e) => e.preventDefault()}
                                    onDragStart={(e) => e.preventDefault()}
                                    className={`w-full h-full object-cover transition-all duration-700 pointer-events-none select-none ${isArch ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    <div className={`p-6 border space-y-4 transition-all duration-700 ${isArch ? "border-gray-100 bg-gray-50" : "brutalist-border bg-terminal-border/10"}`}>
                      <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{isArch ? "Impact_Metric" : "Performance_Metric"}</div>
                      <div className="flex justify-between items-end">
                        <div className={`text-xl md:text-2xl font-medium tracking-tighter transition-colors duration-700 ${isArch ? "text-black font-serif italic" : "text-white font-sans"}`}>
                          {selectedArsenalItem.metric}
                        </div>
                        <Activity className={`w-6 h-6 transition-colors duration-700 ${isArch ? "text-black" : "text-neon-cyan animate-pulse"}`} />
                      </div>
                      <div className={`h-1 w-full rounded-full overflow-hidden transition-colors duration-700 ${isArch ? "bg-gray-200" : "bg-terminal-border"}`}>
                        <div className={`h-full w-[92%] transition-colors duration-700 ${isArch ? "bg-black" : "bg-neon-cyan"}`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`p-4 border-t flex justify-between items-center font-mono text-[10px] text-gray-600 transition-all duration-700 ${isArch ? "bg-gray-50 border-gray-100" : "bg-black/30 border-terminal-border"}`}>
                <div>{isArch ? "ARCH_REF: " : "VDC_REF: "}{selectedArsenalItem.id}</div>
                <div className="flex gap-4">
                  <span className={isArch ? "text-black" : "text-neon-cyan"}>{isArch ? "DOCUMENTATION_COMPLETE" : "DATA_INTEGRITY_VERIFIED"}</span>
                  <span>STATUS: READY</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
