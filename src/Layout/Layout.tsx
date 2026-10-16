import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import { Outlet, ScrollRestoration } from "react-router-dom";
import Background from "../Components/Background/Background";

export default function Layout() {
  return (
    // ✅ 1. Make the layout a flex column taking full height
    <div className="relative flex flex-col min-h-screen">
      <ScrollRestoration />

      {/* ✅ 2. Background stays fixed behind everything */}
      <Background />

      <Navbar />

      {/* ✅ 3. Remove 'absolute inset-0' and solid background. 
             Add 'flex-grow' and 'z-10' so content sits on top of background */}
      <main className="grow z-10 w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
