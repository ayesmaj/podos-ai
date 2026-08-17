/**
 * /invest — premium investor landing page for PODOS.
 *
 * Bright luxury visual system (scoped in invest.css), editorial serif
 * headlines (Cormorant Garamond via next/font), section components under
 * components/invest/, and every number/word configurable in
 * data/investContent.ts. AI-generated visuals are registered in
 * data/invest-page-images.ts and regenerated via
 * scripts/generate-invest-images.mjs or POST /api/generate-image.
 */

import type { Metadata } from "next";
import "./invest.css";

import InvestNav from "@/components/invest/InvestNav";
import InvestHero from "@/components/invest/InvestHero";
import WhyNow from "@/components/invest/WhyNow";
import OpportunitySection from "@/components/invest/OpportunitySection";
import OwnershipCalculator from "@/components/invest/OwnershipCalculator";
import CapitalAllocationSection from "@/components/invest/CapitalAllocationSection";
import MoneySection from "@/components/invest/MoneySection";
import TrustSection from "@/components/invest/TrustSection";
import InvestmentSteps from "@/components/invest/InvestmentSteps";
import FinalCTA from "@/components/invest/FinalCTA";
import LegalDisclaimer from "@/components/invest/LegalDisclaimer";

export const metadata: Metadata = {
  title: "Invest in PODOS — Own a Piece of the Infrastructure Powering AI",
  description:
    "PODOS builds modular AI compute and power infrastructure for the accelerating demands of artificial intelligence. Investment access begins at $1,000.",
  openGraph: {
    title: "Invest in PODOS",
    description:
      "Own a piece of the infrastructure powering the AI era. Access begins at $1,000.",
    url: "https://podosai.com/invest",
  },
};

export default function InvestPage() {
  return (
    <main className="invest">
      <InvestNav />
      <InvestHero />
      <WhyNow />
      <OpportunitySection />
      <OwnershipCalculator />
      <CapitalAllocationSection />
      <MoneySection />
      <TrustSection />
      <InvestmentSteps />
      <FinalCTA />
      <LegalDisclaimer />
    </main>
  );
}
