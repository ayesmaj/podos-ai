/**
 * Mockup route for the testimonial UI component.
 *
 * Mounts <DemoOne /> (which wraps <Example /> from
 * `@/components/ui/testimonial`) so the testimonial row can be seen
 * in isolation under the existing /mockups/* design-review layout.
 *
 * URL: http://localhost:3000/mockups/testimonial
 */
import DemoOne from "@/components/ui/testimonial.demo";

export default function TestimonialMockup() {
  return (
    <div style={{ minHeight: "100vh", padding: "8rem 1.5rem 4rem", background: "#f4f6fb" }}>
      <DemoOne />
    </div>
  );
}
