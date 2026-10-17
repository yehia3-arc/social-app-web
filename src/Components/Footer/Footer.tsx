import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaArrowUp,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { useLanguage, type Lang } from "../../Context/LanguageContext";
import { useTheme } from "../../Context/ThemeContext";

export default function Footer({
  variant = "default",
}: {
  variant?: "default" | "auth";
}) {
  const { t, lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isAuth = variant === "auth";

  const backToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  /* hint shown only on auth pages (mobile) */
  const translated = t("authLangHint");
  const hint =
    translated && translated !== "authLangHint"
      ? translated
      : "You can change the language here — even before login or register.";

  return (
    <footer className="mt-auto shrink-0 bg-slate-900 dark:bg-slate-950 text-slate-300">
      <div
        className={`w-full max-w-5xl mx-auto px-4 grid gap-8 md:grid-cols-3 ${
          isAuth ? "py-4 md:py-10" : "py-10"
        }`}
      >
        {/* brand + socials — hidden on mobile in auth pages */}
        <div className={isAuth ? "hidden md:block" : ""}>
          <p className="text-2xl font-extrabold text-indigo-400 mb-2">Logo</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            {t("footerTagline")}
          </p>
          <div className="flex gap-2 mt-4">
            {[FaFacebookF, FaTwitter, FaGithub, FaLinkedinIn, FaInstagram].map(
              (Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social link"
                  className="size-9 rounded-full bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition-colors"
                >
                  <Icon />
                </a>
              ),
            )}
          </div>
        </div>

        {/* quick links — hidden on mobile in auth pages */}
        <nav className={isAuth ? "hidden md:block" : ""}>
          <h3 className="font-bold text-white mb-3">{t("quickLinks")}</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <Link className="hover:text-indigo-400 transition-colors" to="/home">
                {t("home")}
              </Link>
            </li>
            <li>
              <Link className="hover:text-indigo-400 transition-colors" to="/guide">
                {t("guide")}
              </Link>
            </li>
            <li>
              <Link className="hover:text-indigo-400 transition-colors" to="/bookmarks">
                {t("bookmarks")}
              </Link>
            </li>
            <li>
              <Link className="hover:text-indigo-400 transition-colors" to="/profile">
                {t("profile")}
              </Link>
            </li>
          </ul>
        </nav>

        {/* preferences: language + theme (always visible, even on mobile) */}
        <div>
          {isAuth && (
            <p className="md:hidden mb-3 flex items-center gap-2 text-xs text-slate-400">
              🌐 {hint}
            </p>
          )}
          <h3 className="font-bold text-white mb-3">{t("settings")}</h3>
          <div
            className={`flex gap-3 text-sm ${
              isAuth
                ? "flex-row flex-wrap items-center md:flex-col"
                : "flex-col"
            }`}
          >
            <label className="flex items-center gap-2">
              {t("language")}
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
                className="rounded-lg bg-slate-800 border border-slate-700 p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
                <option value="es">Español</option>
                <option value="zh">中文</option>
                <option value="ru">Русский</option>
                <option value="de">Deutsch</option>
                <option value="ja">日本語</option>
              </select>
            </label>
            <button
              onClick={toggleTheme}
              className="w-fit flex items-center gap-2 hover:text-indigo-400 cursor-pointer transition-colors"
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-3 text-sm text-slate-400">
          <p>
            © {new Date().getFullYear()} Logo — {t("rights")} • Made by{" "}
            <span className="text-indigo-400 font-bold">Yehia Mohamed</span>
          </p>
          {/* back-to-top is useless when the page itself doesn't scroll */}
          {!isAuth && (
            <button
              onClick={backToTop}
              aria-label="back to top"
              className={`size-9 rounded-full bg-slate-800 hover:bg-indigo-600 flex items-center justify-center cursor-pointer transition-colors ${
    isAuth ? "md:hidden" : ""
  }`}
            >
              <FaArrowUp />
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}