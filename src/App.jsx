import React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';

// ── THREAT ATLAS DATA (sourced from Modules 1-8 PPTs) ─────────────────────
const THREAT_TIERS = [{
  tier: 1,
  label: "Opportunistic",
  color: "#39ff14",
  desc: "Script kiddie, automated tools, no specific targeting. Exploits known unpatched vulnerabilities.",
  examples: ["Commodity malware", "Shodan scanning", "Credential stuffing"]
}, {
  tier: 2,
  label: "Organized Criminal",
  color: "#86efac",
  desc: "Financial motivation, organized groups, ransomware-as-a-service, credential theft.",
  examples: ["Colonial Pipeline (DarkSide)", "Ransomware-as-a-Service", "BEC fraud"]
}, {
  tier: 3,
  label: "Sophisticated Criminal/Hacktivist",
  color: "#fbbf24",
  desc: "Targeted attacks, custom tools, motivated by ideology or profit at scale.",
  examples: ["Targeted ransomware", "Hacktivist DDoS", "Data broker attacks"]
}, {
  tier: 4,
  label: "APT — Nation-State Proxy",
  color: "#ff6b35",
  desc: "Fancy Bear / APT28 level. Long dwell time, custom implants, multi-vector. XAgent, X-Tunnel, WinIDS.",
  examples: ["APT28 Fancy Bear", "APT29 Cozy Bear", "Criminal proxies with state support"]
}, {
  tier: 5,
  label: "Nation-State",
  color: "#ff4444",
  desc: "State intelligence services. Pre-positioned access, OT expertise, physical damage capability.",
  examples: ["Sandworm (GRU Unit 74455)", "PRC APT (Guam pre-positioning)", "IRGC cyber ops"]
}, {
  tier: 6,
  label: "Co-Evolving / Zero-Day Capable",
  color: "#ff0040",
  desc: "Adversaries actively developing zero-days faster than defenders patch. Most dangerous tier (CSE Guide 3.0).",
  examples: ["Stuxnet developers", "Advanced SIGINT agencies", "Triton/TRISIS authors"]
}];
const APT_PROFILES = [{
  id: "fancy_bear",
  name: "Fancy Bear",
  aliases: "APT28 / Sofacy / Pawn Storm / Sednit",
  nation: "Russia (GRU)",
  tier: 4,
  color: "#ff4444",
  active: "2008–present",
  targets: "Aerospace, Defense, Energy, Government, Media, Dissidents",
  implants: ["XAgent (cross-platform primary implant)", "X-Tunnel (network tunneling)", "WinIDS", "Foozer", "DownRange"],
  ttps: ["Spear phishing with credential harvesting", "Spoofed websites", "Multiple concurrent intrusion ops", "Mobile device targeting", "Cross-platform (Windows/Linux/iOS/Android)"],
  note: "Profile closely mirrors Russian government strategic interests. Suspected GRU affiliation. Demonstrated ability to run multiple extensive intrusion operations concurrently.",
  relevance: "Module 2 & 5: Fancy Bear conducted SCADA/pipeline attacks. ICS case study protagonist."
}, {
  id: "cozy_bear",
  name: "Cozy Bear",
  aliases: "APT29 / The Dukes / Nobelium",
  nation: "Russia (SVR)",
  tier: 5,
  color: "#ff6b35",
  active: "2010–present",
  targets: "Government, Think Tanks, NGOs, Healthcare, Supply Chain",
  implants: ["WellMess", "WellMail", "MiniDuke", "CosmicDuke", "SolarWinds Sunburst (supply chain)"],
  ttps: ["Supply chain compromise (SolarWinds SUNBURST)", "Spear phishing", "Living off the land", "Stealthy long-dwell operations", "Password spraying"],
  note: "SolarWinds SUNBURST: malicious update digitally signed — bypassed traditional integrity checks. 18,000+ organizations affected. Demonstrates limits of patching/signing alone.",
  relevance: "Modules 2, 4, 8: Supply chain compromise example. Digital signing not sufficient — blockchain/formal verification needed."
}, {
  id: "sandworm",
  name: "Sandworm",
  aliases: "Voodoo Bear / TeleBots / Unit 74455",
  nation: "Russia (GRU)",
  tier: 5,
  color: "#ff0040",
  active: "2009–present",
  targets: "Critical Infrastructure, Electric Grid, Ukraine, ICS/SCADA",
  implants: ["BlackEnergy2/3", "Industroyer (Crashoverride)", "Industroyer2", "NotPetya", "Cyclops Blink"],
  ttps: ["ICS-specific malware development", "Electric grid disruption", "Automated physical damage", "No hands-on-keyboard attacks", "Safety system targeting (TRITON collaboration suspected)"],
  note: "Responsible for two Ukraine power grid attacks (2015, 2016). Industroyer designed for automated physical damage without attacker presence. NotPetya caused $10B+ global damage.",
  relevance: "Module 2: ICS attack history. Industroyer/Crashoverride case study. Grid OT attack methodology."
}, {
  id: "prc_apt",
  name: "PRC Nation-State APTs",
  aliases: "Volt Typhoon / Salt Typhoon / APT40",
  nation: "China (MSS/PLA)",
  tier: 5,
  color: "#a78bfa",
  active: "2000–present",
  targets: "Defense Industrial Base, Guam infrastructure, Telecom, Military logistics",
  implants: ["Living off the land (LOL)", "Custom rootkits", "SOHO router botnets", "Custom firmware implants"],
  ttps: ["Pre-positioning in Guam infrastructure", "Critical infrastructure pre-staging", "Telecom interception (Salt Typhoon)", "Supply chain hardware implants", "Long-term persistent access"],
  note: "ODNI 2024: PRC operations 'probably intended to pre-position cyber attacks against infrastructure in Guam.' Chinese-manufactured cranes at US ports flagged as national security risk (White House 2024).",
  relevance: "Module 2: ODNI Annual Threat Assessment 2024. Port crane vulnerabilities. Critical infrastructure pre-positioning."
}];
const ICS_ATTACKS = [{
  id: "stuxnet",
  year: 2010,
  name: "Stuxnet",
  color: "#ff0040",
  tier: 6,
  target: "Iranian Natanz Nuclear Facility — Siemens S7-315/S7-417 PLCs",
  actor: "Nation-State (attributed to US/Israel)",
  type: "Physical Damage / Sabotage",
  method: "USB propagation → Windows exploit chain (4 zero-days) → WinCC/Step7 infection → PLC logic modification → centrifuge speed manipulation",
  effect: "~1,000 Natanz centrifuges destroyed. First ICS malware to cause physical damage. Altered centrifuge rotation speed (high/low) while reporting normal to SCADA operators.",
  stpa_impact: "False feedback to operator. Hazardous control actions caused by corrupted sensor data. Safety system bypassed.",
  legacy: "Malicious techniques still used by adversaries today. Proved ICS physical damage via cyber is achievable.",
  cves: "4 Windows zero-days (MS10-046, MS10-061, MS10-073, MS10-092) + 2 Siemens zero-days",
  forest_node: "Sense: SCADA showed normal. Isolate: None triggered. → Mission loss."
}, {
  id: "blackenergy",
  year: 2014,
  name: "BlackEnergy2/3",
  color: "#ff4444",
  tier: 4,
  target: "Ukraine electric grid, nuclear plants, water purification, oil/gas pipelines",
  actor: "Sandworm (GRU Unit 74455)",
  type: "Reconnaissance / Persistent Access / Disruption",
  method: "Spear phishing → Excel/Word macro → BlackEnergy3 dropper → SCADA credential harvest → RTU access → manual breaker operation",
  effect: "225,000+ Ukrainian customers lost power (Dec 2015). Coordinated across 3 distribution companies. Phone systems flooded to prevent reporting.",
  stpa_impact: "Operator HMI compromised. C2 link to RTUs spoofed/seized. Control actions from attacker, not operator.",
  legacy: "First confirmed cyber attack to cause power outage. Used mainly for foothold and ICS exploration — physical damage NOT the primary goal (unlike Crashoverride).",
  cves: "CVE-2014-4114 (BlackEnergy macro), multiple SCADA credential vulnerabilities",
  forest_node: "Sense: Operators detected BUT comms flooded. Isolate: Too slow. Execution: Manual recovery took hours."
}, {
  id: "industroyer",
  year: 2016,
  name: "Industroyer / Crashoverride",
  color: "#ff6b35",
  tier: 5,
  target: "Ukrainian Kyiv transmission substation — IEC 104/101, GOOSE, IEC 61850 protocols",
  actor: "Sandworm (GRU)",
  type: "Physical Grid Damage — Automated",
  method: "Persistent access via malware → Custom ICS payloads for 4 protocols → Automated circuit breaker manipulation without attacker presence",
  effect: "Kiev blackout December 2016. Designed for automated physical damage — no 'hands on keyboard' during attack. Targeted 4 ICS communication protocols natively.",
  stpa_impact: "Control actions issued by malware, not operator. No human in loop. Automated adversity chain.",
  legacy: "First malware designed specifically to attack electric grid infrastructure at protocol level. Unlike BlackEnergy — purpose IS physical damage.",
  cves: "IEC 104 protocol abuse, IEC 61850/GOOSE spoofing, DNP3 manipulation",
  forest_node: "Sense: No anomaly detected — legitimate protocol commands. Isolate: Never triggered. Execution: Automated blackout."
}, {
  id: "triton",
  year: 2017,
  name: "TRITON / TRISIS",
  color: "#a78bfa",
  tier: 6,
  target: "Middle East petrochemical facility — Schneider Electric Triconex Safety Instrumented System (SIS)",
  actor: "TEMP.Veles (attributed to Russia CNIIHM)",
  type: "Safety System Attack",
  method: "IT network breach → engineering workstation compromise → Triconex Smart Communication Interface exploit → TRITON framework deployment → SIS reprogramming",
  effect: "First ICS malware targeting safety equipment. SIS designed to prevent human injury and equipment damage. TRITON reprogrammed fail-safes. Accidental detection prevented catastrophe.",
  stpa_impact: "Safety controller subverted. 'Safe' state redefined by attacker. Physical process could cause explosion/injury with no automatic shutdown.",
  legacy: "Crossing the 'red line' — attacking life-safety systems. Proves defenders cannot rely on SIS as last line of defense.",
  cves: "CVE-2019-13945 (Triconex), custom zero-day against SIS firmware",
  forest_node: "Sense: SIS showed normal — attacker masked. Isolate: SIS itself compromised. Last-resort safety defeated."
}, {
  id: "industroyer2",
  year: 2022,
  name: "Industroyer2",
  color: "#fb923c",
  tier: 5,
  target: "Ukrainian high-voltage electrical substation (April 2022)",
  actor: "Sandworm (GRU)",
  type: "Grid Disruption — Ukraine War",
  method: "Stripped-down Industroyer variant → IEC 104 protocol only → Circuit breaker state flipping (open↔closed) at scale",
  effect: "Prevented by Ukrainian CERT-UA detection. Designed to flip grid circuit breakers. Scheduled for execution April 8, 2022.",
  stpa_impact: "Attacker directly issuing breaker control actions. Control structure bypassed at substation level.",
  legacy: "Continuous evolution of ICS attack toolkits. Wartime cyber operations integrated with kinetic attacks.",
  cves: "IEC 104 protocol manipulation (protocol-level attack, not CVE-based)",
  forest_node: "Sense: CERT-UA detected pre-execution. Isolate: System taken offline. Resilience: Manual mode. Mission preserved."
}, {
  id: "colonial",
  year: 2021,
  name: "Colonial Pipeline",
  color: "#fbbf24",
  tier: 2,
  target: "Colonial Pipeline IT network — largest US petroleum pipeline (8,850 km)",
  actor: "DarkSide (Criminal Ransomware Group)",
  type: "Ransomware / IT Attack",
  method: "Compromised VPN password (no MFA) → IT network ransomware → voluntary OT shutdown (caution) → fuel shortage",
  effect: "$4.4M ransom paid. 100GB data exfiltrated. East coast fuel shortages. IT attacked, OT not directly compromised — operator shut OT down as precaution. Why pay ransom? Was backup tested? Was backup on compromised network?",
  stpa_impact: "Operator decision under uncertainty. OT shutdown was operator choice, not attacker requirement. Loss of situational awareness drove business decision.",
  legacy: "Single compromised password = national fuel shortage. MFA gap. Demonstrates IT/OT interdependence risk. DOE: 'attack was cautionary' — OT was not attacked.",
  cves: "No CVE — credential compromise via legacy VPN without MFA",
  forest_node: "Sense: Ransomware detected on IT. Isolate: OT voluntarily isolated. Options: Pay ransom vs restore backup. Execution: Paid $4.4M."
}, {
  id: "solarwinds",
  year: 2020,
  name: "SolarWinds SUNBURST",
  color: "#00d4ff",
  tier: 5,
  target: "18,000+ organizations including US DoD, Treasury, State, NSA, DHS, Fortune 500",
  actor: "Cozy Bear / APT29 (SVR)",
  type: "Supply Chain Compromise",
  method: "Compromise SolarWinds build system → malicious code injected into Orion IT management software → signed update pushed to customers → backdoor activated in ~18,000 deployments",
  effect: "9-month undetected dwell. Access to classified networks. FireEye detected via tool theft. Digitally signed malicious update passed all traditional security checks.",
  stpa_impact: "Integrity of software supply chain violated. Even formally signed code cannot be trusted without additional verification (blockchain, formal methods).",
  legacy: "NIST 800-160 v2 substantiated integrity — digital signing alone insufficient. Supply chain is attack surface. Formal verification or block-chain integrity tracking needed.",
  cves: "CVE-2020-10148 (SolarWinds Orion authentication bypass)",
  forest_node: "Sense: No anomaly (legitimate signed update). Isolate: Triggered only after FireEye discovery. 9-month gap."
}, {
  id: "spectre_meltdown",
  year: 2018,
  name: "Spectre / Meltdown",
  color: "#34d399",
  tier: 5,
  target: "Every modern CPU (Intel, AMD, ARM) — affects all OS and hypervisors",
  actor: "Academic discovery (exploitable by any motivated actor)",
  type: "Hardware Side-Channel",
  method: "Spectre (CVE-2017-5753/5715): Exploit branch prediction / speculative execution → leak data via CPU cache side-channel. Meltdown (CVE-2017-5754): Out-of-order execution → read kernel memory from user space.",
  effect: "Any process can read memory of other processes or OS kernel. Remote code execution possible. Microcode patches only partially mitigate. Performance degradation from patches.",
  stpa_impact: "Foundational assumption violated: process isolation. Even patched systems remain partially vulnerable (variant 2). No amount of perfect patching solves inherent hardware design.",
  legacy: "'No amount of perfect patching stops the inherent problem of complex software assurance.' Demonstrates need for defense-in-depth beyond patching.",
  cves: "CVE-2017-5753 (Spectre v1), CVE-2017-5715 (Spectre v2), CVE-2017-5754 (Meltdown)",
  forest_node: "Sense: No OS-level detection possible. Isolate: Architecture-level isolation required. Resilience: Hardware redesign (Tiger Lake+)."
}, {
  id: "can_bus",
  year: 2017,
  name: "CAN Bus Vulnerability",
  color: "#86efac",
  tier: 4,
  target: "All vehicles using Controller Area Network (CAN) — automotive, military vehicles, UGVs",
  actor: "Any actor with physical/network access to CAN bus",
  type: "Protocol Design Flaw (Unpatchable)",
  method: "When ECU transmit error count exceeds 255 → bus-off mode. Attacker floods bus with error frames → target ECU silenced. Cannot be patched — CAN standard design flaw.",
  effect: "ECU silenced → loss of sensor data, brake/steer/accelerate control manipulation, DoS of safety-critical vehicle functions. Affects UGVs and autonomous systems (Silverfish).",
  stpa_impact: "Control structure disrupted at hardware level. No software patch possible. Must limit physical access to input ports.",
  legacy: "ICS-ALERT-17-209-01. 'Forever day' — manufacturer has no intention of patching. Network countermeasures only mitigation.",
  cves: "ICS-ALERT-17-209-01 (design flaw, no CVE assigned — not patchable)",
  forest_node: "Sense: Bus-off condition detectable. Isolate: Affected ECU isolated. Resilient Mode: Secondary control path required."
}, {
  id: "modbus",
  year: 2022,
  name: "Modbus ICS Vulnerabilities",
  color: "#fb923c",
  tier: 4,
  target: "PLCs, RTUs, SCADA systems using Modbus TCP/IP — widespread ICS protocol",
  actor: "Any network-positioned attacker (IT/OT convergence increases exposure)",
  type: "Protocol Authentication Bypass / RCE",
  method: "CVE-2022-45788: Bypass authentication in PLCs → native remote code execution. Modbus TCP cleartext → passive recon → message intercept/modify. No integrity checks → data manipulation.",
  effect: "RCE on ICS devices. Valve/pump/compressor control hijacked. Sensor data manipulated. 'Forever day' for legacy deployments.",
  stpa_impact: "All STPA adversity types applicable: Injection, Spoofing, DoS, Tampering, Intercepting, Disclosing. Protocol lacks authentication/integrity.",
  legacy: "Industry-standard protocol used globally in pipeline, water, energy SCADA. Cleartext + no auth = fundamental design gap. Relevant to Module 5 Pipeline case study.",
  cves: "CVE-2022-45788 (Modbus PLC authentication bypass)",
  forest_node: "Sense: Requires deep packet inspection (anomaly detection). Isolate: Network segmentation. Resilient: Redundant command validation."
}];
const ATTACK_TAXONOMY = [{
  type: "Injection",
  icon: "⊕",
  color: "#ff0040",
  desc: "Attacker injects false commands into control flow. E.g., false 'OPEN VALVE' command to RTU.",
  stpa: "Hazardous Control Action — command provided when not needed or incorrect value",
  mitre: "T0855 (ICS) Unauthorized Command Message",
  example: "Fancy Bear injecting SCADA commands to increase pipeline pressure"
}, {
  type: "Spoofing",
  icon: "◈",
  color: "#ff6b35",
  desc: "Attacker fabricates sensor data / feedback to mislead operator or controller.",
  stpa: "HCA — incorrect feedback causes loop instability or wrong control action",
  mitre: "T0856 Spoof Reporting Message, T0838 Modify Alarm Settings",
  example: "Stuxnet: centrifuge speed reported as normal while being destroyed"
}, {
  type: "Denial of Service",
  icon: "⊗",
  color: "#fbbf24",
  desc: "Attacker disrupts availability of control channel or feedback path.",
  stpa: "HCA — control action not provided when needed (unavailable)",
  mitre: "T0814 Denial of Service, T0815 Denial of View",
  example: "CAN Bus bus-off attack, Industroyer2 circuit breaker flooding"
}, {
  type: "Tampering",
  icon: "⊘",
  color: "#a78bfa",
  desc: "Attacker modifies data in transit or at rest — logs, firmware, configuration.",
  stpa: "HCA — too early/late/wrong-duration due to corrupted timing or config",
  mitre: "T0831 Manipulate I/O Image, T0836 Modify Parameter",
  example: "Stuxnet PLC logic modification. SolarWinds signed update tampering"
}, {
  type: "Intercepting",
  icon: "⌁",
  color: "#00d4ff",
  desc: "Attacker passively captures data in transit — recon for future attacks.",
  stpa: "Enables future HCAs by providing adversary control structure knowledge",
  mitre: "T0842 Network Sniffing, T0861 Point & Tag Identification",
  example: "Modbus cleartext recon. Fancy Bear credential harvesting"
}, {
  type: "Disclosing",
  icon: "◉",
  color: "#34d399",
  desc: "Attacker exfiltrates CPI, mission data, design IP, or operational patterns.",
  stpa: "Compromises confidentiality — enables targeted future attacks",
  mitre: "T0877 I/O Image, T0882 Theft of Operational Information",
  example: "SolarWinds 9-month exfil. Colonial 100GB data theft"
}];
const SCRE_TECHNIQUES = [{
  id: "redundancy",
  name: "Redundancy",
  nist: "NIST 800-160 v2 #1",
  color: "#00d4ff",
  desc: "Incorporate redundant components to support failover or reconfiguration. Can be homogeneous or heterogeneous, passive or active, parallel (voting) or serial (hot/warm/cold failover).",
  pattern: "Firesmith taxonomy: Passive vs Active vs Parallel vs Serial. Diversity of vendor recommended."
}, {
  id: "segmentation",
  name: "Network Segmentation",
  nist: "NIST 800-160 v2 #2",
  color: "#39ff14",
  desc: "Divide network into isolated zones. Limits lateral movement. Aligns with Zero Trust architecture.",
  pattern: "IT/OT boundary enforcement. DMZ between SCADA and enterprise. Protocol gateways."
}, {
  id: "circuit_breaker",
  name: "Circuit Breaker Pattern",
  nist: "NIST 800-160 v2",
  color: "#fbbf24",
  desc: "Object between service consumer and provider monitors failures. If failures exceed threshold → trips, blocks further attempts, sets timer. After timeout → permits limited requests. If success threshold met → resets. (Netflix Hystrix)",
  pattern: "Service Provider ←→ Circuit Breaker ←→ Service Consumer. Three states: Closed / Open / Half-Open."
}, {
  id: "sentinel",
  name: "Mission-Aware Sentinel",
  nist: "FOREST Framework",
  color: "#ff6b35",
  desc: "Detects abnormal behavior in control structure and triggers resilient mode. Core to CRRM methodology.",
  pattern: "FOREST 7 steps: Sense → Isolate → Options → Evaluation → Confidence → Readiness → Execution"
}, {
  id: "diversity",
  name: "Functional Diversity",
  nist: "NIST 800-160 v2 #3",
  color: "#a78bfa",
  desc: "Use diverse implementations of same function. Prevents single-point vulnerability. Applied to firmware, OS, software stacks.",
  pattern: "Different vendor implementations, different programming languages for safety-critical functions."
}, {
  id: "privilege",
  name: "Privilege Restriction",
  nist: "NIST 800-160 v2 #9",
  color: "#fb923c",
  desc: "Distributed Privileges design pattern. Least privilege. Zero Trust enforcement. Prevents lateral movement after initial compromise.",
  pattern: "Role-based access. Principle of least privilege. Multi-factor authentication. PAM solutions."
}, {
  id: "integrity",
  name: "Substantiated Integrity",
  nist: "NIST 800-160 v2 #13",
  color: "#34d399",
  desc: "Verify integrity of software, firmware, and data. Digital signing is insufficient (SolarWinds). Blockchain traceability or formal verification required for high-assurance.",
  pattern: "Blockchain supply chain integrity. DARPA HACMS formal verification. SBOM enforcement."
}, {
  id: "nonpers",
  name: "Non-Persistence",
  nist: "NIST 800-160 v2 #8",
  color: "#86efac",
  desc: "Refresh components to pristine state. Eliminates persistent malware. Aligns with immutable infrastructure.",
  pattern: "Virtualization + rapid recovery. Zero Trust: assume breach, refresh regularly. Container orchestration."
}];

// ── MODULES DATA ─────────────────────────────────────────────────────────────
const MODULES = {
  m2: {
    label: "M2: ICS Threats",
    fullLabel: "Module 2 — ICS Threats & Adversaries",
    color: "#ff4444",
    day: "Day 1",
    focus: "Threat Tiers 1-6, APT profiles, ICS attack timeline, DOT&E findings, co-evolving threats",
    scenarios: [{
      value: "fancy_bear_ics",
      label: "Fancy Bear (APT28/XAgent) SCADA Campaign"
    }, {
      value: "colonial_pipeline",
      label: "Colonial Pipeline Ransomware-Style Attack"
    }, {
      value: "stuxnet",
      label: "Stuxnet-Style PLC Physical Damage"
    }, {
      value: "blackenergy",
      label: "BlackEnergy2/3 Critical Infrastructure"
    }, {
      value: "triton_sis",
      label: "TRITON/TRISIS Safety System Attack"
    }, {
      value: "industroyer2",
      label: "Industroyer2 Grid Circuit Breaker"
    }, {
      value: "supply_chain",
      label: "SolarWinds-Style Supply Chain Compromise"
    }, {
      value: "prc_crane",
      label: "PRC Infrastructure Pre-Positioning (Guam/Ports)"
    }],
    systems: [{
      value: "ics_scada",
      label: "ICS/SCADA Control System"
    }, {
      value: "plc_modbus",
      label: "PLC / Modbus Protocol Network"
    }, {
      value: "can_bus",
      label: "CAN Bus OT Network"
    }, {
      value: "safety_sis",
      label: "Safety Instrumented System (SIS)"
    }, {
      value: "grid_ot",
      label: "Electric Grid OT / RTU Network"
    }, {
      value: "ot_it_boundary",
      label: "OT/IT Network Boundary"
    }],
    actors: [{
      value: "fancy_bear",
      label: "Fancy Bear / APT28 (XAgent, X-Tunnel, WinIDS)"
    }, {
      value: "cozy_bear",
      label: "Cozy Bear / APT29 (SolarWinds/supply chain)"
    }, {
      value: "sandworm",
      label: "Sandworm (Industroyer/BlackEnergy)"
    }, {
      value: "prc_apt",
      label: "PRC Nation-State APT (Volt Typhoon)"
    }, {
      value: "criminal_rw",
      label: "Criminal Ransomware Group (DarkSide-style)"
    }],
    acq: "far",
    role: "gov_sca",
    context: "DOT&E FY21: 400+ cybersecurity assessments FY14-FY21. 'DoD lags adversary offensive capabilities.' Root causes: insecure design, inadequate cyber training, insufficient test planning. Threat Tiers 1-6 (CSE Guide 3.0). Fancy Bear (APT28): active since 2008, XAgent implant (cross-platform), X-Tunnel, WinIDS, Foozer, DownRange. Cozy Bear (APT29): SolarWinds SUNBURST — digitally signed malicious update, 18,000 orgs, 9-month dwell — proves digital signing alone insufficient. Sandworm: BlackEnergy2/3 (2014-15), Industroyer (2016 grid attack), Industroyer2 (2022). PRC: ODNI 2024 — pre-positioning against Guam, Chinese cranes at US ports flagged as national security risk. ICS attacks: Stuxnet (2010) centrifuge destruction; BlackEnergy3 (2015) Ukraine power; Industroyer (2016) automated grid damage; TRITON (2017) first safety system attack; Industroyer2 (2022) Ukraine wartime. CVEs: CVE-2017-5753 Spectre, CVE-2017-5754 Meltdown (speculative execution side-channel, microcode patch insufficient), ICS-ALERT-17-209-01 CAN Bus (unpatchable design flaw, bus-off mode), CVE-2022-45788 Modbus PLC authentication bypass RCE. Attack taxonomy (STPA-Sec): Injection, Spoofing, DoS, Tampering, Intercepting, Disclosing.",
    elos: "TLO-1 ELO.3 (appraise attack methods), ELO.4 (appraise threat data), ELO.5 (define protection constraints)"
  },
  m3: {
    label: "M3: SCRE Policy",
    fullLabel: "Module 3 — SCRE Policy & Acquisition",
    color: "#a78bfa",
    day: "Day 1",
    focus: "DoDI acquisition stack, CS KPP, CSAs, PPP, TSN, CPI, CRRM in V-model lifecycle",
    scenarios: [{
      value: "dodi_gap",
      label: "DoDI 5000.90 Cybersecurity Gap Exploitation"
    }, {
      value: "cs_kpp",
      label: "Cyber Survivability KPP Requirement Failure"
    }, {
      value: "cpi_exfil",
      label: "Critical Program Information (CPI) Exfiltration"
    }, {
      value: "tsn_compromise",
      label: "Trusted Systems & Networks (TSN) Compromise"
    }, {
      value: "rmf_gap",
      label: "RMF ATO Gap — Unmitigated Cyber Risk"
    }, {
      value: "ppp_bypass",
      label: "Program Protection Plan (PPP) Bypass"
    }, {
      value: "sep_noncompliance",
      label: "SEP 3.2.11 SSE Non-Compliance"
    }],
    systems: [{
      value: "mta_rf",
      label: "MTA Rapid Fielding (DoDI 5000.80)"
    }, {
      value: "mda",
      label: "Major Defense Acquisition (DoDI 5000.85)"
    }, {
      value: "sw_path",
      label: "Software Pathway (DoDI 5000.87)"
    }, {
      value: "ppp_tsn",
      label: "PPP / TSN / CPI Protection System"
    }],
    actors: [{
      value: "ns_cpi",
      label: "Nation-State CPI Theft Actor"
    }, {
      value: "insider_contractor",
      label: "Malicious Contractor Insider"
    }, {
      value: "hw_supply",
      label: "Hardware Supply Chain Adversary"
    }, {
      value: "fancy_bear_acq",
      label: "Fancy Bear — Acquisition Targeting"
    }],
    acq: "mta_rf",
    role: "gov_pm",
    context: "DoDI stack: 5000.02, 5000.80/81/82/83/85/87/90, DoDI 5200.39/44, DoDD 5200.47E. Program Protection: Cybersecurity (RMF/DoDI 8500.01/8510.01), SCRM (DoDI 5200.44), AT/DEF/HwA/SwA (DoDI 5200.39), TSN, CPI. Cyberspace Survivability = Security + Resilience. CSAs define resilient modes. CRRM sits in SEP 3.2.11 SSE activities. V-model: Hazard Analysis at concept, Loss Scenarios at requirements, Assurance Cases at design, FOREST at test. JCIDS CS KPP (Cyber Survivability KPP). CJCI 5123.01H. CSE Guide v3 (threat tiers 1-6). NIST 800-160 v2 14 resiliency techniques. Zero Trust aligns to Segmentation + Privilege Restriction + Non-Persistence. Contracting: SOW/RFP Section L/M/CDRL include SCRE metrics/measures. Digitally signed software alone insufficient (SolarWinds precedent) — blockchain or formal verification required.",
    elos: "TLO-1 ELO.5/6, TLO-2 ELO.5"
  },
  m4: {
    label: "M4: Approaches",
    fullLabel: "Module 4 — SCRE Approaches & Methodology",
    color: "#34d399",
    day: "Day 1",
    focus: "STPA-Sec, FOREST, CRRM, Attack-CM Trees, MITRE Resilience, 14 NIST techniques, circuit breaker, redundancy",
    scenarios: [{
      value: "stpa_sec",
      label: "STPA-Sec Adversity Chain Analysis"
    }, {
      value: "full_crrm",
      label: "Full CRRM Methodology Application"
    }, {
      value: "forest_sentinel",
      label: "FOREST Sentinel Detection Scenario"
    }, {
      value: "circuit_breaker",
      label: "Circuit Breaker Resilience Pattern"
    }, {
      value: "attack_cm_tree",
      label: "Attack-CM Tree Development"
    }, {
      value: "wheel_of_access",
      label: "Wheel of Access — Attack Vector Analysis"
    }, {
      value: "mitre_resilience",
      label: "MITRE Resilience Framework Mapping (14 techniques)"
    }],
    systems: [{
      value: "generic_mission",
      label: "Generic Mission System"
    }, {
      value: "weapon_sys_ot",
      label: "Weapon System OT Platform"
    }, {
      value: "csa_system",
      label: "CSA-Governed System"
    }, {
      value: "sos",
      label: "System of Systems (SoS)"
    }],
    actors: [{
      value: "apt_inject",
      label: "APT — Command Injection"
    }, {
      value: "apt_spoof",
      label: "APT — Sensor Spoofing"
    }, {
      value: "apt_dos",
      label: "APT — Denial of Service"
    }, {
      value: "apt_tamper",
      label: "APT — Data Tampering"
    }, {
      value: "apt_disclose",
      label: "APT — Data Disclosure / Intercept"
    }],
    acq: "mda",
    role: "gov_lse",
    context: "SCRE Building Blocks: (1) Loss-Based Engineering — STPA-Sec: Problem Framing → Control Structures → Hazardous Control Actions → Loss Scenario Causes. 4 HCA types for each control action: not provided, wrong value, too early/late, wrong duration. (2) Mission-Aware Sentinel: FOREST 7 steps (Sense/Isolate/Options/Evaluation/Confidence/Readiness/Execution). Reduces consequence of attacks. (3) CSAs + Resilient Modes: Cyber Survivability Attributes define operational modes during attack. (4) CRRM: Cyber Resiliency Risk Management. (5) MITRE Resilience Framework + NIST 800-160 v2 14 techniques. Attack taxonomy for control loop failure: Injection, Spoofing, DoS, Tampering, Intercepting, Disclosing. Attack-CM Tree: Goal → OR gate → Attacks (category/technique/objective/target/system_mode) → AND gate → Countermeasures → Residual Vulnerabilities. Circuit Breaker: Closed/Open/Half-Open states, Netflix Hystrix example. Redundancy: Homogeneous vs Heterogeneous, Passive vs Active, Parallel (voting) vs Serial (failover). Wheel of Access: different attack surfaces for different system types. ATT&CK to adversity chain mapping.",
    elos: "TLO-1 ELO.1-6, TLO-2 ELO.1-5"
  },
  m5: {
    label: "M5: Pipeline ICS",
    fullLabel: "Module 5 — Pipeline ICS Systems (SCADA Case Study)",
    color: "#fbbf24",
    day: "Day 1",
    focus: "Pipeline SCADA architecture, RTU/HMI control structure, Fancy Bear attack chain, FOREST application, Kill Chain vs Adversity Chain",
    scenarios: [{
      value: "fancy_bear_scada",
      label: "Fancy Bear SCADA Infiltration (full chain)"
    }, {
      value: "rtu_compromise",
      label: "RTU Network Compromise — False Sensor Reports"
    }, {
      value: "hmi_manipulation",
      label: "Operator HMI Manipulation"
    }, {
      value: "leak_detection",
      label: "Leak Detection System Suppression"
    }, {
      value: "modbus_cve",
      label: "Modbus CVE-2022-45788 PLC Exploit"
    }, {
      value: "compressor_disrupt",
      label: "Compressor Station Disruption"
    }, {
      value: "sentinel_scenario",
      label: "FOREST Sentinel Scenario + Resilient Mode"
    }, {
      value: "adversity_chain",
      label: "Kill Chain vs Adversity Chain Comparison"
    }],
    systems: [{
      value: "pipeline_scada",
      label: "Pipeline SCADA / Main Control Room"
    }, {
      value: "rtu_network",
      label: "RTU Satellite/Microwave Network"
    }, {
      value: "operator_hmi",
      label: "Operator HMI Workstation"
    }, {
      value: "adv_pipeline",
      label: "Advanced Pipeline Apps (Leak Detection/Pig Tracking)"
    }, {
      value: "field_instr",
      label: "Field Instrumentation (pressure/flow/temp)"
    }],
    actors: [{
      value: "fancy_bear_pipe",
      label: "Fancy Bear / APT28 (pipeline targeting)"
    }, {
      value: "colonial_style",
      label: "Criminal Ransomware (Colonial-style, DarkSide)"
    }, {
      value: "ns_ics",
      label: "Nation-State ICS Specialist (Sandworm-level)"
    }],
    acq: "far",
    role: "gov_sca",
    context: "Pipeline system: 1,984,321 km US natural gas + 240,711 km petroleum. Architecture: Field instruments (flow/pressure/temp) → RTUs (satellite/microwave/cellular) → Main Control Room SCADA/HMI → Advanced Pipeline Apps (leak detection, pig tracking, predictive modeling). Operator commands via SCADA: open/close valves, start/stop compressors/pumps, change setpoints. Kill Chain (Assurance Cases) breaks attacker progression early. Adversity Chain (Resilience Mechanisms) reduces consequence of successful attack. STPA Abnormal Behavior: Fancy Bear attack → RTU compromise → false 'high' sensor reports → closed-loop feedback → reduced pipeline flow. Opposite attack: false 'low' → overpressure. Link attack: spoofed/tampered sensor reports. FOREST: Sense anomaly → Isolate affected RTU → Options assessment → Execute resilient mode. Modbus CVE-2022-45788: cleartext Modbus TCP, no authentication, no integrity checking — passive recon then RCE. Colonial Pipeline: no MFA on VPN, $4.4M ransom to DarkSide, 100GB exfiltrated, IT attack (OT voluntarily shut down). DOT&E: 'attack was cautionary' — real risk is OT-direct attack.",
    elos: "TLO-1 ELO.1-6, TLO-2 ELO.1-5"
  },
  m6: {
    label: "M6: Silverfish UGV",
    fullLabel: "Module 6 — Silverfish Area Denial (AD) UGV",
    color: "#00d4ff",
    day: "Day 2",
    focus: "UGV AD platform, STPA-Sec HCAs, CRRM Hazard Analysis, Loss Scenario Assessment, Assurance Cases",
    scenarios: [{
      value: "full_ad_attack",
      label: "Full AD Attack Chain (APT, multi-vector)"
    }, {
      value: "c2_compromise",
      label: "C2 Link Compromise — False ENGAGE Command"
    }, {
      value: "sensor_spoof",
      label: "Sensor Spoofing — False PERSONNEL Classification"
    }, {
      value: "malicious_tech",
      label: "Malicious Maintenance Technician (Insider)"
    }, {
      value: "gps_spoof",
      label: "GPS Spoofing — Out-of-Zone Engagement"
    }, {
      value: "crrm_hazard",
      label: "CRRM Hazard Analysis (ELO.15.A)"
    }, {
      value: "loss_scenario",
      label: "Loss Scenario Assessment (ELO.14.A/D)"
    }, {
      value: "assurance_case",
      label: "Assurance Case: Claim→Evidence→SHALL"
    }],
    systems: [{
      value: "silverfish_ad",
      label: "Silverfish UGV AD Platform (single operator, multi-weapon)"
    }, {
      value: "c2_ocs",
      label: "C2 Operator Control Station"
    }, {
      value: "sensor_suite",
      label: "Sensor Suite (PERSONNEL/VEHICLE classification)"
    }, {
      value: "rf_comms",
      label: "RF C2 Communications Link"
    }],
    actors: [{
      value: "ns_apt",
      label: "Nation-State APT (Fancy Bear-level)"
    }, {
      value: "malicious_tech_actor",
      label: "Malicious Maintenance Technician"
    }, {
      value: "org_criminal",
      label: "Organized Criminal / Proxy Group"
    }],
    acq: "mta_rf",
    role: "gov_lse",
    context: "Silverfish AD: rapidly deployable ground-based UGV, single operator, classifies PERSONNEL/VEHICLES, designated geographic area near strategically sensitive location. CRRM 4 steps: (1) Hazard Analysis: Losses L-1 to L-5, Hazards H-1 to H-6, Hazardous Control Actions for ENGAGE and HALT. 4 HCA types per action: not provided, wrong value, too early/late, wrong duration. (2) Loss Scenario Assessment: MBSE control structure analysis, adversary attack mapping. (3) Assurance Cases reduce likelihood of Loss Scenarios. (4) Sentinel Scenarios reduce consequence. Control Structure: Operator→C2 OCS→[RF Link]→UGV→Physical Domain. C2 control actions and Technician control actions in scope. Assurance Case format: Claim (e.g., C2 Link is authenticated) → Evidence → Argument → SHALL requirement + NIST 800-53 control. MTA Rapid Fielding acquisition — requirements in SOW/SRD. DOT&E cyber survivability assessment. Recurring weapon system cyber problems documented in GAO reports.",
    elos: "ELO.14.A/B/D/E, ELO.15.A/E"
  },
  m7: {
    label: "M7: Silverfish SDAD",
    fullLabel: "Module 7 — Silverfish SDAD Enhanced Mission",
    color: "#f472b6",
    day: "Day 2",
    focus: "SDAD platform, FOREST/CSA resilience requirements, resilient modes, enhanced control structure, Sentinel Scenarios",
    scenarios: [{
      value: "sdad_loss",
      label: "SDAD Loss Scenario Assessment (enhanced mission)"
    }, {
      value: "sentinel_detect",
      label: "Sentinel Scenario Detection + Response"
    }, {
      value: "resilience_arch",
      label: "Resilience Architecture Design (FOREST)"
    }, {
      value: "resilience_req",
      label: "Resilience Requirements (Assurance + Sentinel-based)"
    }, {
      value: "enhanced_hazard",
      label: "Enhanced Mission Hazard Analysis"
    }, {
      value: "control_flow",
      label: "Enhanced Control Structure with Sentinel Flows"
    }, {
      value: "resilient_modes",
      label: "Resilient Modes Design (Protected/Deploy/Fire/RR)"
    }],
    systems: [{
      value: "sdad_platform",
      label: "Silverfish SDAD Platform"
    }, {
      value: "sdad_control",
      label: "SDAD Enhanced Control Structure"
    }, {
      value: "sdad_sentinel",
      label: "SDAD Sentinel Detection Profile"
    }, {
      value: "sdad_arch",
      label: "SDAD Resilient Architecture"
    }],
    actors: [{
      value: "ns_apt_sdad",
      label: "Nation-State APT (multi-vector)"
    }, {
      value: "multi_vector",
      label: "Multi-Vector Attack (GPS+C2+Sensor simultaneous)"
    }, {
      value: "insider",
      label: "Insider Threat (contractor/maintainer)"
    }],
    acq: "mta_rf",
    role: "gov_lse",
    context: "4 CRRM models for SDAD: (1) Mission/System Overview, (2) Loss Scenario Assessment, (3) Resilience Architecture, (4) Resilience Requirements. SDAD Use Cases: Deploy to Field, Perform SDAD Mission. CRRM Step 3: Resilience Architecture — extend control structure with Sentinel Scenarios. Sentinel detects abnormal behavior → triggers Resilient Mode. Resilient modes: Protected mode, A2 Denial deployment, Fire mode, Rapid Reconfiguration mode. FOREST 7 steps applied to SDAD: Sense (behavior-sentinel detects anomaly in control structure), Isolate (affected component quarantined), Options (available resilient modes assessed), Evaluation (confidence in detection), Confidence (system-ready), Readiness (execution pathway selected), Execution (resilient mode activated). CRRM Step 4: Requirements — Assurance Case-based (defensive mechanisms, reduce likelihood) + Resilience-based (sentinel, resilient modes, reduce consequence). Test approaches: red team exercise, hardware-in-loop, pen test. ELOs cover full range TLO-1 through TLO-3.",
    elos: "ELO.14.A–ELO.15.E full"
  },
  m8: {
    label: "M8: GAVIN UAV",
    fullLabel: "Module 8 — Guardian UAV (GAVIN) Capstone",
    color: "#fb923c",
    day: "Day 2",
    focus: "GAVIN UAV capstone, CTT OPFOR exercise, criticality assessment, derived requirements, SCRE design patterns, contracting",
    scenarios: [{
      value: "laser_designator",
      label: "Laser Designator Compromise (Interop Mission)"
    }, {
      value: "seek_destroy",
      label: "Seek & Destroy Mission Disruption"
    }, {
      value: "gavin_ugv_comms",
      label: "GAVIN-to-UGV Comms Intercept (5-10 sec dwell)"
    }, {
      value: "ctt_opfor",
      label: "CTT OPFOR Exercise — Potential Targets/Effects/Goals"
    }, {
      value: "criticality_assess",
      label: "Criticality Assessment (2 missions / 3 critical functions)"
    }, {
      value: "design_patterns_m8",
      label: "SCRE Design Pattern Application (SysML Activity Diagrams)"
    }, {
      value: "derived_reqs",
      label: "Derived Requirements / SOW / SRD / CDRL"
    }, {
      value: "rmf_csa",
      label: "RMF & CSA Level 2 Traceability"
    }],
    systems: [{
      value: "gavin_uav",
      label: "GAVIN UAV (Army/USMC ACAT II, MTA)"
    }, {
      value: "laser_desig",
      label: "Laser Designator Subsystem"
    }, {
      value: "onboard_wpns",
      label: "Onboard Weapons (Seek & Destroy)"
    }, {
      value: "air_ground_link",
      label: "Air-Ground Link (UAV↔UGV coordination)"
    }, {
      value: "csa_level2",
      label: "CSA Level 2 System"
    }],
    actors: [{
      value: "opfor_red",
      label: "OPFOR / Red Team (CTT)"
    }, {
      value: "ns_ew",
      label: "Nation-State with EW / GPS Jamming"
    }, {
      value: "enemy_armor",
      label: "Enemy Armored Vehicle (detects/attacks GAVIN)"
    }, {
      value: "supply_chain_insider",
      label: "Supply Chain / FPGA Insider"
    }],
    acq: "mta_rf",
    role: "opfor",
    context: "Army/USMC joint, MTA ACAT II, delegated to Army March 2024. PEO Ground Combat Systems (Detroit Arsenal) / PEO LS Marine Corps (Quantico). Army 2,000 / USMC 500 units, IOC 3 years. Rapid Prototyping → down-select → Rapid Fielding. Mission 1 (Interoperability): laser designator on enemy armored vehicle 5-10 sec → UGV attack. Mission 2 (Seek & Destroy): onboard weapons, enemy detects/attacks GAVIN if detected within range. CTT OPFOR framework: (1) Potential Targets — identify critical assets/systems/data; (2) Desired Effects — outcomes/impact adversary seeks; (3) Goals — disruption/destruction/information; (4) Potential Attack Classes — vectors/techniques; (5) Context — time/environment/security controls. Control Structure and Sequence diagrams = 'playing field' for adversary. Criticality Analysis: Logic Bearing Components (ASIC/FPGA), System Impact Level, Loss Scenarios, Remediations. SCRE Design Patterns: Distributed Privileges, Data Input Validation, Single Access Point, Segmentation, Privilege Reduction — all in SysML Activity Diagrams. Contracting: SOW (criticality/vulnerability/countermeasure tasks), Section L/M (SCRE metrics/measures), CDRL (design pattern deliverables, monitoring, assurance procedures). CSA Level 2 traceability. NIST 800-160 V2R1 14 techniques + Sentinel.",
    elos: "ELO.14.A–ELO.15.E full + contracting/acquisition"
  }
};
const ACQ_PATHWAYS = [{
  value: "mta_rf",
  label: "MTA Rapid Fielding (DoDI 5000.80)"
}, {
  value: "mta_rp",
  label: "MTA Rapid Prototyping (DoDI 5000.80)"
}, {
  value: "mda",
  label: "MDA — Major Defense Acquisition (DoDI 5000.85)"
}, {
  value: "sw",
  label: "Software Acquisition Pathway (DoDI 5000.87)"
}, {
  value: "urgent",
  label: "Urgent Capability Acquisition (DoDI 5000.81)"
}, {
  value: "dbs",
  label: "Defense Business Systems (DoDI 5000.75)"
}, {
  value: "far",
  label: "FAR-Based Procurement"
}];
const ROLES = [{
  value: "gov_lse",
  label: "Government — Lead Systems Engineer"
}, {
  value: "gov_pm",
  label: "Government — Program Manager"
}, {
  value: "gov_sca",
  label: "Government — Security Control Assessor"
}, {
  value: "gov_ppo",
  label: "Government — Program Protection Officer"
}, {
  value: "contractor_se",
  label: "Contractor — Systems Engineer"
}, {
  value: "contractor_dev",
  label: "Contractor — Developer / Integrator"
}, {
  value: "contractor_ivv",
  label: "Contractor — IV&V / Test"
}, {
  value: "opfor",
  label: "OPFOR — Red Team / CTT Adversary Role"
}];
const SOPH = {
  1: "Tier 1 — Opportunistic (script kiddie, automated tools)",
  2: "Tier 2 — Organized Criminal (RaaS, DarkSide-style)",
  3: "Tier 3 — Sophisticated Criminal/Hacktivist",
  4: "Tier 4 — APT (Fancy Bear / APT28 level, XAgent)",
  5: "Tier 5 — Nation-State (Sandworm, SVR, PRC APT)",
  6: "Tier 6 — Co-Evolving / Zero-Day Capable (Stuxnet-level)"
};
const TABS = ["Narrative", "STPA-Sec", "Diagrams", "MITRE Matrix", "Requirements", "Cameo Export", "Raw"];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function extractSection(txt, header) {
  const m = txt.match(new RegExp("===\\s*" + header + "\\s*===([\\s\\S]*?)(?====|$)", "i"));
  return m ? m[1].trim() : null;
}
function cleanMermaid(code) {
  if (!code) return "";
  code = code.replace(/^```[\w]*\n?/gm, "").replace(/^```$/gm, "").trim();
  if (!code || code === "SKIP") return "";
  const isSeq = code.trimStart().startsWith("sequenceDiagram");
  const cleaned = code.split("\n").map(line => {
    const t = line.trim();
    if (/^-{2,}$/.test(t) || /^\/\//.test(t)) return null;
    if (isSeq) {
      line = line.replace(/---+\s*$/, "");
      if (t && !t.startsWith("sequenceDiagram") && !t.startsWith("participant") && !t.startsWith("Note") && !t.startsWith("note") && !t.startsWith("loop") && !t.startsWith("end") && !t.startsWith("alt") && !t.startsWith("opt") && !t.startsWith("rect") && !t.startsWith("autonumber") && !t.startsWith("title") && !t.startsWith("break") && !/^[\w]+\s*(?:->>|-->>|->|-->)\s*[\w]/.test(t) && t.length > 0) return null;
    } else {
      line = line.replace(/---+\s*$/, "");
      if (t && !t.startsWith("flowchart") && !t.startsWith("graph") && !t.startsWith("subgraph") && !t.startsWith("end") && !t.startsWith("style") && !t.startsWith("classDef") && !/(-->|---)/.test(t) && !/^[\w]+[\[\(\{<]/.test(t) && t.length > 0) return null;
    }
    return line;
  }).filter(l => l !== null);
  return cleaned.join("\n").trim();
}
function buildPrompt(mk, scen, sys, actor, soph, acq, role, extra, checks) {
  const mod = MODULES[mk];
  const arts = [checks.usecase && "Use Case Diagram in Mermaid flowchart syntax", checks.sequence && "Attack Sequence Diagram in Mermaid sequenceDiagram syntax", checks.bdd && "SysML Block Definition Diagram as ASCII art", checks.mitre && "MITRE ATT&CK ICS + Enterprise technique mapping", checks.req && "Formal security requirements (SHALL statements)", checks.coa && "Defensive Courses of Action", checks.stpa && "STPA-Sec Control Structure Analysis", checks.cameo && "Cameo/MagicDraw SysML export scaffold"].filter(Boolean);
  const ucRule = "Generate ONLY Mermaid (NOT PlantUML). Start: flowchart TD. Actors: rect node e.g. Op[Operator]. Use cases: round e.g. UC1(Monitor Area). Attacks: diamond e.g. ATK1{Inject Cmd}. Defenses: stadium e.g. DEF1([Detect Anomaly]). Arrows: --> only, labels use |text| syntax. Groups: subgraph Title ... end. Labels max 3 words. MAX 8 nodes per subgraph, 3 subgraphs. ALWAYS end completely. NO @startuml NO skinparam.";
  const seqRule = "Generate ONLY valid Mermaid sequenceDiagram syntax. STRICT: (1) First line exactly: sequenceDiagram (2) Declare participants: participant X as Name — MAX 5 participants (3) Messages ONLY: X->>Y: label or X-->>Y: label (4) Notes: Note over X: text (5) MAX 15 message lines (6) BANNED: --- separators, // comments, # headings, prose lines (7) Every message line format: ParticipantName->>OtherName: Short label";
  return `You are an expert CYB-5620V SCRE instructor at WARU (Defense Acquisition University).

CURRENT MODULE: ${mod.fullLabel}
MODULE FOCUS: ${mod.focus}
COURSE CONTEXT FROM SLIDES:
${mod.context}
RELEVANT ELOs: ${mod.elos}

SCENARIO PARAMETERS:
- Scenario: ${scen || mod.scenarios[0].label}
- System Under Analysis: ${sys || mod.systems[0].label}
- Threat Actor: ${actor || mod.actors[0].label}
- Threat Tier / Sophistication: ${SOPH[soph]}
- Acquisition Pathway: ${acq}
- Analyst Role: ${role}
- Additional Context: ${extra || "None"}

ARTIFACTS TO GENERATE:
${arts.map((a, i) => `${i + 1}. ${a}`).join("\n")}

Use EXACTLY these section headers with === on both sides:

===SCENARIO NARRATIVE===
3-4 paragraphs grounded in ${mod.fullLabel}. Include threat actor TTP chain, initial access vector, propagation through control structure, mission impact. Reference specific CVEs, DoDI citations, CRRM methodology steps, STPA-Sec concepts.

===USE CASE DIAGRAM===
${checks.usecase ? ucRule : "SKIP"}

===SEQUENCE DIAGRAM===
${checks.sequence ? seqRule : "SKIP"}

===BLOCK DEFINITION DIAGRAM===
${checks.bdd ? `ASCII SysML BDD for ${mod.fullLabel}. Show Attacker, Target System, Security/Resilience Control blocks with interfaces. MBSE BDD notation.` : "SKIP"}

===MITRE ATTACK MAPPING===
${checks.mitre ? `6-10 techniques most relevant to this module and scenario. Prefer ICS matrix (T0xxx) for OT/ICS scenarios. Format each line exactly: Tactic | TechniqueID | Technique Name | How it applies to this specific scenario` : "SKIP"}

===SECURITY REQUIREMENTS===
${checks.req ? `8-12 SHALL requirements. Format each line: REQ-ID | SHALL statement | Priority H/M/L | NIST 800-53 Control | Relevant DoDI. Ground in ${mod.fullLabel} context. Use CRRM/STPA-Sec methodology.` : "SKIP"}

===COURSES OF ACTION===
${checks.coa ? `5-8 COAs. Format: Name | Description | Effectiveness | Tradeoffs. Include SCRE-specific techniques (FOREST, Sentinel, NIST 800-160 v2 patterns).` : "SKIP"}

===STPA SEC ANALYSIS===
${checks.stpa ? `Full STPA-Sec grounded in ${mod.fullLabel}:
1. LOSSES (L-1 to L-5): unacceptable mission losses
2. HAZARDS (H-1 to H-6): system states leading to losses
3. CONTROL STRUCTURE: Controller, Control Actions, Controlled Process, Feedback paths
4. HAZARDOUS CONTROL ACTIONS: For 2 key control actions, list all 4 HCA types (not provided / wrong value / too early or late / wrong duration)
5. LOSS SCENARIOS (LS-1 to LS-4): adversary action → HCA type → hazard → loss chain` : "SKIP"}

===CAMEO EXPORT===
${checks.cameo ? `Output SysML scaffold:
BLOCKS:
  block SystemName { +missionType: String; +securityLevel: String }
  block AttackerName { +capability: String; +tier: String }
  block SecurityControl { +type: String; +mechanism: String }
USE_CASES:
  uc 1 ActorName Perform Primary Mission
  uc 2 AttackerName Execute Attack
  uc 3 Operator Monitor Status
REQUIREMENTS: (copy REQ-IDs and SHALL statements from requirements section)
TRACEABILITY:
  REQ-001 --> UseCase --> SystemBlock` : "SKIP"}

===DISCUSSION QUESTIONS===
5 discussion questions aligned to ${mod.elos}. Require application of CRRM/STPA-Sec. Reference specific module content, CVEs, DoDI citations.

Be technically precise. Use actual CVE numbers, DoDI references, protocol names, ICS attack names, and MBSE terminology.`;
}

// ── MERMAID HOOK ──────────────────────────────────────────────────────────────
function useMermaid() {
  const [ready, setReady] = useState(!!window.mermaid);
  useEffect(() => {
    if (window.mermaid) {
      setReady(true);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.6.1/mermaid.min.js";
    s.onload = () => {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: "default",
        securityLevel: "loose"
      });
      setReady(true);
    };
    document.head.appendChild(s);
  }, []);
  return ready;
}
function MermaidDiagram({
  code,
  title
}) {
  const [svg, setSvg] = useState("");
  const [err, setErr] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!code || !window.mermaid) return;
    setSvg("");
    setErr("");
    setReady(false);
    const id = "mmd" + Math.random().toString(36).slice(2);
    window.mermaid.render(id, code).then(({
      svg: s
    }) => {
      setSvg(s);
      setReady(true);
    }).catch(e => setErr(e.message || "Render error"));
  }, [code]);
  const save = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([svg], {
      type: "image/svg+xml"
    }));
    a.download = (title || "diagram").replace(/\s+/g, "_") + ".svg";
    a.click();
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid #0f3a5c",
      borderRadius: 4,
      marginBottom: 14,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "7px 12px",
      borderBottom: "1px solid #0f3a5c",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "rgba(0,212,255,.03)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Orbitron',monospace",
      fontSize: 10,
      color: "#ff6b35",
      letterSpacing: 2
    }
  }, "\u25B8 ", title), ready && /*#__PURE__*/React.createElement("button", {
    onClick: save,
    style: {
      background: "transparent",
      border: "1px solid #39ff14",
      color: "#39ff14",
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 10,
      padding: "2px 9px",
      cursor: "pointer",
      borderRadius: 2
    }
  }, "\u2193 SVG")), err && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 11,
      color: "#ff4444",
      background: "rgba(255,0,0,.05)"
    }
  }, "\u26A0 ", err), ready && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      background: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: svg
    },
    style: {
      maxWidth: "100%",
      overflowX: "auto"
    }
  })), !ready && !err && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 11,
      color: "#4a7a99"
    }
  }, "\u2B21 Rendering..."));
}

// ── MODALS ────────────────────────────────────────────────────────────────────
function ApiKeyModal({
  onSave
}) {
  const [val, setVal] = useState("");
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-box"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-title"
  }, "\u2B21 API Key Required"), /*#__PURE__*/React.createElement("div", {
    className: "modal-desc"
  }, "Enter your Anthropic API key to use the AI scenario generator.", /*#__PURE__*/React.createElement("br", null), "Stored only in your browser \u2014 sent only to api.anthropic.com.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), "Get a key at: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "#00d4ff"
    }
  }, "console.anthropic.com")), /*#__PURE__*/React.createElement("input", {
    className: "modal-input",
    type: "password",
    placeholder: "sk-ant-api03-...",
    value: val,
    onChange: e => setVal(e.target.value),
    onKeyDown: e => e.key === "Enter" && val.startsWith("sk-") && onSave(val),
    autoFocus: true
  }), /*#__PURE__*/React.createElement("button", {
    className: "modal-btn",
    onClick: () => val.startsWith("sk-") && onSave(val),
    disabled: !val.startsWith("sk-")
  }, "\u2B21 Save Key & Launch"), /*#__PURE__*/React.createElement("div", {
    className: "modal-warn"
  }, "\u26A0 Each generation ~6,000 tokens (~$0.02\u20130.05 on Sonnet). Use a dedicated key with usage cap for classroom.")));
}

// ── THREAT ATLAS COMPONENT ────────────────────────────────────────────────────
function ThreatAtlas() {
  const [view, setView] = useState("tiers");
  const [selected, setSelected] = useState(null);
  const tabs = [{
    k: "tiers",
    l: "Threat Tiers"
  }, {
    k: "apts",
    l: "APT Profiles"
  }, {
    k: "attacks",
    l: "ICS Attack Timeline"
  }, {
    k: "taxonomy",
    l: "Attack Taxonomy"
  }, {
    k: "scre",
    l: "SCRE Techniques"
  }];
  const BtnStyle = k => ({
    background: "none",
    border: "1px solid",
    borderColor: view === k ? "#00d4ff" : "#0f3a5c",
    color: view === k ? "#00d4ff" : "#4a7a99",
    fontFamily: "'Orbitron',monospace",
    fontSize: 9,
    letterSpacing: 1,
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: 2,
    transition: "all .15s"
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      flexWrap: "wrap",
      marginBottom: 14
    }
  }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.k,
    style: BtnStyle(t.k),
    onClick: () => {
      setView(t.k);
      setSelected(null);
    }
  }, t.l))), view === "tiers" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 10,
      color: "#4a7a99",
      marginBottom: 10
    }
  }, "// CSE Guide 3.0 \u2014 Threat tier co-evolution. Need a PROACTIVE approach for zero-day APT capability. //"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
      gap: 10
    }
  }, THREAT_TIERS.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.tier,
    style: {
      background: "#070f1a",
      border: `1px solid ${t.color}44`,
      borderLeft: `3px solid ${t.color}`,
      borderRadius: 3,
      padding: 12,
      cursor: "pointer"
    },
    onClick: () => setSelected(selected === t.tier ? null : t.tier)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Orbitron',monospace",
      fontSize: 11,
      color: t.color,
      letterSpacing: 2
    }
  }, "TIER ", t.tier), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 10,
      color: t.color,
      background: `${t.color}18`,
      border: `1px solid ${t.color}44`,
      borderRadius: 2,
      padding: "2px 8px"
    }
  }, t.label)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: "#c8dde8",
      lineHeight: 1.6,
      marginBottom: 8
    }
  }, t.desc), selected === t.tier && /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: `1px solid ${t.color}33`,
      paddingTop: 8,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 9,
      color: t.color,
      letterSpacing: 1,
      marginBottom: 4
    }
  }, "EXAMPLES"), t.examples.map((e, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      fontSize: 11,
      color: "#4a7a99",
      padding: "2px 0"
    }
  }, "\u2022 ", e))))))), view === "apts" && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, APT_PROFILES.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.id,
    style: {
      background: "#070f1a",
      border: `1px solid ${a.color}44`,
      borderLeft: `3px solid ${a.color}`,
      borderRadius: 3,
      padding: 14,
      cursor: "pointer"
    },
    onClick: () => setSelected(selected === a.id ? null : a.id)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Orbitron',monospace",
      fontSize: 13,
      color: a.color
    }
  }, a.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 10,
      color: "#4a7a99",
      marginLeft: 10
    }
  }, a.aliases)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 9,
      color: a.color,
      border: `1px solid ${a.color}44`,
      borderRadius: 2,
      padding: "2px 7px"
    }
  }, "TIER ", a.tier), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 9,
      color: "#a78bfa",
      border: "1px solid #a78bfa44",
      borderRadius: 2,
      padding: "2px 7px"
    }
  }, a.nation))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#c8dde8",
      lineHeight: 1.6,
      marginBottom: 6
    }
  }, a.note), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 10,
      color: "#00d4ff"
    }
  }, "Course: ", a.relevance), selected === a.id && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Orbitron',monospace",
      fontSize: 9,
      color: a.color,
      letterSpacing: 1,
      marginBottom: 6
    }
  }, "IMPLANTS / TOOLS"), a.implants.map((im, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 10,
      color: "#ff4444",
      padding: "2px 0"
    }
  }, "\u25C8 ", im))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Orbitron',monospace",
      fontSize: 9,
      color: a.color,
      letterSpacing: 1,
      marginBottom: 6
    }
  }, "TTPs"), a.ttps.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 10,
      color: "#4a7a99",
      padding: "2px 0"
    }
  }, "\u2022 ", t))))))), view === "attacks" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 10,
      color: "#4a7a99",
      marginBottom: 10
    }
  }, "// ICS Attack History \u2014 Timeline of adversary evolution. Each attack more capable than the last. //"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      paddingLeft: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 10,
      top: 0,
      bottom: 0,
      width: 2,
      background: "linear-gradient(to bottom,#ff0040,#00d4ff)"
    }
  }), ICS_ATTACKS.map(atk => /*#__PURE__*/React.createElement("div", {
    key: atk.id,
    style: {
      marginBottom: 14,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: -20,
      top: 14,
      width: 12,
      height: 12,
      borderRadius: "50%",
      background: atk.color,
      border: "2px solid #040d14",
      boxShadow: `0 0 8px ${atk.color}`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#070f1a",
      border: `1px solid ${atk.color}44`,
      borderRadius: 3,
      padding: 13,
      cursor: "pointer"
    },
    onClick: () => setSelected(selected === atk.id ? null : atk.id)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 6,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Orbitron',monospace",
      fontSize: 11,
      color: atk.color
    }
  }, atk.year), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Orbitron',monospace",
      fontSize: 13,
      color: "#fff"
    }
  }, atk.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 9,
      color: atk.color,
      border: `1px solid ${atk.color}44`,
      borderRadius: 2,
      padding: "1px 6px"
    }
  }, atk.type)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 9,
      color: "#4a7a99"
    }
  }, "TIER ", atk.tier)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#c8dde8",
      lineHeight: 1.5,
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "#4a7a99"
    }
  }, "Target:"), " ", atk.target), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#c8dde8",
      lineHeight: 1.5,
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "#4a7a99"
    }
  }, "Effect:"), " ", atk.effect), selected === atk.id && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      borderTop: `1px solid ${atk.color}33`,
      paddingTop: 10,
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#4a7a99",
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "#ff6b35"
    }
  }, "Method:"), " ", atk.method), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#4a7a99",
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "#a78bfa"
    }
  }, "STPA-Sec Impact:"), " ", atk.stpa_impact), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#4a7a99",
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "#fbbf24"
    }
  }, "Legacy:"), " ", atk.legacy), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#ff4444"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "CVEs:"), " ", atk.cves), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 10,
      color: "#00d4ff",
      background: "rgba(0,212,255,.04)",
      border: "1px solid rgba(0,212,255,.2)",
      borderRadius: 2,
      padding: "6px 10px"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "FOREST:"), " ", atk.forest_node))))))), view === "taxonomy" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 10,
      color: "#4a7a99",
      marginBottom: 10
    }
  }, "// STPA-Sec Adversity Taxonomy \u2014 How control loop failures are caused by adversaries. Module 4 core concept. //"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
      gap: 10
    }
  }, ATTACK_TAXONOMY.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.type,
    style: {
      background: "#070f1a",
      border: `1px solid ${t.color}44`,
      borderRadius: 3,
      padding: 13
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20,
      color: t.color
    }
  }, t.icon), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Orbitron',monospace",
      fontSize: 12,
      color: t.color,
      letterSpacing: 2
    }
  }, t.type)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: "#c8dde8",
      lineHeight: 1.6,
      marginBottom: 8
    }
  }, t.desc), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 9,
      color: t.color,
      marginBottom: 4
    }
  }, "STPA-SEC HCA LINK"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: "#4a7a99",
      lineHeight: 1.5,
      marginBottom: 8
    }
  }, t.stpa), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 9,
      color: "#ff6b35",
      marginBottom: 4
    }
  }, "MITRE ID"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 10,
      color: "#ff6b35",
      marginBottom: 8
    }
  }, t.mitre), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 9,
      color: "#4a7a99",
      marginBottom: 3
    }
  }, "REAL-WORLD EXAMPLE"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 10,
      color: "#4a7a99",
      lineHeight: 1.5
    }
  }, t.example))))), view === "scre" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 10,
      color: "#4a7a99",
      marginBottom: 10
    }
  }, "// NIST 800-160 v2 \u2014 14 Resiliency Techniques. Key patterns for SCRE building blocks. //"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
      gap: 10
    }
  }, SCRE_TECHNIQUES.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    style: {
      background: "#070f1a",
      border: `1px solid ${t.color}44`,
      borderLeft: `3px solid ${t.color}`,
      borderRadius: 3,
      padding: 13
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Orbitron',monospace",
      fontSize: 11,
      color: t.color
    }
  }, t.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 9,
      color: "#4a7a99",
      border: "1px solid #0f3a5c",
      borderRadius: 2,
      padding: "1px 5px"
    }
  }, t.nist)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: "#c8dde8",
      lineHeight: 1.6,
      marginBottom: 8
    }
  }, t.desc), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 9,
      color: t.color,
      marginBottom: 4
    }
  }, "PATTERN / IMPLEMENTATION"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 10,
      color: "#4a7a99",
      lineHeight: 1.5
    }
  }, t.pattern))))));
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
function MBSEBuilder() {
  var _renderers$tab;
  const mermaidReady = useMermaid();
  const [apiKey, setApiKey] = useState("server-side"); // API key handled server-side by /api/generate
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [appMode, setAppMode] = useState("builder"); // "builder" | "atlas"
  const saveKey = k => {
    // key stored server-side
    setApiKey(k);
    setShowKeyModal(false);
  };
  const [mk, setMk] = useState("m6");
  const mod = MODULES[mk];
  const [scen, setScen] = useState("");
  const [sys, setSys] = useState("");
  const [actor, setActor] = useState("");
  const [soph, setSoph] = useState(4);
  const [acq, setAcq] = useState("mta_rf");
  const [role, setRole] = useState("gov_lse");
  const [extra, setExtra] = useState("");
  const [checks, setChecks] = useState({
    usecase: true,
    sequence: true,
    bdd: true,
    mitre: true,
    req: true,
    coa: false,
    stpa: true,
    cameo: true
  });
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("Narrative");
  const [raw, setRaw] = useState("");
  const [parsed, setParsed] = useState(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    setScen("");
    setSys("");
    setActor("");
    setParsed(null);
    setRaw("");
    setAcq(mod.acq);
    setRole(mod.role);
  }, [mk]);
  const toggle = k => setChecks(c => ({
    ...c,
    [k]: !c[k]
  }));
  const generate = async () => {
    if (false && !apiKey) { // key is server-side, skip this check
      setShowKeyModal(true);
      return;
    }
    setLoading(true);
    setRaw("");
    setParsed(null);
    setTab("Narrative");
    try {
      var _data$error;
      const callProxy = (password) => fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: password || undefined,
          messages: [{ role: "user", content: buildPrompt(mk, scen, sys, actor, soph, acq, role, extra, checks) }],
        }),
      });
      let res = await callProxy(sessionStorage.getItem("mbse_pw"));
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
        usecase: cleanMermaid(extractSection(full, "USE CASE DIAGRAM")),
        sequence: cleanMermaid(extractSection(full, "SEQUENCE DIAGRAM")),
        bdd: extractSection(full, "BLOCK DEFINITION DIAGRAM"),
        mitre: extractSection(full, "MITRE ATTACK MAPPING"),
        req: extractSection(full, "SECURITY REQUIREMENTS"),
        coa: extractSection(full, "COURSES OF ACTION"),
        stpa: extractSection(full, "STPA SEC ANALYSIS"),
        cameo: extractSection(full, "CAMEO EXPORT"),
        dq: extractSection(full, "DISCUSSION QUESTIONS")
      });
    } catch (e) {
      setRaw("ERROR: " + e.message);
      setParsed({
        error: e.message
      });
    } finally {
      setLoading(false);
    }
  };
  const copy = txt => {
    navigator.clipboard.writeText(txt || raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const PH = ({
    t
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: 280,
      gap: 9,
      color: "#4a7a99",
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 11,
      letterSpacing: 2,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 30,
      opacity: .18
    }
  }, "\u2B21"), /*#__PURE__*/React.createElement("p", null, t));
  const xmlEsc = str => String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const generateXMI = (cameoText, reqText) => {
    const ts = new Date().toISOString();
    const modName = (MODULES[mk] ? MODULES[mk].fullLabel : "SCRE_Model").replace(/[^a-zA-Z0-9_]/g, "_");
    const uid = () => "_id_" + Math.random().toString(36).slice(2, 9);
    const reqLines = (reqText || "").split("\n").filter(l => l.indexOf("|") >= 0);
    const reqs = reqLines.map((line, i) => {
      const p = line.split("|").map(s => s.trim());
      return {
        id: p[0] || "REQ-" + ("00" + (i + 1)).slice(-3),
        text: xmlEsc(p[1] || ""),
        priority: p[2] || "M",
        nist: xmlEsc(p[3] || ""),
        xid: uid(),
        pid: uid(),
        nid: uid()
      };
    });
    const blockRe = /block\s+([\w]+)/g;
    const blockMatches = [];
    let bm;
    while ((bm = blockRe.exec(cameoText || "")) !== null) blockMatches.push(bm[1]);
    const blocks = blockMatches.length > 0 ? blockMatches : ["SystemBlock", "AttackerBlock", "SecurityControlBlock"];
    const blockIds = {};
    blocks.forEach(b => {
      blockIds[b] = uid();
    });
    const ucList = ["Deploy System", "Monitor Area", "Detect Anomaly", "Respond to Threat"];
    const ucIds = {};
    ucList.forEach(u => {
      ucIds[u] = uid();
    });
    const pkgId = uid(),
      crrmId = uid(),
      reqPkgId = uid(),
      ucPkgId = uid();
    const out = [];
    out.push('<?xml version="1.0" encoding="UTF-8"?>');
    out.push('<xmi:XMI xmi:version="2.1" xmlns:xmi="http://schema.omg.org/spec/XMI/2.1" xmlns:uml="http://www.eclipse.org/uml2/5.0.0/UML" xmlns:SysML="http://www.omg.org/spec/SysML/20181001/SysML">');
    out.push(`  <!-- CYB-5620V MBSE Builder - WARU | ${ts} -->`);
    out.push(`  <uml:Model xmi:id="${pkgId}" name="${modName}">`);
    out.push(`    <packagedElement xmi:type="uml:Package" xmi:id="${crrmId}" name="${modName}_CRRM">`);
    out.push(`      <packagedElement xmi:type="uml:Package" xmi:id="${uid()}" name="HazardAnalysis"/>`);
    out.push(`      <packagedElement xmi:type="uml:Package" xmi:id="${uid()}" name="LossScenarios"/>`);
    out.push(`      <packagedElement xmi:type="uml:Package" xmi:id="${uid()}" name="AssuranceCases"/>`);
    out.push(`    </packagedElement>`);
    out.push(`    <packagedElement xmi:type="uml:Package" xmi:id="${reqPkgId}" name="${modName}_Requirements">`);
    reqs.forEach(r => {
      out.push(`      <packagedElement xmi:type="uml:Class" xmi:id="${r.xid}" name="${r.id}"><ownedComment xmi:type="uml:Comment"><body>${r.text}</body></ownedComment><ownedAttribute xmi:type="uml:Property" name="priority" xmi:id="${r.pid}"><defaultValue xmi:type="uml:LiteralString" value="${r.priority}"/></ownedAttribute><ownedAttribute xmi:type="uml:Property" name="nist_control" xmi:id="${r.nid}"><defaultValue xmi:type="uml:LiteralString" value="${r.nist}"/></ownedAttribute></packagedElement>`);
    });
    out.push(`    </packagedElement>`);
    out.push(`    <packagedElement xmi:type="uml:Package" xmi:id="${ucPkgId}" name="${modName}_UseCases">`);
    ucList.forEach(uc => {
      out.push(`      <packagedElement xmi:type="uml:UseCase" xmi:id="${ucIds[uc]}" name="${xmlEsc(uc)}"/>`);
    });
    out.push(`    </packagedElement>`);
    blocks.forEach(b => {
      out.push(`    <packagedElement xmi:type="uml:Class" xmi:id="${blockIds[b]}" name="${b}"><appliedStereotype xmi:type="SysML:Block"/></packagedElement>`);
    });
    reqs.forEach((r, i) => {
      const tgt = blocks[i % blocks.length];
      out.push(`    <packagedElement xmi:type="uml:Abstraction" xmi:id="${uid()}" name="deriveReqt_${r.id}" client="${r.xid}" supplier="${blockIds[tgt]}"><appliedStereotype xmi:type="SysML:DeriveReqt"/></packagedElement>`);
    });
    out.push(`  </uml:Model></xmi:XMI>`);
    return out.join("\n");
  };
  const generateCSV = reqText => {
    const rows = ["REQ-ID,SHALL Statement,Priority,NIST 800-53 Control,DoDI Reference,Verification Method,Status"];
    (reqText || "").split("\n").filter(l => l.indexOf("|") >= 0).forEach(line => {
      const p = line.split("|").map(s => s.trim());
      const q = v => '"' + (v || "").replace(/"/g, '""') + '"';
      rows.push([q(p[0]), q(p[1]), q(p[2] || "M"), q(p[3]), q(p[4]), q("Inspection/Test"), q("Draft")].join(","));
    });
    return rows.join("\n");
  };
  const dlFile = (content, filename, mime) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], {
      type: mime
    }));
    a.download = filename;
    a.click();
  };

  // Renderers
  const rNarrative = () => {
    if (!parsed) return /*#__PURE__*/React.createElement(PH, {
      t: "Select module \xB7 Configure scenario \xB7 Click GENERATE"
    });
    if (parsed.error) return /*#__PURE__*/React.createElement("div", {
      style: {
        color: "#ff4444",
        padding: 13,
        fontFamily: "'Share Tech Mono',monospace",
        fontSize: 12
      }
    }, "ERROR: ", parsed.error);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 13
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Orbitron',monospace",
        fontSize: 10,
        color: mod.color,
        letterSpacing: 2,
        marginBottom: 8
      }
    }, "\u25B8 ", mod.fullLabel.toUpperCase()), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Rajdhani',sans-serif",
        fontSize: 15,
        lineHeight: 1.8
      }
    }, (parsed.narrative || "").split("\n\n").map((p, i) => /*#__PURE__*/React.createElement("p", {
      key: i,
      style: {
        marginBottom: 11
      }
    }, p))), parsed.dq && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 14,
        paddingTop: 12,
        borderTop: "1px solid #0f3a5c"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Orbitron',monospace",
        fontSize: 10,
        color: "#ff6b35",
        letterSpacing: 2,
        marginBottom: 7
      }
    }, "\u25B8 DISCUSSION QUESTIONS"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        color: "#4a7a99",
        whiteSpace: "pre-wrap",
        lineHeight: 1.8,
        fontFamily: "'Rajdhani',sans-serif"
      }
    }, parsed.dq)));
  };
  const rStpa = () => {
    if (!parsed || parsed.error) return /*#__PURE__*/React.createElement(PH, {
      t: "Generate a scenario first"
    });
    if (!parsed.stpa || parsed.stpa === "SKIP") return /*#__PURE__*/React.createElement(PH, {
      t: "STPA-Sec not selected"
    });
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 13
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Orbitron',monospace",
        fontSize: 10,
        color: "#00d4ff",
        letterSpacing: 2,
        marginBottom: 9
      }
    }, "\u25B8 STPA-SEC CONTROL STRUCTURE ANALYSIS"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Share Tech Mono',monospace",
        fontSize: 10,
        color: "#4a7a99",
        marginBottom: 10
      }
    }, "// ", mod.fullLabel, " \xB7 CRRM Methodology //"), /*#__PURE__*/React.createElement("pre", {
      style: {
        background: "rgba(0,212,255,.02)",
        border: "1px solid #0f3a5c",
        borderRadius: 3,
        padding: 12,
        fontFamily: "'Share Tech Mono',monospace",
        fontSize: 11,
        color: "#c8dde8",
        whiteSpace: "pre-wrap",
        lineHeight: 1.8
      }
    }, parsed.stpa));
  };
  const rDiagrams = () => {
    if (!parsed || parsed.error) return /*#__PURE__*/React.createElement(PH, {
      t: "Generate a scenario first"
    });
    if (!mermaidReady) return /*#__PURE__*/React.createElement(PH, {
      t: "Loading Mermaid renderer..."
    });
    const diags = [parsed.usecase && parsed.usecase !== "SKIP" && {
      code: parsed.usecase,
      title: "Use Case Diagram"
    }, parsed.sequence && parsed.sequence !== "SKIP" && {
      code: parsed.sequence,
      title: "Attack Sequence Diagram"
    }].filter(Boolean);
    const hasBdd = parsed.bdd && parsed.bdd !== "SKIP";
    if (!diags.length && !hasBdd) return /*#__PURE__*/React.createElement(PH, {
      t: "No diagrams selected"
    });
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 13
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: "rgba(57,255,20,.05)",
        border: "1px solid rgba(57,255,20,.2)",
        borderRadius: 3,
        padding: "6px 11px",
        marginBottom: 12,
        fontFamily: "'Share Tech Mono',monospace",
        fontSize: 10,
        color: "#86efac",
        lineHeight: 1.8
      }
    }, "\u25B8 Right-click \u2192 Copy Image \u2192 PowerPoint/Word | \u2193 SVG \u2192 Chrome \u2192 Print \u2192 PDF"), diags.map((d, i) => /*#__PURE__*/React.createElement(MermaidDiagram, {
      key: i,
      code: d.code,
      title: d.title
    })), hasBdd && /*#__PURE__*/React.createElement("div", {
      style: {
        background: "rgba(0,212,255,.02)",
        border: "1px solid #0f3a5c",
        borderRadius: 3,
        padding: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Orbitron',monospace",
        fontSize: 10,
        color: "#ff6b35",
        letterSpacing: 2,
        marginBottom: 7
      }
    }, "\u25B8 BLOCK DEFINITION DIAGRAM (SysML/ASCII)"), /*#__PURE__*/React.createElement("pre", {
      style: {
        fontFamily: "'Share Tech Mono',monospace",
        fontSize: 11,
        color: "#39ff14",
        whiteSpace: "pre",
        overflowX: "auto",
        lineHeight: 1.6
      }
    }, parsed.bdd)));
  };
  const rMitre = () => {
    if (!parsed || parsed.error) return /*#__PURE__*/React.createElement(PH, {
      t: "Generate a scenario first"
    });
    if (!parsed.mitre || parsed.mitre === "SKIP") return /*#__PURE__*/React.createElement(PH, {
      t: "MITRE mapping not selected"
    });
    const sevMap = {
      initial: "h",
      execution: "h",
      persistence: "m",
      lateral: "m",
      exfil: "h",
      impact: "h",
      command: "m",
      discovery: "l",
      collection: "l",
      inhibit: "h",
      impair: "h"
    };
    const lines = parsed.mitre.split("\n").filter(l => l.includes("|"));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 13
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Orbitron',monospace",
        fontSize: 10,
        color: "#00d4ff",
        letterSpacing: 2,
        marginBottom: 9
      }
    }, "\u25B8 MITRE ATT&CK \u2014 ", mod.label.toUpperCase()), /*#__PURE__*/React.createElement("table", {
      style: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: 11
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ["Tactic", "ID", "Technique", "Application"].map(h => /*#__PURE__*/React.createElement("th", {
      key: h,
      style: {
        background: "rgba(0,212,255,.08)",
        color: "#00d4ff",
        padding: "6px 8px",
        textAlign: "left",
        border: "1px solid #0f3a5c",
        fontSize: 10,
        letterSpacing: 1
      }
    }, h)))), /*#__PURE__*/React.createElement("tbody", null, lines.map((line, i) => {
      var _Object$entries$find;
      const cols = line.split("|").map(c => c.trim()).filter(Boolean);
      if (cols.length < 3) return null;
      const sev = ((_Object$entries$find = Object.entries(sevMap).find(([k]) => (cols[0] || "").toLowerCase().includes(k))) === null || _Object$entries$find === void 0 ? void 0 : _Object$entries$find[1]) || "l";
      const badge = sev === "h" ? "#ff0040" : sev === "m" ? "#ff6b35" : "#39ff14";
      const badgeBg = sev === "h" ? "rgba(255,0,64,.18)" : sev === "m" ? "rgba(255,107,53,.18)" : "rgba(57,255,20,.1)";
      return /*#__PURE__*/React.createElement("tr", {
        key: i
      }, /*#__PURE__*/React.createElement("td", {
        style: {
          padding: "5px 8px",
          border: "1px solid rgba(15,58,92,.5)",
          color: "#c8dde8"
        }
      }, cols[0]), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: "5px 8px",
          border: "1px solid rgba(15,58,92,.5)"
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: "inline-block",
          padding: "2px 5px",
          borderRadius: 2,
          fontSize: 10,
          fontWeight: "bold",
          background: badgeBg,
          color: badge,
          border: `1px solid ${badge}55`
        }
      }, cols[1])), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: "5px 8px",
          border: "1px solid rgba(15,58,92,.5)",
          color: "#c8dde8"
        }
      }, cols[2]), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: "5px 8px",
          border: "1px solid rgba(15,58,92,.5)",
          color: "#4a7a99",
          fontSize: 11
        }
      }, cols[3] || ""));
    }))), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "'Share Tech Mono',monospace",
        fontSize: 10,
        color: "#4a7a99",
        marginTop: 8
      }
    }, "// Import IDs into attack.mitre.org/navigator | Use ICS matrix (T0xxx) for OT scenarios //"));
  };
  const rReqs = () => {
    if (!parsed || parsed.error) return /*#__PURE__*/React.createElement(PH, {
      t: "Generate a scenario first"
    });
    const hasR = parsed.req && parsed.req !== "SKIP",
      hasC = parsed.coa && parsed.coa !== "SKIP";
    if (!hasR && !hasC) return /*#__PURE__*/React.createElement(PH, {
      t: "Requirements / COA not selected"
    });
    const slug = (MODULES[mk] ? MODULES[mk].label : "SCRE").replace(/[^a-zA-Z0-9]/g, "_");
    return /*#__PURE__*/React.createElement("div", null, hasR && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 13
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 9
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Orbitron',monospace",
        fontSize: 10,
        color: "#00d4ff",
        letterSpacing: 2
      }
    }, "\u25B8 SECURITY REQUIREMENTS \u2014 ", mod.label.toUpperCase()), /*#__PURE__*/React.createElement("button", {
      style: {
        background: "transparent",
        border: "1px solid #34d399",
        color: "#34d399",
        fontFamily: "'Share Tech Mono',monospace",
        fontSize: 10,
        padding: "3px 10px",
        cursor: "pointer",
        borderRadius: 2
      },
      onClick: () => dlFile(generateCSV(parsed.req), slug + "_Requirements.csv", "text/csv")
    }, "\u2193 CSV")), /*#__PURE__*/React.createElement("pre", {
      style: {
        fontFamily: "'Share Tech Mono',monospace",
        fontSize: 11,
        color: "#c8dde8",
        whiteSpace: "pre-wrap",
        lineHeight: 1.8
      }
    }, parsed.req)), hasC && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 13,
        borderTop: hasR ? "1px solid #0f3a5c" : "none"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Orbitron',monospace",
        fontSize: 10,
        color: "#ff6b35",
        letterSpacing: 2,
        marginBottom: 9
      }
    }, "\u25B8 COURSES OF ACTION"), /*#__PURE__*/React.createElement("pre", {
      style: {
        fontFamily: "'Share Tech Mono',monospace",
        fontSize: 11,
        color: "#c8dde8",
        whiteSpace: "pre-wrap",
        lineHeight: 1.8
      }
    }, parsed.coa)));
  };
  const rCameo = () => {
    if (!parsed || parsed.error) return /*#__PURE__*/React.createElement(PH, {
      t: "Generate a scenario first"
    });
    if (!parsed.cameo || parsed.cameo === "SKIP") return /*#__PURE__*/React.createElement(PH, {
      t: "Cameo Export not selected"
    });
    const slug = (MODULES[mk] ? MODULES[mk].label : "SCRE").replace(/[^a-zA-Z0-9]/g, "_");
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        padding: "8px 12px",
        borderBottom: "1px solid #0f3a5c",
        flexWrap: "wrap",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("button", {
      style: {
        background: "transparent",
        border: "1px solid #0f3a5c",
        color: "#4a7a99",
        fontFamily: "'Share Tech Mono',monospace",
        fontSize: 10,
        padding: "3px 8px",
        cursor: "pointer",
        borderRadius: 2
      },
      onClick: () => copy(parsed.cameo)
    }, copied ? "[ COPIED! ]" : "[ COPY SCAFFOLD ]"), /*#__PURE__*/React.createElement("button", {
      style: {
        background: "transparent",
        border: "1px solid #a78bfa",
        color: "#a78bfa",
        fontFamily: "'Share Tech Mono',monospace",
        fontSize: 10,
        padding: "3px 10px",
        cursor: "pointer",
        borderRadius: 2
      },
      onClick: () => dlFile(generateXMI(parsed.cameo, parsed.req), slug + "_SysML.xmi", "application/xml")
    }, "\u2193 XMI (Cameo/MagicDraw)"), /*#__PURE__*/React.createElement("button", {
      style: {
        background: "transparent",
        border: "1px solid #34d399",
        color: "#34d399",
        fontFamily: "'Share Tech Mono',monospace",
        fontSize: 10,
        padding: "3px 10px",
        cursor: "pointer",
        borderRadius: 2
      },
      onClick: () => dlFile(generateCSV(parsed.req), slug + "_Requirements.csv", "text/csv")
    }, "\u2193 CSV (Requirements)")), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 13
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: "rgba(167,139,250,.06)",
        border: "1px solid rgba(167,139,250,.3)",
        borderRadius: 3,
        padding: 11,
        fontSize: 12,
        lineHeight: 1.8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Orbitron',monospace",
        fontSize: 9,
        color: "#a78bfa",
        letterSpacing: 2,
        marginBottom: 6
      }
    }, "XMI \u2192 CAMEO/MAGICDRAW"), "1. Download .xmi", /*#__PURE__*/React.createElement("br", null), "2. Open SysML project", /*#__PURE__*/React.createElement("br", null), "3. ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: "#a78bfa"
      }
    }, "File \u2192 Import XMI"), /*#__PURE__*/React.createElement("br", null), "4. Packages, Blocks, Requirements appear", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#4a7a99",
        fontSize: 11
      }
    }, "Cameo Systems Modeler 2021x+")), /*#__PURE__*/React.createElement("div", {
      style: {
        background: "rgba(52,211,153,.06)",
        border: "1px solid rgba(52,211,153,.3)",
        borderRadius: 3,
        padding: 11,
        fontSize: 12,
        lineHeight: 1.8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Orbitron',monospace",
        fontSize: 9,
        color: "#34d399",
        letterSpacing: 2,
        marginBottom: 6
      }
    }, "CSV \u2192 MAGICDRAW REQUIREMENTS"), "1. Download .csv", /*#__PURE__*/React.createElement("br", null), "2. Open MagicDraw", /*#__PURE__*/React.createElement("br", null), "3. ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: "#34d399"
      }
    }, "Tools \u2192 Data Import"), /*#__PURE__*/React.createElement("br", null), "4. Map: REQ-ID, SHALL, Priority, NIST, DoDI", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#4a7a99",
        fontSize: 11
      }
    }, "MagicDraw 2022+ / Cameo"))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Orbitron',monospace",
        fontSize: 10,
        color: "#00d4ff",
        letterSpacing: 2,
        marginBottom: 9
      }
    }, "\u25B8 SYSML SCAFFOLD"), /*#__PURE__*/React.createElement("pre", {
      style: {
        background: "rgba(0,212,255,.02)",
        border: "1px solid #0f3a5c",
        borderRadius: 3,
        padding: 12,
        fontFamily: "'Share Tech Mono',monospace",
        fontSize: 11,
        color: "#39ff14",
        whiteSpace: "pre-wrap",
        lineHeight: 1.8,
        maxHeight: "36vh",
        overflowY: "auto"
      }
    }, parsed.cameo)));
  };
  const rRaw = () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      padding: "5px 11px",
      borderBottom: "1px solid #0f3a5c"
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      background: "transparent",
      border: "1px solid #0f3a5c",
      color: "#4a7a99",
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 10,
      padding: "3px 8px",
      cursor: "pointer",
      borderRadius: 2
    },
    onClick: () => copy(raw)
  }, copied ? "[ COPIED! ]" : "[ COPY RAW ]")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 13,
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 11,
      whiteSpace: "pre-wrap",
      lineHeight: 1.8,
      maxHeight: "55vh",
      overflowY: "auto"
    }
  }, raw || /*#__PURE__*/React.createElement(PH, {
    t: "Raw output appears here"
  })));
  const renderers = {
    "Narrative": rNarrative,
    "STPA-Sec": rStpa,
    "Diagrams": rDiagrams,
    "MITRE Matrix": rMitre,
    "Requirements": rReqs,
    "Cameo Export": rCameo,
    "Raw": rRaw
  };
  const css = `
    .r{background:#040d14;color:#c8dde8;font-family:'Rajdhani',sans-serif;font-size:15px;min-height:100vh;padding:14px}
    .inner{max-width:1400px;margin:0 auto}
    .hdr{text-align:center;padding:14px 0 10px;border-bottom:1px solid #0f3a5c;margin-bottom:0}
    .ey{font-family:'Share Tech Mono',monospace;font-size:10px;color:#00d4ff;letter-spacing:4px;text-transform:uppercase;margin-bottom:4px}
    .ttl{font-family:'Orbitron',monospace;font-size:clamp(15px,2.6vw,26px);font-weight:900;color:#fff;text-shadow:0 0 18px rgba(0,212,255,.4)}
    .ttl span{color:#00d4ff}
    .sub{font-family:'Share Tech Mono',monospace;font-size:10px;color:#4a7a99;letter-spacing:2px;margin-top:4px}
    .mode-bar{display:flex;align-items:center;gap:3px;padding:6px 8px;background:#050e1a;border:1px solid #0f3a5c;border-top:none}
    .mode-divider{width:1px;height:18px;background:#0f3a5c;margin:0 4px}
    .mb{background:none;border:1px solid transparent;color:#4a7a99;font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:1px;text-transform:uppercase;padding:5px 8px;cursor:pointer;border-radius:2px;transition:all .15s;white-space:nowrap}
    .mb:hover{color:#c8dde8}
    .mb.on{border-color:var(--c);color:var(--c);background:rgba(255,255,255,.03)}
    .mode-btn{background:none;border:1px solid;font-family:'Orbitron',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;padding:5px 12px;cursor:pointer;border-radius:2px;transition:all .15s}
    .grid{display:grid;grid-template-columns:308px 1fr;gap:12px;margin-top:10px}
    @media(max-width:800px){.grid{grid-template-columns:1fr}}
    .panel{background:#070f1a;border:1px solid #0f3a5c;border-radius:3px}
    .ph{padding:8px 12px;border-bottom:1px solid #0f3a5c;display:flex;align-items:center;gap:8px}
    .pt{font-family:'Orbitron',monospace;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase}
    .dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;animation:blink 1.5s ease-in-out infinite}
    .pb{padding:11px}
    .lbl{display:block;font-family:'Share Tech Mono',monospace;font-size:9px;color:#00d4ff;letter-spacing:2px;text-transform:uppercase;margin-bottom:3px;margin-top:9px}
    .lbl:first-child{margin-top:0}
    select,.ta{width:100%;background:rgba(0,212,255,.04);border:1px solid #0f3a5c;color:#c8dde8;font-family:'Rajdhani',sans-serif;font-size:13px;padding:5px 8px;border-radius:2px;outline:none}
    select:focus,.ta:focus{border-color:#00d4ff}
    .ta{resize:vertical;min-height:52px;font-size:12px;line-height:1.5}
    input[type=range]{width:100%;accent-color:#00d4ff}
    .sl{display:flex;justify-content:space-between;font-family:'Share Tech Mono',monospace;font-size:8px;color:#4a7a99;margin-top:2px}
    .cks{display:flex;flex-direction:column;gap:3px}
    .ck{display:flex;align-items:center;gap:7px;padding:3px 5px;border-radius:2px;cursor:pointer;font-size:13px;color:#c8dde8}
    .ck:hover{background:rgba(0,212,255,.04)}
    .ck input{accent-color:#00d4ff;cursor:pointer}
    .gbtn{width:100%;margin-top:11px;padding:10px;background:transparent;border:1px solid;font-family:'Orbitron',monospace;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:all .2s}
    .gbtn:disabled{opacity:.35;cursor:not-allowed}
    .out{display:flex;flex-direction:column;min-height:500px}
    .lb{height:2px;background:linear-gradient(90deg,transparent,#00d4ff,transparent);background-size:200% 100%;animation:shimmer 1.2s linear infinite}
    .tabs{display:flex;border-bottom:1px solid #0f3a5c;padding:0 8px;gap:1px;flex-wrap:wrap}
    .tab{background:none;border:none;border-bottom:2px solid transparent;color:#4a7a99;font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;padding:7px 8px;cursor:pointer;margin-bottom:-1px;transition:color .15s}
    .tab.on{color:#00d4ff;border-bottom-color:#00d4ff}
    .tab:hover:not(.on){color:#c8dde8}
    .tbody{flex:1;padding:13px;overflow-y:auto;max-height:58vh}
    .atlas-wrap{margin-top:10px;background:#070f1a;border:1px solid #0f3a5c;border-radius:3px;padding:16px;min-height:60vh;overflow-y:auto;max-height:80vh}
    .ftr{text-align:center;padding:11px;font-family:'Share Tech Mono',monospace;font-size:9px;color:#4a7a99;letter-spacing:2px;margin-top:10px;border-top:1px solid #0f3a5c;line-height:1.8}
    select option{background:#0a1a2a}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
    @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  `;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, css), !apiKey && showKeyModal && /*#__PURE__*/React.createElement(ApiKeyModal, {
    onSave: saveKey
  }), /*#__PURE__*/React.createElement("button", {
    className: "key-btn" + (apiKey ? " key-set" : ""),
    onClick: () => setShowKeyModal(true)
  }, "⬡ SERVER KEY"), /*#__PURE__*/React.createElement("div", {
    className: "r"
  }, /*#__PURE__*/React.createElement("div", {
    className: "inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hdr"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ey"
  }, "\u25C8 CYB-5620V \xB7 SECURE CYBER RESILIENT ENGINEERING \xB7 WARU / DAU \u25C8"), /*#__PURE__*/React.createElement("div", {
    className: "ttl"
  }, "MBSE ", /*#__PURE__*/React.createElement("span", null, "Cyber"), " Scenario Builder ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.5em",
      color: "#4a7a99"
    }
  }, "+ Threat Atlas")), /*#__PURE__*/React.createElement("div", {
    className: "sub"
  }, "// M2: ICS Threats \xB7 M3: Policy \xB7 M4: Approaches \xB7 M5: Pipeline \xB7 M6: Silverfish UGV \xB7 M7: SDAD \xB7 M8: GAVIN UAV //")), /*#__PURE__*/React.createElement("div", {
    className: "mode-bar"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mode-btn",
    style: {
      borderColor: appMode === "builder" ? "#00d4ff" : "#0f3a5c",
      color: appMode === "builder" ? "#00d4ff" : "#4a7a99"
    },
    onClick: () => setAppMode("builder")
  }, "\u2B21 Scenario Builder"), /*#__PURE__*/React.createElement("button", {
    className: "mode-btn",
    style: {
      borderColor: appMode === "atlas" ? "#ff6b35" : "#0f3a5c",
      color: appMode === "atlas" ? "#ff6b35" : "#4a7a99"
    },
    onClick: () => setAppMode("atlas")
  }, "\u25C8 Threat Atlas"), /*#__PURE__*/React.createElement("div", {
    className: "mode-divider"
  }), Object.entries(MODULES).map(([key, m]) => /*#__PURE__*/React.createElement("button", {
    key: key,
    className: "mb" + (mk === key && appMode === "builder" ? " on" : ""),
    style: {
      "--c": m.color
    },
    onClick: () => {
      setMk(key);
      setAppMode("builder");
    },
    title: m.fullLabel
  }, m.label))), appMode === "atlas" && /*#__PURE__*/React.createElement("div", {
    className: "atlas-wrap"
  }, /*#__PURE__*/React.createElement(ThreatAtlas, null)), appMode === "builder" && /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel",
    style: {
      borderTop: `2px solid ${mod.color}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ph"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dot",
    style: {
      background: mod.color,
      boxShadow: `0 0 6px ${mod.color}`
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "pt",
    style: {
      color: mod.color
    }
  }, mod.label)), /*#__PURE__*/React.createElement("div", {
    className: "pb"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 9,
      color: "#4a7a99",
      lineHeight: 1.6,
      marginBottom: 8,
      padding: "5px 7px",
      background: "rgba(0,0,0,.2)",
      borderRadius: 2
    }
  }, mod.day, " \xB7 ", mod.focus), /*#__PURE__*/React.createElement("label", {
    className: "lbl"
  }, "Scenario"), /*#__PURE__*/React.createElement("select", {
    value: scen,
    onChange: e => setScen(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2014 Select Scenario \u2014"), mod.scenarios.map(s => /*#__PURE__*/React.createElement("option", {
    key: s.value,
    value: s.value
  }, s.label))), /*#__PURE__*/React.createElement("label", {
    className: "lbl"
  }, "System Under Analysis"), /*#__PURE__*/React.createElement("select", {
    value: sys,
    onChange: e => setSys(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2014 Select System \u2014"), mod.systems.map(s => /*#__PURE__*/React.createElement("option", {
    key: s.value,
    value: s.value
  }, s.label))), /*#__PURE__*/React.createElement("label", {
    className: "lbl"
  }, "Threat Actor"), /*#__PURE__*/React.createElement("select", {
    value: actor,
    onChange: e => setActor(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2014 Select Actor \u2014"), mod.actors.map(a => /*#__PURE__*/React.createElement("option", {
    key: a.value,
    value: a.value
  }, a.label))), /*#__PURE__*/React.createElement("label", {
    className: "lbl"
  }, "Acquisition Pathway"), /*#__PURE__*/React.createElement("select", {
    value: acq,
    onChange: e => setAcq(e.target.value)
  }, ACQ_PATHWAYS.map(a => /*#__PURE__*/React.createElement("option", {
    key: a.value,
    value: a.value
  }, a.label))), /*#__PURE__*/React.createElement("label", {
    className: "lbl"
  }, "Analyst Role"), /*#__PURE__*/React.createElement("select", {
    value: role,
    onChange: e => setRole(e.target.value)
  }, ROLES.map(r => /*#__PURE__*/React.createElement("option", {
    key: r.value,
    value: r.value
  }, r.label))), /*#__PURE__*/React.createElement("label", {
    className: "lbl"
  }, "Threat Tier (CSE Guide 3.0)"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: 1,
    max: 6,
    value: soph,
    onChange: e => setSoph(Number(e.target.value))
  }), /*#__PURE__*/React.createElement("div", {
    className: "sl"
  }, /*#__PURE__*/React.createElement("span", null, "T1 OPP"), /*#__PURE__*/React.createElement("span", null, "T3 CRIM"), /*#__PURE__*/React.createElement("span", null, "T4 APT"), /*#__PURE__*/React.createElement("span", null, "T6 COEVOLVE")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 9,
      color: "#ff6b35",
      marginTop: 3,
      padding: "3px 6px",
      background: "rgba(255,107,53,.05)",
      border: "1px solid rgba(255,107,53,.2)",
      borderRadius: 2
    }
  }, SOPH[soph]), /*#__PURE__*/React.createElement("label", {
    className: "lbl"
  }, "MBSE Artifacts"), /*#__PURE__*/React.createElement("div", {
    className: "cks"
  }, [["usecase", "Use Case Diagram (Mermaid)"], ["sequence", "Attack Sequence Diagram"], ["bdd", "Block Definition Diagram (BDD)"], ["mitre", "MITRE ATT&CK Mapping"], ["req", "Security Requirements (SHALL)"], ["coa", "Courses of Action"], ["stpa", "STPA-Sec Analysis"], ["cameo", "Cameo/MagicDraw Export"]].map(([k, lbl]) => /*#__PURE__*/React.createElement("label", {
    key: k,
    className: "ck"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checks[k],
    onChange: () => toggle(k)
  }), /*#__PURE__*/React.createElement("span", null, lbl)))), /*#__PURE__*/React.createElement("label", {
    className: "lbl"
  }, "Context / Notes"), /*#__PURE__*/React.createElement("textarea", {
    className: "ta",
    value: extra,
    onChange: e => setExtra(e.target.value),
    placeholder: "Exercise phase, specific CVE, system component, student context..."
  }), /*#__PURE__*/React.createElement("button", {
    className: "gbtn",
    disabled: loading,
    onClick: generate,
    style: {
      borderColor: mod.color,
      color: mod.color
    }
  }, loading ? "⬡ Generating..." : "⬡ Generate Scenario"), !apiKey && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: 9,
      color: "#ff4444",
      marginTop: 6,
      textAlign: "center"
    }
  }, "\u26A0 API key required \u2014 click SET API KEY above"))), /*#__PURE__*/React.createElement("div", {
    className: "panel out",
    style: {
      borderTop: `2px solid ${mod.color}`
    }
  }, loading && /*#__PURE__*/React.createElement("div", {
    className: "lb"
  }), /*#__PURE__*/React.createElement("div", {
    className: "tabs"
  }, TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    className: "tab" + (tab === t ? " on" : ""),
    onClick: () => setTab(t)
  }, t))), /*#__PURE__*/React.createElement("div", {
    className: "tbody",
    style: {
      padding: 0
    }
  }, (_renderers$tab = renderers[tab]) === null || _renderers$tab === void 0 ? void 0 : _renderers$tab.call(renderers)))), /*#__PURE__*/React.createElement("div", {
    className: "ftr"
  }, "CYB-5620V SECURE CYBER RESILIENT ENGINEERING \xB7 MBSE SCENARIO BUILDER + THREAT ATLAS \xB7 WARU / DAU", /*#__PURE__*/React.createElement("br", null), "Threats: Stuxnet \xB7 BlackEnergy \xB7 Industroyer \xB7 TRITON \xB7 Industroyer2 \xB7 Colonial \xB7 SolarWinds \xB7 Spectre/Meltdown \xB7 CAN Bus \xB7 Modbus", /*#__PURE__*/React.createElement("br", null), "APTs: Fancy Bear (APT28) \xB7 Cozy Bear (APT29) \xB7 Sandworm \xB7 PRC Volt Typhoon | NIST 800-160 v2 \xB7 CRRM \xB7 STPA-Sec \xB7 FOREST", /*#__PURE__*/React.createElement("br", null), "Powered by Claude AI \u2014 For Educational Use Only \xB7 Diagrams via Mermaid \xB7 Exports: XMI (Cameo) / CSV (Requirements)"))));
}
export default MBSEBuilder;