import { useContext, useState } from "react";
import { useLanguage } from "../../Context/LanguageContext";
import { FaBars, FaMoon, FaSun } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import Notifications from "../Notifications/Notifications";
import { useTheme } from "../../Context/ThemeContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { userLogin, setuserLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  function logout() {
    localStorage.removeItem("userToken");
    setuserLogin(null);
    navigate("/login");
  }

  // ✅ one place for colors = easy to maintain (light + dark together)
  const linkCls =
    "text-gray-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium";
  const mobileLinkCls =
    "block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-slate-800";

  return (
    <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="shrink-0 flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-indigo-600 dark:text-indigo-400"
            >
              Logo
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-yellow-400 hover:scale-110 transition-transform cursor-pointer"
              title="Toggle Theme"
            >
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </button>
            {userLogin ? (
              <>
                <Link to="/" className={linkCls}>
                  {t("home")}
                </Link>
                <Link to="/profile" className={linkCls}>
                  {t("profile")}
                </Link>
                <Link to="/bookmarks" className={linkCls}>
                  {t("bookmarks")}
                </Link>
                <Notifications />
                <button
                  onClick={logout}
                  className="cursor-pointer text-white hover:text-indigo-600 transition-colors font-medium bg-amber-500 hover:bg-amber-600 p-3 rounded-2xl"
                >
                  {t("logout")}
                </button>
              </>
            ) : (
              <>
                <Link to="/register" className={linkCls}>
                  {t("register")}
                </Link>
                <Link
                  to="/login"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  {t("login")}
                </Link>
              </>
            )}
            <Link to="/guide" className={linkCls}>
              {t("guide")}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-slate-200 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-expanded={isOpen}
            >
              {!isOpen ? <FaBars /> : <IoMdClose />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
          <div className="flex flex-col gap-4">
            <Link to="/guide" className={mobileLinkCls}>
              {t("guide")}
            </Link>
            {userLogin ? (
              <>
                <Link to="/" className={mobileLinkCls}>
                  {t("home")}
                </Link>
                <Link to="/profile" className={mobileLinkCls}>
                  {t("profile")}
                </Link>
                <Link to="/bookmarks" className={mobileLinkCls}>
                  {t("bookmarks")}
                </Link>
                <Notifications />
                <button
                  onClick={logout}
                  className="cursor-pointer text-base font-medium text-white bg-amber-500 hover:bg-amber-600 p-2 rounded-2xl"
                >
                  {t("logout")}
                </button>
              </>
            ) : (
              <>
                <Link to="/register" className={mobileLinkCls}>
                  {t("register")}
                </Link>
                <Link
                  to="/login"
                  className="block bg-indigo-600 text-base text-white px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium mt-2"
                >
                  {t("login")}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
