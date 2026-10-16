import { useState, type ReactElement } from "react";
import { useLanguage } from "../../Context/LanguageContext";
import {
  FaBookOpen,
  FaSearch,
  FaPen,
  FaRegComment,
  FaShare,
  FaBell,
  FaUserPlus,
  FaCamera,
  FaLock,
  FaChevronDown,
  FaImage,
  FaMoon,
} from "react-icons/fa";

type GuideItem = {
  icon: ReactElement;
  title: string;
  steps: string[];
};

// ✅ All guide content lives HERE (no API needed)
// ⚠️ DO NOT CHANGE — it also acts as the English fallback
const GUIDE: GuideItem[] = [
  {
    icon: <FaPen />,
    title: "Create a post",
    steps: [
      "Go to Home and write in “What's on your mind?”.",
      "Optionally attach one image using the Upload Image box.",
      "Press Post — it appears instantly at the top of the feed.",
      "On your own posts use the ⋮ menu → Edit (text + image) or Delete.",
    ],
  },
  {
    icon: <FaRegComment />,
    title: "Comments & replies",
    steps: [
      "Write in “Write a comment...” under any post and press the send button.",
      "Long comments are cut to 3 lines — press “See more” to read all.",
      "Press the reply icon to answer a comment; the box auto-fills @username (mention).",
      "You can also reply to a reply — it stays in the same thread with the @mention.",
      "Edit ✏️ and delete 🗑 appear only on YOUR own comments/replies.",
    ],
  },
  {
    icon: <FaShare />,
    title: "Like, Bookmark, Share",
    steps: [
      "Like: tap the thumbs icon — it turns blue and the count updates instantly.",
      "Bookmark: tap the ribbon icon (turns amber) → find it later in the Bookmarks page.",
      "Share: tap Share, optionally write a caption, press Share. Note: sharing allows ONE share per user per post.",
    ],
  },
  {
    icon: <FaUserPlus />,
    title: "Follow & profiles",
    steps: [
      "Click any name/photo to open that user's profile.",
      "Press Follow / Unfollow — the button updates instantly.",
      "“Who to follow” suggestions are on the right side of Home (desktop).",
      "Your Profile page has tabs: My Posts / Settings / Privacy & Password.",
    ],
  },
  {
    icon: <FaBell />,
    title: "Notifications",
    steps: [
      "The bell in the navbar shows the unread count in a red badge.",
      "Open it to see who liked / commented / followed / mentioned you.",
      "Click a notification to jump to the related post.",
      "Use the ✓ button on one item, or “mark all as read” for everything.",
    ],
  },
  {
    icon: <FaCamera />,
    title: "Photo & password",
    steps: [
      "Profile → click your avatar → the change-photo form opens → choose + upload.",
      "Uploading a new photo also auto-posts “updated profile picture.” to your feed.",
      "Privacy & Password tab → enter old + new password (8+ chars, A-Z, a-z, 0-9, symbol).",
    ],
  },
  {
    icon: <FaLock />,
    title: " limits (good to know)",
    steps: [
      "One share per user per post (“Post already shared” error otherwise).",
      "Replies are one level only — answering a reply posts into the same thread.",
      "Comment count on Home = top-level comments; the details page adds replies.",
      "There is NO forgot-password endpoint — keep your password safe!",
    ],
  },
  {
    icon: <FaImage />,
    title: "Editing & Images",
    steps: [
      "Edit a post/comment: Use the ⋮ menu (or ✏️ on comments) → Edit. The new text/image appears instantly for you and for all users.",
      "View images: Double-click any image in a post or comment to open it full-screen.",
      "In full-screen view: Click the X to close, or the 👍 button to react.",
    ],
  },
  {
    icon: <FaMoon />,
    title: "Dark mode & language",
    steps: [
      "Navbar: tap the 🌙 / ☀️ button to flip dark/light — navbar, cards and menus all follow instantly.",
      "Profile → Settings → Language: choose from 7 languages (English, العربية, Español, 中文, Русский, Deutsch, 日本語).",
      "Picking العربية flips the whole layout to RTL automatically; other languages stay LTR.",
      "Theme + language are saved in your browser — refresh keeps both.",
      "The soft background blobs drift slowly and move with your scroll (disabled if your system prefers reduced motion).",
    ],
  },
];

export default function Guide() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<number | null>(0);

  /**
   * Translate with fallback:
   *  - if the key exists in the current language → use it
   *  - otherwise → use the English text from GUIDE
   */
  const tr = (key: string, fallback: string) => {
    const value = t(key);
    return value === key ? fallback : value;
  };

  // Build a translated copy of GUIDE (original array is never modified)
  const items: GuideItem[] = GUIDE.map((g, i) => ({
    ...g,
    title: tr(`guide.${i}.title`, g.title),
    steps: g.steps.map((s, idx) => tr(`guide.${i}.step.${idx}`, s)),
  }));

  const q = search.trim().toLowerCase();
  const filtered = items.filter(
    (g) =>
      g.title.toLowerCase().includes(q) ||
      g.steps.some((s) => s.toLowerCase().includes(q)),
  );

  return (
    <>
      <title>{t("guide")}</title>
      <div className="w-full md:w-150 mx-auto my-8 px-4 md:px-0">
        {/* header */}
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3 mb-2">
          <FaBookOpen className="text-indigo-600" /> {t("guideTitle")}
        </h1>
        <p className="text-slate-500 text-sm mb-4">{t("guideDesc")}</p>

        {/* search */}
        <div className="relative mb-4">
          <FaSearch className="absolute top-[50%] start-3 translate-y-[-50%] text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("guideSearch")}
            className="w-full rounded-lg border border-slate-300 p-2.5 ps-9 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        {/* accordion */}
        <div className="flex flex-col gap-2">
          {filtered.length === 0 && (
            <p className="text-slate-500 text-sm text-center py-6">
              {t("guideNoResults")} “{search}”
            </p>
          )}
          {filtered.map((g, i) => {
            const isOpen = open === i;
            return (
              <div
                key={g.title}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex justify-between items-center gap-2 p-3 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="flex items-center gap-3 font-bold text-sm md:text-base">
                    <span className="text-indigo-600 text-lg">{g.icon}</span>
                    {g.title}
                  </span>
                  <FaChevronDown
                    className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <ul className="px-4 pb-4 flex flex-col gap-2 text-sm text-slate-600">
                    {g.steps.map((s, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="font-bold text-indigo-600 shrink-0">
                          {idx + 1}.
                        </span>
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
