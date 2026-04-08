import Image from "next/image";
import Navbar from "@/components/Navbar";
import HeroScene from "@/components/HeroScene";
import PodRevealScene from "@/components/PodRevealScene";
import EnergyFlowScene from "@/components/EnergyFlowScene";
import DeploymentScene from "@/components/DeploymentScene";
import WhyPodos from "@/components/WhyPodos";
import SpecsSection from "@/components/SpecsSection";
import CTAControlPanel from "@/components/CTAControlPanel";
import LogoCloudSection from "@/components/LogoCloudSection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroScene />
      <LogoCloudSection />
      <PodRevealScene />
      <EnergyFlowScene />
      <DeploymentScene />
      <WhyPodos />
      <SpecsSection />
      <CTAControlPanel />
      <footer
        className="flex flex-col items-center gap-4 py-16 text-center"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "var(--void)" }}
      >
        <Image
          src="/logo.png"
          alt="PODOS AI"
          width={110}
          height={36}
          style={{ objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.4 }}
        />
        <p className="text-mono" style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>
          Advanced Modular AI Infrastructure
        </p>
        <a href="mailto:inquiries@podosai.com" className="text-mono" style={{ color: "var(--accent)", fontSize: "0.7rem" }}>
          inquiries@podosai.com
        </a>
        <p className="text-mono" style={{ opacity: 0.3, fontSize: "0.62rem" }}>
          © 2025 PODOS AI. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
