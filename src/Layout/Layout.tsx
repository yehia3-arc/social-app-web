import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import Background from "../Components/Background/Background";

const AUTH_PATHS = ["/login", "/register"];

export default function Layout() {
  const { pathname } = useLocation();
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));

  /* ===== LOGIN / REGISTER ===== */
  if (isAuthPage) {
    return (
      /* mobile: normal page height + normal scroll (footer at the end)
         desktop (md+): fixed viewport height, footer always visible */
      <div className="relative flex flex-col min-h-dvh md:h-dvh md:overflow-hidden">
        <ScrollRestoration />
        <Background />
        <Navbar />
        {/* mobile: grows naturally • desktop: the only scrollable area */}
        <main className="relative z-10 w-full flex-1 md:min-h-0 md:overflow-y-auto">
          <Outlet />
        </main>
        <Footer variant="auth" />
      </div>
    );
  }

  /* ===== ALL OTHER PAGES: exactly as before ===== */
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