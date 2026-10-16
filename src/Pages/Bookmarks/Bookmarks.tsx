import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { FaBookmark } from "react-icons/fa";
import Loader from "../../Components/Loader/Loader";
import Post from "../../Components/Post/Post";
import type { PostType } from "../../Types/Post.type";

export default function Bookmarks() {
  function getBookmarks() {
    return axios.get(`https://route-posts.routemisr.com/users/bookmarks`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getBookmarks"],
    queryFn: getBookmarks,
    refetchOnMount: "always",
    gcTime: 0,
  });

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <p className="font-bold bg-red-500 text-white absolute top-[50%] left-[50%] text-2xl">
        {error.message}
      </p>
    );

  const posts: PostType[] =
    data?.data?.data?.posts ?? data?.data?.data?.bookmarks ?? [];

  return (
    <>
      <title>Bookmarks</title>
      <div className="my-8 px-4 md:px-0 flex items-center justify-center flex-col">
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
          <FaBookmark /> My Bookmarks
        </h1>
        {posts.length === 0 ? (
          <p className="text-slate-500 font-semibold">
            no bookmarked posts yet
          </p>
        ) : (
          posts.map((post) => (
            <Post key={post._id} post={post} isPostDetails={false} />
          ))
        )}
      </div>
    </>
  );
}
