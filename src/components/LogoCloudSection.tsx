"use client";

import { LogoCloud } from "@/components/ui/logo-cloud-4";

const BASE_LOGOS = [
  { src: "https://svgl.app/library/google.svg", alt: "Google" },
  { src: "https://svgl.app/library/microsoft.svg", alt: "Microsoft" },
  { src: "https://svgl.app/library/nvidia.svg", alt: "NVIDIA" },
  { src: "https://svgl.app/library/openai.svg", alt: "OpenAI" },
  { src: "https://svgl.app/library/amazon.svg", alt: "Amazon" },
  { src: "https://svgl.app/library/meta.svg", alt: "Meta" },
  { src: "https://svgl.app/library/ibm.svg", alt: "IBM" },
  { src: "https://svgl.app/library/tesla.svg", alt: "Tesla" },
];

// Repeat so one set always exceeds viewport width
const logos = [...BASE_LOGOS, ...BASE_LOGOS, ...BASE_LOGOS];

export default function LogoCloudSection() {
  return (
    <section
      style={{
        position: "relative",
        paddingTop: "3.5rem",
        paddingBottom: "3.5rem",
        background: "var(--void)",
      }}
    >
      <p
        className="text-mono"
        style={{
          textAlign: "center",
          fontSize: "0.72rem",
          letterSpacing: "0.08em",
          color: "var(--text-muted)",
          marginBottom: "1.75rem",
          textTransform: "uppercase",
        }}
      >
        Trusted by Industry Leaders
      </p>
      <LogoCloud logos={logos} />
    </section>
  );
}
