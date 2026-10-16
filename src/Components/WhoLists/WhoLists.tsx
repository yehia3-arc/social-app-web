import { useState, type ReactElement } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaUsers, FaShare, FaUserPlus } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import { RiUserFollowFill } from "react-icons/ri";
import type { PostType } from "../../Types/Post.type";
import { ImSpinner2 } from "react-icons/im";
import { toast } from "react-hot-toast";

type Tab = "followers" | "likes" | "shares";

export default function WhoLists({
  userId,
  followers = [],
  posts = [],
  myFollowingIds = [], // ✅ NEW: list of IDs you follow
}: {
  userId: string;
  followers?: any[];
  posts?: PostType[];
  myFollowingIds?: string[]; // ✅ NEW
}) {
  const [tab, setTab] = useState<Tab>("followers");
  const query = useQueryClient();
  function auth() {
    return {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    };
  }

  // ✅ NEW: follow/unfollow mutation for the Follow button
  function followUnfollow(followUserId: string) {
    return axios.put(
      `https://route-posts.routemisr.com/users/${followUserId}/follow`,
      {},
      auth(),
    );
  }
  const { mutate: followMutate, isPending: followPending } = useMutation({
    mutationFn: followUnfollow,
    onSuccess: (res) => toast.success(res.data.message),
    onSettled: () => {
      query.invalidateQueries({ queryKey: ["getFollowersList", userId] });
      query.invalidateQueries({ queryKey: ["getMyProfile"] });
    },
  });

  /* ---------- normalize followers (id or object) ---------- */
  const followerIds: string[] = followers
    .map((f: any) => f?._id ?? f)
    .filter(Boolean);

  /* ---------- 1) WHO FOLLOWS (fetch each profile in parallel) ---------- */
  function getFollowersList() {
    return Promise.allSettled(
      followerIds
        .slice(0, 12)
        .map((id) =>
          axios
            .get(
              `https://route-posts.routemisr.com/users/${id}/profile`,
              auth(),
            )
            .then((r) => r.data?.data?.user ?? r.data?.data),
        ),
    ).then((res) =>
      res.filter((r) => r.status === "fulfilled").map((r: any) => r.value),
    );
  }
  const followersQ = useQuery({
    queryKey: ["getFollowersList", userId, followerIds.join(",")],
    queryFn: getFollowersList,
    enabled: tab === "followers" && followerIds.length > 0,
  });

  /* ---------- 2) WHO LIKED (from posts[].likes ids + count per user) ---------- */
  const likeCounts = new Map<string, number>();
  posts.forEach((p) =>
    (p.likes ?? []).forEach((id: string) =>
      likeCounts.set(id, (likeCounts.get(id) ?? 0) + 1),
    ),
  );
  const likerIds = [...likeCounts.keys()].slice(0, 12);
  function getLikersList() {
    return Promise.allSettled(
      likerIds.map((id) =>
        axios
          .get(`https://route-posts.routemisr.com/users/${id}/profile`, auth())
          .then((r) => r.data?.data?.user ?? r.data?.data),
      ),
    ).then((res) =>
      res.filter((r) => r.status === "fulfilled").map((r: any) => r.value),
    );
  }
  const likersQ = useQuery({
    queryKey: ["getLikersList", userId, likerIds.join(",")],
    queryFn: getLikersList,
    enabled: tab === "likes" && likerIds.length > 0,
  });

  /* ---------- 3) WHO SHARED (API has no endpoint → scan feed for share-copies of my posts) ---------- */
  function getSharesList() {
    return axios.get(
      `https://route-posts.routemisr.com/posts?limit=100`,
      auth(),
    );
  }
  const sharesQ = useQuery({
    queryKey: ["getSharesOf", userId],
    queryFn: getSharesList,
    enabled: tab === "shares",
    select: (res) =>
      (res.data?.data?.posts ?? []).filter(
        (p: any) =>
          p.isShare &&
          (p.sharedPost?.user?._id === userId || p.sharedPost?.user === userId),
      ),
  });

  /* ---------- design helpers ---------- */
  const tabCls = (active: boolean) =>
    `flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold cursor-pointer transition-colors ${
      active
        ? "bg-indigo-600 text-white shadow-sm"
        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
    }`;

  function SkeletonRows() {
    return (
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 rounded bg-slate-200" />
              <div className="h-2 w-1/4 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  function Empty({ icon, text }: { icon: ReactElement; text: string }) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-slate-400">
        <span className="text-3xl">{icon}</span>
        <p className="text-sm font-semibold">{text}</p>
      </div>
    );
  }

  function PersonRow({ u, right }: { u: any; right?: ReactElement }) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-lg p-2 hover:bg-slate-50 transition-colors min-w-0">
        <Link
          to={`/user/${u._id}`}
          className="flex items-center gap-3 min-w-0 flex-1"
        >
          <img
            src={u.photo}
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm shrink-0"
            alt=""
          />
          <div className="min-w-0">
            <p className="font-semibold text-sm hover:text-indigo-600 truncate">
              {u.name}
            </p>
            <p className="text-xs text-slate-500 truncate">@{u.username}</p>
          </div>
        </Link>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    );
  }

  return (
    <div className="w-full  mx-auto bg-indigo-100 rounded-xl shadow-sm p-4 my-4">
      {/* ---------- tabs ---------- */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 mb-3">
        <button
          onClick={() => setTab("followers")}
          className={tabCls(tab === "followers")}
        >
          <FaUsers /> Followers ({followerIds.length})
        </button>
        <button
          onClick={() => setTab("likes")}
          className={tabCls(tab === "likes")}
        >
          <AiFillLike /> Likes ({likerIds.length})
        </button>
        <button
          onClick={() => setTab("shares")}
          className={tabCls(tab === "shares")}
        >
          <FaShare /> Shares ({sharesQ.data?.length ?? 0})
        </button>
      </div>

      {/* ---------- FOLLOWERS ---------- */}
      {/* ---------- FOLLOWERS ---------- */}
      {tab === "followers" &&
        (followerIds.length === 0 ? (
          <Empty icon={<FaUsers />} text="no followers yet" />
        ) : followersQ.isLoading ? (
          <SkeletonRows />
        ) : (
          <div className="flex flex-col gap-1">
            {followersQ.data?.map((u: any) => {
              // ✅ Check if you follow this follower back
              const iFollowThem = myFollowingIds.includes(u._id);
              return (
                <PersonRow
                  key={u._id}
                  u={u}
                  right={
                    iFollowThem ? (
                      // ✅ Mutual follow → show badge
                      <span className="flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-600">
                        follows you <RiUserFollowFill />
                      </span>
                    ) : (
                      // ✅ They follow you, but you don't follow them → Follow button
                      <button
                        disabled={followPending}
                        onClick={() => followMutate(u._id)}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white text-xs font-bold px-3 py-1 rounded-full cursor-pointer flex items-center gap-1"
                      >
                        {followPending ? (
                          <ImSpinner2 className="animate-spin" />
                        ) : (
                          <FaUserPlus />
                        )}{" "}
                        Follow
                      </button>
                    )
                  }
                />
              );
            })}
          </div>
        ))}

      {/* ---------- LIKES ---------- */}
      {tab === "likes" &&
        (likerIds.length === 0 ? (
          <Empty icon={<AiFillLike />} text="no likes yet" />
        ) : likersQ.isLoading ? (
          <SkeletonRows />
        ) : (
          <div className="flex flex-col gap-1">
            {likersQ.data?.map((u: any) => (
              <PersonRow
                key={u._id}
                u={u}
                right={
                  <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600">
                    <AiFillLike /> {likeCounts.get(u._id)} post(s)
                  </span>
                }
              />
            ))}
          </div>
        ))}

      {/* ---------- SHARES ---------- */}
      {tab === "shares" &&
        (sharesQ.isLoading ? (
          <SkeletonRows />
        ) : (sharesQ.data?.length ?? 0) === 0 ? (
          <Empty icon={<FaShare />} text="no shares yet" />
        ) : (
          <div className="flex flex-col gap-1">
            {sharesQ.data?.map((p: any) => (
              <div
                key={p._id}
                className="flex items-center justify-between gap-2 rounded-lg p-2 hover:bg-slate-50 transition-colors"
              >
                <Link
                  to={`/user/${p.user?._id}`}
                  className="flex items-center gap-3"
                >
                  <img
                    src={p.user?.photo}
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                    alt=""
                  />
                  <div>
                    <p className="font-semibold text-sm hover:text-indigo-600">
                      {p.user?.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate max-w-45">
                      “{p.sharedPost?.body || "your post"}”
                    </p>
                  </div>
                </Link>
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
                  <FaShare /> shared
                </span>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
