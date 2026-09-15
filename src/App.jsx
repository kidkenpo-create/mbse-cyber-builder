import React, { useState, useEffect } from "react";

// ─── COURSE DATA — grounded in actual CYB-5620V content ──────────────────────
const MODULES = {
  m2: {
    label: "M2: ICS Threats",
    fullLabel: "Module 2 — ICS Threats & Adversaries",
    color: "#ff4444",
    day: "Day 1",
    focus: "Threat Tiers, APTs, ICS attack history, co-evolving threats, DOT&E findings",
    scenarios: [
      { value: "fancy_bear_ics",    label: "Fancy Bear (APT28/XAgent) ICS Campaign" },
      { value: "colonial_pipeline", label: "Colonial Pipeline Ransomware-Style Attack" },
      { value: "stuxnet",           label: "Stuxnet-Style PLC Physical Damage Attack" },
      { value: "blackenergy",       label: "BlackEnergy2/3 Critical Infrastructure" },
      { value: "triton_sis",        label: "TRITON/TRISIS Safety System Attack" },
      { value: "industroyer2",      label: "Industroyer2 Grid Circuit Breaker Attack" },
      { value: "supply_chain",      label: "ICS Supply Chain Compromise" },
    ],
    systems: [
      { value: "ics_scada",    label: "ICS/SCADA Control System" },
      { value: "plc_modbus",   label: "PLC / Modbus Protocol Network" },
      { value: "can_bus",      label: "CAN Bus OT Network" },
      { value: "safety_sis",   label: "Safety Instrumented System (SIS/SIS)" },
      { value: "grid_ot",      label: "Electric Grid OT System" },
      { value: "ot_it_boundary", label: "OT/IT Network Boundary" },
    ],
    actors: [
      { value: "fancy_bear",   label: "Fancy Bear / APT28 (XAgent, X-Tunnel, WinIDS)" },
      { value: "cozy_bear",    label: "Cozy Bear / APT29 (Russian SVR)" },
      { value: "sandworm",     label: "Sandworm Team (Industroyer/BlackEnergy)" },
      { value: "prc_apt",      label: "PRC Nation-State APT (pre-positioning)" },
      { value: "criminal_rw",  label: "Criminal Ransomware Group" },
    ],
    acq: "far",
    role: "gov_sca",
    context: "DOT&E FY21: 400+ cybersecurity assessments, DoD lags adversary capabilities. Threat tiers: co-evolving, zero-day APT capabilities. Fancy Bear (APT28/Sofacy): operating since 2008, XAgent implant, X-Tunnel/WinIDS/Foozer/DownRange tools, phishing + credential harvesting, targets aerospace/defense/energy/gov. Key CVEs: CVE-2017-5753 Spectre, CVE-2017-5754 Meltdown, ICS-ALERT-17-209-01 CAN Bus bus-off mode, CVE-2022-45788 Modbus PLC bypass. ICS attacks: Stuxnet (2010 centrifuges), BlackEnergy2/3 (2014-15 power grid), Industroyer/Crashoverride (2016 grid), TRITON (2017 SIS), Industroyer2 (2022). OT requires different people/processes/technology than IT. ODNI 2024 Threat Assessment: China most active/persistent, Russia maintains ICS targeting capability.",
    elos: "TLO-1 ELO.3 (appraise attack methods), ELO.4 (appraise threat data), ELO.5 (define protection constraints)",
  },

  m3: {
    label: "M3: SCRE Policy",
    fullLabel: "Module 3 — SCRE Policy & Acquisition",
    color: "#a78bfa",
    day: "Day 1",
    focus: "DoD acquisition policy, DoDI landscape, CS KPP, CSAs, PPP, CRRM in acquisition lifecycle",
    scenarios: [
      { value: "dodi_gap",       label: "DoDI 5000.90 Cybersecurity Gap Exploitation" },
      { value: "cs_kpp",         label: "Cyber Survivability KPP Requirement Failure" },
      { value: "cpi_exfil",      label: "Critical Program Information (CPI) Exfiltration" },
      { value: "tsn_compromise", label: "Trusted Systems & Networks (TSN) Compromise" },
      { value: "rmf_gap",        label: "RMF ATO Gap Exploitation" },
      { value: "ppp_bypass",     label: "Program Protection Plan (PPP) Bypass" },
      { value: "sep_noncompliance", label: "SEP SSE Section 3.2.11 Non-Compliance Scenario" },
    ],
    systems: [
      { value: "mta_program",    label: "Middle Tier Acquisition Program (5000.80)" },
      { value: "mda_program",    label: "Major Defense Acquisition Program (5000.85)" },
      { value: "sw_pathway",     label: "Software Acquisition Pathway (5000.87)" },
      { value: "generic_dod",    label: "Generic DoD Acquisition Program" },
      { value: "ppp_system",     label: "Program with PPP / TSN / CPI Requirements" },
    ],
    actors: [
      { value: "nation_cpi",     label: "Nation-State (CPI/IP Theft)" },
      { value: "insider_contr",  label: "Malicious Contractor Insider" },
      { value: "supply_chain_a", label: "Hardware Supply Chain Actor" },
      { value: "fancy_bear_acq", label: "Fancy Bear (Acquisition System Targeting)" },
    ],
    acq: "mda",
    role: "gov_pm",
    context: "DoDI policy landscape: 5000.02 (PM cybersecurity responsibility), 5000.80 MTA, 5000.81 Urgent, 5000.82 IT, 5000.83 Tech/Program Protection (PPP), 5000.85 MDA, 5000.87 Software, 5000.90 Cybersecurity, 5200.39 CPI/AT, 5200.44 TSN, DoDD 5200.47E, JCIDS CS KPP, CJCI 5123.01H, CSE Guide v3. SCRE standardization: NIST 800-160 v2 Rev.1 (anticipate/withstand/recover/adapt). Cyberspace Security → Cyberspace Resilience → Operational Resilience → Cyberspace Survivability (lifecycle risk posture). Cyber Survivability Attributes (CSAs). SEP SSE Section 3.2.11: PPP, SW/HW assurance, mapping design considerations into contracts. CRRM iterated at various V-model stages.",
    elos: "TLO-1 ELO.5 (protection constraints), ELO.6 (V&V objectives), TLO-2 ELO.5 (record/report data)",
  },

  m4: {
    label: "M4: SCRE Approaches",
    fullLabel: "Module 4 — SCRE Approaches & Building Blocks",
    color: "#34d399",
    day: "Day 1",
    focus: "SCRE building blocks: STPA-Sec, CRRM, FOREST, Sentinel, MITRE Resilience, design patterns",
    scenarios: [
      { value: "stpa_adversity",   label: "STPA-Sec Adversity Chain (Injection/Spoofing)" },
      { value: "crrm_full",        label: "Full CRRM Methodology Application" },
      { value: "forest_sentinel",  label: "FOREST Sentinel Pattern (sense/isolate/execute)" },
      { value: "circuit_breaker",  label: "Circuit Breaker Resilience Pattern" },
      { value: "attack_cm_tree",   label: "Attack Countermeasure Tree Analysis" },
      { value: "design_patterns",  label: "SCRE Design Patterns (Segmentation/Privilege)" },
      { value: "mitre_resilience", label: "MITRE Resilience Framework Application" },
    ],
    systems: [
      { value: "mission_sys",    label: "Generic Mission System (SCRE framework)" },
      { value: "weapon_sys",     label: "Weapon System (DoD OT)" },
      { value: "csa_system",     label: "System with CSA Requirements" },
      { value: "sos_system",     label: "System of Systems Architecture" },
    ],
    actors: [
      { value: "apt_inject",     label: "APT — Injection Attack" },
      { value: "apt_spoof",      label: "APT — Spoofing Attack" },
      { value: "apt_dos",        label: "APT — Denial of Service" },
      { value: "apt_tamper",     label: "APT — Tampering / Intercepting" },
      { value: "apt_disclose",   label: "APT — Disclosing / Exfiltration" },
    ],
    acq: "mta_rapid",
    role: "gov_lse",
    context: "SCRE building blocks: (1) Loss-Based Engineering — STPA-Sec (systems fail via injection/spoofing/DoS/tampering/intercepting/disclosing). (2) Mission-Focused Awareness — Mission-Aware Sentinel. (3) Resiliency in Acq Lifecycle — CSAs and Resilient Modes, FOREST. (4) Resiliency Objectives/Techniques — MITRE Resilience Framework. (5) Cyber/Resiliency Responsibilities — CRRM Methodology. CRRM Process: STPA-Sec + Security + Resiliency. Design patterns: Distributed Privileges, Data Input Validation, Single Access Point, Segmentation, Privilege Reduction. Circuit Breaker pattern (Netflix Hystrix model). Attack Countermeasure Tree. ATT&CK to drive adversity. Redundancy technique (Firesmith). Adversity-driven engineering mindset: model adversary TTPs, hierarchical control model.",
    elos: "TLO-1 ELO.1-6 (full), TLO-2 ELO.1-5 (full adversity-driven data)",
  },

  m5: {
    label: "M5: Pipeline ICS",
    fullLabel: "Module 5 — ICS Systems: Pipeline Case Study",
    color: "#fbbf24",
    day: "Day 1",
    focus: "Pipeline SCADA case study, Fancy Bear attack, MBSE control structure, kill chain vs adversity chain, FOREST resilience",
    scenarios: [
      { value: "fancy_bear_pipeline",  label: "Fancy Bear Attack on Pipeline SCADA" },
      { value: "rtu_compromise",       label: "RTU Remote Terminal Unit Compromise" },
      { value: "hmi_manipulation",     label: "Main Control Room HMI Manipulation" },
      { value: "leak_detect_suppress", label: "Leak Detection System Suppression" },
      { value: "modbus_exploit",       label: "Modbus CVE-2022-45788 PLC Exploitation" },
      { value: "compressor_attack",    label: "Compressor/Pump Station Disruption" },
      { value: "sentinel_scenario",    label: "Sentinel Scenario — Pipeline Resilience" },
    ],
    systems: [
      { value: "pipeline_scada",  label: "Interstate Pipeline SCADA (Main Control Room)" },
      { value: "pipeline_rtu",    label: "Remote Terminal Unit (RTU) Network" },
      { value: "pipeline_hmi",    label: "Operator HMI / Field Interface" },
      { value: "pipeline_adv",    label: "Advanced Pipeline Apps (Leak Detection/Pig Tracking)" },
      { value: "pipeline_field",  label: "Field Instrumentation (Flow/Pressure/Temp)" },
    ],
    actors: [
      { value: "fancy_bear_pipe",  label: "Fancy Bear / APT28 (XAgent on SCADA)" },
      { value: "criminal_colonial", label: "Criminal Ransomware (Colonial Pipeline-style)" },
      { value: "nation_ics",       label: "Nation-State ICS Specialist" },
    ],
    acq: "far",
    role: "gov_lse",
    context: "Interstate Oil/Gas Pipeline: fictional system, 1.98M km natural gas, 240k km petroleum (US). Colonial Pipeline attack precedent. Fancy Bear: XAgent implant on SCADA systems. Architecture: Field instruments (flow/pressure/temp) → RTUs (satellite/microwave/cellular) → Main Control Room SCADA/HMI → Advanced Pipeline Applications (leak detection, batch tracking, pig tracking, predictive modeling). Operator sends commands: open/close valves, start/stop compressors, change setpoints. CVE-2022-45788 Modbus PLC RCE bypass. STPA Control Structure for pipeline. Breaking the chain: Kill Chain (Assurance Cases, threat/vuln-driven) vs Adversity Chain (Resilience Mechanisms, hierarchical control model). FOREST: sense/isolate/options/evaluation/confidence/readiness/execution. Sentinel scenarios. Loss Scenario Assessment. Reduce LS likelihood (assurance case) and consequence (sentinel).",
    elos: "TLO-1 ELO.1-6, TLO-2 ELO.1-5, CRRM pipeline application",
  },

  m6: {
    label: "M6: Silverfish UGV",
    fullLabel: "Module 6 — Silverfish UGV Part 1 (Hazard Analysis & Assurance Cases)",
    color: "#00d4ff",
    day: "Day 2",
    focus: "STPA-Sec deep dive: losses, hazards, HCAs, loss scenarios, assurance cases — Silverfish Area Denial system",
    scenarios: [
      { value: "sf_full_attack",    label: "Silverfish AD — Full Area Denial Attack Chain" },
      { value: "sf_c2_compromise",  label: "Silverfish AD — C2 Link Compromise" },
      { value: "sf_sensor_spoof",   label: "Silverfish AD — Sensor Spoofing / False Classification" },
      { value: "sf_insider",        label: "Silverfish AD — Malicious Maintenance Technician" },
      { value: "sf_gps_spoof",      label: "Silverfish AD — GPS Spoofing / Out-of-Zone Engagement" },
      { value: "sf_hazard_analysis", label: "CRRM Hazard Analysis (STPA-Sec Losses/Hazards)" },
      { value: "sf_loss_scenario",  label: "CRRM Loss Scenario Assessment" },
      { value: "sf_assurance_case", label: "Assurance Case Development (Claim→Evidence→SHALL)" },
    ],
    systems: [
      { value: "sf_ugv",     label: "Silverfish UGV — Area Denial Platform (single operator)" },
      { value: "sf_c2",      label: "Silverfish C2 — Operator Control Station" },
      { value: "sf_sensor",  label: "Silverfish Sensor Suite (PERSONNEL/VEHICLE classification)" },
      { value: "sf_comms",   label: "Silverfish RF C2 Communications Link" },
    ],
    actors: [
      { value: "nation_sf",     label: "Nation-State APT (Silverfish Adversary)" },
      { value: "insider_maint", label: "Malicious Maintenance Technician" },
      { value: "criminal_sf",   label: "Organized Criminal Group" },
    ],
    acq: "mta_rapid",
    role: "gov_lse",
    context: "Silverfish Area Denial UGV: rapidly deployable ground-based UGV weapons platforms. Single operator. Mission: deter/prevent adversaries from trespassing designated geographic area near strategically sensitive site. Sensors classify trespassers as PERSONNEL or VEHICLES. CRRM process: Hazard Analysis → Loss Scenario Assessment → Assurance Cases. STPA-Sec: Losses (L-1 mission/safety/availability/integrity/confidentiality), Hazards (H-1 system states violating constraints), Control Structure (Operator→C2→UGV→Physical Domain, with feedback), Hazardous Control Actions for ENGAGE and HALT (4 types: provided when shouldn't, not provided when should, wrong timing, wrong duration), Loss Scenarios (adversary action→HCA→hazard→loss). Assurance Case structure: Claim→Evidence→Argument→SHALL requirement with NIST 800-53 controls. Use Cases: Deploy UGV, Protect Field, Control Structure analysis. MTA acquisition, SOW/SRD requirements.",
    elos: "ELO.14.A (STPA hazard analysis), ELO.14.B (control structure), ELO.14.D (threat data), ELO.14.E (acquisition), ELO.15.A (mission requirements), ELO.15.E (assurance cases)",
  },

  m7: {
    label: "M7: Silverfish SDAD",
    fullLabel: "Module 7 — Silverfish UGV Part 2 (SDAD: Sentinel & Resilience)",
    color: "#f472b6",
    day: "Day 2",
    focus: "SDAD mission: Sentinel scenarios, FOREST resilience architecture, resilience requirements, resilient modes of operation",
    scenarios: [
      { value: "sdad_loss_scenario",  label: "SDAD CRRM Loss Scenario Assessment" },
      { value: "sdad_sentinel",       label: "SDAD Sentinel Scenario Detection (behavior-sentinel)" },
      { value: "sdad_resilience_arch", label: "SDAD CRRM Resilience Architecture" },
      { value: "sdad_resilience_req",  label: "SDAD CRRM Resilience Requirements (FOREST/CSA)" },
      { value: "sdad_hazard_enhanced", label: "SDAD Enhanced Mission Hazard Analysis" },
      { value: "sdad_control_flow",    label: "SDAD Control Flow with Sentinel Flows" },
      { value: "sdad_resilient_mode",  label: "SDAD Resilient Modes of Operation" },
    ],
    systems: [
      { value: "sdad_platform",    label: "Silverfish SDAD — Safe Deployment Area Denial" },
      { value: "sdad_control",     label: "SDAD Control Structure (Enhanced Mission)" },
      { value: "sdad_sentinel_sys", label: "SDAD Sentinel Detection / Profile System" },
      { value: "sdad_resilient",   label: "SDAD Resilient Architecture (Protected UGV Clear/Deploy/Fire)" },
    ],
    actors: [
      { value: "nation_sdad",    label: "Nation-State APT (SDAD Adversary)" },
      { value: "multi_vector",   label: "Multi-Vector Attack (GPS+C2+Sensor simultaneous)" },
      { value: "insider_sdad",   label: "Insider Threat (SDAD)" },
    ],
    acq: "mta_rapid",
    role: "gov_lse",
    context: "Silverfish SDAD (Safe Deployment Area Denial): extended mission from Module 6. 4 CRRM models: Mission/System Overview, CRRM Loss Scenario Assessment, CRRM Resilience Architecture, CRRM Resilience Requirements. SDAD Use Cases: Deploy to Field, Perform Safe Deployment Area Denial Mission. SDAD Control Structure with Control Actions. SDAD Hazard Analysis and Hazardous Actions. SDAD Loss Scenario Assessment. Adversity Chain: SCRE overview. Assurance Cases. Sentinel Profile: behavior-sentinel scenario, control-structure-loss-scenario diagram. FOREST resilience: sense/isolate/options/evaluation/confidence/readiness/execution — Reduce LS consequence. Resilience Architecture: Resilience Profile, Protected UGV Clear, Protected A2 Deploy/Fire/RR. Resilient Control Structure. Resilience Requirements linked to CSAs. Eliciting Assurance Case-based AND Resilience-based requirements.",
    elos: "ELO.14.A–ELO.15.E full module, Sentinel scenarios, FOREST, Resilient Modes, Resilience Requirements",
  },

  m8: {
    label: "M8: Guardian UAV",
    fullLabel: "Module 8 — Guardian UAV (GAVIN): Full CRRM + Contracting",
    color: "#fb923c",
    day: "Day 2",
    focus: "GAVIN UAV: OPFOR CTT exercise, criticality analysis, derived requirements, SCRE design patterns, CSA/RMF traceability, SOW/SRD contracting",
    scenarios: [
      { value: "gavin_laser_attack",   label: "GAVIN Laser Designator Compromise (Interoperability Mission)" },
      { value: "gavin_seek_destroy",   label: "GAVIN Seek & Destroy Mission Disruption" },
      { value: "gavin_ugv_comms",      label: "GAVIN-to-UGV Communication Intercept (5-10 sec dwell)" },
      { value: "gavin_ctt_opfor",      label: "GAVIN CTT — OPFOR Team Exercise (Assignment 1)" },
      { value: "gavin_criticality",    label: "GAVIN Criticality Assessment (2 missions, 3 critical functions)" },
      { value: "gavin_design_pattern", label: "GAVIN SCRE Design Pattern Application (Assignment 5)" },
      { value: "gavin_req_matrix",     label: "GAVIN Derived Requirements / SOW/SRD/CDRL (Assignment 4)" },
      { value: "gavin_rmf_csa",        label: "GAVIN RMF & CSA Traceability (Assignments 4b/4c)" },
    ],
    systems: [
      { value: "gavin_uav",     label: "GAVIN UAV — Guardian Aerial Vehicle (Army/USMC ACAT II)" },
      { value: "gavin_laser",   label: "GAVIN Laser Designator System" },
      { value: "gavin_weapons", label: "GAVIN Onboard Weapon Systems (Seek & Destroy)" },
      { value: "gavin_comms",   label: "GAVIN Air-Ground Link (UAV-to-UGV)" },
      { value: "gavin_csa",     label: "GAVIN Cyber Survivability Attributes (CSA Level 2)" },
    ],
    actors: [
      { value: "opfor_gavin",      label: "OPFOR / Red Team (CTT Adversary)" },
      { value: "nation_ew",        label: "Nation-State with Electronic Warfare (EW)" },
      { value: "enemy_armored",    label: "Enemy Armored Vehicle (detect/attack GAVIN)" },
      { value: "supply_gavin",     label: "Supply Chain / Insider Threat (GAVIN)" },
    ],
    acq: "mta_rapid",
    role: "opfor",
    context: "GAVIN (Guardian Aerial Vehicle Interoperability Node): Army/USMC joint program. MTA ACAT II, PEO Ground Combat Systems Detroit Arsenal / PEO LS Marine Corps Quantico. Army 2,000 / USMC 500 units, IOC 3 years, Rapid Prototyping→Rapid Fielding. Missions: (1) Interoperability — laser designator on enemy armored vehicle 5-10 sec dwell, UGV conducts attack; (2) Seek and Destroy — onboard weapons only, enemy detects/attacks GAVIN if in range. CTT OPFOR: Potential Targets, Desired Effects, Goals of Attack, Potential Attack Classes, Context. Control Structure and Sequence diagrams are the adversary playing field. Assignment 2: Mitigations via Resiliency Techniques / Assurance Cases / Accept Risk. Contracting: SOW criticality/vuln/risk/countermeasures, RFP Sections L&M SCRE metrics, CDRL. Design patterns: Distributed Privileges, Data Input Validation, Segmentation, Single Access Point, Privilege Reduction (SysML Activity Diagrams). NIST 800-160V2R1 14 techniques + Sentinel. CSA Level 2 table traceability to SCRE. RMF controls traceability to SCRE. Criticality Analysis: 2 missions, 3 critical functions, limited budget/time.",
    elos: "ELO.14.A–ELO.15.E full, CTT OPFOR, Criticality Analysis, SCRE Design Patterns, CSA/RMF traceability, SOW/SRD/CDRL contracting requirements",
  },
};

const ACQ_PATHWAYS = [
  { value: "mta_rapid",    label: "MTA — Rapid Fielding (5000.80)" },
  { value: "mta_proto",    label: "MTA — Rapid Prototyping (5000.80)" },
  { value: "mda",          label: "Major Defense Acquisition (5000.85)" },
  { value: "sw_pathway",   label: "Software Acquisition (5000.87)" },
  { value: "urgent",       label: "Urgent Capability Acquisition (5000.81)" },
  { value: "defense_biz",  label: "Defense Business Systems (5000.75)" },
  { value: "far",          label: "FAR-Based Contract" },
];

const ROLES = [
  { value: "gov_lse",       label: "Government — Lead Systems Engineer" },
  { value: "gov_pm",        label: "Government — Program Manager" },
  { value: "gov_sca",       label: "Government — Security Control Assessor" },
  { value: "gov_ppo",       label: "Government — Program Protection Officer" },
  { value: "contractor_se", label: "Contractor — Systems Engineer" },
  { value: "contractor_dev", label: "Contractor — Developer / Integrator" },
  { value: "contractor_ivv", label: "Contractor — IV&V / Test" },
  { value: "opfor",         label: "OPFOR — Red Team / CTT Adversary Role" },
];

const SOPH = { 1: "Tier 1 — Opportunistic (script kiddie)", 2: "Tier 2 — Organized Criminal", 3: "Tier 3 — Sophisticated Criminal / Hacktivist", 4: "Tier 4 — APT (Fancy Bear level)", 5: "Tier 5 — Nation-State (co-evolving, zero-day capable)" };
const TABS = ["Narrative", "STPA-Sec", "Assurance Cases", "Diagrams", "MITRE Matrix", "Requirements", "Courses of Action", "Raw"];

function extractSection(txt, header) {
  // Robust match: handles numbered prefixes (===7. HEADER===),
  // bold markers (===**HEADER**===), abbreviations (===HEADER (COA)===),
  // colons (===HEADER:===), and extra spaces.
  const pattern = "===\\s*\\*{0,2}\\s*(?:\\d+[\\.)\\s]+)?\\s*" + header + "[^=]*\\*{0,2}\\s*===([\\s\\S]*?)(?====|$)";
  const m = txt.match(new RegExp(pattern, "i"));
  return m ? m[1].trim() : null;
}
function cleanMermaid(code) {
  if (!code) return "";

  // 1. Strip markdown fences
  code = code.replace(/^```[\w]*\n?/gm, "").replace(/^```$/gm, "").trim();
  if (!code || code === "SKIP") return "";

  const isSeq = code.trimStart().startsWith("sequenceDiagram");

  // 2. Line-by-line sanitization
  const cleaned = code.split("\n").map(line => {
    const t = line.trim();

    // Remove --- separator lines (AI adds these as dividers — invalid in Mermaid)
    if (/^-{2,}$/.test(t)) return null;

    // Remove lines that are pure prose/comments injected by the AI
    // e.g. "// Step 1: Recon" or "# Attack phase" or "Note: this shows..."
    if (/^\/\//.test(t)) return null;
    if (/^#(?!mermaid)/.test(t)) return null;

    if (isSeq) {
      // Sequence diagram rules:
      // Strip trailing --- from message labels  e.g.  A->>B: label---
      line = line.replace(/---+\s*$/, "");
      // Fix broken arrows: must be ->>, -->>, ->  not  ->-  or  --  alone
      // Remove lines that have no valid seq syntax
      if (t && !t.startsWith("sequenceDiagram") && !t.startsWith("participant")
          && !t.startsWith("Note") && !t.startsWith("note")
          && !t.startsWith("loop") && !t.startsWith("end")
          && !t.startsWith("alt") && !t.startsWith("opt")
          && !t.startsWith("rect") && !t.startsWith("activate")
          && !t.startsWith("deactivate") && !t.startsWith("autonumber")
          && !t.startsWith("title") && !t.startsWith("break")
          && !/^[\w]+\s*(?:->>|-->>|->|-->)\s*[\w]/.test(t)
          && t.length > 0) {
        return null;  // drop unrecognised prose lines
      }
    } else {
      // Flowchart rules:
      // Strip trailing --- from node labels or arrow labels
      line = line.replace(/---+\s*$/, "");
      // Remove lines that look like prose (no -->, subgraph, end, or node syntax)
      if (t && !t.startsWith("flowchart") && !t.startsWith("graph")
          && !t.startsWith("subgraph") && !t.startsWith("end")
          && !t.startsWith("style") && !t.startsWith("classDef")
          && !/-->|---/.test(t)
          && !/^[\w]+[\[\(\{<]/.test(t)
          && t.length > 0) {
        return null;
      }
    }

    return line;
  }).filter(line => line !== null);

  // 3. Truncation guard — remove incomplete last line
  while (cleaned.length > 1) {
    const last = cleaned[cleaned.length - 1].trim();
    if (last === "" || last === "end") break;
    if (isSeq && /^[\w]+\s*(?:->>|-->>)\s*[\w][\w]*\s*:/.test(last)) break;
    if (!isSeq && (/-->/.test(last) || /^[\w]+[\[\(\{]/.test(last) || last === "end")) break;
    // Line looks complete if it ends with a closing bracket or quoted text
    if (/[\]\)\}"'\w]$/.test(last) && last.length > 3) break;
    cleaned.pop();
  }

  return cleaned.join("\n").trim();
}

// ── Mermaid renderer ──────────────────────────────────────────────────────────
function MermaidDiagram({ code, title }) {
  const [svg, setSvg] = useState("");
  const [err, setErr] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!code || !window.mermaid) return;
    setSvg(""); setErr(""); setReady(false);
    const id = "mmd" + Math.random().toString(36).slice(2);
    window.mermaid.render(id, code)
      .then(({ svg: s }) => { setSvg(s); setReady(true); })
      .catch(e => setErr(e.message || "Render error — check Mermaid syntax"));
  }, [code]);

  const save = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    a.download = (title || "diagram").replace(/\s+/g, "_") + ".svg";
    a.click();
  };

  return (
    <div style={{ border: "1px solid #0f3a5c", borderRadius: 4, marginBottom: 14, overflow: "hidden" }}>
      <div style={{ padding: "7px 12px", borderBottom: "1px solid #0f3a5c", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,212,255,0.03)" }}>
        <span style={{ fontFamily: "'Orbitron',monospace", fontSize: 10, color: "#ff6b35", letterSpacing: 2 }}>▸ {title}</span>
        {ready && <button onClick={save} style={{ background: "transparent", border: "1px solid #39ff14", color: "#39ff14", fontFamily: "'Share Tech Mono',monospace", fontSize: 10, padding: "2px 9px", cursor: "pointer", borderRadius: 2 }}>↓ SVG</button>}
      </div>
      {err && <div style={{ padding: 12, fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: "#ff4444", background: "rgba(255,0,0,0.05)" }}>⚠ {err}</div>}
      {ready && (
        <div style={{ padding: 12, background: "#fff" }}>
          <div style={{ fontFamily: "monospace", fontSize: 9, color: "#999", marginBottom: 5, textAlign: "right" }}>Right-click → Copy Image → paste into PowerPoint / Word&nbsp;·&nbsp;SVG button → open in Chrome → Print → PDF</div>
          <div dangerouslySetInnerHTML={{ __html: svg }} style={{ maxWidth: "100%", overflowX: "auto" }} />
        </div>
      )}
      {!ready && !err && <div style={{ padding: 12, fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: "#4a7a99" }}>⬡ Rendering...</div>}
    </div>
  );
}

function useMermaid() {
  const [ready, setReady] = useState(!!window.mermaid);
  useEffect(() => {
    if (window.mermaid) { setReady(true); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.6.1/mermaid.min.js";
    s.onload = () => { window.mermaid.initialize({ startOnLoad: false, theme: "default", securityLevel: "loose" }); setReady(true); };
    document.head.appendChild(s);
  }, []);
  return ready;
}

// ── Prompt builder — uses actual module context ───────────────────────────────
function buildPrompt(mk, scen, sys, actor, soph, acq, role, extra, checks) {
  const mod = MODULES[mk];
  const arts = [
    checks.usecase   && "Use Case Diagram in Mermaid flowchart syntax",
    checks.sequence  && "Attack Sequence Diagram in Mermaid sequenceDiagram syntax",
    checks.bdd       && "SysML Block Definition Diagram as ASCII art",
    checks.mitre     && "MITRE ATT&CK ICS + Enterprise technique mapping",
    checks.req       && "Formal security requirements (SHALL statements)",
    checks.coa       && "Defensive Courses of Action",
    checks.stpa      && "STPA-Sec Control Structure Analysis",
    checks.assurance && "CRRM Assurance Cases (Claim → Evidence → Argument → SHALL)",

  ].filter(Boolean);

  const ucRule = "Generate ONLY Mermaid (NOT PlantUML). Start: flowchart TD. Actors: rect node e.g. Op[Operator]. Use cases: round e.g. UC1(Monitor Area). Attacks: diamond e.g. ATK1{Inject Cmd}. Defenses: stadium e.g. DEF1([Detect Anomaly]). Arrows: --> only, labels use |text| syntax. Groups: subgraph Title ... end. Labels max 3 words. KEEP COMPACT — max 8 nodes per subgraph, max 3 subgraphs. ALWAYS end the diagram completely — never leave an arrow or node unfinished. NO @startuml NO skinparam.";
  const seqRule = "Generate ONLY valid Mermaid sequenceDiagram syntax. STRICT RULES: (1) First line must be exactly: sequenceDiagram (2) Declare participants: participant X as Name — MAX 5 participants (3) Messages ONLY use: X->>Y: label or X-->>Y: label — NO other arrow formats (4) Notes: Note over X: text (5) MAX 15 message lines (6) BANNED: --- separators, // comments, # headings, prose lines, @startuml, activation boxes (+/-), any line that is not a participant declaration, message, or note (7) Every message line must follow format exactly: ParticipantName->>OtherName: Short label";

  return "You are an expert instructor for CYB-5620V Secure Cyber Resilient Engineering (SCRE) at War-U.\n\n"
    + "CURRENT MODULE: " + mod.fullLabel + "\n"
    + "MODULE FOCUS: " + mod.focus + "\n"
    + "COURSE CONTEXT FROM SLIDES:\n" + mod.context + "\n"
    + "RELEVANT ELOs: " + mod.elos + "\n\n"
    + "SCENARIO PARAMETERS:\n"
    + "- Scenario: " + (scen || mod.scenarios[0].label) + "\n"
    + "- System Under Analysis: " + (sys || mod.systems[0].label) + "\n"
    + "- Threat Actor: " + (actor || mod.actors[0].label) + "\n"
    + "- Threat Tier / Sophistication: " + SOPH[soph] + "\n"
    + "- Acquisition Pathway: " + acq + "\n"
    + "- Analyst Role: " + role + "\n"
    + "- Additional Context: " + (extra || "None") + "\n\n"
    + "ARTIFACTS TO GENERATE:\n" + arts.map(a => "- " + a).join("\n") + "\n\n"
    + "Use EXACTLY these section headers with === on both sides:\n\n"
    + "===SCENARIO NARRATIVE===\n"
    + "2 paragraphs max grounded in " + mod.fullLabel + ". Include: threat actor motivation/TTPs, initial access vector, mission impact. Reference specific CVEs, DoDI citations, and CRRM methodology. BE CONCISE.\n\n"
    + "===USE CASE DIAGRAM===\n" + (checks.usecase ? ucRule : "SKIP") + "\n\n"
    + "===SEQUENCE DIAGRAM===\n" + (checks.sequence ? seqRule : "SKIP") + "\n\n"
    + "===BLOCK DEFINITION DIAGRAM===\n" + (checks.bdd ? "ASCII BDD relevant to " + mod.fullLabel + ". Show Attacker, Target System blocks, Security/Resilience Control blocks with interfaces. Use MBSE BDD notation style." : "SKIP") + "\n\n"
    + "===MITRE ATTACK MAPPING===\n" + (checks.mitre ? "6-10 techniques most relevant to this module and scenario. Prefer ICS matrix for OT scenarios. Format each line exactly: Tactic | TechniqueID | Technique Name | How it applies to this specific scenario" : "SKIP") + "\n\n"
    + "===SECURITY REQUIREMENTS===\n" + (checks.req ? "6-8 SHALL requirements for " + mod.fullLabel + ". Table format: REQ-ID | SHALL statement (max 20 words) | Priority H/M/L | NIST 800-53 | DoDI. BE CONCISE." : "SKIP") + "\n\n"
    + "===COURSES OF ACTION===\n" + (checks.coa ? "5-8 COAs for " + mod.fullLabel + ". Table: Name | Description | Effectiveness | Tradeoffs. Include SCRE techniques (FOREST, Sentinel, design patterns). BE CONCISE." : "SKIP") + "\n\n"
    + "===ASSURANCE CASES===\n" + (checks.assurance ? "TWO assurance cases grounded in " + mod.fullLabel + " CRRM methodology. Each case reduces the likelihood of one Loss Scenario from the STPA-Sec analysis above. For each case use EXACTLY this format:\n\nAC-1: [Short title]\nClaim: The system [specific verifiable claim about security property]\nEvidence:\n  E-1: [Test, inspection, or analysis that provides evidence]\n  E-2: [Second evidence source]\nArgument: Because [E-1] and [E-2] demonstrate [reasoning], the claim is supported.\nSHALL Requirement: [REQ-ID] The system SHALL [specific testable requirement] [NIST 800-53 control] [DoDI reference]\nLoss Scenario Mitigated: [LS-ID from STPA-Sec above]\n\nRepeat for AC-2. Ground each case in actual module CVEs, DoDI citations, and CRRM patterns from " + mod.fullLabel + "." : "SKIP") + "\n\n"
    + "===STPA-SEC ANALYSIS===\n" + (checks.stpa ? "CONCISE STPA-Sec for " + mod.fullLabel + " — BE BRIEF, use tables only, NO ASCII art, NO prose paragraphs:\n1. LOSSES: table of L-1 to L-4 only (ID | Statement | Type)\n2. HAZARDS: table of H-1 to H-4 only (ID | State | Constraint | Links To)\n3. CONTROL STRUCTURE: 3-line text summary only — Controller, Control Actions, Controlled Process. NO diagrams.\n4. HAZARDOUS CONTROL ACTIONS: ONE control action only (ENGAGE). Table of 4 HCA types (Type | Description | Hazard).\n5. LOSS SCENARIOS: TWO scenarios only (LS-1, LS-2). Format: Adversary Action | HCA | Hazard | Loss | MITRE TTPs. Keep each row under 20 words." : "SKIP") + "\n\n"

    + "===DISCUSSION QUESTIONS===\n"
    + "5 discussion questions specifically aligned to " + mod.elos + ". Each question should reference specific content from " + mod.fullLabel + ", require application of CRRM/STPA-Sec methodology, and be suitable for a 30-40 minute class discussion.\n\n"
    + "Be technically precise. Use actual CVE numbers, DoDI references, protocol names, and MBSE terminology from the module context.";
}

// ── CSS — dynamic, accepts darkMode boolean ───────────────────────────────────
function buildCss(dark) {
  // ── token sets ──────────────────────────────────────────────────────────────
  const bg       = dark ? "#040d14"              : "#f0f4f8";
  const bgInner  = dark ? "#070f1a"              : "#ffffff";
  const bgBar    = dark ? "#050e1a"              : "#e2e8f0";
  const bgInput  = dark ? "rgba(0,212,255,0.04)" : "rgba(0,0,0,0.04)";
  const bgMod    = dark ? "rgba(0,0,0,0.2)"      : "rgba(0,0,0,0.04)";
  const border   = dark ? "#0f3a5c"              : "#94a3b8";
  const borderTd = dark ? "rgba(15,58,92,0.5)"   : "rgba(100,130,160,0.4)";
  const txt      = dark ? "#c8dde8"              : "#0f172a";
  const txtMuted = dark ? "#4a7a99"              : "#334155";
  const txtTitle = dark ? "#ffffff"              : "#0f172a";
  const accent   = dark ? "#00d4ff"              : "#0369a1";
  const optBg    = dark ? "#0a1a2a"              : "#ffffff";
  const scrollBg = dark ? "#0f3a5c"              : "#94a3b8";
  const thBg     = dark ? "rgba(0,212,255,0.08)" : "rgba(3,105,161,0.1)";
  const shadow   = dark ? "0 0 18px rgba(0,212,255,0.4)" : "none";
  const ciBg     = dark ? "rgba(255,107,53,0.05)" : "rgba(255,107,53,0.06)";
  const ciBorder = dark ? "rgba(255,107,53,0.28)" : "rgba(255,107,53,0.4)";

  return `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');
  *{box-sizing:border-box;}
  .r{background:${bg};color:${txt};font-family:'Rajdhani',sans-serif;font-size:15px;min-height:100vh;padding:14px;transition:background 0.25s,color 0.25s;}
  .inner{max-width:1360px;margin:0 auto;}
  .hdr{text-align:center;padding:14px 0 10px;border-bottom:1px solid ${border};margin-bottom:0;position:relative;}
  .ey{font-family:'Share Tech Mono',monospace;font-size:10px;color:${accent};letter-spacing:4px;text-transform:uppercase;margin-bottom:4px;}
  .ttl{font-family:'Orbitron',monospace;font-size:clamp(15px,2.6vw,26px);font-weight:900;color:${txtTitle};text-shadow:${shadow};}
  .ttl span{color:${accent};}
  .sub{font-family:'Share Tech Mono',monospace;font-size:10px;color:${txtMuted};letter-spacing:2px;margin-top:4px;}
  .theme-btn{position:absolute;top:14px;right:0;background:transparent;border:1px solid ${border};color:${txtMuted};font-family:'Share Tech Mono',monospace;font-size:11px;padding:4px 10px;cursor:pointer;border-radius:2px;transition:all 0.2s;letter-spacing:1px;}
  .theme-btn:hover{border-color:${accent};color:${accent};}
  .mod-bar{display:flex;flex-wrap:wrap;gap:2px;padding:6px 8px;background:${bgBar};border:1px solid ${border};border-top:none;}
  .mb{background:none;border:1px solid transparent;color:${txtMuted};font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:1px;text-transform:uppercase;padding:5px 8px;cursor:pointer;border-radius:2px;transition:all 0.15s;white-space:nowrap;}
  .mb:hover{color:${txt};}
  .mb.on{border-color:var(--c);color:var(--c);background:rgba(255,255,255,0.03);}
  .grid{display:grid;grid-template-columns:308px 1fr;gap:12px;margin-top:10px;}
  @media(max-width:800px){.grid{grid-template-columns:1fr;}}
  .panel{background:${bgInner};border:1px solid ${border};border-radius:3px;transition:background 0.25s;}
  .ph{padding:8px 12px;border-bottom:1px solid ${border};display:flex;align-items:center;gap:8px;}
  .pt{font-family:'Orbitron',monospace;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;}
  .dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;animation:blink 1.5s ease-in-out infinite;}
  .pb{padding:11px;}
  .lbl{display:block;font-family:'Share Tech Mono',monospace;font-size:9px;color:${accent};letter-spacing:2px;text-transform:uppercase;margin-bottom:3px;margin-top:9px;}
  .lbl:first-child{margin-top:0;}
  select,.ta{width:100%;background:${bgInput};border:1px solid ${border};color:${txt};font-family:'Rajdhani',sans-serif;font-size:13px;padding:5px 8px;border-radius:2px;outline:none;}
  select:focus,.ta:focus{border-color:${accent};}
  .ta{resize:vertical;min-height:52px;font-size:12px;line-height:1.5;}
  input[type=range]{width:100%;accent-color:${accent};}
  .sl{display:flex;justify-content:space-between;font-family:'Share Tech Mono',monospace;font-size:8px;color:${txtMuted};margin-top:2px;}
  .mode-bar{display:flex;align-items:center;justify-content:center;gap:0;margin:8px auto 0;border:1px solid ${border};border-radius:3px;overflow:hidden;width:fit-content;}
  .mode-btn{background:transparent;border:none;color:${txtMuted};font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;padding:6px 16px;cursor:pointer;transition:all 0.2s;white-space:nowrap;}
  .mode-btn.on{background:${accent};color:${dark?"#040d14":"#ffffff"};font-weight:700;}
  .mode-btn:hover:not(.on){color:${txt};}
  .wiz-steps{display:flex;align-items:center;gap:0;margin-bottom:10px;padding:8px 0;}
  .wiz-step{display:flex;align-items:center;gap:5px;font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:1px;color:${txtMuted};text-transform:uppercase;}
  .wiz-step.done{color:${accent};}
  .wiz-step.active{color:${txt};font-weight:700;}
  .wiz-num{width:18px;height:18px;border-radius:50%;border:1px solid currentColor;display:flex;align-items:center;justify-content:center;font-size:9px;flex-shrink:0;}
  .wiz-step.done .wiz-num{background:${accent};border-color:${accent};color:${dark?"#040d14":"#fff"};}
  .wiz-div{width:20px;height:1px;background:${border};margin:0 4px;}
  .mod-cards{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:4px;}
  .mod-card{background:${bgInput};border:1px solid ${border};border-radius:3px;padding:8px 10px;cursor:pointer;transition:all 0.15s;text-align:left;width:100%;}
  .mod-card:hover{border-color:var(--c);}
  .mod-card.on{border-color:var(--c);box-shadow:0 0 0 1px var(--c);}
  .mod-card-title{font-family:'Share Tech Mono',monospace;font-size:9px;color:var(--c);letter-spacing:1px;font-weight:700;margin-bottom:2px;}
  .mod-card-day{font-family:'Share Tech Mono',monospace;font-size:8px;color:${txtMuted};margin-bottom:3px;}
  .mod-card-focus{font-size:11px;color:${txt};line-height:1.4;}
  .actor-tip{font-family:'Share Tech Mono',monospace;font-size:9px;color:${txtMuted};margin-top:3px;padding:3px 6px;background:${bgMod};border-radius:2px;line-height:1.5;}
  .artifact-ck{display:flex;flex-direction:column;gap:4px;}
  .artifact-item{display:flex;align-items:flex-start;gap:8px;padding:5px 7px;border-radius:2px;cursor:pointer;border:1px solid transparent;transition:all 0.15s;}
  .artifact-item:hover{background:${bgInput};}
  .artifact-item.on{border-color:${border};background:${bgInput};}
  .artifact-item input{accent-color:${accent};cursor:pointer;margin-top:2px;flex-shrink:0;}
  .artifact-item-label{font-size:13px;color:${txt};font-weight:600;}
  .artifact-item-desc{font-family:'Share Tech Mono',monospace;font-size:9px;color:${txtMuted};}
  .wiz-nav{display:flex;gap:6px;margin-top:10px;}
  .wiz-back{flex:0;background:transparent;border:1px solid ${border};color:${txtMuted};font-family:'Share Tech Mono',monospace;font-size:9px;padding:6px 12px;cursor:pointer;border-radius:2px;transition:all 0.15s;letter-spacing:1px;}
  .wiz-back:hover{border-color:${accent};color:${accent};}
  .wiz-next{flex:1;background:transparent;border:1px solid ${accent};color:${accent};font-family:'Orbitron',monospace;font-size:9px;padding:8px;cursor:pointer;border-radius:2px;transition:all 0.2s;letter-spacing:2px;font-weight:700;}
  .wiz-next:hover{background:${accent};color:${dark?"#040d14":"#fff"};}
  .wiz-next:disabled{opacity:0.3;cursor:not-allowed;}
  .predict-panel{background:${dark?"rgba(0,212,255,0.03)":"rgba(3,105,161,0.04)"};border:1px solid ${dark?"rgba(0,212,255,0.2)":"rgba(3,105,161,0.2)"};border-radius:3px;padding:12px;margin-bottom:10px;}
  .predict-title{font-family:'Orbitron',monospace;font-size:10px;color:${accent};letter-spacing:2px;margin-bottom:8px;}
  .predict-q{font-size:12px;color:${txt};margin-bottom:4px;font-weight:600;}
  .predict-ta{width:100%;background:${bgInner};border:1px solid ${border};color:${txt};font-family:'Rajdhani',sans-serif;font-size:12px;padding:6px 8px;border-radius:2px;outline:none;resize:vertical;min-height:40px;line-height:1.5;}
  .predict-ta:focus{border-color:${accent};}
  .predict-saved{background:${dark?"rgba(0,212,255,0.06)":"rgba(3,105,161,0.06)"};border:1px solid ${dark?"rgba(0,212,255,0.15)":"rgba(3,105,161,0.15)"};border-radius:2px;padding:6px 9px;font-family:'Share Tech Mono',monospace;font-size:10px;color:${txtMuted};line-height:1.7;}
  .predict-saved-label{font-family:'Share Tech Mono',monospace;font-size:8px;color:${accent};letter-spacing:1px;text-transform:uppercase;margin-bottom:2px;}
  .tab-locked{opacity:0.35;cursor:not-allowed !important;pointer-events:none;}
  .unlock-bar{background:${dark?"rgba(0,212,255,0.04)":"rgba(3,105,161,0.04)"};border-bottom:1px solid ${border};padding:8px 13px;font-family:'Share Tech Mono',monospace;font-size:10px;color:${txtMuted};display:flex;align-items:center;justify-content:space-between;gap:10px;}
  .unlock-btn{background:transparent;border:1px solid ${accent};color:${accent};font-family:'Share Tech Mono',monospace;font-size:9px;padding:4px 10px;cursor:pointer;border-radius:2px;white-space:nowrap;transition:all 0.15s;letter-spacing:1px;}
  .unlock-btn:hover{background:${accent};color:${dark?"#040d14":"#fff"};}
  .teach-card{background:${dark?"rgba(255,107,53,0.06)":"rgba(255,107,53,0.05)"};border:1px solid ${dark?"rgba(255,107,53,0.3)":"rgba(255,107,53,0.35)"};border-radius:3px;padding:10px 12px;margin-bottom:10px;}
  .teach-icon{font-size:16px;margin-bottom:4px;}
  .teach-title{font-family:'Orbitron',monospace;font-size:9px;color:#ff6b35;letter-spacing:2px;margin-bottom:5px;}
  .teach-body{font-size:12px;color:${txt};line-height:1.7;}
  .teach-body b{color:${dark?"#ffffff":"#0f172a"};}
  .think-box{background:${dark?"rgba(0,212,255,0.03)":"rgba(3,105,161,0.04)"};border:1px solid ${dark?"rgba(0,212,255,0.15)":"rgba(3,105,161,0.2)"};border-radius:3px;padding:10px 12px;margin:10px 0;}
  .think-prompt{font-size:12px;color:${txt};font-weight:600;margin-bottom:6px;line-height:1.5;}
  .think-hint{font-family:'Share Tech Mono',monospace;font-size:9px;color:${txtMuted};margin-bottom:6px;font-style:italic;}
  .think-ta{width:100%;background:${bgInner};border:1px solid ${border};color:${txt};font-family:'Rajdhani',sans-serif;font-size:13px;padding:6px 8px;border-radius:2px;outline:none;resize:vertical;min-height:48px;line-height:1.5;}
  .think-ta:focus{border-color:${accent};}
  .think-actions{display:flex;gap:6px;margin-top:6px;align-items:center;}
  .think-reveal{background:${accent};border:none;color:${dark?"#040d14":"#fff"};font-family:'Orbitron',monospace;font-size:9px;padding:5px 12px;cursor:pointer;border-radius:2px;letter-spacing:1px;font-weight:700;}
  .think-skip{background:transparent;border:1px solid ${border};color:${txtMuted};font-family:'Share Tech Mono',monospace;font-size:9px;padding:5px 10px;cursor:pointer;border-radius:2px;letter-spacing:1px;}
  .think-skip:hover{border-color:${accent};color:${accent};}
  .think-saved{font-family:'Share Tech Mono',monospace;font-size:9px;color:${accent};display:flex;align-items:center;gap:4px;}
  .portfolio-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:${dark?"rgba(4,13,20,0.97)":"rgba(240,244,248,0.97)"};z-index:100;overflow-y:auto;padding:24px;}
  .portfolio-inner{max-width:820px;margin:0 auto;}
  .portfolio-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;padding-bottom:12px;border-bottom:1px solid ${border};}
  .portfolio-title{font-family:'Orbitron',monospace;font-size:16px;color:${accent};letter-spacing:2px;}
  .portfolio-close{background:transparent;border:1px solid ${border};color:${txtMuted};font-family:'Share Tech Mono',monospace;font-size:10px;padding:6px 12px;cursor:pointer;border-radius:2px;}
  .portfolio-section{margin-bottom:18px;padding:12px 14px;background:${bgInner};border:1px solid ${border};border-radius:3px;}
  .portfolio-section-title{font-family:'Orbitron',monospace;font-size:10px;color:${accent};letter-spacing:2px;margin-bottom:8px;}
  .portfolio-label{font-family:'Share Tech Mono',monospace;font-size:8px;color:${txtMuted};letter-spacing:1px;text-transform:uppercase;margin-top:8px;margin-bottom:3px;}
  .portfolio-value{font-size:13px;color:${txt};line-height:1.6;white-space:pre-wrap;}
  .portfolio-actions{display:flex;gap:8px;margin-top:16px;flex-wrap:wrap;}
  .port-btn{padding:9px 18px;font-family:'Orbitron',monospace;font-size:9px;letter-spacing:2px;cursor:pointer;border-radius:2px;font-weight:700;}
  .port-print{background:${accent};border:none;color:${dark?"#040d14":"#fff"};}
  .port-copy{background:transparent;border:1px solid ${accent};color:${accent};}
  .port-close-btn{background:transparent;border:1px solid ${border};color:${txtMuted};}
  @media print{.portfolio-overlay{position:static;padding:0;}.portfolio-hdr button,.portfolio-actions{display:none;}.portfolio-inner{max-width:100%;}}

  .cks{display:flex;flex-direction:column;gap:3px;}
  .ck{display:flex;align-items:center;gap:7px;padding:3px 5px;border-radius:2px;cursor:pointer;font-size:13px;color:${txt};}
  .ck:hover{background:rgba(0,212,255,0.04);}
  .ck input{accent-color:${accent};cursor:pointer;}
  .gbtn{width:100%;margin-top:11px;padding:10px;background:transparent;border:1px solid;font-family:'Orbitron',monospace;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:all 0.2s;}
  .gbtn:disabled{opacity:0.35;cursor:not-allowed;}
  .out{display:flex;flex-direction:column;min-height:500px;}
  .lb{height:2px;background:linear-gradient(90deg,${accent},#ff6b35,${accent});background-size:200% 100%;animation:shimmer 1.5s linear infinite;}
  .tabs{display:flex;border-bottom:1px solid ${border};padding:0 8px;gap:1px;flex-wrap:wrap;}
  .tab{background:none;border:none;border-bottom:2px solid transparent;color:${txtMuted};font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;padding:7px 8px;cursor:pointer;margin-bottom:-1px;transition:color 0.15s;}
  .tab.on{color:${accent};border-bottom-color:${accent};}
  .tab:hover:not(.on){color:${txt};}
  .tbody{flex:1;padding:13px;overflow-y:auto;max-height:58vh;}
  .ph2{display:flex;flex-direction:column;align-items:center;justify-content:center;height:280px;gap:9px;color:${txtMuted};font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:2px;text-align:center;}
  .st{font-family:'Orbitron',monospace;font-size:10px;color:${accent};letter-spacing:2px;margin-bottom:9px;}
  .tbl{width:100%;border-collapse:collapse;font-size:11px;}
  th{background:${thBg};color:${accent};padding:6px 8px;text-align:left;border:1px solid ${border};font-size:10px;letter-spacing:1px;}
  td{padding:5px 8px;border:1px solid ${borderTd};vertical-align:top;color:${txt};}
  .bh{display:inline-block;padding:2px 5px;border-radius:2px;font-size:10px;font-weight:bold;background:rgba(255,0,64,0.18);color:#ff0040;border:1px solid rgba(255,0,64,0.35);}
  .bm{display:inline-block;padding:2px 5px;border-radius:2px;font-size:10px;font-weight:bold;background:rgba(255,107,53,0.18);color:#ff6b35;border:1px solid rgba(255,107,53,0.35);}
  .bl{display:inline-block;padding:2px 5px;border-radius:2px;font-size:10px;font-weight:bold;background:${dark?"rgba(57,255,20,0.1)":"rgba(22,163,74,0.12)"};color:${dark?"#39ff14":"#15803d"};border:1px solid ${dark?"rgba(57,255,20,0.25)":"rgba(22,163,74,0.4)"};}
  .pre-out{font-family:'Share Tech Mono',monospace;font-size:11px;color:${txt};white-space:pre-wrap;line-height:1.8;}
  .cr{display:flex;justify-content:flex-end;padding:5px 11px;border-bottom:1px solid ${border};}
  .cb{background:transparent;border:1px solid ${border};color:${txtMuted};font-family:'Share Tech Mono',monospace;font-size:10px;padding:3px 8px;cursor:pointer;border-radius:2px;transition:all 0.15s;}
  .cb:hover{border-color:${accent};color:${accent};}
  .ci{background:${ciBg};border:1px solid ${ciBorder};border-radius:3px;padding:10px 13px;font-size:13px;color:${txt};line-height:1.8;margin-top:10px;}
  .ftr{text-align:center;padding:11px;font-family:'Share Tech Mono',monospace;font-size:9px;color:${txtMuted};letter-spacing:2px;margin-top:10px;border-top:1px solid ${border};line-height:1.8;}
  ::-webkit-scrollbar{width:3px;height:3px;}
  ::-webkit-scrollbar-thumb{background:${scrollBg};border-radius:2px;}
  select option{background:${optBg};}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  `;
}




// ── Student Mode CSS — academic single-column, Bloom's taxonomy visual language ──
const studentCss = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Georgia:ital,wght@0,400;0,700;1,400&display=swap');

  .s-root{
    background:#F7F8FA;
    color:#1A2332;
    font-family:'Inter',system-ui,sans-serif;
    font-size:15px;
    min-height:100vh;
    padding:0;
  }

  /* ── Header ── */
  .s-hdr{
    background:#1A2332;
    color:#fff;
    padding:16px 24px 14px;
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:12px;
    flex-wrap:wrap;
  }
  .s-hdr-left{ display:flex; flex-direction:column; gap:2px; }
  .s-course-label{ font-size:11px; font-weight:600; letter-spacing:.08em; color:#7EA8C4; text-transform:uppercase; }
  .s-title{ font-family:'Georgia',Georgia,serif; font-size:20px; font-weight:700; color:#fff; line-height:1.2; }
  .s-title em{ font-style:italic; color:#7EA8C4; }
  .s-hdr-right{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
  .s-mode-bar{ display:flex; border:1px solid rgba(255,255,255,0.2); border-radius:4px; overflow:hidden; }
  .s-mode-btn{ background:transparent; border:none; color:rgba(255,255,255,0.6); font-family:'Inter',sans-serif; font-size:11px; font-weight:500; padding:5px 14px; cursor:pointer; transition:all .15s; }
  .s-mode-btn.on{ background:rgba(255,255,255,0.15); color:#fff; }
  .s-theme-btn{ background:transparent; border:1px solid rgba(255,255,255,0.2); color:rgba(255,255,255,0.6); font-family:'Inter',sans-serif; font-size:11px; padding:5px 10px; cursor:pointer; border-radius:3px; }

  /* ── Progress bar ── */
  .s-progress{
    background:#E8F0F7;
    border-bottom:1px solid #D0DDE8;
    padding:10px 24px;
    display:flex;
    align-items:center;
    gap:0;
  }
  .s-prog-step{ display:flex; align-items:center; gap:6px; font-size:12px; font-weight:500; color:#7EA8C4; }
  .s-prog-step.done{ color:#4A7C59; }
  .s-prog-step.active{ color:#1A2332; font-weight:600; }
  .s-prog-num{ width:22px; height:22px; border-radius:50%; border:2px solid currentColor; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; flex-shrink:0; background:#fff; }
  .s-prog-step.done .s-prog-num{ background:#4A7C59; border-color:#4A7C59; color:#fff; }
  .s-prog-step.active .s-prog-num{ background:#2C5F8A; border-color:#2C5F8A; color:#fff; }
  .s-prog-line{ flex:1; height:2px; background:#D0DDE8; margin:0 8px; max-width:40px; }
  .s-prog-line.done{ background:#4A7C59; }

  /* ── Page container ── */
  .s-page{ max-width:760px; margin:0 auto; padding:28px 24px 60px; }

  /* ── Bloom badge ── */
  .bloom-badge{
    display:inline-flex; align-items:center; gap:5px;
    font-size:10px; font-weight:600; letter-spacing:.04em;
    padding:3px 9px; border-radius:12px; margin-bottom:10px;
  }
  .bloom-remember{ background:#EEF3FB; color:#2C5F8A; border:1px solid #C5D8EE; }
  .bloom-understand{ background:#EEF5F0; color:#3A6B48; border:1px solid #BDD9C5; }
  .bloom-apply{ background:#FEF6EE; color:#8B4513; border:1px solid #F5D9B8; }
  .bloom-analyze{ background:#F3EEF8; color:#5B3480; border:1px solid #D9C5EE; }
  .bloom-evaluate{ background:#FEF0F0; color:#8B1A1A; border:1px solid #EEBDBD; }

  /* ── Section heading ── */
  .s-section-title{
    font-family:'Georgia',Georgia,serif;
    font-size:22px;
    font-weight:700;
    color:#1A2332;
    margin:0 0 6px;
    line-height:1.3;
  }
  .s-section-sub{
    font-size:14px;
    color:#4A5E72;
    margin-bottom:20px;
    line-height:1.6;
    max-width:64ch;
  }

  /* ── Teaching card ── */
  .s-teach{
    background:#fff;
    border:1px solid #D0DDE8;
    border-left:4px solid #2C5F8A;
    border-radius:6px;
    padding:16px 18px;
    margin-bottom:18px;
  }
  .s-teach-title{
    font-size:12px; font-weight:700; letter-spacing:.06em;
    color:#2C5F8A; margin-bottom:8px; text-transform:uppercase;
  }
  .s-teach-body{ font-size:14px; color:#1A2332; line-height:1.75; }
  .s-teach-body b{ color:#1A2332; font-weight:600; }
  .s-teach-body em{ color:#2C5F8A; font-style:normal; font-weight:600; }

  /* ── Concept diagram card ── */
  .s-diagram-card{
    background:#fff;
    border:1px solid #D0DDE8;
    border-radius:6px;
    padding:18px;
    margin-bottom:18px;
    overflow-x:auto;
  }
  .s-diagram-label{
    font-size:11px; font-weight:600; color:#7EA8C4;
    letter-spacing:.06em; text-transform:uppercase; margin-bottom:12px;
  }

  /* ── Form elements ── */
  .s-field{ margin-bottom:16px; }
  .s-label{ display:block; font-size:12px; font-weight:600; color:#4A5E72; margin-bottom:5px; letter-spacing:.03em; }
  .s-select, .s-ta{
    width:100%; padding:9px 12px;
    border:1px solid #C8D6E5; border-radius:5px;
    font-family:'Inter',sans-serif; font-size:14px; color:#1A2332;
    background:#fff; outline:none; transition:border-color .15s;
  }
  .s-select:focus, .s-ta:focus{ border-color:#2C5F8A; box-shadow:0 0 0 3px rgba(44,95,138,.1); }
  .s-ta{ resize:vertical; min-height:72px; line-height:1.6; }

  /* ── Module cards grid ── */
  .s-mod-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:10px; margin-bottom:18px; }
  .s-mod-card{
    background:#fff; border:2px solid #D0DDE8; border-radius:6px;
    padding:12px 14px; cursor:pointer; text-align:left; transition:all .15s; width:100%;
  }
  .s-mod-card:hover{ border-color:#2C5F8A; background:#F0F5FA; }
  .s-mod-card.on{ border-color:var(--mc); background:#F0F5FA; box-shadow:0 0 0 1px var(--mc); }
  .s-mod-day{ font-size:10px; font-weight:600; color:#7EA8C4; letter-spacing:.05em; text-transform:uppercase; margin-bottom:3px; }
  .s-mod-name{ font-size:13px; font-weight:700; color:var(--mc,#2C5F8A); margin-bottom:3px; }
  .s-mod-focus{ font-size:12px; color:#4A5E72; line-height:1.4; }

  /* ── Actor tip ── */
  .s-actor-tip{
    background:#E8F0F7; border:1px solid #C5D8EE; border-radius:4px;
    padding:8px 12px; font-size:12px; color:#2C5F8A; line-height:1.6; margin-top:5px; margin-bottom:12px;
  }

  /* ── Sophistication slider ── */
  .s-slider{ width:100%; accent-color:#2C5F8A; }
  .s-slider-labels{ display:flex; justify-content:space-between; font-size:11px; color:#7EA8C4; margin-top:3px; }
  .s-soph-display{
    text-align:center; font-size:12px; font-weight:600; color:#2C5F8A;
    margin-top:5px; padding:4px 10px; background:#E8F0F7; border-radius:12px;
    display:inline-block;
  }

  /* ── Artifact checkboxes ── */
  .s-artifact-list{ display:flex; flex-direction:column; gap:6px; margin-bottom:16px; }
  .s-artifact-item{
    display:flex; align-items:flex-start; gap:10px;
    padding:10px 12px; border:1px solid #D0DDE8; border-radius:5px;
    cursor:pointer; background:#fff; transition:all .15s;
  }
  .s-artifact-item:hover{ border-color:#2C5F8A; background:#F7FAFE; }
  .s-artifact-item.on{ border-color:#2C5F8A; background:#F0F5FA; }
  .s-artifact-item input{ accent-color:#2C5F8A; margin-top:2px; flex-shrink:0; }
  .s-artifact-name{ font-size:13px; font-weight:600; color:#1A2332; }
  .s-artifact-desc{ font-size:11px; color:#7EA8C4; margin-top:1px; }
  .s-artifact-bloom{ margin-top:3px; }

  /* ── Buttons ── */
  .s-btn-primary{
    width:100%; padding:12px; background:#2C5F8A; color:#fff;
    border:none; border-radius:5px; font-family:'Inter',sans-serif;
    font-size:14px; font-weight:600; cursor:pointer; transition:background .15s;
  }
  .s-btn-primary:hover{ background:#245179; }
  .s-btn-primary:disabled{ background:#A0B8CE; cursor:not-allowed; }
  .s-btn-secondary{
    padding:10px 18px; background:#fff; color:#2C5F8A;
    border:1px solid #2C5F8A; border-radius:5px; font-family:'Inter',sans-serif;
    font-size:13px; font-weight:500; cursor:pointer; transition:all .15s;
  }
  .s-btn-secondary:hover{ background:#F0F5FA; }
  .s-btn-ghost{
    padding:10px 18px; background:transparent; color:#7EA8C4;
    border:1px solid #D0DDE8; border-radius:5px; font-family:'Inter',sans-serif;
    font-size:13px; cursor:pointer; transition:all .15s;
  }
  .s-btn-ghost:hover{ border-color:#7EA8C4; color:#4A5E72; }
  .s-btn-row{ display:flex; gap:8px; margin-top:16px; flex-wrap:wrap; }
  .s-btn-danger{ background:#C8371A; border-color:#C8371A; color:#fff; }
  .s-btn-danger:hover{ background:#A82D14; }

  /* ── Predict panel ── */
  .s-predict{
    background:#fff; border:1px solid #D0DDE8;
    border-top:4px solid #2C5F8A; border-radius:6px;
    padding:18px; margin-bottom:20px;
  }
  .s-predict-title{
    font-family:'Georgia',Georgia,serif;
    font-size:17px; font-weight:700; color:#1A2332; margin-bottom:4px;
  }
  .s-predict-sub{ font-size:13px; color:#4A5E72; margin-bottom:14px; line-height:1.5; }
  .s-predict-q{ font-size:13px; font-weight:600; color:#1A2332; margin-bottom:5px; }

  /* ── Saved predictions display ── */
  .s-pred-saved{
    background:#EEF5F0; border:1px solid #BDD9C5; border-radius:5px;
    padding:10px 14px; margin-bottom:8px;
  }
  .s-pred-saved-label{ font-size:10px; font-weight:700; color:#3A6B48; letter-spacing:.05em; text-transform:uppercase; margin-bottom:3px; }
  .s-pred-saved-val{ font-size:13px; color:#1A2332; }

  /* ── Think box ── */
  .s-think{
    background:#F7FAFE; border:1px solid #C5D8EE; border-radius:6px;
    padding:16px; margin-bottom:16px;
  }
  .s-think-q{ font-size:14px; font-weight:600; color:#1A2332; margin-bottom:4px; line-height:1.5; }
  .s-think-hint{ font-size:12px; color:#7EA8C4; margin-bottom:10px; font-style:italic; }
  .s-think-saved{
    display:flex; align-items:center; gap:6px;
    font-size:12px; font-weight:600; color:#4A7C59; margin-bottom:8px;
  }
  .s-think-resp{
    background:#EEF5F0; border:1px solid #BDD9C5; border-radius:4px;
    padding:8px 12px; font-size:13px; color:#1A2332; line-height:1.6;
  }
  .s-think-resp-label{ font-size:10px; font-weight:700; color:#3A6B48; text-transform:uppercase; letter-spacing:.04em; margin-bottom:3px; }

  /* ── Output tabs ── */
  .s-out-wrap{ margin-top:24px; }
  .s-tabs{
    display:flex; border-bottom:2px solid #D0DDE8;
    gap:0; overflow-x:auto; margin-bottom:0;
  }
  .s-tab{
    padding:10px 16px; font-size:13px; font-weight:500; color:#7EA8C4;
    background:none; border:none; border-bottom:2px solid transparent;
    cursor:pointer; white-space:nowrap; margin-bottom:-2px; transition:all .15s;
  }
  .s-tab:hover{ color:#2C5F8A; }
  .s-tab.on{ color:#2C5F8A; border-bottom-color:#2C5F8A; font-weight:600; }
  .s-tab-content{ padding:20px 0; }

  /* ── Output content ── */
  .s-narrative{ font-size:15px; line-height:1.8; color:#1A2332; }
  .s-narrative p{ margin-bottom:14px; }
  .s-dq-section{ margin-top:22px; padding-top:18px; border-top:1px solid #D0DDE8; }
  .s-dq-title{ font-family:'Georgia',Georgia,serif; font-size:15px; font-weight:700; color:#C8371A; margin-bottom:10px; }
  .s-pre{ font-size:13px; color:#1A2332; white-space:pre-wrap; line-height:1.8; background:#F7F8FA; border:1px solid #E0E8F0; border-radius:5px; padding:14px; }
  .s-table{ width:100%; border-collapse:collapse; font-size:13px; }
  .s-table th{ background:#E8F0F7; color:#2C5F8A; padding:8px 10px; text-align:left; border:1px solid #D0DDE8; font-size:11px; font-weight:700; letter-spacing:.04em; }
  .s-table td{ padding:7px 10px; border:1px solid #E0E8F0; color:#1A2332; vertical-align:top; }
  .s-table tr:nth-child(even) td{ background:#FAFCFE; }
  .s-badge-h{ display:inline-block; padding:2px 7px; border-radius:10px; font-size:10px; font-weight:700; background:#FEEEEE; color:#C8371A; border:1px solid #F5BFBF; }
  .s-badge-m{ display:inline-block; padding:2px 7px; border-radius:10px; font-size:10px; font-weight:700; background:#FEF6EE; color:#8B4513; border:1px solid #F5D9B8; }
  .s-badge-l{ display:inline-block; padding:2px 7px; border-radius:10px; font-size:10px; font-weight:700; background:#EEF5F0; color:#3A6B48; border:1px solid #BDD9C5; }

  /* ── Loading state ── */
  .s-loading{
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    padding:48px 24px; gap:14px;
  }
  .s-loading-spinner{
    width:36px; height:36px; border:3px solid #D0DDE8;
    border-top-color:#2C5F8A; border-radius:50%;
    animation:s-spin .8s linear infinite;
  }
  .s-loading-text{ font-size:14px; color:#4A5E72; font-weight:500; }
  .s-loading-sub{ font-size:12px; color:#7EA8C4; }
  @keyframes s-spin{ to{ transform:rotate(360deg); } }

  /* ── Portfolio overlay ── */
  .s-portfolio{
    position:fixed; top:0; left:0; width:100%; height:100%;
    background:rgba(26,35,50,.95); z-index:200; overflow-y:auto;
    padding:24px;
  }
  .s-port-inner{ max-width:720px; margin:0 auto; }
  .s-port-hdr{ display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
  .s-port-title{ font-family:'Georgia',Georgia,serif; font-size:22px; color:#fff; font-weight:700; }
  .s-port-section{ background:#fff; border-radius:6px; padding:16px 18px; margin-bottom:12px; }
  .s-port-sect-title{ font-size:11px; font-weight:700; color:#2C5F8A; text-transform:uppercase; letter-spacing:.06em; margin-bottom:10px; }
  .s-port-label{ font-size:11px; font-weight:600; color:#7EA8C4; margin-top:10px; margin-bottom:3px; letter-spacing:.03em; }
  .s-port-val{ font-size:14px; color:#1A2332; line-height:1.6; white-space:pre-wrap; }
  .s-port-actions{ display:flex; gap:8px; margin-top:16px; flex-wrap:wrap; }
  .s-port-btn{ padding:10px 20px; border-radius:5px; font-family:'Inter',sans-serif; font-size:13px; font-weight:600; cursor:pointer; }
  .s-port-print{ background:#2C5F8A; color:#fff; border:none; }
  .s-port-copy{ background:transparent; border:1px solid rgba(255,255,255,.3); color:#fff; }
  .s-port-close{ background:transparent; border:1px solid rgba(255,255,255,.2); color:rgba(255,255,255,.7); }
  .s-port-note{ font-size:12px; color:rgba(255,255,255,.5); margin-top:10px; line-height:1.6; }
  @media print{
    .s-portfolio{ position:static; background:#fff; padding:0; }
    .s-port-hdr button, .s-port-actions{ display:none; }
    .s-port-title{ color:#1A2332; }
    .s-port-inner{ max-width:100%; }
  }

  /* ── Inline SVG diagrams ── */
  .s-svg-wrap{ overflow-x:auto; padding:4px 0; }
  svg.concept-diagram{ max-width:100%; height:auto; }

  /* ── Misc ── */
  .s-divider{ height:1px; background:#D0DDE8; margin:20px 0; }
  .s-ph{ display:flex; flex-direction:column; align-items:center; justify-content:center; padding:48px 24px; color:#7EA8C4; font-size:14px; gap:8px; }
  .s-err{ color:#C8371A; padding:16px; background:#FEF0F0; border:1px solid #EEBDBD; border-radius:5px; font-size:14px; }
  .s-info-pill{ display:inline-flex; align-items:center; gap:5px; padding:4px 10px; background:#E8F0F7; border-radius:12px; font-size:11px; color:#2C5F8A; font-weight:500; margin-bottom:12px; }
  .s-warn-tip{ background:#FEF6EE; border:1px solid #F5D9B8; border-radius:4px; padding:8px 12px; font-size:12px; color:#7A4010; line-height:1.6; margin-bottom:14px; }
  @media(max-width:600px){ .s-page{ padding:16px 14px 48px; } .s-mod-grid{ grid-template-columns:1fr 1fr; } .s-hdr{ padding:12px 14px; } }
`;


// SVG concept diagrams grounded in CYB-5620V slides
const SVG_CRRM = `<svg class="concept-diagram" viewBox="0 0 660 120" xmlns="http://www.w3.org/2000/svg" font-family="Inter,sans-serif">
  <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#2C5F8A"/></marker></defs>
  <rect x="10" y="18" width="185" height="82" rx="6" fill="#E8F0F7" stroke="#2C5F8A" stroke-width="1.5"/>
  <text x="103" y="40" text-anchor="middle" font-size="11" font-weight="700" fill="#2C5F8A">HAZARD ANALYSIS</text>
  <text x="103" y="57" text-anchor="middle" font-size="10" fill="#4A5E72">Losses → Hazards</text>
  <text x="103" y="71" text-anchor="middle" font-size="10" fill="#4A5E72">Control Structure</text>
  <text x="103" y="85" text-anchor="middle" font-size="10" fill="#4A5E72">HCAs (STPA-Sec)</text>
  <text x="103" y="109" text-anchor="middle" font-size="9" fill="#7EA8C4" font-style="italic">Understand · Analyze</text>
  <line x1="197" y1="59" x2="233" y2="59" stroke="#2C5F8A" stroke-width="1.5" marker-end="url(#arr)"/>
  <rect x="235" y="18" width="185" height="82" rx="6" fill="#EEF5F0" stroke="#4A7C59" stroke-width="1.5"/>
  <text x="328" y="40" text-anchor="middle" font-size="11" font-weight="700" fill="#3A6B48">LOSS SCENARIO</text>
  <text x="328" y="55" text-anchor="middle" font-size="11" font-weight="700" fill="#3A6B48">ASSESSMENT</text>
  <text x="328" y="71" text-anchor="middle" font-size="10" fill="#4A5E72">Adversary → HCA</text>
  <text x="328" y="85" text-anchor="middle" font-size="10" fill="#4A5E72">→ Hazard → Loss</text>
  <text x="328" y="109" text-anchor="middle" font-size="9" fill="#4A7C59" font-style="italic">Apply · Evaluate</text>
  <line x1="422" y1="59" x2="458" y2="59" stroke="#4A7C59" stroke-width="1.5" marker-end="url(#arr)"/>
  <rect x="460" y="18" width="185" height="82" rx="6" fill="#F3EEF8" stroke="#5B3480" stroke-width="1.5"/>
  <text x="553" y="40" text-anchor="middle" font-size="11" font-weight="700" fill="#5B3480">ASSURANCE CASES</text>
  <text x="553" y="57" text-anchor="middle" font-size="10" fill="#4A5E72">Claim → Evidence</text>
  <text x="553" y="71" text-anchor="middle" font-size="10" fill="#4A5E72">→ Argument → SHALL</text>
  <text x="553" y="85" text-anchor="middle" font-size="10" fill="#4A5E72">NIST 800-53 control</text>
  <text x="553" y="109" text-anchor="middle" font-size="9" fill="#5B3480" font-style="italic">Evaluate · Create</text>
</svg>`;

const SVG_STPA_CHAIN = `<svg class="concept-diagram" viewBox="0 0 600 78" xmlns="http://www.w3.org/2000/svg" font-family="Inter,sans-serif">
  <defs><marker id="ch" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#1A2332"/></marker></defs>
  <rect x="4" y="8" width="118" height="58" rx="5" fill="#E8F0F7" stroke="#2C5F8A" stroke-width="1.5"/>
  <text x="63" y="27" text-anchor="middle" font-size="10" font-weight="700" fill="#2C5F8A">LOSSES</text>
  <text x="63" y="42" text-anchor="middle" font-size="9" fill="#4A5E72">Mission-level</text>
  <text x="63" y="55" text-anchor="middle" font-size="9" fill="#4A5E72">bad outcomes</text>
  <line x1="124" y1="37" x2="142" y2="37" stroke="#1A2332" stroke-width="1.5" marker-end="url(#ch)"/>
  <rect x="144" y="8" width="118" height="58" rx="5" fill="#EEF5F0" stroke="#3A6B48" stroke-width="1.5"/>
  <text x="203" y="27" text-anchor="middle" font-size="10" font-weight="700" fill="#3A6B48">HAZARDS</text>
  <text x="203" y="42" text-anchor="middle" font-size="9" fill="#4A5E72">System states</text>
  <text x="203" y="55" text-anchor="middle" font-size="9" fill="#4A5E72">→ losses</text>
  <line x1="264" y1="37" x2="282" y2="37" stroke="#1A2332" stroke-width="1.5" marker-end="url(#ch)"/>
  <rect x="284" y="8" width="118" height="58" rx="5" fill="#FEF6EE" stroke="#8B4513" stroke-width="1.5"/>
  <text x="343" y="27" text-anchor="middle" font-size="10" font-weight="700" fill="#8B4513">HCAs</text>
  <text x="343" y="42" text-anchor="middle" font-size="9" fill="#4A5E72">4 failure types</text>
  <text x="343" y="55" text-anchor="middle" font-size="9" fill="#4A5E72">per control action</text>
  <line x1="404" y1="37" x2="422" y2="37" stroke="#1A2332" stroke-width="1.5" marker-end="url(#ch)"/>
  <rect x="424" y="8" width="130" height="58" rx="5" fill="#F3EEF8" stroke="#5B3480" stroke-width="1.5"/>
  <text x="489" y="27" text-anchor="middle" font-size="10" font-weight="700" fill="#5B3480">LOSS SCENARIOS</text>
  <text x="489" y="42" text-anchor="middle" font-size="9" fill="#4A5E72">Adversary → HCA</text>
  <text x="489" y="55" text-anchor="middle" font-size="9" fill="#4A5E72">→ Hazard → Loss</text>
</svg>`;

const SVG_CONTROL_STRUCTURE = `<svg class="concept-diagram" viewBox="0 0 480 230" xmlns="http://www.w3.org/2000/svg" font-family="Inter,sans-serif">
  <defs>
    <marker id="ca2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#C8371A"/></marker>
    <marker id="fb2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#4A7C59"/></marker>
  </defs>
  <rect x="140" y="8" width="200" height="46" rx="5" fill="#E8F0F7" stroke="#2C5F8A" stroke-width="1.5"/>
  <text x="240" y="28" text-anchor="middle" font-size="12" font-weight="700" fill="#1A2332">HUMAN OPERATOR</text>
  <text x="240" y="45" text-anchor="middle" font-size="10" fill="#4A5E72">ENGAGE / HALT commands</text>
  <line x1="240" y1="56" x2="240" y2="80" stroke="#C8371A" stroke-width="1.5" marker-end="url(#ca2)"/>
  <text x="258" y="72" font-size="9" fill="#C8371A">Control Action</text>
  <rect x="140" y="82" width="200" height="46" rx="5" fill="#E8F0F7" stroke="#2C5F8A" stroke-width="1.5"/>
  <text x="240" y="102" text-anchor="middle" font-size="12" font-weight="700" fill="#1A2332">C2 SOFTWARE NODE</text>
  <text x="240" y="119" text-anchor="middle" font-size="10" fill="#4A5E72">relay · validate · audit log</text>
  <line x1="134" y1="105" x2="134" y2="68" stroke="#4A7C59" stroke-width="1.5" marker-end="url(#fb2)"/>
  <text x="78" y="90" font-size="9" fill="#4A7C59">Feedback /</text>
  <text x="78" y="102" font-size="9" fill="#4A7C59">Status</text>
  <line x1="240" y1="130" x2="240" y2="154" stroke="#C8371A" stroke-width="1.5" marker-end="url(#ca2)"/>
  <rect x="140" y="156" width="200" height="46" rx="5" fill="#E8F0F7" stroke="#2C5F8A" stroke-width="1.5"/>
  <text x="240" y="176" text-anchor="middle" font-size="12" font-weight="700" fill="#1A2332">UGV PLATFORM</text>
  <text x="240" y="193" text-anchor="middle" font-size="10" fill="#4A5E72">sensor · weapon · mobility</text>
  <line x1="134" y1="179" x2="134" y2="142" stroke="#4A7C59" stroke-width="1.5" marker-end="url(#fb2)"/>
  <line x1="240" y1="204" x2="240" y2="216" stroke="#1A2332" stroke-width="1"/>
  <rect x="140" y="216" width="200" height="12" rx="2" fill="#1A2332"/>
  <text x="240" y="226" text-anchor="middle" font-size="9" fill="#fff">PHYSICAL DOMAIN</text>
  <rect x="358" y="64" width="112" height="106" rx="5" fill="#FEF0F0" stroke="#EEBDBD" stroke-width="1"/>
  <text x="414" y="82" text-anchor="middle" font-size="10" font-weight="700" fill="#C8371A">4 HCA TYPES</text>
  <text x="414" y="98" text-anchor="middle" font-size="9" fill="#4A5E72">1. Provided when</text>
  <text x="414" y="111" text-anchor="middle" font-size="9" fill="#4A5E72">   shouldn't be</text>
  <text x="414" y="124" text-anchor="middle" font-size="9" fill="#4A5E72">2. Not provided</text>
  <text x="414" y="137" text-anchor="middle" font-size="9" fill="#4A5E72">   when should</text>
  <text x="414" y="150" text-anchor="middle" font-size="9" fill="#4A5E72">3. Wrong timing</text>
  <text x="414" y="163" text-anchor="middle" font-size="9" fill="#4A5E72">4. Wrong duration</text>
  <line x1="342" y1="117" x2="356" y2="117" stroke="#EEBDBD" stroke-width="1" stroke-dasharray="3,2"/>
</svg>`;

function BloomBadge({ level }) {
  const map = {
    remember:   { cls:"bloom-remember",   label:"Remember",   icon:"📌" },
    understand: { cls:"bloom-understand", label:"Understand", icon:"💡" },
    apply:      { cls:"bloom-apply",      label:"Apply",      icon:"🔧" },
    analyze:    { cls:"bloom-analyze",    label:"Analyze",    icon:"🔬" },
    evaluate:   { cls:"bloom-evaluate",   label:"Evaluate",   icon:"⚖️" },
  };
  const b = map[level] || map.understand;
  return <span className={`bloom-badge ${b.cls}`}>{b.icon} {b.label}</span>;
}

function PH({ t }) {
  return <div className="s-ph"><span style={{fontSize:28,opacity:.3}}>◯</span><span>{t}</span></div>;
}

function TeachCard({ tabKey, teach, mode }) {
  const t = teach[tabKey];
  if (!t || mode !== "student") return null;
  return (
    <div className="s-teach">
      {t.bloom && <BloomBadge level={t.bloom} />}
      <div className="s-teach-title">{t.title}</div>
      <div className="s-teach-body" dangerouslySetInnerHTML={{__html: t.body}} />
      {t.svg === "crrm"       && <div className="s-diagram-card" style={{marginTop:12,marginBottom:0}}><div className="s-diagram-label">CRRM Process Flow — Module 4</div><div className="s-svg-wrap" dangerouslySetInnerHTML={{__html:SVG_CRRM}} /></div>}
      {t.svg === "stpa_chain" && <div className="s-diagram-card" style={{marginTop:12,marginBottom:0}}><div className="s-diagram-label">STPA-Sec Element Chain — Module 6</div><div className="s-svg-wrap" dangerouslySetInnerHTML={{__html:SVG_STPA_CHAIN}} /></div>}
      {t.svg === "control"    && <div className="s-diagram-card" style={{marginTop:12,marginBottom:0}}><div className="s-diagram-label">Control Structure Hierarchy — Module 6</div><div className="s-svg-wrap" dangerouslySetInnerHTML={{__html:SVG_CONTROL_STRUCTURE}} /></div>}
    </div>
  );
}

function ThinkBox({ tabKey, teach, mode, thinkResponses, setThinkText, thinkRevealed, revealTab }) {
  const t = teach[tabKey];
  if (!t || !t.think || mode !== "student") return null;
  const revealed = thinkRevealed[tabKey];
  const hasText  = (thinkResponses[tabKey] || "").trim().length > 0;
  if (revealed) return (
    <div className="s-think" style={{marginBottom:16}}>
      <div className="s-think-saved">✓ Your response saved — compare it against the analysis below</div>
      {hasText && <><div className="s-think-resp-label">Your answer</div><div className="s-think-resp">{thinkResponses[tabKey]}</div></>}
    </div>
  );
  return (
    <div className="s-think">
      <div className="s-think-q">💭 {t.think}</div>
      <div className="s-think-hint">Optional — write your thinking before the AI analysis appears. Saved to your portfolio.</div>
      <textarea className="s-ta" rows={3}
        value={thinkResponses[tabKey] || ""}
        onChange={e=>setThinkText(tabKey, e.target.value)}
        placeholder="Type your thoughts here…" />
      <div className="s-btn-row" style={{marginTop:8}}>
        <button className="s-btn-primary" style={{flex:1,padding:"9px"}} onClick={()=>revealTab(tabKey)}>
          {hasText ? "Save & see analysis" : "Skip — show analysis"}
        </button>
      </div>
    </div>
  );
}

function PredictPanel({ predLosses, setPredLosses, predMitre, setPredMitre, predSaved, setPredSaved, loading, onGenerate }) {
  if (predSaved) return (
    <div className="s-predict">
      <div className="s-predict-title">Your predictions are saved</div>
      <div className="s-predict-sub">As you work through each tab, compare what you expected against what the AI generated. The gap is where learning happens.</div>
      <div className="s-pred-saved">
        <div className="s-pred-saved-label">Losses you predicted</div>
        <div className="s-pred-saved-val">{predLosses || "(none entered)"}</div>
      </div>
      <div className="s-pred-saved" style={{marginTop:8}}>
        <div className="s-pred-saved-label">MITRE technique you expected first</div>
        <div className="s-pred-saved-val">{predMitre || "(none entered)"}</div>
      </div>
    </div>
  );
  return (
    <div className="s-predict">
      <div className="s-predict-title">Before you see the analysis — make your predictions</div>
      <div className="s-predict-sub">Optional but important. Writing what you think will happen before seeing the AI answer trains you to reason independently — a core skill for any systems engineer or acquisition professional.</div>
      <div className="s-field">
        <div className="s-predict-q">What do you think the top losses (L-statements) will be?</div>
        <textarea className="s-ta" rows={2}
          value={predLosses}
          onChange={e=>setPredLosses(e.target.value)}
          placeholder="e.g. L-1: Friendly casualties due to unauthorized ENGAGE, L-2: Mission failure…" />
      </div>
      <div className="s-field" style={{marginBottom:0}}>
        <div className="s-predict-q">What MITRE ATT&CK technique do you expect to appear first?</div>
        <textarea className="s-ta" rows={1}
          value={predMitre}
          onChange={e=>setPredMitre(e.target.value)}
          placeholder="e.g. T1566.001 Spearphishing, T0836 Modify Parameter…" />
      </div>
      <div className="s-btn-row">
        <button className="s-btn-primary" style={{flex:2}} disabled={loading}
          onClick={()=>{ setPredSaved(true); onGenerate(); }}>
          {loading ? "Generating analysis…" : "Save predictions & generate"}
        </button>
        <button className="s-btn-ghost" disabled={loading} onClick={()=>onGenerate()}>Skip</button>
      </div>
    </div>
  );
}

function StudentWizard({ wizStep, setWizStep, mk, setMk, mod, scen, setScen, sys, setSys, actor, setActor, soph, setSoph, extra, setExtra, checks, toggle, loading, teach, ACTOR_TIPS, MODULES, SOPH }) {
  const ARTIFACT_ITEMS = [
    { k:"usecase",   label:"Map who does what",            desc:"Use Case Diagram — actors, functions, attack intercept points",    check:"usecase",   bloom:"understand" },
    { k:"sequence",  label:"Trace the attack timeline",    desc:"Sequence Diagram — step-by-step from initial access to impact",   check:"sequence",  bloom:"analyze"    },
    { k:"stpa",      label:"Apply STPA-Sec methodology",   desc:"Losses · Hazards · Control Structure · HCAs · Loss Scenarios",    check:"stpa",      bloom:"analyze"    },
    { k:"assurance", label:"Build Assurance Cases",        desc:"Claim → Evidence → Argument → SHALL Req · Closes CRRM loop",     check:"assurance", bloom:"evaluate"   },
    { k:"mitre",     label:"Map MITRE ATT&CK techniques",  desc:"Adversary tactics and techniques — ICS + Enterprise matrices",    check:"mitre",     bloom:"apply"      },
    { k:"req",       label:"Write security requirements",  desc:"SHALL statements traceable to NIST 800-53 and DoD policy",        check:"req",       bloom:"evaluate"   },
    { k:"coa",       label:"Identify courses of action",   desc:"FOREST/Sentinel defensive techniques — likelihood vs consequence", check:"coa",       bloom:"evaluate"   },
    { k:"bdd",       label:"Model system architecture",    desc:"Block Definition Diagram — blocks and security interfaces",        check:"bdd",       bloom:"understand" },
  ];
  return (
    <div>
      {wizStep === 1 && <>
        <TeachCard tabKey="step1" teach={teach} mode="student" />
        <div className="s-section-title">Choose your mission</div>
        <div className="s-section-sub">Select the module your class is working on. Each uses a different system, scenario set, and adversary context.</div>
        <div className="s-mod-grid">
          {Object.entries(MODULES).map(([key,m]) => (
            <button key={key} className={"s-mod-card"+(mk===key?" on":"")}
              style={{"--mc":m.color}} onClick={()=>setMk(key)}>
              <div className="s-mod-day">{m.day}</div>
              <div className="s-mod-name">{m.label}</div>
              <div className="s-mod-focus">{m.focus.split(":")[0]}</div>
            </button>
          ))}
        </div>
        <button className="s-btn-primary" onClick={()=>setWizStep(2)}>Continue with {mod.label} →</button>
      </>}

      {wizStep === 2 && <>
        <TeachCard tabKey="step2actor" teach={teach} mode="student" />
        <div className="s-section-title">Define the threat</div>
        <div className="s-section-sub">Choose a scenario, the system under attack, and the adversary. Your selections shape every artifact the AI generates.</div>
        <div className="s-field">
          <label className="s-label">Scenario</label>
          <select className="s-select" value={scen} onChange={e=>setScen(e.target.value)}>
            <option value="">— Choose a scenario —</option>
            {mod.scenarios.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div className="s-field">
          <label className="s-label">System under attack</label>
          <select className="s-select" value={sys} onChange={e=>setSys(e.target.value)}>
            <option value="">— Choose a system —</option>
            {mod.systems.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div className="s-field">
          <label className="s-label">Threat actor</label>
          <select className="s-select" value={actor} onChange={e=>setActor(e.target.value)}>
            <option value="">— Choose a threat actor —</option>
            {mod.actors.map(a=><option key={a.value} value={a.value}>{a.label}</option>)}
          </select>
          {actor && ACTOR_TIPS[actor] && <div className="s-actor-tip">ℹ {ACTOR_TIPS[actor]}</div>}
        </div>
        <TeachCard tabKey="step2soph" teach={teach} mode="student" />
        <div className="s-field">
          <label className="s-label">Threat sophistication</label>
          <input type="range" className="s-slider" min={1} max={5} value={soph} onChange={e=>setSoph(Number(e.target.value))} />
          <div className="s-slider-labels"><span>Script Kiddie</span><span>Nation-State APT</span></div>
          <div style={{textAlign:"center",marginTop:6}}><span className="s-soph-display">{SOPH[soph]}</span></div>
        </div>
        <div className="s-btn-row">
          <button className="s-btn-ghost" onClick={()=>setWizStep(1)}>← Back</button>
          <button className="s-btn-primary" style={{flex:1}} onClick={()=>setWizStep(3)}>Choose analysis →</button>
        </div>
      </>}

      {wizStep === 3 && <>
        <TeachCard tabKey="step3" teach={teach} mode="student" />
        <div className="s-section-title">What do you want to analyze?</div>
        <div className="s-section-sub">Each artifact maps to a Bloom's taxonomy level. Select what your exercise requires.</div>
        <div className="s-artifact-list">
          {ARTIFACT_ITEMS.map(({k,label,desc,check,bloom})=>(
            <label key={k} className={"s-artifact-item"+(checks[check]?" on":"")}>
              <input type="checkbox" checked={!!checks[check]} onChange={()=>toggle(check)}/>
              <div style={{flex:1}}>
                <div className="s-artifact-name">{label}</div>
                <div className="s-artifact-desc">{desc}</div>
                <div style={{marginTop:4}}><BloomBadge level={bloom} /></div>
              </div>
            </label>
          ))}
        </div>
        <div className="s-field">
          <label className="s-label">Additional context (optional)</label>
          <textarea className="s-ta" value={extra} onChange={e=>setExtra(e.target.value)}
            placeholder="Exercise phase, specific vulnerability, anything your instructor highlighted…" />
        </div>
        <div className="s-btn-row">
          <button className="s-btn-ghost" onClick={()=>setWizStep(2)}>← Back</button>
          <button className="s-btn-primary" style={{flex:1}} disabled={loading} onClick={()=>setWizStep(3)}>
            {loading ? "Generating…" : "Continue to predictions →"}
          </button>
        </div>
      </>}
    </div>
  );
}

function Portfolio({ mod, actor, soph, predLosses, predMitre, thinkResponses, reflection, setReflection, setShowPortfolio, SOPH }) {
  const thinkLabels = {
    narrative:"Adversity chain — my description", stpa:"STPA-Sec reflection",
    diagrams:"Detection opportunity I identified", mitre:"MITRE — key technique analysis",
    req:"Requirement rewrite and verification", coa:"COA prioritization reasoning",
  };
  const portfolioText = [
    `CYB-5620V · STUDENT PORTFOLIO`, `Generated: ${new Date().toLocaleString()}`,
    `Module: ${mod.fullLabel}`, `Threat: ${actor||"Not specified"} · ${SOPH[soph]}`,
    ``, `=== MY PREDICTIONS ===`,
    `Losses: ${predLosses||"(none)"}`, `MITRE: ${predMitre||"(none)"}`, ``,
    ...Object.entries(thinkResponses).filter(([,v])=>v.trim()).map(([k,v])=>[
      `=== ${(thinkLabels[k]||k).toUpperCase()} ===`, v, ``
    ]).flat(),
    `=== MY REFLECTION ===`, reflection||"(none)",
  ].join("\n");
  return (
    <div className="s-portfolio">
      <div className="s-port-inner">
        <div className="s-port-hdr">
          <div className="s-port-title">Student Portfolio</div>
          <button className="s-port-btn s-port-close" onClick={()=>setShowPortfolio(false)}>✕ Close</button>
        </div>
        <div className="s-port-section">
          <div className="s-port-sect-title">Scenario</div>
          <div className="s-port-label">Module</div><div className="s-port-val">{mod.fullLabel}</div>
          <div className="s-port-label">Threat actor</div><div className="s-port-val">{actor||"Not specified"} — {SOPH[soph]}</div>
          <div className="s-port-label">Generated</div><div className="s-port-val">{new Date().toLocaleString()}</div>
        </div>
        <div className="s-port-section">
          <div className="s-port-sect-title">My Predictions</div>
          <div className="s-port-label">Losses I predicted</div><div className="s-port-val">{predLosses||"(none entered)"}</div>
          <div className="s-port-label">MITRE technique I expected first</div><div className="s-port-val">{predMitre||"(none entered)"}</div>
        </div>
        {Object.entries(thinkResponses).filter(([,v])=>v.trim()).length > 0 && (
          <div className="s-port-section">
            <div className="s-port-sect-title">My Analysis Responses</div>
            {Object.entries(thinkResponses).filter(([,v])=>v.trim()).map(([k,v])=>(
              <React.Fragment key={k}>
                <div className="s-port-label">{thinkLabels[k]||k}</div>
                <div className="s-port-val">{v}</div>
              </React.Fragment>
            ))}
          </div>
        )}
        <div className="s-port-section">
          <div className="s-port-sect-title">My Final Reflection</div>
          <div className="s-port-label">What did I learn? What surprised me? What would I do differently?</div>
          <textarea className="s-ta" rows={5} value={reflection}
            onChange={e=>setReflection(e.target.value)}
            placeholder="Write your overall reflection here…" />
        </div>
        <div className="s-port-actions">
          <button className="s-port-btn s-port-print" onClick={()=>window.print()}>🖨 Print / Save as PDF</button>
          <button className="s-port-btn s-port-copy" onClick={()=>navigator.clipboard.writeText(portfolioText)}>📋 Copy as text</button>
          <button className="s-port-btn s-port-close" onClick={()=>setShowPortfolio(false)}>Close</button>
        </div>
        <div className="s-port-note">To save as PDF: Print → destination → "Save as PDF".<br/>Submit this as your exercise after-action report.</div>
      </div>
    </div>
  );
}


// ── Main ──────────────────────────────────────────────────────────────────────
export default function MBSEBuilder() {
  const mermaidReady = useMermaid();
  const [darkMode, setDarkMode] = useState(false);

  // ── Phase 1: Mode & Wizard State ─────────────────────────────────────────
  const [mode, setMode]           = useState("instructor");
  const [wizStep, setWizStep]     = useState(1);
  const [predLosses, setPredLosses] = useState("");
  const [predMitre,  setPredMitre]  = useState("");
  const [predSaved, setPredSaved] = useState(false);

  // ── Phase 1: Student Learning State ──────────────────────────────────────
  const [thinkResponses, setThinkResponses] = useState({});  // {tabKey: text}
  const [thinkRevealed,  setThinkRevealed]  = useState({});  // {tabKey: bool}
  const [reflection,     setReflection]     = useState("");  // final reflection
  const [showPortfolio,  setShowPortfolio]  = useState(false);

  const setThinkText = (k, v) => setThinkResponses(r => ({...r, [k]:v}));
  const revealTab    = (k)    => setThinkRevealed(r  => ({...r, [k]:true}));

  const switchMode = (m) => {
    setMode(m);
    setWizStep(1);
    setPredSaved(false);
    setParsed(null);
    setRaw("");
    setPredLosses("");
    setPredMitre("");
    setThinkResponses({});
    setThinkRevealed({});
    setReflection("");
    setShowPortfolio(false);
  };

  const [mk, setMk] = useState("m6");
  const mod = MODULES[mk];

  const [scen,  setScen]  = useState("");
  const [sys,   setSys]   = useState("");
  const [actor, setActor] = useState("");
  const [soph,  setSoph]  = useState(4);
  const [acq,   setAcq]   = useState("");
  const [role,  setRole]  = useState("");
  const [extra, setExtra] = useState("");
  const [checks, setChecks] = useState({ usecase:true, sequence:true, bdd:true, mitre:true, req:true, coa:false, stpa:true, assurance:true });

  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("Narrative");
  const [raw, setRaw] = useState("");
  const [parsed, setParsed] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { setScen(""); setSys(""); setActor(""); setParsed(null); setRaw(""); setAcq(mod.acq); setRole(mod.role); }, [mk]);

  const toggle = k => setChecks(c => ({ ...c, [k]: !c[k] }));

  const generate = async () => {
    setLoading(true); setRaw(""); setParsed(null); setTab("Narrative");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 12000,
          messages: [{ role: "user", content: buildPrompt(mk, scen, sys, actor, soph, acq, role, extra, checks) }],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || "HTTP " + res.status);
      if (!Array.isArray(data.content)) throw new Error("Unexpected API response shape");
      const full = data.content.map(b => b.text || "").join("\n");
      setRaw(full);
      setParsed({
        narrative: extractSection(full, "SCENARIO NARRATIVE"),
        usecase:   cleanMermaid(extractSection(full, "USE CASE DIAGRAM")),
        sequence:  cleanMermaid(extractSection(full, "SEQUENCE DIAGRAM")),
        bdd:       extractSection(full, "BLOCK DEFINITION DIAGRAM"),
        mitre:     extractSection(full, "MITRE ATTACK MAPPING"),
        req:       extractSection(full, "SECURITY REQUIREMENTS"),
        coa:       extractSection(full, "COURSES OF ACTION"),
        stpa:      extractSection(full, "STPA[- ]SEC ANALYSIS"),
        assurance: extractSection(full, "ASSURANCE CASES"),
        dq:        extractSection(full, "DISCUSSION QUESTIONS"),
      });
    } catch (e) { setRaw("ERROR: " + e.message); setParsed({ error: e.message }); }
    finally { setLoading(false); }
  };

  const copy = txt => { navigator.clipboard.writeText(txt || raw); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  // ── Renderers ───────────────────────────────────────────────────────────────
  const rNarrative = () => {
    if (!parsed) return <PH t="Select module · Configure · Click GENERATE" />;
    if (parsed.error) return <div style={{ color:"#ff4444", padding:13, fontFamily:"'Share Tech Mono',monospace", fontSize:12 }}>ERROR: {parsed.error}</div>;
    return (
      <div style={{ padding:13 }}>
        <TeachCard tabKey="narrative" teach={TEACH} mode={mode} />
        <ThinkBox tabKey="narrative" teach={TEACH} mode={mode} thinkResponses={thinkResponses} setThinkText={setThinkText} thinkRevealed={thinkRevealed} revealTab={revealTab} darkMode={darkMode} />
        {(mode==="instructor" || thinkRevealed["narrative"] || !TEACH["narrative"]?.think) && <>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, color:mod.color, letterSpacing:2, marginBottom:8 }}>▸ {mod.fullLabel.toUpperCase()}</div>
          <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:15, lineHeight:1.8 }}>
            {(parsed.narrative||"").split("\n\n").map((p,i)=><p key={i} style={{marginBottom:11}}>{p}</p>)}
          </div>
          {parsed.dq && <div style={{ marginTop:14, paddingTop:12, borderTop:"1px solid #0f3a5c" }}>
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, color:"#ff6b35", letterSpacing:2, marginBottom:7 }}>▸ DISCUSSION QUESTIONS</div>
            <div style={{ fontSize:14, color:darkMode?"#4a7a99":"#334155", whiteSpace:"pre-wrap", lineHeight:1.8, fontFamily:"'Rajdhani',sans-serif" }}>{parsed.dq}</div>
          </div>}
        </>}
      </div>
    );
  };

  const rStpa = () => {
    if (!parsed||parsed.error) return <PH t="Generate a scenario first" />;
    if (!parsed.stpa||parsed.stpa==="SKIP") return <PH t="STPA-Sec not selected" />;
    return (
      <div style={{ padding:13 }}>
        <TeachCard tabKey="stpa" teach={TEACH} mode={mode} />
        <ThinkBox tabKey="stpa" teach={TEACH} mode={mode} thinkResponses={thinkResponses} setThinkText={setThinkText} thinkRevealed={thinkRevealed} revealTab={revealTab} darkMode={darkMode} />
        {(mode==="instructor" || thinkRevealed["stpa"] || !TEACH["stpa"]?.think) && <>
          <div className="st">▸ STPA-SEC CONTROL STRUCTURE ANALYSIS</div>
          <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:darkMode?"#4a7a99":"#334155", marginBottom:10 }}>// {mod.fullLabel} · CRRM Methodology //</div>
          <pre style={{ background:darkMode?"rgba(0,212,255,0.02)":"rgba(3,105,161,0.04)", border:"1px solid "+(darkMode?"#0f3a5c":"#94a3b8"), borderRadius:3, padding:12, fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:darkMode?"#c8dde8":"#0f172a", whiteSpace:"pre-wrap", lineHeight:1.8 }}>{parsed.stpa}</pre>
        </>}
      </div>
    );
  };

  const rDiagrams = () => {
    if (!parsed||parsed.error) return <PH t="Generate a scenario first" />;
    if (!mermaidReady) return <PH t="Loading Mermaid renderer..." />;
    const diags = [
      parsed.usecase  && parsed.usecase!=="SKIP"  && { code:parsed.usecase,  title:"Use Case Diagram" },
      parsed.sequence && parsed.sequence!=="SKIP" && { code:parsed.sequence, title:"Attack Sequence Diagram" },
    ].filter(Boolean);
    const hasBdd = parsed.bdd && parsed.bdd!=="SKIP";
    if (!diags.length && !hasBdd) return <PH t="No diagrams selected" />;
    return (
      <div style={{ padding:13 }}>
        <TeachCard tabKey="diagrams" teach={TEACH} mode={mode} />
        <ThinkBox tabKey="diagrams" teach={TEACH} mode={mode} thinkResponses={thinkResponses} setThinkText={setThinkText} thinkRevealed={thinkRevealed} revealTab={revealTab} darkMode={darkMode} />
        {(mode==="instructor" || thinkRevealed["diagrams"] || !TEACH["diagrams"]?.think) && <>
          <div style={{ background:"rgba(57,255,20,0.05)", border:"1px solid rgba(57,255,20,0.2)", borderRadius:3, padding:"6px 11px", marginBottom:12, fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:"#86efac", lineHeight:1.8 }}>
            ▸ Right-click diagram → Copy Image → paste into PowerPoint / Word&nbsp;&nbsp;|&nbsp;&nbsp;↓ SVG → Chrome → Print → PDF for crisp vector quality
          </div>
          {diags.map((d,i) => <MermaidDiagram key={i} code={d.code} title={d.title} />)}
          {hasBdd && <div style={{ background:darkMode?"rgba(0,212,255,0.02)":"rgba(3,105,161,0.04)", border:"1px solid "+(darkMode?"#0f3a5c":"#94a3b8"), borderRadius:3, padding:12 }}>
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, color:"#ff6b35", letterSpacing:2, marginBottom:7 }}>▸ BLOCK DEFINITION DIAGRAM (ASCII / SysML)</div>
            <pre style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:"#39ff14", whiteSpace:"pre", overflowX:"auto", lineHeight:1.6 }}>{parsed.bdd}</pre>
          </div>}
        </>}
      </div>
    );
  };

  const rMitre = () => {
    if (!parsed||parsed.error) return <PH t="Generate a scenario first" />;
    if (!parsed.mitre||parsed.mitre==="SKIP") return <PH t="MITRE mapping not selected" />;
    const sevMap = { initial:"h", execution:"h", persistence:"m", lateral:"m", exfil:"h", impact:"h", command:"m", discovery:"l", collection:"l", inhibit:"h", impair:"h" };
    const lines = parsed.mitre.split("\n").filter(l => l.includes("|"));
    return (
      <div style={{ padding:13 }}>
        <TeachCard tabKey="mitre" teach={TEACH} mode={mode} />
        <ThinkBox tabKey="mitre" teach={TEACH} mode={mode} thinkResponses={thinkResponses} setThinkText={setThinkText} thinkRevealed={thinkRevealed} revealTab={revealTab} darkMode={darkMode} />
        {(mode==="instructor" || thinkRevealed["mitre"] || !TEACH["mitre"]?.think) && <>
          <div className="st">▸ MITRE ATT&CK — {mod.label.toUpperCase()}</div>
          <table className="tbl">
            <thead><tr><th>Tactic</th><th>ID</th><th>Technique</th><th>Application</th></tr></thead>
            <tbody>
              {lines.map((line,i)=>{
                const cols = line.split("|").map(c=>c.trim()).filter(Boolean);
                if (cols.length < 3) return null;
                const sev = Object.entries(sevMap).find(([k])=>(cols[0]||"").toLowerCase().includes(k))?.[1]||"l";
                return <tr key={i}><td>{cols[0]}</td><td><span className={"b"+sev}>{cols[1]}</span></td><td>{cols[2]}</td><td style={{color:darkMode?"#4a7a99":"#334155",fontSize:11}}>{cols[3]||""}</td></tr>;
              })}
            </tbody>
          </table>
          <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:darkMode?"#4a7a99":"#334155", marginTop:8 }}>// Import IDs into attack.mitre.org/navigator | Use ICS matrix for OT scenarios //</p>
        </>}
      </div>
    );
  };

  const rReqs = () => {
    if (!parsed||parsed.error) return <PH t="Generate a scenario first" />;
    if (!parsed.req||parsed.req==="SKIP") return <PH t="Security Requirements not selected" />;
    return (
      <div style={{ padding:13 }}>
        <TeachCard tabKey="req" teach={TEACH} mode={mode} />
        <ThinkBox tabKey="req" teach={TEACH} mode={mode} thinkResponses={thinkResponses} setThinkText={setThinkText} thinkRevealed={thinkRevealed} revealTab={revealTab} darkMode={darkMode} />
        {(mode==="instructor" || thinkRevealed["req"] || !TEACH["req"]?.think) && <>
          <div className="st">▸ SECURITY REQUIREMENTS — {mod.label.toUpperCase()}</div>
          <pre style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:darkMode?"#c8dde8":"#0f172a", whiteSpace:"pre-wrap", lineHeight:1.8 }}>{parsed.req}</pre>
        </>}
      </div>
    );
  };

  const rCoa = () => {
    if (!parsed||parsed.error) return <PH t="Generate a scenario first" />;
    if (!parsed.coa||parsed.coa==="SKIP") return <PH t="Courses of Action not selected" />;
    return (
      <div style={{ padding:13 }}>
        <TeachCard tabKey="coa" teach={TEACH} mode={mode} />
        <ThinkBox tabKey="coa" teach={TEACH} mode={mode} thinkResponses={thinkResponses} setThinkText={setThinkText} thinkRevealed={thinkRevealed} revealTab={revealTab} darkMode={darkMode} />
        {(mode==="instructor" || thinkRevealed["coa"] || !TEACH["coa"]?.think) && <>
          <div className="st" style={{color:"#ff6b35"}}>▸ COURSES OF ACTION — {mod.label.toUpperCase()}</div>
          <pre style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:darkMode?"#c8dde8":"#0f172a", whiteSpace:"pre-wrap", lineHeight:1.8 }}>{parsed.coa}</pre>
        </>}
      </div>
    );
  };

  const rAssurance = () => {
    if (!parsed||parsed.error) return <PH t="Generate a scenario first" />;
    if (!parsed.assurance||parsed.assurance==="SKIP") return <PH t="Assurance Cases not selected" />;
    return (
      <div style={{ padding:13 }}>
        <div className="st" style={{color:"#a78bfa"}}>▸ CRRM ASSURANCE CASES — {mod.label.toUpperCase()}</div>
        <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:darkMode?"#4a7a99":"#334155", marginBottom:10 }}>
          // Claim → Evidence → Argument → SHALL Requirement · Reduces Loss Scenario Likelihood //
        </div>
        <pre style={{ background:darkMode?"rgba(167,139,250,0.04)":"rgba(91,52,128,0.04)", border:"1px solid "+(darkMode?"rgba(167,139,250,0.2)":"rgba(91,52,128,0.2)"), borderRadius:3, padding:12, fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:darkMode?"#c8dde8":"#0f172a", whiteSpace:"pre-wrap", lineHeight:1.9 }}>{parsed.assurance}</pre>
      </div>
    );
  };

  const rRaw = () => (
    <>
      <div className="cr"><button className="cb" onClick={()=>copy(raw)}>{copied?"[ COPIED! ]":"[ COPY RAW ]"}</button></div>
      <div style={{ padding:13, fontFamily:"'Share Tech Mono',monospace", fontSize:11, whiteSpace:"pre-wrap", lineHeight:1.8, maxHeight:"55vh", overflowY:"auto" }}>
        {raw||<PH t="Raw output will appear here" />}
      </div>
    </>
  );

  const renderers = { "Narrative":rNarrative, "STPA-Sec":rStpa, "Assurance Cases":rAssurance, "Diagrams":rDiagrams, "MITRE Matrix":rMitre, "Requirements":rReqs, "Courses of Action":rCoa, "Raw":rRaw };

  // ── Phase 1: Student Wizard ───────────────────────────────────────────────

  const ACTOR_TIPS = {
    fancy_bear:"APT28 / Sofacy — Russian GRU, ops since 2008, XAgent implant, spearphish+credential harvest",
    cozy_bear:"APT29 — Russian SVR, stealthy long-dwell, supply chain focus",
    sandworm:"Sandworm — Russian GRU Unit 74455, Industroyer/BlackEnergy, power grid specialist",
    prc_apt:"PRC Nation-State — pre-positioning in defense/critical infrastructure for future conflict",
    criminal_rw:"Criminal Ransomware — financially motivated, DarkSide/REvil-style, disruption for payment",
    nation_cpi:"Nation-state targeting Critical Program Information / IP theft from defense contractors",
    insider_contr:"Malicious insider with privileged access — hardest to detect, highest trust exploitation",
    supply_chain_a:"Hardware/software supply chain compromise — Trojaned components, firmware implants",
    fancy_bear_acq:"APT28 targeting acquisition systems — contract data, SRDs, technical architecture docs",
    apt_inject:"APT using injection — SQL, command, protocol injection against control interfaces",
    apt_spoof:"APT using spoofing — GPS, sensor data, identity/credential spoofing",
    apt_dos:"APT Denial of Service — availability attacks on control or comms infrastructure",
    apt_tamper:"APT tampering/intercepting — MITM, data manipulation, command interception",
    apt_disclose:"APT exfiltrating — sensor data, algorithms, operational patterns, classification models",
    fancy_bear_pipe:"APT28 with XAgent on SCADA — authenticated access, persistent implant, OT knowledge",
    criminal_colonial:"Criminal ransomware Colonial Pipeline-style — encrypt IT, OT collateral disruption",
    nation_ics:"Nation-state ICS specialist — deep OT protocol knowledge, physical effect capability",
    nation_sf:"Nation-state APT targeting Silverfish — C2 injection, sensor manipulation capability",
    insider_maint:"Malicious maintenance tech — physical access, firmware modification, hardware implant",
    criminal_sf:"Organized criminal — extortion, disruption of denial mission for adversary benefit",
    nation_sdad:"Nation-state targeting SDAD — multi-vector simultaneous attack on Sentinel + C2",
    multi_vector:"Coordinated multi-vector — GPS + C2 + Sensor simultaneous, overwhelm defenses",
    insider_sdad:"SDAD insider — knowledge of Sentinel profiles, can disable detection before attack",
    opfor_gavin:"OPFOR Red Team — CTT adversary role, finding GAVIN vulnerabilities for assignment",
    nation_ew:"Nation-state with EW — jamming, spoofing, signal exploitation against UAV datalinks",
    enemy_armored:"Enemy armored vehicle — detect and kinetically attack GAVIN during laser designation",
    supply_gavin:"Supply chain/insider — hardware trojan in GAVIN laser or comms subsystem",
  };

  // Color tokens for inline JSX use
  const _accent   = darkMode ? "#00d4ff" : "#0369a1";
  const _txtMuted = darkMode ? "#4a7a99" : "#334155";
  const _txt      = darkMode ? "#c8dde8" : "#0f172a";
  const _border   = darkMode ? "#0f3a5c" : "#94a3b8";
  const _bgInner  = darkMode ? "#070f1a" : "#ffffff";
  const _bgInput  = darkMode ? "rgba(0,212,255,0.04)" : "rgba(0,0,0,0.04)";
  const _bgMod    = darkMode ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.04)";

  const wizStepEl = (n, labels) => {
    const cls = ["wiz-step", wizStep === n ? "active" : wizStep > n ? "done" : ""].filter(Boolean).join(" ");
    return (
      <React.Fragment key={n}>
        {n > 1 && <div className="wiz-div"/>}
        <div className={cls}>
          <div className="wiz-num">{wizStep > n ? "✓" : n}</div>
          <span>{labels[n-1]}</span>
        </div>
      </React.Fragment>
    );
  };

  // ── Teaching cards — grounded in actual CYB-5620V slide content ──────────
  const TEACH = {
    step1: {
      bloom: "remember",
      title: "Why module selection matters",
      body: `In CYB-5620V, each module builds on the CRRM process — Cyber Resilient Risk Management. The module you pick determines which <b>real system</b> you'll analyze, which <b>threats</b> are relevant, and which <b>STPA-Sec methodology</b> applies. Day 1 modules (M2–M5) focus on threats and policy. Day 2 (M6–M8) apply full CRRM to actual weapon systems. Pick the one your class is currently covering.`,
    },
    step2actor: {
      bloom: "understand",
      title: "Understanding threat actors",
      body: `The threat actor defines <b>how</b> the attack happens. Per Module 2, threats range from Tier 1 (opportunistic) to Tier 5 (nation-state with zero-day capability and OT-specific tools). APT28/Fancy Bear has operated since 2008, uses the XAgent implant, and has demonstrated capability against ICS/OT systems. The actor you choose shapes the entire STPA-Sec adversity chain: adversary action → HCA → hazard → loss.`,
    },
    step2soph: {
      bloom: "understand",
      title: "What the sophistication scale means",
      body: `From the Module 2 slides: Tier 1 uses publicly available tools and basic techniques. Tier 4 (APT level) conducts persistent multi-phase campaigns, exploits zero-days, and has OT-specific knowledge. Tier 5 is nation-state — co-evolving, capable of custom malware like Stuxnet or Industroyer. <b>Higher sophistication means fewer detection opportunities and longer dwell time</b> — this directly affects how you design your Loss Scenarios.`,
    },
    step3: {
      bloom: "apply",
      title: "How each artifact maps to CRRM",
      body: `CRRM (from Module 4) is a three-step process — Hazard Analysis → Loss Scenario Assessment → Assurance Cases. Each artifact you select corresponds to a step. <b>STPA-Sec</b> is the analytical core. <b>MITRE ATT&CK</b> maps adversary TTPs. <b>Security Requirements</b> close the loop to acquisition policy and DoDI compliance. Each artifact also maps to a Bloom's taxonomy level — shown below.`,
      svg: "crrm",
    },
    narrative: {
      bloom: "understand",
      title: "How to read the adversity chain",
      body: `The narrative shows you the <b>adversity chain</b>: how an adversary moves from initial access through the control structure to mission impact. As you read, look for four things: (1) the initial access vector — how did they get in? (2) the pivot — how did they move from IT to OT/C2? (3) the control action affected — ENGAGE, HALT, or sensor data? (4) the mission loss — fratricide, denial failure, or data exfil? This chain is exactly what STPA-Sec is designed to surface before the adversary exploits it.`,
      think: `In your own words, describe the adversary's path from initial access to mission impact. What was the single weakest link in the control structure, and why?`,
      svg: "control",
    },
    stpa: {
      bloom: "analyze",
      title: "What you're looking at — STPA-Sec",
      body: `STPA-Sec asks: <b>what system states lead to unacceptable losses?</b> The five elements build on each other in sequence. <b>Losses</b> (L-statements) are mission-level outcomes the system must prevent. <b>Hazards</b> are system states that lead to losses. <b>Control Structure</b> maps who commands whom — Operator → C2 → UGV → Physical Domain. <b>Hazardous Control Actions</b> (HCAs) identify the 4 failure modes per control command. <b>Loss Scenarios</b> trace the full adversary chain.`,
      think: `Compare the AI's loss list to what you predicted before generating. Which L-statement surprised you most? Which of the 4 HCA types — provided when shouldn't, not provided when should, wrong timing, or wrong duration — is hardest to detect in an operational system, and why?`,
      svg: "stpa_chain",
    },
    diagrams: {
      bloom: "understand",
      title: "How to read MBSE artifacts",
      body: `These are <b>Model-Based Systems Engineering (MBSE)</b> artifacts — the same type your team would deliver in Cameo Systems Modeler under DoDI 5000.90. The <b>Use Case Diagram</b> shows actors and system functions — look for where the attacker intercepts the operator's actions. The <b>Sequence Diagram</b> shows the attack timeline — each arrow is a control action or feedback signal. The <b>BDD</b> shows system blocks and security interfaces. Right-click any diagram → Copy Image → paste into PowerPoint or your Cameo model.`,
      think: `In the sequence diagram, at which specific step could the attack have been detected or stopped earliest? What control action or feedback signal would have flagged the anomaly?`,
    },
    mitre: {
      bloom: "apply",
      title: "MITRE ATT&CK — two matrices",
      body: `MITRE ATT&CK has two matrices relevant to this course: <b>Enterprise</b> (IT — initial access, credential theft, lateral movement) and <b>ICS</b> (OT — modify parameter, inhibit response function, damage to property). Nation-state actors against DoD systems bridge both: Enterprise techniques gain access, ICS techniques cause physical effect. These technique IDs map directly to NSA/CISA alerts and DoD red team playbooks — and each one is a threat your Assurance Cases and SHALL requirements must address.`,
      think: `Pick the MITRE technique that had the highest mission impact in this scenario. How would you write a single, specific, verifiable SHALL requirement that directly addresses it?`,
    },
    req: {
      bloom: "evaluate",
      title: "From analysis to contract — security requirements",
      body: `Security requirements are how STPA-Sec analysis becomes <b>contractually enforceable</b>. Under DoDI 5000.90 and SEP Section 3.2.11, these SHALL statements go into the System Requirements Document (SRD) and the contractor's SOW. Each requirement traces to a NIST 800-53 control and a DoDI reference — that's the traceability chain from engineering analysis to acquisition policy. <b>A good requirement is specific, verifiable, and technically grounded</b>: not "the system shall be secure," but "the system SHALL authenticate every ENGAGE command using mutual TLS with ECDSA-signed tokens, rejecting any unsigned command with an operator alert."`,
      think: `Choose one requirement from this list. Rewrite it in your own words — make it more specific if you can. Then identify: (1) how you would verify it in a test event, and (2) which specific STPA-Sec hazard it directly mitigates.`,
    },
    coa: {
      bloom: "evaluate",
      title: "Courses of action — SCRE resilience techniques",
      body: `COAs in SCRE aren't just mitigations — they're <b>resilience techniques</b> from the FOREST framework: Sense → Isolate → Options → Evaluate → Readiness → Execute → Self-test. The Sentinel Pattern (Module 4) is a mission-aware detection system that monitors the control structure for anomalous HCAs. When you evaluate COAs, ask two questions: does this <b>reduce the likelihood</b> of the loss scenario (Assurance Case approach), or does it <b>reduce the consequence</b> once an HCA occurs (Sentinel/FOREST approach)? The strongest defenses address both.`,
      think: `Which COA from this list would have the most impact on Loss Scenario LS-1 in this analysis? What single acquisition constraint — cost, schedule, or technical maturity — would be most likely to prevent you from implementing it under an MTA rapid acquisition program?`,
    },
    assurance: {
      bloom: "evaluate",
      title: "Assurance Cases — closing the CRRM loop",
      body: `Assurance Cases are the third and final step of CRRM, following Hazard Analysis and Loss Scenario Assessment. Each case makes a <b>verifiable claim</b> that a specific security property holds, backs it with <b>evidence</b> (test results, inspections, analysis), connects them through an <b>argument</b>, and closes with a traceable <b>SHALL requirement</b>. Per Module 6 (ELO.15.E), Assurance Cases are the primary mechanism for <em>reducing the likelihood</em> of Loss Scenarios — they are not optional documentation, they are engineering artifacts that reduce program risk. Under DoDI 5000.80 (MTA), they must be verified by the Government LSE at each milestone.`,
      think: `Look at AC-1. Is the Claim specific enough to be tested? Could you verify the Evidence items in an actual test event? If you were the Government LSE reviewing this at a milestone, what additional evidence would you require before approving the claim?`,
    }
  };


  // ── Student mode render helpers ──────────────────────────────────────────
  const studentRenderTab = (tabKey, rendered) => {
    if (mode !== "student") return rendered;
    return (
      <div className="s-tab-content">
        <TeachCard tabKey={tabKey} teach={TEACH} mode={mode} />
        <ThinkBox tabKey={tabKey} teach={TEACH} mode={mode}
          thinkResponses={thinkResponses} setThinkText={setThinkText}
          thinkRevealed={thinkRevealed} revealTab={revealTab} />
        {(thinkRevealed[tabKey] || !TEACH[tabKey]?.think) && rendered}
      </div>
    );
  };

  // ── Student mode output tabs ──────────────────────────────────────────────
  const sRenderers = {
    "Narrative": () => studentRenderTab("narrative", (() => {
      if (!parsed) return <PH t="Generate a scenario to begin" />;
      if (parsed.error) return <div className="s-err">Error: {parsed.error}</div>;
      return (
        <div className="s-narrative">
          <div style={{fontFamily:"Georgia,serif",fontSize:13,fontWeight:700,color:mod.color,marginBottom:10}}>{mod.fullLabel}</div>
          {(parsed.narrative||"").split("\n\n").map((p,i)=><p key={i}>{p}</p>)}
          {parsed.dq && <div className="s-dq-section"><div className="s-dq-title">Discussion Questions</div><div style={{fontSize:14,color:"#4A5E72",lineHeight:1.8,whiteSpace:"pre-wrap"}}>{parsed.dq}</div></div>}
        </div>
      );
    })()),
    "STPA-Sec": () => studentRenderTab("stpa", (() => {
      if (!parsed||parsed.error) return <PH t="Generate a scenario first" />;
      if (!parsed.stpa||parsed.stpa==="SKIP") return <PH t="STPA-Sec not selected" />;
      return <pre className="s-pre">{parsed.stpa}</pre>;
    })()),
    "Assurance Cases": () => studentRenderTab("assurance", (() => {
      if (!parsed||parsed.error) return <PH t="Generate a scenario first" />;
      if (!parsed.assurance||parsed.assurance==="SKIP") return <PH t="Assurance Cases not selected" />;
      return (
        <div>
          <div style={{background:"#F3EEF8",border:"1px solid #D9C5EE",borderRadius:5,padding:"8px 14px",marginBottom:14,fontSize:13,color:"#5B3480",lineHeight:1.7}}>
            Each Assurance Case follows the CRRM structure: <b>Claim → Evidence → Argument → SHALL Requirement</b>. Together they close the loop from STPA-Sec analysis to contractually enforceable security requirements.
          </div>
          <pre className="s-pre">{parsed.assurance}</pre>
        </div>
      );
    })()),
    "Diagrams": () => studentRenderTab("diagrams", (() => {
      if (!parsed||parsed.error) return <PH t="Generate a scenario first" />;
      if (!mermaidReady) return <PH t="Loading diagram renderer…" />;
      const diags = [
        parsed.usecase&&parsed.usecase!=="SKIP"&&{code:parsed.usecase,title:"Use Case Diagram"},
        parsed.sequence&&parsed.sequence!=="SKIP"&&{code:parsed.sequence,title:"Attack Sequence Diagram"},
      ].filter(Boolean);
      const hasBdd = parsed.bdd&&parsed.bdd!=="SKIP";
      if (!diags.length&&!hasBdd) return <PH t="No diagrams selected" />;
      return <div>
        <div className="s-warn-tip">Right-click a diagram → Copy Image → paste into PowerPoint or Word.</div>
        {diags.map((d,i)=><MermaidDiagram key={i} code={d.code} title={d.title} />)}
        {hasBdd&&<div className="s-diagram-card"><div className="s-diagram-label">Block Definition Diagram (SysML)</div><pre className="s-pre" style={{margin:0}}>{parsed.bdd}</pre></div>}
      </div>;
    })()),
    "MITRE Matrix": () => studentRenderTab("mitre", (() => {
      if (!parsed||parsed.error) return <PH t="Generate a scenario first" />;
      if (!parsed.mitre||parsed.mitre==="SKIP") return <PH t="MITRE mapping not selected" />;
      const sevMap={initial:"h",execution:"h",persistence:"m",lateral:"m",exfil:"h",impact:"h",command:"m",discovery:"l",collection:"l",inhibit:"h",impair:"h"};
      const lines=parsed.mitre.split("\n").filter(l=>l.includes("|"));
      return <div>
        <table className="s-table">
          <thead><tr><th>Tactic</th><th>ID</th><th>Technique</th><th>Application</th></tr></thead>
          <tbody>{lines.map((line,i)=>{
            const cols=line.split("|").map(c=>c.trim()).filter(Boolean);
            if(cols.length<3)return null;
            const sev=Object.entries(sevMap).find(([k])=>(cols[0]||"").toLowerCase().includes(k))?.[1]||"l";
            return <tr key={i}><td>{cols[0]}</td><td><span className={"s-badge-"+sev}>{cols[1]}</span></td><td>{cols[2]}</td><td style={{color:"#4A5E72",fontSize:12}}>{cols[3]||""}</td></tr>;
          })}</tbody>
        </table>
        <div style={{fontSize:12,color:"#7EA8C4",marginTop:8}}>Import IDs into attack.mitre.org/navigator · Use ICS matrix for OT scenarios</div>
      </div>;
    })()),
    "Requirements": () => studentRenderTab("req", (() => {
      if (!parsed||parsed.error) return <PH t="Generate a scenario first" />;
      if (!parsed.req||parsed.req==="SKIP") return <PH t="Requirements not selected" />;
      return <pre className="s-pre">{parsed.req}</pre>;
    })()),
    "Courses of Action": () => studentRenderTab("coa", (() => {
      if (!parsed||parsed.error) return <PH t="Generate a scenario first" />;
      if (!parsed.coa||parsed.coa==="SKIP") return <PH t="Courses of Action not selected" />;
      return <pre className="s-pre">{parsed.coa}</pre>;
    })()),
    "Raw": () => <div className="s-tab-content"><pre className="s-pre" style={{maxHeight:"50vh",overflowY:"auto"}}>{raw||"Raw output will appear here"}</pre></div>,
  };

  if (mode === "student") {
    const stepProgress = (n) => {
      const cls = ["s-prog-step", wizStep===n?"active":wizStep>n?"done":""].filter(Boolean).join(" ");
      return (
        <React.Fragment key={n}>
          {n>1&&<div className={`s-prog-line${wizStep>n?" done":""}`}/>}
          <div className={cls}>
            <div className="s-prog-num">{wizStep>n?"✓":n}</div>
            <span>{["Mission","Threat","Analyze"][n-1]}</span>
          </div>
        </React.Fragment>
      );
    };

    return (
      <>
        <style>{studentCss}</style>
        {showPortfolio && <Portfolio mod={mod} actor={actor} soph={soph} predLosses={predLosses} predMitre={predMitre} thinkResponses={thinkResponses} reflection={reflection} setReflection={setReflection} setShowPortfolio={setShowPortfolio} SOPH={SOPH} />}
        <div className="s-root">
          {/* Header */}
          <div className="s-hdr">
            <div className="s-hdr-left">
              <div className="s-course-label">CYB-5620V · War-U / DAU</div>
              <div className="s-title">MBSE <em>Cyber</em> Scenario Builder</div>
            </div>
            <div className="s-hdr-right">
              <div className="s-mode-bar">
                <button className="s-mode-btn" onClick={()=>switchMode("instructor")}>Instructor</button>
                <button className="s-mode-btn on">Student</button>
              </div>
              <button className="s-theme-btn" onClick={()=>setDarkMode(d=>!d)}>{darkMode?"☀":"☾"}</button>
            </div>
          </div>

          {/* Progress bar */}
          {!parsed && <div className="s-progress">{[1,2,3].map(n=>stepProgress(n))}</div>}

          {/* Page */}
          <div className="s-page">

            {/* Config wizard (steps 1-3, before generate) */}
            {!parsed && !loading && (
              <StudentWizard wizStep={wizStep} setWizStep={setWizStep} mk={mk} setMk={setMk}
                mod={mod} scen={scen} setScen={setScen} sys={sys} setSys={setSys}
                actor={actor} setActor={setActor} soph={soph} setSoph={setSoph}
                extra={extra} setExtra={setExtra} checks={checks} toggle={toggle}
                loading={loading} teach={TEACH} ACTOR_TIPS={ACTOR_TIPS} MODULES={MODULES} SOPH={SOPH} />
            )}

            {/* Loading */}
            {loading && (
              <div className="s-loading">
                <div className="s-loading-spinner"/>
                <div className="s-loading-text">Building your scenario analysis…</div>
                <div className="s-loading-sub">Claude is generating all selected artifacts — usually 1–2 minutes</div>
              </div>
            )}

            {/* Predict panel — shown on step 3 before generate */}
            {wizStep === 3 && !parsed && !loading && (
              <>
                <div className="s-divider"/>
                <PredictPanel predLosses={predLosses} setPredLosses={setPredLosses}
                  predMitre={predMitre} setPredMitre={setPredMitre}
                  predSaved={predSaved} setPredSaved={setPredSaved}
                  loading={loading} onGenerate={generate} />
              </>
            )}

            {/* Output tabs — full width single column */}
            {parsed && !loading && (
              <>
                {predSaved && (
                  <PredictPanel predLosses={predLosses} setPredLosses={setPredLosses}
                    predMitre={predMitre} setPredMitre={setPredMitre}
                    predSaved={predSaved} setPredSaved={setPredSaved}
                    loading={loading} onGenerate={generate} />
                )}
                <div className="s-out-wrap">
                  <div className="s-tabs">
                    {TABS.map(t=>(
                      <button key={t} className={"s-tab"+(tab===t?" on":"")} onClick={()=>setTab(t)}>{t}</button>
                    ))}
                  </div>
                  {sRenderers[tab]?.()}
                </div>
                <div className="s-divider"/>
                <div className="s-btn-row">
                  <button className="s-btn-primary" style={{flex:2}} onClick={()=>setShowPortfolio(true)}>
                    📋 View & save portfolio
                  </button>
                  <button className="s-btn-secondary" onClick={()=>{
                    setParsed(null); setRaw(""); setPredSaved(false);
                    setPredLosses(""); setPredMitre("");
                    setThinkResponses({}); setThinkRevealed({});
                    setReflection(""); setWizStep(1); setTab("Narrative");
                  }}>New scenario</button>
                  <button className="s-btn-ghost" onClick={()=>setWizStep(2)}>← Change parameters</button>
                </div>
              </>
            )}

          </div>
        </div>
      </>
    );
  }

  // ── Instructor mode render (unchanged) ───────────────────────────────────
  return (
    <>
      <style>{buildCss(darkMode)}</style>
      {showPortfolio && <Portfolio mod={mod} actor={actor} soph={soph} predLosses={predLosses} predMitre={predMitre} thinkResponses={thinkResponses} reflection={reflection} setReflection={setReflection} setShowPortfolio={setShowPortfolio} SOPH={SOPH} />}
      <div className="r">
        <div className="inner">
          <div className="hdr">
            <div className="ey">◈ CYB-5620V · SECURE CYBER RESILIENT ENGINEERING · WAR-U ◈</div>
            <div className="ttl">MBSE <span>Cyber</span> Scenario Builder</div>
            <div className="sub">// M2: Threats · M3: Policy · M4: Approaches · M5: Pipeline · M6: Silverfish · M7: SDAD · M8: GAVIN //</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginTop:8,flexWrap:"wrap"}}>
              <div className="mode-bar">
                <button className={"mode-btn on"}>◈ Instructor</button>
                <button className="mode-btn" onClick={()=>switchMode("student")}>◉ Student</button>
              </div>
              <button className="theme-btn" onClick={()=>setDarkMode(d=>!d)}>{darkMode?"☀ LIGHT":"☾ DARK"}</button>
            </div>
          </div>
          <div className="mod-bar">
            {Object.entries(MODULES).map(([key,m]) => (
              <button key={key} className={"mb"+(mk===key?" on":"")} style={{"--c":m.color}}
                onClick={()=>setMk(key)} title={m.fullLabel}>{m.label}</button>
            ))}
          </div>
          <div className="grid">
            <div className="panel" style={{borderTop:`2px solid ${mod.color}`}}>
              <div className="ph"><div className="dot" style={{background:mod.color,boxShadow:`0 0 6px ${mod.color}`}}/><div className="pt" style={{color:mod.color}}>{mod.label}</div></div>
              <div className="pb">
                <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:darkMode?"#4a7a99":"#64748b",lineHeight:1.6,marginBottom:8,padding:"5px 7px",background:darkMode?"rgba(0,0,0,0.2)":"rgba(0,0,0,0.04)",borderRadius:2}}>{mod.day} · {mod.focus}</div>
                <label className="lbl">Scenario</label>
                <select value={scen} onChange={e=>setScen(e.target.value)}>
                  <option value="">— Select Scenario —</option>
                  {mod.scenarios.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <label className="lbl">System Under Analysis</label>
                <select value={sys} onChange={e=>setSys(e.target.value)}>
                  <option value="">— Select System —</option>
                  {mod.systems.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <label className="lbl">Threat Actor</label>
                <select value={actor} onChange={e=>setActor(e.target.value)}>
                  <option value="">— Select Actor —</option>
                  {mod.actors.map(a=><option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
                <label className="lbl">Acquisition Pathway</label>
                <select value={acq} onChange={e=>setAcq(e.target.value)}>
                  {ACQ_PATHWAYS.map(a=><option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
                <label className="lbl">Analyst Role</label>
                <select value={role} onChange={e=>setRole(e.target.value)}>
                  {ROLES.map(r=><option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
                <label className="lbl">Threat Tier</label>
                <input type="range" min={1} max={5} value={soph} onChange={e=>setSoph(Number(e.target.value))} />
                <div className="sl"><span>T1 OPPORTUNISTIC</span><span>T4 APT</span><span>T5 NATION-STATE</span></div>
                <label className="lbl">MBSE Artifacts</label>
                <div className="cks">
                  {[["usecase","Use Case Diagram (Mermaid)"],["sequence","Attack Sequence Diagram"],["bdd","Block Definition Diagram (BDD)"],["mitre","MITRE ATT&CK Mapping"],["req","Security Requirements"],["coa","Courses of Action"],["stpa","STPA-Sec Analysis"],["assurance","Assurance Cases (CRRM)"]].map(([k,lbl])=>(
                    <label key={k} className="ck"><input type="checkbox" checked={checks[k]} onChange={()=>toggle(k)}/><span>{lbl}</span></label>
                  ))}
                </div>
                <label className="lbl">Context / Notes</label>
                <textarea className="ta" value={extra} onChange={e=>setExtra(e.target.value)} placeholder="Exercise phase, specific CVE, protocol, student context..." />
                <button className="gbtn" disabled={loading} onClick={generate} style={{borderColor:mod.color,color:mod.color}}>
                  {loading ? "⬡ Generating..." : "⬡ Generate Scenario"}
                </button>
              </div>
            </div>
            <div className="panel out" style={{borderTop:`2px solid ${mod.color}`}}>
              {loading && <div className="lb"/>}
              <div className="tabs">
                {TABS.map(t=><button key={t} className={"tab"+(tab===t?" on":"")} onClick={()=>setTab(t)}>{t}</button>)}
              </div>
              <div className="tbody" style={{padding:0}}>{renderers[tab]?.()}</div>
            </div>
          </div>
          <div className="ftr">
            CYB-5620V SECURE CYBER RESILIENT ENGINEERING · MBSE SCENARIO BUILDER · POWERED BY CLAUDE AI<br/>
            M2–M8 · Diagrams via Mermaid · Right-click → Copy Image → PowerPoint / Word
          </div>
        </div>
      </div>
    </>
  );
}
