import Hero from "@/components/landing/Hero";
import MarqueeText from "@/components/landing/MarqueeText";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import SocialProof from "@/components/landing/SocialProof";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <MarqueeText />
      <SocialProof />
      <Features />
      <Pricing />
    </>
  );
}

