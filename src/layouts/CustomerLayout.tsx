import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';

/**
 * Shared layout shell for all customer-facing pages.
 * Renders Navbar + page content (via <Outlet />) + Footer + CartDrawer overlay.
 */
export default function CustomerLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-espresso">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
