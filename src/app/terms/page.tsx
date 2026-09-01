/**
 * /terms — terms of use for the website.
 *
 * The load-bearing section is "Nothing here is an offer": the site
 * carries an investor-interest flow and an estimator whose price book is
 * unapproved, so the boundary between information and offer must be
 * stated explicitly rather than implied.
 *
 * Written by the engineering team; NOT reviewed by counsel.
 */

import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import {
  HeroEditorial,
  ProseWithRail,
  MatrixTable,
  LimitsBlock,
  Section,
  SectionHead,
  RelatedRail,
} from "@/components/seo/sections";
import { LEGAL_UPDATED, LEGAL_ENTITY, LEGAL_CONTACT } from "@/content/legal";
import { PRICING } from "@/data/configuratorPricing";

const PATH = "/terms";
const TITLE = "Terms of Use | PODOS AI";
const DESCRIPTION =
  "The terms governing use of podosai.com: nothing on the site is an offer, estimates are not quotes, and all product figures are design targets.";

export const metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const link = { color: "var(--brand-deep)", textDecoration: "underline" } as const;

const TOC = [
  ["#acceptance", "Acceptance"],
  ["#not-an-offer", "Nothing here is an offer"],
  ["#figures", "How to read our figures"],
  ["#estimates", "Estimates are not quotes"],
  ["#ip", "Content and trademarks"],
  ["#limitations", "Disclaimers and liability"],
  ["#contact", "Contact"],
];

/** How each class of number on the site should be read. */
const FIGURE_CLASSES: [string, string, string][] = [
  [
    "Design target",
    "A figure the product is being designed to meet.",
    "Always carries a qualifier such as “designed as”, “designed for”, or “targets”. It is not a measurement and not a guarantee.",
  ],
  [
    "Third-party figure",
    "A number published by an outside body — ASHRAE, Uptime Institute, IEA, LBNL, NVIDIA and similar.",
    "Carries a numbered citation to the original source. It describes the industry, not our product.",
  ],
  [
    "Worked calculation",
    "Our own arithmetic from stated assumptions.",
    "Every input is listed on the page so you can re-run it and disagree. The assumptions, not the result, are the substance.",
  ],
  [
    "Preliminary estimate",
    "Output of the estimator.",
    "A planning range built from indicative inputs. Not a quote, offer, or price.",
  ],
];

export default function TermsPage() {
  return (
    <main>
      <HeroEditorial
        code="LEGAL"
        category="Terms of use"
        field="blueprint"
        title="Information, not"
        accent="an offer"
        lede={`${LEGAL_ENTITY} is an early-stage company. This site explains what we are building and how it is designed to work. It does not sell anything, and nothing on it creates an agreement between us.`}
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Terms of use", path: PATH },
            ]}
          />
        }
        stats={[
          { value: "0", label: "Securities offered here" },
          { value: "0", label: "Quotes or binding prices" },
          { value: "0", label: "Certifications claimed" },
        ]}
      />

      <ProseWithRail
        id="acceptance"
        surface="canvas"
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
            <p className="eyebrow" style={{ marginTop: "2rem" }}>
              Last updated {LEGAL_UPDATED}
            </p>
          </div>
        }
      >
        <SectionHead eyebrow="Acceptance" title="Using the site means accepting these terms" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            By using www.podosai.com you accept these terms. If you do not accept them, please stop
            using the site. We may update them; the date on this page shows when they last changed,
            and continuing to use the site after a change means you accept the updated version.
          </p>
          <p>
            How we handle anything you send us is described separately in the{" "}
            <Link href="/privacy" style={link}>
              privacy policy
            </Link>
            , and browser storage in the{" "}
            <Link href="/cookies" style={link}>
              cookie policy
            </Link>
            .
          </p>
        </div>
      </ProseWithRail>

      <ProseWithRail id="not-an-offer" surface="paper">
        <SectionHead
          eyebrow="The important part"
          title="Nothing on this site is an offer to sell securities"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            The investor pages describe what {LEGAL_ENTITY} is building and let you register interest.
            They are informational. Nothing on this site is an offer to sell, or a solicitation of an
            offer to buy, any security, and nothing here should be relied on as investment, legal,
            tax, or accounting advice. We are not a licensed broker-dealer or investment adviser.
          </p>
          <p>
            Submitting the interest form does not create any obligation on either side. It does not
            reserve capacity, does not allocate anything to you, and does not entitle you to
            participate in any future transaction. If an offering is ever made, it would be made only
            through formal offering documents to eligible persons, and those documents — not this
            website — would govern entirely and would supersede anything stated here.
          </p>
          <p>
            Forward-looking statements on this site — plans, timelines, design targets, and intended
            capabilities — describe present intent. They are not promises, and actual outcomes may
            differ materially.
          </p>
        </div>
      </ProseWithRail>

      <MatrixTable
        id="figures"
        eyebrow="Reading the site"
        title="What each kind of number means"
        lede="The site deliberately distinguishes four classes of figure. Knowing which you are looking at tells you how much weight it carries."
        surface="canvas"
        head={["Class", "What it is", "How to read it"]}
        rows={FIGURE_CLASSES.map(([a, b, c]) => [a, b, c])}
      />

      <ProseWithRail id="estimates" surface="paper">
        <SectionHead eyebrow="Estimator" title="Estimates are not quotes" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Any figure produced by the estimator is a preliminary planning range, not a quote, offer,
            price, or contract. It excludes site-specific civil works, permitting, utility
            interconnection, taxes, duties, and freight, all of which are decided by your site rather
            than by the configuration.
            {PRICING.approved
              ? " Prices reflect the current approved price book and remain subject to change."
              : " The underlying price book is not approved and the figures are indicative placeholders, which is why the estimator is not linked from site navigation and is excluded from search indexing."}
          </p>
          <p>
            A binding price can only come from a written quotation signed by {LEGAL_ENTITY}. If you
            need one, write to{" "}
            <a href={`mailto:${LEGAL_CONTACT}`} style={link}>
              {LEGAL_CONTACT}
            </a>
            .
          </p>
        </div>
      </ProseWithRail>

      <ProseWithRail id="ip" surface="canvas">
        <SectionHead eyebrow="Content" title="Content, trademarks, and acceptable use" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            The text, diagrams, renders, and design of this site belong to {LEGAL_ENTITY} unless
            marked otherwise. You may read, quote, and link to it with attribution. You may not
            republish it wholesale, present it as your own, or use our name or marks in a way that
            suggests endorsement or partnership that does not exist.
          </p>
          <p>
            Renders and visualisations on this site are labelled where they are conceptual. They
            illustrate design intent and are not photographs of delivered equipment. Third-party
            names and standards are referenced for identification only; their owners do not endorse{" "}
            {LEGAL_ENTITY}.
          </p>
          <p>
            Please do not attempt to gain unauthorised access to any part of the site or its
            infrastructure, scrape it in a way that degrades it for others, or use it to send
            unsolicited or automated submissions.
          </p>
        </div>
      </ProseWithRail>

      <LimitsBlock
        eyebrow="Disclaimers"
        title="What we do not warrant"
        lede="Stated plainly rather than buried in capitals."
        items={[
          "The site is provided as-is. We do not warrant that it is complete, current, error-free, or continuously available.",
          "Technical content describes engineering practice in general terms. It is not a design, a specification, or professional engineering advice for your site, and it does not replace a qualified engineer.",
          `${LEGAL_ENTITY} claims no certification, attestation, or accreditation for any product described here, and nothing on the site should be read as one.`,
          "We link to external sources so you can check our reasoning. We do not control those sites and are not responsible for their content.",
          "To the fullest extent the law allows, we are not liable for indirect or consequential loss arising from use of this site. Nothing here limits liability that cannot lawfully be limited, including for fraud or for death or personal injury caused by negligence.",
          "Nothing on this site describes a completed deployment, a customer, or a delivered product.",
        ]}
      />

      <Section surface="paper" width="content" pad="flow" id="contact">
        <SectionHead
          eyebrow="Contact"
          title="Questions about these terms"
          lede={`Write to ${LEGAL_CONTACT}.`}
        />
        <p className="eyebrow" style={{ marginTop: "2rem" }}>
          Last updated {LEGAL_UPDATED} · {LEGAL_ENTITY}
        </p>
      </Section>

      <RelatedRail
        title="Related"
        surface="canvas"
        items={[
          { href: "/privacy", label: "LEGAL", title: "Privacy policy" },
          { href: "/cookies", label: "LEGAL", title: "Cookies and browser storage" },
          { href: "/invest", label: "INVEST", title: "Investor information" },
        ]}
      />
    </main>
  );
}
