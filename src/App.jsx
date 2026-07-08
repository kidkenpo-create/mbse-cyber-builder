import { useState, useEffect } from "react";

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
const TABS = ["Narrative", "STPA-Sec", "Diagrams", "MITRE Matrix", "Requirements", "Cameo Export", "Raw"];

function extractSection(txt, header) {
  // Escape any regex metacharacters so headers like "MITRE ATT&CK" can't break the match
  const safe = header.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m = txt.match(new RegExp("===\\s*" + safe + "\\s*===([\\s\\S]*?)(?====|$)", "i"));
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
    checks.cameo     && "Cameo/MagicDraw SysML export",
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
    + "ARTIFACTS TO GENERATE:\n" + arts.map((a, i) => (i+1) + ". " + a).join("\n") + "\n\n"
    + "Use EXACTLY these section headers with === on both sides:\n\n"
    + "===SCENARIO NARRATIVE===\n"
    + "3-4 paragraphs grounded in " + mod.fullLabel + " content. Include: threat actor motivation/TTPs, initial access vector, propagation through control structure, mission impact. Reference specific systems, CVEs, DoDI citations, and CRRM methodology from the module context above.\n\n"
    + "===USE CASE DIAGRAM===\n" + (checks.usecase ? ucRule : "SKIP") + "\n\n"
    + "===SEQUENCE DIAGRAM===\n" + (checks.sequence ? seqRule : "SKIP") + "\n\n"
    + "===BLOCK DEFINITION DIAGRAM===\n" + (checks.bdd ? "ASCII BDD relevant to " + mod.fullLabel + ". Show Attacker, Target System blocks, Security/Resilience Control blocks with interfaces. Use MBSE BDD notation style." : "SKIP") + "\n\n"
    + "===MITRE ATTACK MAPPING===\n" + (checks.mitre ? "6-10 techniques most relevant to this module and scenario. Prefer ICS matrix for OT scenarios. Format each line exactly: Tactic | TechniqueID | Technique Name | How it applies to this specific scenario" : "SKIP") + "\n\n"
    + "===SECURITY REQUIREMENTS===\n" + (checks.req ? "8-12 SHALL requirements for " + mod.fullLabel + ". Format each line: REQ-ID | SHALL statement | Priority H/M/L | NIST 800-53 Control | Relevant DoDI. Ground requirements in module-specific context." : "SKIP") + "\n\n"
    + "===COURSES OF ACTION===\n" + (checks.coa ? "5-8 COAs for " + mod.fullLabel + ". For each: Name | Description | Effectiveness | Tradeoffs. Include SCRE-specific techniques (FOREST, Sentinel, design patterns where relevant)." : "SKIP") + "\n\n"
    + "===STPA SEC ANALYSIS===\n" + (checks.stpa ? "Full STPA-Sec grounded in " + mod.fullLabel + ":\n1. LOSSES (L-1 to L-5): mission-level unacceptable outcomes\n2. HAZARDS (H-1 to H-6): system states leading to losses\n3. CONTROL STRUCTURE: Controller, Control Actions, Controlled Process, Feedback channels\n4. HAZARDOUS CONTROL ACTIONS: For 2 key control actions, list all 4 HCA types (provided-when-shouldnt, not-provided-when-should, wrong-timing, wrong-duration)\n5. LOSS SCENARIOS (LS-1 to LS-4): adversary action → HCA → hazard → loss chain" : "SKIP") + "\n\n"
    + "===CAMEO EXPORT===\n" + (checks.cameo ? "Output a SysML scaffold in this exact format (used for XMI/CSV export):\nBLOCKS:\n  block SystemName { +missionType: String; +securityLevel: String }\n  block AttackerName { +capability: String; +tier: String }\n  block SecurityControl { +type: String; +mechanism: String }\n(list 3-5 key blocks)\n\nUSE_CASES:\n  uc 1 ActorName Perform Primary Mission\n  uc 2 AttackerName Execute Attack\n  uc 3 Operator Monitor Status\n(list 4-6 use cases)\n\nAll requirements from ===SECURITY REQUIREMENTS=== must appear here with same REQ-IDs:\nREQUIREMENTS: (copy all REQ-IDs and SHALL statements verbatim from requirements section)\n\nTRACEABILITY:\n  REQ-001 --> UseCase --> SystemBlock\n(one row per requirement)" : "SKIP") + "\n\n"
    + "===DISCUSSION QUESTIONS===\n"
    + "5 discussion questions specifically aligned to " + mod.elos + ". Each question should reference specific content from " + mod.fullLabel + ", require application of CRRM/STPA-Sec methodology, and be suitable for a 30-40 minute class discussion.\n\n"
    + "Be technically precise. Use actual CVE numbers, DoDI references, protocol names, and MBSE terminology from the module context.";
}

// ── CSS ───────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');
  *{box-sizing:border-box;}
  .r{background:#040d14;color:#c8dde8;font-family:'Rajdhani',sans-serif;font-size:15px;min-height:100vh;padding:14px;}
  .inner{max-width:1360px;margin:0 auto;}
  .hdr{text-align:center;padding:14px 0 10px;border-bottom:1px solid #0f3a5c;margin-bottom:0;}
  .ey{font-family:'Share Tech Mono',monospace;font-size:10px;color:#00d4ff;letter-spacing:4px;text-transform:uppercase;margin-bottom:4px;}
  .ttl{font-family:'Orbitron',monospace;font-size:clamp(15px,2.6vw,26px);font-weight:900;color:#fff;text-shadow:0 0 18px rgba(0,212,255,0.4);}
  .ttl span{color:#00d4ff;}
  .sub{font-family:'Share Tech Mono',monospace;font-size:10px;color:#4a7a99;letter-spacing:2px;margin-top:4px;}
  .mod-bar{display:flex;flex-wrap:wrap;gap:2px;padding:6px 8px;background:#050e1a;border:1px solid #0f3a5c;border-top:none;}
  .mb{background:none;border:1px solid transparent;color:#4a7a99;font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:1px;text-transform:uppercase;padding:5px 8px;cursor:pointer;border-radius:2px;transition:all 0.15s;white-space:nowrap;}
  .mb:hover{color:#c8dde8;}
  .mb.on{border-color:var(--c);color:var(--c);background:rgba(255,255,255,0.03);}
  .grid{display:grid;grid-template-columns:308px 1fr;gap:12px;margin-top:10px;}
  @media(max-width:800px){.grid{grid-template-columns:1fr;}}
  .panel{background:#070f1a;border:1px solid #0f3a5c;border-radius:3px;}
  .ph{padding:8px 12px;border-bottom:1px solid #0f3a5c;display:flex;align-items:center;gap:8px;}
  .pt{font-family:'Orbitron',monospace;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;}
  .dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;animation:blink 1.5s ease-in-out infinite;}
  .pb{padding:11px;}
  .lbl{display:block;font-family:'Share Tech Mono',monospace;font-size:9px;color:#00d4ff;letter-spacing:2px;text-transform:uppercase;margin-bottom:3px;margin-top:9px;}
  .lbl:first-child{margin-top:0;}
  select,.ta{width:100%;background:rgba(0,212,255,0.04);border:1px solid #0f3a5c;color:#c8dde8;font-family:'Rajdhani',sans-serif;font-size:13px;padding:5px 8px;border-radius:2px;outline:none;}
  select:focus,.ta:focus{border-color:#00d4ff;}
  .ta{resize:vertical;min-height:52px;font-size:12px;line-height:1.5;}
  input[type=range]{width:100%;accent-color:#00d4ff;}
  .sl{display:flex;justify-content:space-between;font-family:'Share Tech Mono',monospace;font-size:8px;color:#4a7a99;margin-top:2px;}
  .cks{display:flex;flex-direction:column;gap:3px;}
  .ck{display:flex;align-items:center;gap:7px;padding:3px 5px;border-radius:2px;cursor:pointer;font-size:13px;color:#c8dde8;}
  .ck:hover{background:rgba(0,212,255,0.04);}
  .ck input{accent-color:#00d4ff;cursor:pointer;}
  .gbtn{width:100%;margin-top:11px;padding:10px;background:transparent;border:1px solid;font-family:'Orbitron',monospace;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:all 0.2s;}
  .gbtn:disabled{opacity:0.35;cursor:not-allowed;}
  .out{display:flex;flex-direction:column;min-height:500px;}
  .lb{height:2px;background:linear-gradient(90deg,#00d4ff,#ff6b35,#00d4ff);background-size:200% 100%;animation:shimmer 1.5s linear infinite;}
  .tabs{display:flex;border-bottom:1px solid #0f3a5c;padding:0 8px;gap:1px;flex-wrap:wrap;}
  .tab{background:none;border:none;border-bottom:2px solid transparent;color:#4a7a99;font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;padding:7px 8px;cursor:pointer;margin-bottom:-1px;transition:color 0.15s;}
  .tab.on{color:#00d4ff;border-bottom-color:#00d4ff;}
  .tab:hover:not(.on){color:#c8dde8;}
  .tbody{flex:1;padding:13px;overflow-y:auto;max-height:58vh;}
  .ph2{display:flex;flex-direction:column;align-items:center;justify-content:center;height:280px;gap:9px;color:#4a7a99;font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:2px;text-align:center;}
  .st{font-family:'Orbitron',monospace;font-size:10px;color:#00d4ff;letter-spacing:2px;margin-bottom:9px;}
  .tbl{width:100%;border-collapse:collapse;font-size:11px;}
  th{background:rgba(0,212,255,0.08);color:#00d4ff;padding:6px 8px;text-align:left;border:1px solid #0f3a5c;font-size:10px;letter-spacing:1px;}
  td{padding:5px 8px;border:1px solid rgba(15,58,92,0.5);vertical-align:top;color:#c8dde8;}
  .bh{display:inline-block;padding:2px 5px;border-radius:2px;font-size:10px;font-weight:bold;background:rgba(255,0,64,0.18);color:#ff0040;border:1px solid rgba(255,0,64,0.35);}
  .bm{display:inline-block;padding:2px 5px;border-radius:2px;font-size:10px;font-weight:bold;background:rgba(255,107,53,0.18);color:#ff6b35;border:1px solid rgba(255,107,53,0.35);}
  .bl{display:inline-block;padding:2px 5px;border-radius:2px;font-size:10px;font-weight:bold;background:rgba(57,255,20,0.1);color:#39ff14;border:1px solid rgba(57,255,20,0.25);}
  .cr{display:flex;justify-content:flex-end;padding:5px 11px;border-bottom:1px solid #0f3a5c;}
  .cb{background:transparent;border:1px solid #0f3a5c;color:#4a7a99;font-family:'Share Tech Mono',monospace;font-size:10px;padding:3px 8px;cursor:pointer;border-radius:2px;transition:all 0.15s;}
  .cb:hover{border-color:#00d4ff;color:#00d4ff;}
  .ci{background:rgba(255,107,53,0.05);border:1px solid rgba(255,107,53,0.28);border-radius:3px;padding:10px 13px;font-size:13px;color:#c8dde8;line-height:1.8;margin-top:10px;}
  .ftr{text-align:center;padding:11px;font-family:'Share Tech Mono',monospace;font-size:9px;color:#4a7a99;letter-spacing:2px;margin-top:10px;border-top:1px solid #0f3a5c;line-height:1.8;}
  ::-webkit-scrollbar{width:3px;height:3px;}
  ::-webkit-scrollbar-thumb{background:#0f3a5c;border-radius:2px;}
  select option{background:#0a1a2a;}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
`;

// ── Main ──────────────────────────────────────────────────────────────────────
export default function MBSEBuilder() {
  const mermaidReady = useMermaid();
  const [mk, setMk] = useState("m6");
  const mod = MODULES[mk];

  const [scen,  setScen]  = useState("");
  const [sys,   setSys]   = useState("");
  const [actor, setActor] = useState("");
  const [soph,  setSoph]  = useState(4);
  const [acq,   setAcq]   = useState("");
  const [role,  setRole]  = useState("");
  const [extra, setExtra] = useState("");
  const [checks, setChecks] = useState({ usecase:true, sequence:true, bdd:true, mitre:true, req:true, coa:false, stpa:true, cameo:true });

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
      // Calls our own serverless proxy at /api/generate (see api/generate.js).
      // The proxy holds the Anthropic API key server-side and picks the model, so no
      // secrets ever reach the browser and there is no CORS problem.
      const callProxy = (password) => fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: password || undefined,
          messages: [{ role: "user", content: buildPrompt(mk, scen, sys, actor, soph, acq, role, extra, checks) }],
        }),
      });

      let res = await callProxy(sessionStorage.getItem("mbse_pw"));
      // If the deployment has a password gate enabled, prompt once and retry.
      if (res.status === 401) {
        const pw = window.prompt("This deployment is password-protected. Enter access password:");
        if (pw) { sessionStorage.setItem("mbse_pw", pw); res = await callProxy(pw); }
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || data?.error || "HTTP " + res.status);
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
        stpa:      extractSection(full, "STPA SEC ANALYSIS"),
        cameo:     extractSection(full, "CAMEO EXPORT"),
        dq:        extractSection(full, "DISCUSSION QUESTIONS"),
      });
    } catch (e) { setRaw("ERROR: " + e.message); setParsed({ error: e.message }); }
    finally { setLoading(false); }
  };

  const copy = txt => { navigator.clipboard.writeText(txt || raw); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const PH = ({ t }) => <div className="ph2"><div style={{ fontSize:30, opacity:0.18 }}>⬡</div><p>{t}</p></div>;

  // ── Renderers ───────────────────────────────────────────────────────────────
  const rNarrative = () => {
    if (!parsed) return <PH t="Select module · Configure · Click GENERATE" />;
    if (parsed.error) return <div style={{ color:"#ff4444", padding:13, fontFamily:"'Share Tech Mono',monospace", fontSize:12 }}>ERROR: {parsed.error}</div>;
    // The model responded, but no ===SECTION=== headers were found. Surface it instead of
    // showing a silently blank pane — usually a truncated response or altered formatting.
    if (!parsed.narrative && raw && !raw.startsWith("ERROR:")) {
      return (
        <div style={{ padding:13, fontFamily:"'Share Tech Mono',monospace", fontSize:12, color:"#ff6b35", lineHeight:1.8 }}>
          ⚠ The model responded but no expected section headers (===SCENARIO NARRATIVE=== etc.) were found.
          This is usually a truncated response. Try GENERATE again, or check the <strong>Raw</strong> tab below.
          <pre style={{ marginTop:10, color:"#4a7a99", fontSize:11, whiteSpace:"pre-wrap", maxHeight:"30vh", overflowY:"auto" }}>{raw.slice(0, 600)}</pre>
        </div>
      );
    }
    return (
      <div style={{ padding:13 }}>
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, color:mod.color, letterSpacing:2, marginBottom:8 }}>▸ {mod.fullLabel.toUpperCase()}</div>
        <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:15, lineHeight:1.8 }}>
          {(parsed.narrative||"").split("\n\n").map((p,i)=><p key={i} style={{marginBottom:11}}>{p}</p>)}
        </div>
        {parsed.dq && <div style={{ marginTop:14, paddingTop:12, borderTop:"1px solid #0f3a5c" }}>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, color:"#ff6b35", letterSpacing:2, marginBottom:7 }}>▸ DISCUSSION QUESTIONS</div>
          <div style={{ fontSize:14, color:"#4a7a99", whiteSpace:"pre-wrap", lineHeight:1.8, fontFamily:"'Rajdhani',sans-serif" }}>{parsed.dq}</div>
        </div>}
      </div>
    );
  };

  const rStpa = () => {
    if (!parsed||parsed.error) return <PH t="Generate a scenario first" />;
    if (!parsed.stpa||parsed.stpa==="SKIP") return <PH t="STPA-Sec not selected" />;
    return (
      <div style={{ padding:13 }}>
        <div className="st">▸ STPA-SEC CONTROL STRUCTURE ANALYSIS</div>
        <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:"#4a7a99", marginBottom:10 }}>// {mod.fullLabel} · CRRM Methodology //</div>
        <pre style={{ background:"rgba(0,212,255,0.02)", border:"1px solid #0f3a5c", borderRadius:3, padding:12, fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:"#c8dde8", whiteSpace:"pre-wrap", lineHeight:1.8 }}>{parsed.stpa}</pre>
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
        <div style={{ background:"rgba(57,255,20,0.05)", border:"1px solid rgba(57,255,20,0.2)", borderRadius:3, padding:"6px 11px", marginBottom:12, fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:"#86efac", lineHeight:1.8 }}>
          ▸ Right-click diagram → Copy Image → paste into PowerPoint / Word&nbsp;&nbsp;|&nbsp;&nbsp;↓ SVG → Chrome → Print → PDF for crisp vector quality
        </div>
        {diags.map((d,i) => <MermaidDiagram key={i} code={d.code} title={d.title} />)}
        {hasBdd && <div style={{ background:"rgba(0,212,255,0.02)", border:"1px solid #0f3a5c", borderRadius:3, padding:12 }}>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, color:"#ff6b35", letterSpacing:2, marginBottom:7 }}>▸ BLOCK DEFINITION DIAGRAM (ASCII / SysML)</div>
          <pre style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:"#39ff14", whiteSpace:"pre", overflowX:"auto", lineHeight:1.6 }}>{parsed.bdd}</pre>
        </div>}
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
        <div className="st">▸ MITRE ATT&CK — {mod.label.toUpperCase()}</div>
        <table className="tbl">
          <thead><tr><th>Tactic</th><th>ID</th><th>Technique</th><th>Application</th></tr></thead>
          <tbody>
            {lines.map((line,i)=>{
              const cols = line.split("|").map(c=>c.trim()).filter(Boolean);
              if (cols.length < 3) return null;
              const sev = Object.entries(sevMap).find(([k])=>(cols[0]||"").toLowerCase().includes(k))?.[1]||"l";
              return <tr key={i}><td>{cols[0]}</td><td><span className={"b"+sev}>{cols[1]}</span></td><td>{cols[2]}</td><td style={{color:"#4a7a99",fontSize:11}}>{cols[3]||""}</td></tr>;
            })}
          </tbody>
        </table>
        <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:"#4a7a99", marginTop:8 }}>// Import IDs into attack.mitre.org/navigator | Use ICS matrix for OT scenarios //</p>
      </div>
    );
  };

  const rReqs = () => {
    if (!parsed||parsed.error) return <PH t="Generate a scenario first" />;
    const hasR = parsed.req&&parsed.req!=="SKIP", hasC = parsed.coa&&parsed.coa!=="SKIP";
    if (!hasR&&!hasC) return <PH t="Requirements / COA not selected" />;
    return (
      <div>
        {hasR && <div style={{ padding:13 }}>
          <div className="st">▸ SECURITY REQUIREMENTS — {mod.label.toUpperCase()}</div>
          <pre style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:"#c8dde8", whiteSpace:"pre-wrap", lineHeight:1.8 }}>{parsed.req}</pre>
        </div>}
        {hasC && <div style={{ padding:13, borderTop: hasR?"1px solid #0f3a5c":"none" }}>
          <div className="st" style={{color:"#ff6b35"}}>▸ COURSES OF ACTION</div>
          <pre style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:"#c8dde8", whiteSpace:"pre-wrap", lineHeight:1.8 }}>{parsed.coa}</pre>
        </div>}
      </div>
    );
  };

  // ── XML entity escape helper ─────────────────────────────────────────────
  const xmlEsc = (str) => {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  // ── Build XMI string via array push (no template literals) ───────────────
  const generateXMI = (cameoText, reqText) => {
    const ts = new Date().toISOString();
    const modName = (MODULES[mk] ? MODULES[mk].fullLabel : "SCRE_Model")
      .replace(/[^a-zA-Z0-9_]/g, "_");
    const uid = () => "_id_" + Math.random().toString(36).slice(2, 9);

    const reqLines = (reqText || "").split("\n").filter(function(l){ return l.indexOf("|") >= 0; });
    const reqs = reqLines.map(function(line, i) {
      const p = line.split("|").map(function(s){ return s.trim(); });
      return {
        id:       p[0] || ("REQ-" + ("00" + (i+1)).slice(-3)),
        text:     xmlEsc(p[1] || ("Requirement " + (i+1))),
        priority: p[2] || "M",
        nist:     xmlEsc(p[3] || ""),
        dodi:     xmlEsc(p[4] || ""),
        xid:      uid(),
        pid:      uid(),
        nid:      uid(),
      };
    });

    const blockRe = /block\s+([\w]+)/g;
    const blockMatches = [];
    let bm;
    while ((bm = blockRe.exec(cameoText || "")) !== null) blockMatches.push(bm[1]);
    const blocks = blockMatches.length > 0
      ? blockMatches
      : ["SystemBlock", "AttackerBlock", "SecurityControlBlock"];

    const blockIds = {};
    blocks.forEach(function(b){ blockIds[b] = uid(); });

    const ucList = ["Deploy System", "Monitor Area", "Detect Anomaly", "Respond to Threat"];
    const ucIds = {};
    ucList.forEach(function(u){ ucIds[u] = uid(); });

    const pkgId    = uid();
    const crrmId   = uid();
    const reqPkgId = uid();
    const ucPkgId  = uid();

    const out = [];
    out.push('<?xml version="1.0" encoding="UTF-8"?>');
    out.push('<xmi:XMI xmi:version="2.1"');
    out.push('  xmlns:xmi="http://schema.omg.org/spec/XMI/2.1"');
    out.push('  xmlns:uml="http://www.eclipse.org/uml2/5.0.0/UML"');
    out.push('  xmlns:SysML="http://www.omg.org/spec/SysML/20181001/SysML">');
    out.push('  <!-- CYB-5620V MBSE Builder - War-U | ' + ts + ' -->');
    out.push('  <uml:Model xmi:id="' + pkgId + '" name="' + modName + '">');

    out.push('    <packagedElement xmi:type="uml:Package" xmi:id="' + crrmId + '" name="' + modName + '_CRRM">');
    out.push('      <packagedElement xmi:type="uml:Package" xmi:id="' + uid() + '" name="HazardAnalysis"/>');
    out.push('      <packagedElement xmi:type="uml:Package" xmi:id="' + uid() + '" name="LossScenarios"/>');
    out.push('      <packagedElement xmi:type="uml:Package" xmi:id="' + uid() + '" name="AssuranceCases"/>');
    out.push('    </packagedElement>');

    out.push('    <packagedElement xmi:type="uml:Package" xmi:id="' + reqPkgId + '" name="' + modName + '_Requirements">');
    reqs.forEach(function(r) {
      out.push('      <packagedElement xmi:type="uml:Class" xmi:id="' + r.xid + '" name="' + r.id + '">');
      out.push('        <ownedComment xmi:type="uml:Comment"><body>' + r.text + '</body></ownedComment>');
      out.push('        <ownedAttribute xmi:type="uml:Property" name="priority" xmi:id="' + r.pid + '">');
      out.push('          <defaultValue xmi:type="uml:LiteralString" value="' + r.priority + '"/>');
      out.push('        </ownedAttribute>');
      out.push('        <ownedAttribute xmi:type="uml:Property" name="nist_control" xmi:id="' + r.nid + '">');
      out.push('          <defaultValue xmi:type="uml:LiteralString" value="' + r.nist + '"/>');
      out.push('        </ownedAttribute>');
      out.push('      </packagedElement>');
    });
    out.push('    </packagedElement>');

    out.push('    <packagedElement xmi:type="uml:Package" xmi:id="' + ucPkgId + '" name="' + modName + '_UseCases">');
    ucList.forEach(function(uc) {
      out.push('      <packagedElement xmi:type="uml:UseCase" xmi:id="' + ucIds[uc] + '" name="' + xmlEsc(uc) + '"/>');
    });
    out.push('    </packagedElement>');

    blocks.forEach(function(b) {
      out.push('    <packagedElement xmi:type="uml:Class" xmi:id="' + blockIds[b] + '" name="' + b + '">');
      out.push('      <appliedStereotype xmi:type="SysML:Block"/>');
      out.push('    </packagedElement>');
    });

    reqs.forEach(function(r, i) {
      const tgt = blocks[i % blocks.length];
      out.push('    <packagedElement xmi:type="uml:Abstraction" xmi:id="' + uid() + '"');
      out.push('      name="deriveReqt_' + r.id + '" client="' + r.xid + '" supplier="' + blockIds[tgt] + '">');
      out.push('      <appliedStereotype xmi:type="SysML:DeriveReqt"/>');
      out.push('    </packagedElement>');
    });

    out.push('  </uml:Model>');
    out.push('</xmi:XMI>');
    return out.join("\n");
  };

  // ── CSV requirements generator ────────────────────────────────────────────
  const generateCSV = (reqText) => {
    const rows = ["REQ-ID,SHALL Statement,Priority,NIST 800-53 Control,DoDI Reference,Verification Method,Status"];
    (reqText || "").split("\n").filter(function(l){ return l.indexOf("|") >= 0; }).forEach(function(line) {
      const p = line.split("|").map(function(s){ return s.trim(); });
      const q = function(v){ return '"' + (v || "").replace(/"/g, '""') + '"'; };
      rows.push([q(p[0]), q(p[1]), q(p[2] || "M"), q(p[3]), q(p[4]), q("Inspection/Test"), q("Draft")].join(","));
    });
    return rows.join("\n");
  };

  const dlFile = (content, filename, mime) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type: mime }));
    a.download = filename;
    a.click();
  };

  const rCameo = () => {
    if (!parsed || parsed.error) return <PH t="Generate a scenario first" />;
    if (!parsed.cameo || parsed.cameo === "SKIP") return <PH t="Cameo Export not selected" />;
    const slug = (MODULES[mk] ? MODULES[mk].label : "SCRE").replace(/[^a-zA-Z0-9]/g, "_");
    const xmiBtn = { background:"transparent", border:"1px solid #a78bfa", color:"#a78bfa",
      fontFamily:"'Share Tech Mono',monospace", fontSize:10, padding:"3px 10px",
      cursor:"pointer", borderRadius:2, letterSpacing:1 };
    const csvBtn = { background:"transparent", border:"1px solid #34d399", color:"#34d399",
      fontFamily:"'Share Tech Mono',monospace", fontSize:10, padding:"3px 10px",
      cursor:"pointer", borderRadius:2, letterSpacing:1 };
    return (
      <>
        <div style={{ display:"flex", gap:8, padding:"8px 12px", borderBottom:"1px solid #0f3a5c", flexWrap:"wrap", alignItems:"center" }}>
          <button className="cb" onClick={()=>copy(parsed.cameo)}>{copied ? "[ COPIED! ]" : "[ COPY SCAFFOLD ]"}</button>
          <button style={xmiBtn} onClick={()=>dlFile(generateXMI(parsed.cameo, parsed.req), slug + "_SysML.xmi", "application/xml")}>
            Download XMI (Cameo/MagicDraw)
          </button>
          <button style={csvBtn} onClick={()=>dlFile(generateCSV(parsed.req), slug + "_Requirements.csv", "text/csv")}>
            Download CSV (Requirements)
          </button>
        </div>
        <div style={{ padding:13 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
            <div style={{ background:"rgba(167,139,250,0.06)", border:"1px solid rgba(167,139,250,0.3)", borderRadius:3, padding:11, fontSize:12, lineHeight:1.8 }}>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, color:"#a78bfa", letterSpacing:2, marginBottom:6 }}>XMI IMPORT - CAMEO / MAGICDRAW</div>
              1. Download the .xmi file<br/>
              2. Open your SysML project in Cameo<br/>
              3. <strong style={{color:"#a78bfa"}}>File - Import - Import XMI</strong><br/>
              4. Select .xmi file, click Finish<br/>
              5. Packages, Blocks, Requirements + deriveReqt traces load into containment tree<br/>
              <span style={{color:"#4a7a99",fontSize:11}}>Cameo Systems Modeler 2021x+</span>
            </div>
            <div style={{ background:"rgba(52,211,153,0.06)", border:"1px solid rgba(52,211,153,0.3)", borderRadius:3, padding:11, fontSize:12, lineHeight:1.8 }}>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, color:"#34d399", letterSpacing:2, marginBottom:6 }}>CSV IMPORT - MAGICDRAW REQUIREMENTS</div>
              1. Download the .csv file<br/>
              2. Open your MagicDraw project<br/>
              3. <strong style={{color:"#34d399"}}>Tools - Data Import</strong><br/>
              4. Select CSV, map columns to properties<br/>
              5. REQ-ID, SHALL text, Priority, NIST, DoDI populate automatically<br/>
              <span style={{color:"#4a7a99",fontSize:11}}>MagicDraw 2022+ and Cameo</span>
            </div>
          </div>
          <div className="st">SYSML SCAFFOLD (human-readable)</div>
          <pre style={{ background:"rgba(0,212,255,0.02)", border:"1px solid #0f3a5c", borderRadius:3, padding:12,
            fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:"#39ff14",
            whiteSpace:"pre-wrap", lineHeight:1.8, maxHeight:"36vh", overflowY:"auto" }}>{parsed.cameo}</pre>
        </div>
      </>
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

  const renderers = { "Narrative":rNarrative, "STPA-Sec":rStpa, "Diagrams":rDiagrams, "MITRE Matrix":rMitre, "Requirements":rReqs, "Cameo Export":rCameo, "Raw":rRaw };

  return (
    <>
      <style>{css}</style>
      <div className="r">
        <div className="inner">
          <div className="hdr">
            <div className="ey">◈ CYB-5620V · SECURE CYBER RESILIENT ENGINEERING · WAR-U ◈</div>
            <div className="ttl">MBSE <span>Cyber</span> Scenario Builder</div>
            <div className="sub">// M2: Threats · M3: Policy · M4: Approaches · M5: Pipeline · M6: Silverfish · M7: SDAD · M8: GAVIN //</div>
          </div>

          {/* Module selector */}
          <div className="mod-bar">
            {Object.entries(MODULES).map(([key,m]) => (
              <button key={key} className={"mb"+(mk===key?" on":"")} style={{"--c":m.color}}
                onClick={()=>setMk(key)} title={m.fullLabel}>
                {m.label}
              </button>
            ))}
          </div>

          <div className="grid">
            {/* CONFIG */}
            <div className="panel" style={{ borderTop:`2px solid ${mod.color}` }}>
              <div className="ph">
                <div className="dot" style={{ background:mod.color, boxShadow:`0 0 6px ${mod.color}` }} />
                <div className="pt" style={{ color:mod.color }}>{mod.label}</div>
              </div>
              <div className="pb">
                <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9, color:"#4a7a99", lineHeight:1.6, marginBottom:8, padding:"5px 7px", background:"rgba(0,0,0,0.2)", borderRadius:2 }}>
                  {mod.day} · {mod.focus}
                </div>

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
                  {[["usecase","Use Case Diagram (Mermaid)"],["sequence","Attack Sequence Diagram"],["bdd","Block Definition Diagram (BDD)"],["mitre","MITRE ATT&CK Mapping"],["req","Security Requirements"],["coa","Courses of Action"],["stpa","STPA-Sec Analysis"],["cameo","Cameo / MagicDraw Export"]].map(([k,lbl])=>(
                    <label key={k} className="ck"><input type="checkbox" checked={checks[k]} onChange={()=>toggle(k)}/><span>{lbl}</span></label>
                  ))}
                </div>

                <label className="lbl">Context / Notes</label>
                <textarea className="ta" value={extra} onChange={e=>setExtra(e.target.value)} placeholder="Exercise phase, specific CVE, protocol, student context..." />

                <button className="gbtn" disabled={loading} onClick={generate}
                  style={{ borderColor:mod.color, color:mod.color }}>
                  {loading ? "⬡ Generating..." : "⬡ Generate Scenario"}
                </button>
              </div>
            </div>

            {/* OUTPUT */}
            <div className="panel out" style={{ borderTop:`2px solid ${mod.color}` }}>
              {loading && <div className="lb" />}
              <div className="tabs">
                {TABS.map(t=><button key={t} className={"tab"+(tab===t?" on":"")} onClick={()=>setTab(t)}>{t}</button>)}
              </div>
              <div className="tbody" style={{ padding:0 }}>
                {renderers[tab]?.()}
              </div>
            </div>
          </div>

          <div className="ftr">
            CYB-5620V SECURE CYBER RESILIENT ENGINEERING · MBSE SCENARIO BUILDER · POWERED BY CLAUDE AI · FOR EDUCATIONAL USE<br/>
            M2 ICS Threats · M3 SCRE Policy · M4 Approaches · M5 Pipeline · M6 Silverfish UGV · M7 Silverfish SDAD · M8 Guardian GAVIN<br/>
            Diagrams render in-browser via Mermaid · Right-click → Copy Image → PowerPoint / Word
          </div>
        </div>
      </div>
    </>
  );
}
