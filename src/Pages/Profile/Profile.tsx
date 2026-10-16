import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import type { UserTypeProfile } from "../../Types/Profile.Type";

import Post from "../../Components/Post/Post";
import type { PostType } from "../../Types/Post.type";
import UploadPhoto from "../../Components/UploadPhoto/UploadPhoto";
import ChangePassword from "../../Components/ChangePassword/ChangePassword";
import FollowingList from "../../Components/FollowingList/FollowingList";
import WhoLists from "../../Components/WhoLists/WhoLists";
import {
  FaCamera,
  FaCog,
  FaGlobe,
  FaLock,
  FaRegNewspaper,
} from "react-icons/fa";
import { useLanguage, type Lang } from "../../Context/LanguageContext";

type Tab = "posts" | "settings" | "security";
const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  ar: "العربية",
  es: "Español",
  zh: "中文",
  ru: "Русский",
  de: "Deutsch",
  ja: "日本語", // ✅ now the button appears
};
export default function Profile() {
  // ✅ NEW: open/close the change-photo form when clicking the avatar
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  // ✅ NEW: profile tabs
  const [tab, setTab] = useState<Tab>("posts");

  function getMyProfile() {
    return axios.get(`https://route-posts.routemisr.com/users/profile-data`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }
  const { data, isLoading, isError } = useQuery({
    queryKey: ["getMyProfile"],
    queryFn: getMyProfile,
  });
  const user: UserTypeProfile = data?.data.data.user;

  function getMyPosts() {
    return axios.get(
      `https://route-posts.routemisr.com/users/${user._id}/posts`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }
  const { data: postUserData } = useQuery({
    queryKey: ["getUserPosts"],
    queryFn: getMyPosts,
    enabled: !isLoading && !isError && !!data,
  });

  // ✅ tab button style (same pill style as WhoLists tabs = consistent design)
  const tabCls = (active: boolean) =>
    `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold cursor-pointer transition-colors ${
      active
        ? "bg-indigo-600 text-white shadow-sm"
        : "bg-white text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <>
      <title>profile</title>

      {/* ---------- profile card ---------- */}
      <div className="w-full md:w-150 mx-auto p-4 rounded-lg bg-slate-200 my-4">
        {/* ✅ FIX: the avatar is now a BUTTON → click = show/hide change-photo form */}
        <div
          onClick={() => setIsUploadOpen(!isUploadOpen)}
          title="change profile photo"
          className="relative w-20 h-20 mx-auto group cursor-pointer"
        >
          <img
            src={user?.photo}
            className="w-20 h-20 rounded-full border-2 border-white object-cover"
            alt=""
          />
          {/* ✅ hover overlay with camera icon (professional touch) */}
          <span className="absolute inset-0 rounded-full bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xl">
            <FaCamera />
          </span>
        </div>
        <p className="text-xs text-slate-500 text-center mt-1">
          click your photo to change it
        </p>

        {/* ✅ FIX: upload form appears ONLY when the photo is clicked */}
        {isUploadOpen && <UploadPhoto onClose={() => setIsUploadOpen(false)} />}

        <div className="flex flex-col justify-center items-center my-2 text-center px-2 wrap-break-word">
          <p>
            <span className="font-bold">UserName: </span>
            {user?.username}
          </p>
          <p>
            <span className="font-bold">Name: </span>
            {user?.name}
          </p>
          <p>
            <span className="font-bold">Gender: </span>
            {user?.gender}
          </p>
          <p>
            <span className="font-bold">Email: </span>
            {user?.email}
          </p>
          <p>
            <span className="font-bold">Birthday: </span>
            {user?.dateOfBirth.split("T")[0]}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full md:w-150 mx-auto flex flex-wrap justify-center gap-2 my-4">
        <button
          onClick={() => setTab("posts")}
          className={tabCls(tab === "posts")}
        >
          <FaRegNewspaper /> {t("myPosts")}
        </button>
        <button
          onClick={() => setTab("security")}
          className={tabCls(tab === "security")}
        >
          <FaLock /> {t("privacy")}
        </button>
        {/* ... */}
        <button
          onClick={() => setTab("settings")}
          className={tabCls(tab === "settings")}
        >
          <FaCog /> {t("settings")}
        </button>
      </div>
      {/* ---------- TAB: MY POSTS ---------- */}
      {tab === "posts" &&
        postUserData?.data.data.posts.map((currentpost: PostType) => (
          <Post post={currentpost} key={currentpost._id} />
        ))}

      {/* SETTINGS TAB */}
      {tab === "settings" && (
        <div className="w-full md:w-150 mx-auto bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm my-4">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
            <FaGlobe /> {t("language")}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`p-3 rounded-lg font-bold text-sm transition-all cursor-pointer ${
                  lang === l
                    ? "bg-indigo-600 text-white shadow-md scale-105"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                {LANG_LABELS[l]}
              </button>
            ))}
          </div>

          {/* Your existing FollowingList and WhoLists go here */}
          <FollowingList followingIds={user?.following ?? []} />
          <WhoLists
            userId={user?._id}
            followers={user?.followers ?? []}
            posts={postUserData?.data.data.posts ?? []}
            myFollowingIds={user?.following ?? []}
          />
        </div>
      )}
      {/* ---------- TAB: PRIVACY & PASSWORD ---------- */}
      {tab === "security" && <ChangePassword />}
    </>
  );
}
