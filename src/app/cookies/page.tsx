/**
 * /cookies — cookie and browser-storage policy.
 *
 * The honest answer is short: this site sets no cookies for ordinary
 * visitors. Rather than pad it into a template, the page says so and
 * then lists the two staff-only items that do exist, so the claim can be
 * checked rather than trusted.
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
  STORAGE_ITEMS,
  NOT_TRUE_OF_THIS_SITE,
} from "@/content/legal";

const PATH = "/cookies";
const TITLE = "Cookie Policy | PODOS AI";
const DESCRIPTION =
  "PODOS AI sets no cookies for ordinary visitors and runs no analytics or advertising trackers. What little browser storage exists is listed here.";

export const metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const link = { color: "var(--brand-deep)", textDecoration: "underline" } as const;

export default function CookiesPage() {
  return (
    <main>
      <HeroEditorial
        code="LEGAL"
        category="Cookie policy"
        field="blueprint"
        title="This site sets no cookies for"
        accent="ordinary visitors"
        lede="There is no consent banner because there is nothing to consent to. This page lists the only browser storage that exists, both of which are staff-only, so you can verify the claim instead of taking our word for it."
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Cookie policy", path: PATH },
            ]}
          />
        }
        stats={[
          { value: "0", label: "Cookies set for visitors" },
          { value: "0", label: "Third-party trackers" },
          { value: "2", label: "Staff-only storage items" },
        ]}
      />

      <ProseWithRail
        id="summary"
        surface="canvas"
        rail={
          <div style={{ borderTop: "1px solid var(--edge-bright)", paddingTop: "1.25rem" }}>
            <p className="eyebrow">Verify it yourself</p>
            <p style={{ marginTop: "1rem", fontSize: "0.9rem", lineHeight: 1.65, color: "var(--ink-dim)" }}>
              Open your browser&apos;s developer tools, go to the Application or Storage tab, and
              look at Cookies for this domain while browsing any public page. It should be empty.
            </p>
            <p className="eyebrow" style={{ marginTop: "2rem" }}>
              Last updated {LEGAL_UPDATED}
            </p>
          </div>
        }
      >
        <SectionHead eyebrow="Summary" title="Why there is no cookie banner" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Consent banners exist because most sites load analytics, advertising, and social
            trackers that read and write cookies on a visitor&apos;s device. This site loads none of
            them. Reading any public page here sets nothing on your device, so there is no consent
            to collect and no preference to remember.
          </p>
          <p>
            Fonts are self-hosted and served from this domain rather than fetched from Google Fonts,
            so even loading the typography makes no request to a third party. The only information
            that reaches us is what you deliberately type into the enquiry form and submit — covered
            in the{" "}
            <Link href="/privacy" style={link}>
              privacy policy
            </Link>
            .
          </p>
        </div>
      </ProseWithRail>

      <MatrixTable
        id="storage"
        eyebrow="Full inventory"
        title="The only browser storage this site uses"
        lede="Both items exist solely for internal staff pages. Neither is created while browsing the public site, and neither is used to identify or track anyone."
        surface="paper"
        head={["Name", "Type", "Who it applies to", "What it does"]}
        rows={STORAGE_ITEMS.map((s) => [s.name, s.kind, s.scope, s.purpose])}
      />

      <ProseWithRail id="control" surface="canvas">
        <SectionHead eyebrow="Your control" title="Clearing or blocking storage" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Because nothing is set for ordinary visitors, there is nothing you need to clear. If you
            are a staff member using the admin pages, clearing site data for this domain will remove
            both items listed above and sign you out of the internal pages.
          </p>
          <p>
            Blocking cookies for this domain entirely will not affect the public site in any way —
            every page, table, and diagram works without them, because none of it depends on storage.
          </p>
        </div>
      </ProseWithRail>

      <LimitsBlock
        eyebrow="Stated plainly"
        title="What this site does not do"
        lede="The same list appears on the privacy policy, from the same source file, so the two pages cannot drift apart."
        items={NOT_TRUE_OF_THIS_SITE}
      />

      <Section surface="paper" width="content" pad="flow" id="contact">
        <SectionHead
          eyebrow="Contact"
          title="If this ever changes"
          lede={`If we later add analytics or any technology that stores data on your device, we will update this page before it goes live and add a consent mechanism if one is required. Questions: ${LEGAL_CONTACT}.`}
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
          { href: "/terms", label: "LEGAL", title: "Terms of use" },
          { href: "/", label: "HOME", title: "PODOS AI" },
        ]}
      />
    </main>
  );
}
