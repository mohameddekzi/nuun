import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/contact-section";
import { PageHero } from "@/components/sections/page-hero";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Nuun Media. Start your creative project today.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        badge="Get In Touch"
        title="Start Your"
        highlight="Project Today"
        description="Tell us about your vision and we'll help bring it to life."
      />
      <ContactSection />
    </>
  );
}
