import { Link } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ImSpinner2 } from "react-icons/im";
import { useState } from "react";

export default function FollowingList({
  followingIds,
}: {
  followingIds: string[];
}) {
  const query = useQueryClient();
  // ✅ Track which specific user is currently being unfollowed
  const [unfollowingId, setUnfollowingId] = useState<string | null>(null);
  function auth() {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };
  }

  // ✅ API has no "following details" endpoint → fetch each id in parallel
  function getFollowingUsers() {
    return Promise.all(
      followingIds.map((id) =>
        axios
          .get(`https://route-posts.routemisr.com/users/${id}/profile`, auth())
          .then((res) => res.data?.data?.user ?? res.data?.data),
      ),
    );
  }

  const { data: users, isLoading } = useQuery({
    queryKey: ["getFollowingList", followingIds.join(",")],
    queryFn: getFollowingUsers,
    enabled: followingIds.length > 0,
  });

  function followUnfollow(userId: string) {
    return axios.put(
      `https://route-posts.routemisr.com/users/${userId}/follow`,
      {},
      auth(),
    );
  }

  const { mutate } = useMutation({
    mutationFn: followUnfollow,
    // ✅ When click starts, save THIS user's ID
    onMutate: (userId) => setUnfollowingId(userId),
    onSuccess: (res) => toast.success(res.data.message),
    // ✅ When finished, clear the ID
    onSettled: () => {
      setUnfollowingId(null);
      query.invalidateQueries({ queryKey: ["getMyProfile"] });
      query.invalidateQueries({ queryKey: ["getFollowingList"] });
      query.invalidateQueries({ queryKey: ["getFollowSuggestions"] });
    },
  });

  if (followingIds.length === 0) {
    return (
      <div className="w-150 mx-auto bg-white p-4 rounded-lg my-4">
        <p className="font-bold mb-2">Following (0)</p>
        <p className="text-slate-500 text-sm">
          you are not following anyone yet
        </p>
      </div>
    );
  }
  if (isLoading)
    return (
      <p className="text-slate-500 text-sm my-4 mx-auto">
        loading following list...
      </p>
    );

  return (
    <div className="w-full  mx-auto bg-white p-4 rounded-lg my-4 flex flex-col gap-3 px-4 md:px-0">
      <p className="font-bold">Following ({users?.length ?? 0})</p>
      {users?.map((u: any) => (
        <div key={u._id} className="flex items-center justify-between gap-2">
          <Link to={`/user/${u._id}`} className="flex items-center gap-2">
            <img
              src={u.photo}
              className="w-10 h-10 rounded-full border-2 border-white"
              alt=""
            />
            <div>
              <p className="font-semibold text-sm hover:text-indigo-600">
                {u.name}
              </p>
              <p className="text-xs text-slate-500">@{u.username}</p>
            </div>
          </Link>
          {/* ✅ Check if THIS specific user is the one being unfollowed */}
          {(() => {
            const isThisPending = unfollowingId === u._id;
            return (
              <button
                disabled={isThisPending}
                onClick={() => mutate(u._id)}
                className="bg-red-500 hover:bg-red-600 disabled:bg-slate-800 text-white text-sm font-bold px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-2"
              >
                {isThisPending ? <ImSpinner2 className="animate-spin" /> : null}
                Unfollow
              </button>
            );
          })()}
        </div>
      ))}
    </div>
  );
}
