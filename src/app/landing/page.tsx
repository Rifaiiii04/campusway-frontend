"use client";

import PageTitle from "../../components/PageTitle";
import {
  Navigation,
  HeroSection,
  FeaturesSection,
  AboutSection,
  CTASection,
  Footer,
} from "../../components/landing";

export default function LandingPage() {
  return (
    <>
      <PageTitle
        title="ArahPotensi - Temukan Jurusan yang Tepat untuk Masa Depanmu"
        description="Platform pemilihan jurusan untuk membantu siswa/i menentukan jurusan perkuliahan yang cocok berdasarkan minat dan bakat"
      />

      <Navigation />

      <HeroSection />

      <FeaturesSection />

      <AboutSection />

      <CTASection />

      <Footer />
    </>
  );
}
