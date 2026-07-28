import re

with open("src/App.tsx", "r") as f:
    content = f.read()

old_block = """    {
      id: "BIM_05",
      title: "The MEP Component Automator",
      domain: "BIM PRODUCTION // REVIT API & PYTHON",
      intel: "Automated local routing script using clearance vector testing to dynamically place pipes and air vents around structural limits.",
      icon: <Cpu className="w-6 h-6 text-neon-orange" />,
      color: "neon-orange",
      metric: "Automation",
      gifUrl: "https://lh3.googleusercontent.com/d/1dR5ajQdvGdR3YJOvScsAu_uteRfCiuVt",
      tags: ["Vectorworks", "Marionette", "BIM Model"],
      ledger: {
        inputs: "Building walls and shapes, equipment Catalog database",
        engine: "Automatic alignment algorithms",
        outputs: "Positioned equipment models, synchronized size labels"
      },
      workflow: {
        screenshotUrl: "https://picsum.photos/seed/workflow-5/800/450?grayscale",
        steps: [
          "Enter plumbing sizes and required safety clearances.",
          "Run the automated routing algorithms.",
          "Check and synchronize size labels across the entire file.",
          "Export completed layout lists and verify with engineers."
        ]
      },
      details: {
        overview: "An automated MEP routing script that computationally paths water pipes, HVAC duct systems, and electrical channels directly into designated building cavities. Utilizing predefined size clearances and distancing rules, the script programmatically aligns and connects components, ensuring an optimized, collision-free internal utility network.",
        challenge: "Manually sizing and routing thousands of small items takes days and inevitably creates physical overlaps.",
        solution: "Wrote automatic alignment routines which place and size every connection instantly while running immediate clearance reports.",
        videoUrl: "https://drive.google.com/file/d/10JAIqWYDsFVJFuBhUsFo730E31IfPLFe/view?usp=sharing"
      }
    },"""

new_block = """    {
      id: "BIM_05",
      title: "The MEP Component Automator",
      domain: "BIM PRODUCTION // VECTORWORKS MARIONETTE",
      intel: "An automated Vectorworks Marionette script designed to instantly locate space boundaries and place a designated BIM component at the exact centroid of every room across the model.",
      icon: <Cpu className="w-6 h-6 text-neon-orange" />,
      color: "neon-orange",
      metric: "Automation",
      gifUrl: "https://lh3.googleusercontent.com/d/1dR5ajQdvGdR3YJOvScsAu_uteRfCiuVt",
      tags: ["Vectorworks", "Marionette", "BIM Model"],
      ledger: {
        inputs: "Building walls and shapes, equipment Catalog database",
        engine: "Automatic alignment algorithms",
        outputs: "Positioned equipment models, synchronized size labels"
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
    },"""

if old_block in content:
    content = content.replace(old_block, new_block)
    print("Replaced successfully.")
else:
    print("Block not found!")

with open("src/App.tsx", "w") as f:
    f.write(content)
