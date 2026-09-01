/**
 * /use-cases/healthcare — Archetype B, use case.
 * See docs/design/PAGE_ARCHETYPES.md.
 *
 * Server component. Keyword cluster: "healthcare AI infrastructure",
 * "on-premises GPU compute for hospitals" (informational/MOFU).
 *
 * This page carries NO imagery, so the hero is HeroEditorial rather than
 * the HeroMedia used by /use-cases/enterprise-ai — the two sibling pages
 * differ in hero variant, section order, and the content of the ink beat.
 *
 * COMPLIANCE GUARDRAIL: this page never states or implies that PODOS
 * is HIPAA-certified, HIPAA-compliant, or accredited. The only
 * permitted formulation is that infrastructure "can support a
 * compliance architecture the operator owns" — and the page cites HHS
 * on the fact that no private HIPAA certification is recognised.
 * Company numbers render only from publishable claims.ts entries with
 * their required qualifiers.
 */

import Link from "next/link";
import type { CSSProperties } from "react";
import { buildMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd, FAQJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";
import {
  HeroEditorial,
  SummaryBand,
  ProseWithRail,
  MatrixTable,
  CardGrid,
  QuoteMetric,
  LimitsBlock,
  FAQBlock,
  RelatedRail,
  CTABand,
  Section,
  SectionHead,
} from "@/components/seo/sections";

const PATH = "/use-cases/healthcare";
const TITLE = "Healthcare AI Infrastructure: On-Premises GPU Compute";
const DESCRIPTION =
  "How health systems site AI compute on their own property: data residency, imaging and clinical inference workloads, hospital estate limits, and honest fit.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const SOURCES: Source[] = [
  {
    n: 1,
    name: "The Security Rule (45 CFR Part 160 and Subparts A and C of Part 164)",
    publisher: "U.S. Department of Health and Human Services",
    url: "https://www.hhs.gov/hipaa/for-professionals/security/index.html",
    date: "accessed 2026-08-31",
  },
  {
    n: 2,
    name: "Guidance on HIPAA & Cloud Computing",
    publisher: "U.S. Department of Health and Human Services, Office for Civil Rights",
    url: "https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html",
    date: "accessed 2026-08-31",
  },
  {
    n: 3,
    name: "FAQ 2003 — Are we required to certify our organization's compliance with the standards?",
    publisher: "U.S. Department of Health and Human Services",
    url: "https://www.hhs.gov/hipaa/for-professionals/faq/2003/are-we-required-to-certify-our-organizations-compliance-with-the-standards/index.html",
    date: "accessed 2026-08-31",
  },
  {
    n: 4,
    name: "SP 800-66 Rev. 2, Implementing the HIPAA Security Rule: A Cybersecurity Resource Guide",
    publisher: "NIST",
    url: "https://csrc.nist.gov/pubs/sp/800/66/r2/final",
    date: "Feb 2024",
  },
  {
    n: 5,
    name: "SP 800-53 Rev. 5, Security and Privacy Controls for Information Systems and Organizations (PE control family)",
    publisher: "NIST",
    url: "https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final",
    date: "Sep 2020, upd. Dec 2020",
  },
  {
    n: 6,
    name: "DICOM Standard — current edition",
    publisher: "Medical Imaging & Technology Alliance, a division of NEMA",
    url: "https://www.dicomstandard.org/current",
    date: "accessed 2026-08-31",
  },
  {
    n: 7,
    name: "Artificial Intelligence-Enabled Medical Devices (authorised device list)",
    publisher: "U.S. Food and Drug Administration",
    url: "https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-enabled-medical-devices",
    date: "accessed 2026-08-31",
  },
  {
    n: 8,
    name: "Global Data Center Survey 2025",
    publisher: "Uptime Institute",
    url: "https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025",
    date: "Jul 2025",
  },
  {
    n: 9,
    name: "Regulation (EU) 2016/679 (GDPR), Chapter V — Transfers of personal data to third countries",
    publisher: "European Union (EUR-Lex)",
    url: "https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng",
    date: "2016",
  },
];

/* FAQ — the SAME array feeds visible markup and FAQJsonLd. */
const FAQ = [
  {
    q: "Is a PODOS Pod HIPAA compliant?",
    a: "No product is. HIPAA compliance is a property of a regulated entity and its whole programme, not of hardware. PODOS holds no healthcare certification and claims none. Infrastructure can support a compliance architecture the institution owns; it cannot deliver compliance on the institution's behalf.",
  },
  {
    q: "Does HHS certify vendors as HIPAA compliant?",
    a: "It does not. HHS states that covered entities are not required to certify compliance, and that it does not endorse or otherwise recognise private organisations' certifications — such a certificate does not relieve a regulated entity of its own obligations.",
  },
  {
    q: "Why not just use a cloud region with a business associate agreement?",
    a: "That is a legitimate architecture, and for many workloads the right one. HHS guidance sets out how a cloud provider handling electronic protected health information becomes a business associate. On-premises compute wins when governance, egress economics on large imaging archives, or a transfer restriction make institution-controlled infrastructure simpler.",
  },
  {
    q: "Can a compute unit go inside the hospital building?",
    a: "Usually not, and usually it should not. Dense GPU racks compete with clinical floor area, add hundreds of kilowatts behind distribution sized for care delivery, and need liquid cooling that occupied clinical buildings host poorly. A separately sited unit on institution-controlled property is the more common answer.",
  },
];

const link: CSSProperties = { color: "var(--brand-deep)", textDecoration: "underline" };

/* H-01…H-06 — the siting constraint table */
const CONSTRAINTS: Array<[string, string, string, string, number | null]> = [
  [
    "H-01",
    "Clinical floor area",
    "A GPU room competes directly with imaging suites, procedure rooms, and beds.",
    "Moves the compute off the clinical floorplate and onto a utility pad the institution already owns.",
    null,
  ],
  [
    "H-02",
    "Electrical capacity",
    "Adding hundreds of kilowatts behind distribution classified around life safety is an engineering project, not a rack install.",
    "Own service, so the hospital's existing distribution and its essential-power classification stay untouched.",
    null,
  ],
  [
    "H-03",
    "Rack density",
    "Operator-reported rack densities were climbing into the 10–30 kW band in Uptime Institute's 2025 survey, past what hospital IT rooms were built to serve.",
    "Density is designed into the enclosure rather than retrofitted into a room never sized for it.",
    8,
  ],
  [
    "H-04",
    "Cooling and heat rejection",
    "Air cannot economically remove heat at AI-rack densities, and cutting liquid pipework into an occupied clinical building is slow.",
    "The closed liquid loop and its heat rejection ship as part of the unit — no clinical space is opened up.",
    null,
  ],
  [
    "H-05",
    "Physical access control",
    "The NIST physical and environmental control family sets what an auditor expects to see: access authorisations, monitoring, and visitor records.",
    "A discrete, lockable, separately monitored envelope: a small perimeter to authorise, log, and inspect.",
    5,
  ],
  [
    "H-06",
    "Data gravity",
    "Retrospective imaging archives are large and awkward to move; the archive, not the model, dictates location.",
    "Compute on the same campus as the archive removes the transfer problem instead of engineering around it.",
    6,
  ],
];

/* G-01…G-08 — the governance review questions, verbatim. */
const GOVERNANCE_CHECKS: Array<[string, string, string]> = [
  [
    "G-01",
    "Jurisdiction",
    "Which jurisdiction's law reaches this data, and does any processing move it across a border?",
  ],
  [
    "G-02",
    "Agreements",
    "Who is the covered entity, who is the business associate, and is every agreement executed?",
  ],
  [
    "G-03",
    "Risk analysis",
    "Where does the risk analysis put this workload, and has it been re-run for the new location?",
  ],
  [
    "G-04",
    "Physical access",
    "Who holds physical access authorisation, and how is entry logged and reviewed?",
  ],
  [
    "G-05",
    "Network separation",
    "How is administrative access to the cluster separated from the clinical network?",
  ],
  [
    "G-06",
    "Training data",
    "What is the de-identification or minimum-necessary boundary for training data, and who signs it off?",
  ],
  [
    "G-07",
    "Clinical dependency",
    "Does any clinical process depend on this workload during a planned outage?",
  ],
  [
    "G-08",
    "Operations ownership",
    "Which team owns monitoring, patching, and incident response for the infrastructure itself?",
  ],
];

const TOC: Array<[string, string]> = [
  ["#data-residency", "Data residency"],
  ["#workloads", "The workloads"],
  ["#siting", "Siting constraints"],
  ["#compliance", "Compliance posture"],
  ["#governance-checklist", "Governance review"],
  ["#limitations", "When it does not fit"],
  ["#podos-fit", "How PODOS fits"],
];

export default function HealthcareUseCasePage() {
  return (
    <main>
      <TechArticleJsonLd
        headline="Healthcare AI infrastructure, sited on your own property"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />
      <FAQJsonLd items={FAQ} />

      {/* 1 · HERO — editorial, no product shot (this page carries no imagery) */}
      <HeroEditorial
        category="Use case · Healthcare"
        title="Healthcare AI infrastructure, sited"
        accent="on your own property"
        lede="Health systems put AI compute on their own property for two reasons: the data is governed where it sits, and imaging archives are too large and too sensitive to move casually. The obstacle is rarely the decision — it is that a hospital estate has no room, power, or cooling for a dense GPU cluster. This page covers the workloads, the siting constraints, what infrastructure can and cannot carry for compliance, and where a modular unit is the wrong answer."
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Use cases", path: "/use-cases" },
              { name: "Healthcare", path: PATH },
            ]}
          />
        }
        meta={
          <LastVerified
            published="2026-08-31"
            lastVerified="2026-08-31"
            author="Josef Elimelech"
            reviewer="PODOS AI Engineering"
          />
        }
        stats={[
          { value: "06", label: "Siting constraints" },
          { value: "08", label: "Governance questions" },
          { value: "0", label: "Certifications claimed" },
        ]}
      />

      {/* 2 · WHAT QUALIFIES — canvas */}
      <SummaryBand
        title="What actually pulls compute onto a hospital campus"
        items={[
          {
            code: "01",
            title: "Data is governed where it sits",
            body: "The Security Rule obligation follows electronic protected health information wherever it is held. It does not transfer to a supplier.",
          },
          {
            code: "02",
            title: "The archive decides the location",
            body: "Retrospective imaging archives are large and awkward to move. The archive, not the model, dictates where compute goes.",
          },
          {
            code: "03",
            title: "The estate has no room for it",
            body: "Floor area is allocated to care delivery, the electrical system is classified around life safety, and construction inside an operating facility is slow by design.",
          },
          {
            code: "04",
            title: "Compliance stays with the institution",
            body: "Infrastructure can support a compliance architecture the institution owns. It cannot deliver compliance on the institution's behalf.",
          },
        ]}
      />

      {/* 3 · RESIDENCY — prose with the page rail */}
      <ProseWithRail
        id="data-residency"
        surface="paper"
        rail={
          <div style={{ borderTop: "1px solid var(--edge-bright)", paddingTop: "1.25rem" }}>
            <p className="eyebrow">On this page</p>
            <ul style={{ listStyle: "none", marginTop: "1rem", display: "grid", gap: "0.6rem" }}>
              {TOC.map(([href, label]) => (
                <li key={href}>
                  <a href={href} style={{ ...link, fontSize: "0.9rem", textDecoration: "none" }}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        }
      >
        <SectionHead
          eyebrow="H-00 · Governance first"
          title="Data residency is a governance question before it is a technical one"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            &quot;Where does the data live&quot; is the first question a health system&apos;s
            privacy office asks about an AI programme, and the answer decides the architecture. In
            the United States, the HIPAA Security Rule — 45 CFR Part 160 and Subparts A and C of
            Part 164 — obliges regulated entities to apply administrative, physical, and technical
            safeguards to electronic protected health information wherever it is held.<Cite n={1} />{" "}
            That obligation follows the data; it does not transfer to a supplier. Where a cloud
            provider handles that information, HHS guidance is explicit that the provider becomes a
            business associate and a written agreement is required — including for encrypted,
            so-called no-view services.<Cite n={2} />
          </p>
          <p>
            Cross-border research adds a second layer. Under Chapter V of the GDPR, personal data
            may leave the European Union only under an adequacy decision, appropriate safeguards, or
            a specific derogation — which is why multi-site studies stall on transfer mechanics
            rather than science.<Cite n={9} /> On-premises processing does not answer the transfer
            question so much as remove it. The tradeoff is real, and we set it out in full in{" "}
            <Link href="/compare/on-prem-ai-infrastructure-vs-cloud" style={link}>
              on-prem AI infrastructure vs cloud
            </Link>
            .
          </p>
        </div>
      </ProseWithRail>

      {/* 4 · WORKLOADS — prose, canvas */}
      <ProseWithRail id="workloads" surface="canvas">
        <SectionHead
          eyebrow="Workload profile"
          title="The workloads that actually pull compute onto the campus"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Medical imaging is the anchor. Studies are exchanged and archived under DICOM, the
            standard maintained by the Medical Imaging &amp; Technology Alliance, a division of
            NEMA,<Cite n={6} /> and a research-grade retrospective archive is measured in years of
            studies rather than gigabytes of text. Imaging is also where AI has the most production
            traffic: the FDA publishes a list of AI-enabled medical devices authorised for marketing
            in the United States, and radiology is by far the most common lead review panel on that
            list.<Cite n={7} /> Large resident data plus live inference against it is what makes the
            archive, not the model, decide where compute goes.
          </p>
          <p>
            Three quieter workloads sit around it with the same gravity: ambient clinical
            documentation, where latency is felt by clinicians in the room; genomics pipelines,
            which are batch but enormous; and internal model development on retrospective records,
            which governance committees scrutinise hardest. Academic medical centres carry a second
            profile on top of this one — shared clusters, grant cycles, mixed research tenancy —
            treated separately in{" "}
            <Link href="/use-cases/universities-research" style={link}>
              universities and research computing
            </Link>
            .
          </p>
          <p>
            The two halves place opposite demands on infrastructure. Training is bursty and tolerant
            of interruption; clinical inference is modest in compute but runs against a live service
            expectation, where an outage is felt in a reading room rather than in a job queue. One
            site usually carries both, so availability is set by the inference path while capacity
            is set by the training path.
          </p>
        </div>
      </ProseWithRail>

      {/* 5 · SITING — wide matrix, paper */}
      <MatrixTable
        id="siting"
        eyebrow="Site survey"
        title="Why a hospital building is the wrong place for a GPU cluster"
        lede="A hospital estate is unusually constrained: floor area is allocated to care delivery, the electrical system is classified around life safety, and construction inside an operating facility is slow by design."
        surface="paper"
        field="deploy"
        head={["#", "Constraint", "Why an in-building cluster struggles", "What a separately sited unit changes"]}
        rows={CONSTRAINTS.map(([code, name, problem, change, cite]) => [
          <span key={code} className="pill">
            {code}
          </span>,
          name,
          <span key={`${code}-p`}>
            {problem}
            {cite ? <Cite n={cite} /> : null}
          </span>,
          change,
        ])}
      />

      {/* 6 · COMPLIANCE POSTURE — prose, canvas */}
      <ProseWithRail
        id="compliance"
        surface="canvas"
        rail={
          <div style={{ borderTop: "1px solid var(--edge-bright)", paddingTop: "1.25rem" }}>
            <p className="eyebrow">Engineering detail</p>
            <p style={{ marginTop: "1rem", fontSize: "0.9rem", lineHeight: 1.65, color: "var(--ink-dim)" }}>
              Two rows are engineering subjects in their own right: heat removal is covered in{" "}
              <Link href="/engineering/direct-to-chip-liquid-cooling" style={link}>
                direct-to-chip liquid cooling
              </Link>
              , and the access control, detection, and monitoring layers are covered in{" "}
              <Link href="/engineering/safety-security" style={link}>
                safety and security engineering
              </Link>
              .
            </p>
          </div>
        }
      >
        <SectionHead
          eyebrow="H-05 · Control posture"
          title="What infrastructure can and cannot do for compliance"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            This is the part vendors overclaim, so we will be blunt. PODOS holds no healthcare
            certification and makes no compliance claim. Compliance is a property of a regulated
            entity and its whole programme — risk analysis, policies, training, agreements,
            safeguards — not a property of a box. HHS itself states that covered entities are not
            required to certify compliance and that it does not endorse or otherwise recognise
            private organisations&apos; certifications.<Cite n={3} />
          </p>
          <p>
            What infrastructure can do is support a compliance architecture the institution owns. A
            discrete, access-controlled envelope on institution-controlled land gives a privacy
            office a defined perimeter to authorise and audit — the shape the physical safeguards
            standard and the NIST physical and environmental controls describe.<Cite n={1} />
            <Cite n={5} /> NIST&apos;s HIPAA Security Rule resource guide is the practical reference
            for mapping those standards onto evidenceable controls.<Cite n={4} /> That mapping stays
            with the operator.
          </p>
        </div>
      </ProseWithRail>

      {/* 7 · INK BEAT — the compliance statement, not a metric */}
      <QuoteMetric
        quote="Compliance is a property of a regulated entity and its whole programme — risk analysis, policies, training, agreements, safeguards — not a property of a box."
        attribution="H-05 · Control posture · PODOS holds no healthcare certification and makes no compliance claim"
        field="safety"
      />

      {/* 8 · GOVERNANCE REVIEW — cards, paper */}
      <CardGrid
        id="governance-checklist"
        eyebrow="Before the infrastructure conversation"
        title="Eight questions a governance review will ask first"
        lede="Bring answers to these before the infrastructure conversation. They decide more programmes than hardware selection does."
        surface="paper"
        columns={4}
        items={GOVERNANCE_CHECKS.map(([code, label, question]) => ({
          code,
          title: label,
          body: question,
        }))}
      />

      {/* 9 · LIMITS — canvas, mandatory */}
      <LimitsBlock
        title="When this is not the right fit"
        lede="A whole unit is a coarse increment of capacity. These are the cases where a health system should not be talking to us."
        items={[
          "The workload is one or two inference models at low volume. A few GPUs in the data room the institution already operates is right-sized; buying a whole unit to run a rack-scale problem is waste dressed up as strategy.",
          "There is no site. A dense urban campus with no exterior pad and no adjacent institution-controlled land cannot host a unit — modularity does not invent land.",
          "There is no operations owner. A unit needs monitoring, maintenance, coolant chemistry, and an incident path. Where facilities engineering cannot take that on, a cloud region under a business associate agreement is more honest.",
          "Demand is spiky. Irregular research bursts are what elastic capacity is for; owned infrastructure is economic only against a sustained load.",
          "Approval, not compute, is the bottleneck. If review and privacy assessment outlast any build, buying capacity first solves nothing.",
          "A compliance certificate is what is actually wanted. No infrastructure supplier can provide one, ours included, and any vendor offering it is describing something HHS does not recognise.",
        ]}
      />

      {/* 10 · PODOS FIT — prose, paper */}
      <ProseWithRail
        id="podos-fit"
        surface="paper"
        rail={
          <div style={{ borderTop: "1px solid var(--edge-bright)", paddingTop: "1.25rem" }}>
            <p className="eyebrow">Facility side</p>
            <p style={{ marginTop: "1rem", fontSize: "0.9rem", lineHeight: 1.65, color: "var(--ink-dim)" }}>
              The facility-side equivalent — power, pad, access, water, and connectivity — is in the{" "}
              <Link href="/resources/data-center-readiness-checklist" style={link}>
                data center readiness checklist
              </Link>
              .
            </p>
          </div>
        }
      >
        <SectionHead
          eyebrow="In the product"
          title="How a PODOS unit fits a health system estate"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            The{" "}
            <Link href="/platform/podos-pod" style={link}>
              PODOS Pod
            </Link>{" "}
            is{" "}
            <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>{" "}
            and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, with power,
            closed-loop liquid cooling, racks, and monitoring integrated into one enclosure rather
            than built into a room. For a hospital that matters less as a specification than as a
            siting property: the unit lands on a prepared pad outside clinical space, so the archive
            stays on campus while the construction stays off the clinical floorplate. PODOS{" "}
            <span data-claim="deployment-window">targets a 90-day window from order to commissioning</span>{" "}
            for a standard unit — useful mainly because institutional review runs on its own clock
            and the two can proceed in parallel.
          </p>
          <p>
            How a unit arrives and is commissioned is in the{" "}
            <Link href="/deploy" style={link}>
              deployment model
            </Link>
            ; adjacent verticals and their limits are on the{" "}
            <Link href="/use-cases" style={link}>
              use-case hub
            </Link>
            ; terms are defined in the{" "}
            <Link href="/resources/ai-infrastructure-glossary" style={link}>
              AI infrastructure glossary
            </Link>
            .
          </p>
        </div>
      </ProseWithRail>

      {/* 11 · FAQ — canvas */}
      <FAQBlock items={FAQ} surface="canvas" />

      {/* 12 · SOURCES — paper */}
      <Section surface="paper" width="content" pad="flow">
        <EvidenceSourceRail sources={SOURCES} />
      </Section>

      {/* 13 · RELATED — canvas */}
      <RelatedRail
        title="Related reading"
        surface="canvas"
        items={[
          {
            href: "/compare/on-prem-ai-infrastructure-vs-cloud",
            label: "COMPARE",
            title: "On-prem AI infrastructure vs cloud",
          },
          {
            href: "/use-cases/universities-research",
            label: "USE CASE",
            title: "Universities and research computing",
          },
          {
            href: "/engineering/safety-security",
            label: "ENGINEERING",
            title: "Safety and security engineering",
          },
          { href: "/use-cases", label: "USE CASES", title: "All vertical profiles" },
        ]}
      />

      {/* 14 · CTA */}
      <CTABand
        title="Size it against"
        accent="your campus"
        body="Bring the archive, the governance answers, and the pad. The configurator walks the same variables an engineering review would."
        primary={{ href: "/estimate", label: "Size your deployment" }}
        secondary={{ href: "/deploy", label: "Deployment model" }}
        field="safety"
      />
    </main>
  );
}
