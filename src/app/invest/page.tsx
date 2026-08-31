/**
 * /invest — PODOS investor experience (V3).
 *
 * Narrative order (per V3 brief §20): product clarity → 35-second film →
 * market constraint → confidential industry collaborations → product
 * anatomy → deployment-model comparison → manufacturing & deployment
 * journey → illustrative scale model → evidence → money moment → capital
 * cycle → ownership → process/risk → monumental final CTA.
 *
 * All financial/relational claims are gated by src/data/investOffering.ts.
 * Visual assets are approved GPT-Image-2 renders (bright architectural
 * world, consistent pod) registered in src/data/invest-page-images.ts.
 */

import type { Metadata } from "next";
import "./invest.css";

import InvestNav from "@/components/invest/InvestNav";
import InvestHero from "@/components/invest/InvestHero";
import PodosFilm from "@/components/invest/PodosFilm";
import Constraint from "@/components/invest/Constraint";
import Collaborations from "@/components/invest/Collaborations";
import ProductAnatomy from "@/components/invest/ProductAnatomy";
import OpportunitySection from "@/components/invest/OpportunitySection";
import DeploymentJourney from "@/components/invest/DeploymentJourney";
import ScaleModel from "@/components/invest/ScaleModel";
import Evidence from "@/components/invest/Evidence";
import MoneyMoment from "@/components/invest/MoneyMoment";
import CapitalCycle from "@/components/invest/CapitalCycle";
import OwnershipCalculator from "@/components/invest/OwnershipCalculator";
import ProcessSection from "@/components/invest/ProcessSection";
import FinalCTA from "@/components/invest/FinalCTA";
import LegalDisclaimer from "@/components/invest/LegalDisclaimer";
import StickyInvestCTA from "@/components/invest/StickyInvestCTA";
import InvestorAccessFlow from "@/components/invest/InvestorAccessFlow";

export const metadata: Metadata = {
  title: "Invest in PODOS — Turn Available Power into Deployable AI Compute",
  description:
    "PODOS builds factory-made modular units that integrate power, cooling, server racks, and communications — a faster path to AI capacity. Explore the investment opportunity.",
  alternates: { canonical: "https://www.podosai.com/invest" },
  openGraph: {
    title: "Invest in PODOS",
    description:
      "Own a piece of the company building a faster path to AI capacity.",
    url: "https://www.podosai.com/invest",
    images: [{ url: "https://www.podosai.com/visuals/invest/hero-pavilion.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Invest in PODOS",
    description:
      "Own a piece of the company building a faster path to AI capacity.",
    images: ["https://www.podosai.com/visuals/invest/hero-pavilion.png"],
  },
};

export default function InvestPage() {
  return (
    <main className="invest">
      <InvestNav />
      <InvestHero />
      <PodosFilm />
      <Constraint />
      <Collaborations />
      <ProductAnatomy />
      <OpportunitySection />
      <DeploymentJourney />
      <ScaleModel />
      <Evidence />
      <MoneyMoment />
      <CapitalCycle />
      <OwnershipCalculator />
      <ProcessSection />
      <FinalCTA />
      <LegalDisclaimer />
      <StickyInvestCTA />
      <InvestorAccessFlow />
    </main>
  );
}
