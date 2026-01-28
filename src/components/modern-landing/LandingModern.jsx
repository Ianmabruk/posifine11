import { useState } from "react";
import Hero from "./Hero";
import Features from "./Features";
import Pricing from "./Pricing";
import Login from "./Login";
import Footer from "./Footer";
import DemoModal from "./DemoModal";

export default function LandingModern() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="font-sans bg-[#fef8f0] text-[#6b4c3b] min-h-screen overflow-x-hidden">
      <Hero onOpenDemo={() => setIsModalOpen(true)} />
      <Features />
      <Pricing />
      <Login />
      <Footer />
      <DemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
