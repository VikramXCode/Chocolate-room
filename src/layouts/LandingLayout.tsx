import { Outlet } from 'react-router-dom';
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingFooter from '../components/landing/LandingFooter';

/**
 * Layout shell for the marketing / landing pages.
 * Completely separate from CustomerLayout (ordering app).
 */
export default function LandingLayout() {
  return (
    <div className="min-h-screen bg-espresso text-cream selection:bg-gold-400/30 selection:text-white">
      <LandingNavbar />
      <main>
        <Outlet />
      </main>
      <LandingFooter />
    </div>
  );
}
