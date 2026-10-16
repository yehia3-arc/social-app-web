import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ImSpinner2 } from "react-icons/im";
import Loader from "../../Components/Loader/Loader";
import Post from "../../Components/Post/Post";
import type { PostType } from "../../Types/Post.type";
import { AuthContext } from "../../Context/AuthContext";
import { RiUserFollowFill } from "react-icons/ri";
import WhoLists from "../../Components/WhoLists/WhoLists";
export default function UserProfile() {
  const { userId } = useParams();
  const { userId: loginUserId } = useContext(AuthContext);
  const query = useQueryClient();

  // ✅ local follow state (null = not decided yet → use server value)
  const [followed, setFollowed] = useState<boolean | null>(null);

  useEffect(() => {
    setFollowed(null);
  }, [userId]);

  function auth() {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };
  }
  function getUserProfile() {
    return axios.get(
      `https://route-posts.routemisr.com/users/${userId}/profile`,
      auth(),
    );
  }
  function getUserPosts() {
    return axios.get(
      `https://route-posts.routemisr.com/users/${userId}/posts`,
      auth(),
    );
  }
  function followUnfollow() {
    return axios.put(
      `https://route-posts.routemisr.com/users/${userId}/follow`,
      {},
      auth(),
    );
  }

  const {
    data: profileData,
    isLoading: pLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getUserProfile", userId],
    queryFn: getUserProfile,
    enabled: !!userId,
  });
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["getUserPosts", userId],
    queryFn: getUserPosts,
    enabled: !!userId,
  });

  const user = profileData?.data?.data?.user ?? profileData?.data?.data;
  const posts: PostType[] = postsData?.data?.data?.posts ?? [];

  // ✅ robust: followers may be ids OR objects
  const serverIsFollowing =
    user?.followers?.some((f: any) => (f?._id ?? f) === loginUserId) ?? false;

  // local flip wins (instant), otherwise server value
  const isFollowing = followed ?? serverIsFollowing;

  const { mutate: followMutate, isPending: followPending } = useMutation({
    mutationFn: followUnfollow,
    onMutate: () => setFollowed(!isFollowing), // ⚡ instant label change
    onError: () => setFollowed(isFollowing), // rollback if API fails
    onSuccess: (res) => toast.success(res.data.message),
    onSettled: () => {
      query.invalidateQueries({ queryKey: ["getUserProfile", userId] });
      query.invalidateQueries({ queryKey: ["getFollowSuggestions"] });
      query.invalidateQueries({ queryKey: ["getMyProfile"] });
      query.invalidateQueries({ queryKey: ["getFollowingList"] });
    },
  });

  if (pLoading || postsLoading) return <Loader />;
  if (isError) {
    return (
      <p className="font-bold bg-red-500 text-white absolute top-[50%] left-[50%] text-2xl">
        {error.message}
      </p>
    );
  }

  const isMe = user?._id === loginUserId;

  return (
    <div className="my-8">
      {/* ---------- profile card ---------- */}

      <div className="w-full md:w-150 mx-auto bg-white p-4 md:p-6 rounded-lg flex flex-col md:flex-row gap-4 md:gap-6 items-center text-center md:text-start">
        <img
          src={user?.photo}
          className="w-24 h-24 rounded-full border-4 border-slate-200"
          alt=""
        />
        <div className="flex-1 text-center md:text-start">
          <h1 className="text-2xl font-bold">{user?.name}</h1>
          <p className="text-slate-500">@{user?.username}</p>

          <div className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-start mt-3 font-semibold text-sm">
            <p>{user?.followersCount} Followers</p>
            <p>{user?.followingCount} Following</p>
            <p>{user?.postsCount ?? posts.length} Posts</p>
          </div>
        </div>

        {/* ✅ buttons: Follow  OR  [Following ✓] + [Unfollow] beside it */}

        {!isMe && (
          <div className="flex flex-col md:flex-row gap-2 items-center w-full md:w-auto mt-2 md:mt-0">
            {isFollowing && (
              <span className="bg-indigo-100 text-indigo-700 font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                following
                <RiUserFollowFill />
              </span>
            )}
            {isFollowing ? (
              <button
                disabled={followPending}
                onClick={() => followMutate()}
                className="bg-red-500 hover:bg-red-600 disabled:bg-slate-800 text-white font-bold px-4 py-2 rounded-lg cursor-pointer text-sm flex items-center gap-2"
              >
                {followPending ? <ImSpinner2 className="animate-spin" /> : null}
                Unfollow
              </button>
            ) : (
              <button
                disabled={followPending}
                onClick={() => followMutate()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 text-white font-bold px-6 py-2 rounded-lg cursor-pointer flex items-center gap-2"
              >
                {followPending ? <ImSpinner2 className="animate-spin" /> : null}
                Follow
              </button>
            )}
          </div>
        )}
      </div>

      {/* ✅ NEW: his followers / likes / shares */}
      <WhoLists
        userId={userId!}
        followers={user?.followers ?? []}
        posts={posts}
      />

      {/* ---------- his posts ---------- */}
      {posts.length === 0 ? (
        <p className="text-center text-slate-500 font-semibold my-8">
          no posts yet
        </p>
      ) : (
        posts.map((post) => (
          <Post key={post._id} post={post} isPostDetails={false} />
        ))
      )}
    </div>
  );
}
