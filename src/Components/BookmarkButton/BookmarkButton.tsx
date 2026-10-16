import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function BookmarkButton({
  postId,
  isBookmarked = false,
}: {
  postId: string;
  isBookmarked?: boolean;
}) {
  const query = useQueryClient();

  function bookmarkUnbookmarkPost() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/bookmark`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: bookmarkUnbookmarkPost,
    onSuccess: (res) => toast.success(res.data.message),
    onSettled: () => {
      // ✅ FIX: refresh the bookmarks list AND every feed that shows the amber icon,
      // so the list + icon update instantly wherever you clicked
      query.invalidateQueries({ queryKey: ["getBookmarks"] });
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      query.invalidateQueries({ queryKey: ["getUserPosts"] }); // prefix → covers ["getUserPosts", id] (profile pages)
      query.invalidateQueries({ queryKey: ["getSinglePost", postId] });
    },
  });

  return (
    <button
      disabled={isPending}
      onClick={() => mutate()}
      className="cursor-pointer text-xl"
    >
      {isBookmarked ? (
        <FaBookmark className="text-amber-500" />
      ) : (
        <FaRegBookmark />
      )}
    </button>
  );
}
