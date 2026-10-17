import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import Background from "../Components/Background/Background";

const AUTH_PATHS = ["/login", "/register"];

export default function Layout() {
  const { pathname } = useLocation();
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));

  /* ===== LOGIN / REGISTER: viewport-height layout, footer always visible ===== */
  if (isAuthPage) {
    return (
      <div className="relative flex flex-col h-dvh overflow-hidden">
        <ScrollRestoration />
        <Background />
        <Navbar />
        {/* only this area scrolls if the form is taller than the screen */}
        <main className="relative z-10 w-full flex-1 min-h-0 overflow-y-auto">
          <Outlet />
        </main>
        <Footer variant="auth" />
      </div>
    );
  }

  /* ===== ALL OTHER PAGES: exactly as before (untouched) ===== */
  return (
    <div className="relative flex flex-col min-h-screen">
      <ScrollRestoration />
      <Background />
      <Navbar />
      <main className="grow z-10 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}