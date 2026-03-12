import HeroSection from '../components/landing/HeroSection';
import GallerySection from '../components/landing/GallerySection';
import CategoriesSection from '../components/landing/CategoriesSection';
import FeaturedSection from '../components/landing/FeaturedSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import AboutSection from '../components/landing/AboutSection';
import CTABanner from '../components/landing/CTABanner';

/**
 * Marketing landing page — composed of modular section components.
 * Rendered inside LandingLayout (which provides Navbar + Footer).
 */
export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <GallerySection />
      <CategoriesSection />
      <FeaturedSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <AboutSection />
      <CTABanner />
    </>
  );
}
