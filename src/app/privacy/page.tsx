/**
 * /privacy — privacy policy.
 *
 * Every statement here is derived from src/content/legal.ts, which was
 * written against the code that actually runs. Do not add a practice
 * here that the site does not perform, and do not remove one it does.
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
import {
  LEGAL_UPDATED,
  LEGAL_ENTITY,
  LEGAL_CONTACT,
  COLLECTED_FIELDS,
  PROCESSORS,
  NOT_TRUE_OF_THIS_SITE,
} from "@/content/legal";

const PATH = "/privacy";
const TITLE = "Privacy Policy | PODOS AI";
const DESCRIPTION =
  "What PODOS AI collects, why, who processes it, and how to have it deleted. No analytics, no advertising trackers, no third-party cookies.";

export const metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const link = { color: "var(--brand-deep)", textDecoration: "underline" } as const;

const TOC = [
  ["#scope", "Scope"],
  ["#what-we-collect", "What we collect"],
  ["#why", "Why we collect it"],
  ["#processors", "Who else receives it"],
  ["#retention", "How long we keep it"],
  ["#rights", "Your choices"],
  ["#limitations", "What this site does not do"],
  ["#contact", "Contact"],
];

export default function PrivacyPage() {
  return (
    <main>
      <HeroEditorial
        code="LEGAL"
        category="Privacy policy"
        field="blueprint"
        title="What we collect, and"
        accent="what we don't"
        lede={`${LEGAL_ENTITY} runs one visitor-facing form and no tracking of any kind. This page describes exactly what happens to the information you choose to send.`}
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Privacy policy", path: PATH },
            ]}
          />
        }
        stats={[
          { value: "1", label: "Form on the whole site" },
          { value: "0", label: "Analytics or ad trackers" },
          { value: "0", label: "Third-party cookies" },
        ]}
      />

      <ProseWithRail
        id="scope"
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
        <SectionHead eyebrow="Scope" title="What this policy covers" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            This policy covers <strong>www.podosai.com</strong> and the enquiry form on it. It does
            not cover any separate agreement you may later sign with {LEGAL_ENTITY}, or any document
            room or offering process, which would be governed by their own terms.
          </p>
          <p>
            {LEGAL_ENTITY} is an early-stage company. There is no customer account system on this
            site, nothing to log into, and no profile is built about visitors. The only way personal
            information reaches us through this website is if you type it into the enquiry form and
            submit it.
          </p>
        </div>
      </ProseWithRail>

      <MatrixTable
        id="what-we-collect"
        eyebrow="Collection"
        title="Every field the form sends"
        lede="This is the complete list. Nothing else about you is captured by the page you are reading."
        surface="paper"
        head={["Field", "Required?", "Why it is asked"]}
        rows={COLLECTED_FIELDS.map((f) => [f.field, f.required, f.why])}
      />

      <ProseWithRail id="why" surface="canvas">
        <SectionHead eyebrow="Purpose" title="Why we collect it, and the only thing we do with it" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            We use what you submit to reply to your enquiry and to keep an internal record of who
            contacted us and when. That is the entire purpose. We do not use it to build advertising
            audiences, we do not enrich it against data brokers, and we do not sell, rent, or share
            it with anyone for their own marketing.
          </p>
          <p>
            The accredited-investor question is self-declared. We do not verify your answer, and
            answering it does not make you an accredited investor, does not create any relationship
            between us, and does not entitle you to participate in anything. Submitting the form is
            an expression of interest only — it is not an offer, not an agreement, and not binding
            on either side. The{" "}
            <Link href="/terms" style={link}>
              terms of use
            </Link>{" "}
            explain that boundary in full.
          </p>
          <p>
            The form also contains a hidden field that real people never see. If it arrives filled
            in, the submission is discarded as automated spam. This is the only automated decision
            the form makes, and it has no effect on a genuine submission.
          </p>
        </div>
      </ProseWithRail>

      <MatrixTable
        id="processors"
        eyebrow="Third parties"
        title="Who else receives your information"
        lede="We use ordinary infrastructure vendors to store the enquiry and deliver the notification email. They process it on our behalf, not for their own purposes."
        surface="paper"
        head={["Provider", "Role", "What it receives"]}
        rows={PROCESSORS.map((p) => [p.name, p.role, p.data])}
      />

      <ProseWithRail id="retention" surface="canvas">
        <SectionHead eyebrow="Retention and security" title="How long we keep it, and how it is held" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Enquiries are kept while the conversation is live and for as long as we may need a record
            of it. We have not set a fixed deletion schedule; if you ask us to delete your enquiry we
            will do so, and we will confirm when it is done.
          </p>
          <p>
            Submissions travel over HTTPS and are stored in a hosted database configured so the
            public website key can only write new rows, never read existing ones. No system is
            perfectly secure, and we do not claim any certification, attestation, or accreditation
            for this site or for any {LEGAL_ENTITY} product.
          </p>
        </div>
      </ProseWithRail>

      <ProseWithRail id="rights" surface="paper">
        <SectionHead eyebrow="Your choices" title="Access, correction, and deletion" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Email{" "}
            <a href={`mailto:${LEGAL_CONTACT}`} style={link}>
              {LEGAL_CONTACT}
            </a>{" "}
            and ask us to send you a copy of what we hold about you, correct something that is wrong,
            or delete it entirely. Please write from the address you used on the form so we can match
            the record without asking you for more personal information than we already have.
          </p>
          <p>
            Depending on where you live, local law may give you additional rights — for example under
            the GDPR in the UK and EU, or the CCPA in California. We will honour a request of the
            kinds described above regardless of where you are, without asking which law you are
            relying on.
          </p>
        </div>
      </ProseWithRail>

      <LimitsBlock
        eyebrow="Stated plainly"
        title="What this site does not do"
        lede="Written as flat statements so they can be checked against the page source rather than taken on trust."
        items={NOT_TRUE_OF_THIS_SITE}
      />

      <Section surface="paper" width="content" pad="flow" id="contact">
        <SectionHead
          eyebrow="Contact"
          title="Questions about this policy"
          lede={`Write to ${LEGAL_CONTACT}. If we change this policy we will update the date on this page; material changes will say what changed.`}
        />
        <p className="eyebrow" style={{ marginTop: "2rem" }}>
          Last updated {LEGAL_UPDATED} · {LEGAL_ENTITY}
        </p>
      </Section>

      <RelatedRail
        title="Related"
        surface="canvas"
        items={[
          { href: "/terms", label: "LEGAL", title: "Terms of use" },
          { href: "/cookies", label: "LEGAL", title: "Cookies and browser storage" },
          { href: "/invest", label: "INVEST", title: "Investor information" },
        ]}
      />
    </main>
  );
}
