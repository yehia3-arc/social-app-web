import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function FollowSuggestions() {
  const query = useQueryClient();
  const [followed, setFollowed] = useState<string[]>([]); // ✅ local toggle state

  function getFollowSuggestions() {
    return axios.get(
      `https://route-posts.routemisr.com/users/suggestions?limit=10`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }
  function followUnfollowUser(userId: string) {
    return axios.put(
      `https://route-posts.routemisr.com/users/${userId}/follow`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data, isLoading } = useQuery({
    queryKey: ["getFollowSuggestions"],
    queryFn: getFollowSuggestions,
  });
  const users = data?.data?.data?.users ?? data?.data?.data?.suggestions ?? [];

  const { mutate, isPending } = useMutation({
    mutationFn: followUnfollowUser,
    onSuccess: (res, userId) => {
      toast.success(res.data.message);
      // ✅ toggle button text instantly
      setFollowed((prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId)
          : [...prev, userId],
      );
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message ?? "follow failed"),
    onSettled: () =>
      query.invalidateQueries({ queryKey: ["getFollowSuggestions"] }),
  });

  if (isLoading)
    return <p className="text-slate-500 text-sm">loading suggestions...</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
      <p className="font-bold text-lg mb-3 px-1">Who to follow</p>

      {/* ✅ FIX: Horizontal scrollable row (flex row) like Facebook mobile */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {users.map((u: any) => {
          const isFollowed = followed.includes(u._id);
          return (
            <div
              key={u._id}
              className="min-w-37.5 max-w-37.5 bg-slate-50 p-3 rounded-xl flex flex-col items-center text-center gap-2 border border-slate-200 shrink-0"
            >
              <Link to={`/user/${u._id}`} className="block">
                <img
                  src={u.photo}
                  className="w-16 h-16 rounded-full border-2 border-white shadow-sm mx-auto object-cover"
                  alt=""
                />
              </Link>
              <div className="min-w-0 w-full">
                <Link to={`/user/${u._id}`}>
                  <p className="font-semibold text-sm truncate hover:text-indigo-600">
                    {u.name}
                  </p>
                </Link>
                <p className="text-xs text-slate-500 truncate">@{u.username}</p>
              </div>
              <button
                disabled={isPending}
                onClick={() => mutate(u._id)}
                className={`w-full text-xs font-bold py-1.5 rounded-lg cursor-pointer text-white transition-colors ${
                  isFollowed
                    ? "bg-slate-500 hover:bg-slate-600"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isFollowed ? "Following" : "Follow"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
