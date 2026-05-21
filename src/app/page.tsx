import HeroVideoNarrative from "@/components/site/HeroVideoNarrative";
import ProblemDiagnosis from "@/components/site/ProblemDiagnosis";
import SolutionCards from "@/components/site/SolutionCards";
import PodosPod from "@/components/site/PodosPod";
import DeploymentTimeline from "@/components/site/DeploymentTimeline";
import UseCases from "@/components/site/UseCases";
import Manufacturing from "@/components/site/Manufacturing";
import DesignTechEnvironment from "@/components/site/DesignTechEnvironment";
import MeetTheTeam from "@/components/site/MeetTheTeam";
import YossiVideoSection from "@/components/site/YossiVideoSection";
import RequestAccessCTA from "@/components/site/RequestAccessCTA";
import Footer from "@/components/site/Footer";
import ScrollProgressRail from "@/components/site/ScrollProgressRail";

export default function Home() {
  return (
    <>
      {/* Hero is its own component with self-contained nav, video, and
          chapter overlay system. Replaces the prior PodosScrollHeroIntro
          + HeroAIWall composition with a single scroll-driven narrative
          driven by the intro.mp4 video. */}
      <HeroVideoNarrative />

      <main className="pageOverlay">
        <ProblemDiagnosis />
        {/* Founder video — "What we're building, and why now." with
            custom controls (play/pause, scrubber, mute, volume,
            fullscreen, keyboard shortcuts). Mounted RIGHT AFTER the
            Problem section so the user hears Yossi answer "what + why
            now" BEFORE they see the solution detailed in cards — the
            founder's framing sets up everything that follows. */}
        <YossiVideoSection />
        <SolutionCards />
        <PodosPod />
        <DeploymentTimeline />
        <UseCases />
        <Manufacturing />
        <DesignTechEnvironment />
        <MeetTheTeam />
        <RequestAccessCTA />
      </main>
      <Footer />
      <ScrollProgressRail />
    </>
  );
}
