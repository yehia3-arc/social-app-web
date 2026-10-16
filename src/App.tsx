import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Layout from "./Layout/Layout";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import NotFound from "./Pages/NotFount/NotFound";
import { CounterContextProvider } from "./Context/CounterContext";
import AuthContextProvider from "./Context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import PostDetails from "./Pages/PostDetails/PostDetails";
import toast, { Toaster } from "react-hot-toast";
import { useNetworkState, useBattery } from "react-use"; // ✅ 1. Added useBattery back
import { useEffect } from "react"; // ✅ 2. Added useEffect
import Offline from "./Components/Offline/Offline";
import UserProfile from "./Pages/UserProfile/UserProfile";
import Bookmarks from "./Pages/Bookmarks/Bookmarks";
import Guide from "./Pages/Guide/Guide"; // ✅ NEW
import { ThemeContextProvider } from "./Context/ThemeContext";
import { LanguageContextProvider } from "./Context/LanguageContext";
const query = new QueryClient();

const routers = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "postdetails/:id",
        element: (
          <ProtectedRoute>
            <PostDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "bookmarks",
        element: (
          <ProtectedRoute>
            <Bookmarks />
          </ProtectedRoute>
        ),
      },
      {
        path: "user/:userId",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      { path: "guide", element: <Guide /> }, // ✅ NEW guide page
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  const { online } = useNetworkState();

  // ✅ 3. Get battery state
  const battery = useBattery();

  // ✅ 4. Trigger Toast when battery is low
  useEffect(() => {
    console.log("Battery State:", battery);

    // Check if API is supported, data is fetched, battery < 22%, and NOT charging
    if (
      battery.isSupported &&
      battery.fetched &&
      battery.level < 0.22 &&
      !battery.charging
    ) {
      toast.error(
        "⚠️ Low Battery! Your battery is below 20%. Please connect your charger.",
        {
          duration: 20000, // Show for 8 seconds
          position: "top-center", // Appear at the top of the screen
          icon: "🔋",
          style: {
            background: "#dc2626", // Red background
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "8px",
          },
        },
      );
    }
  }, [battery]);

  return (
    <>
      {!online && <Offline />}
      {/* 3. Toaster for other temporary notifications */}
      <Toaster position="top-center" reverseOrder={false} />

      <QueryClientProvider client={query}>
        <ThemeContextProvider>
          <LanguageContextProvider>
            <AuthContextProvider>
              <CounterContextProvider>
                <RouterProvider router={routers} />
              </CounterContextProvider>
            </AuthContextProvider>
          </LanguageContextProvider>
        </ThemeContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
