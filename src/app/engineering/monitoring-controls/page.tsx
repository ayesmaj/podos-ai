/**
 * /engineering/monitoring-controls — engineering explainer (ENG-06).
 *
 * Server component. Covers the instrumentation layer: telemetry
 * domains, thermal + power-quality monitoring, alarm design, and
 * maintenance data — plus an explicit demo-vs-live-telemetry rule.
 * External numbers cite the source register; company claims render
 * only from claims.ts publishable entries with their qualifiers.
 */

import Link from "next/link";
import type { CSSProperties } from "react";
import { buildMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd, FAQJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";

const PATH = "/engineering/monitoring-controls";
const TITLE = "Data Center Monitoring and Controls: Telemetry to Alerts";
const DESCRIPTION =
  "How AI data-center monitoring works: sensor tiers, thermal and power-quality telemetry, alarm design, maintenance data — and why a demo is not live telemetry.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const SOURCES: Source[] = [
  {
    n: 1,
    name: "Thermal Guidelines for Data Processing Environments, 5th ed. (TC 9.9)",
    publisher: "ASHRAE",
    url: "https://www.ashrae.org",
    date: "2021",
  },
  {
    n: 2,
    name: "Global Data Center Survey 2025 (800+ operator respondents)",
    publisher: "Uptime Institute",
    url: "https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025",
    date: "Jul 2025",
  },
  {
    n: 3,
    name: "Redfish Scalable Platforms Management API (DSP0266) and the Redfish data model",
    publisher: "DMTF",
    url: "https://www.dmtf.org/standards/redfish",
    date: "accessed 2026-08-31",
  },
  {
    n: 4,
    name: "IEC 61000-4-30:2025 — Testing and measurement techniques: power quality measurement methods",
    publisher: "IEC",
    url: "https://webstore.iec.ch/en/publication/71611",
    date: "2025",
  },
  {
    n: 5,
    name: "IEEE 519-2022 — Standard for Harmonic Control in Electric Power Systems",
    publisher: "IEEE Standards Association",
    url: "https://standards.ieee.org/ieee/519/10677/",
    date: "2022",
  },
  {
    n: 6,
    name: "Cooling Environments Project (cold plate, CDU, leak detection, heat reuse)",
    publisher: "Open Compute Project",
    url: "https://www.opencompute.org/projects/cooling-environments",
    date: "ongoing",
  },
  {
    n: 7,
    name: "Demonstrating the Data Center as a Flexible Grid Asset (Vulcan platform)",
    publisher: "NREL (US DOE)",
    url: "https://docs.nrel.gov/docs/fy25osti/94844.pdf",
    date: "FY2025",
  },
  {
    n: 8,
    name: "Data center efficiency — PUE measurement methodology (fleet trailing-12-month)",
    publisher: "Google",
    url: "https://datacenters.google/efficiency/",
    date: "accessed 2026-08-31",
  },
  {
    n: 9,
    name: "IEEE 3006 series — Power Systems Reliability (incl. 3006.7, continuous power systems)",
    publisher: "IEEE Standards Association",
    url: "https://standards.ieee.org/ieee/3006.1/7391/",
    date: "2013–2018 per part",
  },
  {
    n: 10,
    name: "NFPA 75 — Standard for the Fire Protection of Information Technology Equipment, 2024 ed.",
    publisher: "NFPA",
    url: "https://www.nfpa.org",
    date: "2024 ed.",
  },
];

/* FAQ — the SAME array feeds visible markup and FAQJsonLd. */
const FAQ = [
  {
    q: "What is the difference between monitoring and controls?",
    a: "Monitoring measures and reports state — temperatures, flows, voltages, currents, machine health. Controls act on that state, opening a valve, changing pump speed, shedding load, or shutting a circuit down. The same sensor can feed both, but they carry different reliability requirements: a failed monitoring point degrades visibility, while a failed control point changes the physical behaviour of the plant.",
  },
  {
    q: "Is the telemetry shown in a product visualisation real live data?",
    a: "No. Interactive visuals, configurators, and animated dashboards published on a marketing site render illustrative values from a model, not measurements from operating hardware. Live telemetry means values sampled from real instruments on a real unit, with a timestamp, a sensor identity, and a known measurement uncertainty. Anything without those three properties is a demonstration and should be labelled as one.",
  },
  {
    q: "Why is power-quality monitoring separate from power metering?",
    a: "A meter answers how much energy was used. Power-quality monitoring answers whether the supply waveform is within tolerance — frequency, magnitude, dips and swells, interruptions, unbalance, harmonics and interharmonics — using the measurement methods defined in IEC 61000-4-30. Dense rectifier loads both suffer from and create distortion, so the two measurements diagnose different failures.",
  },
  {
    q: "How often should monitoring points be sampled?",
    a: "Sample rate follows the physics of the signal, not a single site-wide default. Electrical transients need cycle-level or sub-cycle capture; coolant temperatures and flows move on a scale of seconds; filter differential pressure and coolant chemistry trend over weeks. Oversampling a slow signal creates storage and alarm noise; undersampling a fast one hides the event that mattered.",
  },
];

/* ------------------------------------------------------------------ */
/* small shared styles (server component — CSS-only hovers)            */
/* ------------------------------------------------------------------ */
const th: CSSProperties = {
  fontFamily: "var(--font-geist-mono), monospace",
  fontSize: 11.5,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--ink-dim)",
  textAlign: "left",
  padding: "0.65rem 0.9rem",
  borderBottom: "1px solid var(--edge-bright)",
  whiteSpace: "nowrap",
};

const td: CSSProperties = {
  fontSize: 14.5,
  lineHeight: 1.55,
  color: "var(--ink-dim)",
  padding: "0.65rem 0.9rem",
  borderBottom: "1px solid var(--edge-faint)",
  verticalAlign: "top",
  minWidth: "10rem",
};

const codePill: CSSProperties = {
  fontFamily: "var(--font-geist-mono), monospace",
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.18em",
  color: "var(--brand-deep)",
  background: "rgba(37,99,235,0.07)",
  border: "1px solid rgba(37,99,235,0.16)",
  borderRadius: 999,
  padding: "0.15rem 0.6rem",
  whiteSpace: "nowrap",
};

const h2Style: CSSProperties = {
  fontFamily: "var(--font-display), ui-sans-serif, system-ui",
  fontWeight: 800,
  letterSpacing: "-0.03em",
  lineHeight: 1.1,
  color: "var(--ink-strong)",
  fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)",
};

const h3Style: CSSProperties = {
  fontFamily: "var(--font-display), ui-sans-serif, system-ui",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  color: "var(--ink-strong)",
  fontSize: "1.1rem",
};

const linkStyle: CSSProperties = {
  color: "var(--brand-deep)",
  textDecoration: "underline",
};

/* MC-01…MC-05 — the telemetry domain matrix */
const DOMAINS: [string, string, string, string, string][] = [
  [
    "MC-01",
    "IT / machine",
    "Die temperature, clock and power draw, memory and interconnect error counters, fan speed, PSU input, node health state",
    "Seconds to sub-second; error counters on event",
    "Server management interfaces — the Redfish API and its metric-report model give a vendor-neutral path off the box",
  ],
  [
    "MC-02",
    "Thermal / fluid",
    "Coolant supply and return temperature, loop flow, differential pressure across filters and cold plates, CDU pump state, leak detection, dew point",
    "1–10 s for temperature and flow; leak detection continuous",
    "CDU controller telemetry; OCP cooling-environment work standardises what a CDU exposes",
  ],
  [
    "MC-03",
    "Electrical",
    "Voltage, current, real and apparent power, power factor, frequency, breaker and transfer-switch position, UPS and battery state",
    "Sub-cycle for events; 1 s for trending",
    "Metering and protection relays on the medium-voltage and low-voltage distribution",
  ],
  [
    "MC-04",
    "Power quality",
    "Dips, swells, interruptions, unbalance, harmonics and interharmonics, transient capture, flicker",
    "Cycle-level capture with 10-min aggregation windows",
    "Class-A power-quality analysers using the IEC 61000-4-30 measurement methods",
  ],
  [
    "MC-05",
    "Environmental / safety",
    "Enclosure temperature and humidity, door and intrusion state, smoke and very-early-warning detection, suppression system status, ambient conditions",
    "Seconds; life-safety signals hard-wired and continuous",
    "Building and safety systems, reporting on their own supervised paths",
  ],
];

/* MC-A…MC-H — verification checklist for any published telemetry number */
const CHECKLIST: [string, string, string][] = [
  [
    "MC-A",
    "Is there a timestamp and a sensor identity?",
    "A number with no instrument behind it and no time attached is an illustration. Real telemetry names the point and the moment.",
  ],
  [
    "MC-B",
    "What is the measurement uncertainty, and when was the point last calibrated?",
    "Every sensor has a tolerance band that widens as it drifts. A supply-water temperature quoted to two decimals from a probe whose tolerance is wider than that is false precision, and an uncalibrated point produces confident, wrong numbers.",
  ],
  [
    "MC-C",
    "Is it measured, derived, or modelled?",
    "Flow is often derived from pump speed and a curve rather than metered directly; efficiency ratios are always derived. Say which.",
  ],
  [
    "MC-D",
    "Over what window, and under what load?",
    "An instantaneous best-case reading and a trailing-twelve-month average are different claims. Published efficiency methodologies are explicit about the window and the overheads included.",
  ],
  [
    "MC-E",
    "Is the system operating, or is this a design intent?",
    "Design values describe what a system is engineered to do. They belong in a specification, labelled as such, not in a live-status readout.",
  ],
  [
    "MC-F",
    "Would the same number appear if the hardware were switched off?",
    "The decisive test for a demo. Animated values that keep moving with no plant attached are a visualisation.",
  ],
  [
    "MC-G",
    "Does an alarm exist for it, and has that alarm ever fired?",
    "A monitored value nobody acts on is telemetry theatre. Every critical point should map to a defined response.",
  ],
];

export default function MonitoringControlsPage() {
  return (
    <main style={{ background: "var(--paper)" }}>
      <TechArticleJsonLd
        headline="Monitoring and controls, sensor to alarm"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />
      <FAQJsonLd items={FAQ} />

      {/* ---------------- compact hero ---------------- */}
      <header
        className="container-site"
        style={{ paddingTop: "clamp(6.5rem, 12vh, 9rem)", paddingBottom: "clamp(2.5rem, 5vh, 4rem)" }}
      >
        <Breadcrumbs
          crumbs={[
            { name: "Home", path: "/" },
            { name: "Engineering", path: "/engineering" },
            { name: "Monitoring and controls", path: PATH },
          ]}
        />

        <p
          className="mt-8 inline-flex items-center gap-2"
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "0.78rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--brand-deep)",
            background: "var(--glass-bg-strong)",
            border: "1px solid var(--edge-bright)",
            borderRadius: 999,
            padding: "0.35rem 0.9rem",
          }}
        >
          <span style={{ fontWeight: 800, color: "var(--cyan-deep)" }}>ENG-06</span>
          <span aria-hidden style={{ opacity: 0.4 }}>
            ·
          </span>
          ENGINEERING
        </p>

        <h1
          className="mt-5 max-w-4xl"
          style={{
            fontFamily: "var(--font-display), ui-sans-serif, system-ui",
            fontWeight: 800,
            letterSpacing: "-0.038em",
            lineHeight: 1.05,
            fontSize: "clamp(2.2rem, 4.6vw, 3.9rem)",
            color: "var(--ink-strong)",
          }}
        >
          Monitoring and controls, sensor to <span className="t-sweep-brand">alarm</span>
        </h1>

        <p className="t-lede mt-5 max-w-[62ch]" style={{ color: "var(--ink-dim)" }}>
          Monitoring and controls is the instrumentation layer of a compute site: the sensors that
          measure what the machines, the coolant, and the electrical supply are actually doing, and
          the logic that acts on those measurements. Monitoring reports state; controls change it.
          This page covers the five telemetry domains, how thermal and power-quality monitoring
          differ, what disciplined alarm design looks like, how telemetry turns into maintenance
          work — and the rule that separates a visual demonstration from live telemetry.
        </p>

        <div className="mt-6">
          <LastVerified
            published="2026-08-31"
            lastVerified="2026-08-31"
            author="Josef Elimelech"
            reviewer="PODOS AI Engineering"
          />
        </div>
      </header>

      {/* ---------------- article body ---------------- */}
      <article className="container-site" style={{ paddingBottom: "clamp(4rem, 8vh, 6rem)" }}>
        <div className="max-w-[76ch]">
          {/* -------- why it exists -------- */}
          <section id="why" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Why the instrumentation layer decides uptime</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              High-density AI hardware fails gradually before it fails suddenly. Thermal margin
              erodes, a pump curve shifts, a coolant filter loads up, a phase drifts out of balance —
              and the visible symptom is a throttled GPU or a tripped breaker weeks later. The
              Uptime Institute&apos;s 2025 survey of more than 800 operators found that half of
              respondents had experienced an impactful outage in the previous three years, with
              power and cooling failures among the recurring causes.<Cite n={2} /> Instrumentation
              is what converts those slow-moving physical trends into something a human or a control
              loop can act on while the margin still exists.
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              The design question is therefore not &quot;how many sensors&quot; but &quot;which
              measurements close which loop&quot;. Reliability practice for continuous power systems
              treats monitoring points as part of the reliability model, not as an accessory bolted
              on after commissioning.<Cite n={9} /> A point that no alarm, no control loop, and no
              maintenance task depends on is storage cost with a dashboard attached.
            </p>
          </section>

          {/* -------- the five domains -------- */}
          <section id="domains" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Five telemetry domains, five different clocks</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Telemetry in a compute site is not one stream. It is five domains with different
              physics, different sample rates, and different owners — and most integration pain
              comes from treating them as one. Machine telemetry leaves the server through
              management interfaces; the DMTF&apos;s Redfish API and its metric-report model are the
              vendor-neutral way to pull it without a per-vendor agent.<Cite n={3} /> Fluid telemetry
              comes off the cooling distribution unit, whose expected instrumentation is being
              standardised through the Open Compute Project&apos;s cooling work.<Cite n={6} /> And
              life-safety signals report on their own supervised paths under fire-protection
              requirements for IT equipment areas.<Cite n={10} />
            </p>

            <div className="overflow-x-auto mt-6 panel" style={{ borderRadius: 12 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
                <thead>
                  <tr>
                    <th style={th} scope="col">Code</th>
                    <th style={th} scope="col">Domain</th>
                    <th style={th} scope="col">Representative signals</th>
                    <th style={th} scope="col">Typical sampling</th>
                    <th style={th} scope="col">Where it comes from</th>
                  </tr>
                </thead>
                <tbody>
                  {DOMAINS.map(([code, domain, signals, rate, origin]) => (
                    <tr key={code}>
                      <td style={td}>
                        <span style={codePill}>{code}</span>
                      </td>
                      <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>{domain}</td>
                      <td style={td}>{signals}</td>
                      <td style={td}>{rate}</td>
                      <td style={td}>{origin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* -------- thermal -------- */}
          <section id="thermal" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Thermal monitoring: temperature is the symptom, delta-T is the diagnosis</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              An air-cooled room is monitored at the inlet, because ASHRAE&apos;s thermal guidelines
              define equipment environmental classes by inlet air conditions — the number the
              hardware warranty is written against. A liquid-cooled system moves the primary
              measurement into the loop, and the same guidelines extend the logic by naming facility
              water classes according to supply temperature.<Cite n={1} />
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              The diagnostic value sits in the relationships, not the absolute readings. Return-minus-supply
              temperature against known heat load tells you whether flow has fallen. Rising
              differential pressure at constant flow tells you a filter is loading or a channel is
              fouling. A supply temperature drifting toward the dew point of the enclosure air warns
              of condensation on the piping before a leak sensor ever wets. That is why the same
              four measurements — supply, return, flow, differential pressure — appear on every
              well-instrumented{" "}
              <Link href="/engineering/direct-to-chip-liquid-cooling" style={linkStyle}>
                direct-to-chip cooling loop
              </Link>
              , and why leak detection is treated as a continuous, always-on channel rather than a
              polled point.<Cite n={6} />
            </p>
          </section>

          {/* -------- power quality -------- */}
          <section id="power-quality" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Power-quality monitoring is not power metering</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Metering answers how much energy moved. Power-quality monitoring answers whether the
              waveform delivering it stayed inside tolerance. IEC 61000-4-30 defines the measurement
              methods and aggregation intervals for the parameters that matter — power frequency,
              supply voltage magnitude, dips and swells, interruptions, transients, unbalance,
              harmonics and interharmonics — precisely so that two instruments from two vendors
              produce comparable results from the same event.<Cite n={4} /> Without that discipline,
              a &quot;voltage sag&quot; on one dashboard and on another are not the same
              measurement.
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              AI compute makes this concrete in two directions. The load is a large population of
              switched-mode rectifiers, which draws non-sinusoidal current and injects harmonic
              distortion back toward the point of common coupling — the condition IEEE 519 exists to
              bound.<Cite n={5} /> And the load swings hard: synchronised training and inference
              workloads step a large fraction of site power in seconds, which shows up as voltage
              deviation and stresses upstream equipment. Both effects are invisible to an energy
              meter and obvious to a class-A analyser. The mitigation choices sit in the{" "}
              <Link href="/engineering/data-center-power-architecture" style={linkStyle}>
                power architecture
              </Link>
              , but the evidence that they work only ever comes from this instrument class.
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Good electrical telemetry also unlocks capability, not just protection. NREL&apos;s
              demonstration of a 70 MW data center as a flexible grid asset dispatched 35 MW of
              battery storage in under five seconds while keeping workload service levels intact —
              a control action that is only possible when load, storage state, and grid signals are
              measured fast enough to close the loop.<Cite n={7} />
            </p>
          </section>

          {/* -------- alerting -------- */}
          <section id="alerting" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Alarm design: fewer alarms, each one meaning something</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              The common failure of monitoring programmes is not missing data. It is an alarm list
              so long that operators stop reading it. Disciplined alarm design follows a short set
              of rules: every alarm has a defined operator response, or it is not an alarm; priority
              reflects consequence and time-to-act, not the enthusiasm of whoever configured it;
              thresholds carry deadbands and on-delays so a sensor sitting at a limit cannot
              chatter; and a standing alarm nobody can clear is a defect to fix, not wallpaper to
              tolerate.
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Rate-of-change detection deserves more weight than fixed thresholds in a dense
              facility. A coolant supply temperature climbing several degrees in two minutes is
              actionable long before it crosses any absolute limit, because it indicates the loop
              has lost heat rejection. The same holds for GPU error counts, pump current, and
              battery impedance. Fixed limits catch the state you already reached; derivatives catch
              the trajectory you are on, which is the only warning that leaves time to act.
            </p>
          </section>

          {/* -------- maintenance data -------- */}
          <section id="maintenance" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>From telemetry to maintenance work</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Maintenance data is the slow layer of the same instrumentation. It is not sampled in
              seconds and it does not raise alarms; it accumulates into a service record. Pump and
              fan runtime hours drive bearing replacement intervals. Filter differential-pressure
              trends set change-out dates instead of a calendar guess. Coolant chemistry — sampled,
              not sensed — tracks inhibitor depletion and biological growth in the technology loop.
              Firmware and configuration versions per node close the loop between a behaviour change
              and the change that caused it.
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Efficiency reporting belongs to this slow layer too, and its credibility is entirely a
              methodology question. Published hyperscale efficiency figures are stated as
              trailing-twelve-month, all-season averages including every overhead inside the
              measurement boundary — which is why they are comparable and why an instantaneous
              best-hour number is not.<Cite n={8} /> Any site publishing an efficiency ratio should
              state the boundary, the window, and whether the inputs were measured or derived.
            </p>
          </section>

          {/* -------- demo vs live -------- */}
          <section id="demo-vs-live" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>A visual demonstration is not live telemetry</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              This distinction is a house rule, and it is worth stating plainly. Interactive
              visualisations, configurators, and animated dashboards published on a website render
              illustrative values produced by a model. They exist to explain an architecture. They
              are not measurements, and PODOS does not describe them as live, real-time, or
              operational data anywhere on this site.
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Live telemetry means something specific: a value sampled from an identified instrument
              on operating hardware, carrying a timestamp and a known measurement uncertainty. Three
              properties, all three required. The checklist below is the test we apply to our own
              numbers before publishing them, and it works equally well on anyone else&apos;s
              monitoring claims.
            </p>

            <div className="overflow-x-auto mt-6 panel" style={{ borderRadius: 12 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
                <thead>
                  <tr>
                    <th style={th} scope="col">Check</th>
                    <th style={th} scope="col">Question to ask of any published number</th>
                    <th style={th} scope="col">Why it separates measurement from illustration</th>
                  </tr>
                </thead>
                <tbody>
                  {CHECKLIST.map(([code, q, why]) => (
                    <tr key={code}>
                      <td style={td}>
                        <span style={codePill}>{code}</span>
                      </td>
                      <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>{q}</td>
                      <td style={td}>{why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* -------- limitations -------- */}
          <section id="limitations" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Where heavy instrumentation is the wrong answer</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Monitoring has costs, and pretending otherwise produces systems that are expensive and
              still blind.
            </p>
            <ul className="mt-4 grid gap-3 list-disc pl-5">
              {[
                "Every sensor can fail by reading plausibly wrong rather than by going silent. Adding points adds failure modes, and a control loop driven by an uncalibrated probe is worse than no loop at all.",
                "Predictive maintenance needs history. Failure-prediction models require months to years of labelled operating data on the specific equipment; on a new unit, condition-based thresholds and manufacturer intervals are the honest starting point.",
                "Networked telemetry widens the attack surface. Management interfaces, controller networks, and remote-access paths need segmentation and access control — a monitoring project is also a security project.",
                "Short-lived deployments may not repay deep instrumentation. Without enough operating life to build trends or fund a response function, a compact set of protective interlocks beats an analytics stack.",
                "Life-safety functions are not a monitoring feature. Fire detection, suppression, and emergency power-off follow their own codes and supervised wiring; they are never delegated to a general-purpose telemetry platform.",
              ].map((t) => (
                <li key={t.slice(0, 24)} className="t-body" style={{ color: "var(--ink-dim)" }}>
                  {t}
                </li>
              ))}
            </ul>
          </section>

          {/* -------- PODOS application -------- */}
          <section id="podos" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>How PODOS approaches monitoring in a factory-built unit</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              A factory-integrated unit changes where the instrumentation problem is solved. Each{" "}
              <Link href="/platform/podos-pod" style={linkStyle}>
                PODOS Pod
              </Link>{" "}
              is <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>{" "}
              and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, so the sensor
              set, the controller, the alarm list, and the acceptance tests are defined once for a
              repeated product rather than negotiated per building. Sensor placement, wiring, and
              point naming are part of the enclosure design; commissioning checks run on the factory
              floor against a known configuration. That repeatability is part of why PODOS{" "}
              <span data-claim="deployment-window">
                targets a 90-day window from order to commissioning
              </span>{" "}
              for a standard unit — a site is not also a bespoke instrumentation project.
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              The instrumentation layer connects the rest of the system: the thermal points that
              prove the cooling loop is doing its job, the electrical points that make the{" "}
              <Link href="/engineering/data-center-power-architecture" style={linkStyle}>
                power architecture
              </Link>{" "}
              observable, and the acceptance data handed over at the end of the{" "}
              <Link href="/deploy" style={linkStyle}>
                deployment process
              </Link>
              . For the wider engineering context see the{" "}
              <Link href="/engineering" style={linkStyle}>
                engineering index
              </Link>{" "}
              and how this differs from a conventional build in{" "}
              <Link href="/compare/modular-ai-data-center-vs-traditional-data-center" style={linkStyle}>
                modular vs traditional AI data centers
              </Link>
              ; unfamiliar terms are defined in the{" "}
              <Link href="/resources/ai-infrastructure-glossary" style={linkStyle}>
                AI infrastructure glossary
              </Link>
              .
            </p>
          </section>

          {/* -------- FAQ -------- */}
          <section id="faq" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Frequently asked questions</h2>
            <div className="mt-6 grid gap-6">
              {FAQ.map((f) => (
                <div key={f.q}>
                  <h3 style={h3Style}>{f.q}</h3>
                  <p className="t-body mt-2" style={{ color: "var(--ink-dim)" }}>
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <EvidenceSourceRail sources={SOURCES} />
        </div>
      </article>
    </main>
  );
}
